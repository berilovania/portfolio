# Matheus S. Caldas — Portfolio

> **DevOps & Cloud Engineer**
> [matheuscaldas.com](http://matheuscaldas.com/)

## Sobre

Portfólio pessoal desenvolvido para apresentar minha trajetória, habilidades e projetos como Engenheiro DevOps & Cloud. O site foi construído do zero com foco em performance, responsividade e uma experiência visual premium — com animações GSAP, efeitos de canvas por seção, cursor customizado e um terminal interativo funcional inspirado em pipelines reais.

## Preview

![Hero Section](images/Hero%20section.png)

O site está disponível em: **[matheuscaldas.com](http://matheuscaldas.com/)**

## Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|-------------|
| **Front-End** | HTML5, CSS3, JavaScript (Vanilla) |
| **Animações** | GSAP 3 + ScrollTrigger (CDN) |
| **Fontes** | Google Fonts (Poppins) |
| **Ícones** | Ionicons, Devicons |
| **Design** | Glassmorphism, CSS Grid, Flexbox |
| **Responsividade** | Mobile-first, Media Queries |

## Estrutura do Projeto

```
portfolio/
├── index.html               # Página principal
├── css/
│   ├── styles.css           # Estilos globais, design tokens e responsividade
│   └── effects.css          # Efeitos visuais: cursor, orbs, tilt, canvas, progress bar
├── js/
│   ├── script.js            # Terminal interativo, animações do hero e easter eggs
│   ├── effects.js           # Orquestração GSAP: scroll reveal, cursor, tilt 3D, magnético
│   ├── particles.js         # Rede de partículas no hero (canvas, reativa ao mouse)
│   └── section-effects.js   # Efeitos de fundo por seção (Matrix, Grade Neon, Data Flow, Circuito)
├── images/
│   └── favicon.ico
└── README.md
```

## Funcionalidades

### Terminal Interativo
O hero possui um terminal funcional que aceita comandos digitados pelo usuário. Ao clicar no terminal, o foco é capturado — incluindo teclado virtual no mobile. Comandos disponíveis: `help`, `git push`, `docker`, `kubectl`, `terraform`, `neofetch`, `status`, `whoami`, `ping`, `ls`, `date`, `uptime`, `clear`, `devops` e outros. Suporta histórico de comandos com ↑/↓ e easter eggs escondidos.

### Animações Premium (GSAP)
- **Entrada do Hero** — timeline sequencial: saudação → nome → cargo → descrição → botões → sociais → terminal
- **Scroll Reveal** — elementos entram com fade + translateY ao aparecer na tela (ScrollTrigger)
- **Stagger** — pills de habilidades e cards de projeto entram em sequência
- **Contador animado** — números da seção "Sobre Mim" contam de 0 até o valor ao entrar na tela
- **Barra de progresso** — barra gradiente de 3px no topo acompanha o scroll da página

### Efeitos de Fundo por Seção (Canvas)
Cada seção possui um canvas animado temático, ativado apenas quando visível (IntersectionObserver):

| Seção | Efeito |
|-------|--------|
| **Sobre Mim** | Matrix Rain — caracteres katakana e símbolos caindo em roxo neon |
| **Habilidades** | Grade Geométrica — nós conectados com pulsos neon viajando entre eles |
| **Projetos** | Data Flow — comandos DevOps reais fluindo horizontalmente |
| **Contato** | Circuit Board — trilhas de PCB com pulsos elétricos neon |

### Efeitos Interativos (Desktop)
- **Cursor personalizado** — dot sólido + anel com trailing, escala em elementos interativos
- **Hover magnético** — botões e links sociais seguem o cursor com snap elástico ao sair
- **Tilt 3D** — glass cards inclinam ±3° com glare suave seguindo o mouse
- **Orbs flutuantes** — 3 gradientes com blur extremo animam no fundo do hero

### Design
- Tema escuro com paleta roxa (accent `#7c3aed`, light `#9d5fff`)
- Glass cards com `backdrop-filter`, bordas translúcidas e box-shadow com glow
- Noise overlay (SVG `feTurbulence`) para textura de película sutil
- Divisores de seção com linha gradiente e glow neon
- Layout totalmente responsivo — mobile, tablet e desktop

### Acessibilidade
- `prefers-reduced-motion`: desativa todos os canvas animados, cursor customizado, orbs e animações GSAP (revela instantaneamente)
- Touch devices: cursor customizado, hover magnético e tilt 3D desativados automaticamente

## Projetos Destacados

| Projeto | Tecnologias | Descrição |
|---------|-------------|-----------|
| [OrderService Pipeline](https://github.com/berilovania/OrderService-ProjectDevOps) | Kubernetes, Docker, GitHub Actions, GCP, FastAPI | Pipeline CI/CD completo com deploy automático em k3s, scan Trivy e métricas Prometheus |
| [Malware Simulation Lab](https://github.com/berilovania/malware-simulation-lab) | Python, Cryptography, Pynput | Laboratório educacional com ransomware simulado e keylogger em ambiente controlado |
| [Brute Force Lab](https://github.com/berilovania/kali-medusa-bruteforce-lab) | Kali Linux, Medusa, Metasploitable | Testes ofensivos com Medusa em FTP, SMB e DVWA com estratégias de mitigação |
| [YouTube AI Summary](https://github.com/berilovania/youtube-ai-summary) | Python, Streamlit, Mistral AI | Resumo automático de vídeos via legendas + exportação TXT/PDF |

## Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/berilovania/portfolio.git

# Abra o index.html no navegador
# Ou use um servidor local (recomendado para evitar restrições de CORS):
npx serve .
```

Não há dependências de build — é um projeto estático puro (HTML + CSS + JS). As dependências externas (GSAP, Ionicons, Devicons, Google Fonts) são carregadas via CDN.

## Contato

- **E-mail:** matheus.santos.devops@gmail.com
- **LinkedIn:** [linkedin.com/in/matheus-santos-c](https://www.linkedin.com/in/matheus-santos-c/)
- **GitHub:** [github.com/berilovania](https://github.com/berilovania)

## Licença

Este projeto é de uso pessoal. Todos os direitos reservados.
