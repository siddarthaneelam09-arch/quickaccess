// PDF Merger Controller (Client-Side pdf-lib)
window.PdfMerge = {
  pdfFiles: [], // Array of { id, file, name, size, pageCount, arrayBuffer }
  isMerging: false,

  init() {
    this.initDropzone();
    this.initControls();
  },

  initDropzone() {
    const dropzone = document.getElementById('pdfMergeDropzone');
    const fileInput = document.getElementById('pdfMergeFileInput');
    const addMoreBtn = document.getElementById('addMorePdfMergeBtn');

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
      const files = Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
      if (files.length > 0) {
        this.addPdfFiles(files);
      } else {
        App.toast('Please drop PDF files', 'error');
      }
    });

    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
      if (files.length > 0) {
        this.addPdfFiles(files);
      }
    });

    if (addMoreBtn) {
      addMoreBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }
  },

  initControls() {
    const mergeBtn = document.getElementById('executeMergeBtn');
    const clearBtn = document.getElementById('clearPdfMergeBtn');

    if (mergeBtn) {
      mergeBtn.addEventListener('click', () => {
        this.mergePdfs();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.pdfFiles = [];
        this.renderQueue();
        App.toast('Cleared all PDF files', 'info');
      });
    }
  },

  async addPdfFiles(files) {
    if (!window.PDFLib) {
      App.toast('PDF library is still loading, please wait a moment.', 'error');
      return;
    }

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const srcDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pageCount = srcDoc.getPageCount();

        this.pdfFiles.push({
          id: `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          file: file,
          name: file.name,
          size: file.size,
          pageCount: pageCount,
          arrayBuffer: arrayBuffer
        });
      } catch (err) {
        console.error('Error loading PDF for merge:', err);
        App.toast(`Could not load ${file.name}: ${err.message}`, 'error');
      }
    }

    this.renderQueue();
    App.toast(`Added ${files.length} PDF(s) to merger!`, 'success');
  },

  renderQueue() {
    const dropzone = document.getElementById('pdfMergeDropzone');
    const panel = document.getElementById('pdfMergeQueuePanel');
    const list = document.getElementById('pdfMergeList');
    const countBadge = document.getElementById('pdfMergeDocCount');
    const totalPagesBadge = document.getElementById('pdfMergeTotalPages');
    const mergeBtn = document.getElementById('executeMergeBtn');
    const clearBtn = document.getElementById('clearPdfMergeBtn');

    if (this.pdfFiles.length === 0) {
      dropzone.style.display = 'block';
      panel.style.display = 'none';
      if (mergeBtn) mergeBtn.disabled = true;
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }

    dropzone.style.display = 'none';
    panel.style.display = 'block';
    if (mergeBtn) mergeBtn.disabled = false;
    if (clearBtn) clearBtn.style.display = 'inline-flex';

    const totalPages = this.pdfFiles.reduce((acc, f) => acc + f.pageCount, 0);
    countBadge.textContent = `${this.pdfFiles.length} Document(s)`;
    totalPagesBadge.textContent = `Total ${totalPages} Pages`;

    list.innerHTML = '';
    this.pdfFiles.forEach((doc, idx) => {
      const item = document.createElement('div');
      item.className = 'merge-doc-item';
      item.innerHTML = `
        <div class="merge-doc-left">
          <span class="merge-doc-index">#${idx + 1}</span>
          <div class="merge-doc-icon"><i data-lucide="file-text"></i></div>
          <div class="merge-doc-meta">
            <div class="merge-doc-name" title="${doc.name}">${doc.name}</div>
            <div class="merge-doc-sub">${doc.pageCount} page(s) • ${App.formatBytes(doc.size)}</div>
          </div>
        </div>
        <div class="merge-doc-actions">
          ${idx > 0 ? `<button class="mini-icon-btn move-doc-up" data-idx="${idx}" title="Move Up"><i data-lucide="arrow-up"></i></button>` : ''}
          ${idx < this.pdfFiles.length - 1 ? `<button class="mini-icon-btn move-doc-down" data-idx="${idx}" title="Move Down"><i data-lucide="arrow-down"></i></button>` : ''}
          <button class="mini-icon-btn danger delete-doc-btn" data-idx="${idx}" title="Remove PDF"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      list.appendChild(item);
    });

    // Reorder event listeners
    list.querySelectorAll('.move-doc-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (idx > 0) {
          const temp = this.pdfFiles[idx];
          this.pdfFiles[idx] = this.pdfFiles[idx - 1];
          this.pdfFiles[idx - 1] = temp;
          this.renderQueue();
        }
      });
    });

    list.querySelectorAll('.move-doc-down').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (idx < this.pdfFiles.length - 1) {
          const temp = this.pdfFiles[idx];
          this.pdfFiles[idx] = this.pdfFiles[idx + 1];
          this.pdfFiles[idx + 1] = temp;
          this.renderQueue();
        }
      });
    });

    list.querySelectorAll('.delete-doc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        this.pdfFiles.splice(idx, 1);
        this.renderQueue();
        App.toast('Removed PDF document', 'info');
      });
    });

    window.safeIcons();
  },

  async mergePdfs() {
    if (this.pdfFiles.length === 0 || this.isMerging) return;

    if (!window.PDFLib) {
      App.toast('PDF library is loading, please wait.', 'error');
      return;
    }

    const mergeBtn = document.getElementById('executeMergeBtn');
    const origHtml = mergeBtn.innerHTML;
    mergeBtn.disabled = true;
    mergeBtn.innerHTML = '<i data-lucide="loader-2"></i> Merging Documents...';
    window.safeIcons();

    this.isMerging = true;

    try {
      const mergedPdf = await PDFLib.PDFDocument.create();

      for (let i = 0; i < this.pdfFiles.length; i++) {
        const docItem = this.pdfFiles[i];
        const srcDoc = await PDFLib.PDFDocument.load(docItem.arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      let filename = document.getElementById('pdfMergeFilename').value.trim() || 'QuickAccess_Merged.pdf';
      if (!filename.toLowerCase().endsWith('.pdf')) {
        filename += '.pdf';
      }

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      App.toast(`Successfully merged into ${filename}!`, 'success');
      App.fireConfetti();
      App.playChime('success');
    } catch (err) {
      console.error('Merge error:', err);
      App.toast('Failed to merge PDFs: ' + err.message, 'error');
    } finally {
      this.isMerging = false;
      mergeBtn.disabled = false;
      mergeBtn.innerHTML = origHtml;
      window.safeIcons();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PdfMerge.init();
});
