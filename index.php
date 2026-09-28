<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QuickAccess | High-Speed Local Sharing & Creative Toolkit</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Outfit:wght@500;700;800;900&display=swap" rel="stylesheet">
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@0.525.0"></script>
  <!-- jsPDF for Image to PDF -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <!-- PDF.js for PDF to JPG -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <!-- pdf-lib for PDF Merger -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
  <!-- PptxGenJS for AI PPT & PDF to PPTX -->
  <script src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js"></script>
  <!-- JSZip for batch archiving -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <!-- QRCode.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body data-theme="hub" data-mode="light">
  <!-- Ambient Luminous Mesh Backdrop -->
  <div class="mesh-bg" aria-hidden="true">
    <div class="mesh-shape shape-1"></div>
    <div class="mesh-shape shape-2"></div>
    <div class="mesh-shape shape-3"></div>
    <div class="mesh-shape shape-4"></div>
  </div>

  <div class="app-container">
    <!-- Streamlined Header (Date & Time Removed) -->
    <header class="aesthetic-header">
      <!-- Brand Group -->
      <div class="brand-section">
        <div class="brand-badge-icon">
          <i data-lucide="zap"></i>
        </div>
        <div class="brand-text">
          <h1 class="brand-title">Quick<span class="gradient-accent">Access</span></h1>
          <p class="brand-tagline">Local File Transfer • Creative Power Tools</p>
        </div>
      </div>

      <!-- Quick Tools Menu Selector Button -->
      <button class="tools-menu-pill-btn" id="toolsMenuBtn" title="Explore All Tools & Features">
        <i data-lucide="layout-grid"></i>
        <span>All Tools & Menu</span>
        <i data-lucide="chevron-down"></i>
      </button>

      <!-- Live Activity & Transfer Stats Pill -->
      <div class="activity-status-pill" id="headerActivityPill">
        <span class="pulse-indicator"></span>
        <span class="activity-status-text" id="headerActivityText">Ready • Local Network Active</span>
      </div>

      <!-- Header Tools: Sound FX, Dark/Light Mode, Wi-Fi IP & QR -->
      <div class="header-actions">
        <!-- Audio Chimes Toggle -->
        <button class="aesthetic-icon-btn" id="soundToggleBtn" title="Toggle Sound Chimes">
          <i data-lucide="volume-2" id="soundIconOn"></i>
          <i data-lucide="volume-x" id="soundIconOff" style="display: none;"></i>
        </button>

        <!-- Dark / Light Mode Switcher -->
        <button class="theme-toggle-capsule" id="modeToggleBtn" title="Toggle Dark / Light Mode">
          <div class="toggle-icon-wrap">
            <i data-lucide="sun" id="modeSunIcon"></i>
            <i data-lucide="moon" id="modeMoonIcon" style="display: none;"></i>
          </div>
          <span class="toggle-text" id="modeLabelText">Light</span>
        </button>

        <!-- Wi-Fi Network Pill -->
        <div class="wifi-pill" id="lanPill" title="Devices on your Wi-Fi can connect here">
          <span class="wifi-dot"></span>
          <span id="lanIpText">Wi-Fi Connecting...</span>
        </div>

        <!-- QR Code Modal Button -->
        <button class="aesthetic-icon-btn" id="showLanQrBtn" title="Scan QR to open on phone">
          <i data-lucide="qr-code"></i>
        </button>

      </div>
    </header>

    <!-- Navigation Tabs (Each with a Distinct Aesthetic Theme) -->
    <nav class="aesthetic-nav">
      <button class="aesthetic-tab active tab-theme-hub" data-tab="hubTab" data-tab-theme="hub">
        <i data-lucide="layout-grid"></i>
        <span>Tools Hub</span>
        <span class="tab-chip">Menu</span>
      </button>
      <button class="aesthetic-tab tab-theme-share" data-tab="shareTab" data-tab-theme="share">
        <i data-lucide="share-2"></i>
        <span>Local Share</span>
        <span class="tab-chip">Fast</span>
      </button>
      <button class="aesthetic-tab tab-theme-aippt" data-tab="aiPptTab" data-tab-theme="aippt">
        <i data-lucide="sparkles"></i>
        <span>AI PPT Creator</span>
        <span class="tab-chip" style="background: rgba(192, 38, 211, 0.15); color: #c026d3; font-weight: 800;">AI</span>
      </button>
      <button class="aesthetic-tab tab-theme-pdftopptx" data-tab="pdfToPptxTab" data-tab-theme="pdftopptx">
        <i data-lucide="presentation"></i>
        <span>PDF to PPTX</span>
        <span class="tab-chip" style="background: rgba(37, 99, 235, 0.15); color: #2563eb; font-weight: 800;">New</span>
      </button>
      <button class="aesthetic-tab tab-theme-resizer" data-tab="resizerTab" data-tab-theme="resizer">
        <i data-lucide="image"></i>
        <span>Image Resizer</span>
        <span class="tab-chip">Instant</span>
      </button>
      <button class="aesthetic-tab tab-theme-imagetopdf" data-tab="pdfTab" data-tab-theme="imagetopdf">
        <i data-lucide="file-text"></i>
        <span>Image to PDF</span>
        <span class="tab-chip">Mint</span>
      </button>
      <button class="aesthetic-tab tab-theme-pdftojpg" data-tab="pdfToJpgTab" data-tab-theme="pdftojpg">
        <i data-lucide="file-image"></i>
        <span>PDF to JPG</span>
        <span class="tab-chip">Azure</span>
      </button>
      <button class="aesthetic-tab tab-theme-pdfmerge" data-tab="pdfMergeTab" data-tab-theme="pdfmerge">
        <i data-lucide="layers-3"></i>
        <span>PDF Merger</span>
        <span class="tab-chip">Combine</span>
      </button>
    </nav>

    <!-- Main Content Area -->
    <main class="aesthetic-content">

      <!-- ================= TAB 0: TOOLS HUB & MENU (THEME: MULTI-GRADIENT) ================= -->
      <section class="tab-pane active" id="hubTab" data-pane-theme="hub">
        <div class="hub-hero-banner">
          <div class="hub-hero-badge">
            <i data-lucide="sparkles"></i>
            <span>All-In-One Power Suite</span>
          </div>
          <h2 class="hub-hero-title">Select a <span class="gradient-accent">Tool & Power Up</span></h2>
          <p class="hub-hero-sub">Fast, secure, private, and browser-based productivity. Choose any option below to get started instantly.</p>
        </div>

        <div class="hub-tools-mosaic">
          <!-- Hub Card 1: Local Share -->
          <div class="hub-tool-card" data-switch-tab="shareTab">
            <div class="hub-card-top">
              <div class="hub-card-icon send-gradient"><i data-lucide="share-2"></i></div>
              <span class="hub-card-badge badge-fast">Super Fast</span>
            </div>
            <div class="hub-card-body">
              <h3>Local Share</h3>
              <p>Transfer files and drop quick notes/passwords across devices with 6-digit codes and optional 4-digit PIN security.</p>
            </div>
            <div class="hub-card-action">
              <span>Open Local Share</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>

          <!-- Hub Card 2: AI PPT Creator -->
          <div class="hub-tool-card" data-switch-tab="aiPptTab">
            <div class="hub-card-top">
              <div class="hub-card-icon" style="background: linear-gradient(135deg, #7c3aed, #c026d3); box-shadow: 0 8px 18px rgba(192, 38, 211, 0.4);"><i data-lucide="sparkles"></i></div>
              <span class="hub-card-badge badge-ai">AI Powered</span>
            </div>
            <div class="hub-card-body">
              <h3>AI PPT Creator</h3>
              <p>Generate presentation slide decks from any topic or prompt with themes, KPI metrics, pillars, and 1-click PowerPoint export.</p>
            </div>
            <div class="hub-card-action" style="color: #c026d3;">
              <span>Create AI Presentation</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>

          <!-- Hub Card 3: PDF to PPTX -->
          <div class="hub-tool-card" data-switch-tab="pdfToPptxTab">
            <div class="hub-card-top">
              <div class="hub-card-icon" style="background: linear-gradient(135deg, #2563eb, #d97706); box-shadow: 0 8px 18px rgba(37, 99, 235, 0.4);"><i data-lucide="presentation"></i></div>
              <span class="hub-card-badge badge-new">New Feature</span>
            </div>
            <div class="hub-card-body">
              <h3>PDF to .PPTX</h3>
              <p>Convert any multi-page PDF document into high-resolution PowerPoint slides with 16:9 widescreen layout.</p>
            </div>
            <div class="hub-card-action" style="color: #2563eb;">
              <span>Convert PDF to PPTX</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>

          <!-- Hub Card 4: Image Resizer -->
          <div class="hub-tool-card" data-switch-tab="resizerTab">
            <div class="hub-card-top">
              <div class="hub-card-icon resizer-gradient"><i data-lucide="crop"></i></div>
              <span class="hub-card-badge">Instant</span>
            </div>
            <div class="hub-card-body">
              <h3>Image Resizer</h3>
              <p>Scale, resize by pixels or percentage presets, compress quality, and export to JPG, PNG, or WEBP with live size comparison.</p>
            </div>
            <div class="hub-card-action" style="color: #d97706;">
              <span>Launch Resizer</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>

          <!-- Hub Card 5: Image to PDF -->
          <div class="hub-tool-card" data-switch-tab="pdfTab">
            <div class="hub-card-top">
              <div class="hub-card-icon pdf-gradient"><i data-lucide="file-text"></i></div>
              <span class="hub-card-badge">Private</span>
            </div>
            <div class="hub-card-body">
              <h3>Image to PDF</h3>
              <p>Combine multiple photos into an organized, high-resolution PDF document with custom margins and orientations.</p>
            </div>
            <div class="hub-card-action" style="color: #059669;">
              <span>Create PDF</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>

          <!-- Hub Card 6: PDF to JPG -->
          <div class="hub-tool-card" data-switch-tab="pdfToJpgTab">
            <div class="hub-card-top">
              <div class="hub-card-icon azure-gradient"><i data-lucide="file-image"></i></div>
              <span class="hub-card-badge">High-Res</span>
            </div>
            <div class="hub-card-body">
              <h3>PDF to JPG</h3>
              <p>Extract all pages from PDF documents into crisp high-resolution images. Download individual pages or all as ZIP.</p>
            </div>
            <div class="hub-card-action" style="color: #0284c7;">
              <span>Extract JPGs</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>

          <!-- Hub Card 7: PDF Merger -->
          <div class="hub-tool-card" data-switch-tab="pdfMergeTab">
            <div class="hub-card-top">
              <div class="hub-card-icon merge-gradient"><i data-lucide="layers-3"></i></div>
              <span class="hub-card-badge">Combine</span>
            </div>
            <div class="hub-card-body">
              <h3>PDF Merger</h3>
              <p>Merge multiple PDF files into one. Drag and reorder documents with up/down arrows and combine client-side.</p>
            </div>
            <div class="hub-card-action" style="color: #e11d48;">
              <span>Merge PDFs</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 1: LOCAL SHARE (THEME: NEON VIOLET & FUCHSIA) ================= -->
      <section class="tab-pane" id="shareTab" data-pane-theme="share">
        <div class="share-columns">
          
          <!-- SENDER CARD -->
          <div class="aesthetic-card sender-box">
            <div class="card-top">
              <div class="card-heading">
                <div class="card-icon-pill send-gradient"><i data-lucide="arrow-up-right"></i></div>
                <div>
                  <h2>Send Files & Text</h2>
                  <p>Attach files or paste links/notes — code generates after clicking share</p>
                </div>
              </div>
            </div>

            <!-- STEP 1: Content Setup (Files & Text Mode) -->
            <div id="senderUploadStep">
              <!-- Mode Tabs: Files vs Quick Text -->
              <div class="payload-mode-selector">
                <button class="payload-btn active" id="shareModeFilesBtn" type="button">
                  <i data-lucide="files"></i> Share Files
                </button>
                <button class="payload-btn" id="shareModeTextBtn" type="button">
                  <i data-lucide="clipboard-pen"></i> Quick Note / Link
                </button>
              </div>

              <!-- File Dropzone View -->
              <div id="senderFileView">
                <div class="aesthetic-dropzone dropzone-share" id="senderDropzone">
                  <input type="file" id="senderFileInput" multiple class="hidden-file-input" />
                  <div class="dropzone-inner">
                    <div class="drop-circle-icon icon-share">
                      <i data-lucide="upload-cloud"></i>
                    </div>
                    <h3>Drop files here to share</h3>
                    <p>or <span class="browse-link link-share">browse files</span> from your device</p>
                    <span class="drop-subtext">Any file format • Instant direct local network transfer</span>
                  </div>
                </div>

                <!-- Staged Files Queue -->
                <div class="staged-section" id="stagedSection" style="display: none;">
                  <div class="staged-header">
                    <h4>Attached Files (<span id="stagedCount">0</span>)</h4>
                    <button class="text-action-btn danger" id="clearStagedBtn">Clear All</button>
                  </div>
                  <div class="staged-list" id="stagedList"></div>
                </div>
              </div>

              <!-- Quick Text / Note / URL View -->
              <div id="senderTextView" style="display: none;">
                <div class="text-drop-box">
                  <label for="senderTextInput" class="text-drop-label">Paste or type text, link, credentials, or code snippet:</label>
                  <textarea id="senderTextInput" rows="5" class="aesthetic-textarea" placeholder="Paste link (https://...), Wi-Fi password, or notes to share with other devices..."></textarea>
                </div>
              </div>

              <!-- Optional Security PIN Protection -->
              <div class="security-pin-option">
                <label class="pin-toggle-label">
                  <input type="checkbox" id="enablePinToggle" />
                  <span>🔒 Protect transfer with a 4-digit PIN</span>
                </label>
                <div class="pin-input-wrap" id="pinInputWrap" style="display: none;">
                  <input type="text" id="senderPinInput" maxlength="4" placeholder="4-digit PIN (e.g. 1234)" class="pin-field" />
                  <span class="pin-hint">Receivers must enter this PIN to open the transfer</span>
                </div>
              </div>

              <!-- Share Trigger Button -->
              <div class="staged-actions" style="margin-top: 16px;">
                <button class="btn-aesthetic-primary btn-theme-share full-width" id="sendAndGenerateBtn">
                  <i data-lucide="zap"></i> Share & Generate 6-Digit Code
                </button>
              </div>

              <!-- Upload Progress Tracking -->
              <div class="aesthetic-progress" id="uploadProgressWrap" style="display: none;">
                <div class="progress-labels">
                  <span id="uploadStatusText">Sending...</span>
                  <span id="uploadPercentText" class="bold-percent">0%</span>
                </div>
                <div class="progress-bar-track">
                  <div class="progress-bar-glow share-glow" id="uploadProgressBar" style="width: 0%;"></div>
                </div>
                <div class="progress-sub-info">
                  <span id="uploadSpeedText">0 MB/s</span>
                  <span>Direct local transfer</span>
                </div>
              </div>
            </div>

            <!-- STEP 2: Code Display Banner (Appears ONLY AFTER clicking share) -->
            <div class="generated-code-result" id="generatedCodeSection" style="display: none;">
              <div class="success-header-badge">
                <i data-lucide="check-circle-2"></i> Ready for Receiving!
              </div>

              <div class="code-reveal-card">
                <span class="reveal-label">YOUR 6-DIGIT TRANSFER CODE</span>
                <div class="code-big-digits" id="revealedCode">--- ---</div>
                <div id="revealedPinNotice" class="revealed-pin-pill" style="display: none;">
                  🔒 Protected with PIN: <strong id="revealedPinVal">----</strong>
                </div>
                <p class="reveal-hint">Share this code with the receiver on your Wi-Fi</p>
                <div class="code-buttons-row">
                  <button class="btn-aesthetic-secondary" id="copyRevealedCodeBtn">
                    <i data-lucide="copy"></i> Copy Code
                  </button>
                  <button class="btn-aesthetic-secondary" id="showRevealedQrBtn">
                    <i data-lucide="qr-code"></i> Show QR
                  </button>
                  <button class="btn-aesthetic-accent" id="sendNewBatchBtn">
                    <i data-lucide="plus"></i> Share More
                  </button>
                </div>
              </div>

              <!-- Sended Files List (NO DOWNLOAD BUTTON ON SENDER SIDE) -->
              <div class="sender-file-overview">
                <div class="overview-header">
                  <h4>Shared Payload (<span id="senderFileCount">0</span>)</h4>
                  <button class="text-action-btn danger" id="closeRoomBtn">
                    <i data-lucide="x"></i> End Sharing
                  </button>
                </div>
                <div id="senderSharedTextPreview" class="shared-text-snippet" style="display: none;"></div>
                <div class="sender-files-list" id="senderFileList"></div>
              </div>
            </div>

          </div>

          <!-- RECEIVER CARD -->
          <div class="aesthetic-card receiver-box">
            <div class="card-top">
              <div class="card-heading">
                <div class="card-icon-pill receive-gradient"><i data-lucide="arrow-down-left"></i></div>
                <div>
                  <h2>Receive Files & Text</h2>
                  <p>Enter the 6-digit code to view, preview, and download</p>
                </div>
              </div>
            </div>

            <!-- Code Input Form -->
            <div class="code-entry-section">
              <label for="receiverCodeInput" class="entry-label">Enter 6-digit Room Code</label>
              <div class="entry-input-group">
                <input
                  type="text"
                  id="receiverCodeInput"
                  maxlength="7"
                  placeholder="e.g. 742-198"
                  autocomplete="off"
                  class="aesthetic-code-input"
                />
                <button class="btn-aesthetic-primary" id="fetchRoomBtn">
                  <i data-lucide="arrow-down-to-dot"></i> Get Files
                </button>
              </div>
              <span class="entry-hint">Codes are 6 digits — ask the sender to share theirs with you.</span>
            </div>

            <!-- Receiver PIN Prompt (If Room is Protected) -->
            <div class="receiver-pin-prompt" id="receiverPinPrompt" style="display: none;">
              <div class="pin-prompt-box">
                <div class="pin-prompt-header">
                  <i data-lucide="lock"></i>
                  <span>This transfer is PIN-protected</span>
                </div>
                <div class="pin-prompt-inputs">
                  <input type="password" id="receiverEnteredPin" maxlength="4" placeholder="Enter 4-digit PIN" class="pin-field" />
                  <button class="btn-aesthetic-primary btn-sm" id="submitReceiverPinBtn">Unlock</button>
                </div>
              </div>
            </div>

            <!-- Connected Room Results -->
            <div class="receiver-results" id="receiverResults" style="display: none;">
              <div class="connected-banner">
                <div class="banner-left">
                  <div class="pulsing-green-dot"></div>
                  <div>
                    <h3 id="receiverRoomTitle">Room Connected</h3>
                    <span class="banner-sub" id="receiverRoomMeta">0 items</span>
                  </div>
                </div>
                <button class="btn-aesthetic-accent btn-sm" id="downloadAllZipBtn">
                  <i data-lucide="archive"></i> Download All (ZIP)
                </button>
              </div>

              <!-- Text Snippet Display (If Text Was Shared) -->
              <div class="receiver-text-card" id="receiverTextCard" style="display: none;">
                <div class="text-card-top">
                  <span><i data-lucide="clipboard"></i> Shared Note / Link</span>
                  <button class="btn-aesthetic-secondary btn-sm" id="copySharedTextBtn">
                    <i data-lucide="copy"></i> Copy Text
                  </button>
                </div>
                <div class="text-card-body" id="receiverTextContent"></div>
              </div>

              <!-- Receiver File List (With Preview and Download) -->
              <div class="receiver-files-scroll" id="receiverFileList"></div>
            </div>

            <!-- Receiver Empty State -->
            <div class="receiver-empty-view" id="receiverEmptyState">
              <div class="empty-bubble-icon">
                <i data-lucide="inbox"></i>
              </div>
              <h4>Waiting for Code</h4>
              <p>Enter a 6-digit code above to receive files, preview media, or copy shared text notes.</p>
            </div>

          </div>

        </div>
      </section>

      <!-- ================= TAB: AI PPT CREATOR (THEME: COSMIC VIOLET & FUCHSIA) ================= -->
      <section class="tab-pane" id="aiPptTab" data-pane-theme="aippt">
        <div class="aesthetic-card" style="margin-bottom: 24px;">
          <div class="card-top" style="margin-bottom: 16px;">
            <div class="card-heading">
              <div class="card-icon-pill" style="background: linear-gradient(135deg, #7c3aed, #c026d3); box-shadow: 0 8px 18px rgba(192, 38, 211, 0.4);"><i data-lucide="sparkles"></i></div>
              <div>
                <h2>AI PowerPoint Deck Creator</h2>
                <p>Generate high-impact, professional presentations (.pptx) from any prompt with themes, KPI metrics & roadmap slides</p>
              </div>
            </div>
          </div>

          <!-- Quick Topic Suggestion Chips -->
          <div class="control-block">
            <span class="block-label">Popular Presentation Prompts</span>
            <div class="ai-prompts-bar">
              <button class="ai-prompt-chip" data-topic="Artificial Intelligence in Healthcare & Modern Medicine">🏥 AI in Healthcare</button>
              <button class="ai-prompt-chip" data-topic="Next-Gen Startup Investment Pitch Deck">🚀 Startup Pitch Deck</button>
              <button class="ai-prompt-chip" data-topic="Digital Growth Marketing & Omnichannel Brand Strategy">📈 Growth Marketing 2026</button>
              <button class="ai-prompt-chip" data-topic="Clean Energy Transition & Climate Tech Breakthroughs">🌱 Climate & Clean Tech</button>
              <button class="ai-prompt-chip" data-topic="Cybersecurity Mesh Architecture & Zero Trust Defense">🛡️ Cybersecurity Mesh</button>
            </div>
          </div>
        </div>

        <div class="ai-ppt-layout">
          <!-- Left Controls Card -->
          <div class="aesthetic-card ai-ppt-panel">
            <div class="resizer-body">
              <div class="control-block">
                <label class="block-label" for="aiPptTopicInput">Presentation Topic / Title</label>
                <input type="text" id="aiPptTopicInput" class="aesthetic-input" placeholder="e.g. Future of Renewable Energy" />
              </div>

              <div class="control-block">
                <label class="block-label" for="aiPptDescInput">Key Focus / Subtitle (Optional)</label>
                <textarea id="aiPptDescInput" rows="3" class="aesthetic-textarea" placeholder="Add specific bullet points, target audience, or context..."></textarea>
              </div>

              <div class="dimensions-flex">
                <div class="input-dim-box">
                  <span class="dim-sub">Deck Length</span>
                  <select id="aiPptSlideCount" class="aesthetic-select">
                    <option value="4">4 Slides (Briefing)</option>
                    <option value="6" selected>6 Slides (Standard)</option>
                    <option value="8">8 Slides (Full Deck)</option>
                  </select>
                </div>
                <div class="input-dim-box">
                  <span class="dim-sub">Presenter Name</span>
                  <input type="text" id="aiPptAuthorInput" class="aesthetic-input" value="QuickAccess AI" />
                </div>
              </div>

              <div class="control-block">
                <label class="block-label">Design Theme & Color Palette</label>
                <div class="ai-theme-chips-row">
                  <button class="ai-theme-chip active" data-theme="cyber">
                    <span class="theme-dot dot-cyber"></span>
                    <span>Cyber Violet</span>
                  </button>
                  <button class="ai-theme-chip" data-theme="navy">
                    <span class="theme-dot dot-navy"></span>
                    <span>Executive Navy</span>
                  </button>
                  <button class="ai-theme-chip" data-theme="emerald">
                    <span class="theme-dot dot-emerald"></span>
                    <span>Emerald Tech</span>
                  </button>
                  <button class="ai-theme-chip" data-theme="sunset">
                    <span class="theme-dot dot-sunset"></span>
                    <span>Sunset Amber</span>
                  </button>
                  <button class="ai-theme-chip" data-theme="minimal">
                    <span class="theme-dot dot-minimal"></span>
                    <span>Minimal Frost</span>
                  </button>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="aesthetic-progress" id="aiPptProgressWrap" style="display: none; margin-top: 10px;">
                <div class="progress-labels">
                  <span id="aiPptProgressText">Generating slides...</span>
                </div>
                <div class="progress-bar-track">
                  <div class="progress-bar-glow" id="aiPptProgressBar" style="width: 0%; background: linear-gradient(135deg, #7c3aed, #c026d3);"></div>
                </div>
              </div>

              <div class="resizer-action-btns" style="margin-top: 10px;">
                <button class="btn-aesthetic-primary full-width" id="aiPptGenerateBtn" style="background: linear-gradient(135deg, #7c3aed 0%, #c026d3 100%); box-shadow: 0 8px 20px -3px rgba(192, 38, 211, 0.45);">
                  <i data-lucide="sparkles"></i> Generate Presentation Deck
                </button>
              </div>
            </div>
          </div>

          <!-- Right Preview Card -->
          <div class="aesthetic-card ai-ppt-preview-box">
            <!-- Results View -->
            <div id="aiPptResultsPanel" style="display: none;">
              <div class="ai-slide-nav-bar" style="margin-top: 0; margin-bottom: 14px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <button class="mini-icon-btn" id="aiPptPrevSlideBtn" title="Previous Slide"><i data-lucide="chevron-left"></i></button>
                  <span id="aiPptSlideCounter" style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; color: #c026d3;">Slide 1 of 6</span>
                  <button class="mini-icon-btn" id="aiPptNextSlideBtn" title="Next Slide"><i data-lucide="chevron-right"></i></button>
                  <button class="mini-icon-btn" id="aiPptEditSlideBtn" title="Edit Slide Title"><i data-lucide="edit-3"></i></button>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="text-action-btn" id="aiPptResetBtn"><i data-lucide="rotate-ccw"></i> New Topic</button>
                  <button class="btn-aesthetic-primary btn-sm" id="aiPptDownloadBtn" style="background: linear-gradient(135deg, #7c3aed 0%, #c026d3 100%);">
                    <i data-lucide="download"></i> Download .PPTX
                  </button>
                </div>
              </div>

              <!-- 16:9 Interactive Slide Stage -->
              <div class="ai-ppt-stage-box" id="aiPptSlideStage"></div>

              <!-- Slide Thumbnails Row -->
              <div class="slide-thumbs-row" id="aiPptThumbsList"></div>
            </div>

            <!-- Empty State when nothing generated yet -->
            <div class="receiver-empty-view" id="aiPptEmptyState" style="padding: 60px 20px;">
              <div class="empty-bubble-icon" style="background: rgba(192, 38, 211, 0.15); color: #c026d3;">
                <i data-lucide="presentation"></i>
              </div>
              <h4>No Presentation Generated Yet</h4>
              <p>Type a topic on the left or click a prompt above, then click <strong>"Generate Presentation Deck"</strong> to preview and export your PowerPoint presentation.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB: PDF TO PPTX (THEME: ROYAL BLUE & GOLD) ================= -->
      <section class="tab-pane" id="pdfToPptxTab" data-pane-theme="pdftopptx">
        <div class="pdf-to-pptx-layout">
          <div class="aesthetic-card">
            <div class="card-top">
              <div class="card-heading">
                <div class="card-icon-pill" style="background: linear-gradient(135deg, #2563eb, #d97706); box-shadow: 0 8px 18px rgba(37, 99, 235, 0.4);"><i data-lucide="presentation"></i></div>
                <div>
                  <h2>PDF to PowerPoint (.PPTX) Converter</h2>
                  <p>Convert every page of your PDF into high-definition presentation slides ready for editing</p>
                </div>
              </div>
            </div>

            <div class="pdf-settings-grid">
              <div class="pdf-field">
                <label for="pdfToPptxLayout">Slide Aspect Ratio</label>
                <select id="pdfToPptxLayout" class="aesthetic-select">
                  <option value="16x9" selected>16:9 Widescreen (Modern Presentation)</option>
                  <option value="4x3">4:3 Standard (Classic Slides)</option>
                </select>
              </div>

              <div class="pdf-field" style="grid-column: span 2;">
                <label for="pdfToPptxFilename">PowerPoint File Name</label>
                <input type="text" id="pdfToPptxFilename" value="Converted_Presentation.pptx" class="aesthetic-input" />
              </div>

              <div class="pdf-field" style="display: flex; align-items: flex-end;">
                <button class="btn-aesthetic-primary full-width" id="executePdfToPptxBtn" disabled style="background: linear-gradient(135deg, #2563eb 0%, #d97706 100%); box-shadow: 0 8px 20px -3px rgba(37, 99, 235, 0.45);">
                  <i data-lucide="file-symlink"></i> Convert & Download .PPTX
                </button>
              </div>
            </div>

            <div class="aesthetic-progress" id="pdfToPptxProgressWrap" style="display: none; margin-bottom: 18px;">
              <div class="progress-labels">
                <span id="pdfToPptxStatusText">Rendering pages into PowerPoint slides...</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-glow" id="pdfToPptxProgressBar" style="width: 0%; background: linear-gradient(135deg, #2563eb, #d97706);"></div>
              </div>
            </div>

            <!-- PDF to PPTX Dropzone -->
            <div class="aesthetic-dropzone" id="pdfToPptxDropzone" style="border-color: rgba(37, 99, 235, 0.45);">
              <input type="file" id="pdfToPptxFileInput" accept="application/pdf" class="hidden-file-input" />
              <div class="dropzone-inner">
                <div class="drop-circle-icon" style="background: rgba(37, 99, 235, 0.15); color: #2563eb;">
                  <i data-lucide="file-up"></i>
                </div>
                <h3>Drop a PDF document here to convert to .PPTX</h3>
                <p>or <span class="browse-link" style="color: #2563eb;">browse PDF file</span></p>
                <span class="drop-subtext">Instant client-side conversion • Preserves full visual formatting into PowerPoint slides</span>
              </div>
            </div>

            <!-- Results View -->
            <div id="pdfToPptxResultsPanel" style="display: none; margin-top: 24px;">
              <div class="pdf-results-header">
                <div class="doc-badge-group">
                  <div class="doc-icon-tag" style="background: rgba(37, 99, 235, 0.15); color: #2563eb;"><i data-lucide="file-check"></i></div>
                  <div>
                    <h3 id="pdfToPptxDocTitle">Presentation.pdf</h3>
                    <span class="doc-meta-info" id="pdfToPptxDocMeta" style="color: #2563eb;">0 Slides Ready</span>
                  </div>
                </div>
                <div class="doc-actions-group">
                  <button class="btn-aesthetic-secondary" id="resetPdfToPptxBtn">
                    <i data-lucide="rotate-ccw"></i> New Document
                  </button>
                </div>
              </div>

              <div class="pdf-pptx-mosaic" id="pdfToPptxMosaic"></div>
            </div>

          </div>
        </div>
      </section>

      <!-- ================= TAB 2: IMAGE RESIZER (THEME: SUNSET AMBER / CORAL) ================= -->
      <section class="tab-pane" id="resizerTab" data-pane-theme="resizer">
        <div class="resizer-layout">
          <!-- Left Controls Card -->
          <div class="aesthetic-card resizer-panel">
            <div class="card-top">
              <div class="card-heading">
                <div class="card-icon-pill resizer-gradient"><i data-lucide="crop"></i></div>
                <div>
                  <h2>Image Resizer</h2>
                  <p>Resize, scale, and compress images right in your browser</p>
                </div>
              </div>
            </div>

            <div class="resizer-body">
              <div class="control-block">
                <label class="block-label">Quick Scale Presets</label>
                <div class="scale-chips-row">
                  <button class="scale-chip" data-scale="25">25%</button>
                  <button class="scale-chip" data-scale="50">50%</button>
                  <button class="scale-chip" data-scale="75">75%</button>
                  <button class="scale-chip active" data-scale="100">100%</button>
                  <button class="scale-chip" data-scale="150">150%</button>
                  <button class="scale-chip" data-scale="200">200%</button>
                </div>
              </div>

              <div class="control-block">
                <label class="block-label">Dimensions (Pixels)</label>
                <div class="dimensions-flex">
                  <div class="input-dim-box">
                    <span class="dim-sub">Width</span>
                    <input type="number" id="resizeWidth" min="1" max="12000" placeholder="Width" />
                  </div>
                  <button class="aspect-toggle-btn active" id="aspectLockBtn" title="Maintain Aspect Ratio">
                    <i data-lucide="link"></i>
                  </button>
                  <div class="input-dim-box">
                    <span class="dim-sub">Height</span>
                    <input type="number" id="resizeHeight" min="1" max="12000" placeholder="Height" />
                  </div>
                </div>
              </div>

              <div class="control-block">
                <div class="slider-title-row">
                  <label class="block-label">Quality Compression</label>
                  <span class="slider-percentage" id="qualityVal">90%</span>
                </div>
                <input type="range" id="resizeQuality" min="10" max="100" value="90" class="aesthetic-slider resizer-slider" />
              </div>

              <div class="control-block">
                <label class="block-label">Export Format</label>
                <div class="format-chips-group">
                  <label class="format-choice">
                    <input type="radio" name="exportFormat" value="image/jpeg" checked />
                    <span>JPEG</span>
                  </label>
                  <label class="format-choice">
                    <input type="radio" name="exportFormat" value="image/png" />
                    <span>PNG</span>
                  </label>
                  <label class="format-choice">
                    <input type="radio" name="exportFormat" value="image/webp" />
                    <span>WEBP</span>
                  </label>
                </div>
              </div>

              <div class="resizer-action-btns">
                <button class="btn-aesthetic-primary btn-theme-amber full-width" id="downloadResizedBtn" disabled>
                  <i data-lucide="download"></i> Download Resized Image
                </button>
                <button class="btn-aesthetic-secondary full-width" id="resetResizerBtn">
                  <i data-lucide="refresh-cw"></i> Choose Another Image
                </button>
              </div>
            </div>
          </div>

          <!-- Right Preview Card -->
          <div class="aesthetic-card preview-panel">
            <div class="aesthetic-dropzone dropzone-amber" id="resizerDropzone">
              <input type="file" id="resizerFileInput" accept="image/*" class="hidden-file-input" />
              <div class="dropzone-inner">
                <div class="drop-circle-icon icon-amber">
                  <i data-lucide="image-plus"></i>
                </div>
                <h3>Drop an image to resize</h3>
                <p>or <span class="browse-link link-amber">browse image file</span></p>
                <span class="drop-subtext">JPG, PNG, WEBP, GIF, SVG, BMP</span>
              </div>
            </div>

            <div class="image-preview-stage" id="resizerPreviewPanel" style="display: none;">
              <div class="stats-comparison-bar">
                <div class="stat-pill">
                  <span class="stat-tag">Original:</span>
                  <span class="stat-value" id="origDimStat">0 x 0</span>
                  <span class="stat-weight" id="origSizeStat">(0 KB)</span>
                </div>
                <div class="stat-arrow-icon"><i data-lucide="arrow-right"></i></div>
                <div class="stat-pill highlight-pill">
                  <span class="stat-tag">New:</span>
                  <span class="stat-value" id="newDimStat">0 x 0</span>
                  <span class="stat-weight" id="newSizeStat">(0 KB)</span>
                </div>
                <div class="diff-badge" id="sizeDiffBadge">-0%</div>
              </div>

              <div class="canvas-image-wrap">
                <img id="resizerPreviewImg" alt="Resized Image Preview" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 3: IMAGE TO PDF (THEME: BOTANICAL MINT / EMERALD) ================= -->
      <section class="tab-pane" id="pdfTab" data-pane-theme="imagetopdf">
        <div class="pdf-container">
          <div class="aesthetic-card pdf-controls-card">
            <div class="card-top">
              <div class="card-heading">
                <div class="card-icon-pill pdf-gradient"><i data-lucide="file-check"></i></div>
                <div>
                  <h2>Image to PDF Converter</h2>
                  <p>Combine multiple images into an organized, high-resolution PDF document</p>
                </div>
              </div>
            </div>

            <div class="pdf-settings-grid">
              <div class="pdf-field">
                <label for="pdfPageFormat">Page Format</label>
                <select id="pdfPageFormat" class="aesthetic-select">
                  <option value="a4" selected>A4 (210 x 297 mm)</option>
                  <option value="letter">US Letter (8.5 x 11 in)</option>
                  <option value="fit">Fit to Image Size</option>
                </select>
              </div>

              <div class="pdf-field">
                <label for="pdfOrientation">Page Orientation</label>
                <select id="pdfOrientation" class="aesthetic-select">
                  <option value="portrait" selected>Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="auto">Auto (Match Image)</option>
                </select>
              </div>

              <div class="pdf-field">
                <label for="pdfMargin">Margins</label>
                <select id="pdfMargin" class="aesthetic-select">
                  <option value="0">No Margin (0mm)</option>
                  <option value="5" selected>Compact (5mm)</option>
                  <option value="15">Standard (15mm)</option>
                </select>
              </div>

              <div class="pdf-field">
                <label for="pdfFileName">PDF File Name</label>
                <input type="text" id="pdfFileName" value="QuickAccess_Images.pdf" class="aesthetic-input" />
              </div>
            </div>

            <div class="pdf-footer-bar">
              <div class="pdf-counter-badge" id="pdfPageCount">0 Images Added</div>
              <div class="pdf-buttons-cluster">
                <button class="btn-aesthetic-secondary" id="addMorePdfImagesBtn">
                  <i data-lucide="plus"></i> Add Images
                </button>
                <button class="text-action-btn danger" id="clearPdfImagesBtn" style="display: none;">
                  <i data-lucide="trash-2"></i> Clear
                </button>
                <button class="btn-aesthetic-primary btn-theme-emerald" id="generatePdfBtn" disabled>
                  <i data-lucide="file-down"></i> Generate & Download PDF
                </button>
              </div>
            </div>
          </div>

          <!-- PDF Image Gallery -->
          <div class="aesthetic-card pdf-gallery-card">
            <div class="aesthetic-dropzone dropzone-emerald" id="pdfDropzone">
              <input type="file" id="pdfFileInput" multiple accept="image/*" class="hidden-file-input" />
              <div class="dropzone-inner">
                <div class="drop-circle-icon icon-emerald">
                  <i data-lucide="layers"></i>
                </div>
                <h3>Drop multiple images here to create a PDF</h3>
                <p>or <span class="browse-link link-emerald">select image files</span></p>
                <span class="drop-subtext">Drag to reorder pages • Instant client-side generation</span>
              </div>
            </div>

            <div class="pdf-pages-mosaic" id="pdfPagesGrid" style="display: none;"></div>
          </div>
        </div>
      </section>

      <!-- ================= TAB 4: PDF TO JPG (THEME: OCEAN AZURE / SAPPHIRE CYAN) ================= -->
      <section class="tab-pane" id="pdfToJpgTab" data-pane-theme="pdftojpg">
        <div class="pdf-to-jpg-layout">
          <div class="aesthetic-card pdf-to-jpg-panel">
            <div class="card-top">
              <div class="card-heading">
                <div class="card-icon-pill azure-gradient"><i data-lucide="file-image"></i></div>
                <div>
                  <h2>PDF to JPG / Image Converter</h2>
                  <p>Extract every page from your PDF into crisp, high-resolution images</p>
                </div>
              </div>
            </div>

            <div class="pdf-to-jpg-controls-grid">
              <div class="pdf-field">
                <label for="pdfRenderScale">Resolution / Scale</label>
                <select id="pdfRenderScale" class="aesthetic-select">
                  <option value="1.0">Standard (1x - Web / Fast)</option>
                  <option value="2.0" selected>High-Res (2x - 150 DPI)</option>
                  <option value="3.0">Ultra HD (3x - 300 DPI Print)</option>
                </select>
              </div>

              <div class="pdf-field">
                <label for="pdfExportImgFormat">Output Format</label>
                <select id="pdfExportImgFormat" class="aesthetic-select">
                  <option value="image/jpeg" selected>JPG (JPEG Image)</option>
                  <option value="image/png">PNG (Lossless Image)</option>
                </select>
              </div>

              <div class="pdf-field">
                <div class="slider-title-row">
                  <label for="pdfJpgQuality">JPG Quality</label>
                  <span class="slider-percentage" id="pdfJpgQualityVal">90%</span>
                </div>
                <input type="range" id="pdfJpgQuality" min="10" max="100" value="90" class="aesthetic-slider azure-slider" />
              </div>
            </div>

            <div class="aesthetic-progress" id="pdfToJpgProgressWrap" style="display: none;">
              <div class="progress-labels">
                <span id="pdfToJpgStatusText">Rendering pages...</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-glow azure-glow" id="pdfToJpgProgressBar" style="width: 0%;"></div>
              </div>
            </div>

            <div class="aesthetic-dropzone dropzone-azure" id="pdfToJpgDropzone">
              <input type="file" id="pdfToJpgFileInput" accept="application/pdf" class="hidden-file-input" />
              <div class="dropzone-inner">
                <div class="drop-circle-icon icon-azure">
                  <i data-lucide="file-symlink"></i>
                </div>
                <h3>Drop a PDF document here to convert to JPG</h3>
                <p>or <span class="browse-link link-azure">browse PDF file</span></p>
                <span class="drop-subtext">Instant client-side extraction • Download individual pages or all as ZIP</span>
              </div>
            </div>

            <div class="pdf-results-view" id="pdfToJpgResultsPanel" style="display: none;">
              <div class="pdf-results-header">
                <div class="doc-badge-group">
                  <div class="doc-icon-tag"><i data-lucide="file-check"></i></div>
                  <div>
                    <h3 id="pdfDocTitle">Document.pdf</h3>
                    <span class="doc-meta-info" id="pdfDocPagesCount">0 Pages</span>
                  </div>
                </div>
                <div class="doc-actions-group">
                  <button class="btn-aesthetic-secondary" id="resetPdfToJpgBtn">
                    <i data-lucide="rotate-ccw"></i> New PDF
                  </button>
                  <button class="btn-aesthetic-primary btn-theme-azure" id="downloadAllPdfPagesZipBtn">
                    <i data-lucide="archive"></i> Download All as ZIP
                  </button>
                </div>
              </div>

              <div class="pdf-extracted-mosaic" id="pdfToJpgPagesMosaic"></div>
            </div>

          </div>
        </div>
      </section>

      <!-- ================= TAB 5: PDF MERGER (THEME: CRIMSON & CORAL) ================= -->
      <section class="tab-pane" id="pdfMergeTab" data-pane-theme="pdfmerge">
        <div class="pdf-merge-layout">
          <div class="aesthetic-card pdf-merge-panel">
            <div class="card-top">
              <div class="card-heading">
                <div class="card-icon-pill merge-gradient"><i data-lucide="layers-3"></i></div>
                <div>
                  <h2>PDF Merger</h2>
                  <p>Combine multiple PDF documents into a single document in your browser</p>
                </div>
              </div>
            </div>

            <div class="pdf-merge-controls-bar">
              <div class="input-dim-box" style="flex: 2;">
                <span class="dim-sub">Merged PDF Filename</span>
                <input type="text" id="pdfMergeFilename" value="QuickAccess_Merged.pdf" class="aesthetic-input" />
              </div>
              <div class="merge-action-cluster">
                <button class="btn-aesthetic-secondary" id="addMorePdfMergeBtn">
                  <i data-lucide="plus"></i> Add More PDFs
                </button>
                <button class="text-action-btn danger" id="clearPdfMergeBtn" style="display: none;">
                  <i data-lucide="trash-2"></i> Clear
                </button>
                <button class="btn-aesthetic-primary btn-theme-merge" id="executeMergeBtn" disabled>
                  <i data-lucide="file-down"></i> Merge All PDFs & Download
                </button>
              </div>
            </div>

            <!-- Dropzone when no PDFs attached -->
            <div class="aesthetic-dropzone dropzone-merge" id="pdfMergeDropzone">
              <input type="file" id="pdfMergeFileInput" multiple accept="application/pdf" class="hidden-file-input" />
              <div class="dropzone-inner">
                <div class="drop-circle-icon icon-merge">
                  <i data-lucide="files"></i>
                </div>
                <h3>Drop multiple PDF documents here to merge</h3>
                <p>or <span class="browse-link link-merge">browse PDF files</span></p>
                <span class="drop-subtext">Drag to reorder documents • Instant 100% private client-side merge</span>
              </div>
            </div>

            <!-- Merge Document List / Queue Panel -->
            <div class="merge-queue-panel" id="pdfMergeQueuePanel" style="display: none;">
              <div class="merge-queue-header">
                <span class="badge-tag-pill" id="pdfMergeDocCount">0 Documents</span>
                <span class="badge-tag-sub" id="pdfMergeTotalPages">0 Pages</span>
              </div>
              <div class="merge-docs-list" id="pdfMergeList"></div>
            </div>

          </div>
        </div>
      </section>

    </main>

    <!-- Rich Multi-Column Aesthetic Footer -->
    <footer class="super-footer">
      <div class="footer-super-wrap">
        <!-- Col 1: Brand & Privacy Mission -->
        <div class="footer-col">
          <div class="footer-brand-title">
            Quick<span class="gradient-accent">Access</span>
          </div>
          <p>The high-speed, 100% private local file sharing & creative power suite. Built for effortless peer transfers, AI presentation creation, and multi-format document tools.</p>
          <div class="footer-privacy-badge">
            <i data-lucide="shield-check"></i>
            <span>100% Local Network • Zero Cloud Uploads</span>
          </div>
          <a href="mailto:Quickaccesslocal@gmail.com" class="footer-mail-link">
            <i data-lucide="mail"></i>
            <span>Quickaccesslocal@gmail.com</span>
          </a>
        </div>

        <!-- Col 2: Creative & AI Power Tools -->
        <div class="footer-col">
          <h4>Creative & AI Tools</h4>
          <ul class="footer-links-list">
            <li><button data-switch-tab="aiPptTab"><i data-lucide="sparkles"></i> AI PPT Deck Creator</button></li>
            <li><button data-switch-tab="pdfToPptxTab"><i data-lucide="presentation"></i> PDF to .PPTX Converter</button></li>
            <li><button data-switch-tab="shareTab"><i data-lucide="share-2"></i> Local File & Text Share</button></li>
            <li><button data-switch-tab="resizerTab"><i data-lucide="crop"></i> Image Resizer & Scaler</button></li>
            <li><button data-switch-tab="pdfTab"><i data-lucide="file-text"></i> Image to PDF Converter</button></li>
            <li><button data-switch-tab="pdfToJpgTab"><i data-lucide="file-image"></i> PDF to JPG Extractor</button></li>
            <li><button data-switch-tab="pdfMergeTab"><i data-lucide="layers-3"></i> Multi-PDF Document Merger</button></li>
          </ul>
        </div>

        <!-- Col 3: Security & Architecture -->
        <div class="footer-col">
          <h4>Security & Network</h4>
          <ul class="footer-links-list">
            <li><p>🔒 <strong>4-Digit PIN Security:</strong> Protect any transfer from unauthorized access on shared Wi-Fi networks.</p></li>
            <li><p>⚡ <strong>In-Memory Ephemeral Storage:</strong> Room codes & file payloads vanish once sessions end.</p></li>
            <li><p>🔔 <strong>Web Audio Synthesizer:</strong> Native browser oscillator chimes for tactile audio feedback.</p></li>
            <li><p>📱 <strong>Cross-Device Compatibility:</strong> Works seamlessly on Windows, macOS, Android, and iOS.</p></li>
          </ul>
        </div>

        <!-- Col 4: System Status & Client Engine -->
        <div class="footer-col">
          <h4>System Status & Engines</h4>
          <div class="footer-status-card">
            <div class="footer-status-row">
              <span style="color: var(--text-muted);">Active Host:</span>
              <strong id="footerHostText">Localhost:8000</strong>
            </div>
            <div class="footer-status-row">
              <span style="color: var(--text-muted);">Engine:</span>
              <strong style="color: #059669;">PHP + Polling</strong>
            </div>
            <div class="footer-status-row">
              <span style="color: var(--text-muted);">Presentation:</span>
              <strong>PptxGenJS v3.12</strong>
            </div>
            <div class="footer-status-row">
              <span style="color: var(--text-muted);">PDF Engines:</span>
              <strong>PDF.js & PDF-Lib</strong>
            </div>
            <div class="footer-status-row">
              <span style="color: var(--text-muted);">Privacy Mode:</span>
              <span style="color: #10b981; font-weight: 800;">End-to-End Local</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Web Development Services CTA -->
      <div class="footer-dev-banner">
        <div class="footer-dev-text">
          <div class="footer-dev-icon"><i data-lucide="code-2"></i></div>
          <div>
            <strong>We Also Build & Develop Websites</strong>
            <span>Have an idea for a site, portal, or web app? We design and develop it end-to-end.</span>
          </div>
        </div>
        <a href="mailto:Quickaccesslocal@gmail.com?subject=Website%20Development%20Enquiry" class="footer-dev-cta">
          <i data-lucide="mail"></i>
          <span>Quickaccesslocal@gmail.com</span>
        </a>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom-bar">
        <span>© 2026 <strong>QuickAccess</strong> • Designed for Speed, Privacy & Creative Productivity</span>
        <div style="display: flex; gap: 14px; align-items: center;">
          <span style="color: var(--text-muted);">Version 2.5 (AI Edition)</span>
          <span class="pulse-indicator" style="display: inline-block;"></span>
          <span style="color: #059669; font-weight: 700;">System Online</span>
        </div>
      </div>
    </footer>
  </div>

  <!-- ================= TOOLS MEGA-MENU / OPTIONS MODAL ================= -->
  <div class="aesthetic-modal-overlay" id="toolsMenuModal" style="display: none;">
    <div class="tools-mega-card">
      <div class="mega-menu-top">
        <div class="mega-title-wrap">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="layout-grid" style="color: var(--theme-primary);"></i>
            <h3>All QuickAccess Tools & Features</h3>
          </div>
          <p>Choose an option below to jump directly to that power tool</p>
        </div>
        <button class="modal-close-btn" id="closeToolsMenuBtn"><i data-lucide="x"></i></button>
      </div>

      <div class="mega-tools-grid">
        <!-- Option 1: Tool Hub -->
        <div class="mega-tool-item" data-switch-tab="hubTab">
          <div class="mega-icon-pill" style="background: linear-gradient(135deg, #8b5cf6, #06b6d4);"><i data-lucide="layout-grid"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">Tools Hub</span>
              <span class="tab-chip">Overview</span>
            </div>
            <span class="mega-item-desc">Browse all tools and launch features with interactive cards</span>
          </div>
        </div>

        <!-- Option 2: Local Share -->
        <div class="mega-tool-item" data-switch-tab="shareTab">
          <div class="mega-icon-pill send-gradient"><i data-lucide="share-2"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">Local File & Text Share</span>
              <span class="tab-chip">Fast</span>
            </div>
            <span class="mega-item-desc">Share files, drop links or Wi-Fi passwords with 6-digit codes & PIN protection</span>
          </div>
        </div>

        <!-- Option 3: AI PPT Creator -->
        <div class="mega-tool-item" data-switch-tab="aiPptTab">
          <div class="mega-icon-pill" style="background: linear-gradient(135deg, #7c3aed, #c026d3);"><i data-lucide="sparkles"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">AI PPT Creator</span>
              <span class="tab-chip" style="background: rgba(192, 38, 211, 0.15); color: #c026d3; font-weight: 800;">AI</span>
            </div>
            <span class="mega-item-desc">Generate professional PowerPoint presentations from prompts in seconds</span>
          </div>
        </div>

        <!-- Option 4: PDF to PPTX -->
        <div class="mega-tool-item" data-switch-tab="pdfToPptxTab">
          <div class="mega-icon-pill" style="background: linear-gradient(135deg, #2563eb, #d97706);"><i data-lucide="presentation"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">PDF to .PPTX</span>
              <span class="tab-chip" style="background: rgba(37, 99, 235, 0.15); color: #2563eb; font-weight: 800;">New</span>
            </div>
            <span class="mega-item-desc">Convert multi-page PDF documents into editable PowerPoint slides</span>
          </div>
        </div>

        <!-- Option 5: Image Resizer -->
        <div class="mega-tool-item" data-switch-tab="resizerTab">
          <div class="mega-icon-pill resizer-gradient"><i data-lucide="crop"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">Image Resizer</span>
              <span class="tab-chip">Instant</span>
            </div>
            <span class="mega-item-desc">Scale, compress, resize dimensions, and convert image formats in canvas</span>
          </div>
        </div>

        <!-- Option 6: Image to PDF -->
        <div class="mega-tool-item" data-switch-tab="pdfTab">
          <div class="mega-icon-pill pdf-gradient"><i data-lucide="file-text"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">Image to PDF</span>
              <span class="tab-chip">Mint</span>
            </div>
            <span class="mega-item-desc">Arrange photos into multi-page PDF documents with orientation controls</span>
          </div>
        </div>

        <!-- Option 7: PDF to JPG -->
        <div class="mega-tool-item" data-switch-tab="pdfToJpgTab">
          <div class="mega-icon-pill azure-gradient"><i data-lucide="file-image"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">PDF to JPG</span>
              <span class="tab-chip">Azure</span>
            </div>
            <span class="mega-item-desc">Extract all pages from PDF into high-res images or batch ZIP download</span>
          </div>
        </div>

        <!-- Option 8: PDF Merger -->
        <div class="mega-tool-item" data-switch-tab="pdfMergeTab">
          <div class="mega-icon-pill merge-gradient"><i data-lucide="layers-3"></i></div>
          <div class="mega-item-info">
            <div class="mega-name-row">
              <span class="mega-item-name">PDF Merger</span>
              <span class="tab-chip">Combine</span>
            </div>
            <span class="mega-item-desc">Merge multiple PDF documents client-side with document reordering</span>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ================= QUICKBOT AI CHATBOT WIDGET ================= -->
  <!-- Floating Launcher Trigger Button -->
  <button class="chatbot-launcher-btn" id="chatbotLauncherBtn" title="Ask QuickBot AI Assistant">
    <span class="bot-ring-pulse"></span>
    <svg class="quickbot-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M13.5 8.5 9.8 13.2h2.6l-.9 3.3 3.5-4.9h-2.6z" fill="currentColor" stroke="none"/></svg>
    <span>QuickBot AI</span>
  </button>

  <!-- Interactive Chat Window -->
  <div class="chatbot-window" id="chatbotWindow" style="display: none;">
    <div class="chat-header">
      <div class="chat-header-left">
        <div class="chat-bot-icon-wrap"><svg class="quickbot-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M13.5 8.5 9.8 13.2h2.6l-.9 3.3 3.5-4.9h-2.6z" fill="currentColor" stroke="none"/></svg></div>
        <div>
          <h4 class="chat-header-title">QuickBot AI Assistant</h4>
          <span class="chat-online-tag"><span class="pulse-indicator" style="width: 6px; height: 6px;"></span> Online • Ready to Assist</span>
        </div>
      </div>
      <div class="chat-header-actions">
        <button class="mini-icon-btn" id="resetChatBtn" title="Reset Conversation"><i data-lucide="rotate-ccw"></i></button>
        <button class="mini-icon-btn" id="minimizeChatbotBtn" title="Minimize Chat"><i data-lucide="minus"></i></button>
        <button class="mini-icon-btn" id="closeChatbotBtn" title="Close"><i data-lucide="x"></i></button>
      </div>
    </div>

    <!-- Messages List -->
    <div class="chat-messages-stream" id="chatbotMessagesList"></div>

    <!-- Message Input Bar -->
    <div class="chat-input-bar">
      <input type="text" id="chatbotInput" class="chat-input-field" placeholder="Ask anything, request a slide deck, or tool help..." autocomplete="off" />
      <button class="chat-send-btn" id="chatbotSendBtn" title="Send Message">
        <i data-lucide="send"></i>
      </button>
    </div>
  </div>

  <!-- Media Preview Lightbox Modal -->
  <div class="aesthetic-modal-overlay" id="previewModal" style="display: none;">
    <div class="preview-modal-card">
      <div class="modal-top">
        <div class="preview-title-wrap">
          <i data-lucide="eye"></i>
          <h3 id="previewModalTitle">File Preview</h3>
        </div>
        <button class="modal-close-btn" id="closePreviewModalBtn"><i data-lucide="x"></i></button>
      </div>
      <div class="preview-modal-body" id="previewModalBody">
        <!-- Rendered dynamically: img / audio / video / text iframe -->
      </div>
      <div class="preview-modal-footer">
        <span id="previewModalMeta">Size • Type</span>
        <a id="previewModalDownloadBtn" class="btn-aesthetic-primary btn-sm" href="#" download>
          <i data-lucide="download"></i> Download File
        </a>
      </div>
    </div>
  </div>

  <!-- QR Code Modal for Phone -->
  <div class="aesthetic-modal-overlay" id="qrModal" style="display: none;">
    <div class="aesthetic-modal-card">
      <div class="modal-top">
        <h3 id="qrModalTitle">Scan with Mobile</h3>
        <button class="modal-close-btn" id="closeQrModalBtn"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-content-area">
        <p class="modal-desc-text" id="qrModalDesc">Scan to open this link on your phone camera</p>
        <div class="qr-canvas-holder" id="qrCodeContainer"></div>
        <div class="qr-link-copy-box">
          <span id="qrModalUrl">http://...</span>
          <button class="copy-url-icon-btn" id="copyQrUrlBtn"><i data-lucide="copy"></i></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification Holder -->
  <div class="toast-stack" id="toastContainer"></div>

  <!-- Hidden Canvas for Image Resizer -->
  <canvas id="hiddenResizeCanvas" style="display: none;"></canvas>

  <!-- JavaScript Modules -->
  <script src="js/app.js"></script>
  <script src="js/share.js"></script>
  <script src="js/resizer.js"></script>
  <script src="js/pdf.js"></script>
  <script src="js/pdf-to-jpg.js"></script>
  <script src="js/pdf-merge.js"></script>
  <script src="js/ai-ppt.js"></script>
  <script src="js/pdf-to-pptx.js"></script>
  <script src="js/chatbot.js"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>
