// Image Resizer Controller (Client-Side Canvas Processing)
window.Resizer = {
  originalImage: null,
  origWidth: 0,
  origHeight: 0,
  origSize: 0,
  origName: 'image',
  aspectLocked: true,
  currentDataUrl: null,
  renderDebounceTimer: null,

  init() {
    this.initDropzone();
    this.initControls();
  },

  initDropzone() {
    const dropzone = document.getElementById('resizerDropzone');
    const fileInput = document.getElementById('resizerFileInput');

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
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.loadImageFile(file);
      } else {
        App.toast('Please drop a valid image file', 'error');
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.loadImageFile(file);
      }
    });
  },

  initControls() {
    const widthInput = document.getElementById('resizeWidth');
    const heightInput = document.getElementById('resizeHeight');
    const aspectBtn = document.getElementById('aspectLockBtn');
    const qualitySlider = document.getElementById('resizeQuality');
    const qualityVal = document.getElementById('qualityVal');
    const downloadBtn = document.getElementById('downloadResizedBtn');
    const resetBtn = document.getElementById('resetResizerBtn');
    const formatRadios = document.querySelectorAll('input[name="exportFormat"]');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // Aspect Ratio Lock
    aspectBtn.addEventListener('click', () => {
      this.aspectLocked = !this.aspectLocked;
      aspectBtn.classList.toggle('active', this.aspectLocked);
      App.toast(this.aspectLocked ? 'Aspect ratio locked' : 'Aspect ratio unlocked', 'info');
    });

    // Width Change
    widthInput.addEventListener('input', () => {
      if (!this.originalImage) return;
      let w = parseInt(widthInput.value) || 1;
      if (this.aspectLocked && this.origWidth > 0) {
        const ratio = this.origHeight / this.origWidth;
        const h = Math.round(w * ratio);
        heightInput.value = h;
      }
      this.clearActivePresets();
      this.scheduleRender();
    });

    // Height Change
    heightInput.addEventListener('input', () => {
      if (!this.originalImage) return;
      let h = parseInt(heightInput.value) || 1;
      if (this.aspectLocked && this.origHeight > 0) {
        const ratio = this.origWidth / this.origHeight;
        const w = Math.round(h * ratio);
        widthInput.value = w;
      }
      this.clearActivePresets();
      this.scheduleRender();
    });

    // Preset Scale Buttons (25%, 50%, 75%, 100%, 150%, 200%)
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.originalImage) return;
        this.clearActivePresets();
        btn.classList.add('active');

        const scale = parseInt(btn.getAttribute('data-scale')) / 100;
        const w = Math.round(this.origWidth * scale);
        const h = Math.round(this.origHeight * scale);

        widthInput.value = w;
        heightInput.value = h;
        this.scheduleRender();
      });
    });

    // Quality Slider
    qualitySlider.addEventListener('input', (e) => {
      qualityVal.textContent = `${e.target.value}%`;
      this.scheduleRender();
    });

    // Format Radio
    formatRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.scheduleRender();
      });
    });

    // Download Button
    downloadBtn.addEventListener('click', () => {
      this.downloadResized();
    });

    // Reset Button
    resetBtn.addEventListener('click', () => {
      this.reset();
    });
  },

  clearActivePresets() {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  },

  loadImageFile(file) {
    this.origSize = file.size;
    this.origName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.originalImage = img;
        this.origWidth = img.naturalWidth;
        this.origHeight = img.naturalHeight;

        // Set initial inputs
        document.getElementById('resizeWidth').value = this.origWidth;
        document.getElementById('resizeHeight').value = this.origHeight;

        // Update stats
        document.getElementById('origDimStat').textContent = `${this.origWidth} x ${this.origHeight}`;
        document.getElementById('origSizeStat').textContent = `(${App.formatBytes(this.origSize)})`;

        // Switch to preview view
        document.getElementById('resizerDropzone').style.display = 'none';
        document.getElementById('resizerPreviewPanel').style.display = 'flex';
        document.getElementById('downloadResizedBtn').disabled = false;

        // Set 100% preset active
        this.clearActivePresets();
        const p100 = document.querySelector('.preset-btn[data-scale="100"]');
        if (p100) p100.classList.add('active');

        this.renderResized();
        App.toast('Image loaded successfully!', 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  scheduleRender() {
    clearTimeout(this.renderDebounceTimer);
    this.renderDebounceTimer = setTimeout(() => {
      this.renderResized();
    }, 120);
  },

  renderResized() {
    if (!this.originalImage) return;

    const targetW = Math.max(1, parseInt(document.getElementById('resizeWidth').value) || this.origWidth);
    const targetH = Math.max(1, parseInt(document.getElementById('resizeHeight').value) || this.origHeight);
    const quality = (parseInt(document.getElementById('resizeQuality').value) || 90) / 100;
    const format = document.querySelector('input[name="exportFormat"]:checked').value;

    const canvas = document.getElementById('hiddenResizeCanvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    // High quality canvas rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If exporting to JPEG and original is transparent, fill white background
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(this.originalImage, 0, 0, targetW, targetH);

    this.currentDataUrl = canvas.toDataURL(format, quality);

    // Update preview img
    const previewImg = document.getElementById('resizerPreviewImg');
    previewImg.src = this.currentDataUrl;

    // Approximate size from base64 string
    const stringLength = this.currentDataUrl.length - 'data:image/png;base64,'.length;
    const newSizeBytes = Math.round(stringLength * 0.75);

    document.getElementById('newDimStat').textContent = `${targetW} x ${targetH}`;
    document.getElementById('newSizeStat').textContent = `(${App.formatBytes(newSizeBytes)})`;

    // Difference badge
    const badge = document.getElementById('sizeDiffBadge');
    const diffPercent = Math.round(((newSizeBytes - this.origSize) / this.origSize) * 100);

    if (diffPercent < 0) {
      badge.textContent = `${diffPercent}%`;
      badge.style.background = 'rgba(16, 185, 129, 0.2)';
      badge.style.color = '#34d399';
      badge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
    } else {
      badge.textContent = `+${diffPercent}%`;
      badge.style.background = 'rgba(239, 68, 68, 0.2)';
      badge.style.color = '#f87171';
      badge.style.borderColor = 'rgba(239, 68, 68, 0.35)';
    }
  },

  downloadResized() {
    if (!this.currentDataUrl) return;

    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    let ext = 'jpg';
    if (format === 'image/png') ext = 'png';
    if (format === 'image/webp') ext = 'webp';

    const targetW = document.getElementById('resizeWidth').value;
    const targetH = document.getElementById('resizeHeight').value;
    const filename = `${this.origName}_${targetW}x${targetH}.${ext}`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = this.currentDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    App.toast(`Downloaded ${filename}`, 'success');
    App.fireConfetti();
  },

  reset() {
    this.originalImage = null;
    this.currentDataUrl = null;
    document.getElementById('resizerFileInput').value = '';
    document.getElementById('resizerDropzone').style.display = 'block';
    document.getElementById('resizerPreviewPanel').style.display = 'none';
    document.getElementById('downloadResizedBtn').disabled = true;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Resizer.init();
});
