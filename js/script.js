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
    return '<span class="t-bar">' + '█'.repeat(blocks) + '</span>'
         + '<span class="t-dim">' + '░'.repeat(16 - blocks) + '</span>'
         + ' ' + pctStr;
  }

  // ============================================================
  // 6. HERO TERMINAL — devops@pipeline
  // ============================================================
  var heroBody     = document.getElementById('heroBody');
  var heroInteract = false;
  var heroInput    = '';
  var heroProc     = false;
  var heroLastCmd  = null;
  var heroLastResp = null;
  var heroAnimHtml = '';
  var HERO_MAX     = 30;

  var HERO_HELP_1 = [
    '',
    '  <span class="t-ok">Comandos disponíveis (1/3):</span>',
    '    git push  <span class="t-dim">— deploy para produção</span>',
    '    docker    <span class="t-dim">— status da imagem</span>',
    '    kubectl   <span class="t-dim">— status dos pods</span>',
    '    terraform <span class="t-dim">— plano de infra</span>',
    '    whoami    <span class="t-dim">— quem sou eu</span>',
    '    ls        <span class="t-dim">— listar arquivos</span>',
    '    ping      <span class="t-dim">— testar conexão</span>',
    '',
    '  <span class="t-dim">help 2 → mais comandos</span>',
  ].join('\n');

  var HERO_HELP_2 = [
    '',
    '  <span class="t-ok">Comandos disponíveis (2/3):</span>',
    '    devops    <span class="t-dim">— reiniciar animação</span>',
    '    date      <span class="t-dim">— data e hora atual</span>',
    '    uptime    <span class="t-dim">— tempo online</span>',
    '    cat       <span class="t-dim">— ler arquivo</span>',
    '    status    <span class="t-dim">— status do sistema</span>',
    '    neofetch  <span class="t-dim">— info do sistema</span>',
    '    clear     <span class="t-dim">— limpar tela</span>',
    '',
    '  <span class="t-dim">help 3 → ???</span>',
  ].join('\n');

  var HERO_HELP_3 = [
    '',
    '  <span class="t-ok">Easter eggs (3/3):</span>',
    '    <span class="t-glitch">▓░▒█▓░▒</span>  <span class="t-dim">— ???</span>',
    '    <span class="t-glitch">█▒░▓█▒░</span>  <span class="t-dim">— ???</span>',
    '    <span class="t-glitch">░▓█▒░▓█</span>  <span class="t-dim">— ???</span>',
    '',
    '  <span class="t-pending">encontre os 3 comandos</span>',
    '  <span class="t-pending">secretos... boa sorte!</span>',
  ].join('\n');

  function glitchText() {
    var chars = '▓░▒█▚▞▘▝▗▖╳╬╪║╔╗╚╝┃┣┫';
    var out = '';
    for (var i = 0; i < 28; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  function heroResponse(raw) {
    var cmd = raw.trim(), lower = cmd.toLowerCase();
    if (!cmd) return null;
    if (lower === 'help' || lower === 'help 1') return HERO_HELP_1;
    if (lower === 'help 2')            return HERO_HELP_2;
    if (lower === 'help 3')            return HERO_HELP_3;
    if (lower.includes('sudo'))        return '  > permissão negada (boa tentativa)';
    if (lower.includes('terraform'))   return '  > plano: 0 adicionado, 0 destruído';
    if (lower.includes('rm'))          return '  > rm: operação não permitida';
    if (lower.includes('git push'))    return '  > já em produção. relaxa :)';
    if (lower.includes('git'))         return '  > branch main. nada a commitar.';
    if (lower.includes('kubectl'))     return '  > pods: 3/3 rodando  ● ● ●';
    if (lower.includes('docker'))      return '  > imagem: latest  (atualizada)';
    if (lower === 'devops')            return 'DEVOPS_RESTART';
    if (lower === 'date')              return '  > ' + new Date().toLocaleString('pt-BR');
    if (lower === 'uptime')            return '  > online há ' + Math.floor(performance.now() / 1000) + 's';
    if (lower === 'cat')               return '  > 🐱 miau! (esperava um arquivo?)';
    if (lower === 'status')            return '  > cpu: 12%  mem: 4.2GB/16GB\n  > disk: 47% usado\n  > <span class="t-ok">todos os serviços ok</span>';
    if (lower === 'neofetch')          return '  > <span class="t-ok">matheus</span>@portfolio\n  > OS: DevOps Linux 4.2\n  > Shell: bash 5.1\n  > Uptime: ∞\n  > Stack: AWS + K8s + Terraform';
    if (lower === 'matrix')            return 'GLITCH_MATRIX';
    if (lower === 'hack')              return 'GLITCH_HACK';
    if (lower === '42')                return 'GLITCH_42';
    if (lower.match(/\b(oi|olá|ola|hello|hi)\b/)) return '  > oi! bem-vindo ao terminal :)\n  > sinta-se à vontade para \n    explorar os comandos! \n  > dica: tente "help"';
    if (lower.includes('ping'))        return '  > pong (64 bytes, tempo=0.4ms)';
    if (lower.includes('ls'))          return '  > deploy.yml  src/  README.md';
    if (lower.includes('whoami'))      return '  > matheus — engenheiro devops';
    return '  > ' + escapeHtml(cmd.slice(0, 20)) + ': não encontrado';
  }

  function heroRender(html) {
    if (heroBody) heroBody.innerHTML = html;
  }

  function heroShowInteractive() {
    var c = '';
    if (heroLastCmd !== null) {
      c += '<span class="t-cmd">$ ' + escapeHtml(heroLastCmd) + '</span>\n';
      if (heroLastResp) c += heroLastResp + '\n';
      c += '\n';
    } else {
      c += heroAnimHtml;
    }
    c += '<span class="t-cmd">$ ' + escapeHtml(heroInput) + '</span><span class="terminal-cursor">▮</span>';
    if (!heroInput && heroLastCmd === null) {
      c += '  <span class="t-placeholder">// Digite oi e dê enter ↵</span>';
    }
    heroRender(c);
  }

  async function runGlitch(renderFn, cmd, finalMsg) {
    for (var g = 0; g < 15; g++) {
      var lines = '';
      for (var l = 0; l < 5; l++) lines += '  <span class="t-glitch">' + glitchText() + '</span>\n';
      renderFn('<span class="t-cmd">$ ' + escapeHtml(cmd) + '</span>\n' + lines);
      await wait(80);
    }
    return '<span class="t-cmd">$ ' + escapeHtml(cmd) + '</span>\n' + finalMsg;
  }

  function heroEnter() {
    if (heroProc) return;
    var s = heroInput.trim();
    if (!s) { heroInput = ''; heroShowInteractive(); return; }
    var lower = s.toLowerCase();
    if (lower === 'clear') {
      heroLastCmd = null; heroLastResp = null; heroAnimHtml = '';
    } else {
      var resp = heroResponse(s);
      if (resp === 'DEVOPS_RESTART') {
        heroInteract = false;
        heroInput = '';
        heroLastCmd = null;
        heroLastResp = null;
        heroAnimHtml = '';
        runHeroAnim();
        return;
      }
      if (resp && resp.startsWith('GLITCH_')) {
        heroProc = true;
        heroInput = '';
        var msg = '';
        if (resp === 'GLITCH_MATRIX') msg = '  <span class="t-ok">wake up, Neo...</span>\n  <span class="t-ok">the Matrix has you.</span>\n  <span class="t-ok">follow the white rabbit.</span>';
        if (resp === 'GLITCH_HACK')   msg = '  <span class="t-ok">acesso concedido.</span>\n  <span class="t-ok">bem-vindo ao sistema,</span>\n  <span class="t-ok">agente.</span> 🕶️';
        if (resp === 'GLITCH_42')     msg = '  <span class="t-ok">a resposta para a vida,</span>\n  <span class="t-ok">o universo e tudo mais.</span>\n  <span class="t-dim">— Douglas Adams</span>';
        runGlitch(heroRender, s, '').then(function () {
          heroLastCmd = s;
          heroLastResp = msg;
          heroProc = false;
          heroShowInteractive();
        });
        return;
      }
      heroLastCmd = s; heroLastResp = resp;
    }
    heroInput = '';
    heroShowInteractive();
  }

  async function runHeroAnim() {
    heroRender('');
    await wait(500);

    // Fase 1 — digita comando
    var cmd = 'git push origin main';
    for (var c = 0; c <= cmd.length; c++) {
      heroRender('<span class="t-cmd">$ ' + cmd.slice(0, c) + '</span><span class="terminal-cursor">▮</span>');
      await wait(c === 0 ? 200 : 65);
    }

    // Fase 2 — pipeline iniciado + barra/pods iniciais
    await wait(250);
    var checks = [];
    var barBlocks = 0;
    var podCount = 0;

    function content() {
      var l = ['<span class="t-cmd">$ ' + cmd + '</span>'];
      l.push('  ↳ pipeline iniciado');
      l.push('');
      for (var i = 0; i < checks.length; i++) l.push(checks[i]);
      if (checks.length > 0) l.push('');
      l.push('  ' + buildBar(barBlocks));
      if (podCount < 3) {
        l.push('  <span class="t-pending">● ● ●</span>  <span class="t-pending">' + podCount + '/3 atualizando</span>');
      } else {
        l.push('  <span class="t-blue">● ● ●</span>  <span class="t-blue">3/3 pods rodando</span>');
      }
      return l.join('\n');
    }

    heroRender(content());
    await wait(400);

    // Fase 3a — lint & test: 1/47 → 47/47, barra 0→4
    for (var n = 1; n <= 47; n++) {
      checks[0] = '  [<span class="t-pending">…</span>] lint &amp; test   ' + n + '/47';
      barBlocks = Math.round(n / 47 * 4);
      heroRender(content());
      await wait(15);
    }
    checks[0] = '  [<span class="t-ok">✓</span>] lint &amp; test   47/47';
    barBlocks = 4;
    podCount = 1;
    heroRender(content());

    // Fase 3b — docker build: 0.0s→2.3s, barra 4→8
    await wait(200);
    for (var d = 0; d <= 23; d++) {
      checks[1] = '  [<span class="t-pending">…</span>] docker build  ' + (d / 10).toFixed(1) + 's';
      barBlocks = 4 + Math.round(d / 23 * 4);
      heroRender(content());
      await wait(55);
    }
    checks[1] = '  [<span class="t-ok">✓</span>] docker build  2.3s';
    barBlocks = 8;
    heroRender(content());

    // Fase 3c — push to ECR: 0%→100%, barra 8→12
    await wait(200);
    for (var p = 0; p <= 10; p++) {
      var pPct = p * 10;
      checks[2] = '  [<span class="t-pending">…</span>] push to ECR   ' + pPct + '%';
      barBlocks = 8 + Math.round(p / 10 * 4);
      heroRender(content());
      await wait(60);
    }
    checks[2] = '  [<span class="t-ok">✓</span>] push to ECR   done';
    barBlocks = 12;
    podCount = 2;
    heroRender(content());

    // Fase 3d — deploy k8s: 0/3→3/3, barra 12→16
    await wait(200);
    for (var k = 0; k <= 3; k++) {
      checks[3] = '  [<span class="t-pending">…</span>] deploy k8s    ' + k + '/3';
      barBlocks = 12 + Math.round(k / 3 * 4);
      heroRender(content());
      await wait(180);
    }
    checks[3] = '  [<span class="t-ok">✓</span>] deploy k8s    prod';
    barBlocks = 16;
    podCount = 3;
    heroRender(content());

    // Fase 4 — modo interativo
    await wait(800);
    heroAnimHtml = content() + '\n\n';
    heroInteract = true;
    heroLastCmd = null;
    heroLastResp = null;
    heroInput = '';
    heroShowInteractive();
  }

  if (heroBody) {
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
  var aboutBody     = document.getElementById('aboutBody');
  var aboutInteract = false;
  var aboutInput    = '';
  var aboutProc     = false;
  var aboutLastCmd  = null;
  var aboutLastResp = null;
  var aboutAnimHtml = '';

  var ABOUT_HELP_1 = [
    '',
    '  <span class="t-ok">Comandos disponíveis (1/3):</span>',
    '    terraform <span class="t-dim">— gerenciar infra</span>',
    '    aws       <span class="t-dim">— status instâncias</span>',
    '    kubectl   <span class="t-dim">— status dos pods</span>',
    '    docker    <span class="t-dim">— status da imagem</span>',
    '    whoami    <span class="t-dim">— quem sou eu</span>',
    '    ls        <span class="t-dim">— listar arquivos</span>',
    '    ping      <span class="t-dim">— testar conexão</span>',
    '',
    '  <span class="t-dim">help 2 → mais comandos</span>',
  ].join('\n');

  var ABOUT_HELP_2 = [
    '',
    '  <span class="t-ok">Comandos disponíveis (2/3):</span>',
    '    devops    <span class="t-dim">— reiniciar animação</span>',
    '    date      <span class="t-dim">— data e hora atual</span>',
    '    uptime    <span class="t-dim">— tempo online</span>',
    '    cat       <span class="t-dim">— ler arquivo</span>',
    '    status    <span class="t-dim">— status do sistema</span>',
    '    neofetch  <span class="t-dim">— info do sistema</span>',
    '    clear     <span class="t-dim">— limpar tela</span>',
    '',
    '  <span class="t-dim">help 3 → ???</span>',
  ].join('\n');

  var ABOUT_HELP_3 = [
    '',
    '  <span class="t-ok">Easter eggs (3/3):</span>',
    '    <span class="t-glitch">▓░▒█▓░▒</span>  <span class="t-dim">— ???</span>',
    '    <span class="t-glitch">█▒░▓█▒░</span>  <span class="t-dim">— ???</span>',
    '    <span class="t-glitch">░▓█▒░▓█</span>  <span class="t-dim">— ???</span>',
    '',
    '  <span class="t-pending">encontre os 3 comandos</span>',
    '  <span class="t-pending">secretos... boa sorte!</span>',
  ].join('\n');

  function aboutResponse(raw) {
    var cmd = raw.trim(), lower = cmd.toLowerCase();
    if (!cmd) return null;
    if (lower === 'help' || lower === 'help 1') return ABOUT_HELP_1;
    if (lower === 'help 2')                    return ABOUT_HELP_2;
    if (lower === 'help 3')                    return ABOUT_HELP_3;
    if (lower.includes('sudo'))                return '  > permissão negada (boa tentativa)';
    if (lower.includes('terraform apply'))     return '  > 4 criados, 0 destruídos';
    if (lower.includes('terraform plan'))      return '  > plano: 4 a criar, 0 a destruir';
    if (lower.includes('terraform'))           return '  > recursos: 4 gerenciados';
    if (lower.includes('rm'))                  return '  > rm: operação não permitida';
    if (lower.includes('git'))                 return '  > aqui usamos terraform :)';
    if (lower.includes('aws'))                 return '  > 3 instâncias em us-east-1';
    if (lower.includes('kubectl'))             return '  > pods: 3/3 rodando  ● ● ●';
    if (lower.includes('docker'))              return '  > imagem: latest  (atualizada)';
    if (lower === 'devops')                    return 'DEVOPS_RESTART';
    if (lower === 'date')                      return '  > ' + new Date().toLocaleString('pt-BR');
    if (lower === 'uptime')                    return '  > online há ' + Math.floor(performance.now() / 1000) + 's';
    if (lower === 'cat')                       return '  > 🐱 miau! (esperava um arquivo?)';
    if (lower === 'status')                    return '  > cpu: 12%  mem: 4.2GB/16GB\n  > disk: 47% usado\n  > <span class="t-ok">todos os serviços ok</span>';
    if (lower === 'neofetch')                  return '  > <span class="t-ok">matheus</span>@portfolio\n  > OS: DevOps Linux 4.2\n  > Shell: bash 5.1\n  > Uptime: ∞\n  > Stack: AWS + K8s + Terraform';
    if (lower === 'matrix')                    return 'GLITCH_MATRIX';
    if (lower === 'hack')                      return 'GLITCH_HACK';
    if (lower === '42')                        return 'GLITCH_42';
    if (lower.match(/\b(oi|olá|ola|hello|hi)\b/)) return '  > olá, engenheiro(a)! tudo ok?\n  > sinta-se à vontade para \n    explorar os comandos! \n  > dica: tente "help"';
    if (lower.includes('ping'))                return '  > pong (64 bytes, tempo=0.4ms)';
    if (lower.includes('ls'))                  return '  > main.tf  vars.tf  outputs.tf';
    if (lower.includes('whoami'))              return '  > matheus — engenheiro devops';
    return '  > ' + escapeHtml(cmd.slice(0, 20)) + ': não encontrado';
  }

  function aboutRender(html) {
    if (aboutBody) aboutBody.innerHTML = html;
  }

  function aboutShowInteractive() {
    var c = '';
    if (aboutLastCmd !== null) {
      c += '<span class="t-cmd">$ ' + escapeHtml(aboutLastCmd) + '</span>\n';
      if (aboutLastResp) c += aboutLastResp + '\n';
      c += '\n';
    } else {
      c += aboutAnimHtml;
    }
    c += '<span class="t-cmd">$ ' + escapeHtml(aboutInput) + '</span><span class="terminal-cursor">▮</span>';
    if (!aboutInput && aboutLastCmd === null) {
      c += '  <span class="t-placeholder">// Digite oi e dê enter ↵</span>';
    }
    aboutRender(c);
  }

  function aboutEnter() {
    if (aboutProc) return;
    var s = aboutInput.trim();
    if (!s) { aboutInput = ''; aboutShowInteractive(); return; }
    var lower = s.toLowerCase();
    if (lower === 'clear') {
      aboutLastCmd = null; aboutLastResp = null; aboutAnimHtml = '';
    } else {
      var resp = aboutResponse(s);
      if (resp === 'DEVOPS_RESTART') {
        aboutInteract = false;
        aboutInput = '';
        aboutLastCmd = null;
        aboutLastResp = null;
        aboutAnimHtml = '';
        runAboutAnim();
        return;
      }
      if (resp && resp.startsWith('GLITCH_')) {
        aboutProc = true;
        aboutInput = '';
        var msg = '';
        if (resp === 'GLITCH_MATRIX') msg = '  <span class="t-ok">wake up, Neo...</span>\n  <span class="t-ok">the Matrix has you.</span>\n  <span class="t-ok">follow the white rabbit.</span>';
        if (resp === 'GLITCH_HACK')   msg = '  <span class="t-ok">acesso concedido.</span>\n  <span class="t-ok">bem-vindo ao sistema,</span>\n  <span class="t-ok">agente.</span> 🕶️';
        if (resp === 'GLITCH_42')     msg = '  <span class="t-ok">a resposta para a vida,</span>\n  <span class="t-ok">o universo e tudo mais.</span>\n  <span class="t-dim">— Douglas Adams</span>';
        runGlitch(aboutRender, s, '').then(function () {
          aboutLastCmd = s;
          aboutLastResp = msg;
          aboutProc = false;
          aboutShowInteractive();
        });
        return;
      }
      aboutLastCmd = s; aboutLastResp = resp;
    }
    aboutInput = '';
    aboutShowInteractive();
  }

  async function runAboutAnim() {
    aboutRender('');
    await wait(300);

    // Fase 1 — digita terraform apply
    var cmd = 'terraform apply';
    for (var c = 0; c <= cmd.length; c++) {
      aboutRender('<span class="t-cmd">$ ' + cmd.slice(0, c) + '</span><span class="terminal-cursor">▮</span>');
      await wait(c === 0 ? 150 : 50);
    }

    // Fase 2 — planejando
    await wait(200);
    var base = '<span class="t-cmd">$ ' + cmd + '</span>\n  ↳ planejando recursos...\n\n';
    aboutRender(base);
    await wait(350);

    // Fase 3 — recursos com spinner + "criando..." animado
    var resNames = [
      'aws_vpc.main      ',
      'aws_subnet.pub    ',
      'aws_instance.app  ',
      'aws_s3.bucket     ',
    ];
    var resLines = [];
    var spinChars = ['\\', '|', '/', '—'];

    for (var r = 0; r < resNames.length; r++) {
      for (var tick = 0; tick < 8; tick++) {
        var spin    = spinChars[tick % 4];
        var dotStr  = '.'.repeat((tick % 3) + 1);
        var dotPad  = ' '.repeat(3 - dotStr.length);
        resLines[r] = '  <span class="t-pending">' + spin + '</span> ' + resNames[r] + '<span class="t-pending">criando' + dotStr + '</span>' + dotPad;
        aboutRender(base + resLines.join('\n'));
        await wait(70);
      }
      resLines[r] = '  <span class="t-ok">+</span> ' + resNames[r] + '<span class="t-ok">criado</span>   ';
      aboutRender(base + resLines.join('\n'));
      await wait(120);
    }

    // Fase 4 — apply completo
    await wait(200);
    var final = base + resLines.join('\n') + '\n\n  Apply complete!\n  4 criados, 0 alt., 0 destruídos';
    aboutRender(final);

    // Fase 5 — modo interativo
    await wait(600);
    aboutAnimHtml = final + '\n\n';
    aboutInteract = true;
    aboutLastCmd = null;
    aboutLastResp = null;
    aboutInput = '';
    aboutShowInteractive();
  }

  if (aboutBody) {
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

    var any = heroInteract || aboutInteract;
    if (!any) return;

    // Trava scroll por teclado
    if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp'
        || e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
    }

    var active = getActiveTerminal();

    if (active === 'hero' && heroInteract && !heroProc) {
      if (e.key === 'Enter') { heroEnter(); }
      else if (e.key === 'Backspace') { e.preventDefault(); heroInput = heroInput.slice(0, -1); heroShowInteractive(); }
      else if (e.key === ' ') { if (heroInput.length < HERO_MAX) { heroInput += ' '; heroShowInteractive(); } }
      else if (e.key.length === 1 && heroInput.length < HERO_MAX) { heroInput += e.key; heroShowInteractive(); }
    }

    if (active === 'about' && aboutInteract && !aboutProc) {
      if (e.key === 'Enter') { aboutEnter(); }
      else if (e.key === 'Backspace') { e.preventDefault(); aboutInput = aboutInput.slice(0, -1); aboutShowInteractive(); }
      else if (e.key === ' ') { if (aboutInput.length < 30) { aboutInput += ' '; aboutShowInteractive(); } }
      else if (e.key.length === 1 && aboutInput.length < 30) { aboutInput += e.key; aboutShowInteractive(); }
    }
  });

  // ============================================================
  // 9. EMAIL COPY
  // ============================================================
  var emailCopyEl = document.getElementById('emailCopy');
  var copyToast   = document.getElementById('copyToast');

  if (emailCopyEl) {
    emailCopyEl.addEventListener('click', function () {
      var email = this.getAttribute('data-email');
      navigator.clipboard.writeText(email).then(function () {
        if (copyToast) {
          copyToast.classList.add('show');
          setTimeout(function () { copyToast.classList.remove('show'); }, 2000);
        }
      });
    });
  }

})();
