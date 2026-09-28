// QuickAccess PDF to .PPTX Converter Controller
// Extracts PDF pages and compiles them into a native PowerPoint (.pptx) presentation
window.PdfToPptx = {
  currentPdf: null,
  pdfFileName: 'Converted_Presentation',
  renderedPages: [], // Array of { pageNum, dataUrl, width, height }
  isConverting: false,

  init() {
    this.initDropzone();
    this.initControls();
  },

  initDropzone() {
    const dropzone = document.getElementById('pdfToPptxDropzone');
    const fileInput = document.getElementById('pdfToPptxFileInput');

    if (!dropzone || !fileInput) return;

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
      if (file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) {
        this.loadPdfFile(file);
      } else {
        App.toast('Please drop a valid PDF document', 'error');
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.loadPdfFile(file);
      }
    });
  },

  initControls() {
    const convertBtn = document.getElementById('executePdfToPptxBtn');
    const resetBtn = document.getElementById('resetPdfToPptxBtn');

    if (convertBtn) {
      convertBtn.addEventListener('click', () => this.generatePptx());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
  },

  async loadPdfFile(file) {
    if (!window.pdfjsLib) {
      App.toast('PDF library is loading, please wait.', 'error');
      return;
    }

    this.pdfFileName = file.name.replace(/\.[^/.]+$/, '') || 'Converted_Presentation';
    const nameInput = document.getElementById('pdfToPptxFilename');
    if (nameInput) {
      nameInput.value = `${this.pdfFileName}.pptx`;
    }

    const progressBanner = document.getElementById('pdfToPptxProgressWrap');
    const statusText = document.getElementById('pdfToPptxStatusText');
    const progressBar = document.getElementById('pdfToPptxProgressBar');

    if (progressBanner) progressBanner.style.display = 'block';
    if (statusText) statusText.textContent = 'Reading PDF document...';
    if (progressBar) progressBar.style.width = '20%';

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target.result);
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        this.currentPdf = await loadingTask.promise;

        const numPages = this.currentPdf.numPages;
        if (progressBar) progressBar.style.width = '40%';
        if (statusText) statusText.textContent = `Found ${numPages} page(s). Preparing conversion preview...`;

        await this.previewPages();

        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
          if (progressBanner) progressBanner.style.display = 'none';
        }, 400);

        App.playChime('receive');
        App.toast(`Loaded PDF with ${numPages} page(s)! Ready to export PPTX`, 'success');
      } catch (err) {
        console.error('Error loading PDF for PPTX:', err);
        App.toast('Failed to parse PDF: ' + err.message, 'error');
        if (progressBanner) progressBanner.style.display = 'none';
      }
    };
    reader.readAsArrayBuffer(file);
  },

  async previewPages() {
    if (!this.currentPdf) return;
    const numPages = this.currentPdf.numPages;

    const dropzone = document.getElementById('pdfToPptxDropzone');
    const panel = document.getElementById('pdfToPptxResultsPanel');
    const mosaic = document.getElementById('pdfToPptxMosaic');
    const titleEl = document.getElementById('pdfToPptxDocTitle');
    const metaEl = document.getElementById('pdfToPptxDocMeta');
    const convertBtn = document.getElementById('executePdfToPptxBtn');

    if (dropzone) dropzone.style.display = 'none';
    if (panel) panel.style.display = 'block';
    if (titleEl) titleEl.textContent = `${this.pdfFileName}.pdf`;
    if (metaEl) metaEl.textContent = `${numPages} Slides to Generate`;
    if (mosaic) mosaic.innerHTML = '';
    if (convertBtn) convertBtn.disabled = false;

    this.renderedPages = [];

    // Render fast preview thumbnails (scale = 1.0)
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await this.currentPdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      this.renderedPages.push({
        pageNum,
        dataUrl,
        width: viewport.width,
        height: viewport.height
      });

      if (mosaic) {
        const tile = document.createElement('div');
        tile.className = 'pdf-pptx-tile';
        tile.innerHTML = `
          <div class="tile-img-box">
            <img src="${dataUrl}" alt="Slide ${pageNum}" />
          </div>
          <div class="tile-meta-row">
            <span class="tile-page-badge">Slide ${pageNum}</span>
            <span class="tile-dim-badge">${Math.round(viewport.width)} x ${Math.round(viewport.height)}</span>
          </div>
        `;
        mosaic.appendChild(tile);
      }
    }
  },

  async generatePptx() {
    if (!this.currentPdf || this.renderedPages.length === 0 || this.isConverting) return;

    if (!window.PptxGenJS) {
      App.toast('PowerPoint library is loading, please wait.', 'error');
      return;
    }

    const convertBtn = document.getElementById('executePdfToPptxBtn');
    const origHtml = convertBtn.innerHTML;
    convertBtn.disabled = true;
    convertBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Generating .PPTX Deck...';
    window.safeIcons();

    this.isConverting = true;

    const progressBanner = document.getElementById('pdfToPptxProgressWrap');
    const statusText = document.getElementById('pdfToPptxStatusText');
    const progressBar = document.getElementById('pdfToPptxProgressBar');
    if (progressBanner) progressBanner.style.display = 'block';

    try {
      const layoutSelect = document.getElementById('pdfToPptxLayout');
      const layoutMode = layoutSelect ? layoutSelect.value : '16x9'; // '16x9' or '4x3'

      const pptx = new PptxGenJS();
      pptx.layout = layoutMode === '4x3' ? 'LAYOUT_4x3' : 'LAYOUT_16x9';
      pptx.title = this.pdfFileName;
      pptx.author = 'QuickAccess PDF to PPTX';

      const numPages = this.currentPdf.numPages;
      const renderScale = 2.0; // High resolution rendering for crisp slides

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        if (statusText) statusText.textContent = `Converting page ${pageNum} of ${numPages} into PowerPoint slide...`;
        if (progressBar) progressBar.style.width = `${Math.round((pageNum / numPages) * 90)}%`;

        const page = await this.currentPdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;
        const pageImgData = canvas.toDataURL('image/jpeg', 0.92);

        // Add PPTX Slide
        const slide = pptx.addSlide();
        slide.background = { color: 'FFFFFF' };

        // Center and fit the image on the slide
        slide.addImage({
          data: pageImgData,
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          sizing: { type: 'contain', w: '100%', h: '100%' }
        });
      }

      if (progressBar) progressBar.style.width = '100%';
      if (statusText) statusText.textContent = 'Saving PowerPoint presentation...';

      let filename = (document.getElementById('pdfToPptxFilename').value || `${this.pdfFileName}.pptx`).trim();
      if (!filename.toLowerCase().endsWith('.pptx')) {
        filename += '.pptx';
      }

      await pptx.writeFile({ fileName: filename });

      App.playChime('success');
      App.toast(`Successfully converted into ${filename}!`, 'success');
      App.fireConfetti();
    } catch (err) {
      console.error('PDF to PPTX conversion error:', err);
      App.toast('Failed to convert PDF to PPTX: ' + err.message, 'error');
    } finally {
      this.isConverting = false;
      convertBtn.disabled = false;
      convertBtn.innerHTML = origHtml;
      if (progressBanner) {
        setTimeout(() => { progressBanner.style.display = 'none'; }, 600);
      }
      window.safeIcons();
    }
  },

  reset() {
    this.currentPdf = null;
    this.renderedPages = [];
    const fileInput = document.getElementById('pdfToPptxFileInput');
    if (fileInput) fileInput.value = '';
    const dropzone = document.getElementById('pdfToPptxDropzone');
    const panel = document.getElementById('pdfToPptxResultsPanel');
    if (dropzone) dropzone.style.display = 'block';
    if (panel) panel.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PdfToPptx.init();
});
