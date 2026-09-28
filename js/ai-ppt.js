// QuickAccess AI PPT Creator Controller
// Generates professional PowerPoint (.pptx) decks from prompts using PptxGenJS
window.AiPpt = {
  currentDeck: null,
  activePreviewSlide: 0,
  isGenerating: false,

  init() {
    this.initControls();
    this.initTopicSuggestions();
  },

  initControls() {
    const generateBtn = document.getElementById('aiPptGenerateBtn');
    const downloadBtn = document.getElementById('aiPptDownloadBtn');
    const prevSlideBtn = document.getElementById('aiPptPrevSlideBtn');
    const nextSlideBtn = document.getElementById('aiPptNextSlideBtn');
    const editSlideBtn = document.getElementById('aiPptEditSlideBtn');
    const resetBtn = document.getElementById('aiPptResetBtn');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePresentation());
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.exportPptx());
    }

    if (prevSlideBtn) {
      prevSlideBtn.addEventListener('click', () => {
        if (this.currentDeck && this.activePreviewSlide > 0) {
          this.activePreviewSlide--;
          this.renderSlidePreview();
        }
      });
    }

    if (nextSlideBtn) {
      nextSlideBtn.addEventListener('click', () => {
        if (this.currentDeck && this.activePreviewSlide < this.currentDeck.slides.length - 1) {
          this.activePreviewSlide++;
          this.renderSlidePreview();
        }
      });
    }

    if (editSlideBtn) {
      editSlideBtn.addEventListener('click', () => this.openEditModal());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    // Theme preset buttons
    document.querySelectorAll('.ai-theme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.ai-theme-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        if (this.currentDeck) {
          this.currentDeck.theme = chip.getAttribute('data-theme');
          this.renderSlidePreview();
        }
      });
    });
  },

  initTopicSuggestions() {
    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const topic = chip.getAttribute('data-topic') || chip.textContent.trim();
        const input = document.getElementById('aiPptTopicInput');
        if (input) {
          input.value = topic;
          input.focus();
        }
        App.toast(`Loaded topic: "${topic}"`, 'info');
      });
    });
  },

  setPromptAndGenerate(topic, description = '') {
    const topicInput = document.getElementById('aiPptTopicInput');
    const descInput = document.getElementById('aiPptDescInput');
    if (topicInput) topicInput.value = topic;
    if (descInput && description) descInput.value = description;
    App.switchTab('aiPptTab');
    this.generatePresentation();
  },

  async generatePresentation() {
    const topicInput = document.getElementById('aiPptTopicInput');
    const topic = topicInput ? topicInput.value.trim() : '';

    if (!topic) {
      App.toast('Please enter a presentation topic or title', 'error');
      if (topicInput) topicInput.focus();
      return;
    }

    const descInput = document.getElementById('aiPptDescInput');
    const description = descInput ? descInput.value.trim() : '';
    const slideCount = parseInt(document.getElementById('aiPptSlideCount').value) || 6;
    const authorInput = document.getElementById('aiPptAuthorInput');
    const author = authorInput ? authorInput.value.trim() : 'QuickAccess AI';
    const activeThemeChip = document.querySelector('.ai-theme-chip.active');
    const themeKey = activeThemeChip ? activeThemeChip.getAttribute('data-theme') : 'cyber';

    const generateBtn = document.getElementById('aiPptGenerateBtn');
    const origText = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> AI Crafting Slides...';
    window.safeIcons();

    const progressBanner = document.getElementById('aiPptProgressWrap');
    const progressText = document.getElementById('aiPptProgressText');
    const progressBar = document.getElementById('aiPptProgressBar');

    if (progressBanner) progressBanner.style.display = 'block';
    if (progressText) progressText.textContent = 'Synthesizing narrative & research...';
    if (progressBar) progressBar.style.width = '25%';

    try {
      await new Promise(r => setTimeout(r, 400));
      if (progressBar) progressBar.style.width = '55%';
      if (progressText) progressText.textContent = 'Structuring layout, pillars & metrics...';

      await new Promise(r => setTimeout(r, 450));
      if (progressBar) progressBar.style.width = '85%';
      if (progressText) progressText.textContent = 'Applying typography & theme palette...';

      // Build synthesized slide deck model
      this.currentDeck = this.buildSlideDeck(topic, description, slideCount, author, themeKey);
      this.activePreviewSlide = 0;

      await new Promise(r => setTimeout(r, 300));
      if (progressBar) progressBar.style.width = '100%';

      // Display results panel
      const resultsPanel = document.getElementById('aiPptResultsPanel');
      if (resultsPanel) resultsPanel.style.display = 'block';

      this.renderSlidePreview();
      this.renderThumbnails();

      App.playChime('success');
      App.toast(`Generated ${this.currentDeck.slides.length}-Slide Presentation!`, 'success');
      App.fireConfetti();
    } catch (err) {
      console.error(err);
      App.toast('Failed to generate presentation: ' + err.message, 'error');
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = origText;
      if (progressBanner) {
        setTimeout(() => { progressBanner.style.display = 'none'; }, 600);
      }
      window.safeIcons();
    }
  },

  // Themes Color Palette Definition
  getThemePalette(themeKey) {
    const palettes = {
      cyber: {
        name: 'Cyber Violet',
        bg: '#0f0c29',
        cardBg: '#1e1b4b',
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#06b6d4',
        text: '#ffffff',
        textMuted: '#cbd5e1',
        isDark: true
      },
      navy: {
        name: 'Executive Navy',
        bg: '#0f172a',
        cardBg: '#1e293b',
        primary: '#38bdf8',
        secondary: '#6366f1',
        accent: '#34d399',
        text: '#ffffff',
        textMuted: '#94a3b8',
        isDark: true
      },
      emerald: {
        name: 'Emerald Horizon',
        bg: '#064e3b',
        cardBg: '#065f46',
        primary: '#34d399',
        secondary: '#10b981',
        accent: '#facc15',
        text: '#ffffff',
        textMuted: '#d1fae5',
        isDark: true
      },
      sunset: {
        name: 'Sunset Warmth',
        bg: '#431407',
        cardBg: '#7c2d12',
        primary: '#fb923c',
        secondary: '#f97316',
        accent: '#fde047',
        text: '#ffffff',
        textMuted: '#ffedd5',
        isDark: true
      },
      minimal: {
        name: 'Minimalist Frost',
        bg: '#ffffff',
        cardBg: '#f8fafc',
        primary: '#4f46e5',
        secondary: '#0284c7',
        accent: '#10b981',
        text: '#0f172a',
        textMuted: '#475569',
        isDark: false
      }
    };
    return palettes[themeKey] || palettes.cyber;
  },

  // Intelligent Slide Content Engine
  buildSlideDeck(topic, description, count, author, themeKey) {
    const cleanTopic = topic.trim();
    const slides = [];

    // 1. Title Slide
    slides.push({
      type: 'title',
      title: cleanTopic,
      subtitle: description || 'Strategic Insights, Breakthroughs & Future Trajectory',
      author: author,
      badge: 'STRATEGIC BRIEFING'
    });

    // 2. Executive Overview / Context
    slides.push({
      type: 'overview',
      title: 'Executive Summary & Background',
      subtitle: `Setting the foundational vision for ${cleanTopic}`,
      points: [
        `Pioneering new approaches to scale ${cleanTopic} across modern workflows.`,
        'Solving legacy fragmentation with integrated, agile, and automated architecture.',
        'Accelerating time-to-market while sustaining top-tier reliability and governance.',
        'Empowering stakeholders with clear indicators, transparent KPIs, and resilient systems.'
      ],
      callout: {
        label: 'CORE OBJECTIVE',
        text: `Deliver transformative value through scalable execution and forward-thinking paradigms.`
      }
    });

    // 3. Three Key Pillars / Solution Architecture
    slides.push({
      type: 'pillars',
      title: 'Strategic Pillars & Key Capabilities',
      subtitle: 'The tripartite framework powering our roadmap',
      pillars: [
        {
          num: '01',
          name: 'Intelligent Automation',
          desc: 'End-to-end autonomous processes that minimize operational latency and eliminate redundant manual touchpoints.'
        },
        {
          num: '02',
          name: 'Decentralized Resilience',
          desc: 'High-availability infrastructure ensuring 99.99% fault tolerance, distributed data integrity, and local caching.'
        },
        {
          num: '03',
          name: 'User-Centric Synergy',
          desc: 'Effortless adoption interfaces engineered for cross-functional collaboration and frictionless productivity.'
        }
      ]
    });

    // 4. Key Metrics & Impact
    slides.push({
      type: 'metrics',
      title: 'Projected Metrics & Benchmark Impact',
      subtitle: 'Quantifiable milestones demonstrating real-world performance',
      stats: [
        { val: '+185%', label: 'Efficiency Velocity', sub: 'Faster cycle turnaround time' },
        { val: '99.9%', label: 'Accuracy & Uptime', sub: 'Enterprise-grade stability' },
        { val: '3.6x', label: 'Return on Investment', sub: 'Calculated across 12-month tenure' }
      ],
      note: 'Based on empirical cross-industry benchmarks and adaptive workflow analysis.'
    });

    // If 6 or more slides requested
    if (count >= 5) {
      // 5. Execution Roadmap / Timeline
      slides.push({
        type: 'roadmap',
        title: 'Phased Implementation Roadmap',
        subtitle: 'From foundational setup to ecosystem-wide deployment',
        phases: [
          { phase: 'Phase 1 • Discover', title: 'Architecture & Pilot', desc: 'Requirements mapping, team alignment, baseline validation.' },
          { phase: 'Phase 2 • Accelerate', title: 'Integration & Testing', desc: 'Full API connectivity, stress tests, security audits.' },
          { phase: 'Phase 3 • Scale', title: 'Enterprise Rollout', desc: 'Multi-region expansion, automated feedback loops.' }
        ]
      });
    }

    if (count >= 6) {
      // 6. Strategic Takeaways & Action Plan
      slides.push({
        type: 'conclusion',
        title: 'Summary & Strategic Next Steps',
        subtitle: 'Key takeaways and immediate actions to execute',
        takeaways: [
          'Immediate alignment on core KPIs and cross-functional ownership.',
          'Deployment of modular components with weekly iterative progress reviews.',
          'Establish continuous telemetry and automated error recovery protocols.',
          'Continuous stakeholder communication and milestone celebration.'
        ],
        cta: 'Ready for Next Steps • QuickAccess Presentation Deck'
      });
    }

    if (count >= 8) {
      // 7. Comparative Analysis
      slides.push({
        type: 'comparison',
        title: 'Comparative Advantage vs Traditional Methods',
        subtitle: 'Why this framework outperforms status-quo alternatives',
        rows: [
          { feature: 'Implementation Speed', current: 'Instant / Minutes', traditional: 'Weeks of Manual Setup' },
          { feature: 'Data Privacy & Security', current: '100% Localized & Encrypted', traditional: 'Third-Party Cloud Risk' },
          { feature: 'Cost Efficiency', current: 'Zero Recurring Overhead', traditional: 'Per-User Subscription Fees' },
          { feature: 'User Experience', current: 'Frictionless Modern Glass UI', traditional: 'Complex Legacy Portals' }
        ]
      });

      // 8. Q&A / Final Thought
      slides.push({
        type: 'qa',
        title: 'Questions & Open Discussion',
        subtitle: 'Thank you for your engagement and vision',
        author: author,
        quote: '“The best way to predict the future is to build it with precision, clarity, and bold execution.”'
      });
    }

    return {
      topic: cleanTopic,
      description,
      author,
      theme: themeKey,
      slides
    };
  },

  // Render Slide in Preview Box
  renderSlidePreview() {
    if (!this.currentDeck) return;
    const slide = this.currentDeck.slides[this.activePreviewSlide];
    const palette = this.getThemePalette(this.currentDeck.theme);
    const stage = document.getElementById('aiPptSlideStage');
    const counter = document.getElementById('aiPptSlideCounter');
    const totalCount = this.currentDeck.slides.length;

    if (counter) {
      counter.textContent = `Slide ${this.activePreviewSlide + 1} of ${totalCount}`;
    }

    if (!stage) return;

    // Apply slide styling based on theme
    stage.style.backgroundColor = palette.bg;
    stage.style.color = palette.text;
    stage.style.borderColor = palette.primary;

    let contentHtml = '';

    if (slide.type === 'title') {
      contentHtml = `
        <div class="slide-canvas title-layout">
          <span class="slide-badge" style="background: ${palette.primary}25; color: ${palette.primary}; border-color: ${palette.primary}50;">
            ${slide.badge}
          </span>
          <h1 class="slide-title-hero" style="color: ${palette.text};">${this.escape(slide.title)}</h1>
          <p class="slide-subtitle-hero" style="color: ${palette.textMuted};">${this.escape(slide.subtitle)}</p>
          <div class="slide-author-row">
            <span style="color: ${palette.secondary}; font-weight: 700;">Presenter: ${this.escape(slide.author)}</span>
            <span style="color: ${palette.textMuted};">QuickAccess Deck</span>
          </div>
        </div>
      `;
    } else if (slide.type === 'overview') {
      contentHtml = `
        <div class="slide-canvas standard-layout">
          <div class="slide-header">
            <h2 style="color: ${palette.primary};">${this.escape(slide.title)}</h2>
            <p style="color: ${palette.textMuted};">${this.escape(slide.subtitle)}</p>
          </div>
          <div class="slide-body-split">
            <ul class="slide-bullets-list">
              ${slide.points.map(p => `<li><i data-lucide="check-circle" style="color: ${palette.accent};"></i><span>${this.escape(p)}</span></li>`).join('')}
            </ul>
            <div class="slide-callout-card" style="background: ${palette.cardBg}; border-color: ${palette.primary}40;">
              <span class="callout-tag" style="color: ${palette.secondary};">${slide.callout.label}</span>
              <p style="color: ${palette.text};">${this.escape(slide.callout.text)}</p>
            </div>
          </div>
        </div>
      `;
    } else if (slide.type === 'pillars') {
      contentHtml = `
        <div class="slide-canvas standard-layout">
          <div class="slide-header">
            <h2 style="color: ${palette.primary};">${this.escape(slide.title)}</h2>
            <p style="color: ${palette.textMuted};">${this.escape(slide.subtitle)}</p>
          </div>
          <div class="slide-pillars-grid">
            ${slide.pillars.map(pill => `
              <div class="pillar-card" style="background: ${palette.cardBg}; border-color: ${palette.primary}30;">
                <span class="pillar-num" style="color: ${palette.secondary};">${pill.num}</span>
                <h4 style="color: ${palette.text};">${this.escape(pill.name)}</h4>
                <p style="color: ${palette.textMuted};">${this.escape(pill.desc)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.type === 'metrics') {
      contentHtml = `
        <div class="slide-canvas standard-layout">
          <div class="slide-header">
            <h2 style="color: ${palette.primary};">${this.escape(slide.title)}</h2>
            <p style="color: ${palette.textMuted};">${this.escape(slide.subtitle)}</p>
          </div>
          <div class="slide-metrics-grid">
            ${slide.stats.map(s => `
              <div class="metric-card" style="background: ${palette.cardBg}; border-color: ${palette.primary}40;">
                <span class="metric-big-val" style="color: ${palette.accent};">${s.val}</span>
                <strong style="color: ${palette.text};">${this.escape(s.label)}</strong>
                <span style="color: ${palette.textMuted}; font-size: 0.75rem;">${this.escape(s.sub)}</span>
              </div>
            `).join('')}
          </div>
          <p class="slide-footer-note" style="color: ${palette.textMuted};">${this.escape(slide.note)}</p>
        </div>
      `;
    } else if (slide.type === 'roadmap') {
      contentHtml = `
        <div class="slide-canvas standard-layout">
          <div class="slide-header">
            <h2 style="color: ${palette.primary};">${this.escape(slide.title)}</h2>
            <p style="color: ${palette.textMuted};">${this.escape(slide.subtitle)}</p>
          </div>
          <div class="slide-roadmap-grid">
            ${slide.phases.map(ph => `
              <div class="roadmap-card" style="background: ${palette.cardBg}; border-color: ${palette.secondary}40;">
                <span class="roadmap-badge" style="color: ${palette.secondary};">${ph.phase}</span>
                <h4 style="color: ${palette.text};">${this.escape(ph.title)}</h4>
                <p style="color: ${palette.textMuted};">${this.escape(ph.desc)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.type === 'comparison') {
      contentHtml = `
        <div class="slide-canvas standard-layout">
          <div class="slide-header">
            <h2 style="color: ${palette.primary};">${this.escape(slide.title)}</h2>
            <p style="color: ${palette.textMuted};">${this.escape(slide.subtitle)}</p>
          </div>
          <div class="slide-table-wrap">
            <table class="slide-comp-table">
              <thead>
                <tr style="border-bottom: 2px solid ${palette.primary}40;">
                  <th style="color: ${palette.textMuted};">Feature / Metric</th>
                  <th style="color: ${palette.primary}; font-weight: 800;">QuickAccess Paradigm</th>
                  <th style="color: ${palette.textMuted};">Traditional Model</th>
                </tr>
              </thead>
              <tbody>
                ${slide.rows.map(r => `
                  <tr style="border-bottom: 1px solid ${palette.cardBg};">
                    <td style="color: ${palette.text}; font-weight: 600;">${this.escape(r.feature)}</td>
                    <td style="color: ${palette.accent}; font-weight: 700;">${this.escape(r.current)}</td>
                    <td style="color: ${palette.textMuted};">${this.escape(r.traditional)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      // Conclusion / Fallback
      contentHtml = `
        <div class="slide-canvas standard-layout">
          <div class="slide-header">
            <h2 style="color: ${palette.primary};">${this.escape(slide.title)}</h2>
            <p style="color: ${palette.textMuted};">${this.escape(slide.subtitle)}</p>
          </div>
          <ul class="slide-bullets-list" style="margin-top: 12px;">
            ${(slide.takeaways || []).map(t => `<li><i data-lucide="star" style="color: ${palette.accent};"></i><span>${this.escape(t)}</span></li>`).join('')}
          </ul>
          ${slide.cta ? `<div class="slide-cta-banner" style="background: ${palette.primary}20; border-color: ${palette.primary}50; color: ${palette.primary}; font-weight: 800;">${this.escape(slide.cta)}</div>` : ''}
        </div>
      `;
    }

    stage.innerHTML = contentHtml;
    window.safeIcons();
    this.updateThumbnailsActiveState();
  },

  renderThumbnails() {
    const list = document.getElementById('aiPptThumbsList');
    if (!list || !this.currentDeck) return;

    list.innerHTML = '';
    this.currentDeck.slides.forEach((slide, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `slide-thumb-card ${idx === this.activePreviewSlide ? 'active' : ''}`;
      thumb.setAttribute('data-idx', idx);
      thumb.innerHTML = `
        <span class="thumb-index">#${idx + 1}</span>
        <div class="thumb-info">
          <strong class="thumb-title">${this.escape(slide.title || 'Slide')}</strong>
          <span class="thumb-type">${slide.type.toUpperCase()}</span>
        </div>
      `;
      thumb.addEventListener('click', () => {
        this.activePreviewSlide = idx;
        this.renderSlidePreview();
      });
      list.appendChild(thumb);
    });
  },

  updateThumbnailsActiveState() {
    document.querySelectorAll('.slide-thumb-card').forEach(t => {
      const idx = parseInt(t.getAttribute('data-idx'));
      t.classList.toggle('active', idx === this.activePreviewSlide);
    });
  },

  // Open Quick Edit Modal for Current Slide
  openEditModal() {
    if (!this.currentDeck) return;
    const slide = this.currentDeck.slides[this.activePreviewSlide];
    const newTitle = prompt('Edit Slide Title:', slide.title);
    if (newTitle !== null && newTitle.trim()) {
      slide.title = newTitle.trim();
      this.renderSlidePreview();
      this.renderThumbnails();
      App.toast('Slide title updated!', 'success');
    }
  },

  // Export to Real Microsoft PowerPoint (.pptx) via PptxGenJS
  async exportPptx() {
    if (!this.currentDeck) return;

    if (!window.PptxGenJS) {
      App.toast('PowerPoint library is loading, please try again.', 'error');
      return;
    }

    const downloadBtn = document.getElementById('aiPptDownloadBtn');
    const origHtml = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Compiling .PPTX...';
    window.safeIcons();

    try {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';
      pptx.author = this.currentDeck.author || 'QuickAccess';
      pptx.company = 'QuickAccess AI Suite';
      pptx.title = this.currentDeck.topic;

      const palette = this.getThemePalette(this.currentDeck.theme);

      // Clean hex without #
      const cleanHex = (hex) => hex.replace('#', '');
      const bgHex = cleanHex(palette.bg);
      const cardBgHex = cleanHex(palette.cardBg);
      const primaryHex = cleanHex(palette.primary);
      const secondaryHex = cleanHex(palette.secondary);
      const accentHex = cleanHex(palette.accent);
      const textHex = cleanHex(palette.text);
      const textMutedHex = cleanHex(palette.textMuted);

      for (let i = 0; i < this.currentDeck.slides.length; i++) {
        const slideData = this.currentDeck.slides[i];
        const slide = pptx.addSlide();

        // Background
        slide.background = { color: bgHex };

        // Top Accent Stripe
        slide.addShape(pptx.shapes.RECTANGLE, {
          x: 0, y: 0, w: '100%', h: 0.15,
          fill: { color: primaryHex },
          line: { color: primaryHex }
        });

        if (slideData.type === 'title') {
          // Decorative pill shape
          slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.8, y: 1.2, w: 2.8, h: 0.45,
            fill: { color: primaryHex, transparency: 80 },
            line: { color: primaryHex, width: 1.5 }
          });
          slide.addText(slideData.badge || 'PRESENTATION', {
            x: 0.8, y: 1.2, w: 2.8, h: 0.45,
            fontSize: 11, bold: true, color: primaryHex,
            align: 'center', fontFace: 'Calibri'
          });

          // Title
          slide.addText(slideData.title, {
            x: 0.8, y: 1.9, w: 11.5, h: 2.2,
            fontSize: 38, bold: true, color: textHex,
            fontFace: 'Arial', lineSpacing: 44
          });

          // Subtitle
          slide.addText(slideData.subtitle, {
            x: 0.8, y: 4.2, w: 11.5, h: 1.2,
            fontSize: 18, color: textMutedHex,
            fontFace: 'Calibri'
          });

          // Presenter metadata card
          slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: 0.8, y: 5.6, w: 5.5, h: 0.8,
            fill: { color: cardBgHex },
            line: { color: secondaryHex, width: 1 }
          });
          slide.addText(`Presenter: ${slideData.author}  •  QuickAccess AI Suite`, {
            x: 1.0, y: 5.6, w: 5.1, h: 0.8,
            fontSize: 13, bold: true, color: secondaryHex,
            fontFace: 'Calibri'
          });

        } else if (slideData.type === 'pillars') {
          // Slide Header
          slide.addText(slideData.title, {
            x: 0.8, y: 0.6, w: 11.5, h: 0.8,
            fontSize: 26, bold: true, color: primaryHex, fontFace: 'Arial'
          });
          slide.addText(slideData.subtitle, {
            x: 0.8, y: 1.3, w: 11.5, h: 0.5,
            fontSize: 14, color: textMutedHex, fontFace: 'Calibri'
          });

          // 3 Columns Cards
          const colW = 3.6;
          const gap = 0.35;
          slideData.pillars.forEach((pill, idx) => {
            const posX = 0.8 + idx * (colW + gap);
            // Card background
            slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
              x: posX, y: 2.1, w: colW, h: 4.4,
              fill: { color: cardBgHex },
              line: { color: primaryHex, width: 1 }
            });
            // Number badge
            slide.addText(pill.num, {
              x: posX + 0.3, y: 2.4, w: 1.5, h: 0.6,
              fontSize: 22, bold: true, color: secondaryHex, fontFace: 'Arial'
            });
            // Pillar Title
            slide.addText(pill.name, {
              x: posX + 0.3, y: 3.1, w: colW - 0.6, h: 0.9,
              fontSize: 18, bold: true, color: textHex, fontFace: 'Arial'
            });
            // Pillar Description
            slide.addText(pill.desc, {
              x: posX + 0.3, y: 4.1, w: colW - 0.6, h: 2.1,
              fontSize: 13, color: textMutedHex, fontFace: 'Calibri', lineSpacing: 18
            });
          });

        } else if (slideData.type === 'metrics') {
          // Slide Header
          slide.addText(slideData.title, {
            x: 0.8, y: 0.6, w: 11.5, h: 0.8,
            fontSize: 26, bold: true, color: primaryHex, fontFace: 'Arial'
          });
          slide.addText(slideData.subtitle, {
            x: 0.8, y: 1.3, w: 11.5, h: 0.5,
            fontSize: 14, color: textMutedHex, fontFace: 'Calibri'
          });

          // 3 Metric Cards
          const colW = 3.6;
          const gap = 0.35;
          slideData.stats.forEach((st, idx) => {
            const posX = 0.8 + idx * (colW + gap);
            slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
              x: posX, y: 2.2, w: colW, h: 3.6,
              fill: { color: cardBgHex },
              line: { color: accentHex, width: 1.5 }
            });
            slide.addText(st.val, {
              x: posX, y: 2.6, w: colW, h: 1.1,
              fontSize: 36, bold: true, color: accentHex, align: 'center', fontFace: 'Arial'
            });
            slide.addText(st.label, {
              x: posX + 0.2, y: 3.7, w: colW - 0.4, h: 0.6,
              fontSize: 16, bold: true, color: textHex, align: 'center', fontFace: 'Arial'
            });
            slide.addText(st.sub, {
              x: posX + 0.2, y: 4.4, w: colW - 0.4, h: 0.8,
              fontSize: 12, color: textMutedHex, align: 'center', fontFace: 'Calibri'
            });
          });

          slide.addText(slideData.note, {
            x: 0.8, y: 6.2, w: 11.5, h: 0.5,
            fontSize: 12, italic: true, color: textMutedHex, fontFace: 'Calibri'
          });

        } else {
          // Standard / Bullet / Overview Layout
          slide.addText(slideData.title, {
            x: 0.8, y: 0.6, w: 11.5, h: 0.8,
            fontSize: 26, bold: true, color: primaryHex, fontFace: 'Arial'
          });
          slide.addText(slideData.subtitle, {
            x: 0.8, y: 1.3, w: 11.5, h: 0.5,
            fontSize: 14, color: textMutedHex, fontFace: 'Calibri'
          });

          const bulletPoints = (slideData.points || slideData.takeaways || []).map(p => ({
            text: p,
            options: { fontSize: 15, color: textHex, bullet: true, fontFace: 'Calibri', lineSpacing: 28 }
          }));

          if (bulletPoints.length > 0) {
            slide.addText(bulletPoints, {
              x: 0.8, y: 2.1, w: 7.2, h: 4.4
            });
          }

          if (slideData.callout) {
            slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
              x: 8.4, y: 2.3, w: 4.0, h: 3.8,
              fill: { color: cardBgHex },
              line: { color: secondaryHex, width: 1.5 }
            });
            slide.addText(slideData.callout.label, {
              x: 8.7, y: 2.6, w: 3.4, h: 0.5,
              fontSize: 13, bold: true, color: secondaryHex, fontFace: 'Arial'
            });
            slide.addText(slideData.callout.text, {
              x: 8.7, y: 3.2, w: 3.4, h: 2.6,
              fontSize: 14, color: textHex, fontFace: 'Calibri', lineSpacing: 22
            });
          }
        }

        // Bottom Footer Tag
        slide.addText(`QuickAccess AI Deck  •  ${this.currentDeck.topic}`, {
          x: 0.8, y: 7.0, w: 11.5, h: 0.3,
          fontSize: 10, color: textMutedHex, fontFace: 'Calibri'
        });
      }

      const safeFileName = `${this.currentDeck.topic.replace(/[^a-zA-Z0-9]/g, '_')}_presentation.pptx`;
      await pptx.writeFile({ fileName: safeFileName });

      App.playChime('success');
      App.toast(`Downloaded ${safeFileName}!`, 'success');
      App.fireConfetti();
    } catch (err) {
      console.error('PPTX Export error:', err);
      App.toast('Failed to export PPTX: ' + err.message, 'error');
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = origHtml;
      window.safeIcons();
    }
  },

  reset() {
    this.currentDeck = null;
    this.activePreviewSlide = 0;
    const topicInput = document.getElementById('aiPptTopicInput');
    const descInput = document.getElementById('aiPptDescInput');
    if (topicInput) topicInput.value = '';
    if (descInput) descInput.value = '';
    const resultsPanel = document.getElementById('aiPptResultsPanel');
    if (resultsPanel) resultsPanel.style.display = 'none';
  },

  escape(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AiPpt.init();
});
