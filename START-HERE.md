# Retomada do projeto — Adriana Reis Advocacia

**Última atualização:** 2026-08-30

## Estado atual

O site é uma **landing page única de conversão** em Astro 7. A homepage (`/`)
concentra todo o funil: header em estilo glass, menu mobile, hero com fotografia
recortada, faixa de credenciais, três capítulos completos de atuação, seção
Sobre completa (dossiê humano, com fotografia, parallax e monograma), FAQ de
objeções em `<details>` nativos, orientação dos primeiros passos, CTA final,
footer e animações GSAP com ScrollTrigger. A única conversão é o WhatsApp.

As rotas secundárias antigas (`/sobre/`, `/atuacao/*`, `/contato/`,
`/conteudos/`) saíram do build e têm redirects declarados em
`astro.config.mjs` (materializados como meta-refresh no estático). **Ao
publicar no Cloudflare, criar regras 301 equivalentes no painel.**

Permanecem fora do funil: `/politica-de-privacidade/`, `/404` e as rotas de
laboratório (`noindex`, sem chrome).

## Navegação

- Menu (desktop e hambúrguer): 4 itens — Atuação, Sobre, Dúvidas,
  Como começar — todos âncoras da LP, definidos em `landingNavigation`.
- O array `navigation` (5 itens) foi extinto; Header, MobileMenu e Footer usam
  apenas `landingNavigation`.
- Botão WhatsApp fixo no header e no painel mobile.

Antes de alterar qualquer coisa:

1. Leia `AGENTS.md`.
2. Rode `git status --short` e preserve mudanças existentes.
3. Rode `pnpm check` e `pnpm build`.
4. Inspecione a página em 390 px e 1440 px quando a alteração for visual.
5. Consulte `docs/spec-site.md`, `docs/spec-hero.md`,
   `docs/astro-cloudflare-boas-praticas.md` e `docs/brand-assets.md`.

## Stack e comandos

- Astro 7 em modo estático, com TypeScript estrito.
- Tailwind CSS 4 via `@tailwindcss/vite`; a maior parte do design está em
  `src/styles/global.css`.
- GSAP 3.15 com Core, timelines e ScrollTrigger.
- Fontes locais: Bodoni Moda Variable e Manrope Variable.
- `astro:assets` + Sharp para imagens responsivas.
- Sitemap, Wrangler e configuração de Cloudflare presentes.
- Ícones via `@lucide/astro`.

```bash
pnpm dev --host 0.0.0.0
pnpm check
pnpm build
pnpm format:check
```

`No islands detected` no Dev Toolbar não é um erro. A interface interativa usa
scripts client-side em componentes `.astro`, sem componentes de framework com
diretivas `client:*`.

## Arquitetura relevante

- `src/pages/index.astro` — homepage/LP (única rota pública de funil).
- `src/layouts/BaseLayout.astro` — metadados, header/footer e opção `chrome`.
- `src/data/site.ts` — fonte central de navegação (`landingNavigation`),
  WhatsApp, fatos profissionais e áreas de atuação.
- `src/components/Header.astro` e `MobileMenu.astro` — navegação e menu.
- `src/components/Hero.astro` — hero atual.
- `src/components/CredentialsStrip.astro` — faixa OAB/localidade/atendimento.
- `src/components/PracticeAreas.astro` — orquestração GSAP/ScrollTrigger.
- `src/components/PracticeChapter.astro` — capítulo de cada área.
- `src/components/AboutProfile.astro` — seção Sobre completa (dossiê humano,
  fotografia, parallax e monograma), com script GSAP próprio.
- `src/components/Faq.astro` — FAQ de objeções em `<details>` nativos.
- `src/styles/global.css` — tokens e estilos globais mobile-first.
- `astro.config.mjs` — redirects das rotas antigas (meta-refresh no estático).

Rotas de laboratório, com `noindex` e sem chrome do site:

- `/hero-variacoes/` — quatro composições isoladas da hero.
- `/animacoes-gsap/` — ensaio cinematográfico isolado das áreas.

## Direção visual atual

- Estética editorial jurídica: marfim, vinho, dourado queimado e grafite.
- Bodoni nos títulos; Manrope em corpo, navegação e microcopy.
- Bordas retas, espaços amplos e números monumentais.
- Header em ilha translúcida: encosta em `top: 0` no topo da página e se
  desprende para `top: 0.65rem` após 24 px de rolagem.
- CTA desktop do header é vinho sólido para manter contraste.
- Menu mobile abre em painel liquid glass denso. Há blur de fundo, animação de
  abertura/fechamento e fechamento ao tocar fora, pressionar Escape, escolher
  link ou iniciar rolagem.
- O hambúrguer fica na extrema direita e vira X sobre uma expansão vinho.

## Homepage e conversão

A LP concentra os caminhos principais no WhatsApp confirmado:

- Número: `+55 11 93353-5801`.
- URL centralizada em `src/data/site.ts`; não duplicar nos componentes.

H1 atual:

> Atuação jurídica: Direito Civil, Trabalhista e Previdenciário.

As três áreas permanecem na LP e cada uma tem seis exemplos concretos:

- Direito Civil.
- Direito Trabalhista.
- Direito Previdenciário.

Referências externas usadas apenas para estrutura e temas:

- `https://rosendodesena.com.br/areas-de-atuacao/direito-civel/`
- `https://rosendodesena.com.br/areas-de-atuacao/direito-trabalhista/`
- `https://rosendodesena.com.br/areas-de-atuacao/direito-previdenciario/`

A copy é original, informativa, sem promessa de resultado e condicionada à
análise individual.

## Animações atuais

As seções de atuação usam GSAP Core + timeline + ScrollTrigger:

- atmosfera de fundo progressiva;
- número monumental com escala, entrada e rotação ligada à rolagem;
- kicker, título, introdução e prompt em sequência;
- `scrub: 1.35` no desktop e `0.9` no mobile;
- cards com entrada por `transform` e `autoAlpha`;
- CTA com gatilho independente;
- `gsap.matchMedia()` para desktop/mobile e `prefers-reduced-motion`.

Regra importante: os cards não pertencem mais à timeline que começa no topo do
capítulo. Eles começam ocultos e possuem um ScrollTrigger ligado ao bloco real
`.practice-chapter__cards`. Isso corrigiu o card 04 aparecendo antecipadamente
na primeira rolagem. No desktop, a ordem visual é 01–04, 02–05, 03–06; no
mobile, 01 a 06.

Não reintroduzir `clearProps: "transform,..."` no final dos cards: essa remoção
causava um pequeno snap de subpixel após a primeira animação.

## Conteúdo confirmado e pendências

Confirmado:

- WhatsApp `+55 11 93353-5801` como canal principal.
- Frentes Civil, Trabalhista e Previdenciário.
- Conteúdo concreto das áreas em `src/data/site.ts`.
- Nome completo: Adriana Rodrigues Reis de Andrade.
- OAB/SP nº 533.644.
- Atuação profissional em São Roque e região.
- Atendimento presencial e online, com possibilidade de acompanhamento em
  outras localidades quando a natureza do caso permitir.
- Bacharel em Direito pela Universidade Nove de Julho — UNINOVE.
- Pós-graduada em Direito Civil e Processual Civil pela Legale Educacional.
- Cursos de qualificação em Direito e Processo do Trabalho e em Direito
  Previdenciário.
- Uso da fotografia atual autorizado para a página Sobre.

Ainda não confirmado:

- E-mail e outros canais.
- Endereço profissional e horários de atendimento.
- Domínio definitivo.

Por decisão da Adriana, o ano de início da trajetória profissional não deve ser
publicado neste momento.

Não inventar nenhum desses dados. `site.url` usa domínio `.example` e não pode
ir para produção sem confirmação.

Para escrever o “Sobre”, pedir à Adriana: motivação para a advocacia, forma de
atendimento, valores, primeiro contato, formação, qualificações, tempo de
atuação, OAB/UF, cidade/abrangência e autorização da fotografia. Exemplos são
apenas referências, nunca alegações sobre ela. Não solicitar nem publicar casos
identificáveis ou informações confidenciais.

## Fotografias e marca

Fontes originais permanecem intactas em `assets/references/`.

Recortes com transparência real:

- `src/assets/images/adriana-hero-navy-cutout.png` — hero principal.
- `src/assets/images/adriana-hero-light-cutout.png` — alternativa clara.
- `src/assets/images/adriana-portrait-cutout.png` — retrato quadrado.

Fotografia autorizada para a página Sobre:

- `assets/references/foto-adriana-atual.jpeg` — fonte original, sem retoques.

Logo do header: `public/images/brand/adriana-reis-logo-wine.png`.

Não retocar rosto, corpo, roupa ou identidade da cliente. Preservar originais e
canal alfa real quando o ativo for um recorte.

## Boas práticas para continuar

- Manter conteúdo essencial disponível sem JavaScript.
- Animar `transform` e `opacity`; evitar propriedades de layout no scroll.
- Registrar ScrollTrigger uma vez e limpar com `matchMedia.revert()`.
- Não combinar `scrub` e `toggleActions` no mesmo trigger.
- Manter movimento reduzido funcional.
- Usar HTML semântico, foco visível e alvos de toque de pelo menos 44 px.
- Centralizar fatos e URLs em `src/data/site.ts`.
- Manter laboratórios com `noindex` e fora da navegação pública.
- Após mudanças visuais, validar 390 px e 1440 px.
- Antes de entregar, executar `pnpm check` e `pnpm build`.

## Próximas etapas recomendadas

1. Revisar com a Adriana toda a copy antes da publicação — **incluindo a FAQ**
   (seção 5.2 da spec da LP): a aprovação dela é condição de publicação.
2. Validar a entrada dos cards 01/04 no primeiro scroll e o parallax do Sobre
   em navegador real, sem redimensionar a viewport com DevTools durante a
   animação.
3. Confirmar domínio definitivo (`site.url` é placeholder `.example`).
4. Ao publicar no Cloudflare, criar regras 301 equivalentes aos redirects de
   `astro.config.mjs`.
5. Criar teste automatizado de rolagem para long tasks e regressões.

## Testes

- `pnpm test:site` — build + `tests/site-content.test.mjs` (contratos de
  conteúdo, menu, redirects e rotas mortas) + `tests/sobre-motion.test.mjs`
  (movimento no Chrome headless: desktop, mobile 390 px e reduced-motion;
  sobe um `astro preview` na porta 4333).
