/* script.js - interaction layer */
/* Features:
   - Mobile nav toggle
   - Theme (light/dark) toggle persisted to localStorage
   - JSON-based internationalization (i18n) system
   - Simple contact form validation and mock submit
   - Lightbox gallery with keyboard navigation
   - Small accessibility niceties
*/

console.log('🚀 Aurora Script Loading - Version 2.0');

(() => {
  console.log('✓ Main IIFE started');
  // Elements
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  const themeToggle = document.getElementById('theme-toggle');
  const langToggle = document.getElementById('lang-toggle');
  const body = document.body;
  const yearEl = document.getElementById('year');

  console.log('✓ Elements loaded:', { navToggle: !!navToggle, themeToggle: !!themeToggle, langToggle: !!langToggle });



  // Theme function (defined first)
  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    body.classList.toggle('light', theme === 'light');
    body.classList.toggle('dark', theme === 'dark');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
      // Icon
      if (theme === 'dark') themeToggle.textContent = '☀️';
      else themeToggle.textContent = '🌙';
    }
    localStorage.setItem('theme', theme);
  }

  // Persisted theme (light/dark)
  const storedTheme = localStorage.getItem('theme') || body.getAttribute('data-theme') || 'light';
  setTheme(storedTheme);

  // Set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 🌐 LANGUAGE TOGGLE — JSON-based version */
  let currentTranslations = {};

  async function setLanguage(lang) {
    // Add fade animation
    document.body.setAttribute('data-lang-updating', '');
    document.body.setAttribute('data-lang', lang);
    localStorage.setItem('lang', lang);
    
    // Update toggle button
    if (langToggle) {
      const buttonText = lang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN';
      langToggle.textContent = buttonText;
      langToggle.setAttribute('aria-pressed', String(lang !== 'en'));
    }

    try {
      const response = await fetch(`lang/${lang}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      currentTranslations = await response.json();
      applyTranslations(currentTranslations);
      console.log(`Successfully loaded ${lang} translations`);
    } catch (err) {
      console.error(`Error loading ${lang} translations:`, err);
      
      // For file:// protocol, use fallback translations
      if (window.location.protocol === 'file:') {
        console.warn('Using fallback translations for file:// protocol');
        useFallbackTranslations(lang);
      } else {
        // Use fallback translations for any language if fetch fails
        useFallbackTranslations(lang);
      }
    }

    // Remove fade animation after a brief delay
    await new Promise(r => setTimeout(r, 150));
    document.body.removeAttribute('data-lang-updating');
  }

  // Fallback translations for when JSON files can't be loaded
  const fallbackTranslations = {
    es: {
      "hero_title": "Interfaces hermosas. Código limpio. Interacciones rápidas.",
      "hero_subtitle": "Una plantilla moderna creada con rendimento, accesibilidad y microinteracciones encantadoras en mente.",
      "hero_cta_projects": "Ver Proyectos",
      "hero_cta_contact": "Contáctanos",
      "nav_about": "Acerca de",
      "nav_projects": "Proyectos",
      "nav_features": "Características",
      "nav_contact": "Contacto",
      "about_title": "Acerca de Aurora",
      "about_desc": "Diseñamos y construimos experiencias web modernas con un enfoque minimalista y pragmático.",
      "projects_title": "Proyectos Recientes",
      "features_title": "¿Por qué elegir esta plantilla?",
      "cta_title": "¿Listo para comenzar tu proyecto?",
      "cta_subtitle": "Cuéntanos sobre tu idea y te ayudaremos a convertirla en algo hermoso.",
      "cta_button": "Contáctanos",
      "contact_title": "Contacto",
      "contact_name": "Tu nombre",
      "contact_email": "Correo electrónico",
      "contact_message": "Mensaje",
      "contact_send": "Enviar mensaje",
      "contact_reset": "Reiniciar",
      "contact_name_placeholder": "Juana Pérez",
      "contact_email_placeholder": "tu@ejemplo.com",
      "contact_message_placeholder": "Cuéntanos sobre tu proyecto...",
      "social_facebook": "Facebook",
      "social_instagram": "Instagram",
      "social_twitter": "Twitter",
      "social_linkedin": "LinkedIn",
      "social_github": "GitHub",
      "footer_copyright": "© {year} Aurora — Construido con cuidado. Todos los derechos reservados.",
      "testimonials_title": "Lo que dicen nuestros clientes",
      "testimonials_subtitle": "Comentarios reales de clientes satisfechos que eligieron Aurora para sus proyectos.",
      "testimonial_1_text": "Aurora entregó exactamente lo que necesitábamos: un sitio web hermoso y rápido que nuestros clientes aman. La atención al detalle y la optimización del rendimiento superaron nuestras expectativas.",
      "testimonial_1_name": "Michael Chen",
      "testimonial_1_title": "CEO, TechStart Inc.",
      "testimonial_2_text": "Profesional, confiable y creativo. Aurora transformó nuestra presencia en línea y nos ayudó a llegar a nuevos clientes. ¡Altamente recomendado!",
      "testimonial_2_name": "Sarah Martinez",
      "testimonial_2_title": "Directora de Marketing, GrowthCo",
      "testimonial_3_text": "La experiencia del equipo en desarrollo web moderno realmente se nota. Nuestro sitio carga increíblemente rápido y se ve increíble en todos los dispositivos.",
      "testimonial_3_name": "David Park",
      "testimonial_3_title": "Fundador, InnovateTech",
      "google_reviews_title": "Reseñas Verificadas",
      "google_reviews_subtitle": "Ve lo que dicen nuestros clientes en Google",
      "google_reviews_rating": "4.9/5 basado en 127+ reseñas",
      "google_reviews_cta": "Ver todas las reseñas"
    }
  };

  // Store original English text for restoration
  let originalTexts = {};

  function storeOriginalTexts() {
    if (Object.keys(originalTexts).length === 0) {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key === 'footer_copyright') {
          const year = new Date().getFullYear();
          originalTexts[key] = `© ${year} Aurora — Built with care. All rights reserved.`;
        } else {
          originalTexts[key] = el.textContent.trim();
        }
      });

      // Store original placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        originalTexts[key] = el.placeholder;
      });
    }
  }

  function useFallbackTranslations(lang) {
    if (lang === 'es' && fallbackTranslations.es) {
      applyTranslations(fallbackTranslations.es);
    } else if (lang === 'en') {
      // Restore original English text
      applyTranslations(originalTexts);
    }
  }

  function applyTranslations(dict) {
    // Handle text content with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        // Handle special footer copyright with year placeholder
        if (key === 'footer_copyright') {
          const year = new Date().getFullYear();
          if (dict[key].includes('{year}')) {
            el.innerHTML = dict[key].replace('{year}', `<span id="year">${year}</span>`);
          } else {
            el.innerHTML = `© <span id="year">${year}</span> Aurora — Built with care. All rights reserved.`;
          }
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Handle placeholders with data-i18n-placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // Handle aria-labels and titles for buttons
    if (langToggle) {
      langToggle.title = dict['toggle_language'] || 'Toggle language';
    }
    if (themeToggle) {
      themeToggle.title = dict['toggle_theme'] || 'Toggle theme';
    }
  }

  // Initialize language system after DOM is ready
  function initializeLanguage() {
    storeOriginalTexts(); // Store original English text first
    const storedLang = localStorage.getItem('lang') || 'en';
    
    // Set initial button state before loading language
    if (langToggle) {
      langToggle.textContent = storedLang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN';
      langToggle.setAttribute('aria-pressed', String(storedLang !== 'en'));
    }
    
    setLanguage(storedLang);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguage);
  } else {
    initializeLanguage();
  }

  // Setup event listeners after DOM is ready
  function setupEventListeners() {
    console.log('✓ Setting up event listeners...');
    // Language toggle event listener
    langToggle?.addEventListener('click', (e) => {
      console.log('Language toggle clicked');
      const currentLang = body.getAttribute('data-lang') || 'en';
      const nextLang = currentLang === 'en' ? 'es' : 'en';
      
      // Update button immediately for better UX
      if (langToggle) {
        const newButtonText = nextLang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN';
        langToggle.textContent = newButtonText;
      }
      
      setLanguage(nextLang);
    });

    // NAV toggle
    navToggle?.addEventListener('click', (e) => {
      console.log('Nav toggle clicked');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if (navList) navList.classList.toggle('show');
    });

    // Close nav on link click (mobile)
    navList?.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        navList.classList.remove('show');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // THEME toggle
    themeToggle?.addEventListener('click', (e) => {
      console.log('Theme toggle clicked');
      const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
    
    console.log('✓ Event listeners attached successfully');
  }

  // Setup event listeners when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEventListeners);
  } else {
    setupEventListeners();
  }



  /* CONTACT TABS functionality */
  function initContactTabs() {
    console.log('✓ Initializing contact tabs...');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    console.log('✓ Found', tabBtns.length, 'tab buttons and', tabPanels.length, 'tab panels');

    function switchTab(targetTabId) {
      // Remove active class from all tabs and panels
      tabBtns.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Add active class to clicked tab and corresponding panel
      const activeBtn = document.querySelector(`[aria-controls="${targetTabId}"]`);
      const activePanel = document.getElementById(targetTabId);
      
      if (activeBtn && activePanel) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
        activePanel.classList.add('active');
      }
    }

    // Add click event listeners to tab buttons
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTabId = btn.getAttribute('aria-controls');
        switchTab(targetTabId);
      });

      // Add keyboard navigation for accessibility
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const targetTabId = btn.getAttribute('aria-controls');
          switchTab(targetTabId);
        }
      });
    });
  }

  // Initialize tabs when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactTabs);
  } else {
    initContactTabs();
  }

  /* CONTACT FORM validation + mock submit */
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success');
  
  console.log('✓ Contact form element:', form ? 'Found' : 'NOT FOUND');

  function showError(input, message) {
    const id = input.id;
    const errorEl = document.getElementById('error-' + id);
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input) {
    const id = input.id;
    const errorEl = document.getElementById('error-' + id);
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function showFormError(message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-error';
    errorMsg.innerHTML = message;
    errorMsg.style.cssText = 'color: #ff6b6b; margin-top: 1rem; padding: 0.75rem; border-radius: 8px; background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.2); font-size: 0.9rem; line-height: 1.4;';
    
    // Remove any existing error messages
    const existingError = form.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    form.appendChild(errorMsg);
    setTimeout(() => errorMsg.remove(), 10000);
  }

  if (form) {
    console.log('✓ Attaching contact form submit handler');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Contact form submitted');
      let valid = true;
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      // Basic validations
      if (!name.value || name.value.trim().length < 2) {
        showError(name, 'Please enter your name (2+ characters).');
        valid = false;
      } else clearError(name);

      if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
        showError(email, 'Please enter a valid email.');
        valid = false;
      } else clearError(email);

      if (!message.value || message.value.trim().length < 10) {
        showError(message, 'Message must be 10+ characters.');
        valid = false;
      } else clearError(message);

      if (!valid) return;

      // Submit to Formspree
      // Copy email to _replyto field for Formspree
      const replyToField = document.getElementById('hidden-replyto');
      if (replyToField) {
        replyToField.value = email.value;
      }
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Debug: Log form data
      console.log('Form submission attempt:', {
        action: form.action,
        data: Object.fromEntries(formData.entries())
      });
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        console.log('Form response:', response.status, response.statusText);
        if (response.ok) {
          return response.json().then(data => {
            console.log('Success response:', data);
            // Check if this is a verification response
            if (data.ok === false && data.message && data.message.includes('verify')) {
              // Formspree verification required
              showFormError(`<strong>Verification Required:</strong> Formspree needs to verify this form first. Please check your email and click the verification link, then try submitting again. <br><br><em>This only happens once for security.</em>`);
            } else {
              // Success
              successBox.hidden = false;
              successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
              form.reset();
              setTimeout(() => successBox.hidden = true, 8000);
            }
          });
        } else if (response.status === 422) {
          // Formspree validation error (likely verification needed)
          return response.json().then(data => {
            console.log('Validation response:', data);
            showFormError(`<strong>Form Setup Required:</strong> This form needs to be verified by Formspree first. Please check the form owner's email for a verification link. <br><br><em>After verification, the form will work normally.</em>`);
          });
        } else {
          return response.json().then(data => {
            console.error('Error response:', data);
            throw new Error(`Form submission failed: ${response.status} ${response.statusText}`);
          }).catch(() => {
            throw new Error(`Form submission failed: ${response.status} ${response.statusText}`);
          });
        }
      })
      .catch(error => {
        console.error('Form submission error:', error);
        
        // Check if this is a CORS issue (common with file:// protocol)
        if (window.location.protocol === 'file:') {
          // For file:// protocol, show message about opening in server
          showFormError('Please open this website on a web server (not file://) for the contact form to work. Alternatively, you can submit the form directly at: https://formspree.io/f/xgvpaqlq');
        } else {
          // Show generic error message with fallback and verification info
          showFormError(`Sorry, there was an error sending your message. This might be because Formspree verification is required. <br><br><strong>Fallback option:</strong> <a href="#" onclick="document.getElementById('contact-form').noValidate=false; document.getElementById('contact-form').submit(); return false;" style="color: #7dd3fc; text-decoration: underline;">Click here to submit via regular form submission</a> <br><br><em>Note: First-time submissions may require email verification for security.</em>`);
        }
      })
      .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
    });
  }

  /* LIGHTBOX for gallery */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    const fullSrc = item.getAttribute('data-full');
    const alt = item.querySelector('img').alt;
    
    lightboxContent.innerHTML = `<img src="${fullSrc}" alt="${alt}">`;
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    galleryItems[currentIndex].focus();
  }

  function prevImage() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
    openLightbox(currentIndex);
  }

  function nextImage() {
    currentIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
    openLightbox(currentIndex);
  }

  // Gallery click handlers
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  // Lightbox controls
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', prevImage);
  lightboxNext?.addEventListener('click', nextImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    }
  });

  // Close lightbox on background click
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

})();

// AI Video Generation and Success Screen Handler
(function() {
  const onboardingForm = document.getElementById('onboarding-form');
  const generateVideoBtn = document.getElementById('generate-video-btn');
  const aiVideoPlaceholder = document.getElementById('ai-video-placeholder');
  const generatedVideo = document.getElementById('generated-video');
  const videoTopics = document.getElementById('video-topics');
  const scheduleCallBtn = document.getElementById('schedule-call-btn');

  // Store onboarding responses for personalized video
  let onboardingData = {};

  // Handle form submission success
  if (onboardingForm) {
    console.log('✓ Onboarding form submit handler attached');
    onboardingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('📝 Onboarding form submitted!');
      
      // Collect form data
      const formData = new FormData(onboardingForm);
      onboardingData = Object.fromEntries(formData.entries());
      console.log('Form data collected:', Object.keys(onboardingData).length, 'fields');
      
      // Submit to Formspree
      fetch(onboardingForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('✓ Formspree response received:', data);
        if (data.ok) {
          showSuccessScreen();
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(error => {
        console.error('❌ Onboarding submission error:', error);
        showErrorMessage('There was an error submitting your onboarding. Please try again.');
      });
    });
  }

  // Show success screen after successful onboarding
  function showSuccessScreen() {
    // Hide all steps
    document.querySelectorAll('.onboarding-step').forEach(step => {
      step.style.display = 'none';
      step.classList.remove('active');
    });
    
    // Show success screen
    const successStep = document.querySelector('.onboarding-success');
    if (successStep) {
      successStep.style.display = 'block';
      successStep.classList.add('active');
    }
    
    // Update progress to 100%
    const progressFill = document.getElementById('onboarding-progress');
    if (progressFill) {
      progressFill.style.width = '100%';
    }
    
    // Hide navigation buttons
    const navButtons = document.querySelector('.onboarding-nav');
    if (navButtons) {
      navButtons.style.display = 'none';
    }
  }

  // AI Video Generation Handler
  if (generateVideoBtn) {
    generateVideoBtn.addEventListener('click', function() {
      generatePersonalizedVideo();
    });
  }

  // Generate personalized AI video based on onboarding responses
  function generatePersonalizedVideo() {
    const videoBtn = generateVideoBtn;
    const originalContent = videoBtn.innerHTML;
    
    // Show loading state
    videoBtn.innerHTML = `
      <div class="loading-spinner"></div>
      <span>Generating your personalized video...</span>
    `;
    videoBtn.style.pointerEvents = 'none';
    
    // Simulate AI video generation (replace with actual AI service)
    setTimeout(() => {
      // Analyze onboarding data to determine video content
      const videoTopicsList = generateVideoTopics(onboardingData);
      
      // Hide placeholder and show generated video
      aiVideoPlaceholder.style.display = 'none';
      generatedVideo.style.display = 'block';
      
      // Set video source (in production, this would be the AI-generated video URL)
      const videoSource = document.getElementById('video-source');
      const downloadLink = document.getElementById('video-download');
      
      // For demo purposes, use a placeholder video
      // In production, this would be the URL returned from your AI video generation service
      const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      if (videoSource) {
        videoSource.src = demoVideoUrl;
      }
      if (downloadLink) {
        downloadLink.href = demoVideoUrl;
      }
      
      // Populate video topics
      if (videoTopics) {
        videoTopics.innerHTML = videoTopicsList.map(topic => `<li>${topic}</li>`).join('');
      }
      
      // Reset button
      videoBtn.innerHTML = originalContent;
      videoBtn.style.pointerEvents = 'auto';
      
    }, 3000); // 3 second simulation
  }

  // Generate video topics based on onboarding responses
  function generateVideoTopics(data) {
    const topics = [];
    
    // Base topics
    topics.push('Welcome to Aurora - Your project overview');
    topics.push('Timeline and milestone expectations');
    
    // Customize based on responses
    if (data.project_type) {
      topics.push(`Specific guidance for ${data.project_type} projects`);
    }
    
    if (data.budget_range) {
      topics.push('Budget allocation and payment schedule');
    }
    
    if (data.timeline === 'urgent') {
      topics.push('Fast-track development process');
    }
    
    if (data.features && data.features.includes('e-commerce')) {
      topics.push('E-commerce integration best practices');
    }
    
    if (data.features && data.features.includes('cms')) {
      topics.push('Content management system setup');
    }
    
    // Always include these
    topics.push('Brand asset preparation checklist');
    topics.push('Communication preferences and channels');
    topics.push('Next steps and immediate action items');
    
    return topics;
  }

  // Schedule call handler
  if (scheduleCallBtn) {
    scheduleCallBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // In production, integrate with scheduling service like Calendly
      const schedulingUrl = 'https://calendly.com/aurora-templates/consultation';
      
      // For demo, show scheduling modal or redirect
      if (confirm('Would you like to schedule a consultation call? This will open our scheduling page.')) {
        window.open(schedulingUrl, '_blank');
      }
    });
  }

  // Add loading spinner styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

})();

// Aurora Genie AI Assistant with Magical Interactions
(function() {
  // Genie Elements
  const auroraGenie = document.getElementById('aurora-genie');
  const magicLamp = document.getElementById('magic-lamp');
  const genieAvatar = document.getElementById('genie-avatar');
  const genieSpeech = document.getElementById('genie-speech');
  const genieMessage = document.getElementById('genie-message');
  const genieChatBtn = document.getElementById('genie-chat-btn');
  const magicSmoke = document.getElementById('magic-smoke');
  const magicEffects = document.getElementById('magic-effects');
  const teleportIndicator = document.getElementById('teleport-indicator');

  // Chat Elements
  const chatWidget = document.getElementById('ai-chat-widget');
  const chatClose = document.getElementById('chat-close');
  const chatMinimize = document.getElementById('chat-minimize');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  let isTyping = false;
  let conversationHistory = [];

  // Comprehensive Business Knowledge Base
  const businessKnowledge = {
    pricing: {
      standard: { price: 997, features: ['Professional website', 'Multi-language', 'SEO optimization', '6 months support'] },
      premium: { price: 2497, features: ['Everything in Standard', 'Animated counters', 'Video backgrounds', 'Blog system', 'Analytics'] },
      enterprise: { price: 4997, features: ['Everything in Premium', 'E-commerce', 'Customer portal', 'PWA', 'Security suite'] },
      ultimate: { price: 9997, features: ['Everything in Enterprise', 'AI features', 'VR integration', 'Voice interface', 'Multi-language AI'] }
    },
    features: [
      'Professional responsive design',
      'Multi-language support (English/Spanish)',
      'SEO optimization with structured data',
      'Contact forms with Formspree integration',
      'Client testimonials and Google reviews',
      'Interactive onboarding system',
      'AI-generated next steps video',
      'Dark/light mode toggle',
      'Accessibility compliant (ADA/WCAG)',
      'Mobile-first design',
      'Performance optimized (2-3s load time)',
      'Social media integration'
    ],
    timeline: {
      customization: '3-7 days',
      launch: '1-2 weeks total',
      training: '30 minutes',
      support: '6 months included'
    },
    contact: {
      email: 'hello@aurorawebsites.com',
      phone: '(555) 123-4567',
      calendar: 'calendly.com/aurora-websites'
    },
    faqs: [
      {
        q: 'what makes aurora different',
        a: 'Aurora is production-ready with enterprise features like AI onboarding, multi-language support, and professional design that competes with Fortune 100 companies. Unlike template marketplaces, Aurora is business-ready from day one.'
      },
      {
        q: 'how long does it take',
        a: 'Customization takes 3-7 days, and your website launches within 1-2 weeks total. This includes setup, customization, training, and support.'
      },
      {
        q: 'do you offer support',
        a: 'Yes! All packages include 6 months of email support, customization training, and ongoing assistance. Premium packages include phone support and priority handling.'
      },
      {
        q: 'is it mobile friendly',
        a: 'Absolutely! Aurora is mobile-first designed and fully responsive. It looks perfect on phones, tablets, and desktops with optimized performance.'
      },
      {
        q: 'can i update content myself',
        a: 'Yes! Aurora is built with clean, semantic HTML/CSS. We provide training and documentation so you can make content updates easily.'
      },
      {
        q: 'what about seo',
        a: 'Aurora includes complete SEO optimization: meta tags, structured data, XML sitemap, fast loading, mobile optimization, and social media integration.'
      },
      {
        q: 'do you handle hosting',
        a: 'We provide hosting recommendations and setup assistance. Aurora works with any hosting provider, and we can help with the technical setup.'
      },
      {
        q: 'what languages are supported',
        a: 'Aurora includes full English/Spanish support with easy expansion to additional languages. The multi-language system is professional-grade and SEO-optimized.'
      }
    ]
  };

  // Initialize chat
  function initChat() {
    // Chat is now triggered by genie button
    if (chatClose) {
      chatClose.addEventListener('click', closeChat);
    }
    if (chatMinimize) {
      chatMinimize.addEventListener('click', minimizeChat);
    }
    if (chatSend) {
      chatSend.addEventListener('click', sendMessage);
    }
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    // Quick action buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-btn')) {
        handleQuickAction(e.target.dataset.action);
      }
      if (e.target.classList.contains('suggestion-btn')) {
        chatInput.value = e.target.dataset.suggestion;
        sendMessage();
      }
    });

    // Show notification after 10 seconds
    setTimeout(() => {
      if (notificationBadge) {
        notificationBadge.style.display = 'flex';
      }
    }, 10000);
  }

  function openChat() {
    if (chatWidget) {
      chatWidget.setAttribute('aria-hidden', 'false');
      if (chatInput) chatInput.focus();
      
      // Hide genie when chat opens
      if (genieState.isVisible) {
        hideGenie();
      }
      
      // Add special genie welcome message
      setTimeout(() => {
        const genieWelcome = `🧞‍♂️ *Poof!* The Aurora Genie is here to help! I've been watching your journey through the site. What magical website solution can I create for you today?`;
        addMessage(genieWelcome, 'ai');
      }, 1000);
    }
  }

  function closeChat() {
    if (chatWidget) {
      chatWidget.setAttribute('aria-hidden', 'true');
    }
  }

  function minimizeChat() {
    closeChat();
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    conversationHistory.push({ role: 'user', content: message });

    // Generate AI response
    setTimeout(() => {
      const response = generateAIResponse(message);
      addMessage(response, 'ai');
      conversationHistory.push({ role: 'ai', content: response });
    }, 1000 + Math.random() * 2000); // Realistic response delay
  }

  function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'ai' ? '🤖' : '👤';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        <div class="message-bubble">
          ${typeof content === 'string' ? `<p>${content}</p>` : content}
        </div>
        <div class="message-time">${time}</div>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // FAQ Pattern Matching
    for (const faq of businessKnowledge.faqs) {
      if (message.includes(faq.q) || faq.q.split(' ').some(word => message.includes(word))) {
        return faq.a;
      }
    }

    // Pricing Inquiries
    if (message.includes('price') || message.includes('cost') || message.includes('pricing') || message.includes('how much')) {
      return `<p><strong>Aurora Pricing Options:</strong></p>
              <ul>
                <li><strong>Standard ($${businessKnowledge.pricing.standard.price}):</strong> ${businessKnowledge.pricing.standard.features.join(', ')}</li>
                <li><strong>Premium ($${businessKnowledge.pricing.premium.price}):</strong> ${businessKnowledge.pricing.premium.features.join(', ')}</li>
                <li><strong>Enterprise ($${businessKnowledge.pricing.enterprise.price}):</strong> ${businessKnowledge.pricing.enterprise.features.join(', ')}</li>
              </ul>
              <p>Would you like to book a consultation to discuss which option fits your business best?</p>`;
    }

    // Feature Inquiries
    if (message.includes('feature') || message.includes('what does') || message.includes('include')) {
      return `<p><strong>Aurora includes these powerful features:</strong></p>
              <ul>
                ${businessKnowledge.features.slice(0, 6).map(f => `<li>${f}</li>`).join('')}
              </ul>
              <p>Plus many more! Which specific feature interests you most?</p>`;
    }

    // Timeline Inquiries
    if (message.includes('timeline') || message.includes('how long') || message.includes('when')) {
      return `<p><strong>Aurora Timeline:</strong></p>
              <ul>
                <li><strong>Customization:</strong> ${businessKnowledge.timeline.customization}</li>
                <li><strong>Total Launch:</strong> ${businessKnowledge.timeline.launch}</li>
                <li><strong>Training:</strong> ${businessKnowledge.timeline.training}</li>
                <li><strong>Support:</strong> ${businessKnowledge.timeline.support}</li>
              </ul>
              <p>Ready to get started? I can connect you with our team!</p>`;
    }

    // Contact Inquiries
    if (message.includes('contact') || message.includes('call') || message.includes('phone') || message.includes('email')) {
      return `<p><strong>Contact Our Team:</strong></p>
              <ul>
                <li><strong>📧 Email:</strong> ${businessKnowledge.contact.email}</li>
                <li><strong>📱 Phone:</strong> ${businessKnowledge.contact.phone}</li>
                <li><strong>📅 Schedule Call:</strong> ${businessKnowledge.contact.calendar}</li>
              </ul>
              <p>I can also start your onboarding process right now if you're ready!</p>`;
    }

    // Demo/Consultation Requests
    if (message.includes('demo') || message.includes('consultation') || message.includes('call') || message.includes('meeting')) {
      return `<p>I'd love to set up a consultation for you! 🎯</p>
              <p><strong>Our 15-minute strategy call includes:</strong></p>
              <ul>
                <li>Analysis of your current website needs</li>
                <li>Recommendations for your business</li>
                <li>Live Aurora demo customized for your industry</li>
                <li>Pricing options and next steps</li>
              </ul>
              <p>Book instantly at: <strong>${businessKnowledge.contact.calendar}</strong></p>
              <p>Or I can have our team call you - what's your preferred time?</p>`;
    }

    // Get Started/Onboarding
    if (message.includes('get started') || message.includes('onboard') || message.includes('begin') || message.includes('start')) {
      return `<p>Excellent! Let's get your Aurora website started! 🚀</p>
              <p><strong>Next steps:</strong></p>
              <ol>
                <li>Complete our 5-month onboarding form (takes 15 minutes)</li>
                <li>Schedule your strategy call</li>
                <li>We customize Aurora for your business</li>
                <li>Launch your professional website!</li>
              </ol>
              <p>Would you like to start the onboarding process now or schedule a call first?</p>`;
    }

    // Comparison Inquiries
    if (message.includes('vs') || message.includes('compare') || message.includes('difference') || message.includes('better')) {
      return `<p><strong>Aurora vs. Competitors:</strong></p>
              <ul>
                <li><strong>vs. DIY Builders:</strong> Professional design, no monthly fees, full ownership</li>
                <li><strong>vs. Cheap Templates:</strong> Business-ready, proven conversion optimization</li>
                <li><strong>vs. Custom Development:</strong> 90% of benefits at 20% of cost, immediate delivery</li>
                <li><strong>vs. Agencies:</strong> One-time payment, no ongoing fees, full control</li>
              </ul>
              <p>Aurora delivers Fortune 100 quality at small business prices!</p>`;
    }

    // Default helpful response
    const defaultResponses = [
      `That's a great question! 🤔 I can help you with information about Aurora's pricing, features, timeline, or getting started. What specific aspect interests you most?`,
      `I'm here to help you discover how Aurora can transform your business! 💼 Would you like to know about our pricing options, see a demo, or start your onboarding?`,
      `Let me connect you with the right information! 🎯 Are you interested in learning about Aurora's features, pricing, or would you like to speak with our team?`,
      `Aurora has helped hundreds of businesses establish their professional online presence! 🌟 What's most important for your business - design, functionality, or getting started quickly?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  function handleQuickAction(action) {
    switch (action) {
      case 'pricing':
        addMessage(generateAIResponse('pricing'), 'ai');
        break;
      case 'demo':
        addMessage(generateAIResponse('demo'), 'ai');
        break;
      case 'contact':
        addMessage(generateAIResponse('contact'), 'ai');
        break;
      case 'onboarding':
        // Trigger onboarding modal
        const onboardingBtn = document.getElementById('onboarding-btn');
        if (onboardingBtn) {
          onboardingBtn.click();
          closeChat();
        }
        addMessage('Perfect! I\'ve opened the onboarding form for you. Complete it to get started with your Aurora website! 🚀', 'ai');
        break;
    }
  }

  // Genie State Management
  let genieState = {
    isVisible: false,
    currentPosition: 1,
    hasAppeared: false,
    isInteracting: false,
    visitedSections: new Set(),
    lastInteraction: Date.now()
  };

  // Genie Positions and Contextual Messages
  const geniePositions = [
    { 
      class: 'position-1', 
      section: 'footer',
      message: '🌟 Ready to transform your business? Let me show you Aurora\'s magic!',
      trigger: () => window.scrollY > document.body.scrollHeight - window.innerHeight - 200
    },
    { 
      class: 'position-2', 
      section: 'contact',
      message: '📞 Need to get in touch? I can help you connect with our team instantly!',
      trigger: () => isInViewport(document.getElementById('contact'))
    },
    { 
      class: 'position-3', 
      section: 'testimonials',
      message: '⭐ See these amazing reviews? Your business could be next!',
      trigger: () => isInViewport(document.getElementById('testimonials'))
    },
    { 
      class: 'position-4', 
      section: 'features',
      message: '✨ These powerful features will make your website shine like magic!',
      trigger: () => isInViewport(document.getElementById('features'))
    },
    { 
      class: 'position-5', 
      section: 'projects',
      message: '🎨 Impressed by these projects? Your website will look even better!',
      trigger: () => isInViewport(document.getElementById('projects'))
    },
    { 
      class: 'position-6', 
      section: 'hero',
      message: '👋 Welcome to Aurora! I\'m here to make your website dreams come true!',
      trigger: () => window.scrollY < 300
    }
  ];

  // Genie Contextual Responses
  const genieContextualMessages = {
    pricing: [
      '💰 Aurora packages start at just $997 - that\'s less than most designers charge for a logo!',
      '🎯 With Aurora Premium at $2497, you get everything most agencies charge $10K+ for!',
      '💎 Want the ultimate? Aurora Enterprise gives you Fortune 100 features at small business prices!'
    ],
    features: [
      '🚀 Aurora loads in under 3 seconds - faster than 85% of websites!',
      '🌍 Multi-language support means you can serve global customers instantly!',
      '📱 Mobile-first design captures the 60% of visitors using phones!'
    ],
    onboarding: [
      '📋 The onboarding process takes just 15 minutes but saves you weeks of back-and-forth!',
      '🎬 You\'ll even get a personalized AI video with your next steps!',
      '✅ Everything is automated so you can focus on running your business!'
    ],
    timeline: [
      '⏰ Your website launches in just 1-2 weeks - not months like custom development!',
      '🛠️ Customization takes 3-7 days, then you\'re live and generating leads!',
      '📞 We include 6 months of support so you\'re never stuck!'
    ]
  };

  // Contextual Genie Triggers
  function addContextualTriggers() {
    // Pricing section hover
    const pricingElements = document.querySelectorAll('[data-i18n*="pricing"], .pricing, [href*="pricing"]');
    pricingElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (Math.random() < 0.3) {
          updateGenieMessage('pricing');
        }
      });
    });

    // Features section interaction
    const featureElements = document.querySelectorAll('#features .feature, [data-i18n*="feature"]');
    featureElements.forEach(el => {
      el.addEventListener('click', () => {
        if (Math.random() < 0.4) {
          updateGenieMessage('features');
        }
      });
    });

    // Onboarding button interactions
    const onboardingBtn = document.getElementById('onboarding-btn');
    if (onboardingBtn) {
      onboardingBtn.addEventListener('mouseenter', () => {
        if (Math.random() < 0.5) {
          updateGenieMessage('onboarding');
        }
      });
    }

    // Contact section focus
    const contactInputs = document.querySelectorAll('#contact input, #contact textarea');
    contactInputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (Math.random() < 0.3 && !genieState.isVisible) {
          if (genieMessage) {
            genieMessage.textContent = '📞 Need help with your message? I can suggest what to include for the best response!';
          }
          summonGenie();
        }
      });
    });

    // Testimonials section
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach(testimonial => {
      testimonial.addEventListener('mouseenter', () => {
        if (Math.random() < 0.2) {
          if (genieMessage) {
            genieMessage.textContent = '⭐ These clients got amazing results! Your business could have the same success story!';
          }
          if (!genieState.isVisible) {
            setTimeout(summonGenie, 500);
          }
        }
      });
    });

    // Gallery/Projects interaction
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        if (Math.random() < 0.3) {
          setTimeout(() => {
            if (genieMessage) {
              genieMessage.textContent = '🎨 Impressed? Your website will be even more stunning with Aurora\'s professional design!';
            }
            if (!genieState.isVisible) {
              summonGenie();
            }
          }, 1000);
        }
      });
    });

    // Language toggle interaction
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        setTimeout(() => {
          if (genieMessage) {
            genieMessage.textContent = '🌍 ¡Hola! Aurora speaks multiple languages to serve your global customers!';
          }
          if (!genieState.isVisible && Math.random() < 0.6) {
            summonGenie();
          }
        }, 800);
      });
    }

    // Exit intent detection
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !genieState.hasAppeared) {
        if (genieMessage) {
          genieMessage.textContent = '🛑 Wait! Before you go, let me show you how Aurora can transform your business in just 2 weeks!';
        }
        setTimeout(summonGenie, 500);
      }
    });

    // Idle detection
    let idleTimer;
    function resetIdleTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!genieState.isVisible && Math.random() < 0.4) {
          if (genieMessage) {
            genieMessage.textContent = '💭 Still exploring? I\'m here if you need any guidance about Aurora\'s features!';
          }
          summonGenie();
        }
      }, 45000); // 45 seconds
    }

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });
    resetIdleTimer();
  }

  // Utility Functions
  function isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function getRandomMessage(category) {
    const messages = genieContextualMessages[category];
    return messages ? messages[Math.floor(Math.random() * messages.length)] : '';
  }

  // Genie Animation Functions
  function summonGenie() {
    if (genieState.isVisible || genieState.isInteracting) return;
    
    genieState.isInteracting = true;
    
    // Show magic smoke
    if (magicSmoke) {
      magicSmoke.classList.add('active');
    }
    
    // Show magic effects
    if (magicEffects) {
      magicEffects.style.opacity = '1';
    }
    
    setTimeout(() => {
      // Hide lamp, show genie
      if (magicLamp) magicLamp.style.opacity = '0';
      if (genieAvatar) {
        genieAvatar.style.display = 'block';
        genieAvatar.style.animation = 'genieAppear 1s ease-out forwards';
      }
      
      setTimeout(() => {
        // Show speech bubble
        if (genieSpeech) {
          genieSpeech.style.display = 'block';
        }
        
        setTimeout(() => {
          // Show chat button
          if (genieChatBtn) {
            genieChatBtn.style.display = 'block';
          }
          genieState.isVisible = true;
          genieState.hasAppeared = true;
          genieState.isInteracting = false;
          genieState.lastInteraction = Date.now();
          
          // Auto-hide after 8 seconds if no interaction
          setTimeout(() => {
            if (!genieState.isInteracting) {
              hideGenie();
            }
          }, 8000);
          
        }, 500);
      }, 1000);
    }, 800);
  }

  function hideGenie() {
    if (!genieState.isVisible || genieState.isInteracting) return;
    
    genieState.isInteracting = true;
    
    // Hide elements in reverse order
    if (genieChatBtn) genieChatBtn.style.display = 'none';
    if (genieSpeech) genieSpeech.style.display = 'none';
    
    setTimeout(() => {
      if (genieAvatar) {
        genieAvatar.style.animation = 'genieDisappear 0.8s ease-in forwards';
      }
      
      setTimeout(() => {
        if (genieAvatar) genieAvatar.style.display = 'none';
        if (magicLamp) magicLamp.style.opacity = '1';
        if (magicSmoke) magicSmoke.classList.remove('active');
        if (magicEffects) magicEffects.style.opacity = '0';
        
        genieState.isVisible = false;
        genieState.isInteracting = false;
        
        // Plan next teleportation
        setTimeout(() => {
          teleportGenie();
        }, 2000 + Math.random() * 3000); // 2-5 seconds
        
      }, 800);
    }, 300);
  }

  function teleportGenie() {
    if (genieState.isInteracting) return;
    
    // Show teleport effect
    if (teleportIndicator) {
      teleportIndicator.style.opacity = '1';
      teleportIndicator.style.animation = 'teleportPulse 1s ease-out';
    }
    
    setTimeout(() => {
      // Find best position based on current viewport
      let bestPosition = findBestPosition();
      
      if (bestPosition) {
        // Remove old position class
        if (auroraGenie) {
          auroraGenie.className = auroraGenie.className.replace(/position-\d+/g, '');
          auroraGenie.classList.add(bestPosition.class);
        }
        
        // Update message
        if (genieMessage) {
          genieMessage.textContent = bestPosition.message;
        }
        
        genieState.currentPosition = geniePositions.indexOf(bestPosition) + 1;
        genieState.visitedSections.add(bestPosition.section);
        
        // Maybe summon genie based on context
        if (Math.random() < 0.3 && Date.now() - genieState.lastInteraction > 15000) {
          setTimeout(summonGenie, 1000);
        }
      }
      
      if (teleportIndicator) {
        teleportIndicator.style.opacity = '0';
      }
    }, 500);
  }

  function findBestPosition() {
    // Find positions where trigger conditions are met
    const availablePositions = geniePositions.filter(pos => pos.trigger());
    
    if (availablePositions.length === 0) {
      return geniePositions[0]; // Default position
    }
    
    // Prefer unvisited sections
    const unvisitedPositions = availablePositions.filter(pos => 
      !genieState.visitedSections.has(pos.section)
    );
    
    const chooseFrom = unvisitedPositions.length > 0 ? unvisitedPositions : availablePositions;
    return chooseFrom[Math.floor(Math.random() * chooseFrom.length)];
  }

  function updateGenieMessage(topic) {
    if (genieMessage && genieContextualMessages[topic]) {
      const message = getRandomMessage(topic);
      genieMessage.textContent = message;
      
      // Show message briefly
      if (!genieState.isVisible) {
        summonGenie();
      }
    }
  }

  // Initialize genie
  function initGenie() {
    if (auroraGenie) {
      // Add click handler for magic lamp
      if (magicLamp) {
        magicLamp.addEventListener('click', () => {
          console.log('Magic lamp clicked');
          if (!genieState.isVisible) {
            summonGenie();
          } else {
            // If genie is visible, clicking lamp again can open chat directly
            if (genieChatBtn) {
              genieChatBtn.click();
            }
          }
        });
        magicLamp.style.cursor = 'pointer';
        magicLamp.title = 'Click to summon the Aurora Genie!';
      }
      
      // Add click handler for "Chat with Genie" button
      if (genieChatBtn) {
        genieChatBtn.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('Genie chat button clicked');
          genieState.isInteracting = true;
          
          // Hide genie elements
          if (genieAvatar) genieAvatar.style.display = 'none';
          if (genieSpeech) genieSpeech.style.display = 'none';
          if (genieChatBtn) genieChatBtn.style.display = 'none';
          if (magicLamp) magicLamp.style.opacity = '1';
          genieState.isVisible = false;
          
          // Open chat widget using the proper function
          setTimeout(() => {
            openChat();
            // Add a welcome message from the genie
            setTimeout(() => {
              addMessage('✨ Hello! I\'m your Aurora Genie! How can I help bring your website dreams to life?', 'ai');
            }, 300);
          }, 100);
        });
      }
      
      // Start with initial teleportation after page load
      setTimeout(() => {
        teleportGenie();
      }, 3000);
      
      // Periodic teleportation
      setInterval(() => {
        if (!genieState.isInteracting && Math.random() < 0.3) {
          teleportGenie();
        }
      }, 20000); // Every 20 seconds
      
      // Show genie on first visit after 10 seconds
      setTimeout(() => {
        if (!genieState.hasAppeared && Math.random() < 0.7) {
          summonGenie();
        }
      }, 10000);
    }
  }

  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initChat();
      initGenie();
      addContextualTriggers();
    });
  } else {
    initChat();
    initGenie();
    addContextualTriggers();
  }

})();

// Onboarding Modal Functionality
(function() {
  function initOnboarding() {
    const onboardingBtn = document.getElementById('onboarding-btn');
    const onboardingModal = document.getElementById('onboarding-modal');
    const onboardingClose = document.getElementById('onboarding-close');
    const onboardingForm = document.getElementById('onboarding-form');
    const onboardingSteps = document.querySelectorAll('.onboarding-step');
    const onboardingProgress = document.getElementById('onboarding-progress');
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');

    if (!onboardingBtn || !onboardingModal) {
      console.warn('Onboarding elements not found');
      return;
    }

    let currentStep = 1;
    const totalSteps = 6;

    // Open onboarding modal
    function openOnboarding() {
      console.log('Opening onboarding modal');
      if (onboardingModal) {
        onboardingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        showStep(1);
        updateProgress();
      }
    }

    // Close onboarding modal
    function closeOnboarding() {
      console.log('Closing onboarding modal');
      if (onboardingModal) {
        onboardingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

  // Show specific step
  function showStep(step) {
    onboardingSteps.forEach((stepEl, index) => {
      if (index + 1 === step) {
        stepEl.style.display = 'block';
        stepEl.classList.add('active');
      } else {
        stepEl.style.display = 'none';
        stepEl.classList.remove('active');
      }
    });
    
    currentStep = step;
    updateNavigation();
    updateProgress();
  }

  // Update navigation buttons
  function updateNavigation() {
    if (prevBtn) {
      prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    }
    if (nextBtn) {
      if (currentStep === totalSteps) {
        console.log('✓ Last step reached - button changing to Submit');
        nextBtn.textContent = 'Submit';
        nextBtn.type = 'submit';
      } else {
        nextBtn.textContent = 'Next →';
        nextBtn.type = 'button';
      }
    }
  }

  // Update progress bar
  function updateProgress() {
    if (onboardingProgress) {
      const progress = (currentStep / totalSteps) * 100;
      onboardingProgress.style.width = progress + '%';
    }
    // Update step text
    const currentStepText = document.getElementById('current-step');
    if (currentStepText) {
      currentStepText.textContent = currentStep;
    }
  }

  // Next step
  function nextStep() {
    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    } else {
      // Submit form
      submitOnboarding();
    }
  }

  // Previous step
  function prevStep() {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  }

  // Submit onboarding
  function submitOnboarding() {
    if (onboardingForm) {
      onboardingForm.dispatchEvent(new Event('submit'));
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (onboardingModal && onboardingModal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') {
        closeOnboarding();
      }
    }
  });

    // Event listeners
    console.log('Attaching onboarding event listeners');
    if (onboardingBtn) {
      onboardingBtn.addEventListener('click', openOnboarding);
      console.log('Onboarding button click handler attached');
    }

    if (onboardingClose) {
      onboardingClose.addEventListener('click', closeOnboarding);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        console.log('Next button clicked, type:', e.target.type);
        if (e.target.type === 'button') {
          e.preventDefault();
          nextStep();
        } else if (e.target.type === 'submit') {
          console.log('Submit button clicked - form will submit naturally');
          // Let the form submit naturally - don't prevent default
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevStep();
      });
    }

    // Close on background click
    if (onboardingModal) {
      onboardingModal.addEventListener('click', (e) => {
        if (e.target === onboardingModal) {
          closeOnboarding();
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnboarding);
  } else {
    initOnboarding();
  }

})();
