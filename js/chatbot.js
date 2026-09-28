// QuickAccess AI Chatbot Controller (QuickBot Assistant)
// Provides interactive assistance, tool navigation, prompt suggestions & guides
window.Chatbot = {
  isOpen: false,
  messages: [],
  botTyping: false,

  // Custom QuickBot logo (inline SVG so it never depends on the icon CDN)
  BOT_LOGO_SVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M13.5 8.5 9.8 13.2h2.6l-.9 3.3 3.5-4.9h-2.6z" fill="currentColor" stroke="none"/></svg>',

  init() {
    this.initElements();
    this.loadInitialGreeting();
  },

  initElements() {
    const launcherBtn = document.getElementById('chatbotLauncherBtn');
    const closeBtn = document.getElementById('closeChatbotBtn');
    const minimizeBtn = document.getElementById('minimizeChatbotBtn');
    const sendBtn = document.getElementById('chatbotSendBtn');
    const input = document.getElementById('chatbotInput');
    const resetBtn = document.getElementById('resetChatBtn');

    if (launcherBtn) {
      launcherBtn.addEventListener('click', () => this.toggleChat());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeChat());
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.closeChat());
    }

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => this.handleUserSend());
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSend();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.messages = [];
        this.loadInitialGreeting();
        App.toast('Chat session reset', 'info');
      });
    }

    // Quick suggestion chips
    document.querySelectorAll('.chatbot-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
        if (input) input.value = text;
        this.handleUserSend();
      });
    });
  },

  toggleChat() {
    this.isOpen = !this.isOpen;
    const windowEl = document.getElementById('chatbotWindow');
    const launcherBtn = document.getElementById('chatbotLauncherBtn');

    if (windowEl) {
      windowEl.style.display = this.isOpen ? 'flex' : 'none';
      if (this.isOpen) {
        const input = document.getElementById('chatbotInput');
        if (input) input.focus();
        this.scrollToBottom();
      }
    }
    if (launcherBtn) {
      launcherBtn.classList.toggle('active', this.isOpen);
    }
  },

  openChat() {
    this.isOpen = true;
    const windowEl = document.getElementById('chatbotWindow');
    const launcherBtn = document.getElementById('chatbotLauncherBtn');
    if (windowEl) windowEl.style.display = 'flex';
    if (launcherBtn) launcherBtn.classList.add('active');
    const input = document.getElementById('chatbotInput');
    if (input) input.focus();
    this.scrollToBottom();
  },

  closeChat() {
    this.isOpen = false;
    const windowEl = document.getElementById('chatbotWindow');
    const launcherBtn = document.getElementById('chatbotLauncherBtn');
    if (windowEl) windowEl.style.display = 'none';
    if (launcherBtn) launcherBtn.classList.remove('active');
  },

  loadInitialGreeting() {
    this.messages = [
      {
        sender: 'bot',
        text: '👋 **Hello! I’m QuickBot**, your intelligent QuickAccess assistant.\n\nI can help you create **AI PowerPoint presentations**, convert **PDFs to .PPTX**, share files with **PIN security**, resize images, or navigate to any tool. What would you like to do today?',
        chips: [
          '✨ Create AI presentation on Healthcare',
          '📑 How to convert PDF to PPTX?',
          '🔒 How does PIN security work?',
          '💻 Build me a website'
        ]
      }
    ];
    this.renderMessages();
  },

  handleUserSend() {
    const input = document.getElementById('chatbotInput');
    if (!input || this.botTyping) return;

    const userText = input.value.trim();
    if (!userText) return;

    input.value = '';
    this.addMessage('user', userText);

    // Process AI response
    this.respondToUser(userText);
  },

  addMessage(sender, text, chips = [], action = null) {
    this.messages.push({ sender, text, chips, action });
    this.renderMessages();
    this.scrollToBottom();
  },

  renderMessages() {
    const container = document.getElementById('chatbotMessagesList');
    if (!container) return;

    container.innerHTML = '';
    this.messages.forEach(msg => {
      const msgRow = document.createElement('div');
      msgRow.className = `chat-msg-row ${msg.sender}-msg-row`;

      const avatar = document.createElement('div');
      avatar.className = `chat-avatar ${msg.sender}-avatar`;
      avatar.innerHTML = msg.sender === 'bot' ? this.BOT_LOGO_SVG : '<i data-lucide="user"></i>';

      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}-bubble`;
      bubble.innerHTML = this.formatMarkdown(msg.text);

      // Action button if present
      if (msg.action) {
        const actionBtn = document.createElement('button');
        actionBtn.className = 'chat-action-btn';
        actionBtn.innerHTML = `<i data-lucide="${msg.action.icon || 'arrow-right'}"></i> ${msg.action.label}`;
        actionBtn.addEventListener('click', () => {
          msg.action.callback();
        });
        bubble.appendChild(actionBtn);
      }

      // Quick chips if present
      if (msg.chips && msg.chips.length > 0) {
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'chat-chips-container';
        msg.chips.forEach(chipText => {
          const chipBtn = document.createElement('button');
          chipBtn.className = 'chat-chip-btn';
          chipBtn.textContent = chipText;
          chipBtn.addEventListener('click', () => {
            const input = document.getElementById('chatbotInput');
            if (input) input.value = chipText;
            this.handleUserSend();
          });
          chipsContainer.appendChild(chipBtn);
        });
        bubble.appendChild(chipsContainer);
      }

      msgRow.appendChild(avatar);
      msgRow.appendChild(bubble);
      container.appendChild(msgRow);
    });

    if (this.botTyping) {
      const typingRow = document.createElement('div');
      typingRow.className = 'chat-msg-row bot-msg-row typing-indicator-row';
      typingRow.innerHTML = `
        <div class="chat-avatar bot-avatar">${this.BOT_LOGO_SVG}</div>
        <div class="chat-bubble bot-bubble typing-dots">
          <span></span><span></span><span></span>
        </div>
      `;
      container.appendChild(typingRow);
    }

    window.safeIcons();
    this.scrollToBottom();
  },

  scrollToBottom() {
    const container = document.getElementById('chatbotMessagesList');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },

  async respondToUser(query) {
    this.botTyping = true;
    this.renderMessages();

    await new Promise(r => setTimeout(r, 650));

    const q = query.toLowerCase();
    let reply = '';
    let chips = [];
    let action = null;

    if (q.includes('ppt') || q.includes('presentation') || q.includes('slide') || q.includes('powerpoint')) {
      if (q.includes('create') || q.includes('make') || q.includes('generate')) {
        let topic = 'Modern Artificial Intelligence & Automation';
        if (q.includes('healthcare')) topic = 'Artificial Intelligence in Modern Medicine & Healthcare';
        else if (q.includes('marketing')) topic = 'Digital Growth Marketing & Brand Strategy 2026';
        else if (q.includes('startup') || q.includes('pitch')) topic = 'Next-Gen Startup Investment Pitch Deck';
        else if (q.includes('climate') || q.includes('energy')) topic = 'Clean Tech & Renewable Energy Innovations';

        reply = `✨ I can generate that presentation right now for you!\n\nI’ve set the topic to: **"${topic}"**.\n\nClick the button below to open the **AI PPT Creator** and export your custom PowerPoint (.pptx) deck with custom themes and charts:`;
        action = {
          label: `Open AI PPT Creator: "${topic}"`,
          icon: 'presentation',
          callback: () => {
            if (window.AiPpt) {
              window.AiPpt.setPromptAndGenerate(topic);
            } else {
              App.switchTab('aiPptTab');
            }
          }
        };
        chips = ['Generate Startup Pitch Deck', 'Generate Healthcare AI Deck', 'Convert PDF to PPTX'];
      } else {
        reply = `🪄 **AI PPT Creator** allows you to type any topic or prompt, select slide counts (4, 6, 8, 10 slides), and pick from 5 color themes (Cyber Violet, Executive Navy, Emerald, Sunset, Minimalist).\n\nIt generates real native **.pptx** files with structured cards, KPI metrics, roadmap timelines, and executive summaries.`;
        action = {
          label: 'Launch AI PPT Creator',
          icon: 'presentation',
          callback: () => App.switchTab('aiPptTab')
        };
        chips = ['Create AI Deck on Climate Tech', 'How to convert PDF to PPTX?'];
      }
    } else if (q.includes('pdf to pptx') || q.includes('pdf to ppt') || (q.includes('convert') && q.includes('pdf') && q.includes('powerpoint'))) {
      reply = `📑 **PDF to .PPTX Converter** renders every page of your PDF into high-definition presentation slides and bundles them into an editable Microsoft PowerPoint (.pptx) deck.\n\n• Supports 16:9 widescreen or 4:3 layouts\n• 100% client-side privacy (no server uploads)\n• High-resolution DPI rendering`;
      action = {
        label: 'Open PDF to PPTX Converter',
        icon: 'file-symlink',
        callback: () => App.switchTab('pdfToPptxTab')
      };
      chips = ['Launch AI PPT Creator', 'Merge multiple PDFs'];
    } else if (q.includes('pin') || q.includes('security') || q.includes('lock') || q.includes('password')) {
      reply = `🔒 **4-Digit PIN Security** protects your sensitive transfers:\n\n1. Senders check **"Protect transfer with a 4-digit PIN"** before sharing.\n2. Receivers who enter the 6-digit room code are prompted to unlock with the PIN.\n3. The backend enforces PIN authentication for all previews and file downloads (HTTP 401/403 protection).`;
      chips = ['How to share files on Wi-Fi?', 'How to send text notes?'];
    } else if (q.includes('share') || q.includes('send') || q.includes('receive') || q.includes('wifi') || q.includes('phone') || q.includes('lan')) {
      reply = `📡 **Local Share** allows super-fast file & text transfers across all devices on your Wi-Fi:\n\n1. **Send Files or Text**: Drop any files or paste links/notes in the Sender box.\n2. **Generate Code**: Click **"Share & Generate 6-Digit Code"**.\n3. **Receive**: On any other device (phone, laptop, tablet), enter the 6-digit code or scan the QR code to preview and download!`;
      action = {
        label: 'Go to Local File Share',
        icon: 'share-2',
        callback: () => App.switchTab('shareTab')
      };
      chips = ['How does PIN protection work?', 'Can I share notes without files?'];
    } else if (q.includes('resize') || q.includes('image') || q.includes('compress')) {
      reply = `🖼️ **Image Resizer** scales and compresses images directly in your browser canvas:\n\n• Scale presets: 25%, 50%, 75%, 100%, 150%, 200%\n• Exact width & height pixel inputs with Aspect Ratio Lock\n• Quality compression slider with live file size comparison\n• Exports to JPEG, PNG, or WEBP`;
      action = {
        label: 'Go to Image Resizer',
        icon: 'crop',
        callback: () => App.switchTab('resizerTab')
      };
      chips = ['Convert Images to PDF', 'Extract JPG from PDF'];
    } else if (q.includes('merge') || q.includes('combine pdf')) {
      reply = `📑 **PDF Merger** lets you drag-and-drop multiple PDF files, see page counts, reorder them with up/down arrows, and merge them into a single PDF in seconds with 1 click.`;
      action = {
        label: 'Go to PDF Merger',
        icon: 'layers-3',
        callback: () => App.switchTab('pdfMergeTab')
      };
      chips = ['Convert PDF to PPTX', 'Create AI Presentation'];
    } else if (q.includes('contact') || q.includes('email') || q.includes('reach') || ((q.includes('build') || q.includes('develop') || q.includes('hire') || q.includes('make')) && q.includes('website'))) {
      reply = `💻 Besides all these free tools, we also **design & develop custom websites and web apps** — portfolios, business sites, dashboards, you name it.\n\nReach out anytime at **Quickaccesslocal@gmail.com** and we'll get back to you.`;
      action = {
        label: 'Email Quickaccesslocal@gmail.com',
        icon: 'mail',
        callback: () => {
          window.location.href = 'mailto:Quickaccesslocal@gmail.com?subject=Website%20Development%20Enquiry';
        }
      };
      chips = ['What tools does QuickAccess offer?', '📁 Open All Tools Menu'];
    } else if (q.includes('menu') || q.includes('tools') || q.includes('options') || q.includes('interface')) {
      reply = `🌟 You can access all QuickAccess options through:\n\n1. The **"All Tools & Menu"** button in the top navigation bar\n2. The **Tool Hub** tab displaying all options with colorful interactive cards\n3. The horizontal theme-colored tabs`;
      action = {
        label: 'Open All Tools Hub',
        icon: 'layout-grid',
        callback: () => App.switchTab('hubTab')
      };
    } else {
      reply = `💡 I'm here to assist with anything in QuickAccess! You can ask me to:\n\n• **Generate an AI PowerPoint presentation** on any topic\n• **Convert PDFs to .PPTX** slides\n• **Explain Local Wi-Fi sharing** or PIN security\n• **Resize & compress images**\n• **Merge or convert PDFs**\n\nWe also build custom websites — just ask, or email **Quickaccesslocal@gmail.com**.`;
      chips = [
        '✨ Create presentation on AI in Healthcare',
        '📑 Convert PDF to PPTX',
        '🔒 How does PIN security work?',
        '💻 Build me a website'
      ];
    }

    this.botTyping = false;
    this.addMessage('bot', reply, chips, action);
    App.playChime('toggle');
  },

  formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet points
    html = html.replace(/^\s*•\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Line breaks
    html = html.replace(/\n\n/g, '<p></p>');
    html = html.replace(/\n/g, '<br/>');

    return html;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Chatbot.init();
});
