/**
 * Lógica Interactiva - Invitación de 15 Años (Delfina Belén Cuello)
 * Temática: Astronomía Mágica (Premium v3)
 */

// CONFIGURACIÓN GLOBAL
const WHATSAPP_NUMBER = "5493834416381"; 

/* ==========================================================================
   1. FONDO ESTRELLADO ANIMADO (CANVAS AVANZADO)
   ========================================================================== */
function initStarryBackground() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let stars = [];
  let shootingStars = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
  }

  function initStars() {
    stars = [];
    // Más estrellas, pero más finas
    const numStars = Math.floor((width * height) / 1000); 
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.1,
        alpha: Math.random(),
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function createShootingStar() {
    shootingStars.push({
      x: Math.random() * width,
      y: 0,
      length: Math.random() * 80 + 20,
      speed: Math.random() * 10 + 5,
      angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1), // Principalmente diagonal
      alpha: 1,
      thickness: Math.random() * 1.5 + 0.5
    });
  }

  function draw() {
    // Fondo base muy oscuro para que resalten las luces
    ctx.clearRect(0, 0, width, height);

    // Dibujar Constelaciones (líneas finas entre algunas estrellas)
    ctx.lineWidth = 0.4;
    const constellationCount = Math.min(stars.length, 50); // Usar hasta 50 estrellas para armar constelaciones
    for (let i = 0; i < constellationCount; i++) {
      for (let j = i + 1; j < constellationCount; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          const opacity = (1 - distance / 120) * 0.15; // Opacidad muy sutil y elegante
          ctx.strokeStyle = `rgba(253, 245, 201, ${opacity})`; // Color dorado sutil
          ctx.stroke();
        }
      }
    }

    // Dibujar Estrellas Normales
    stars.forEach(star => {
      // Mover suavemente
      star.x += star.vx;
      star.y += star.vy;

      // Mantener en pantalla
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      // Parpadeo (Twinkle)
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha <= 0.1) {
        star.alpha = 0.1;
        star.twinkleDir = 1;
      } else if (star.alpha >= Math.random() * 0.5 + 0.5) {
        star.alpha = Math.random() * 0.5 + 0.5;
        star.twinkleDir = -1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      
      // Estrellas ligeramente azuladas/doradas
      const r = Math.random() > 0.8 ? 253 : 255;
      const g = Math.random() > 0.8 ? 245 : 255;
      const b = Math.random() > 0.8 ? 201 : 255;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.alpha})`;
      ctx.fill();
    });

    // Dibujar Estrellas Fugaces
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      let sStar = shootingStars[i];
      
      // Calcular fin de la línea
      const endX = sStar.x - Math.cos(sStar.angle) * sStar.length;
      const endY = sStar.y - Math.sin(sStar.angle) * sStar.length;

      // Crear gradiente para la estela
      const gradient = ctx.createLinearGradient(sStar.x, sStar.y, endX, endY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${sStar.alpha})`);
      gradient.addColorStop(1, `rgba(165, 180, 252, 0)`);

      ctx.beginPath();
      ctx.moveTo(sStar.x, sStar.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = sStar.thickness;
      ctx.stroke();

      // Mover estrella fugaz
      sStar.x += Math.cos(sStar.angle) * sStar.speed;
      sStar.y += Math.sin(sStar.angle) * sStar.speed;
      
      // Desvanecer
      sStar.alpha -= 0.02;

      // Eliminar si no se ve o sale de pantalla
      if (sStar.alpha <= 0 || sStar.y > height || sStar.x > width) {
        shootingStars.splice(i, 1);
      }
    }

    // Probabilidad de nueva estrella fugaz (Baja para mantenerlo sutil)
    if (Math.random() < 0.005) {
      createShootingStar();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ==========================================================================
   2. CUENTA REGRESIVA
   ========================================================================== */
function initCountdown() {
  const countdownElement = document.getElementById('countdown');
  const targetDateStr = countdownElement.getAttribute('data-date');
  const targetDate = new Date(targetDateStr).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').innerText = "00";
      document.getElementById('hours').innerText = "00";
      document.getElementById('minutes').innerText = "00";
      document.getElementById('seconds').innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. ANIMACIONES AL HACER SCROLL (FADE-IN)
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Animaciones iniciales (Hero)
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.hero-section .fade-in');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }, 100);
}

/* ==========================================================================
   4. MANEJO DEL FORMULARIO DE RSVP (A WHATSAPP)
   ========================================================================== */
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('guest-name').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const diet = document.getElementById('dietary-preference').value;
    const comments = document.getElementById('comments').value;

    let message = `¡Hola Delfina! 😊\n\nQuiero confirmar mi asistencia a tus 15 años.\n\n*Nombre:* ${name}\n*Asistencia:* ${attendance === 'si' ? '✅ Sí, asistiré' : '❌ No podré asistir'}`;
    
    if (attendance === 'si') {
      if (diet !== 'ninguno') {
        const dietText = document.querySelector(`#dietary-preference option[value="${diet}"]`).innerText;
        message += `\n*Preferencia de Menú:* ${dietText}`;
      }
    }

    if (comments.trim() !== '') {
      message += `\n\n*Comentarios:* ${comments}`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  });

  // Ocultar dieta si no asiste
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const dietGroup = document.getElementById('diet-group');
  
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'no') {
        dietGroup.style.display = 'none';
      } else {
        dietGroup.style.display = 'flex';
      }
    });
  });
}

/* ==========================================================================
   INICIALIZACIÓN PRINCIPAL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initStarryBackground();
  initCountdown();
  initScrollAnimations();
  initRSVPForm();

  // Configuración CSS inicial para Hero fade-ins
  const heroElements = document.querySelectorAll('.hero-section .fade-in');
  heroElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
  });
});
