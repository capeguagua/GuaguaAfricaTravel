/* ========================================
   Translation Module - Bilingual Support
   ======================================== */

class TranslationManager {
  constructor() {
    this.currentLang = 'en';
    this.translations = { en: null, zh: null };
    this.isAnimating = false;
    this.ANIMATION_DURATION = 400;
  }

  async init() {
    // Load both translation files
    try {
      const [enResponse, zhResponse] = await Promise.all([
        fetch('translations/en.json'),
        fetch('translations/zh.json')
      ]);
      
      // Check if responses are successful
      if (!enResponse.ok) {
        throw new Error(`Failed to load en.json: ${enResponse.status}`);
      }
      if (!zhResponse.ok) {
        throw new Error(`Failed to load zh.json: ${zhResponse.status}`);
      }
      
      // Parse JSON
      this.translations.en = await enResponse.json();
      this.translations.zh = await zhResponse.json();
      
      console.log('Translations loaded successfully');
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Continue running the page even if translations fail
      return;
    }

    // Check saved language preference
    const savedLang = localStorage.getItem('guagua-lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      this.currentLang = savedLang;
    }

    // Apply initial translations
    this.applyTranslations(false);

    // Setup toggle button
    this.setupToggle();
  }

  setupToggle() {
    const langToggle = document.getElementById('langToggle');
    const langText = document.getElementById('langText');

    if (!langToggle || !langText) return;

    // Set initial state
    langText.textContent = this.currentLang === 'en' ? 'EN' : '中文';
    document.documentElement.lang = this.currentLang === 'en' ? 'en' : 'zh-CN';

    langToggle.addEventListener('click', () => this.toggleLanguage());
  }

  async toggleLanguage() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const langToggle = document.getElementById('langToggle');
    const langText = document.getElementById('langText');

    // Add switching animation class
    langToggle.classList.add('switching');
    document.body.classList.add('lang-switching');

    // Animate out existing text
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      el.style.transition = `opacity ${this.ANIMATION_DURATION / 2}ms ease, transform ${this.ANIMATION_DURATION / 2}ms ease`;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
    });

    // Wait for fade out
    await this.delay(this.ANIMATION_DURATION / 2);

    // Switch language
    this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';

    // Apply new translations
    this.applyTranslations(true);

    // Update toggle button
    langText.textContent = this.currentLang === 'en' ? 'EN' : '中文';
    document.documentElement.lang = this.currentLang === 'en' ? 'en' : 'zh-CN';

    // Save preference
    localStorage.setItem('guagua-lang', this.currentLang);

    // Animate in new text
    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    // Remove animation classes
    await this.delay(this.ANIMATION_DURATION / 2);
    langToggle.classList.remove('switching');
    document.body.classList.remove('lang-switching');

    this.isAnimating = false;
  }

  applyTranslations(animate = false) {
    const t = this.translations[this.currentLang];
    if (!t) return;

    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = this.getNestedValue(t, key);
      
      if (value !== undefined) {
        el.textContent = value;
      }
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, obj);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCurrentLang() {
    return this.currentLang;
  }

  getTranslation(key) {
    return this.getNestedValue(this.translations[this.currentLang], key);
  }
}

// Global instance
const translationManager = new TranslationManager();

// Export for use in other modules
window.translationManager = translationManager;
