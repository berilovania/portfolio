/* ============================================================
   REDE DE PARTÍCULAS — Sistema canvas para o fundo do Hero
   Partículas roxo/índigo flutuam e se conectam por linhas.
   No desktop, o mouse repele as partículas próximas.
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // Respeita a preferência do sistema por menos movimento
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null };
  var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Menos partículas no mobile para preservar performance
  var PARTICLE_COUNT = isMobile ? 35 : 70;
  var CONNECT_DIST = 150;  // distância máxima para desenhar conexão entre partículas
  var MOUSE_RADIUS = 120;  // raio de influência do mouse na repulsão
  var animId = null;

  function resize() {
    // O canvas ocupa exatamente o tamanho da seção hero
    var hero = document.getElementById('hero');
    if (!hero) return;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  // Cada partícula tem posição, velocidade, raio e cor aleatórios
  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 1.5 + 0.5;
    // Alterna entre roxo e índigo para variedade visual
    this.color = Math.random() > 0.5
      ? 'rgba(124, 58, 237, 0.7)'
      : 'rgba(99, 102, 241, 0.6)';
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    // Rebate nas bordas do canvas
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Repulsão do mouse — só no desktop, só quando o cursor está na área
    if (!isMobile && mouse.x !== null) {
      var dx = this.x - mouse.x;
      var dy = this.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        // Força proporcional à proximidade do mouse
        var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.015;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Limita a velocidade máxima para evitar que a repulsão dispare partículas
    var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.2) {
      this.vx = (this.vx / speed) * 1.2;
      this.vy = (this.vy / speed) * 1.2;
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  function init() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  // Desenha linhas entre partículas próximas — mais próximas = linha mais opaca
  function connectParticles() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          var opacity = (1 - dist / CONNECT_DIST) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(124, 58, 237, ' + opacity + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connectParticles();
    animId = requestAnimationFrame(animate);
  }

  // Rastreia posição do mouse apenas no desktop
  if (!isMobile) {
    var hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      hero.addEventListener('mouseleave', function () {
        // Remove a influência ao sair da seção
        mouse.x = null;
        mouse.y = null;
      });
    }
  }

  window.addEventListener('resize', function () {
    resize();
  });

  // Inicializa e inicia a animação
  resize();
  init();
  animate();

  // Pausa quando a aba fica em segundo plano — economiza CPU
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    } else if (!document.hidden && !animId) {
      animate();
    }
  });
})();
