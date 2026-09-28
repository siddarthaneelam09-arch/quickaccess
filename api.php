<?php
// QuickAccess - InfinityFree/PHP backend
// Replaces the FastAPI backend for shared hosting. Uses JSON metadata + filesystem storage.

declare(strict_types=1);

// Some shared hosts (InfinityFree included) leave display_errors ON by default.
// Any stray PHP notice/warning printed before our headers/binary output would
// corrupt JSON responses and downloaded files (a warning gets prepended to the
// file bytes). Log errors instead of printing them.
error_reporting(E_ALL);
ini_set('display_errors', '0');

const EXPIRY_SECONDS = 7200; // 2 hours
$BASE = __DIR__;
$DATA = $BASE . DIRECTORY_SEPARATOR . 'data';
$UPLOADS = $BASE . DIRECTORY_SEPARATOR . 'uploads';
if (!is_dir($DATA)) @mkdir($DATA, 0755, true);
if (!is_dir($UPLOADS)) @mkdir($UPLOADS, 0755, true);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function json_response($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
function fail(string $message, int $status = 400): void { json_response(['detail' => $message], $status); }
function normalize_code(string $code): string {
    return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', trim($code)) ?? '');
}
function room_path(string $code): string { global $DATA; return $DATA . '/' . $code . '.json'; }
function upload_dir(string $code): string { global $UPLOADS; return $UPLOADS . '/' . $code; }
function load_room(string $code): ?array {
    $code = normalize_code($code);
    if ($code === '') return null;
    $p = room_path($code);
    if (!is_file($p)) return null;
    $room = json_decode((string)file_get_contents($p), true);
    if (!is_array($room)) return null;
    if ((time() - (int)($room['last_accessed'] ?? $room['created_at'] ?? time())) > EXPIRY_SECONDS) {
        delete_room($code);
        return null;
    }
    $room['last_accessed'] = time();
    save_room($room);
    return $room;
}
function save_room(array $room): void {
    file_put_contents(room_path($room['code']), json_encode($room, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
}
function create_code(): string {
    for ($i = 0; $i < 100; $i++) {
        $code = (string)random_int(100000, 999999);
        if (!is_file(room_path($code))) return $code;
    }
    return strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
}
function new_room(string $code): array {
    $room = [
        'code' => $code,
        'created_at' => time(),
        'last_accessed' => time(),
        'pin' => null,
        'text_content' => null,
        'files' => []
    ];
    @mkdir(upload_dir($code), 0755, true);
    save_room($room);
    return $room;
}
function delete_room(string $code): bool {
    $code = normalize_code($code);
    $p = room_path($code);
    $deleted = false;
    if (is_file($p)) { @unlink($p); $deleted = true; }
    $dir = upload_dir($code);
    if (is_dir($dir)) {
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($it as $file) { $file->isDir() ? @rmdir($file->getPathname()) : @unlink($file->getPathname()); }
        @rmdir($dir);
        $deleted = true;
    }
    return $deleted;
}
function cleanup_expired(): void {
    global $DATA;
    foreach (glob($DATA . '/*.json') ?: [] as $p) {
        $room = json_decode((string)@file_get_contents($p), true);
        if (is_array($room) && time() - (int)($room['last_accessed'] ?? $room['created_at'] ?? time()) > EXPIRY_SECONDS) {
            delete_room((string)($room['code'] ?? basename($p, '.json')));
        }
    }
}
function safe_filename(string $name): string {
    $name = basename(str_replace('\\', '/', $name));
    $name = preg_replace('/[^A-Za-z0-9._()\- ]/u', '_', $name) ?? 'file';
    return trim($name) !== '' ? trim($name) : 'file';
}

function create_zip_from_files(array $entries, string $destination): bool {
    $fp = @fopen($destination, 'wb');
    if (!$fp) return false;
    $central = '';
    $offset = 0;
    foreach ($entries as $entry) {
        $path = (string)$entry['path'];
        $name = str_replace('\\', '/', (string)$entry['name']);
        if (!is_file($path) || !is_readable($path)) continue;
        $data = (string)file_get_contents($path);
        $nameBytes = $name;
        $crc = crc32($data);
        if ($crc < 0) $crc += 4294967296;
        $size = strlen($data);
        $time = filemtime($path) ?: time();
        $d = getdate($time);
        $dosTime = (($d['hours'] & 31) << 11) | (($d['minutes'] & 63) << 5) | (($d['seconds'] >> 1) & 31);
        $dosDate = ((max(1980, $d['year']) - 1980) << 9) | (($d['mon'] & 15) << 5) | ($d['mday'] & 31);
        $nameLen = strlen($nameBytes);
        $local = pack('VvvvvvVVVvv', 0x04034b50, 20, 0, 0, $dosTime, $dosDate, $crc, $size, $size, $nameLen, 0) . $nameBytes . $data;
        if (fwrite($fp, $local) === false) { fclose($fp); return false; }
        $central .= pack('VvvvvvvVVVvvvvvVV', 0x02014b50, 20, 20, 0, 0, $dosTime, $dosDate, $crc, $size, $size, $nameLen, 0, 0, 0, 0, 0, $offset) . $nameBytes;
        $offset += strlen($local);
    }
    $centralOffset = $offset;
    $centralSize = strlen($central);
    if ($centralSize > 0 && fwrite($fp, $central) === false) { fclose($fp); return false; }
    $count = substr_count($central, "PK\x01\x02");
    $eocd = pack('VvvvvVVv', 0x06054b50, 0, 0, $count, $count, $centralSize, $centralOffset, 0);
    if (fwrite($fp, $eocd) === false) { fclose($fp); return false; }
    fclose($fp);
    return true;
}

function room_view(array $room, bool $verified = false): array {
    $hasPin = !empty($room['pin']);
    $locked = $hasPin && !$verified;
    $files = [];
    if (!$locked) {
        foreach ($room['files'] as $f) {
            $files[] = [
                'id' => $f['id'], 'filename' => $f['filename'], 'size' => (int)$f['size'],
                'mime_type' => $f['mime_type'], 'uploaded_at' => $f['uploaded_at'],
                'extension' => pathinfo($f['filename'], PATHINFO_EXTENSION)
            ];
        }
    }
    $total = array_sum(array_map(fn($f) => (int)$f['size'], $room['files']));
    return [
        'code' => $room['code'],
        'formatted_code' => strlen($room['code']) === 6 ? substr($room['code'], 0, 3) . '-' . substr($room['code'], 3) : $room['code'],
        'created_at' => $room['created_at'], 'file_count' => count($room['files']), 'total_size' => $total,
        'is_protected' => $hasPin, 'has_pin' => $hasPin, 'is_locked' => $locked,
        'has_text' => !empty($room['text_content']), 'text_content' => $locked ? null : $room['text_content'],
        'files' => $files
    ];
}
function verify_room_pin(array $room, ?string $pin): bool {
    return empty($room['pin']) || ($pin !== null && trim($pin) === (string)$room['pin']);
}
function get_route(): string {
    return trim((string)($_GET['route'] ?? ''), '/');
}

cleanup_expired();
$route = get_route();
$method = $_SERVER['REQUEST_METHOD'];

if ($route === 'info' && $method === 'GET') {
    json_response([
        'primary_ip' => $_SERVER['HTTP_HOST'] ?? 'Hosted',
        'all_ips' => [], 'port' => 443,
        'active_rooms' => count(glob($DATA . '/*.json') ?: []),
        'lan_url' => ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? '')
    ]);
}

if ($route === 'generate-code' && $method === 'POST') {
    $code = create_code(); $room = new_room($code);
    json_response(['code' => $code, 'formatted_code' => substr($code,0,3).'-'.substr($code,3)]);
}

if (preg_match('#^room/([^/]+)$#', $route, $m)) {
    $code = normalize_code($m[1]);
    if ($method === 'GET') {
        $room = load_room($code);
        if (!$room) fail('Room code not found or expired', 404);
        $pin = isset($_GET['pin']) ? (string)$_GET['pin'] : null;
        if (!empty($room['pin']) && !verify_room_pin($room, $pin)) {
            // Frontend expects 403 for an incorrect PIN, and 200 locked for first access.
            if ($pin !== null && $pin !== '') fail('Invalid PIN', 403);
            json_response(room_view($room, false));
        }
        json_response(room_view($room, true));
    }
    if ($method === 'DELETE') {
        if (!delete_room($code)) fail('Room not found', 404);
        json_response(['status'=>'success','message'=>'Room closed and files deleted']);
    }
}

if ($route === 'upload' && $method === 'POST') {
    $code = isset($_POST['code']) && trim((string)$_POST['code']) !== '' ? normalize_code((string)$_POST['code']) : create_code();
    if ($code === '') fail('Invalid room code');
    $room = load_room($code);
    if (!$room) $room = new_room($code);
    if (!empty($_POST['pin'])) $room['pin'] = trim((string)$_POST['pin']);
    if (!empty($_POST['text_content'])) $room['text_content'] = trim((string)$_POST['text_content']);

    $uploaded = [];
    if (isset($_FILES['files'])) {
        $files = $_FILES['files'];
        $names = is_array($files['name']) ? $files['name'] : [$files['name']];
        foreach ($names as $i => $orig) {
            $err = is_array($files['error']) ? $files['error'][$i] : $files['error'];
            if ($err !== UPLOAD_ERR_OK) continue;
            $tmp = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $size = is_array($files['size']) ? (int)$files['size'][$i] : (int)$files['size'];
            $mime = is_array($files['type']) ? (string)$files['type'][$i] : (string)$files['type'];
            $filename = safe_filename((string)$orig);
            $dest = upload_dir($code) . '/' . $filename;
            $n = 1; $pi = pathinfo($filename); $stem = $pi['filename'] ?? 'file'; $ext = isset($pi['extension']) ? '.' . $pi['extension'] : '';
            while (file_exists($dest)) { $filename = $stem . '_' . $n++ . $ext; $dest = upload_dir($code) . '/' . $filename; }
            if (!@move_uploaded_file($tmp, $dest)) continue;
            // Cast to int, not just round(): round() returns a float, and PHP
            // renders large floats in scientific notation once they exceed the
            // host's 'precision' ini setting (e.g. "1.79E+12" instead of
            // "1790518835699"). That broken id then gets embedded in download
            // URLs and breaks downloads. Casting to int always prints as a
            // plain integer, regardless of the host's precision setting.
            $id = 'f_' . (count($room['files']) + 1) . '_' . (int) round(microtime(true) * 1000);
            $item = ['id'=>$id,'filename'=>$filename,'size'=>$size,'path'=>$dest,'mime_type'=>$mime ?: 'application/octet-stream','uploaded_at'=>time()];
            $room['files'][] = $item; $uploaded[] = $item;
        }
    }
    $room['last_accessed'] = time(); save_room($room);
    json_response(['status'=>'success','code'=>$code,'formatted_code'=>substr($code,0,3).'-'.substr($code,3),'uploaded_count'=>count($uploaded),'has_text'=>!empty($room['text_content']),'room'=>room_view($room,true)]);
}

if (preg_match('#^(download|preview)/([^/]+)/([^/]+)$#', $route, $m)) {
    $action = $m[1]; $code = normalize_code($m[2]); $id = $m[3]; $room = load_room($code);
    if (!$room) fail('Room code not found or expired', 404);
    $pin = isset($_GET['pin']) ? (string)$_GET['pin'] : null;
    if (!verify_room_pin($room, $pin)) fail('Invalid or missing PIN for this transfer', 401);
    $target = null; foreach ($room['files'] as $f) if ($f['id'] === $id) { $target = $f; break; }
    if (!$target || !is_file($target['path'])) fail('File not found', 404);
    $mime = $target['mime_type'] ?: 'application/octet-stream';
    $filename = $target['filename'];
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($target['path']));
    header('X-Content-Type-Options: nosniff');
    header('Content-Disposition: ' . ($action === 'download' ? 'attachment' : 'inline') . '; filename="' . addcslashes($filename, '"\\') . '"');
    readfile($target['path']); exit;
}

if (preg_match('#^download-zip/([^/]+)$#', $route, $m) && $method === 'GET') {
    $code = normalize_code($m[1]); $room = load_room($code);
    if (!$room || empty($room['files'])) fail('No files found in room', 404);
    $pin = isset($_GET['pin']) ? (string)$_GET['pin'] : null;
    if (!verify_room_pin($room, $pin)) fail('Invalid or missing PIN for this transfer', 401);
    $tmp = tempnam(sys_get_temp_dir(), 'qa_room_');
    $entries = [];
    foreach ($room['files'] as $f) if (is_file($f['path'])) $entries[] = ['path' => $f['path'], 'name' => $f['filename']];
    if (!$tmp || !create_zip_from_files($entries, $tmp)) fail('Could not create ZIP', 500);
    header('Content-Type: application/zip');
    header('Content-Length: ' . filesize($tmp));
    header('Content-Disposition: attachment; filename="QuickAccess_' . $code . '.zip"');
    readfile($tmp); @unlink($tmp); exit;
}

fail('API route not found', 404);
