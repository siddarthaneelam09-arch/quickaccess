// Local File & Text Sharing Controller for QuickAccess
window.Share = {
  stagedFiles: [],
  currentSenderCode: null,
  currentReceiverCode: null,
  currentReceiverPin: '',
  senderSocket: null,
  receiverSocket: null,
  previewModalInitialized: false,

  init() {
    this.initSender();
    this.initReceiver();
    this.initPreviewModal();
    this.checkUrlRoomParam();
  },

  // ================= SENDER SIDE =================
  initSender() {
    const dropzone = document.getElementById('senderDropzone');
    const fileInput = document.getElementById('senderFileInput');
    const clearStagedBtn = document.getElementById('clearStagedBtn');
    const sendAndGenerateBtn = document.getElementById('sendAndGenerateBtn');
    const copyRevealedBtn = document.getElementById('copyRevealedCodeBtn');
    const showRevealedQrBtn = document.getElementById('showRevealedQrBtn');
    const sendNewBatchBtn = document.getElementById('sendNewBatchBtn');
    const closeRoomBtn = document.getElementById('closeRoomBtn');

    // Mode Selector: Files vs Quick Text
    const modeFilesBtn = document.getElementById('shareModeFilesBtn');
    const modeTextBtn = document.getElementById('shareModeTextBtn');
    const fileView = document.getElementById('senderFileView');
    const textView = document.getElementById('senderTextView');

    if (modeFilesBtn && modeTextBtn) {
      modeFilesBtn.addEventListener('click', () => {
        modeFilesBtn.classList.add('active');
        modeTextBtn.classList.remove('active');
        if (fileView) fileView.style.display = 'block';
        if (textView) textView.style.display = 'none';
      });

      modeTextBtn.addEventListener('click', () => {
        modeTextBtn.classList.add('active');
        modeFilesBtn.classList.remove('active');
        if (textView) textView.style.display = 'block';
        if (fileView) fileView.style.display = 'none';
      });
    }

    // PIN Protection Toggle
    const pinToggle = document.getElementById('enablePinToggle');
    const pinWrap = document.getElementById('pinInputWrap');
    const pinInput = document.getElementById('senderPinInput');

    if (pinToggle && pinWrap) {
      pinToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          pinWrap.style.display = 'block';
          if (pinInput) pinInput.focus();
        } else {
          pinWrap.style.display = 'none';
          if (pinInput) pinInput.value = '';
        }
      });
    }

    // Drag & drop handlers
    if (dropzone) {
      ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          dropzone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          dropzone.classList.remove('drag-over');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const files = Array.from(e.dataTransfer.files);
        if (files && files.length > 0) {
          this.addStagedFiles(files);
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files && files.length > 0) {
          this.addStagedFiles(files);
        }
      });
    }

    if (clearStagedBtn) {
      clearStagedBtn.addEventListener('click', () => {
        this.stagedFiles = [];
        this.renderStagedFiles();
        App.toast('Cleared attached files', 'info');
      });
    }

    if (sendAndGenerateBtn) {
      sendAndGenerateBtn.addEventListener('click', () => {
        this.uploadPayload();
      });
    }

    if (copyRevealedBtn) {
      copyRevealedBtn.addEventListener('click', () => {
        if (!this.currentSenderCode) return;
        navigator.clipboard.writeText(this.currentSenderCode).then(() => {
          App.playChime('copy');
          App.toast(`Code ${this.currentSenderCode} copied to clipboard!`, 'success');
        });
      });
    }

    if (showRevealedQrBtn) {
      showRevealedQrBtn.addEventListener('click', () => {
        if (!this.currentSenderCode) return;
        const lanBase = App.networkInfo ? App.networkInfo.lan_url : window.location.origin;
        const roomUrl = `${lanBase}?room=${this.currentSenderCode}`;
        App.showQrModal(
          roomUrl,
          `Room ${this.currentSenderCode}`,
          'Scan with any phone or tablet to access these files immediately'
        );
      });
    }

    if (sendNewBatchBtn) {
      sendNewBatchBtn.addEventListener('click', () => {
        this.resetSenderToNew();
      });
    }

    if (closeRoomBtn) {
      closeRoomBtn.addEventListener('click', () => {
        this.closeSenderRoom();
      });
    }
  },

  addStagedFiles(files) {
    for (let i = 0; i < files.length; i++) {
      this.stagedFiles.push(files[i]);
    }
    this.renderStagedFiles();
    App.toast(`Attached ${files.length} file(s). Ready to generate code!`, 'success');
  },

  renderStagedFiles() {
    const stagedSection = document.getElementById('stagedSection');
    const stagedList = document.getElementById('stagedList');
    const countEl = document.getElementById('stagedCount');
    const sendBtn = document.getElementById('sendAndGenerateBtn');

    if (this.stagedFiles.length === 0) {
      if (stagedSection) stagedSection.style.display = 'none';
      if (sendBtn) {
        sendBtn.innerHTML = `<i data-lucide="zap"></i> Share & Generate 6-Digit Code`;
        window.safeIcons();
      }
      return;
    }

    if (stagedSection) stagedSection.style.display = 'block';
    if (countEl) countEl.textContent = this.stagedFiles.length;

    const totalBytes = this.stagedFiles.reduce((acc, f) => acc + f.size, 0);
    if (sendBtn) {
      sendBtn.innerHTML = `<i data-lucide="zap"></i> Share & Generate 6-Digit Code (${this.stagedFiles.length} files • ${App.formatBytes(totalBytes)})`;
    }

    if (stagedList) {
      stagedList.innerHTML = '';
      this.stagedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'staged-item';
        item.innerHTML = `
          <div class="staged-item-left">
            <div class="staged-file-icon"><i data-lucide="file"></i></div>
            <div>
              <div class="staged-file-name" title="${file.name}">${file.name}</div>
              <div class="staged-file-size">${App.formatBytes(file.size)}</div>
            </div>
          </div>
          <button class="remove-staged-btn" data-index="${index}" title="Remove file">
            <i data-lucide="x"></i>
          </button>
        `;
        stagedList.appendChild(item);
      });

      stagedList.querySelectorAll('.remove-staged-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'));
          this.stagedFiles.splice(idx, 1);
          this.renderStagedFiles();
        });
      });
    }

    window.safeIcons();
  },

  uploadPayload() {
    const textInput = document.getElementById('senderTextInput');
    const textContent = textInput ? textInput.value.trim() : '';
    const hasFiles = this.stagedFiles.length > 0;
    const hasText = textContent.length > 0;

    if (!hasFiles && !hasText) {
      App.toast('Please attach at least one file or type a quick note to share', 'error');
      return;
    }

    const pinToggle = document.getElementById('enablePinToggle');
    const pinInput = document.getElementById('senderPinInput');
    let pinVal = '';
    if (pinToggle && pinToggle.checked && pinInput) {
      pinVal = pinInput.value.trim();
      if (pinVal && (pinVal.length < 4 || !/^\d{4}$/.test(pinVal))) {
        App.toast('Please enter a valid 4-digit numeric PIN (or uncheck PIN protection)', 'error');
        return;
      }
    }

    const progressWrap = document.getElementById('uploadProgressWrap');
    const progressBar = document.getElementById('uploadProgressBar');
    const percentText = document.getElementById('uploadPercentText');
    const statusText = document.getElementById('uploadStatusText');
    const speedText = document.getElementById('uploadSpeedText');

    if (progressWrap) progressWrap.style.display = 'block';
    if (progressBar) progressBar.style.width = '0%';
    if (percentText) percentText.textContent = '0%';
    if (statusText) statusText.textContent = hasFiles ? `Uploading ${this.stagedFiles.length} file(s)...` : 'Publishing note...';

    const formData = new FormData();
    if (this.currentSenderCode) {
      formData.append('code', this.currentSenderCode);
    }
    if (hasText) {
      formData.append('text_content', textContent);
    }
    if (pinVal) {
      formData.append('pin', pinVal);
    }
    for (let i = 0; i < this.stagedFiles.length; i++) {
      formData.append('files[]', this.stagedFiles[i]);
    }

    const xhr = new XMLHttpRequest();
    const startTime = Date.now();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && progressBar && percentText) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = percent + '%';
        percentText.textContent = percent + '%';

        const elapsedSeconds = (Date.now() - startTime) / 1000;
        if (elapsedSeconds > 0.2 && speedText) {
          const speedBytesPerSec = e.loaded / elapsedSeconds;
          speedText.textContent = `${App.formatBytes(speedBytesPerSec)}/s`;
        }
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        if (statusText) statusText.textContent = 'Transfer Ready!';
        if (percentText) percentText.textContent = '100%';
        if (progressBar) progressBar.style.width = '100%';

        this.currentSenderCode = response.code;
        this.showGeneratedCode(
          response.code,
          response.formatted_code,
          response.room.files,
          response.room.text_content,
          response.room.has_pin,
          pinVal
        );

        App.toast(`Generated Code: ${response.formatted_code}!`, 'success');
        App.fireConfetti();

        // Clear staged queue
        this.stagedFiles = [];
        this.renderStagedFiles();
        if (progressWrap) progressWrap.style.display = 'none';

        // Connect WebSocket
        this.connectSenderWebSocket(response.code);

        // Update active rooms count
        App.initNetwork();
      } else {
        App.toast('Upload failed. Please try again.', 'error');
        if (progressWrap) progressWrap.style.display = 'none';
      }
    });

    xhr.addEventListener('error', () => {
      App.toast('Network error during transfer.', 'error');
      if (progressWrap) progressWrap.style.display = 'none';
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  },

  showGeneratedCode(code, formattedCode, files, textContent, hasPin, pinVal) {
    const uploadStep = document.getElementById('senderUploadStep');
    const codeSection = document.getElementById('generatedCodeSection');
    if (uploadStep) uploadStep.style.display = 'none';
    if (codeSection) codeSection.style.display = 'block';

    const revealedCode = document.getElementById('revealedCode');
    if (revealedCode) {
      revealedCode.textContent = formattedCode || `${code.slice(0, 3)} ${code.slice(3)}`;
    }

    // PIN Notice
    const pinNotice = document.getElementById('revealedPinNotice');
    const pinValEl = document.getElementById('revealedPinVal');
    if (pinNotice && pinValEl) {
      if (hasPin && pinVal) {
        pinValEl.textContent = pinVal;
        pinNotice.style.display = 'inline-block';
      } else {
        pinNotice.style.display = 'none';
      }
    }

    // Shared Text Preview on Sender Side
    const textPreview = document.getElementById('senderSharedTextPreview');
    if (textPreview) {
      if (textContent) {
        textPreview.innerHTML = `<strong><i data-lucide="clipboard-pen"></i> Attached Note:</strong><p>${this.escapeHtml(textContent)}</p>`;
        textPreview.style.display = 'block';
      } else {
        textPreview.style.display = 'none';
      }
    }

    this.renderSenderFiles(files);
  },

  // RENDER SENDER FILES (NO DOWNLOAD BUTTON ON SENDER SIDE AS REQUESTED)
  renderSenderFiles(files) {
    const list = document.getElementById('senderFileList');
    const count = document.getElementById('senderFileCount');

    if (!files || files.length === 0) {
      if (count) count.textContent = '0';
      if (list) list.innerHTML = '<p class="drop-subtext">No files currently attached (text only).</p>';
      return;
    }

    if (count) count.textContent = files.length;
    if (list) {
      list.innerHTML = '';
      files.forEach(f => {
        const item = document.createElement('div');
        item.className = 'sender-file-item';
        // Strictly NO download button! Only status tag: "Ready"
        item.innerHTML = `
          <div class="staged-item-left">
            <div class="staged-file-icon"><i data-lucide="file-check-2"></i></div>
            <div>
              <div class="staged-file-name" title="${f.filename}">${f.filename}</div>
              <div class="staged-file-size">${App.formatBytes(f.size)}</div>
            </div>
          </div>
          <span class="file-status-tag"><i data-lucide="check"></i> Ready</span>
        `;
        list.appendChild(item);
      });
    }

    window.safeIcons();
  },

  resetSenderToNew() {
    this.stagedFiles = [];
    this.currentSenderCode = null;

    const fileInput = document.getElementById('senderFileInput');
    if (fileInput) fileInput.value = '';

    const textInput = document.getElementById('senderTextInput');
    if (textInput) textInput.value = '';

    const pinToggle = document.getElementById('enablePinToggle');
    if (pinToggle) pinToggle.checked = false;

    const pinWrap = document.getElementById('pinInputWrap');
    if (pinWrap) pinWrap.style.display = 'none';

    const pinInput = document.getElementById('senderPinInput');
    if (pinInput) pinInput.value = '';

    const uploadStep = document.getElementById('senderUploadStep');
    if (uploadStep) uploadStep.style.display = 'block';

    const codeSection = document.getElementById('generatedCodeSection');
    if (codeSection) codeSection.style.display = 'none';

    const pinNotice = document.getElementById('revealedPinNotice');
    if (pinNotice) pinNotice.style.display = 'none';

    const textPreview = document.getElementById('senderSharedTextPreview');
    if (textPreview) textPreview.style.display = 'none';

    this.renderStagedFiles();
  },

  async closeSenderRoom() {
    if (!this.currentSenderCode) {
      this.resetSenderToNew();
      return;
    }
    try {
      await fetch(`/api/room/${this.currentSenderCode}`, { method: 'DELETE' });
      App.toast('Transfer session ended', 'info');
      this.resetSenderToNew();
      App.initNetwork();
    } catch (err) {
      console.error(err);
      this.resetSenderToNew();
    }
  },

  connectSenderWebSocket(code) {
    if (this.senderPollTimer) clearInterval(this.senderPollTimer);
    // InfinityFree/shared hosting does not provide WebSocket servers. Poll every 5s instead.
    this.senderPollTimer = setInterval(async () => {
      try {
        const res = await fetch(`/api/room/${encodeURIComponent(code)}`);
        if (!res.ok) return;
        const data = await res.json();
        this.renderSenderFiles(data.files || []);
      } catch (e) {}
    }, 5000);
  },

  // ================= RECEIVER SIDE =================
  initReceiver() {
    const fetchBtn = document.getElementById('fetchRoomBtn');
    const input = document.getElementById('receiverCodeInput');
    const zipBtn = document.getElementById('downloadAllZipBtn');
    const submitPinBtn = document.getElementById('submitReceiverPinBtn');
    const pinField = document.getElementById('receiverEnteredPin');

    if (fetchBtn) {
      fetchBtn.addEventListener('click', () => {
        const code = input ? input.value.trim() : '';
        if (code) {
          this.fetchRoomFiles(code);
        } else {
          App.toast('Please enter a 6-digit code', 'error');
        }
      });
    }

    if (input) {
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          fetchBtn.click();
        }
      });

      // Auto-insert hyphen for easy typing
      input.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
        if (val.length > 3) {
          val = val.slice(0, 3) + '-' + val.slice(3, 6);
        }
        e.target.value = val;
      });
    }

    // Submit receiver PIN
    if (submitPinBtn && pinField) {
      const submitPin = () => {
        const pin = pinField.value.trim();
        if (!pin) {
          App.toast('Please enter the 4-digit PIN', 'error');
          return;
        }
        const cleanCode = input ? input.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase() : '';
        if (cleanCode) {
          this.fetchRoomFiles(cleanCode, pin);
        }
      };

      submitPinBtn.addEventListener('click', submitPin);
      pinField.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') submitPin();
      });
    }

    // Download all as ZIP
    if (zipBtn) {
      zipBtn.addEventListener('click', () => {
        if (!this.currentReceiverCode) return;
        let zipUrl = `/api/download-zip/${encodeURIComponent(this.currentReceiverCode)}`;
        if (this.currentReceiverPin) {
          zipUrl += `?pin=${encodeURIComponent(this.currentReceiverPin)}`;
        }
        window.location.href = zipUrl;
        App.toast('Downloading all files as ZIP...', 'success');
        App.fireConfetti();
      });
    }
  },

  async fetchRoomFiles(code, pin = '') {
    const cleanCode = code.replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
    const pinPrompt = document.getElementById('receiverPinPrompt');
    const results = document.getElementById('receiverResults');
    const emptyState = document.getElementById('receiverEmptyState');

    try {
      let url = `/api/room/${cleanCode}`;
      if (pin) {
        url += `?pin=${encodeURIComponent(pin)}`;
      }

      const res = await fetch(url);
      if (res.status === 403) {
        if (pinPrompt) pinPrompt.style.display = 'block';
        if (results) results.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        App.toast('Incorrect 4-digit PIN. Please try again.', 'error');
        const pinField = document.getElementById('receiverEnteredPin');
        if (pinField) {
          pinField.value = '';
          pinField.focus();
        }
        return;
      }

      if (!res.ok) {
        App.toast('Room code not found or expired', 'error');
        return;
      }

      const data = await res.json();

      // Check if room is locked
      if (data.is_locked) {
        if (pinPrompt) pinPrompt.style.display = 'block';
        if (results) results.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        App.toast('This transfer is PIN-protected. Enter PIN to unlock.', 'info');
        const pinField = document.getElementById('receiverEnteredPin');
        if (pinField) pinField.focus();
        return;
      }

      // Unlocked successfully!
      if (pinPrompt) pinPrompt.style.display = 'none';
      this.currentReceiverCode = cleanCode;
      this.currentReceiverPin = pin;

      this.renderReceiverResults(data);
      this.connectReceiverWebSocket(cleanCode);

      App.playChime('receive');
      App.toast(`Connected to Room ${data.formatted_code}!`, 'success');
      App.fireConfetti();
    } catch (err) {
      App.toast('Could not connect to room', 'error');
    }
  },

  connectReceiverWebSocket(code) {
    if (this.receiverPollTimer) clearInterval(this.receiverPollTimer);
    // Polling keeps this compatible with normal PHP shared hosting.
    this.receiverPollTimer = setInterval(async () => {
      try {
        let url = `/api/room/${encodeURIComponent(code)}`;
        if (this.currentReceiverPin) url += `?pin=${encodeURIComponent(this.currentReceiverPin)}`;
        const res = await fetch(url);
        if (res.status === 404) {
          App.toast('Room was closed or expired.', 'info');
          clearInterval(this.receiverPollTimer);
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        if (data.is_locked) return;
        this.renderReceiverResults(data);
      } catch (e) {}
    }, 5000);
  },

  // RENDER RECEIVER RESULTS (WITH TEXT SNIPPET, MEDIA PREVIEW & DOWNLOAD)
  renderReceiverResults(room) {
    const emptyState = document.getElementById('receiverEmptyState');
    const results = document.getElementById('receiverResults');
    const title = document.getElementById('receiverRoomTitle');
    const meta = document.getElementById('receiverRoomMeta');
    const list = document.getElementById('receiverFileList');
    const textCard = document.getElementById('receiverTextCard');
    const textContentEl = document.getElementById('receiverTextContent');
    const copyTextBtn = document.getElementById('copySharedTextBtn');
    const zipBtn = document.getElementById('downloadAllZipBtn');

    if (emptyState) emptyState.style.display = 'none';
    if (results) results.style.display = 'block';

    if (title) title.textContent = `Room: ${room.formatted_code}`;
    if (meta) {
      const parts = [];
      if (room.file_count > 0) {
        parts.push(`${room.file_count} file(s) • ${App.formatBytes(room.total_size)}`);
      }
      if (room.has_text) {
        parts.push('Quick Note');
      }
      meta.textContent = parts.join(' | ') || 'Ready';
    }

    // Text Snippet Handling
    if (textCard && textContentEl) {
      if (room.has_text && room.text_content) {
        textCard.style.display = 'block';
        textContentEl.innerHTML = this.linkify(room.text_content);

        if (copyTextBtn) {
          copyTextBtn.onclick = () => {
            navigator.clipboard.writeText(room.text_content).then(() => {
              App.playChime('copy');
              App.toast('Shared note copied to clipboard!', 'success');
            });
          };
        }
      } else {
        textCard.style.display = 'none';
      }
    }

    // ZIP Button display
    if (zipBtn) {
      zipBtn.style.display = (room.files && room.files.length > 0) ? 'inline-flex' : 'none';
    }

    // File List
    if (list) {
      list.innerHTML = '';
      if (!room.files || room.files.length === 0) {
        if (!room.has_text) {
          list.innerHTML = '<p class="drop-subtext">No items in this transfer.</p>';
        }
      } else {
        room.files.forEach(f => {
          const item = document.createElement('div');
          item.className = 'receiver-file-item';

          const pinParam = this.currentReceiverPin ? `?pin=${encodeURIComponent(this.currentReceiverPin)}` : '';
          const downloadUrl = `/api/download/${encodeURIComponent(room.code)}/${encodeURIComponent(f.id)}${pinParam}`;

          // Detect file icon
          const iconName = this.getFileIcon(f.filename);

          item.innerHTML = `
            <div class="staged-item-left">
              <div class="staged-file-icon" style="background: #e0f2fe; color: #0284c7;">
                <i data-lucide="${iconName}"></i>
              </div>
              <div>
                <div class="staged-file-name" title="${f.filename}">${f.filename}</div>
                <div class="staged-file-size">${App.formatBytes(f.size)}</div>
              </div>
            </div>
            <div class="receiver-item-actions">
              <button class="btn-aesthetic-secondary btn-sm preview-file-btn" data-id="${f.id}">
                <i data-lucide="eye"></i> Preview
              </button>
              <a href="${downloadUrl}" class="btn-aesthetic-accent btn-sm" download>
                <i data-lucide="download"></i> Download
              </a>
            </div>
          `;
          list.appendChild(item);

          // Wire preview button
          const previewBtn = item.querySelector('.preview-file-btn');
          if (previewBtn) {
            previewBtn.addEventListener('click', () => {
              this.openPreview(room.code, f, this.currentReceiverPin);
            });
          }
        });
      }
    }

    window.safeIcons();
  },

  // ================= IN-BROWSER MEDIA PREVIEW LIGHTBOX =================
  initPreviewModal() {
    if (this.previewModalInitialized) return;
    this.previewModalInitialized = true;

    const modal = document.getElementById('previewModal');
    const closeBtn = document.getElementById('closePreviewModalBtn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        this.closePreview();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closePreview();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          this.closePreview();
        }
      });
    }
  },

  closePreview() {
    const modal = document.getElementById('previewModal');
    const body = document.getElementById('previewModalBody');
    if (body) {
      // Pause any audio/video playing
      const media = body.querySelector('audio, video');
      if (media) media.pause();
      body.innerHTML = '';
    }
    if (modal) modal.style.display = 'none';
  },

  async openPreview(code, file, pin = '') {
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewModalTitle');
    const meta = document.getElementById('previewModalMeta');
    const body = document.getElementById('previewModalBody');
    const downloadBtn = document.getElementById('previewModalDownloadBtn');

    if (!modal || !body) return;

    if (title) title.textContent = file.filename;
    if (meta) meta.textContent = `${App.formatBytes(file.size)} • ${file.mime_type || file.extension.toUpperCase()}`;

    const pinParam = pin ? `?pin=${encodeURIComponent(pin)}` : '';
    const downloadUrl = `/api/download/${encodeURIComponent(code)}/${encodeURIComponent(file.id)}${pinParam}`;
    const previewUrl = `/api/preview/${code}/${file.id}${pinParam}`;

    if (downloadBtn) {
      downloadBtn.setAttribute('href', downloadUrl);
    }

    const ext = (file.extension || '').toLowerCase().replace('.', '');
    const mime = (file.mime_type || '').toLowerCase();

    body.innerHTML = '<div class="preview-loading"><i data-lucide="loader-2" class="spin"></i> Loading preview...</div>';
    window.safeIcons();
    modal.style.display = 'flex';

    try {
      if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'ico'].includes(ext) || mime.startsWith('image/')) {
        body.innerHTML = `<img src="${previewUrl}" class="preview-media-img" alt="${file.filename}" />`;
      } else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext) || mime.startsWith('audio/')) {
        body.innerHTML = `
          <div class="preview-audio-wrap">
            <div class="audio-waveform-icon"><i data-lucide="music"></i></div>
            <audio controls autoplay class="preview-media-audio" src="${previewUrl}"></audio>
          </div>
        `;
      } else if (['mp4', 'webm', 'mov', 'mkv'].includes(ext) || mime.startsWith('video/')) {
        body.innerHTML = `<video controls autoplay class="preview-media-video" src="${previewUrl}"></video>`;
      } else if (ext === 'pdf' || mime === 'application/pdf') {
        body.innerHTML = `<iframe src="${previewUrl}" class="preview-media-frame"></iframe>`;
      } else if (['txt', 'md', 'py', 'js', 'html', 'css', 'json', 'csv', 'log', 'xml', 'yaml', 'yml'].includes(ext) || mime.startsWith('text/')) {
        const textRes = await fetch(previewUrl);
        if (textRes.ok) {
          const text = await textRes.text();
          body.innerHTML = `<pre class="preview-media-code"><code>${this.escapeHtml(text)}</code></pre>`;
        } else {
          throw new Error('Failed to load text preview');
        }
      } else {
        body.innerHTML = `
          <div class="preview-fallback">
            <div class="empty-bubble-icon"><i data-lucide="file-question"></i></div>
            <h4>No In-Browser Preview Available</h4>
            <p>Direct preview is not supported for .${ext} files, but you can download it to view.</p>
          </div>
        `;
      }
      window.safeIcons();
    } catch (err) {
      body.innerHTML = `
        <div class="preview-fallback">
          <div class="empty-bubble-icon"><i data-lucide="alert-triangle"></i></div>
          <h4>Preview Error</h4>
          <p>Could not render preview. You can still download the file.</p>
        </div>
      `;
      window.safeIcons();
    }
  },

  getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return 'image';
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext)) return 'music';
    if (['mp4', 'webm', 'mov', 'mkv'].includes(ext)) return 'video';
    if (ext === 'pdf') return 'file-text';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
    if (['txt', 'md', 'doc', 'docx'].includes(ext)) return 'file-text';
    if (['py', 'js', 'html', 'css', 'json'].includes(ext)) return 'code';
    return 'file';
  },

  // Check URL query param e.g. ?room=123456
  checkUrlRoomParam() {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      App.switchTab('shareTab');
      const input = document.getElementById('receiverCodeInput');
      if (input) {
        input.value = roomParam.length === 6 ? `${roomParam.slice(0, 3)}-${roomParam.slice(3)}` : roomParam;
        this.fetchRoomFiles(roomParam);
      }
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  linkify(text) {
    const escaped = this.escapeHtml(text);
    const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    return escaped.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" class="linkified-url">$1</a>');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Share.init();
});
