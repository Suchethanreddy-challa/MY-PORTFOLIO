document.addEventListener('DOMContentLoaded', () => {
  // --- Page Loader ---
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      // Add slight delay for premium feel
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 600);
    });
    // Fallback if load event doesn't fire (e.g. cached resources)
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 2000);
  }

  // --- Theme Management ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Re-trigger visual layout recalculations if needed
      window.dispatchEvent(new Event('resize'));
    });
  }

  // --- Sticky Header & Active Navigation Link ---
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header scrolled background
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll progress bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // Scroll-to-top button visibility
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
      if (window.scrollY > 400) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    // Highlighting current section in Navigation
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // offset for navbar height
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Mobile Hamburger Menu ---
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-links-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // --- Scroll-to-Top Button Functionality ---
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Typing Effect Animation ---
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const words = JSON.parse(typingElement.getAttribute('data-words')) || [];
    let wordIndex = 0;
    let txt = '';
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex % words.length];
      
      if (isDeleting) {
        txt = currentWord.substring(0, txt.length - 1);
      } else {
        txt = currentWord.substring(0, txt.length + 1);
      }

      typingElement.textContent = txt;

      let typeSpeed = 100;

      if (isDeleting) {
        typeSpeed /= 2; // Delete faster
      }

      if (!isDeleting && txt === currentWord) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && txt === '') {
        isDeleting = false;
        wordIndex++;
        typeSpeed = 500; // Pause before starting next word
      }

      setTimeout(type, typeSpeed);
    }

    // Start typing loop with initial delay
    setTimeout(type, 1000);
  }

  // --- Scroll Reveal Animations & Skill Bars ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target); // Reveal once only
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Animate skill bars when visible
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target;
        const targetPercent = fillBar.getAttribute('data-percent');
        fillBar.style.width = `${targetPercent}%`;
        skillObserver.unobserve(fillBar);
      }
    });
  }, {
    threshold: 0.5
  });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // --- Contact Form Interactive Handler ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitBtnText = submitBtn.innerHTML;

      // Simple validation
      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner-icon" style="width: 18px; height: 18px; animation: spin 1s infinite linear; fill: currentColor;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="10"/>
        </svg> Sending...`;
      formStatus.style.display = 'none';

      // Send real email using FormSubmit AJAX
      fetch("https://formsubmit.co/ajax/suchethanreddychalla043@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === "true" || data.success === true) {
          showStatus('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          showStatus('Something went wrong. Please try again.', 'error');
        }
      })
      .catch(err => {
        showStatus('Could not send message. Check your internet connection.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtnText;
      });
    });

    function showStatus(text, type) {
      formStatus.textContent = text;
      formStatus.className = `form-status ${type}`;
      formStatus.style.display = 'block';
    }
  }
});
