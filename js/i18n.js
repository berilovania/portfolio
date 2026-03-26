(function () {
  'use strict';

  var FALLBACK_LANG = 'pt-BR';
  var STORAGE_KEY = 'portfolio.lang';
  var SUPPORTED = ['pt-BR', 'en-US'];

  var I18N = {
    'pt-BR': {
      meta_title: 'Matheus S. Caldas — DevOps',
      meta_description: 'Matheus S. Caldas — DevOps',
      nav_skills: 'Habilidades',
      nav_projects: 'Projetos',
      nav_certifications: 'Certificações',
      nav_contact: 'Contato',
      nav_toggle_label: 'Abrir menu',
      hero_greeting: 'Olá, eu sou',
      hero_description: 'Apaixonado por automação, infraestrutura como código e soluções escaláveis na nuvem. Transformando desafios complexos em pipelines elegantes e confiáveis.',
      hero_cta_projects: 'Ver Projetos',
      hero_cta_contact: 'Fale Comigo',
      section_skills_title: 'Habilidades & Tecnologias',
      skills_cat_cloud: 'Cloud & Infraestrutura',
      skills_cat_devops: 'DevOps & Automação',
      skills_cat_dev: 'Front-End & Back-End',
      section_projects_title: 'Projetos',
      project_orderservice_short: 'Pipeline DevOps de ponta a ponta: GitHub Actions com testes automáticos, build multi-stage Docker, scan Trivy, deploy em Kubernetes (k3s) na GCP, HTTPS automático com cert-manager + Let\'s Encrypt, métricas Prometheus e dashboards Grafana.',
      project_orderservice_full: 'Pipeline DevOps de ponta a ponta construído com GitHub Actions. O fluxo cobre testes automáticos contra PostgreSQL real, build multi-stage Docker, scan de vulnerabilidades com Trivy (bloqueia CVEs CRITICAL/HIGH), publicação no GHCR com tag por commit SHA e deploy automático em cluster k3s na GCP Compute Engine via SSH. A aplicação — uma API REST FastAPI de gerenciamento de pedidos — roda com 2 réplicas, liveness/readiness probes, rolling update sem downtime e PostgreSQL StatefulSet com PVC persistente. Infraestrutura completa: NGINX Ingress com HTTPS automático via cert-manager + Let\'s Encrypt, rate-limiting, métricas Prometheus com dashboards Grafana auto-provisionados e SecurityContext restritivo (container não-root, filesystem read-only). Do git push à produção, zero intervenção manual.',
      project_youtube_short: 'Aplicação full-stack (FastAPI + Vite) que resume vídeos do YouTube via Mistral AI. Gera tópicos ou interpreta músicas, com animação typewriter, histórico local e exportação em TXT/PDF.',
      project_youtube_full: 'Aplicação full-stack com frontend SPA (Vite + Vanilla JS) e backend FastAPI que resume vídeos do YouTube via API Mistral AI. Gera até 5 tópicos objetivos ou interpreta letras de música. Possui animação typewriter, histórico local dos últimos 20 resumos, exportação em TXT/PDF e suporte a transcrições em PT, PT-BR e EN.',
      project_malware_short: 'Laboratório educacional de simulação de malware em ambiente controlado. Implementa ransomware simulado com criptografia de arquivos e keylogger com envio por e-mail, focado em defesa e mitigação de ameaças.',
      project_malware_full: 'Laboratório educacional de simulação de malware em ambiente controlado e isolado. Implementa dois módulos: um ransomware simulado que criptografa arquivos via biblioteca Cryptography, demonstrando como esse tipo de ataque funciona internamente; e um keylogger que captura pressionamentos de teclas com Pynput e os envia por e-mail. O foco é educacional e defensivo — cada módulo vem acompanhado de análise do comportamento malicioso e estratégias concretas de mitigação.',
      project_bruteforce_short: 'Laboratório de segurança ofensiva com Kali Linux e Medusa. Demonstra brute force em FTP, testes em aplicações web (DVWA) com bypass de CSRF, e password spraying em SMB, com estratégias de mitigação documentadas.',
      project_bruteforce_full: 'Laboratório de segurança ofensiva configurado com Kali Linux e a ferramenta Medusa. Cobre três cenários: ataques de força bruta em FTP, testes em aplicações web vulneráveis (DVWA) com bypass de proteção CSRF, e password spraying em SMB. Cada cenário é documentado com análise dos vetores explorados e estratégias de mitigação, sendo valioso tanto para pentesters em formação quanto para profissionais de segurança defensiva.',
      projects_cta: 'Ver mais no GitHub',
      project_dialog_site_btn: 'Acessar Site',
      project_dialog_btn: 'Ver projeto',
      section_certs_title: 'Certificações',
      section_contact_title: 'Vamos Conversar',
      contact_intro: 'Estou aberto a oportunidades nas áreas de DevOps e Cloud Engineering. Sinta-se à vontade para entrar em contato — adoro discutir novos projetos e desafios tecnológicos!',
      form_label_name: 'Nome',
      form_label_email: 'E-mail',
      form_label_message: 'Mensagem',
      form_placeholder_name: 'Seu nome',
      form_placeholder_email: 'seu@email.com',
      form_placeholder_message: 'Sua mensagem...',
      form_submit: 'Enviar Mensagem',
      form_submitting: 'Enviando...',
      form_validation_error: 'Preencha os campos destacados corretamente.',
      form_success: 'Mensagem enviada! Entrarei em contato em breve.',
      form_error: 'Erro ao enviar. Tente novamente.',
      form_offline: 'Sem conexão. Verifique sua internet e tente novamente.',
      form_subject: 'Novo contato via portfólio',
      footer_made_by: 'Feito por',
      footer_tagline: 'Automatizando o futuro, um pipeline de cada vez.',
      footer_back_top_label: 'Voltar ao topo',
      copy_toast: 'E-mail copiado!',
      dialog_close_label: 'Fechar',
      terminal_placeholder_0: '// Digite oi e dê enter ↵',
      terminal_placeholder_1: 'Você sabia que dá para \n      interagir comigo? 😊',
      help_1_title: 'Comandos (1/3):',
      help_2_title: 'Comandos (2/3):',
      help_3_title: 'Easter eggs (3/3):',
      help_git_push: 'deploy para produção',
      help_docker: 'status da imagem',
      help_kubectl: 'status dos pods',
      help_terraform: 'plano de infra',
      help_whoami: 'quem sou eu',
      help_ls: 'listar arquivos',
      help_ping: 'testar conexão',
      help_more_2: 'help 2 → mais comandos',
      help_devops: 'reiniciar animação',
      help_date: 'data e hora atual',
      help_uptime: 'tempo online',
      help_cat: 'ler arquivo',
      help_status: 'status do sistema',
      help_neofetch: 'info do sistema',
      help_clear: 'limpar tela',
      help_more_3: 'help 3 → ???',
      help_secret_1: 'encontre os 3 comandos',
      help_secret_2: 'secretos... boa sorte!',
      cmd_sudo: '> permissão negada (boa tentativa)\n  <span class="t-dim">dica: tente invadir de outro jeito...</span>',
      cmd_terraform_apply: '> 4 criados, 0 destruídos',
      cmd_terraform_plan: '> plano: 4 a criar, 0 a destruir',
      cmd_terraform: '> recursos: 4 gerenciados\n  <span class="t-dim">recurso #42: classificado</span>',
      cmd_aws: '> 3 instâncias em us-east-1\n  <span class="t-dim">instância secreta: i-1337hack</span>',
      cmd_rm: '> rm: operação não permitida',
      cmd_git_push: '> já em produção. relaxa :)',
      cmd_git: '> branch main. nada a commitar.',
      cmd_kubectl: '> pods: 3/3 rodando  ● ● ●\n  <span class="t-dim">pod-42 respondeu algo estranho...</span>',
      cmd_docker: '> imagem: latest  (atualizada)',
      cmd_uptime: '> online há {seconds}s\n  <span class="t-dim">tempo suficiente pra ver a matrix?</span>',
      cmd_cat: '> 🐱 miau! (esperava um arquivo?)',
      cmd_status: '> cpu: 12%  mem: 4.2GB/16GB\n  > disk: 47% usado\n  > <span class="t-ok">todos os serviços ok</span>\n  <span class="t-dim">porta 1337: conexão suspeita...</span>',
      cmd_neofetch: '> <span class="t-ok">matheus</span>@portfolio\n  > OS: DevOps Linux 4.2\n  > Shell: bash 5.1\n  > Uptime: ∞\n  > Stack: AWS + K8s + Terraform',
      cmd_greeting: '> oi! bem-vindo ao terminal :)\n  > sinta-se à vontade para \n    explorar os comandos! \n  > dica: tente "help"',
      cmd_ping: '> pong (64 bytes, tempo=0.4ms)\n  <span class="t-dim">resposta vinda de... Nebuchadnezzar?</span>',
      cmd_ls: '> deploy.yml  src/  README.md\n  <span class="t-dim">.secret_42  (permissão negada)</span>',
      cmd_whoami: '> matheus — engenheiro devops',
      cmd_not_found: '> <span class="t-err">Comando não encontrado.</span> Digite \'<span class="t-ok">help</span>\' \n    para mais informações.',
      glitch_hack_1: 'acesso concedido.',
      glitch_hack_2: 'bem-vindo ao sistema,',
      glitch_hack_3: 'agente.',
      glitch_42_1: 'a resposta para a vida,',
      glitch_42_2: 'o universo e tudo mais.',
      glitch_42_3: '— Douglas Adams',
      anim_pipeline_started: 'pipeline iniciado',
      anim_updating: 'atualizando',
      anim_pods_running: 'pods rodando',
      anim_planning: 'planejando recursos...',
      anim_creating: 'criando',
      anim_created: 'criado',
      anim_summary: '4 criados, 0 alt., 0 destruídos'
    },
    'en-US': {
      meta_title: 'Matheus S. Caldas — DevOps',
      meta_description: 'Matheus S. Caldas — DevOps',
      nav_skills: 'Skills',
      nav_projects: 'Projects',
      nav_certifications: 'Certifications',
      nav_contact: 'Contact',
      nav_toggle_label: 'Open menu',
      hero_greeting: 'Hi, I am',
      hero_description: 'Passionate about automation, infrastructure as code, and scalable cloud solutions. Turning complex challenges into elegant, reliable pipelines.',
      hero_cta_projects: 'View Projects',
      hero_cta_contact: 'Contact Me',
      section_skills_title: 'Skills & Technologies',
      skills_cat_cloud: 'Cloud & Infrastructure',
      skills_cat_devops: 'DevOps & Automation',
      skills_cat_dev: 'Front-End & Back-End',
      section_projects_title: 'Projects',
      project_orderservice_short: 'End-to-end DevOps pipeline: GitHub Actions with automated tests, multi-stage Docker build, Trivy scanning, Kubernetes (k3s/GCP) deploy, automatic HTTPS via cert-manager + Let\'s Encrypt, Prometheus metrics, and Grafana dashboards.',
      project_orderservice_full: 'End-to-end DevOps pipeline built with GitHub Actions. The flow covers automated tests against a real PostgreSQL database, multi-stage Docker build, Trivy vulnerability scanning (blocks CRITICAL/HIGH CVEs), GHCR image publishing with commit SHA tags, and automatic deployment to a k3s cluster on GCP Compute Engine via SSH. The application — a FastAPI REST order management API — runs with 2 replicas, liveness/readiness probes, zero-downtime rolling updates, and a PostgreSQL StatefulSet with persistent PVC. Full infrastructure: NGINX Ingress with automatic HTTPS via cert-manager + Let\'s Encrypt, rate-limiting, Prometheus metrics with auto-provisioned Grafana dashboards, and restrictive SecurityContext (non-root container, read-only filesystem). From git push to production with zero manual intervention.',
      project_youtube_short: 'Full-stack app (FastAPI + Vite) that summarizes YouTube videos via Mistral AI. Generates bullet-point topics or interprets song lyrics, with typewriter animation, local history, and TXT/PDF export.',
      project_youtube_full: 'Full-stack app with a SPA frontend (Vite + Vanilla JS) and FastAPI backend that summarizes YouTube videos via the Mistral AI API. Generates up to 5 concise topics or interprets song lyrics. Features typewriter animation, local history of the last 20 summaries, TXT/PDF export, and transcript support for PT, PT-BR and EN.',
      project_malware_short: 'Educational malware simulation lab in a controlled environment. Implements simulated ransomware with file encryption and a keylogger with e-mail exfiltration, focused on defense and threat mitigation.',
      project_malware_full: 'Educational malware simulation lab in a controlled, isolated environment. It implements two modules: a simulated ransomware that encrypts files using the Cryptography library, showing how this type of attack works internally; and a keylogger that captures keystrokes with Pynput and sends them by e-mail. The focus is educational and defensive, with each module including behavior analysis and practical mitigation strategies.',
      project_bruteforce_short: 'Offensive security lab with Kali Linux and Medusa. Demonstrates FTP brute force, tests against vulnerable web apps (DVWA) with CSRF bypass, and SMB password spraying, with documented mitigation strategies.',
      project_bruteforce_full: 'Offensive security lab configured with Kali Linux and Medusa. Covers three scenarios: FTP brute-force attacks, tests against vulnerable web apps (DVWA) with CSRF bypass, and SMB password spraying. Each scenario is documented with vector analysis and mitigation strategies, useful for both aspiring pentesters and defensive security professionals.',
      projects_cta: 'See more on GitHub',
      project_dialog_site_btn: 'Visit Site',
      project_dialog_btn: 'View project',
      section_certs_title: 'Certifications',
      section_contact_title: "Let's Talk",
      contact_intro: 'I am open to opportunities in DevOps and Cloud Engineering. Feel free to reach out — I love discussing new projects and technical challenges!',
      form_label_name: 'Name',
      form_label_email: 'E-mail',
      form_label_message: 'Message',
      form_placeholder_name: 'Your name',
      form_placeholder_email: 'your@email.com',
      form_placeholder_message: 'Your message...',
      form_submit: 'Send Message',
      form_submitting: 'Sending...',
      form_validation_error: 'Please fill the highlighted fields correctly.',
      form_success: 'Message sent! I will get back to you soon.',
      form_error: 'Failed to send. Please try again.',
      form_offline: 'No connection. Check your internet and try again.',
      form_subject: 'New portfolio contact',
      footer_made_by: 'Made by',
      footer_tagline: 'Automating the future, one pipeline at a time.',
      footer_back_top_label: 'Back to top',
      copy_toast: 'E-mail copied!',
      dialog_close_label: 'Close',
      terminal_placeholder_0: '// Type hi and press enter ↵',
      terminal_placeholder_1: 'Did you know you can \n      interact with me? 😊',
      help_1_title: 'Commands (1/3):',
      help_2_title: 'Commands (2/3):',
      help_3_title: 'Easter eggs (3/3):',
      help_git_push: 'deploy to production',
      help_docker: 'image status',
      help_kubectl: 'pods status',
      help_terraform: 'infrastructure plan',
      help_whoami: 'who am I',
      help_ls: 'list files',
      help_ping: 'test connectivity',
      help_more_2: 'help 2 -> more commands',
      help_devops: 'restart animation',
      help_date: 'current date and time',
      help_uptime: 'online time',
      help_cat: 'read file',
      help_status: 'system status',
      help_neofetch: 'system info',
      help_clear: 'clear screen',
      help_more_3: 'help 3 -> ???',
      help_secret_1: 'find the 3',
      help_secret_2: 'secret commands... good luck!',
      cmd_sudo: '> permission denied (nice try)\n  <span class="t-dim">hint: try hacking another way...</span>',
      cmd_terraform_apply: '> 4 created, 0 destroyed',
      cmd_terraform_plan: '> plan: 4 to add, 0 to destroy',
      cmd_terraform: '> resources: 4 managed\n  <span class="t-dim">resource #42: classified</span>',
      cmd_aws: '> 3 instances in us-east-1\n  <span class="t-dim">secret instance: i-1337hack</span>',
      cmd_rm: '> rm: operation not allowed',
      cmd_git_push: '> already in production. relax :)',
      cmd_git: '> branch main. nothing to commit.',
      cmd_kubectl: '> pods: 3/3 running  ● ● ●\n  <span class="t-dim">pod-42 replied something strange...</span>',
      cmd_docker: '> image: latest  (updated)',
      cmd_uptime: '> online for {seconds}s\n  <span class="t-dim">long enough to see the matrix?</span>',
      cmd_cat: '> 🐱 meow! (expected a file?)',
      cmd_status: '> cpu: 12%  mem: 4.2GB/16GB\n  > disk: 47% used\n  > <span class="t-ok">all services healthy</span>\n  <span class="t-dim">port 1337: suspicious connection...</span>',
      cmd_neofetch: '> <span class="t-ok">matheus</span>@portfolio\n  > OS: DevOps Linux 4.2\n  > Shell: bash 5.1\n  > Uptime: ∞\n  > Stack: AWS + K8s + Terraform',
      cmd_greeting: '> hi! welcome to the terminal :)\n  > feel free to \n    explore commands! \n  > tip: try "help"',
      cmd_ping: '> pong (64 bytes, time=0.4ms)\n  <span class="t-dim">reply came from... Nebuchadnezzar?</span>',
      cmd_ls: '> deploy.yml  src/  README.md\n  <span class="t-dim">.secret_42  (permission denied)</span>',
      cmd_whoami: '> matheus — devops engineer',
      cmd_not_found: '> <span class="t-err">Command not found.</span> Type \'<span class="t-ok">help</span>\' \n    for more information.',
      glitch_hack_1: 'access granted.',
      glitch_hack_2: 'welcome to the system,',
      glitch_hack_3: 'agent.',
      glitch_42_1: 'the answer to life,',
      glitch_42_2: 'the universe and everything.',
      glitch_42_3: '— Douglas Adams',
      anim_pipeline_started: 'pipeline started',
      anim_updating: 'updating',
      anim_pods_running: 'pods running',
      anim_planning: 'planning resources...',
      anim_creating: 'creating',
      anim_created: 'created',
      anim_summary: '4 created, 0 changed, 0 destroyed'
    }
  };

  function normalizeLang(lang) {
    if (!lang) return FALLBACK_LANG;
    var raw = String(lang).trim();
    if (!raw) return FALLBACK_LANG;
    var lower = raw.toLowerCase();
    if (lower.indexOf('pt') === 0) return 'pt-BR';
    if (lower.indexOf('en') === 0) return 'en-US';
    return FALLBACK_LANG;
  }

  var i18n = {
    current: FALLBACK_LANG,
    t: function (key) {
      var currentDict = I18N[this.current] || {};
      var fallbackDict = I18N[FALLBACK_LANG] || {};
      return currentDict[key] || fallbackDict[key] || key;
    },
    lang: function () {
      return this.current;
    },
    init: function () {
      var saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { console.warn('[i18n] localStorage read failed:', e); }
      var next = normalizeLang(saved || navigator.language || FALLBACK_LANG);
      this.current = SUPPORTED.indexOf(next) > -1 ? next : FALLBACK_LANG;
      this.apply();
    },
    setLang: function (lang) {
      var next = normalizeLang(lang);
      this.current = SUPPORTED.indexOf(next) > -1 ? next : FALLBACK_LANG;
      try { localStorage.setItem(STORAGE_KEY, this.current); } catch (e) { console.warn('[i18n] localStorage write failed:', e); }
      this.apply();
    },
    apply: function () {
      var self = this;
      document.documentElement.lang = self.current;

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        el.textContent = self.t(el.getAttribute('data-i18n'));
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        el.innerHTML = self.t(el.getAttribute('data-i18n-html'));
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        el.placeholder = self.t(el.getAttribute('data-i18n-placeholder'));
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        el.setAttribute('aria-label', self.t(el.getAttribute('data-i18n-aria')));
      });
      document.querySelectorAll('[data-i18n-description]').forEach(function (el) {
        el.setAttribute('data-description', self.t(el.getAttribute('data-i18n-description')));
      });
      document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
        el.setAttribute('content', self.t(el.getAttribute('data-i18n-content')));
      });
      document.querySelectorAll('[data-i18n-value]').forEach(function (el) {
        el.value = self.t(el.getAttribute('data-i18n-value'));
      });

      document.title = self.t('meta_title');

      var langToggle = document.getElementById('langToggle');
      if (langToggle) {
        langToggle.setAttribute('aria-label', self.current === 'pt-BR' ? 'Switch language to English' : 'Mudar idioma para português');
        langToggle.querySelectorAll('.lang-option').forEach(function (el) {
          el.classList.toggle('active', el.getAttribute('data-lang') === self.current);
        });
      }
    }
  };

  window.I18N = I18N;
  window.i18n = i18n;
})();
