/* ============================================================
   SECTION BACKGROUND EFFECTS
   Neon / Matrix / Geometric / Data Flow canvases
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var activeCanvases = [];

  // ============================================================
  // UTILITY — setup canvas with IntersectionObserver for perf
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

    // Only animate when visible
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!running) { running = true; loop(); }
      } else {
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
  // 1. ABOUT — Matrix Code Rain
  // ============================================================
  var matrixEffect = {
    init: function (canvas, ctx) {
      var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01{}[]<>/=;:$#@!&|~'.split('');
      var fontSize = isMobile ? 12 : 14;
      var cols = Math.floor((canvas.width / DPR) / fontSize);
      var TAIL = 10; // number of trailing chars per column
      var streams = [];
      for (var i = 0; i < cols; i++) {
        streams.push({
          y: Math.random() * -200,           // current head position (in rows)
          speed: Math.random() * 0.08 + 0.05,
          tail: new Array(TAIL).fill(null).map(function () {
            return { char: chars[Math.floor(Math.random() * chars.length)], age: 1 };
          })
        });
      }
      return { chars: chars, fontSize: fontSize, streams: streams, cols: cols, TAIL: TAIL };
    },

    resize: function (canvas, ctx, state) {
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

      // Fully transparent each frame — no background fill, no residue
      ctx.clearRect(0, 0, w, h);

      ctx.font = state.fontSize + 'px "Courier New", monospace';

      for (var i = 0; i < state.cols; i++) {
        var s = state.streams[i];
        s.y += s.speed;

        // Shift tail: push new char at head, drop oldest
        s.tail.unshift({ char: state.chars[Math.floor(Math.random() * state.chars.length)], age: 0 });
        if (s.tail.length > state.TAIL) s.tail.pop();

        var headY = Math.floor(s.y) * state.fontSize;
        if (headY < -state.fontSize) continue;

        for (var t = 0; t < s.tail.length; t++) {
          var charY = headY - t * state.fontSize;
          if (charY < 0 || charY > h) continue;

          // Opacity fades from head to tail
          var alpha = (1 - t / state.TAIL) * (t === 0 ? 0.35 : 0.18);

          if (t === 0) {
            // Head: soft neon glow
            ctx.shadowColor = 'rgba(124, 58, 237, 0.3)';
            ctx.shadowBlur = 5;
            ctx.fillStyle = 'rgba(157, 95, 255, ' + alpha + ')';
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(124, 58, 237, ' + alpha + ')';
          }

          ctx.fillText(s.tail[t].char, i * state.fontSize, charY);
        }

        // Reset column when head exits bottom
        if (headY > h + state.TAIL * state.fontSize) {
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
  // 2. SKILLS — Neon Geometric Grid
  // ============================================================
  var geometricEffect = {
    init: function (canvas, ctx, section) {
      var spacing = isMobile ? 60 : 45;
      var nodes = [];
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;

      for (var x = 0; x < w + spacing; x += spacing) {
        for (var y = 0; y < h + spacing; y += spacing) {
          nodes.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            baseX: x,
            baseY: y,
            radius: Math.random() * 1.5 + 0.5,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.005 + 0.002
          });
        }
      }

      // Select some edges for neon pulses
      var pulses = [];
      for (var p = 0; p < (isMobile ? 3 : 6); p++) {
        pulses.push({
          fromIdx: Math.floor(Math.random() * nodes.length),
          toIdx: Math.floor(Math.random() * nodes.length),
          progress: Math.random(),
          speed: Math.random() * 0.003 + 0.001
        });
      }

      return { nodes: nodes, spacing: spacing, pulses: pulses, time: 0 };
    },

    resize: function (canvas, ctx, state) {
      // Regenerate on resize
      var newState = this.init(canvas, ctx);
      state.nodes = newState.nodes;
      state.pulses = newState.pulses;
    },

    draw: function (canvas, ctx, state) {
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;
      state.time++;

      ctx.clearRect(0, 0, w, h);

      // Draw grid lines
      for (var i = 0; i < state.nodes.length; i++) {
        var node = state.nodes[i];
        // Gentle float
        node.x = node.baseX + Math.sin(state.time * node.speed + node.phase) * 3;
        node.y = node.baseY + Math.cos(state.time * node.speed * 0.7 + node.phase) * 3;

        // Connect to nearby nodes
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

        // Draw node dot
        var pulse = (Math.sin(state.time * 0.02 + node.phase) + 1) * 0.5;
        var alpha = 0.15 + pulse * 0.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, ' + alpha + ')';
        ctx.fill();
      }

      // Draw neon pulses traveling along edges
      for (var p = 0; p < state.pulses.length; p++) {
        var pl = state.pulses[p];
        pl.progress += pl.speed;
        if (pl.progress > 1) {
          pl.progress = 0;
          pl.fromIdx = Math.floor(Math.random() * state.nodes.length);
          pl.toIdx = Math.floor(Math.random() * state.nodes.length);
        }

        var from = state.nodes[pl.fromIdx];
        var to = state.nodes[pl.toIdx];
        if (!from || !to) continue;

        var px = from.x + (to.x - from.x) * pl.progress;
        var py = from.y + (to.y - from.y) * pl.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(157, 95, 255, 0.8)';
        ctx.shadowColor = 'rgba(124, 58, 237, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pulse line trail
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
  // 3. PROJECTS — Data Flow Streams
  // ============================================================
  var dataFlowEffect = {
    init: function (canvas, ctx) {
      var streamCount = isMobile ? 6 : 12;
      var streams = [];
      var h = canvas.height / DPR;
      var w = canvas.width / DPR;

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
          y: (h / streamCount) * i + Math.random() * 30,
          x: Math.random() * w * 2 - w,
          speed: Math.random() * 0.6 + 0.2,
          text: snippets[Math.floor(Math.random() * snippets.length)],
          opacity: Math.random() * 0.3 + 0.08,
          fontSize: Math.random() * 3 + (isMobile ? 9 : 11),
          direction: Math.random() > 0.5 ? 1 : -1
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
  // 4. CONTACT — Circuit Board with Neon Pulses
  // ============================================================
  var circuitEffect = {
    init: function (canvas, ctx) {
      var w = canvas.width / DPR;
      var h = canvas.height / DPR;
      var gridSize = isMobile ? 50 : 35;
      var nodes = [];
      var traces = [];

      // Create grid nodes
      for (var x = gridSize; x < w; x += gridSize) {
        for (var y = gridSize; y < h; y += gridSize) {
          if (Math.random() > 0.6) {
            nodes.push({
              x: x,
              y: y,
              radius: Math.random() > 0.7 ? 3 : 1.5,
              glow: Math.random() * Math.PI * 2
            });
          }
        }
      }

      // Create right-angle traces between some nodes
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = Math.abs(nodes[i].x - nodes[j].x);
          var dy = Math.abs(nodes[i].y - nodes[j].y);
          if ((dx < gridSize * 2.5 && dy < gridSize * 2.5) && Math.random() > 0.7) {
            // Right-angle path: horizontal then vertical
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

      // Traveling pulses
      var pulseCount = isMobile ? 4 : 8;
      var pulses = [];
      for (var p = 0; p < pulseCount; p++) {
        if (traces.length > 0) {
          pulses.push({
            traceIdx: Math.floor(Math.random() * traces.length),
            progress: Math.random(),
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

      // Draw traces (right-angle paths)
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

      // Draw nodes
      for (var i = 0; i < state.nodes.length; i++) {
        var node = state.nodes[i];
        var pulse = (Math.sin(state.time * 0.015 + node.glow) + 1) * 0.5;
        var alpha = 0.1 + pulse * 0.25;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, ' + alpha + ')';

        if (node.radius > 2) {
          ctx.shadowColor = 'rgba(157, 95, 255, ' + (alpha * 0.8) + ')';
          ctx.shadowBlur = 8;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Ring on larger nodes
        if (node.radius > 2) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(124, 58, 237, ' + (alpha * 0.3) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw traveling pulses
      for (var p = 0; p < state.pulses.length; p++) {
        var pl = state.pulses[p];
        pl.progress += pl.speed;

        if (pl.progress > 1) {
          pl.progress = 0;
          pl.traceIdx = Math.floor(Math.random() * state.traces.length);
        }

        var trace = state.traces[pl.traceIdx];
        if (!trace) continue;

        // Calculate position along right-angle path
        var px, py;
        if (pl.progress < 0.5) {
          // First leg: from → mid
          var t1 = pl.progress * 2;
          px = trace.from.x + (trace.midX - trace.from.x) * t1;
          py = trace.from.y + (trace.midY - trace.from.y) * t1;
        } else {
          // Second leg: mid → to
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
  // INIT — Setup all section canvases
  // ============================================================
  setupCanvas('about', matrixEffect);
  setupCanvas('skills', geometricEffect);
  setupCanvas('projects', dataFlowEffect);
  setupCanvas('contact', circuitEffect);

})();
