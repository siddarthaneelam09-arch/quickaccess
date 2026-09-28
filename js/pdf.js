// Image to PDF Converter Controller (Client-Side jsPDF)
window.PdfConverter = {
  pages: [], // Array of { id, dataUrl, width, height, filename }

  init() {
    this.initDropzone();
    this.initControls();
  },

  initDropzone() {
    const dropzone = document.getElementById('pdfDropzone');
    const fileInput = document.getElementById('pdfFileInput');
    const addMoreBtn = document.getElementById('addMorePdfImagesBtn');

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
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) {
        this.addFiles(files);
      } else {
        App.toast('Please drop image files', 'error');
      }
    });

    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) {
        this.addFiles(files);
      }
    });

    if (addMoreBtn) {
      addMoreBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }
  },

  initControls() {
    const generateBtn = document.getElementById('generatePdfBtn');
    const clearBtn = document.getElementById('clearPdfImagesBtn');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePdf());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.pages = [];
        this.renderGallery();
        App.toast('Cleared all images', 'info');
      });
    }
  },

  addFiles(files) {
    let pending = files.length;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.pages.push({
            id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            dataUrl: e.target.result,
            width: img.naturalWidth,
            height: img.naturalHeight,
            filename: file.name
          });
          pending--;
          if (pending === 0) {
            this.renderGallery();
            App.toast(`Added ${files.length} image(s) to PDF queue`, 'success');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  renderGallery() {
    const dropzone = document.getElementById('pdfDropzone');
    const grid = document.getElementById('pdfPagesGrid');
    const countEl = document.getElementById('pdfPageCount');
    const generateBtn = document.getElementById('generatePdfBtn');
    const clearBtn = document.getElementById('clearPdfImagesBtn');

    countEl.textContent = `${this.pages.length} Image(s) Added`;

    if (this.pages.length === 0) {
      dropzone.style.display = 'block';
      grid.style.display = 'none';
      generateBtn.disabled = true;
      clearBtn.style.display = 'none';
      return;
    }

    dropzone.style.display = 'none';
    grid.style.display = 'grid';
    generateBtn.disabled = false;
    clearBtn.style.display = 'inline-flex';

    grid.innerHTML = '';

    this.pages.forEach((page, index) => {
      const card = document.createElement('div');
      card.className = 'pdf-page-card';
      card.innerHTML = `
        <div class="pdf-thumb-wrap">
          <img src="${page.dataUrl}" alt="Page ${index + 1}" />
        </div>
        <div class="pdf-card-footer">
          <span class="pdf-page-num">Page ${index + 1}</span>
          <div class="pdf-card-actions">
            ${index > 0 ? `<button class="mini-icon-btn move-left-btn" data-index="${index}" title="Move left"><i data-lucide="chevron-left"></i></button>` : ''}
            ${index < this.pages.length - 1 ? `<button class="mini-icon-btn move-right-btn" data-index="${index}" title="Move right"><i data-lucide="chevron-right"></i></button>` : ''}
            <button class="mini-icon-btn danger delete-page-btn" data-index="${index}" title="Remove page"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Reorder & Delete Events
    grid.querySelectorAll('.move-left-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (idx > 0) {
          const temp = this.pages[idx];
          this.pages[idx] = this.pages[idx - 1];
          this.pages[idx - 1] = temp;
          this.renderGallery();
        }
      });
    });

    grid.querySelectorAll('.move-right-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (idx < this.pages.length - 1) {
          const temp = this.pages[idx];
          this.pages[idx] = this.pages[idx + 1];
          this.pages[idx + 1] = temp;
          this.renderGallery();
        }
      });
    });

    grid.querySelectorAll('.delete-page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        this.pages.splice(idx, 1);
        this.renderGallery();
        App.toast('Removed page', 'info');
      });
    });

    window.safeIcons();
  },

  async generatePdf() {
    if (this.pages.length === 0) return;

    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      App.toast('PDF library is loading, please try again.', 'error');
      return;
    }

    const formatType = document.getElementById('pdfPageFormat').value; // 'a4', 'letter', 'fit'
    const orientationSetting = document.getElementById('pdfOrientation').value; // 'portrait', 'landscape', 'auto'
    const marginMm = parseInt(document.getElementById('pdfMargin').value) || 0;
    let filename = document.getElementById('pdfFileName').value.trim() || 'QuickShare_Document.pdf';
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }

    const generateBtn = document.getElementById('generatePdfBtn');
    const origBtnText = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i data-lucide="loader-2"></i> Generating PDF...';
    window.safeIcons();

    try {
      let doc = null;

      for (let i = 0; i < this.pages.length; i++) {
        const page = this.pages[i];

        // Determine orientation
        let isLandscape = page.width > page.height;
        let orientation = 'portrait';
        if (orientationSetting === 'landscape') orientation = 'landscape';
        else if (orientationSetting === 'portrait') orientation = 'portrait';
        else if (orientationSetting === 'auto') orientation = isLandscape ? 'landscape' : 'portrait';

        let pageWidth, pageHeight;

        if (formatType === 'fit') {
          // 1px = 0.264583 mm
          const pxToMm = 0.264583;
          pageWidth = (page.width * pxToMm) + (marginMm * 2);
          pageHeight = (page.height * pxToMm) + (marginMm * 2);
          orientation = pageWidth > pageHeight ? 'landscape' : 'portrait';
        } else {
          // Standard A4 or Letter in mm
          if (formatType === 'letter') {
            pageWidth = orientation === 'landscape' ? 279.4 : 215.9;
            pageHeight = orientation === 'landscape' ? 215.9 : 279.4;
          } else {
            // A4
            pageWidth = orientation === 'landscape' ? 297 : 210;
            pageHeight = orientation === 'landscape' ? 210 : 297;
          }
        }

        // Initialize document on first page or add new page
        if (i === 0) {
          doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: formatType === 'fit' ? [pageWidth, pageHeight] : formatType
          });
        } else {
          doc.addPage(formatType === 'fit' ? [pageWidth, pageHeight] : formatType, orientation);
        }

        // Calculate image fit within printable area
        const printableW = pageWidth - (marginMm * 2);
        const printableH = pageHeight - (marginMm * 2);

        const imgRatio = page.width / page.height;
        const pageRatio = printableW / printableH;

        let renderW, renderH;
        if (imgRatio > pageRatio) {
          renderW = printableW;
          renderH = printableW / imgRatio;
        } else {
          renderH = printableH;
          renderW = printableH * imgRatio;
        }

        // Center within printable area
        const posX = marginMm + (printableW - renderW) / 2;
        const posY = marginMm + (printableH - renderH) / 2;

        const imgFormat = page.dataUrl.includes('image/png') ? 'PNG' : 'JPEG';
        doc.addImage(page.dataUrl, imgFormat, posX, posY, renderW, renderH, undefined, 'FAST');
      }

      doc.save(filename);
      App.toast(`Generated & Downloaded ${filename}!`, 'success');
      App.fireConfetti();
    } catch (err) {
      console.error(err);
      App.toast('Failed to generate PDF: ' + err.message, 'error');
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = origBtnText;
      window.safeIcons();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PdfConverter.init();
});
