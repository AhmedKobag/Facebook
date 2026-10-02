document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('year').textContent = new Date().getFullYear();

  const nav = document.getElementById('nav');
  const onScrollNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => spyObserver.observe(s));

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  const counters = document.querySelectorAll('.count-target');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  const fruitField = document.getElementById('fruitField');
  const fruitPositions = [
    [72, 8], [64, 22], [78, 35], [58, 48], [70, 60],
    [50, 66], [62, 78], [44, 84], [80, 18], [55, 30]
  ];
  fruitPositions.forEach(([left, top], i) => {
    const dot = document.createElement('div');
    dot.className = 'fruit-dot';
    dot.style.left = `${left}%`;
    dot.style.top = `${top}%`;
    dot.style.animationDelay = `${1.6 + i * 0.15}s`;
    fruitField.appendChild(dot);
  });

  const orchardGrid = document.getElementById('orchardGrid');
  const varietyColors = ['#E8791A', '#F5A954', '#7FA37E', '#4C7A52', '#C96A1A'];
  const TOTAL_CELLS = 200;
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'orchard-cell';
    cell.style.background = varietyColors[i % varietyColors.length];
    cell.style.animationDelay = `${(i % 40) * 0.015}s`;
    orchardGrid.appendChild(cell);
  }
  const orchardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.orchard-cell').forEach(cell => {
          cell.style.animationPlayState = 'running';
        });
        orchardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  orchardObserver.observe(orchardGrid);

  const timeline = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timelineProgress');
  const updateTimelineProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
    const percent = total > 0 ? (visible / total) * 100 : 0;
    timelineProgress.style.height = `${Math.min(percent, 100)}%`;
  };
  updateTimelineProgress();
  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  window.addEventListener('resize', updateTimelineProgress);

  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meajwlye';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formNote.style.color = '';
    formNote.textContent = 'جارٍ الإرسال...';

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (response.ok) {
        formNote.style.color = '#9be79b';
        formNote.textContent = 'تم إرسال رسالتك بنجاح، هتوصلك الرد قريباً.';
        form.reset();
      } else {
        formNote.style.color = '#ff8a80';
        formNote.textContent = 'حصل خطأ أثناء الإرسال، جرب تاني أو تواصل عبر الواتساب.';
      }
    } catch (err) {
      formNote.style.color = '#ff8a80';
      formNote.textContent = 'مفيش اتصال بالإنترنت حالياً، جرب تاني أو تواصل عبر الواتساب.';
    }
  });

});
