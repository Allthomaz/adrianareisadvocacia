# Spec — Hero do site Adriana Reis

**Status:** atualizada; pronta para protótipo após validação das pendências factuais  
**Escopo:** header global + primeira dobra da homepage  
**Spec mestre:** `docs/spec-site.md`  
**Referências:** `docs/prd-site-escritorio-adriana-reis.md`, `pesquisa-estrategica`, `docs/astro-cloudflare-boas-praticas.md` e `assets/references/hero-referencia.jpg`

## 1. Objetivo

Apresentar Adriana Reis como advogada, informar imediatamente suas frentes de atuação e oferecer dois caminhos claros: conhecer a atuação ou entrar em contato.

A hero deve transmitir sofisticação editorial, presença humana, clareza e sobriedade, sem promessas de resultado, autoengrandecimento ou alegações de especialização não comprovadas.

## 2. Framework de copy

A copy aplica o princípio de Julian Shapiro:

> Conversão = desejo − (esforço + confusão)

Adaptação para este projeto:

- **Desejo:** presença pessoal de Adriana, identidade visual consistente e percepção de atendimento responsável.
- **Esforço:** poucas mensagens, navegação curta e dois próximos passos autoexplicativos.
- **Confusão:** H1 descritivo, áreas nomeadas e ausência de slogans vagos.
- **Limite ético:** conversão significa facilitar compreensão e contato responsável; não pressionar contratação.

Não haverá prova social, números de casos, resultados, clientes, depoimentos ou comparações na hero.

## 3. Copy recomendada

### Eyebrow

`DIREITO CIVIL · TRABALHISTA · PREVIDENCIÁRIO`

### H1

`Soluções jurídicas com estratégia, ética e clareza.`

“Clareza” substitui “resultados”: comunica uma qualidade verificável da
experiência sem sugerir garantia de desfecho. O eyebrow dá contexto jurídico ao
H1 e nomeia as três frentes.

### Texto de apoio

`Adriana Reis atua em demandas civis, trabalhistas e previdenciárias, com atenção às particularidades de cada contexto.`

Este texto depende de confirmação de Adriana sobre sua forma real de atendimento.

### Ações

- CTA principal: `Conheça a atuação`
- CTA secundário: `Entre em contato`

### Fallback se Previdenciário não for confirmado

Caso a forma de atendimento ainda não esteja validada:

- Eyebrow: `DIREITO CIVIL · DIREITO TRABALHISTA`
- H1: `Soluções jurídicas com estratégia, ética e clareza.`
- Apoio: `Adriana Reis atua em demandas civis e trabalhistas, com atenção às particularidades de cada contexto.`

## 4. Header

### Desktop

- Logo completa à esquerda.
- Links: `Início`, `Atuação`, `Sobre`, `Conteúdos`, `Contato`.
- CTA discreto à direita: `Entre em contato`.
- Altura visual aproximada: 88–96 px.
- Fundo inicialmente transparente ou marfim translúcido.
- Após scroll: fundo marfim com leve transparência, borda inferior sutil e redução moderada da altura.

### Mobile

- Logo compacta à esquerda.
- Botão de menu à direita com nome acessível.
- Menu em painel simples, sem animação complexa.
- O CTA de contato aparece dentro do painel.

## 5. Composição visual

### Conceito

`Editorial jurídico contemporâneo + marca pessoal.`

### Desktop, 1280 px ou mais

- Hero com altura mínima próxima de `min(920px, 100svh)` e nunca inferior a aproximadamente 720 px.
- Grid assimétrico: conteúdo entre 44% e 48%; fotografia entre 52% e 56%.
- Fundo-base marfim quente.
- Área vinho suavemente mais clara ocupando parte do lado direito, atrás da fotografia.
- Transição entre marfim e vinho construída com CSS, sem imagem raster decorativa.
- Fotografia de Adriana como elemento dominante, com enquadramento de aproximadamente joelhos/cintura para cima conforme a viewport.
- Monograma `AR` ampliado atrás da fotografia, em dourado ou marfim com opacidade muito baixa.
- Uma linha dourada curta pode acompanhar o eyebrow ou separar pequenos elementos.

### Tablet

- Manter duas colunas enquanto houver largura suficiente para preservar leitura e enquadramento.
- Reduzir o menu ou migrar para menu compacto antes de comprimir os links.
- Evitar que a fotografia invada a área do H1.

### Mobile, referência de 390 px

Ordem obrigatória:

1. Header.
2. Eyebrow.
3. H1.
4. Texto de apoio.
5. CTAs.
6. Fotografia.

A fotografia deve ganhar uma composição própria e não ser apenas uma versão reduzida do desktop. O bloco vinho pode começar atrás dos ombros ou na metade inferior da imagem.

## 6. Paleta inicial

| Token                  | Valor inicial | Aplicação                     |
| ---------------------- | ------------: | ----------------------------- |
| `--color-wine-700`     |     `#762638` | Área vinho principal e botões |
| `--color-wine-800`     |     `#5F1C2C` | Hover e contraste             |
| `--color-ivory-50`     |     `#F7F2E9` | Fundo principal               |
| `--color-ivory-100`    |     `#F4EBDD` | Texto claro e superfícies     |
| `--color-gold-500`     |     `#B78A55` | Linhas e detalhes pequenos    |
| `--color-graphite-900` |     `#282422` | Texto corrido                 |

O dourado não deve ser usado como textura, gradiente metálico ou grande superfície.

## 7. Tipografia

- Display/H1: serif editorial de alto contraste. Primeira opção para teste: `Bodoni Moda`.
- Interface e texto: sans-serif limpa. Primeira opção para teste: `Manrope`.
- Fontes devem ser hospedadas localmente em WOFF2 ou fornecidas por pacote local; não depender de requisição externa em produção.
- Limitar pesos carregados aos realmente utilizados.

A escolha final depende de teste visual com a logo; a tipografia da interface não deve tentar imitar exatamente o desenho do logotipo.

## 8. Fotografia e assets

### Fonte principal recomendada

`assets/references/09a0fbd0-a24e-11f1-97cb-41e964de6330.png`

- Resolução: 1664 × 2080 px.
- Roupa azul, mais próxima da fotografia original.
- Melhor margem para recortes responsivos.

### Asset necessário para implementação

`src/assets/images/adriana-hero-cutout.png`

Requisitos:

- Fundo realmente transparente.
- Preservar rosto, cabelo, roupa, mãos, postura e proporções.
- Sem retoque adicional, alteração de roupa ou reconstrução facial.
- Bordas de cabelo verificadas sobre marfim e vinho.

### Logos disponíveis

- `public/images/brand/adriana-reis-logo-wine.png`
- `public/images/brand/adriana-reis-logo-gold.png`
- `public/images/brand/adriana-reis-logo-ivory.png`

A hero clara deve usar prioritariamente a versão vinho.

## 9. Stack técnica

### Base

- Astro 7, com output estático.
- TypeScript em modo estrito.
- Tailwind CSS 4 via plugin oficial do Vite.
- GSAP core; ScrollTrigger apenas quando houver interação ligada ao scroll.
- Wrangler para preview e deploy estático no Cloudflare Workers.
- Componentes Astro estáticos.
- `lucide-astro` somente quando um ícone agregar compreensão.

### Não usar nesta entrega

- React.
- SPA ou hidratação global.
- Framer Motion/Motion.
- ScrollSmoother.
- Biblioteca de componentes.
- CMS.
- Carrossel.
- Sass.

### Dependências previstas

```bash
pnpm create astro@latest .
pnpm astro add tailwind sitemap
pnpm add gsap lucide-astro
pnpm add -D wrangler @astrojs/check prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

### Scripts previstos

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "preview:worker": "astro build && wrangler dev",
    "deploy": "astro build && wrangler deploy",
    "check": "astro check",
    "format": "prettier --write ."
  }
}
```

## 10. Arquitetura prevista

```text
src/
├── assets/
│   ├── fonts/
│   └── images/
│       └── adriana-hero-cutout.png
├── components/
│   ├── Header.astro
│   ├── Hero.astro
│   └── MobileMenu.astro
├── data/
│   └── site.ts
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
└── styles/
    └── global.css
```

Copy factual, URLs de contato e itens de navegação devem ficar em `src/data/site.ts`, separados da apresentação.

## 11. Movimento com GSAP

- Entrada curta do eyebrow, H1 e apoio com opacidade e deslocamento vertical pequeno.
- Revelação suave da fotografia, preferencialmente com máscara CSS.
- Hover discreto nos botões.
- Transição moderada do header durante scroll.
- Orquestrar a entrada com uma timeline curta e labels, sem delays encadeados.
- Usar `gsap.matchMedia()` para composições desktop/mobile e redução de movimento.
- Animar apenas `transform`, `opacity`/`autoAlpha` e máscara compatível; evitar
  propriedades que recalculam layout.
- No mobile, entradas discretas executadas uma vez, sem pinning ou scrub.
- Fazer cleanup com `revert()` e remover `will-change` ao terminar.
- Respeitar `prefers-reduced-motion` e mostrar imediatamente todo o conteúdo quando redução de movimento estiver ativa.
- Nenhuma animação deve atrasar a leitura ou a disponibilidade dos CTAs.

Não usar parallax, movimento contínuo, elementos flutuantes ou animações de texto por caractere.

## 12. Acessibilidade

- Um único `h1` na página.
- Header, `nav` e links semanticamente corretos.
- Botão do menu com `aria-expanded`, `aria-controls` e nome acessível.
- Navegação completa por teclado.
- Foco visível em links e botões.
- Contraste mínimo WCAG AA.
- Texto alternativo factual para a fotografia: `Adriana Reis`.
- Elementos decorativos, incluindo o monograma de fundo, devem ser ignorados por tecnologias assistivas.
- Áreas clicáveis com pelo menos 44 × 44 px.

## 13. Performance, SEO e entrega

- Gerar HTML estático.
- Hero sem JavaScript de framework no cliente.
- Otimizar a fotografia com `astro:assets` e fornecer dimensões para evitar CLS.
- Carregar a imagem principal com prioridade apropriada por ser candidata a LCP.
- Servir formatos modernos quando suportados.
- Evitar imagem de fundo para conteúdo essencial.
- Definir `title`, description, canonical e metadados sociais no layout, ainda que inicialmente com placeholders identificados.
- O conteúdo principal deve ser equivalente em desktop e mobile.
- Manter o JavaScript próprio da homepage em até 45 kB gzip como orçamento inicial.
- Gerar sitemap e canonical a partir do `site` definido no Astro.
- Publicar como Static Assets no Cloudflare Workers, sem adapter enquanto o site
  continuar totalmente estático.
- Validar o build com `wrangler dev` e usar `404-page` para a rota não encontrada.

## 14. Critérios de aceite

- O conjunto eyebrow + H1 informa o contexto jurídico e as três frentes sem
  reivindicar especialização.
- Não aparecem `especialista`, `especializada`, promessa de resultado ou autoengrandecimento.
- A fotografia não é deformada nem tem rosto ou corpo cobertos pela interface.
- A logo permanece legível em desktop e mobile.
- Os dois CTAs são distinguíveis e acessíveis por teclado.
- A primeira dobra funciona em 1440 px, notebook, tablet e 390 px.
- Não há overflow horizontal em 390 px.
- O conteúdo permanece utilizável sem JavaScript.
- `pnpm check` e `pnpm build` concluem sem erros.
- A inspeção Lighthouse não aponta CLS causado pela hero.

## 15. Pendências antes da implementação final

1. Confirmar Direito Previdenciário como terceira frente.
2. Aprovar eyebrow, H1 e texto de apoio.
3. Confirmar que clareza, análise responsável e atenção individual descrevem a atuação real.
4. Informar OAB/UF e número de inscrição.
5. Definir o destino do CTA de contato.
6. Produzir e aprovar o recorte transparente da fotografia.
7. Inicializar um repositório Git funcional; a pasta `.git` atual está vazia.

Os itens 4 e 5 podem permanecer como placeholders na primeira versão visual. Os itens 1, 2, 3 e 6 afetam diretamente a hero e devem ser resolvidos antes de considerá-la final.
