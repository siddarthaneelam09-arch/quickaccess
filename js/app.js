// Global State & UI Controller for QuickAccess

// Safe icon renderer: Lucide is loaded from a CDN, so if that request is
// slow, blocked, or the icon set changes upstream, this stops that failure
// from breaking every other feature on the page (chatbot included).
window.safeIcons = function () {
  try {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  } catch (e) {
    console.warn('Icon render skipped:', e);
  }
};

window.App = {
  networkInfo: null,
  activeTab: 'hubTab',
  currentMode: 'light',

  init() {
    this.initMode();
    this.initSound();
    this.initTabs();
    this.initToolsMenu();
    this.initNetwork();
    this.initQrModal();
  },

  // 1. Dark Mode & Light Mode Toggle Controller
  initMode() {
    const savedMode = localStorage.getItem('quickaccess_mode') || 'light';
    this.setMode(savedMode);

    const toggleBtn = document.getElementById('modeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextMode = this.currentMode === 'light' ? 'dark' : 'light';
        this.setMode(nextMode);
        this.toast(`Switched to ${nextMode.charAt(0).toUpperCase() + nextMode.slice(1)} Mode`, 'info');
      });
    }
  },

  setMode(mode) {
    this.currentMode = mode;
    document.body.setAttribute('data-mode', mode);
    localStorage.setItem('quickaccess_mode', mode);

    const sunIcon = document.getElementById('modeSunIcon');
    const moonIcon = document.getElementById('modeMoonIcon');
    const labelText = document.getElementById('modeLabelText');

    if (mode === 'dark') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'inline-block';
      if (labelText) labelText.textContent = 'Dark';
    } else {
      if (sunIcon) sunIcon.style.display = 'inline-block';
      if (moonIcon) moonIcon.style.display = 'none';
      if (labelText) labelText.textContent = 'Light';
    }
    window.safeIcons();
  },

  // 2. Synthesized Web Audio API Chimes & Audio Toggle
  soundEnabled: true,
  _audioCtx: null,

  initSound() {
    const savedSound = localStorage.getItem('quickaccess_sound');
    this.soundEnabled = savedSound === null ? true : savedSound === 'true';
    this.updateSoundButtonUI();

    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('quickaccess_sound', String(this.soundEnabled));
        this.updateSoundButtonUI();
        if (this.soundEnabled) {
          this.playChime('toggle');
          this.toast('Audio feedback enabled', 'info');
        } else {
          this.toast('Audio feedback muted', 'info');
        }
      });
    }
  },

  updateSoundButtonUI() {
    const onIcon = document.getElementById('soundOnIcon');
    const offIcon = document.getElementById('soundOffIcon');
    const label = document.getElementById('soundLabelText');
    if (onIcon && offIcon) {
      if (this.soundEnabled) {
        onIcon.style.display = 'inline-block';
        offIcon.style.display = 'none';
        if (label) label.textContent = 'Sound: On';
      } else {
        onIcon.style.display = 'none';
        offIcon.style.display = 'inline-block';
        if (label) label.textContent = 'Sound: Off';
      }
      window.safeIcons();
    }
  },

  playChime(type = 'success') {
    if (!this.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this._audioCtx) {
        this._audioCtx = new AudioCtx();
      }
      if (this._audioCtx.state === 'suspended') {
        this._audioCtx.resume();
      }
      const ctx = this._audioCtx;
      const now = ctx.currentTime;

      if (type === 'success') {
        // High harmonic rising arpeggio chord (E5, G#5, B5, E6)
        const notes = [659.25, 830.61, 987.77, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.12, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.36);
        });
      } else if (type === 'receive') {
        // Soft welcoming two-tone chime (A5 -> D6)
        [880, 1174.66].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.14, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.42);
        });
      } else if (type === 'copy') {
        // Crisp high pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.exponentialRampToValueAtTime(1479.98, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'error') {
        // Subtle soft low descending warning (C#4 -> A3)
        [277.18, 220.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.08, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.26);
        });
      } else if (type === 'toggle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  },

  // 3. Tab Navigation with Dynamic Multi-Theme Switching
  initTabs() {
    const tabs = document.querySelectorAll('.aesthetic-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  },

  switchTab(tabId) {
    document.querySelectorAll('.aesthetic-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    const activeBtn = document.querySelector(`.aesthetic-tab[data-tab="${tabId}"]`);
    const activePane = document.getElementById(tabId);

    if (activeBtn) {
      activeBtn.classList.add('active');
      const theme = activeBtn.getAttribute('data-tab-theme') || 'share';
      document.body.setAttribute('data-theme', theme);
    } else {
      const themeMap = {
        hubTab: 'hub',
        shareTab: 'share',
        aiPptTab: 'aippt',
        pdfToPptxTab: 'pdftopptx',
        resizerTab: 'resizer',
        pdfTab: 'imagetopdf',
        pdfToJpgTab: 'pdftojpg',
        pdfMergeTab: 'pdfmerge'
      };
      document.body.setAttribute('data-theme', themeMap[tabId] || 'share');
    }

    if (activePane) activePane.classList.add('active');
    this.activeTab = tabId;

    this.closeToolsMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 3b. Attractive Options & Tools Mega-Menu
  initToolsMenu() {
    const trigger = document.getElementById('toolsMenuBtn');
    const modal = document.getElementById('toolsMenuModal');
    const closeBtn = document.getElementById('closeToolsMenuBtn');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openToolsMenu();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeToolsMenu();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeToolsMenu();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeToolsMenu();
    });

    // Delegate clicks for any element with data-tab
    document.addEventListener('click', (e) => {
      const card = e.target.closest('[data-switch-tab]');
      if (card) {
        const targetTab = card.getAttribute('data-switch-tab');
        if (targetTab) {
          this.switchTab(targetTab);
        }
      }
    });
  },

  openToolsMenu() {
    const modal = document.getElementById('toolsMenuModal');
    if (modal) {
      modal.style.display = 'flex';
      window.safeIcons();
    }
  },

  closeToolsMenu() {
    const modal = document.getElementById('toolsMenuModal');
    if (modal) modal.style.display = 'none';
  },

  // 4. Network Discovery
  async initNetwork() {
    const lanText = document.getElementById('lanIpText');
    try {
      const res = await fetch('/api/info');
      if (res.ok) {
        const data = await res.json();
        this.networkInfo = data;
        if (lanText) lanText.textContent = `Online: ${window.location.host}`;
        const footerHost = document.getElementById('footerHostText');
        if (footerHost) footerHost.textContent = `${window.location.host}`;
      } else {
        if (lanText) lanText.textContent = 'Localhost:8000';
      }
    } catch (err) {
      if (lanText) lanText.textContent = 'Local Mode';
    }
  },

  // 5. QR Code Modal (Connect from Phone)
  initQrModal() {
    const modal = document.getElementById('qrModal');
    const openBtn = document.getElementById('showLanQrBtn');
    const closeBtn = document.getElementById('closeQrModalBtn');
    const qrContainer = document.getElementById('qrCodeContainer');
    const urlEl = document.getElementById('qrModalUrl');
    const copyBtn = document.getElementById('copyQrUrlBtn');

    const showModalWithUrl = (url, title = 'Scan with Mobile Phone', desc = 'Open this link on any phone or tablet on the same Wi-Fi') => {
      qrContainer.innerHTML = '';
      document.getElementById('qrModalTitle').textContent = title;
      document.getElementById('qrModalDesc').textContent = desc;
      urlEl.textContent = url;

      new QRCode(qrContainer, {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });

      modal.style.display = 'flex';
      window.safeIcons();
    };

    this.showQrModal = showModalWithUrl;

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        const url = window.location.origin;
        showModalWithUrl(url, 'Connect Mobile to QuickAccess', 'Scan with your camera to open QuickAccess directly on your phone');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(urlEl.textContent).then(() => {
          this.toast('URL copied to clipboard!', 'success');
        });
      });
    }
  },

  // 6. Toast Notifications
  toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'info';
    if (type === 'success') {
      icon = 'check-circle-2';
      this.playChime('success');
    } else if (type === 'error') {
      icon = 'alert-triangle';
      this.playChime('error');
    }

    toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    window.safeIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // 7. Confetti Celebration
  fireConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#0284c7', '#059669', '#f59e0b']
      });
    }
  },

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
