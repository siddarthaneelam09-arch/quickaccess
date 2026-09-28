// PDF to JPG Converter Controller (Client-Side PDF.js & JSZip)
window.PdfToJpg = {
  currentPdf: null,
  pdfFileName: 'document',
  pdfPages: [], // Array of { pageNum, canvas, dataUrl, width, height }
  isConverting: false,

  init() {
    // Set up PDF.js worker
    if (window.pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    this.initDropzone();
    this.initControls();
  },

  initDropzone() {
    const dropzone = document.getElementById('pdfToJpgDropzone');
    const fileInput = document.getElementById('pdfToJpgFileInput');

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
    const downloadAllZipBtn = document.getElementById('downloadAllPdfPagesZipBtn');
    const resetBtn = document.getElementById('resetPdfToJpgBtn');
    const scaleSelect = document.getElementById('pdfRenderScale');
    const formatSelect = document.getElementById('pdfExportImgFormat');
    const qualitySlider = document.getElementById('pdfJpgQuality');
    const qualityVal = document.getElementById('pdfJpgQualityVal');

    if (qualitySlider) {
      qualitySlider.addEventListener('input', (e) => {
        if (qualityVal) qualityVal.textContent = `${e.target.value}%`;
      });
    }

    if (scaleSelect) {
      scaleSelect.addEventListener('change', () => {
        if (this.currentPdf) {
          this.renderAllPages();
        }
      });
    }

    if (downloadAllZipBtn) {
      downloadAllZipBtn.addEventListener('click', () => {
        this.downloadAllPagesZip();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.reset();
      });
    }
  },

  async loadPdfFile(file) {
    this.pdfFileName = file.name.replace(/\.[^/.]+$/, '') || 'document';
    const reader = new FileReader();

    const progressBanner = document.getElementById('pdfToJpgProgressWrap');
    const statusText = document.getElementById('pdfToJpgStatusText');
    const progressBar = document.getElementById('pdfToJpgProgressBar');

    progressBanner.style.display = 'block';
    statusText.textContent = 'Reading PDF file...';
    progressBar.style.width = '20%';

    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target.result);
        statusText.textContent = 'Parsing PDF document...';
        progressBar.style.width = '50%';

        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        this.currentPdf = await loadingTask.promise;

        progressBar.style.width = '75%';
        statusText.textContent = `Found ${this.currentPdf.numPages} page(s). Rendering...`;

        await this.renderAllPages();

        progressBar.style.width = '100%';
        setTimeout(() => {
          progressBanner.style.display = 'none';
        }, 500);

        App.toast(`Successfully loaded ${this.currentPdf.numPages} page(s)!`, 'success');
        App.fireConfetti();
      } catch (err) {
        console.error('Error loading PDF:', err);
        App.toast('Failed to load PDF file: ' + err.message, 'error');
        progressBanner.style.display = 'none';
      }
    };

    reader.readAsArrayBuffer(file);
  },

  async renderAllPages() {
    if (!this.currentPdf) return;

    this.isConverting = true;
    const numPages = this.currentPdf.numPages;
    const scale = parseFloat(document.getElementById('pdfRenderScale').value) || 2.0;
    const format = document.getElementById('pdfExportImgFormat').value; // 'image/jpeg' or 'image/png'
    const quality = (parseInt(document.getElementById('pdfJpgQuality').value) || 90) / 100;

    const progressBanner = document.getElementById('pdfToJpgProgressWrap');
    const statusText = document.getElementById('pdfToJpgStatusText');
    const progressBar = document.getElementById('pdfToJpgProgressBar');
    progressBanner.style.display = 'block';

    const dropzone = document.getElementById('pdfToJpgDropzone');
    const panel = document.getElementById('pdfToJpgResultsPanel');
    const mosaic = document.getElementById('pdfToJpgPagesMosaic');
    const metaTitle = document.getElementById('pdfDocTitle');
    const metaPages = document.getElementById('pdfDocPagesCount');

    dropzone.style.display = 'none';
    panel.style.display = 'block';
    mosaic.innerHTML = '';
    this.pdfPages = [];

    metaTitle.textContent = `${this.pdfFileName}.pdf`;
    metaPages.textContent = `${numPages} page(s)`;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      statusText.textContent = `Converting page ${pageNum} of ${numPages}...`;
      progressBar.style.width = `${Math.round((pageNum / numPages) * 100)}%`;

      const page = await this.currentPdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Fill white background for JPEGs
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;

      const dataUrl = canvas.toDataURL(format, quality);
      this.pdfPages.push({
        pageNum: pageNum,
        dataUrl: dataUrl,
        width: canvas.width,
        height: canvas.height
      });

      // Append card into gallery mosaic
      const card = document.createElement('div');
      card.className = 'pdf-page-tile';
      card.innerHTML = `
        <div class="tile-img-box">
          <img src="${dataUrl}" alt="Page ${pageNum}" />
        </div>
        <div class="tile-meta-row">
          <span class="tile-page-badge">Page ${pageNum}</span>
          <button class="btn-tile-download" data-page="${pageNum}" title="Download this page">
            <i data-lucide="download"></i> Download
          </button>
        </div>
      `;
      mosaic.appendChild(card);
    }

    // Attach single page download events
    mosaic.querySelectorAll('.btn-tile-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const pNum = parseInt(btn.getAttribute('data-page'));
        this.downloadSinglePage(pNum);
      });
    });

    window.safeIcons();
    this.isConverting = false;
    progressBanner.style.display = 'none';
  },

  downloadSinglePage(pageNum) {
    const pageObj = this.pdfPages.find(p => p.pageNum === pageNum);
    if (!pageObj) return;

    const format = document.getElementById('pdfExportImgFormat').value;
    const ext = format === 'image/png' ? 'png' : 'jpg';
    const filename = `${this.pdfFileName}_Page_${pageNum}.${ext}`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = pageObj.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    App.toast(`Downloaded Page ${pageNum}!`, 'success');
  },

  async downloadAllPagesZip() {
    if (this.pdfPages.length === 0) return;

    if (!window.JSZip) {
      App.toast('ZIP library is loading, please try again.', 'error');
      return;
    }

    const zipBtn = document.getElementById('downloadAllPdfPagesZipBtn');
    const origHtml = zipBtn.innerHTML;
    zipBtn.disabled = true;
    zipBtn.innerHTML = '<i data-lucide="loader-2"></i> Compressing ZIP...';
    window.safeIcons();

    try {
      const zip = new JSZip();
      const format = document.getElementById('pdfExportImgFormat').value;
      const ext = format === 'image/png' ? 'png' : 'jpg';

      for (let i = 0; i < this.pdfPages.length; i++) {
        const page = this.pdfPages[i];
        // Strip data:image/...;base64,
        const base64Data = page.dataUrl.split(',')[1];
        const pageFilename = `${this.pdfFileName}_Page_${page.pageNum}.${ext}`;
        zip.file(pageFilename, base64Data, { base64: true });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const zipFileName = `${this.pdfFileName}_pages.zip`;

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      App.toast(`Downloaded all ${this.pdfPages.length} pages as ZIP!`, 'success');
      App.fireConfetti();
    } catch (err) {
      console.error('Error generating zip:', err);
      App.toast('Failed to create ZIP archive', 'error');
    } finally {
      zipBtn.disabled = false;
      zipBtn.innerHTML = origHtml;
      window.safeIcons();
    }
  },

  reset() {
    this.currentPdf = null;
    this.pdfPages = [];
    document.getElementById('pdfToJpgFileInput').value = '';
    document.getElementById('pdfToJpgDropzone').style.display = 'block';
    document.getElementById('pdfToJpgResultsPanel').style.display = 'none';
    document.getElementById('pdfToJpgProgressWrap').style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PdfToJpg.init();
});
