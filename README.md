# Matheus S. Caldas — Portfolio

> **DevOps & Cloud Engineer**
> [matheuscaldas.com](http://matheuscaldas.com/)

## Sobre

Portfólio pessoal desenvolvido para apresentar minha trajetória, habilidades e projetos como Engenheiro DevOps & Cloud. O site foi construído do zero com foco em performance, responsividade e uma experiência interativa inspirada em terminais de linha de comando.

## Preview

![Hero Section](images/Hero%20section.png)

O site está disponível em: **[matheuscaldas.com](http://matheuscaldas.com/)**

## Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|-------------|
| **Front-End** | HTML5, CSS3, JavaScript (Vanilla) |
| **Fontes** | Google Fonts (Poppins) |
| **Ícones** | Ionicons, Devicons |
| **Design** | Glassmorphism, CSS Grid, Flexbox |
| **Responsividade** | Mobile-first, Media Queries |

## Estrutura do Projeto

```
portfolio/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos globais e responsivos
├── js/
│   └── script.js       # Lógica dos terminais interativos, animações e easter eggs
├── images/
│   └── favicon.png     # Favicon do site
└── README.md
```

## Funcionalidades

### Terminais Interativos
O site possui dois terminais funcionais (hero e about) que aceitam comandos reais digitados pelo usuário. Os terminais são ativados ao clicar neles. Comandos disponíveis incluem `help`, `about`, `skills`, `deploy`, `push`, entre outros — com easter eggs escondidos para os curiosos. Suporta navegação no histórico de comandos com as setas do teclado (↑/↓), igual a um terminal real.

### Seções
- **Hero** — Apresentação com terminal interativo e links sociais
- **Sobre Mim** — Resumo profissional, destaques e terminal secundário
- **Habilidades & Tecnologias** — Cloud & Infraestrutura, DevOps & Automação, Front-End & Back-End
- **Projetos** — Cards clicáveis que redirecionam direto para os repositórios no GitHub
- **Contato** — Formulário de contato com cópia de e-mail por clique

### Design
- Tema escuro com paleta roxa (accent `#9b59b6`)
- Glass cards com `backdrop-filter` e bordas translúcidas
- Animações de fade-in ao scroll via Intersection Observer
- Cursor customizado e efeitos de hover suaves
- Layout totalmente responsivo (mobile, tablet e desktop)

### Easter Eggs
O terminal esconde comandos secretos — experimente explorar além do `help` para descobri-los.

## Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/berilovania/portfolio.git

# Abra o index.html no navegador
# Ou use um servidor local:
npx serve .
```

Não há dependências de build — é um projeto estático puro (HTML + CSS + JS).

## Contato

- **E-mail:** matheus.santos.devops@gmail.com
- **LinkedIn:** [linkedin.com/in/matheus-santos-c](https://www.linkedin.com/in/matheus-santos-c/)
- **GitHub:** [github.com/berilovania](https://github.com/berilovania)

## Licença

Este projeto é de uso pessoal. Todos os direitos reservados.
