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
  // 5. SCROLL ANIMATIONS — handled by GSAP ScrollTrigger (effects.js)
  // ============================================================

  // ============================================================
  // UTILITÁRIOS DO TERMINAL
  // ============================================================

  // Promessa com delay — usada para criar as animações frame a frame
  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  // Escapa caracteres HTML para evitar injeção de marcação no terminal
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Constrói a barra de progresso visual com blocos cheios (█) e vazios (░)
  // blocks: número de blocos preenchidos (0–16), total sempre 16
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
  var heroHistory  = [];
  var heroHistIdx  = -1;

  var HERO_HELP_1 = [
    '  <span class="t-ok">Comandos (1/3):</span>',
    '    git push  <span class="t-dim">— deploy para produção</span>',
    '    docker    <span class="t-dim">— status da imagem</span>',
    '    kubectl   <span class="t-dim">— status dos pods</span>',
    '    terraform <span class="t-dim">— plano de infra</span>',
    '    whoami    <span class="t-dim">— quem sou eu</span>',
    '    ls        <span class="t-dim">— listar arquivos</span>',
    '    ping      <span class="t-dim">— testar conexão</span>',
    '  <span class="t-dim">help 2 → mais comandos</span>',
  ].join('\n');

  var HERO_HELP_2 = [
    '  <span class="t-ok">Comandos (2/3):</span>',
    '    devops    <span class="t-dim">— reiniciar animação</span>',
    '    date      <span class="t-dim">— data e hora atual</span>',
    '    uptime    <span class="t-dim">— tempo online</span>',
    '    cat       <span class="t-dim">— ler arquivo</span>',
    '    status    <span class="t-dim">— status do sistema</span>',
    '    neofetch  <span class="t-dim">— info do sistema</span>',
    '    clear     <span class="t-dim">— limpar tela</span>',
    '  <span class="t-dim">help 3 → ???</span>',
  ].join('\n');

  var HERO_HELP_3 = [
    '  <span class="t-ok">Easter eggs (3/3):</span>',
    '    <span class="t-glitch">▓░▒█▓░▒</span>  <span class="t-dim">— ???</span>',
    '    <span class="t-glitch">█▒░▓█▒░</span>  <span class="t-dim">— ???</span>',
    '    <span class="t-glitch">░▓█▒░▓█</span>  <span class="t-dim">— ???</span>',
    '  <span class="t-pending">encontre os 3 comandos</span>',
    '  <span class="t-pending">secretos... boa sorte!</span>',
  ].join('\n');

  // Gera uma linha aleatória de caracteres de bloco para o efeito glitch
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
    if (lower.includes('sudo'))        return '  > permissão negada (boa tentativa)\n  <span class="t-dim">dica: tente invadir de outro jeito...</span>';
    if (lower.includes('terraform apply'))  return '  > 4 criados, 0 destruídos';
    if (lower.includes('terraform plan'))   return '  > plano: 4 a criar, 0 a destruir';
    if (lower.includes('terraform'))        return '  > recursos: 4 gerenciados\n  <span class="t-dim">recurso #42: classificado</span>';
    if (lower.includes('aws'))              return '  > 3 instâncias em us-east-1\n  <span class="t-dim">instância secreta: i-1337hack</span>';
    if (lower.includes('rm'))          return '  > rm: operação não permitida';
    if (lower.includes('git push'))    return '  > já em produção. relaxa :)';
    if (lower.includes('git'))         return '  > branch main. nada a commitar.';
    if (lower.includes('kubectl'))     return '  > pods: 3/3 rodando  ● ● ●\n  <span class="t-dim">pod-42 respondeu algo estranho...</span>';
    if (lower.includes('docker'))      return '  > imagem: latest  (atualizada)';
    if (lower === 'devops')            return 'DEVOPS_RESTART';
    if (lower === 'date')              return '  > ' + new Date().toLocaleString('pt-BR');
    if (lower === 'uptime')            return '  > online há ' + Math.floor(performance.now() / 1000) + 's\n  <span class="t-dim">tempo suficiente pra ver a matrix?</span>';
    if (lower === 'cat')               return '  > 🐱 miau! (esperava um arquivo?)';
    if (lower === 'status')            return '  > cpu: 12%  mem: 4.2GB/16GB\n  > disk: 47% usado\n  > <span class="t-ok">todos os serviços ok</span>\n  <span class="t-dim">porta 1337: conexão suspeita...</span>';
    if (lower === 'neofetch')          return '  > <span class="t-ok">matheus</span>@portfolio\n  > OS: DevOps Linux 4.2\n  > Shell: bash 5.1\n  > Uptime: ∞\n  > Stack: AWS + K8s + Terraform';
    if (lower === 'matrix')            return 'GLITCH_MATRIX';
    if (lower === 'hack')              return 'GLITCH_HACK';
    if (lower === '42')                return 'GLITCH_42';
    if (lower.match(/\b(oi|olá|ola|hello|hi)\b/)) return '  > oi! bem-vindo ao terminal :)\n  > sinta-se à vontade para \n    explorar os comandos! \n  > dica: tente "help"';
    if (lower.includes('ping'))        return '  > pong (64 bytes, tempo=0.4ms)\n  <span class="t-dim">resposta vinda de... Nebuchadnezzar?</span>';
    if (lower.includes('ls'))          return '  > deploy.yml  src/  README.md\n  <span class="t-dim">.secret_42  (permissão negada)</span>';
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
    heroHistory.push(s);
    heroHistIdx = -1;
    var lower = s.toLowerCase();
    if (lower === 'clear') {
      heroLastCmd = null; heroLastResp = null; heroAnimHtml = '';
    } else {
      var resp = heroResponse(s);
      if (resp === 'DEVOPS_RESTART') {
        pickAndRunHeroAnim();
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

  // Inicia a animação do terminal apenas quando o hero entra na tela
  // (threshold 0.25 = pelo menos 25% visível antes de iniciar)
  if (heroBody) {
    var heroTermObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        heroTermObs.disconnect(); // dispara apenas uma vez
        pickAndRunHeroAnim();
      }
    }, { threshold: 0.25 });
    heroTermObs.observe(document.getElementById('hero'));
  }

  // ============================================================
  // 7. TERRAFORM ANIMATION — reused in hero terminal
  // ============================================================
  async function runTerraformAnim() {
    heroRender('');
    await wait(300);

    // Fase 1 — digita terraform apply
    var cmd = 'terraform apply';
    for (var c = 0; c <= cmd.length; c++) {
      heroRender('<span class="t-cmd">$ ' + cmd.slice(0, c) + '</span><span class="terminal-cursor">▮</span>');
      await wait(c === 0 ? 150 : 50);
    }

    // Fase 2 — planejando
    await wait(200);
    var base = '<span class="t-cmd">$ ' + cmd + '</span>\n  ↳ planejando recursos...\n\n';
    heroRender(base);
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
        heroRender(base + resLines.join('\n'));
        await wait(70);
      }
      resLines[r] = '  <span class="t-ok">+</span> ' + resNames[r] + '<span class="t-ok">criado</span>   ';
      heroRender(base + resLines.join('\n'));
      await wait(120);
    }

    // Fase 4 — apply completo
    await wait(200);
    var finalHtml = base + resLines.join('\n') + '\n\n  Apply complete!\n  4 criados, 0 alt., 0 destruídos';
    heroRender(finalHtml);

    // Fase 5 — modo interativo
    await wait(600);
    heroAnimHtml = finalHtml + '\n\n';
    heroInteract = true;
    heroLastCmd = null;
    heroLastResp = null;
    heroInput = '';
    heroShowInteractive();
  }

  // ============================================================
  // SELETOR ALEATÓRIO DE ANIMAÇÃO
  // Escolhe entre git push e terraform apply com 50% de chance cada.
  // Também usado pelo comando "devops" para reiniciar a animação.
  // ============================================================
  function pickAndRunHeroAnim() {
    heroInteract = false;
    heroInput = '';
    heroLastCmd = null;
    heroLastResp = null;
    heroAnimHtml = '';
    if (Math.random() < 0.5) {
      runHeroAnim();
    } else {
      runTerraformAnim();
    }
  }

  // ============================================================
  // 8. TECLADO — input do terminal hero
  //    Usa input oculto para abrir teclado virtual no mobile
  // ============================================================
  var focusedTerminal = null;
  var heroHiddenInput = document.getElementById('heroInput');

  document.getElementById('heroTerminal').addEventListener('click', function () {
    focusedTerminal = 'hero';
    heroHiddenInput.focus();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#heroTerminal')) {
      focusedTerminal = null;
    }
  });

  function handleTerminalKeydown(e) {
    if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp'
        || e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
    }

    if (heroInteract && !heroProc) {
      if (e.key === 'Enter') { heroEnter(); heroHiddenInput.value = ''; }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (heroHistory.length > 0) {
          if (heroHistIdx === -1) heroHistIdx = heroHistory.length;
          if (heroHistIdx > 0) { heroHistIdx--; heroInput = heroHistory[heroHistIdx]; heroShowInteractive(); }
        }
      }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (heroHistIdx !== -1) {
          heroHistIdx++;
          if (heroHistIdx >= heroHistory.length) { heroHistIdx = -1; heroInput = ''; }
          else { heroInput = heroHistory[heroHistIdx]; }
          heroShowInteractive();
        }
      }
      else if (e.key === 'Backspace') { e.preventDefault(); heroInput = heroInput.slice(0, -1); heroShowInteractive(); }
      else if (e.key === ' ') { e.preventDefault(); if (heroInput.length < HERO_MAX) { heroInput += ' '; heroShowInteractive(); } }
      else if (e.key.length === 1 && heroInput.length < HERO_MAX) { e.preventDefault(); heroInput += e.key; heroShowInteractive(); }
    }
  }

  // Captura keydown no input oculto — funciona em desktop e mobile com foco no input
  heroHiddenInput.addEventListener('keydown', function (e) { handleTerminalKeydown(e); });

  // Fallback via evento "input" para teclados virtuais mobile
  // Alguns teclados Android/iOS não disparam keydown corretamente
  heroHiddenInput.addEventListener('input', function () {
    if (!heroInteract || heroProc) { this.value = ''; return; }
    var val = this.value;
    // Detecta Enter/newline enviado pelo teclado virtual
    if (val.indexOf('\n') !== -1 || val.indexOf('\r') !== -1) {
      this.value = '';
      heroEnter();
      return;
    }
    if (val.length > 0) {
      for (var i = 0; i < val.length; i++) {
        if (heroInput.length < HERO_MAX) heroInput += val[i];
      }
      heroShowInteractive();
    }
    this.value = ''; // limpa o input oculto após capturar os caracteres
  });

  // Segundo fallback: keyup para Enter em teclados que não disparam keydown
  heroHiddenInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      if (heroInteract && !heroProc) {
        heroEnter();
        this.value = '';
      }
    }
  });

  // Captura keydown global no desktop quando o input oculto NÃO está com foco
  // (ex.: usuário clicou no terminal mas o foco ficou no body)
  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return; // não interfere em campos reais
    if (!focusedTerminal) return;
    handleTerminalKeydown(e);
  });

  // ============================================================
  // 9. CONTACT FORM — Formspree
  // ============================================================
  var contactForm  = document.getElementById('contactForm');
  var submitBtn    = document.getElementById('submitBtn');
  var formFeedback = document.getElementById('formFeedback');

  var charCount = document.getElementById('charCount');
  var messageEl = contactForm ? contactForm.querySelector('#message') : null;

  if (messageEl && charCount) {
    messageEl.addEventListener('input', function () {
      charCount.textContent = this.value.length;
      charCount.parentElement.classList.toggle('char-counter--warn', this.value.length > 450);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl    = contactForm.querySelector('#name');
      var emailEl   = contactForm.querySelector('#email');
      var msgEl     = contactForm.querySelector('#message');
      var emailRe   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var valid     = true;

      // Limpa erros anteriores
      [nameEl, emailEl, msgEl].forEach(function (el) { setFieldError(el, false); });
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';

      // Validação por campo
      if (!nameEl.value.trim())            { setFieldError(nameEl, true);  valid = false; }
      if (!emailRe.test(emailEl.value.trim())) { setFieldError(emailEl, true); valid = false; }
      if (!msgEl.value.trim())             { setFieldError(msgEl, true);   valid = false; }

      if (!valid) {
        showFeedback('Preencha os campos destacados corretamente.', 'error');
        return;
      }

      // Estado de envio
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Enviando...';

      fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      })
      .then(function (res) {
        if (res.ok) {
          showFeedback('Mensagem enviada! Entrarei em contato em breve.', 'success');
          contactForm.reset();
          if (charCount) charCount.textContent = '0';
        } else {
          showFeedback('Erro ao enviar. Tente novamente.', 'error');
        }
      })
      .catch(function () {
        showFeedback('Sem conexão. Verifique sua internet e tente novamente.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<ion-icon name="send-outline"></ion-icon> Enviar Mensagem';
      });
    });

    // Remove destaque de erro ao começar a corrigir o campo
    contactForm.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { setFieldError(this, false); });
    });
  }

  function setFieldError(el, hasError) {
    if (!el) return;
    el.classList.toggle('input--error', hasError);
  }

  function showFeedback(msg, type) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className = 'form-feedback form-feedback--' + type;
  }

  // ============================================================
  // 10. EMAIL COPY

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

  // ============================================================
  // 11. PROJECT DIALOG
  // ============================================================
  var projectDialog      = document.getElementById('projectDialog');
  var projectDialogClose = document.getElementById('projectDialogClose');
  var projectDialogImg   = document.getElementById('projectDialogImg');
  var projectDialogTitle = document.getElementById('projectDialogTitle');
  var projectDialogDesc  = document.getElementById('projectDialogDesc');
  var projectDialogBtn   = document.getElementById('projectDialogBtn');

  if (projectDialog) {
    document.querySelectorAll('.project-card[data-github]').forEach(function (card) {
      card.addEventListener('click', function () {
        projectDialogImg.src = this.getAttribute('data-image');
        projectDialogImg.alt = this.getAttribute('data-title');
        projectDialogTitle.textContent = this.getAttribute('data-title');
        projectDialogDesc.textContent  = this.getAttribute('data-description');
        projectDialogBtn.href          = this.getAttribute('data-github');
        projectDialog.showModal();
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
      });
    });

    projectDialogClose.addEventListener('click', function () {
      projectDialog.close();
    });

    projectDialog.addEventListener('click', function (e) {
      if (e.target === this) this.close();
    });
  }

})();
