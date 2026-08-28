# Retomada do projeto — Adriana Reis Advocacia

**Última atualização:** 2026-08-27

## Estado atual

O site já está implementado como uma landing page responsiva em Astro 7. A
homepage possui header em estilo glass, menu mobile, hero com fotografia
recortada, três capítulos completos de atuação, seção sobre, orientação dos
primeiros passos, CTA final, footer e animações GSAP com ScrollTrigger.

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

- `src/pages/index.astro` — homepage/LP.
- `src/layouts/BaseLayout.astro` — metadados, header/footer e opção `chrome`.
- `src/data/site.ts` — fonte central de navegação, WhatsApp e áreas de atuação.
- `src/components/Header.astro` e `MobileMenu.astro` — navegação e menu.
- `src/components/Hero.astro` — hero atual.
- `src/components/PracticeAreas.astro` — orquestração GSAP/ScrollTrigger.
- `src/components/PracticeChapter.astro` — capítulo de cada área.
- `src/styles/global.css` — tokens e estilos globais mobile-first.

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

Ainda não confirmado:

- OAB e seccional.
- E-mail e outros canais.
- Cidade, localidade e abrangência.
- Domínio definitivo.
- Formação, trajetória e informações pessoais para completar o “Sobre”.

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

1. Validar a entrada dos cards 01/04 no primeiro scroll em navegador real, sem
   redimensionar a viewport com DevTools durante a animação.
2. Coletar respostas da Adriana para escrever a seção “Sobre”.
3. Confirmar OAB/UF, cidade, abrangência e domínio.
4. Revisar a copy com a cliente antes da publicação.
5. Criar teste automatizado de rolagem para long tasks e regressões.
