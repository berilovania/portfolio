/* ============================================================
   EFFECTS — Orquestração GSAP e Interações Premium
   Depende de: gsap.min.js + ScrollTrigger.min.js (CDN no HTML)
   ============================================================ */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Aborta se o GSAP não carregou (ex.: sem internet, CDN bloqueado)
  if (typeof gsap === 'undefined') return;

  // Registra o plugin ScrollTrigger no GSAP
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ============================================================
  // 1. BARRA DE PROGRESSO DE SCROLL
  // Largura vai de 0% a 100% conforme o usuário rola a página.
  // scrub: 0.3 cria um leve atraso suave no acompanhamento.
  // ============================================================
  var progressBar = document.querySelector('.scroll-progress');
  if (progressBar && typeof ScrollTrigger !== 'undefined') {
    gsap.to(progressBar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }

  // ============================================================
  // 2. REVEAL DE SCROLL COM GSAP — substitui o fadeObserver anterior
  // Elementos com classe .fade-in animam ao entrar na viewport.
  // Se reduced motion está ativo, aparecem instantaneamente.
  // ============================================================
  var fadeEls = document.querySelectorAll('.fade-in');

  if (reducedMotion) {
    // Exibe tudo imediatamente sem animação
    fadeEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  } else if (typeof ScrollTrigger !== 'undefined') {
    fadeEls.forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true  // anima apenas uma vez — não reinicia ao rolar para cima
          }
        }
      );
    });

    // Stagger nas pills de habilidades — cada pill entra em sequência
    var skillGrids = document.querySelectorAll('.skills-pills');
    skillGrids.forEach(function (grid) {
      var pills = grid.querySelectorAll('.skill-pill');
      gsap.fromTo(pills,
        { opacity: 0, y: 15, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.06,         // intervalo entre cada pill
          ease: 'back.out(1.4)', // pequeno overshoot elástico na chegada
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Stagger nos cards de projeto — entram em sequência com delay entre si
    var projectCards = document.querySelectorAll('.project-card-link');
    if (projectCards.length) {
      gsap.fromTo(projectCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%',
            once: true
          }
        }
      );
    }

    // Contador animado nos números de destaque da seção Sobre
    // Lê o valor do DOM (ex.: "5+") e anima de 0 até o número alvo
    var counters = document.querySelectorAll('.highlight-number');
    counters.forEach(function (el) {
      var text = el.textContent.trim();
      var match = text.match(/^(\d+)(\+?)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2] || '';
      el.textContent = '0' + suffix;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val) + suffix;
            }
          });
        }
      });
    });
  }

  // ============================================================
  // 3. ENTRADA DO HERO — Timeline Sequencial
  // Cada elemento do hero entra em ordem: saudação → nome → cargo →
  // descrição → botões → redes sociais → terminal.
  // No mobile, o terminal anima verticalmente (y) em vez de horizontalmente (x).
  // ============================================================
  if (!reducedMotion) {
    var heroEls = {
      greeting: document.querySelector('.hero-greeting'),
      name:     document.querySelector('.hero-name'),
      role:     document.querySelector('.hero-role'),
      desc:     document.querySelector('.hero-description'),
      cta:      document.querySelector('.hero-cta'),
      socials:  document.querySelector('.hero-socials'),
      visual:   document.querySelector('.hero-visual')
    };

    // Oculta todos os elementos antes da animação para evitar flash de conteúdo
    var heroTargets = [heroEls.greeting, heroEls.name, heroEls.role, heroEls.desc, heroEls.cta, heroEls.socials, heroEls.visual];
    heroTargets.forEach(function (el) {
      if (el) gsap.set(el, { opacity: 0 });
    });

    var isMobileHero = window.innerWidth <= 768;
    var tl = gsap.timeline({ delay: 0.3 }); // pequeno delay inicial para a página assentar

    if (heroEls.greeting) tl.fromTo(heroEls.greeting, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    if (heroEls.name)     tl.fromTo(heroEls.name,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2');
    if (heroEls.role)     tl.fromTo(heroEls.role,     { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    if (heroEls.desc)     tl.fromTo(heroEls.desc,     { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.15');
    if (heroEls.cta)      tl.fromTo(heroEls.cta,      { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1');
    if (heroEls.socials)  tl.fromTo(heroEls.socials,  { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1');
    if (heroEls.visual) {
      // No mobile o terminal vem de baixo; no desktop vem da direita
      var fromProps = isMobileHero ? { opacity: 0, y: 30 }  : { opacity: 0, x: 40 };
      var toProps   = isMobileHero
        ? { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        : { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' };
      tl.fromTo(heroEls.visual, fromProps, toProps, '-=0.2');
    }
  }

  // ============================================================
  // 4. CURSOR PERSONALIZADO
  // Dot (ponto sólido) segue o mouse em tempo real.
  // Circle (anel) segue com interpolação suave — cria o efeito de trailing.
  // Desativado em touch (mobile/tablet) e com reduced motion.
  // ============================================================
  if (!isTouch && !reducedMotion) {
    var dot    = document.querySelector('.custom-cursor-dot');
    var circle = document.querySelector('.custom-cursor-circle');

    if (dot && circle) {
      document.body.classList.add('has-custom-cursor');

      var cursorX = 0, cursorY = 0;
      var circleX = 0, circleY = 0;

      document.addEventListener('mousemove', function (e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        // Dot segue imediatamente
        dot.style.left = cursorX + 'px';
        dot.style.top  = cursorY + 'px';
      });

      // Circle usa lerp (interpolação linear) via GSAP ticker para o efeito de atraso
      gsap.ticker.add(function () {
        circleX += (cursorX - circleX) * 0.15; // 0.15 = velocidade de aproximação
        circleY += (cursorY - circleY) * 0.15;
        circle.style.left = circleX + 'px';
        circle.style.top  = circleY + 'px';
      });

      // Aumenta o cursor ao passar sobre elementos interativos
      var interactives = document.querySelectorAll('a, button, input, textarea, .btn, .social-link, .nav-link, .skill-pill, .project-card[data-github]');
      interactives.forEach(function (el) {
        el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
        el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
      });

      // Esconde o cursor ao sair da janela
      document.addEventListener('mouseleave', function () {
        dot.style.opacity    = '0';
        circle.style.opacity = '0';
      });
      document.addEventListener('mouseenter', function () {
        dot.style.opacity    = '1';
        circle.style.opacity = '1';
      });
    }
  }

  // ============================================================
  // 5. HOVER MAGNÉTICO NOS BOTÕES
  // O elemento se desloca suavemente em direção ao cursor.
  // Ao sair, volta com efeito elástico (elastic.out).
  // Desativado em touch e reduced motion.
  // ============================================================
  if (!isTouch && !reducedMotion) {
    var magnetics = document.querySelectorAll('.btn, .social-link');

    magnetics.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        // Deslocamento proporcional à distância do cursor ao centro do elemento
        var x = e.clientX - rect.left - rect.width  / 2;
        var y = e.clientY - rect.top  - rect.height / 2;
        gsap.to(el, {
          x: x * 0.25, // fator 0.25 = 25% do deslocamento real (efeito sutil)
          y: y * 0.25,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', function () {
        // Retorna à posição original com bounce elástico
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  // ============================================================
  // 6. TILT 3D NOS GLASS CARDS
  // Rotação em X e Y baseada na posição do mouse sobre o card.
  // Glare: gradiente radial que segue o mouse simulando reflexo de luz.
  // Desativado em touch e reduced motion.
  // ============================================================
  if (!isTouch && !reducedMotion) {
    var tiltCards = document.querySelectorAll('.glass-card');

    tiltCards.forEach(function (card) {
      // Injeta o elemento de glare dentro do card
      var glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.style.position = 'relative';
      card.appendChild(glare);

      card.addEventListener('mousemove', function (e) {
        var rect    = card.getBoundingClientRect();
        var x       = e.clientX - rect.left;
        var y       = e.clientY - rect.top;
        var centerX = rect.width  / 2;
        var centerY = rect.height / 2;

        // Ângulo máximo de ±3° — sutil o suficiente para não distrair
        var rotateX = ((y - centerY) / centerY) * -3;
        var rotateY = ((x - centerX) / centerX) *  3;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800
        });

        // Glare segue a posição do mouse em percentagem
        var glareX = (x / rect.width)  * 100;
        var glareY = (y / rect.height) * 100;
        glare.style.background = 'radial-gradient(circle at ' + glareX + '% ' + glareY + '%, rgba(255,255,255,0.03), transparent 35%)';
      });

      card.addEventListener('mouseleave', function () {
        // Retorna à posição neutra com efeito elástico
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          transformPerspective: 800
        });
        glare.style.opacity = '0';
      });

      card.addEventListener('mouseenter', function () {
        glare.style.opacity = '1';
      });
    });
  }

  // ============================================================
  // 7. PARALLAX ENTRE SEÇÕES
  // O fundo de cada seção desloca levemente ao rolar, criando profundidade.
  // scrub: 1 sincroniza suavemente com o scroll.
  // Desativado em touch (custo de performance) e reduced motion.
  // ============================================================
  if (!isTouch && !reducedMotion && typeof ScrollTrigger !== 'undefined') {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
      gsap.to(section, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

})();
