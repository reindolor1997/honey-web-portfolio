/**
 * main.js — Honey Web Portfolio
 *
 * Behaviors:
 *  1. Mobile nav toggle
 *  2. Contact form client-side validation (no network)
 *  3. Active nav link highlighting via IntersectionObserver
 */

(function () {
  'use strict';

  // ================================================================
  // 1. MOBILE NAV TOGGLE
  // ================================================================
  var navbar = document.querySelector('.navbar');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelectorAll('.nav-menu a');

  function openMenu() {
    navbar.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navbar.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      var isOpen = navbar.classList.contains('nav-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu when any nav link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // ================================================================
  // 2. CONTACT FORM VALIDATION (client-side only, no server)
  // ================================================================
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.querySelector('.form-status');

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(message, type) {
    // type is 'success' or 'error'
    formStatus.textContent = message;
    formStatus.classList.remove('success', 'error');
    formStatus.classList.add(type);
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameVal = contactForm.elements['name'].value.trim();
      var emailVal = contactForm.elements['email'].value.trim();
      var messageVal = contactForm.elements['message'].value.trim();

      // Validate name
      if (!nameVal) {
        setStatus('Please enter your name.', 'error');
        contactForm.elements['name'].focus();
        return;
      }

      // Validate email
      if (!emailVal) {
        setStatus('Please enter your email address.', 'error');
        contactForm.elements['email'].focus();
        return;
      }

      if (!emailRegex.test(emailVal)) {
        setStatus('Please enter a valid email address (e.g. you@example.com).', 'error');
        contactForm.elements['email'].focus();
        return;
      }

      // Validate message
      if (!messageVal) {
        setStatus('Please enter a message.', 'error');
        contactForm.elements['message'].focus();
        return;
      }

      // All valid — show success and reset
      setStatus('Thanks! Your message has been received.', 'success');
      contactForm.reset();
    });
  }

  // ================================================================
  // 3. ACTIVE NAV LINK ON SCROLL (progressive enhancement)
  // ================================================================
  if ('IntersectionObserver' in window) {
    var sections = document.querySelectorAll('section[id]');

    var observerOptions = {
      root: null,
      // Trigger when the section is at least 30% into the viewport
      rootMargin: '0px 0px -60% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

})();
