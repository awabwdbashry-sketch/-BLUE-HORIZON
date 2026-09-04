/* ===================================
   BLUE HORIZON YACHTS — script.js
   =================================== */

/* ---- 1. Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ---- 2. Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ---- 3. Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ---- 4. Intersection Observer — Fade-in animations ---- */
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger delay for grid children
      const parent = entry.target.parentElement;
      const siblings = Array.from(parent.querySelectorAll('.fade-in'));
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 100, 400);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));


/* ---- 5. Booking form submission ---- */
const bookingForm = document.getElementById('bookingForm');
const successModal = document.getElementById('successModal');

bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Basic validation
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const yacht = document.getElementById('fyacht').value;
  const date = document.getElementById('fdate').value;
  const guests = document.getElementById('fguests').value;

  if (!name || !phone || !yacht || !date || !guests) {
    shakeForm();
    return;
  }

  // Simulate submission delay
  const submitBtn = bookingForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'جارٍ الإرسال...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = 'إرسال طلب الحجز';
    submitBtn.disabled = false;
    bookingForm.reset();
    showModal();
  }, 1200);
});

function shakeForm() {
  const form = document.getElementById('bookingForm');
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

function showModal() {
  successModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  successModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on backdrop click
successModal.addEventListener('click', function (e) {
  if (e.target === successModal) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && successModal.classList.contains('active')) {
    closeModal();
  }
});


/* ---- 6. Navbar active link highlight ---- */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active-nav');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(sec => sectionObserver.observe(sec));


/* ---- 7. Parallax hero image (subtle) ---- */
const heroImg = document.querySelector('.hero-img');

window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.18}px)`;
  }
}, { passive: true });


/* ---- 8. Inject CSS for shake animation & active nav ---- */
const extraStyles = document.createElement('style');
extraStyles.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
  .active-nav {
    color: var(--teal) !important;
  }
`;
document.head.appendChild(extraStyles);


/* ---- 9. Yacht card hover tilt effect ---- */
document.querySelectorAll('.yacht-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `translateY(-8px) perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});


/* ---- 10. Destination card image lazy load fallback ---- */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('error', function () {
    // Fallback: show a colored placeholder with the alt text
    const alt = this.alt || 'صورة';
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width:100%; height:100%; background: linear-gradient(135deg, #0a2342, #0096c7);
      display:flex; align-items:center; justify-content:center;
      color: rgba(255,255,255,0.7); font-family: Cairo, sans-serif; font-size: 0.9rem;
    `;
    placeholder.textContent = alt;
    this.parentElement.appendChild(placeholder);
  });
});


/* ---- 11. Counter animation for hero stats ---- */
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const text = stat.textContent;
    // Only animate if it contains Arabic numerals or + symbol
    if (!text.match(/[٠-٩]/)) return;
    stat.style.opacity = '0';
    setTimeout(() => {
      stat.style.transition = 'opacity 0.5s ease';
      stat.style.opacity = '1';
    }, 800);
  });
}

// Run counter animation on page load
window.addEventListener('load', () => {
  animateCounters();
  // Trigger initial fade-ins for elements in view
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(() => el.classList.add('visible'), 200);
    }
  });
});


/* ---- 12. Scroll to top button ---- */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'العودة للأعلى');
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 32px;
  left: 32px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00b4d8, #0096c7);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,180,216,0.45);
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
`;
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.transform = 'translateY(0)';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.transform = 'translateY(16px)';
  }
}, { passive: true });

scrollTopBtn.addEventListener('mouseenter', () => {
  scrollTopBtn.style.transform = 'translateY(-3px)';
  scrollTopBtn.style.boxShadow = '0 8px 28px rgba(0,180,216,0.6)';
});
scrollTopBtn.addEventListener('mouseleave', () => {
  scrollTopBtn.style.transform = 'translateY(0)';
  scrollTopBtn.style.boxShadow = '0 4px 20px rgba(0,180,216,0.45)';
});
