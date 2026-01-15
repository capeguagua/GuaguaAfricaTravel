/* ========================================
   Main JavaScript - Core Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialize translations
  await translationManager.init();

  // Initialize scroll functionality
  scrollManager.init();

  // Initialize other modules
  initHeader();
  initMobileMenu();
  initContactModals();
  updateYear();
  initResizeHandler();
});

/* ============ Header Scroll Effect ============ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;

  const updateHeader = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  updateHeader();
}

/* ============ Mobile Menu ============ */
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');

  if (!btn || !links) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============ Contact Modals ============ */
function initContactModals() {
  const modal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const btnEmail = document.getElementById('btnEmail');
  const btnWhatsApp = document.getElementById('btnWhatsApp');
  const btnWeChat = document.getElementById('btnWeChat');

  if (!modal || !modalBody) return;

  // Contact modal content
  const contactModals = {
    email: {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
      label: 'Email',
      value: 'contact@guaguatravel.com',
      link: 'mailto:contact@guaguatravel.com'
    },
    whatsapp: {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
      label: 'Business WhatsApp',
      value: '+27 83 488 7587',
      link: 'https://wa.me/27834887587'
    },
    wechat: {
      icon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="color: var(--sage-600)"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.108.241-.243 0-.06-.024-.12-.04-.177l-.324-1.232a.492.492 0 01.177-.554c1.526-1.12 2.502-2.78 2.502-4.635 0-3.282-3.004-6.059-7.062-6.11zm-1.907 2.962c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/></svg>`,
      label: 'WeChat ID',
      value: 'capeguagua',
      link: null
    }
  };

  const openModal = (type) => {
    const data = contactModals[type];
    if (!data) return;

    // Get translated title
    const lang = translationManager.getCurrentLang();
    const titleKey = type === 'email' ? 'modal.email' : (type === 'whatsapp' ? 'modal.whatsapp' : 'modal.wechat');
    const title = translationManager.getTranslation(titleKey) || data.label;

    modalTitle.textContent = title;

    modalBody.innerHTML = `
      <div class="modal-info-item">
        <div class="modal-info-icon">${data.icon}</div>
        <div class="modal-info-content">
          <span class="modal-info-label">${data.label}</span>
          <span class="modal-info-value">
            ${data.link ? `<a href="${data.link}" target="_blank">${data.value}</a>` : data.value}
          </span>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Event listeners
  if (btnEmail) btnEmail.addEventListener('click', () => openModal('email'));
  if (btnWhatsApp) btnWhatsApp.addEventListener('click', () => openModal('whatsapp'));
  if (btnWeChat) btnWeChat.addEventListener('click', () => openModal('wechat'));
  if (modalClose) modalClose.addEventListener('click', closeModal);

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ============ Update Year ============ */
function updateYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = year;
  });
}

/* ============ Resize Handler ============ */
function initResizeHandler() {
  let resizeTimeout;
  const links = document.getElementById('navLinks');
  const btn = document.getElementById('menuBtn');

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768 && links && btn) {
        links.classList.remove('open');
        btn.classList.remove('active');
        document.body.style.overflow = '';
      }
    }, 100);
  }, { passive: true });
}

/* ============ Console Welcome ============ */
console.log(`
%c🐸 Guagua Africa Travel
%cDiscover the Depth & Soul of South Africa

Website crafted with care in Cape Town.
Welcome to our journey!
`, 
'color: #10B981; font-size: 24px; font-weight: bold;',
'color: #065F46; font-size: 14px;'
);
