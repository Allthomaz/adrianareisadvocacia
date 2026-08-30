# Landing Page Única de Conversão Total — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Concentrar todo o funil na homepage: menu de 4 seções, FAQ de objeções, faixa de credenciais, Sobre como seção `#sobre` e redirects 301 das rotas secundárias.

**Architecture:** A homepage passa a ser a única rota pública de funil. Componentes novos (`Faq.astro`, `CredentialsStrip.astro`) entram entre as seções existentes; `AboutProfile.astro` substitui `AboutPreview` na `index.astro`; rotas secundárias saem do build com redirects declarados em `astro.config.mjs`. O movimento/parallax do Sobre continua no plano emendado `2026-08-30-sobre-dossie-humano.md` (Tasks 3–4), agora apontando para `/`.

**Tech Stack:** Astro 7 estático, Tailwind 4 + CSS global, GSAP 3.15/ScrollTrigger, node:test + Chrome headless.

**Spec:** `docs/superpowers/specs/2026-08-30-lp-conversao-total-design.md` e `docs/superpowers/specs/2026-08-30-sobre-dossie-humano-design.md` (emendada).

**Baseline antes de começar:**

```bash
git status --short   # esperar limpo
pnpm check && pnpm build
```

---

### Task 1: Seção FAQ — Dúvidas comuns

**Files:**
- Create: `src/components/Faq.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Test: `tests/site-content.test.mjs`

- [ ] **Step 1: Escrever o teste de conteúdo da FAQ**

Acrescentar a `tests/site-content.test.mjs`:

```js
test("a homepage publica a FAQ de objeções em details nativos", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /id="duvidas"/);
  assert.match(html, /<h2[^>]*>\s*Dúvidas comuns\s*<\/h2>/);
  assert.match(html, /A primeira conversa gera compromisso\?/);
  assert.match(html, /O atendimento precisa ser presencial\?/);
  assert.match(html, /O que levar para a primeira conversa\?/);
  assert.match(html, /Quanto custa\?/);
  assert.match(html, /Quanto tempo demora\?/);
  assert.match(html, /<details[^>]*open/);
  assert.match(html, /wa\.me\/5511933535801/);
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm test:site`
Expected: FAIL — `id="duvidas"` não existe no HTML gerado.

- [ ] **Step 3: Criar `src/components/Faq.astro`**

```astro
---
import { whatsappUrl } from "../data/site";

const faqs = [
  {
    question: "A primeira conversa gera compromisso?",
    answer:
      "Não. A primeira conversa serve para você apresentar o contexto da situação e para Adriana identificar quais informações e documentos a análise inicial vai precisar. Não há contratação nem compromisso nessa etapa.",
  },
  {
    question: "O atendimento precisa ser presencial?",
    answer:
      "Não. Adriana atua em São Roque e região com atendimentos presenciais e online. Demandas de outras localidades podem ser acompanhadas quando a natureza do caso permitir.",
  },
  {
    question: "O que levar para a primeira conversa?",
    answer:
      "A narrativa dos fatos é o principal. Documentos que já estiverem às mãos — contratos, mensagens, comprovantes, extratos — ajudam, mas nada é exigido antes da conversa.",
  },
  {
    question: "Quanto custa?",
    answer:
      "Depende da natureza e da complexidade de cada caso. A primeira conversa permite delimitar o que será necessário antes de qualquer definição sobre honorários.",
  },
  {
    question: "Quanto tempo demora?",
    answer:
      "Cada situação tem ritmo próprio, dependendo da análise necessária e do andamento dos órgãos envolvidos. É possível apresentar uma perspectiva inicial depois da compreensão do caso, sem promessa de prazo.",
  },
] as const;
---

<section class="faq" id="duvidas" aria-labelledby="faq-title">
  <div class="container">
    <header class="faq__header">
      <p class="eyebrow">Antes de falar com Adriana</p>
      <h2 id="faq-title">Dúvidas comuns</h2>
      <p class="faq__lead">
        Perguntas frequentes de quem está considerando uma primeira conversa.
      </p>
    </header>

    <div class="faq__list">
      {
        faqs.map((item, index) => (
          <details class="faq__item" open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))
      }
    </div>

    <p class="faq__cta">
      A sua pergunta não está aqui?{" "}
      <a href={whatsappUrl} target="_blank" rel="noreferrer">
        Pergunte diretamente no WhatsApp
      </a>
      .
    </p>
  </div>
</section>
```

- [ ] **Step 4: Renderizar a FAQ na homepage**

Em `src/pages/index.astro`, importar `Faq` e inserir entre `AboutPreview` e `FirstSteps`:

```astro
---
import AboutPreview from "../components/AboutPreview.astro";
import ContactCallout from "../components/ContactCallout.astro";
import Faq from "../components/Faq.astro";
import FirstSteps from "../components/FirstSteps.astro";
import Hero from "../components/Hero.astro";
import PracticeAreas from "../components/PracticeAreas.astro";
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout
  title="Direito Civil, Trabalhista e Previdenciário | Adriana Reis Advocacia"
  description="Atuação de Adriana Reis em Direito Civil, Trabalhista e Previdenciário. Apresente sua situação e inicie uma conversa pelo WhatsApp."
>
  <Hero />
  <PracticeAreas landing />
  <AboutPreview />
  <Faq />
  <FirstSteps />
  <ContactCallout />
</BaseLayout>
```

- [ ] **Step 5: Adicionar os estilos da FAQ a `src/styles/global.css`**

Inserir junto aos estilos das demais seções (antes dos media queries globais):

```css
.faq {
  padding-block: clamp(4.5rem, 10vw, 8rem);
  background: var(--color-ivory-100);
}

.faq__header {
  max-width: 40rem;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.faq__header h2 {
  margin: 1rem 0 0.9rem;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5.5vw, 3.4rem);
  letter-spacing: -0.03em;
  line-height: 1.02;
}

.faq__lead {
  margin: 0;
  color: rgb(40 36 34 / 72%);
}

.faq__list {
  display: grid;
  max-width: 46rem;
  border-top: 1px solid rgb(118 38 56 / 18%);
}

.faq__item {
  border-bottom: 1px solid rgb(118 38 56 / 18%);
}

.faq__item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 44px;
  padding-block: 1.1rem;
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}

.faq__item summary::-webkit-details-marker {
  display: none;
}

.faq__item summary::after {
  content: "+";
  font-size: 1.4rem;
  color: var(--color-gold-500, #b78a55);
  transition: transform 0.2s ease;
}

.faq__item[open] summary::after {
  transform: rotate(45deg);
}

.faq__item p {
  max-width: 38rem;
  margin: 0;
  padding-bottom: 1.3rem;
  color: rgb(40 36 34 / 78%);
}

.faq__cta {
  max-width: 46rem;
  margin-top: 2.2rem;
}

.faq__cta a {
  color: var(--color-wine-700, #762638);
  font-weight: 600;
}
```

- [ ] **Step 6: Rodar testes, check e build**

Run: `pnpm test:site && pnpm check && pnpm build`
Expected: todos PASS, sem erros.

- [ ] **Step 7: Commit**

```bash
git add src/components/Faq.astro src/pages/index.astro src/styles/global.css tests/site-content.test.mjs
git commit -m "feat: adicionar FAQ de objeções à homepage"
```

---

### Task 2: Menu de 4 itens e faixa de credenciais

**Files:**
- Modify: `src/data/site.ts` (landingNavigation)
- Modify: `src/components/Header.astro`
- Modify: `src/components/MobileMenu.astro`
- Create: `src/components/CredentialsStrip.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Test: `tests/site-content.test.mjs`

- [ ] **Step 1: Escrever o teste do menu e da faixa**

Acrescentar a `tests/site-content.test.mjs`:

```js
test("a navegação da LP tem exatamente os 4 itens aprovados", async () => {
  const html = await readBuiltPage("index.html");
  const navs = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/g) ?? [];

  assert.ok(navs.length > 0);
  for (const nav of navs) {
    assert.match(nav, /href="#atuacao"[^>]*>\s*Atuação/);
    assert.match(nav, /href="#sobre"[^>]*>\s*Sobre/);
    assert.match(nav, /href="#duvidas"[^>]*>\s*Dúvidas/);
    assert.match(nav, /href="#como-comecar"[^>]*>\s*Como começar/);
    assert.doesNotMatch(nav, /Conteúdos|Contato/);
  }
});

test("a faixa de credenciais segue o hero", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /OAB\/SP nº 533\.644/);
  assert.match(html, /São Roque e região/);
  assert.match(html, /Presencial e online/);
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm test:site`
Expected: FAIL — nav atual tem 3 itens e a faixa não existe.

- [ ] **Step 3: Atualizar `landingNavigation` em `src/data/site.ts`**

Substituir o array atual:

```ts
export const landingNavigation = [
  { label: "Atuação", href: "#atuacao" },
  { label: "Sobre", href: "#sobre" },
  { label: "Dúvidas", href: "#duvidas" },
  { label: "Como começar", href: "#como-comecar" },
] as const;
```

- [ ] **Step 4: Simplificar `src/components/Header.astro`**

A dualidade LP/outras-páginas morre nesta task. Novo frontmatter e nav (o `<script>` permanece idêntico):

```astro
---
import MobileMenu from "./MobileMenu.astro";
import { landingNavigation, whatsappUrl } from "../data/site";
---

<header class="site-header" data-site-header>
  <div class="site-header__inner container">
    <a
      class="site-header__brand"
      href="/"
      aria-label="Adriana Reis — página inicial"
    >
      <img
        src="/images/brand/adriana-reis-logo-wine.png"
        alt="Adriana Reis Advocacia"
        width="940"
        height="460"
      />
    </a>

    <nav class="desktop-navigation" aria-label="Navegação principal">
      <ul>
        {
          landingNavigation.map((item) => (
            <li>
              <a href={item.href}>{item.label}</a>
            </li>
          ))
        }
      </ul>
    </nav>

    <a
      class="site-header__cta"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
    >
      Falar no WhatsApp
    </a>
    <MobileMenu items={landingNavigation} />
  </div>
</header>
```

Em `src/components/MobileMenu.astro`, remover as props `currentPath` e `isLandingPage` (e o `aria-current` condicional derivado delas); manter a lista de links e o botão WhatsApp no rodapé do painel, que já existem ou serão adicionados se ausentes:

```astro
---
import { whatsappUrl } from "../data/site";

interface Props {
  items: ReadonlyArray<{ label: string; href: string }>;
}

const { items } = Astro.props;
---
```

(Manter o restante do painel como está; apenas a chamada das props muda.)

- [ ] **Step 5: Criar `src/components/CredentialsStrip.astro`**

```astro
---
import { site } from "../data/site";

const items = [
  site.professional.oab.display,
  site.professional.location,
  `${site.professional.serviceModes.join(" e ")}`,
] as const;
---

<section class="credentials-strip" aria-label="Identificação profissional">
  <div class="container credentials-strip__inner">
    {
      items.map((item) => (
        <span class="credentials-strip__item">{item}</span>
      ))
    }
  </div>
</section>
```

- [ ] **Step 6: Renderizar a faixa na homepage**

Em `src/pages/index.astro`, inserir `<CredentialsStrip />` imediatamente após `<Hero />` (com o import correspondente).

- [ ] **Step 7: Estilos da faixa em `src/styles/global.css`**

```css
.credentials-strip {
  border-block: 1px solid rgb(118 38 56 / 14%);
  background: var(--color-ivory-50, #f7f2e9);
}

.credentials-strip__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  justify-content: center;
  padding-block: 0.9rem;
}

.credentials-strip__item {
  color: rgb(40 36 34 / 68%);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.credentials-strip__item + .credentials-strip__item::before {
  content: "·";
  margin-right: 2rem;
  color: var(--color-gold-500, #b78a55);
}
```

- [ ] **Step 8: Rodar testes, check e build**

Run: `pnpm test:site && pnpm check && pnpm build`
Expected: todos PASS. Se `astro check` reclamar de `navigation` ainda exportada mas não usada, é aceitável nesta task (removida na Task 4).

- [ ] **Step 9: Commit**

```bash
git add src/data/site.ts src/components/Header.astro src/components/MobileMenu.astro src/components/CredentialsStrip.astro src/pages/index.astro src/styles/global.css tests/site-content.test.mjs
git commit -m "feat: menu de 4 seções e faixa de credenciais na LP"
```

---

### Task 3: Sobre como seção da homepage

**Files:**
- Modify: `src/components/AboutProfile.astro` (h1 → h2)
- Modify: `src/pages/index.astro` (AboutPreview → AboutProfile)
- Test: `tests/site-content.test.mjs`

- [ ] **Step 1: Reescrever os testes do Sobre para a homepage**

Em `tests/site-content.test.mjs`, substituir o teste `a homepage conduz o resumo institucional para a página Sobre` e trocar `readBuiltPage("sobre/index.html")` por `readBuiltPage("index.html")` nos três testes do Sobre. O H1 vira h2:

```js
test("a homepage publica o método, a citação e as credenciais aprovadas", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(
    html,
    /<h2[^>]*>\s*Compreender o caso por completo precede a definição da estratégia jurídica\.\s*<\/h2>/,
  );
  assert.match(html, /Investigar, questionar e compreender\./);
  assert.match(html, /Escutar antes de concluir/);
  assert.match(html, /Examinar o conjunto, não apenas o episódio/);
  assert.match(html, /Orientar sem antecipar certezas/);
  assert.match(html, /<blockquote/);
  assert.match(html, /Primeiro eu preciso entender o seu caso por inteiro\./);
  assert.match(html, /Universidade Nove de Julho/);
  assert.match(html, /Legale Educacional/);
  assert.match(html, /Atendimento também à distância/);
  assert.match(html, /id="sobre"/);
});
```

Manter os testes de fotografia/CTA e de alegações vedadas, ambos apontando para `index.html` (o `<h1>` do hero permanece o único h1 da página — acrescentar `assert.doesNotMatch(html, /<h1[^>]*(?!.*hero)/)` é desnecessário; validar no Step 5 por contagem manual).

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm test:site`
Expected: FAIL — Sobre completo não está na homepage.

- [ ] **Step 3: h1 → h2 no `AboutProfile.astro`**

Trocar, na abertura do componente:

```astro
<h2 id="about-title" data-about-intro>
  Compreender o caso por completo precede a definição da estratégia jurídica.
</h2>
```

- [ ] **Step 4: Substituir AboutPreview por AboutProfile na `index.astro`**

```astro
import AboutProfile from "../components/AboutProfile.astro";
```

e `<AboutProfile />` no lugar de `<AboutPreview />`. O wrapper da seção recebe a âncora usada pela navegação — conferir que `AboutProfile.astro` tem `id="sobre"` no elemento raiz (`<article class="about-profile" id="sobre" ...>`); se não tiver, adicionar.

- [ ] **Step 5: Rodar testes, check, build e validar hierarquia**

Run: `pnpm test:site && pnpm check && pnpm build`
Expected: todos PASS. Confirmar no `dist/index.html` que existe exatamente um `<h1>` (o do hero).

- [ ] **Step 6: Commit**

```bash
git add src/components/AboutProfile.astro src/pages/index.astro tests/site-content.test.mjs
git commit -m "feat: integrar dossiê humano como seção Sobre da LP"
```

---

### Task 4: Remover rotas secundárias e criar redirects

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/data/site.ts` (remover `navigation`)
- Delete: `src/pages/sobre.astro`, `src/pages/atuacao/`, `src/pages/contato.astro`, `src/pages/conteudos/`, `src/components/AboutPreview.astro`
- Test: `tests/site-content.test.mjs`

`PageIntro.astro` **não** é removido: `404.astro` e `politica-de-privacidade.astro` continuam consumindo.

- [ ] **Step 1: Escrever o teste de redirects e ausência de rotas mortas**

Acrescentar a `tests/site-content.test.mjs`:

```js
import { access } from "node:fs/promises";

const pathExists = (pathname) =>
  access(new URL(`../dist/${pathname}`, import.meta.url))
    .then(() => true)
    .catch(() => false);

test("rotas secundárias saem do build", async () => {
  assert.ok(await pathExists("index.html"));
  assert.ok(!(await pathExists("sobre/index.html")));
  assert.ok(!(await pathExists("atuacao/index.html")));
  assert.ok(!(await pathExists("contato/index.html")));
  assert.ok(!(await pathExists("conteudos/index.html")));
  assert.ok(await pathExists("politica-de-privacidade/index.html"));
});

test("nenhum link interno aponta para rota removida", async () => {
  const html = await readBuiltPage("index.html");

  assert.doesNotMatch(html, /href="\/sobre\/"/);
  assert.doesNotMatch(html, /href="\/atuacao\//);
  assert.doesNotMatch(html, /href="\/contato\/"/);
  assert.doesNotMatch(html, /href="\/conteudos\/"/);
});
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `pnpm test:site`
Expected: FAIL — as rotas ainda existem no build.

- [ ] **Step 3: Declarar redirects em `astro.config.mjs`**

```js
export default defineConfig({
  // Placeholder técnico: substituir apenas após a cliente confirmar o domínio.
  site: "https://adriana-reis-advocacia.example",
  output: "static",
  redirects: {
    "/sobre": "/#sobre",
    "/atuacao": "/#atuacao",
    "/atuacao/direito-civil": "/#atuacao",
    "/atuacao/direito-trabalhista": "/#atuacao",
    "/atuacao/direito-previdenciario": "/#atuacao",
    "/contato": "/#como-comecar",
    "/conteudos": "/",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Em output static o Astro gera páginas `<meta http-equiv="refresh">` para esses destinos — suficiente para o preview; no Cloudflare, os redirects devem ser replicados como regras 301 no painel (documentar em `START-HERE.md` na Task 5).

- [ ] **Step 4: Remover arquivos e `navigation`**

```bash
git rm src/pages/sobre.astro src/pages/contato.astro src/pages/conteudos/index.astro src/components/AboutPreview.astro
git rm -r src/pages/atuacao
```

Em `src/data/site.ts`, remover o array `navigation`. Conferir com `grep -rn "navigation\b" src` que nenhum import restante referencia o símbolo removido.

- [ ] **Step 5: Rodar testes, check e build**

Run: `pnpm test:site && pnpm check && pnpm build`
Expected: todos PASS; o build lista as 7 rotas de redirect + páginas restantes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: concentrar funil na LP com redirects das rotas secundárias"
```

---

### Task 5: Movimento do Sobre (plano emendado) e verificação final

**Files:**
- Modify: `docs/superpowers/plans/2026-08-30-sobre-dossie-humano.md` (Tasks 3–4 apontam para `/`)
- Modify: `tests/sobre-motion.test.mjs`
- Modify: `src/components/AboutProfile.astro`, `src/styles/global.css` (conforme plano emendado)
- Modify: `START-HERE.md`

- [ ] **Step 1: Emendar o plano do dossiê humano**

Em `docs/superpowers/plans/2026-08-30-sobre-dossie-humano.md`, Task 3: trocar `previewUrl` de `http://127.0.0.1:4333/sobre/` para `http://127.0.0.1:4333/` (ocorrência única) e ajustar a nota de contexto: o AboutProfile é renderizado na `index.astro` sob `#sobre`; os Steps de GSAP/CSS permanecem idênticos.

- [ ] **Step 2: Corrigir `tests/sobre-motion.test.mjs` (já presente, não commitado)**

Mesma troca de `previewUrl`. Commitar junto com a implementação do movimento, no ciclo TDD do plano emendado (Step vermelho → GSAP → CSS → verde).

- [ ] **Step 3: Executar as Tasks 3 e 4 do plano emendado**

Seguir `docs/superpowers/plans/2026-08-30-sobre-dossie-humano.md` Tasks 3–4 literalmente (código GSAP e CSS já estão escritos lá). Critérios inalterados: parallax 20–24 px desktop / 8 px mobile, monograma 8–12 px oposto, `scrub` + `ease: "none"`, sem pinning, `prefers-reduced-motion` entregando estado final.

- [ ] **Step 4: Atualizar `START-HERE.md`**

- Estrutura de rotas: única rota pública `/`; redirects no `astro.config.mjs` **e** regras 301 equivalentes no Cloudflare ao publicar.
- Menu: 4 itens + WhatsApp; `navigation` não existe mais.
- FAQ: copy pendente de aprovação da Adriana antes de publicar.
- Próximas etapas: revisar copy (FAQ incluída) com a cliente; confirmar domínio.

- [ ] **Step 5: Verificação final completa**

Run: `pnpm test:site && pnpm check && pnpm build && pnpm format:check`
Expected: tudo verde. Validar `dist/index.html` em 390 px e 1440 px (sem redimensionar durante o parallax) e conferir overflow horizontal, console limpo e navegação por âncoras.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: aplicar movimento do Sobre na LP e atualizar documentação"
```

---

## Notas transversais

- Aprovação da copy da FAQ pela Adriana é **condição de publicação**, não de build — a seção pode ir para staging.
- `site.url` permanece placeholder até confirmação do domínio (fora do escopo).
- Não reintroduzir `clearProps` nos cards de atuação nem redimensionar viewport durante scrub (registrar ScrollTrigger uma vez; `matchMedia.revert()`).
