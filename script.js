/* ==========================================================================
   PORTFOLIO GLASSMORPHISM INTERACTIVE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  const themeBtn = document.getElementById('theme-btn');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  // Apply saved theme on load
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeBtn.addEventListener('click', () => {
    let theme = 'dark';
    if (!document.documentElement.hasAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', 'light');
      theme = 'light';
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  });


  // 2. TYPING EFFECT
  const typingTarget = document.getElementById('typing-target');
  const roles = [
    'Frontend Developer',
    'UI/UX Designer',
    'Creative Web Architect',
    'Freelancer Professional'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Delete faster
    } else {
      typingTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Normal typing speed
    }

    // Blink cursor logic handled by CSS (.typing-text::after)

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing effect
  if (typingTarget) {
    type();
  }


  // 3. NAVIGATION SCROLL ACTIONS & ACTIVE LINKS SPY
  const navbar = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    // Navbar scroll background change
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy: Highlight active menu item
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 180)) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  });


  // 4. MOBILE HAMBURGER MENU
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      
      // Update toggle icon
      hamburgerIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
      lucide.createIcons();
    });

    // Close mobile menu when clicking nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerIcon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      });
    });
  }


  // 5. PROJECT CATEGORY FILTERING (WITH ANIMATIONS)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons and add to clicked
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        // First transition cards out (shrink and fade)
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(20px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
          const isMatch = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
          
          if (isMatch) {
            card.style.display = 'flex';
            // Trigger browser reflow to enable transition in
            card.offsetHeight;
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });





  // 7. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll('.reveal-element');

  const animateProgressBars = () => {
    const skillCards = document.querySelectorAll('.skill-tag-card');
    skillCards.forEach(card => {
      const progressBar = card.querySelector('.skill-progress-bar');
      const skillLevel = card.getAttribute('data-skill-level') || '0';
      progressBar.style.width = `${skillLevel}%`;
    });
  };

  const revealObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // If skill section is revealed, animate the progress bars
        if (entry.target.classList.contains('skills-wrapper') || entry.target.querySelector('.skill-tag-card')) {
          animateProgressBars();
        }
        
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Fallback: If skills section is already visible on slow load/reload
  const skillsSection = document.querySelector('.skills-wrapper');
  if (skillsSection) {
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      animateProgressBars();
    }
  }


  // 8. CONTACT FORM HANDLER WITH TOASTS
  const contactForm = document.getElementById('contact-form-el');
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    // Initialize icons in the newly created toast element
    lucide.createIcons();

    // Trigger transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('btn-submit-form');
      const originalText = submitBtn.innerHTML;
      
      // Show sending state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Mengirim... <i data-lucide="loader" class="animate-spin"></i>`;
      lucide.createIcons();

      // Simulate network request (1.5 seconds)
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();

        if (success) {
          showToast('Pesan berhasil terkirim! Terima kasih telah menghubungi saya.', 'success');
          contactForm.reset();
        } else {
          showToast('Oops! Gagal mengirim pesan. Silakan coba beberapa saat lagi.', 'error');
        }
      }, 1500);
    });
  }

  // 9. ZEN MUSIC PLAYER (APPLE MUSIC / iOS STYLE)
  const musicContainer = document.querySelector('.ios-player');
  if (musicContainer) {
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerCover = document.getElementById('player-cover');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistItems = document.querySelectorAll('.ios-playlist-item');
    
    let isPlaying = false;
    let trackIndex = 0;
    let currentTime = 0;
    let progressInterval = null;
    
    const tracks = [
      {
        name: 'All Too Well',
        artist: 'Taylor Swift',
        duration: 329, // 5:29
        cover: 'assets/taylor_swift.jpg'
      },
      {
        name: 'Night Changes',
        artist: 'One Direction',
        duration: 222, // 3:42
        cover: 'assets/one_direction.jpg'
      },
      {
        name: 'Beauty and a Beat',
        artist: 'Justin Bieber',
        duration: 228, // 3:48
        cover: 'assets/justin_bieber.jpg'
      },
      {
        name: 'Shape of My Heart',
        artist: 'Backstreet Boys',
        duration: 230, // 3:50
        cover: 'assets/backstreet_boys.jpg'
      }
    ];

    // Format duration helper
    function formatTime(secs) {
      const minutes = Math.floor(secs / 60);
      const seconds = Math.floor(secs % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Load track
    function loadTrack(index) {
      trackIndex = index;
      const track = tracks[trackIndex];
      playerTitle.textContent = track.name;
      playerArtist.textContent = track.artist;
      playerCover.src = track.cover;
      
      // Update active playlist item
      playlistItems.forEach((item, idx) => {
        if (idx === trackIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      // Reset progress
      currentTime = 0;
      progressBar.style.width = '0%';
      currentTimeEl.textContent = '0:00';
      totalDurationEl.textContent = formatTime(track.duration);
    }

    // Initialize first track
    loadTrack(0);

    // Play/Pause Track
    function playPauseTrack() {
      if (!isPlaying) {
        playTrack();
      } else {
        pauseTrack();
      }
    }

    // Simulate play (timer simulation)
    function playTrack() {
      isPlaying = true;
      musicContainer.classList.add('music-playing');
      playIcon.setAttribute('data-lucide', 'pause');
      lucide.createIcons();

      // Clear previous interval if any
      if (progressInterval) clearInterval(progressInterval);

      // Start mock ticker
      progressInterval = setInterval(() => {
        currentTime++;
        const currentTrack = tracks[trackIndex];
        if (currentTime >= currentTrack.duration) {
          nextTrack();
        } else {
          const progressPercent = (currentTime / currentTrack.duration) * 100;
          progressBar.style.width = `${progressPercent}%`;
          currentTimeEl.textContent = formatTime(currentTime);
        }
      }, 1000);
    }

    function pauseTrack() {
      isPlaying = false;
      musicContainer.classList.remove('music-playing');
      playIcon.setAttribute('data-lucide', 'play');
      lucide.createIcons();

      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
    }

    // Previous Track
    function prevTrack() {
      let nextIndex = trackIndex - 1;
      if (nextIndex < 0) {
        nextIndex = tracks.length - 1;
      }
      loadTrack(nextIndex);
      if (isPlaying) playTrack();
    }

    // Next Track
    function nextTrack() {
      let nextIndex = trackIndex + 1;
      if (nextIndex >= tracks.length) {
        nextIndex = 0;
      }
      loadTrack(nextIndex);
      if (isPlaying) playTrack();
    }

    // Seek Track simulation
    function setProgress(e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const currentTrack = tracks[trackIndex];
      currentTime = Math.floor((clickX / width) * currentTrack.duration);
      
      const progressPercent = (currentTime / currentTrack.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(currentTime);
    }

    // Event listeners
    playBtn.addEventListener('click', playPauseTrack);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    progressContainer.addEventListener('click', setProgress);

    // Playlist item click
    playlistItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        loadTrack(idx);
        playTrack();
      });
    });
  }
});
