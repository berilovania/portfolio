/* ============================================================
   EFEITOS DE FUNDO POR SEÇÃO
   Canvas com temas: Matrix / Geométrico Neon / Fluxo de Dados / Circuito
   ============================================================ */
(function () {
  'use strict';

  // Respeita a preferência do sistema por menos movimento (acessibilidade)
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Limita o DPR a 2x para evitar custo excessivo em telas de alta densidade
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var activeCanvases = [];

  // ============================================================
  // UTILITÁRIO — configura canvas com IntersectionObserver para performance
  // Cada seção só anima quando está visível na tela, economizando CPU/GPU
  // ============================================================
  function setupCanvas(sectionId, drawFn) {
    var section = document.getElementById(sectionId);
    if (!section) return;

    var canvas = section.querySelector('.section-bg-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var running = false;
    var animId = null;

    function resize() {
      // Multiplica pelo DPR para canvas nítido em telas retina
      canvas.width = section.offsetWidth * DPR;
      canvas.height = section.offsetHeight * DPR;
      canvas.style.width = section.offsetWidth + 'px';
      canvas.style.height = section.offsetHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();
    var state = drawFn.init(canvas, ctx, section);

    function loop() {
      if (!running) return;
      drawFn.draw(canvas, ctx, state);
      animId = requestAnimationFrame(loop);
    }

    // Inicia a animação apenas quando a seção entra na tela
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!running) { running = true; loop(); }
      } else {
        // Pausa quando a seção sai da tela — libera recursos
        running = false;
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      }
    }, { threshold: 0.05 });

    observer.observe(section);

    window.addEventListener('resize', function () {
      resize();
      if (drawFn.resize) drawFn.resize(canvas, ctx, state);
    });

    activeCanvases.push({ canvas: canvas, observer: observer });
  }

  // ============================================================
  // 1. SOBRE — Chuva de Código Matrix
  //
  // Cada coluna é um "stream" independente com posição e velocidade próprias.
  // O rastro é renderizado explicitamente por caractere (sem fillRect acumulado),
  // garantindo que o fundo da seção apareça limpo sem resíduo cinza.
  //
  // Ajustes disponíveis:
  //   fontSize  → tamanho dos caracteres em pixels
  //   TAIL      → comprimento do rastro (quantidade de chars atrás da cabeça)
  //   speed     → velocidade de queda (valor base + variação aleatória)
  //   alpha     → opacidade da cabeça (0.35) e do rastro (0.25 decrescente)
  //   shadowBlur → intensidade do brilho neon na cabeça
  // ============================================================
  var matrixEffect = {
    init: function (canvas, ctx) {
      var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01{}[]<>/=;:$#@!&|~'.split('');
      var fontSize = isMobile ? 12 : 18;
      var cols = Math.floor((canvas.width / DPR) / fontSize);
      var TAIL = 18; // quantidade de caracteres no rastro de cada coluna
      var streams = [];

      for (var i = 0; i < cols; i++) {
        streams.push({
          y: Math.random() * -200,            // posição inicial acima do canvas (entrada escalonada)
          speed: Math.random() * 0.25 + 0.05, // velocidade de queda: min 0.05, max 0.30
          tail: new Array(TAIL).fill(null).map(function () {
            return { char: chars[Math.floor(Math.random() * chars.length)], age: 1 };
          })
        });
      }
      return { chars: chars, fontSize: fontSize, streams: streams, cols: cols, TAIL: TAIL };
    },

    resize: function (canvas, ctx, state) {
      // Adiciona novas colunas se a tela aumentar de tamanho
      var newCols = Math.floor((canvas.width / DPR) / state.fontSize);
      while (state.streams.length < newCols) {
        state.streams.push({
          y: Math.random() * -200,
          speed: Math.random() * 0.08 + 0.05,
          tail: new Array(state.TAIL).fill(null).map(function () {
            return { char: state.chars[Math.floor(Math.random() * state.chars.length)], age: 1 };
          })
        });
      }
      state.cols = newCols;
    },

    draw: function (canvas, ctx, state) {
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;

      // Limpa completamente a cada frame — sem acúmulo de cor no fundo
      ctx.clearRect(0, 0, w, h);

      ctx.font = state.fontSize + 'px "Courier New", monospace';

      for (var i = 0; i < state.cols; i++) {
        var s = state.streams[i];
        s.y += s.speed; // avança a posição da cabeça

        // Empurra novo caractere no início do rastro e descarta o mais antigo
        s.tail.unshift({ char: state.chars[Math.floor(Math.random() * state.chars.length)], age: 0 });
        if (s.tail.length > state.TAIL) s.tail.pop();

        var headY = Math.floor(s.y) * state.fontSize;
        if (headY < -state.fontSize) continue; // ainda fora do canvas, pula

        for (var t = 0; t < s.tail.length; t++) {
          var charY = headY - t * state.fontSize;
          if (charY < 0 || charY > h) continue;

          // Opacidade decresce linearmente da cabeça (t=0) para o fim do rastro
          var alpha = (1 - t / state.TAIL) * (t === 0 ? 0.4 : 0.25);

          if (t === 0) {
            // Cabeça: brilho neon roxo suave
            ctx.shadowColor = 'rgba(124, 58, 237, 0.3)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = 'rgba(157, 95, 255, ' + alpha + ')';
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(124, 58, 237, ' + alpha + ')';
          }

          ctx.fillText(s.tail[t].char, i * state.fontSize, charY);
        }

        // Reseta a coluna quando a cabeça sai pela parte inferior
        if (headY > h + state.TAIL * state.fontSize) {
          // 60% de chance de reiniciar — cria variação na densidade da chuva
          if (Math.random() > 0.4) {
            s.y = Math.random() * -80;
            s.speed = Math.random() * 0.08 + 0.05;
          }
        }
      }

      ctx.shadowBlur = 0;
    }
  };

  // ============================================================
  // 2. HABILIDADES — Grade Geométrica Neon
  //
  // Nós distribuídos em grade com flutuação senoidal suave.
  // Conexões são desenhadas entre nós próximos com opacidade proporcional à distância.
  // Pulsos neon viajam entre nós aleatórios simulando sinal elétrico.
  // ============================================================
  var geometricEffect = {
    init: function (canvas, ctx, section) {
      var spacing = isMobile ? 60 : 45; // espaçamento entre nós da grade
      var nodes = [];
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;

      // Cria nós com pequena variação aleatória na posição para quebrar a rigidez da grade
      for (var x = 0; x < w + spacing; x += spacing) {
        for (var y = 0; y < h + spacing; y += spacing) {
          nodes.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            baseX: x, // posição base para o cálculo da flutuação
            baseY: y,
            radius: Math.random() * 1.5 + 0.5,
            phase: Math.random() * Math.PI * 2, // fase aleatória para dessincronizar o movimento
            speed: Math.random() * 0.005 + 0.002
          });
        }
      }

      // Pulsos neon: 6 no desktop, 3 no mobile
      var pulses = [];
      for (var p = 0; p < (isMobile ? 3 : 6); p++) {
        pulses.push({
          fromIdx: Math.floor(Math.random() * nodes.length),
          toIdx: Math.floor(Math.random() * nodes.length),
          progress: Math.random(), // posição atual no percurso (0 = origem, 1 = destino)
          speed: Math.random() * 0.003 + 0.001 // velocidade do pulso
        });
      }

      return { nodes: nodes, spacing: spacing, pulses: pulses, time: 0 };
    },

    resize: function (canvas, ctx, state) {
      // Recria tudo ao redimensionar para evitar nós fora da área visível
      var newState = this.init(canvas, ctx);
      state.nodes = newState.nodes;
      state.pulses = newState.pulses;
    },

    draw: function (canvas, ctx, state) {
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;
      state.time++;

      ctx.clearRect(0, 0, w, h);

      // Atualiza posição de cada nó e desenha conexões
      for (var i = 0; i < state.nodes.length; i++) {
        var node = state.nodes[i];

        // Flutuação senoidal suave — eixo X e Y com frequências ligeiramente diferentes
        node.x = node.baseX + Math.sin(state.time * node.speed + node.phase) * 3;
        node.y = node.baseY + Math.cos(state.time * node.speed * 0.7 + node.phase) * 3;

        // Conecta nós próximos com linha cuja opacidade depende da distância
        for (var j = i + 1; j < state.nodes.length; j++) {
          var other = state.nodes[j];
          var dx = node.x - other.x;
          var dy = node.y - other.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < state.spacing * 1.5) {
            var opacity = (1 - dist / (state.spacing * 1.5)) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(124, 58, 237, ' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Pulso de brilho nos nós — cada um pulsa em fase diferente
        var pulse = (Math.sin(state.time * 0.02 + node.phase) + 1) * 0.5;
        var alpha = 0.15 + pulse * 0.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, ' + alpha + ')';
        ctx.fill();
      }

      // Desenha os pulsos viajando entre nós
      for (var p = 0; p < state.pulses.length; p++) {
        var pl = state.pulses[p];
        pl.progress += pl.speed;

        // Ao chegar ao destino, escolhe um novo par de nós aleatório
        if (pl.progress > 1) {
          pl.progress = 0;
          pl.fromIdx = Math.floor(Math.random() * state.nodes.length);
          pl.toIdx = Math.floor(Math.random() * state.nodes.length);
        }

        var from = state.nodes[pl.fromIdx];
        var to = state.nodes[pl.toIdx];
        if (!from || !to) continue;

        // Interpolação linear entre origem e destino
        var px = from.x + (to.x - from.x) * pl.progress;
        var py = from.y + (to.y - from.y) * pl.progress;

        // Ponto do pulso com brilho neon
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(157, 95, 255, 0.8)';
        ctx.shadowColor = 'rgba(124, 58, 237, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Rastro do pulso: linha curta atrás do ponto principal
        var trailX = from.x + (to.x - from.x) * Math.max(0, pl.progress - 0.1);
        var trailY = from.y + (to.y - from.y) * Math.max(0, pl.progress - 0.1);
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = 'rgba(157, 95, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(124, 58, 237, 0.5)';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  };

  // ============================================================
  // 3. PROJETOS — Fluxo de Dados (Comandos DevOps)
  //
  // Streams horizontais de comandos e saídas reais de ferramentas DevOps.
  // Cada stream tem direção (esquerda ou direita), velocidade e opacidade aleatórias.
  // Ao sair da tela, o texto é substituído por outro snippet da lista.
  // ============================================================
  var dataFlowEffect = {
    init: function (canvas, ctx) {
      var streamCount = isMobile ? 6 : 12;
      var streams = [];
      var h = canvas.height / DPR;
      var w = canvas.width / DPR;

      // Snippets de comandos reais do ecossistema DevOps/Cloud
      var snippets = [
        'git push origin main',
        'docker build -t app .',
        'kubectl apply -f deploy.yml',
        'terraform plan',
        'aws s3 sync . s3://bucket',
        'helm upgrade --install',
        'ansible-playbook site.yml',
        'pipeline: SUCCESS',
        'BUILD_STATUS=passing',
        'pods: 3/3 Running',
        'image: latest (sha256:a3f...)',
        'deploy → staging → prod',
        'prometheus.io/scrape: true',
        'replicas: 3 | ready: 3',
        'CI/CD ████████ 100%',
        '0x7c3aed 0x9d5fff 0x6366f1',
        'ssh deploy@10.0.1.42',
        'nginx.conf → upstream app',
        'cert-manager: renewed ✓',
        'grafana/dashboards/api-lat',
      ];

      for (var i = 0; i < streamCount; i++) {
        streams.push({
          y: (h / streamCount) * i + Math.random() * 30, // distribui verticalmente com pequena variação
          x: Math.random() * w * 2 - w,                  // posição X inicial aleatória (pode começar fora)
          speed: Math.random() * 0.6 + 0.2,
          text: snippets[Math.floor(Math.random() * snippets.length)],
          opacity: Math.random() * 0.3 + 0.08,           // opacidade entre 0.08 e 0.38
          fontSize: Math.random() * 3 + (isMobile ? 9 : 11),
          direction: Math.random() > 0.5 ? 1 : -1        // metade vai para a direita, metade para a esquerda
        });
      }

      return { streams: streams, snippets: snippets };
    },

    resize: function (canvas, ctx, state) {
      var newState = this.init(canvas, ctx);
      state.streams = newState.streams;
    },

    draw: function (canvas, ctx, state) {
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < state.streams.length; i++) {
        var s = state.streams[i];

        ctx.font = s.fontSize + 'px "Courier New", monospace';
        ctx.fillStyle = 'rgba(124, 58, 237, ' + s.opacity + ')';
        ctx.shadowColor = 'rgba(124, 58, 237, ' + (s.opacity * 0.8) + ')';
        ctx.shadowBlur = 4;
        ctx.fillText(s.text, s.x, s.y);
        ctx.shadowBlur = 0;

        s.x += s.speed * s.direction;

        // Ao sair da tela, reposiciona no lado oposto com novo texto e opacidade
        var textWidth = ctx.measureText(s.text).width;
        if (s.direction > 0 && s.x > w + 20) {
          s.x = -textWidth - 20;
          s.text = state.snippets[Math.floor(Math.random() * state.snippets.length)];
          s.opacity = Math.random() * 0.3 + 0.08;
        } else if (s.direction < 0 && s.x < -textWidth - 20) {
          s.x = w + 20;
          s.text = state.snippets[Math.floor(Math.random() * state.snippets.length)];
          s.opacity = Math.random() * 0.3 + 0.08;
        }
      }
    }
  };

  // ============================================================
  // 4. CONTATO — Placa de Circuito com Pulsos Neon
  //
  // Simula trilhas de PCB (placa de circuito impresso) com ângulos retos.
  // Nós maiores pulsam com um anel expansivo, imitando componentes eletrônicos.
  // Pulsos percorrem as trilhas como sinal elétrico viajando pelo circuito.
  // ============================================================
  var circuitEffect = {
    init: function (canvas, ctx) {
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;
      var gridSize = isMobile ? 50 : 35; // tamanho da grade do circuito
      var nodes = [];
      var traces = []; // trilhas de conexão entre nós

      // Cria nós em pontos aleatórios da grade (40% de probabilidade por ponto)
      for (var x = gridSize; x < w; x += gridSize) {
        for (var y = gridSize; y < h; y += gridSize) {
          if (Math.random() > 0.6) {
            nodes.push({
              x: x,
              y: y,
              radius: Math.random() > 0.7 ? 3 : 1.5, // 30% são nós grandes (componentes)
              glow: Math.random() * Math.PI * 2       // fase de brilho individual
            });
          }
        }
      }

      // Cria trilhas em ângulo reto entre nós próximos (estilo PCB real)
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = Math.abs(nodes[i].x - nodes[j].x);
          var dy = Math.abs(nodes[i].y - nodes[j].y);
          if ((dx < gridSize * 2.5 && dy < gridSize * 2.5) && Math.random() > 0.7) {
            // Ponto de dobra: vai horizontal até midX, depois vertical até destino
            var midX = Math.random() > 0.5 ? nodes[j].x : nodes[i].x;
            traces.push({
              from: nodes[i],
              to: nodes[j],
              midX: midX,
              midY: Math.random() > 0.5 ? nodes[i].y : nodes[j].y
            });
          }
        }
      }

      // Pulsos elétricos percorrendo as trilhas
      var pulseCount = isMobile ? 4 : 8;
      var pulses = [];
      for (var p = 0; p < pulseCount; p++) {
        if (traces.length > 0) {
          pulses.push({
            traceIdx: Math.floor(Math.random() * traces.length),
            progress: Math.random(), // posição no percurso (0 a 1)
            speed: Math.random() * 0.006 + 0.003
          });
        }
      }

      return { nodes: nodes, traces: traces, pulses: pulses, time: 0 };
    },

    resize: function (canvas, ctx, state) {
      var newState = this.init(canvas, ctx);
      state.nodes = newState.nodes;
      state.traces = newState.traces;
      state.pulses = newState.pulses;
    },

    draw: function (canvas, ctx, state) {
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;
      state.time++;

      ctx.clearRect(0, 0, w, h);

      // Desenha as trilhas em ângulo reto (horizontal → vertical)
      ctx.lineWidth = 0.5;
      for (var t = 0; t < state.traces.length; t++) {
        var trace = state.traces[t];
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.08)';
        ctx.moveTo(trace.from.x, trace.from.y);
        ctx.lineTo(trace.midX, trace.midY);
        ctx.lineTo(trace.to.x, trace.to.y);
        ctx.stroke();
      }

      // Desenha os nós com brilho pulsante
      for (var i = 0; i < state.nodes.length; i++) {
        var node = state.nodes[i];
        var pulse = (Math.sin(state.time * 0.015 + node.glow) + 1) * 0.5;
        var alpha = 0.1 + pulse * 0.25;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, ' + alpha + ')';

        // Nós maiores recebem glow neon extra
        if (node.radius > 2) {
          ctx.shadowColor = 'rgba(157, 95, 255, ' + (alpha * 0.8) + ')';
          ctx.shadowBlur = 8;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Anel expansivo nos nós grandes (simula campo eletromagnético)
        if (node.radius > 2) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(124, 58, 237, ' + (alpha * 0.3) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Desenha os pulsos elétricos percorrendo as trilhas
      for (var p = 0; p < state.pulses.length; p++) {
        var pl = state.pulses[p];
        pl.progress += pl.speed;

        // Ao completar o percurso, seleciona uma nova trilha aleatória
        if (pl.progress > 1) {
          pl.progress = 0;
          pl.traceIdx = Math.floor(Math.random() * state.traces.length);
        }

        var trace = state.traces[pl.traceIdx];
        if (!trace) continue;

        // Calcula posição XY ao longo do caminho em ângulo reto (2 segmentos)
        var px, py;
        if (pl.progress < 0.5) {
          // Primeiro segmento: da origem até o ponto de dobra
          var t1 = pl.progress * 2;
          px = trace.from.x + (trace.midX - trace.from.x) * t1;
          py = trace.from.y + (trace.midY - trace.from.y) * t1;
        } else {
          // Segundo segmento: do ponto de dobra até o destino
          var t2 = (pl.progress - 0.5) * 2;
          px = trace.midX + (trace.to.x - trace.midX) * t2;
          py = trace.midY + (trace.to.y - trace.midY) * t2;
        }

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(157, 95, 255, 0.9)';
        ctx.shadowColor = 'rgba(124, 58, 237, 1)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  };

  // ============================================================
  // INICIALIZAÇÃO — associa cada efeito à sua seção
  // ============================================================
  setupCanvas('about',    matrixEffect);
  setupCanvas('skills',   geometricEffect);
  setupCanvas('projects', dataFlowEffect);
  setupCanvas('contact',  circuitEffect);

})();
