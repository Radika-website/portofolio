/* =========================================================
   PORTFOLIO — JavaScript
   Custom cursor, navbar scroll, reveal animations,
   mobile menu, smooth scroll
   ========================================================= */

(() => {
  'use strict';
   const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
   
   if (isTouchDevice) return;

  /* ========== Custom Cursor ========== */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower using requestAnimationFrame
  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  };
  animateFollower();

  // Enlarge cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .skill-item, .social-link');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor-follower--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor-follower--hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });


  /* ========== Navbar Scroll ========== */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });


  /* ========== Mobile Menu ========== */
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    // Lock body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  /* ========== Smooth Scroll ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ========== Scroll Reveal (IntersectionObserver) ========== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Respect animation delay set via CSS custom property
        const el = entry.target;
        const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
        setTimeout(() => {
          el.classList.add('visible');
        }, delay * 1000);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ========== Hero Scroll Indicator Hide ========== */
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }


  /* ========== Parallax Orbs (subtle) ========== */
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 12;
      orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
  });


  /* ========== Active Nav Link on Scroll ========== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ========== Typewriter Effect in Hero ========== */
  const roles = ['Web Developer', 'UI Designer', 'Frontend Engineer', 'Problem Solver'];
  const subtitleEl = document.querySelector('.hero-title--sub');
  if (subtitleEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const current = roles[roleIndex];
      if (deleting) {
        subtitleEl.textContent = current.substring(0, charIndex--);
      } else {
        subtitleEl.textContent = current.substring(0, charIndex++);
      }

      let delay = deleting ? 60 : 100;

      if (!deleting && charIndex > current.length) {
        delay = 2200;
        deleting = true;
      } else if (deleting && charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
        charIndex = 0;
      }

      setTimeout(type, delay);
    };

    // Start after a short delay so the page loads first
    setTimeout(type, 1200);
  }


  /* ========== Stat Counter Animation ========== */
  const statNums = document.querySelectorAll('.stat-num');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.textContent);
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const step = Math.ceil(target / 30);
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(interval);
        }, 40);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 1 });

  statNums.forEach(el => countObserver.observe(el));


  /* ========== Project Card Tilt Effect ========== */
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });


  /* ========== Ripple on CTA Buttons ========== */
  const btns = document.querySelectorAll('.btn--primary');

  btns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.2);
        border-radius:50%;
        pointer-events:none;
        animation:rippleAnim 0.6s ease-out forwards;
      `;
      // Inject keyframes once
      if (!document.getElementById('rippleStyle')) {
        const s = document.createElement('style');
        s.id = 'rippleStyle';
        s.textContent = '@keyframes rippleAnim{from{transform:scale(0);opacity:1}to{transform:scale(1);opacity:0}}';
        document.head.appendChild(s);
      }
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });


  /* ========== Contact Form — Mailto Builder ========== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const TARGET_EMAIL = 'radikdika02@gmail.com';

    // Helpers
    const getField  = id => document.getElementById(id);
    const showError = (inputEl, errorEl) => {
      inputEl.classList.add('error');
      errorEl.classList.add('visible');
    };
    const clearError = (inputEl, errorEl) => {
      inputEl.classList.remove('error');
      errorEl.classList.remove('visible');
    };

    // Live clear errors as user types
    ['contactName','contactEmail','contactSubject','contactMessage'].forEach(id => {
      const input = getField(id);
      const errId = id.replace('contact','').toLowerCase() + 'Error';
      // Capitalise first char to match IDs like nameError, emailError…
      const errorEl = getField(errId.charAt(0).toUpperCase() + errId.slice(1));
      if (input && errorEl) {
        input.addEventListener('input', () => clearError(input, errorEl));
      }
    });

    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameEl    = getField('contactName');
      const emailEl   = getField('contactEmail');
      const subjectEl = getField('contactSubject');
      const msgEl     = getField('contactMessage');

      const nameErr    = getField('nameError');
      const emailErr   = getField('emailError');
      const subjectErr = getField('subjectError');
      const msgErr     = getField('messageError');

      let valid = true;

      // Validate name
      if (!nameEl.value.trim()) {
        showError(nameEl, nameErr); valid = false;
      } else { clearError(nameEl, nameErr); }

      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailEl.value.trim())) {
        showError(emailEl, emailErr); valid = false;
      } else { clearError(emailEl, emailErr); }

      // Validate subject
      if (!subjectEl.value.trim()) {
        showError(subjectEl, subjectErr); valid = false;
      } else { clearError(subjectEl, subjectErr); }

      // Validate message
      if (!msgEl.value.trim()) {
        showError(msgEl, msgErr); valid = false;
      } else { clearError(msgEl, msgErr); }

      if (!valid) return;

      // Build mailto URL with user's content
      const name    = nameEl.value.trim();
      const from    = emailEl.value.trim();
      const subject = encodeURIComponent(subjectEl.value.trim());
      const body    = encodeURIComponent(
        `Halo Radika,\n\n${msgEl.value.trim()}\n\n---\nDikirim oleh: ${name}\nEmail pengirim: ${from}`
      );

      window.location.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;

      // Visual feedback
      const btn     = document.getElementById('contactBtn');
      const btnText = btn.querySelector('.btn-text');
      const origText = btnText.textContent;
      btnText.textContent = 'Membuka email…';
      btn.disabled = true;

      setTimeout(() => {
        btnText.textContent = origText;
        btn.disabled = false;
      }, 3000);
    });
  }

})();
