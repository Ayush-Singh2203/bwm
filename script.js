/* ===========================
   BWM – script.js  (v3)
   =========================== */

/* ─────────────────────────────────────────────
   GOOGLE ADS CONVERSION IDs
   ─────────────────────────────────────────────
   Account tag:   AW-18205040266
   Phone/WA/Email click: AW-18205040266/XsOaCJz91vAcEIq96-hD
   Brochure download:    AW-18205040266/XsOaCJz91vAcEIq96-hD  (reuse or create separate)
   Form submission:      AW-18205040266/XsOaCJz91vAcEIq96-hD  (reuse or create separate)
   ───────────────────────────────────────────── */
var CONV_PHONE    = 'AW-18205040266/XsOaCJz91vAcEIq96-hD';
var CONV_EMAIL    = 'AW-18205040266/XsOaCJz91vAcEIq96-hD';
var CONV_BROCHURE = 'AW-18205040266/XsOaCJz91vAcEIq96-hD';
var CONV_FORM     = 'AW-18205040266/XsOaCJz91vAcEIq96-hD';

/* Helper: fire a Google Ads + GA4 conversion */
function fireConversion(sendTo, value) {
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      send_to: sendTo,
      value: value || 1.0,
      currency: 'INR'
    });
  }
}


document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════
     1. STICKY HEADER SHADOW
     ════════════════════════════════════════════ */
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ════════════════════════════════════════════
     2. MOBILE HAMBURGER
     ════════════════════════════════════════════ */
  var hamburger = document.getElementById('hamburger');
  var mainNav   = document.getElementById('main-nav');

  hamburger.addEventListener('click', function () {
    var open = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  /* ════════════════════════════════════════════
     3. ACTIVE NAV ON SCROLL
     ════════════════════════════════════════════ */
  var sections = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    var scrollPos = window.scrollY + header.offsetHeight + 40;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  /* ════════════════════════════════════════════
     4. SMOOTH SCROLL WITH HEADER OFFSET
     ════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = header.offsetHeight + 8;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        closeModal(exitPopup);
      }
    });
  });


  /* ════════════════════════════════════════════
     5. WEAVING STYLE TABS
     ════════════════════════════════════════════ */
  var weaveCards = document.querySelectorAll('.weave-card');
  var weaveImg   = document.getElementById('weave-img');
  var altMap     = { plain: 'Plain Weave Wire Mesh', twill: 'Twill Weave Wire Mesh', dutch: 'Dutch Weave Wire Mesh' };

  weaveCards.forEach(function (card) {
    card.addEventListener('click', function () {
      weaveCards.forEach(function (c) { c.classList.remove('active'); });
      card.classList.add('active');
      weaveImg.style.opacity = '0';
      setTimeout(function () {
        weaveImg.src = card.getAttribute('data-img');
        weaveImg.alt = altMap[card.getAttribute('data-weave')] || '';
        weaveImg.style.opacity = '1';
      }, 200);
    });
  });
  if (weaveImg) { weaveImg.style.transition = 'opacity 0.22s ease'; }


  /* ════════════════════════════════════════════
     6. FAQ ACCORDION
     ════════════════════════════════════════════ */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-trigger').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });


  /* ════════════════════════════════════════════
     7. CONTACT FORM (Formspree AJAX)
     ════════════════════════════════════════════ */
  var contactForm   = document.getElementById('contact-form');
  var contactStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          contactStatus.style.color = '#2a7a2a';
          contactStatus.textContent = '\u2713 Message sent! We\u2019ll be in touch shortly.';
          contactForm.reset();
          fireConversion(CONV_FORM, 1.0);
          if (typeof gtag === 'function') {
            gtag('event', 'form_submit', { event_category: 'Contact' });
          }
          setTimeout(function () { window.location.href = 'thank-you.html'; }, 800);
        } else {
          return res.json().then(function (json) {
            throw new Error(json.errors ? json.errors.map(function (er) { return er.message; }).join(', ') : 'Failed');
          });
        }
      })
      .catch(function () {
        contactStatus.style.color = '#c0392b';
        contactStatus.textContent = 'Something went wrong. Please call us directly.';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message \u2192';
      });
    });
  }


  /* ════════════════════════════════════════════
     8. PHONE, EMAIL & WHATSAPP CLICK TRACKING
     ════════════════════════════════════════════ */

  /* Phone clicks – GA4 event (Google Ads handled by gtag_report_conversion in HTML) */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_click', {
          event_category: 'Contact',
          event_label: link.href
        });
      }
    });
  });

  /* Email clicks */
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'email_click', {
          event_category: 'Contact',
          event_label: link.href
        });
        gtag('event', 'conversion', {
          send_to: CONV_EMAIL,
          value: 1.0,
          currency: 'INR'
        });
      }
    });
  });

  /* WhatsApp float */
  var whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
          event_category: 'Contact',
          event_label: 'WhatsApp Float Button'
        });
        gtag('event', 'conversion', {
          send_to: CONV_PHONE,
          value: 1.0,
          currency: 'INR'
        });
      }
    });
  }


  /* ════════════════════════════════════════════
     9. SCROLL DEPTH TRACKING (25, 50, 75, 90%)
     ════════════════════════════════════════════ */
  var scrollDepthFired = {};
  var depthMarks = [25, 50, 75, 90];
  window.addEventListener('scroll', function () {
    var scrollPct = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    depthMarks.forEach(function (mark) {
      if (scrollPct >= mark && !scrollDepthFired[mark]) {
        scrollDepthFired[mark] = true;
        if (typeof gtag === 'function') {
          gtag('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: mark + '%',
            value: mark
          });
        }
      }
    });
  }, { passive: true });


  /* ════════════════════════════════════════════
     10. BACK TO TOP
     ════════════════════════════════════════════ */
  var btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', function () {
    btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ════════════════════════════════════════════
     MODAL HELPERS
     ════════════════════════════════════════════ */
  function openModal(overlay) {
    if (!overlay) return;
    overlay.removeAttribute('hidden');
    void overlay.offsetWidth;
    overlay.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('modal-visible');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', function handler() {
      if (!overlay.classList.contains('modal-visible')) {
        overlay.setAttribute('hidden', '');
      }
      overlay.removeEventListener('transitionend', handler);
    });
  }

  function bindOverlayClose(overlay) {
    if (!overlay) return;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeModal(overlay); }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      [brochureModal, brochureThankyou, exitPopup].forEach(function (m) {
        if (m && m.classList.contains('modal-visible')) { closeModal(m); }
      });
    }
  });


  /* ════════════════════════════════════════════
     11. BROCHURE GATE POPUP
     ════════════════════════════════════════════ */
  var brochureModal    = document.getElementById('brochure-modal');
  var brochureThankyou = document.getElementById('brochure-thankyou');
  var brochureForm     = document.getElementById('brochure-form');
  var brochureStatus   = document.getElementById('brochure-status');
  var brochureClose    = document.getElementById('brochure-close');
  var thankyouClose    = document.getElementById('thankyou-close');

  document.querySelectorAll('.js-brochure-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(exitPopup);
      openModal(brochureModal);
      setTimeout(function () {
        var firstInput = brochureModal.querySelector('input');
        if (firstInput) { firstInput.focus(); }
      }, 320);
    });
  });

  if (brochureClose) { brochureClose.addEventListener('click', function () { closeModal(brochureModal); }); }
  if (thankyouClose) { thankyouClose.addEventListener('click', function () { closeModal(brochureThankyou); }); }
  bindOverlayClose(brochureModal);
  bindOverlayClose(brochureThankyou);

  if (brochureForm) {
    brochureForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameVal  = document.getElementById('br-name').value.trim();
      var emailVal = document.getElementById('br-email').value.trim();
      var phoneVal = document.getElementById('br-phone').value.trim();

      if (!nameVal || !emailVal || !phoneVal) {
        brochureStatus.style.color = '#c0392b';
        brochureStatus.textContent = 'Please fill in all required fields.';
        return;
      }

      var submitBtn = document.getElementById('brochure-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';
      brochureStatus.textContent = '';

      var payload = new FormData(brochureForm);
      payload.append('_subject', 'BWM Brochure Request – ' + nameVal);
      payload.append('brochure_requested', 'Yes – BWM Industrial Catalogue');

      fetch('https://formspree.io/f/xgobkrde', {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          /* Fire Google Ads brochure conversion */
          fireConversion(CONV_BROCHURE, 1.0);
          if (typeof gtag === 'function') {
            gtag('event', 'brochure_download', { event_category: 'Engagement' });
          }

          /* Send brochure email via EmailJS */
          var brochureUrl = 'https://bwm.co.in/images/BWM_CatalogV2.36cm.pdf';
          if (typeof emailjs !== 'undefined') {
            emailjs.send('service_wuhsqm7', 'template_euu9otk', {
              to_name:      nameVal,
              to_email:     emailVal,
              phone:        phoneVal,
              brochure_url: brochureUrl
            }).catch(function () { /* silent fail */ });
          }

          /* Open PDF directly */
          window.open('images/BWM_CatalogV2.36cm.pdf', '_blank');

          /* Close form, show thank-you */
          closeModal(brochureModal);
          setTimeout(function () { openModal(brochureThankyou); }, 350);
          brochureForm.reset();
        } else {
          return res.json().then(function (json) {
            throw new Error(json.errors ? json.errors.map(function (er) { return er.message; }).join(', ') : 'Server error');
          });
        }
      })
      .catch(function () {
        brochureStatus.style.color = '#c0392b';
        brochureStatus.textContent = 'Something went wrong. Please call us or try again.';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Me the Brochure \u2192';
      });
    });
  }


  /* ════════════════════════════════════════════
     12. EXIT INTENT + INACTIVITY POPUP (50s)
     ════════════════════════════════════════════ */
  var exitPopup      = document.getElementById('exit-popup');
  var exitClose      = document.getElementById('exit-close');
  var exitDismiss    = document.getElementById('exit-dismiss');
  var exitContactBtn = document.getElementById('exit-contact-btn');

  var exitShown = false;

  function showExitPopup() {
    if (exitShown) return;
    if (brochureModal && brochureModal.classList.contains('modal-visible')) return;
    if (brochureThankyou && brochureThankyou.classList.contains('modal-visible')) return;
    exitShown = true;
    clearInactivityTimer();
    openModal(exitPopup);
  }

  function hideExitPopup() { closeModal(exitPopup); }

  if (exitClose)      { exitClose.addEventListener('click', hideExitPopup); }
  if (exitDismiss)    { exitDismiss.addEventListener('click', hideExitPopup); }
  if (exitContactBtn) { exitContactBtn.addEventListener('click', hideExitPopup); }
  bindOverlayClose(exitPopup);

  /* Exit intent – mouse leaves through top */
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 6) { showExitPopup(); }
  });

  /* Inactivity – 50 seconds */
  var INACTIVITY_MS = 50 * 1000;
  var inactivityTimer = null;

  function resetInactivityTimer() {
    clearInactivityTimer();
    if (!exitShown) {
      inactivityTimer = setTimeout(showExitPopup, INACTIVITY_MS);
    }
  }
  function clearInactivityTimer() {
    if (inactivityTimer) { clearTimeout(inactivityTimer); inactivityTimer = null; }
  }

  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (evt) {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });

  resetInactivityTimer();

}); /* end DOMContentLoaded */
