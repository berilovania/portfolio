(function () {
  'use strict';

  var navbar     = document.getElementById('navbar');
  var navToggle  = document.getElementById('navToggle');
  var navLinksEl = document.getElementById('navLinks');
  var navLinks   = document.querySelectorAll('.nav-link');
  var sections   = document.querySelectorAll('section[id]');

  // ============================================================
  // 1. NAVBAR — scroll background
  // ============================================================
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ============================================================
  // 2. ACTIVE NAV LINK — IntersectionObserver
  // ============================================================
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) { link.classList.remove('active'); });
        var activeLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(function (section) { sectionObserver.observe(section); });

  // ============================================================
  // 3. MOBILE HAMBURGER MENU
  // ============================================================
  navToggle.addEventListener('click', function () {
    var isOpen = navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinksEl.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ============================================================
  // 4. SMOOTH SCROLL — offset for fixed navbar
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      var targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  // ============================================================
  // 5. SCROLL ANIMATIONS — fade-in on scroll
  // ============================================================
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(function (el) { fadeObserver.observe(el); });

  // ============================================================
  // TERMINAL UTILITIES
  // ============================================================
  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildBar(blocks) {
    var pct    = Math.round(blocks / 16 * 100);
    var pctStr = (String(pct) + '%').padStart(4);
    return '│  <span class="t-bar">' + '█'.repeat(blocks) + '</span>'
         + '<span class="t-dim">'    + '░'.repeat(16 - blocks) + '</span>'
         + '  ' + pctStr + '           │\n';
  }

  var EMPTY = '│                                   │\n';

  // ============================================================
  // 6. HERO TERMINAL — devops@pipeline
  // ============================================================
  var heroPre      = document.querySelector('.hero-visual .ascii-art');
  var heroHint     = document.querySelector('#hero .terminal-hint');
  var heroLines    = [];
  var heroInteract = false;
  var heroInput    = '';
  var heroProc     = false;
  var HERO_MAX     = 25;

  if (heroPre) {
    for (var i = 0; i < 13; i++) heroLines.push(EMPTY);
  }

  function renderHero() {
    if (!heroPre) return;
    heroPre.innerHTML =
      '┌───────────────────────────────────┐\n' +
      '│ <span class="t-dot-r">●</span> <span class="t-dot-y">●</span> <span class="t-dot-g">●</span>  devops@pipeline            │\n' +
      '├───────────────────────────────────┤\n' +
      heroLines.join('') +
      '└───────────────────────────────────┘';
  }

  function heroResponse(raw) {
    var cmd = raw.trim(), lower = cmd.toLowerCase();
    if (!cmd) return null;
    if (lower.includes('sudo'))        return '> permissão negada (boa tentativa)';
    if (lower.includes('rm'))          return '> rm: operação não permitida';
    if (lower.includes('git push'))    return '> já em produção. pode relaxar :)';
    if (lower.includes('git'))         return '> branch main. nada a commitar.';
    if (lower.includes('terraform'))   return '> plano: 0 adicionado, 0 destruído';
    if (lower.includes('kubectl'))     return '> pods: 3/3 rodando  ● ● ●';
    if (lower.includes('docker'))      return '> imagem: latest  (atualizada)';
    if (lower.includes('help'))        return '> tente: git push origin main';
    if (lower.match(/\b(oi|olá|ola|hello|hi)\b/)) return '> oi! bem-vindo ao terminal :)';
    if (lower.includes('ping'))        return '> pong (64 bytes, tempo=0.4ms)';
    if (lower.includes('ls'))          return '> deploy.yml  src/  README.md';
    if (lower.includes('whoami'))      return '> matheus — engenheiro devops';
    if (lower.includes('clear'))       return '> os logs ficam. sempre.';
    return ('> ' + escapeHtml(cmd.slice(0, 12)) + ': não encontrado').slice(0, 31);
  }

  function heroSetInput() {
    var e = escapeHtml(heroInput);
    var t = ' '.repeat(Math.max(0, 30 - heroInput.length));
    heroLines[12] = '│  <span class="t-cmd">$ ' + e + '</span><span class="terminal-cursor">▮</span>' + t + '<span class="hero-comand-bar-align">│</span>\n';
    renderHero();
  }

  function heroSetResp(resp) {
    if (resp.length > 31) resp = resp.slice(0, 28) + '...';
    heroLines[12] = '│  <span class="t-dim">' + resp + '</span>' + ' '.repeat(33 - resp.length) + '│\n';
    renderHero();
  }

  function heroEnter() {
    if (heroProc) return;
    var s = heroInput.trim();
    if (!s) { heroInput = ''; heroSetInput(); return; }
    heroProc = true;
    var r = heroResponse(s);
    if (r) {
      heroSetResp(r);
      setTimeout(function () { heroInput = ''; heroProc = false; heroSetInput(); }, 2200);
    } else {
      heroInput = ''; heroProc = false; heroSetInput();
    }
  }

  async function runHeroAnim() {
    renderHero();
    await wait(700);

    // Fase 1 — digita o comando
    var cmd = 'git push origin main';
    for (var c = 0; c <= cmd.length; c++) {
      var typed = cmd.slice(0, c);
      heroLines[1] = '│  <span class="t-cmd">$ ' + typed + '</span>' + ' '.repeat(31 - typed.length) + '│\n';
      renderHero();
      await wait(c === 0 ? 200 : 65);
    }

    // Fase 2 — pipeline iniciado
    await wait(250);
    heroLines[2] = '│    ↳ pipeline iniciado            │\n';
    renderHero();

    // Fase 3a — lint & test: contador 1/47 → 47/47
    await wait(300);
    for (var n = 1; n <= 47; n++) {
      var cnt  = n + '/47';
      var cpad = ' '.repeat(35 - 20 - cnt.length);
      heroLines[4] = '│  [<span class="t-pending">…</span>] lint &amp; test   ' + cnt + cpad + '<span class="hero-t-ok-bar-align">│</span>\n';
      renderHero();
      await wait(15);
    }
    heroLines[4] = '│  [<span class="t-ok">✓</span>] lint &amp; test   47/47          <span class="hero-t-ok-bar-align">│</span>\n';
    renderHero();

    // Fase 3b — docker build: contador 0.0s → 2.3s
    await wait(200);
    for (var d = 0; d <= 23; d++) {
      var secs = (d / 10).toFixed(1) + 's';
      var dpad = ' '.repeat(35 - 20 - secs.length);
      heroLines[5] = '│  [<span class="t-pending">…</span>] docker build  ' + secs + dpad + '<span class="hero-t-ok-bar-align">│</span>\n';
      renderHero();
      await wait(60);
    }
    heroLines[5] = '│  [<span class="t-ok">✓</span>] docker build  2.3s           <span class="hero-t-ok-bar-align">│</span>\n';
    renderHero();

    // Fase 3c — push to ECR
    await wait(300);
    heroLines[6] = '│  [<span class="t-ok">✓</span>] push to ECR   done           <span class="hero-t-ok-bar-align">│</span>\n';
    renderHero();

    // Fase 3d — deploy k8s
    await wait(380);
    heroLines[7] = '│  [<span class="t-ok">✓</span>] deploy k8s    prod           <span class="hero-t-ok-bar-align">│</span>\n';
    renderHero();

    // Fase 4 — barra de progresso
    await wait(250);
    for (var b = 0; b <= 16; b++) {
      heroLines[9] = buildBar(b);
      renderHero();
      await wait(b === 0 ? 0 : 75);
    }

    // Fase 5 — pods rodando
    await wait(200);
    heroLines[10] = '│  <span class="t-ok">● ● ●</span>  3/3 pods rodando          │\n';
    renderHero();

    // Modo interativo
    await wait(400);
    heroInteract = true;
    heroSetInput();
    if (heroHint) heroHint.classList.add('visible');
  }

  if (heroPre) {
    var heroTermObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        heroTermObs.disconnect();
        runHeroAnim();
      }
    }, { threshold: 0.25 });
    heroTermObs.observe(document.getElementById('hero'));
  }

  // ============================================================
  // 7. ABOUT TERMINAL — cloud@terraform
  // ============================================================
  var aboutPre      = document.querySelector('.about-image .ascii-art');
  var aboutHint     = document.querySelector('#about .terminal-hint');
  var aboutLines    = [];
  var aboutInteract = false;
  var aboutInput    = '';
  var aboutProc     = false;

  if (aboutPre) {
    for (var j = 0; j < 13; j++) aboutLines.push(EMPTY);
  }

  function renderAbout() {
    if (!aboutPre) return;
    aboutPre.innerHTML =
      '┌───────────────────────────────────┐\n' +
      '│ <span class="t-dot-r">●</span> <span class="t-dot-y">●</span> <span class="t-dot-g">●</span>  cloud@terraform            │\n' +
      '├───────────────────────────────────┤\n' +
      aboutLines.join('') +
      '└───────────────────────────────────┘';
  }

  function aboutResponse(raw) {
    var cmd = raw.trim(), lower = cmd.toLowerCase();
    if (!cmd) return null;
    if (lower.includes('sudo'))            return '> permissão negada (boa tentativa)';
    if (lower.includes('rm'))              return '> rm: operação não permitida';
    if (lower.includes('git'))             return '> aqui usamos terraform :)';
    if (lower.includes('terraform apply')) return '> 4 criados, 0 destruídos';
    if (lower.includes('terraform plan'))  return '> plano: 4 a criar, 0 a destruir';
    if (lower.includes('terraform'))       return '> recursos: 4 gerenciados';
    if (lower.includes('aws'))             return '> 3 instâncias em us-east-1';
    if (lower.includes('kubectl'))         return '> pods: 3/3 rodando  ● ● ●';
    if (lower.includes('docker'))          return '> imagem: latest  (atualizada)';
    if (lower.includes('help'))            return '> tente: terraform apply';
    if (lower.match(/\b(oi|olá|ola|hello|hi)\b/)) return '> olá, engenheiro! tudo ok?';
    if (lower.includes('ping'))            return '> pong (64 bytes, tempo=0.4ms)';
    if (lower.includes('ls'))              return '> main.tf  vars.tf  outputs.tf';
    if (lower.includes('whoami'))          return '> matheus — engenheiro devops';
    if (lower.includes('clear'))           return '> os logs ficam. sempre.';
    return ('> ' + escapeHtml(cmd.slice(0, 12)) + ': não encontrado').slice(0, 31);
  }

  function aboutSetInput() {
    var e = escapeHtml(aboutInput);
    var t = ' '.repeat(Math.max(0, 30 - aboutInput.length));
    aboutLines[12] = '│  <span class="t-cmd">$ ' + e + '</span><span class="terminal-cursor">▮</span>' + t + '<span class="comand-bar-align">│</span>\n';
    renderAbout();
  }

  function aboutSetResp(resp) {
    if (resp.length > 31) resp = resp.slice(0, 28) + '...';
    aboutLines[12] = '│  <span class="t-dim">' + resp + '</span>' + ' '.repeat(33 - resp.length) + '│\n';
    renderAbout();
  }

  function aboutEnter() {
    if (aboutProc) return;
    var s = aboutInput.trim();
    if (!s) { aboutInput = ''; aboutSetInput(); return; }
    aboutProc = true;
    var r = aboutResponse(s);
    if (r) {
      aboutSetResp(r);
      setTimeout(function () { aboutInput = ''; aboutProc = false; aboutSetInput(); }, 2200);
    } else {
      aboutInput = ''; aboutProc = false; aboutSetInput();
    }
  }

  async function runAboutAnim() {
    renderAbout();
    await wait(500);

    // Fase 1 — digita terraform apply
    var cmd = 'terraform apply';
    for (var c = 0; c <= cmd.length; c++) {
      var typed = cmd.slice(0, c);
      aboutLines[1] = '│  <span class="t-cmd">$ ' + typed + '</span>' + ' '.repeat(31 - typed.length) + '│\n';
      renderAbout();
      await wait(c === 0 ? 200 : 70);
    }

    // Fase 2 — planejando
    await wait(300);
    aboutLines[2] = '│    ↳ planejando recursos...       │\n';
    renderAbout();

    // Fase 3 — recursos criados um a um
    await wait(400);
    var res = [
      '│  <span class="t-ok">+</span> aws_vpc.main        <span class="t-ok">criado</span>     │\n',
      '│  <span class="t-ok">+</span> aws_subnet.pub      <span class="t-ok">criado</span>     │\n',
      '│  <span class="t-ok">+</span> aws_instance.app    <span class="t-ok">criado</span>     │\n',
      '│  <span class="t-ok">+</span> aws_s3.bucket       <span class="t-ok">criado</span>     │\n',
    ];
    for (var r = 0; r < res.length; r++) {
      aboutLines[4 + r] = res[r];
      renderAbout();
      await wait(350);
    }

    // Fase 4 — apply completo
    await wait(300);
    aboutLines[9]  = '│  Apply complete!                  │\n';
    aboutLines[10] = '│  4 criados, 0 alt., 0 destruídos  │\n';
    renderAbout();

    // Modo interativo
    await wait(500);
    aboutInteract = true;
    aboutSetInput();
    if (aboutHint) aboutHint.classList.add('visible');
  }

  if (aboutPre) {
    var aboutTermObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        aboutTermObs.disconnect();
        runAboutAnim();
      }
    }, { threshold: 0.25 });
    aboutTermObs.observe(document.getElementById('about'));
  }

  // ============================================================
  // 8. TECLADO UNIFICADO — roteia para o terminal visível
  // ============================================================
  function getActiveTerminal() {
    var heroEl  = document.getElementById('hero');
    var aboutEl = document.getElementById('about');
    var vh = window.innerHeight;
    function score(el) {
      if (!el) return Infinity;
      var rect = el.getBoundingClientRect();
      return Math.abs(rect.top + rect.height / 2 - vh / 2);
    }
    return score(heroEl) <= score(aboutEl) ? 'hero' : 'about';
  }

  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    var anyActive = heroInteract || aboutInteract;
    if (!anyActive) return;

    // Trava scroll por teclado enquanto terminal estiver ativo
    if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp'
        || e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
    }

    var active = getActiveTerminal();

    if (active === 'hero' && heroInteract && !heroProc) {
      if (e.key === 'Enter') {
        heroEnter();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        heroInput = heroInput.slice(0, -1);
        heroSetInput();
      } else if (e.key === ' ') {
        if (heroInput.length < HERO_MAX) { heroInput += ' '; heroSetInput(); }
      } else if (e.key.length === 1 && heroInput.length < HERO_MAX) {
        heroInput += e.key;
        heroSetInput();
      }
    }

    if (active === 'about' && aboutInteract && !aboutProc) {
      if (e.key === 'Enter') {
        aboutEnter();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        aboutInput = aboutInput.slice(0, -1);
        aboutSetInput();
      } else if (e.key === ' ') {
        if (aboutInput.length < 25) { aboutInput += ' '; aboutSetInput(); }
      } else if (e.key.length === 1 && aboutInput.length < 25) {
        aboutInput += e.key;
        aboutSetInput();
      }
    }
  });

})();
