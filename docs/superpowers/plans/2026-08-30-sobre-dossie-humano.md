# Dossiê Humano — Página Sobre Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar uma página Sobre editorial e responsiva que apresente o método, a formação e a identificação profissional de Adriana Reis, com fotografia autêntica, parallax sutil e conteúdo integralmente disponível sem JavaScript.

**Architecture:** Consolidar fatos profissionais em `src/data/site.ts`, renderizar a experiência em um componente Astro estático e manter a rota responsável apenas por metadados e composição. A fotografia será processada por `astro:assets`; GSAP e ScrollTrigger aprimoram o HTML já visível com uma timeline de entrada, um parallax de baixa amplitude e revelações executadas uma vez.

**Tech Stack:** Astro 7 estático, TypeScript estrito, Tailwind CSS 4 via Vite, CSS global mobile-first, `astro:assets`, GSAP 3.15 Core + ScrollTrigger, Node `node:test` e Google Chrome headless para validação visual.

**Spec:** `docs/superpowers/specs/2026-08-30-sobre-dossie-humano-design.md`

## Global Constraints

- Preservar mudanças existentes e a fonte `assets/references/foto-adriana-atual.jpeg` intacta.
- Manter `Adriana Reis Advocacia` como marca e usar `Adriana Rodrigues Reis de Andrade` na identificação profissional.
- Usar exclusivamente a inscrição confirmada `OAB/SP nº 533.644`.
- Usar exclusivamente a localidade confirmada `São Roque e região`; não publicar endereço, horário ou abrangência mais específica.
- Não publicar ano de início da trajetória, e-mail, domínio definitivo ou informação profissional não fornecida.
- Não usar `especialista`, `especializada`, promessa de resultado, prova social, depoimentos ou superlativos profissionais.
- Manter Civil, Trabalhista e Previdenciário na homepage.
- Manter o WhatsApp `+55 11 93353-5801` e sua URL somente em `src/data/site.ts`.
- Não adicionar React, islands, framework de UI, nova fonte, nova paleta ou nova dependência.
- Conteúdo essencial e CTA devem funcionar sem JavaScript.
- Animar apenas `transform` e `opacity`/`autoAlpha`; sem pinning, smooth scroll, blur animado ou propriedades de layout.
- Respeitar `prefers-reduced-motion`, WCAG 2.2 AA e alvos de toque de pelo menos 44 × 44 px.
- Validar visualmente em 390 px e 1440 px.
- Executar `git status --short`, `pnpm check` e `pnpm build` antes da primeira alteração; finalizar com `pnpm check` e `pnpm build`.

---

## File Map

- `src/data/site.ts` — fonte única de nome completo, OAB, formação, localidade e modalidades de atendimento.
- `src/components/Footer.astro` — identificação profissional e geográfica global.
- `src/components/AboutPreview.astro` — resumo da homepage e link editorial para `/sobre/`.
- `src/components/AboutProfile.astro` — toda a experiência editorial, semântica e animada da página Sobre.
- `src/pages/sobre.astro` — metadados da rota e composição do perfil.
- `src/assets/images/adriana-sobre.jpeg` — cópia de trabalho, sem retoque, processada pelo Astro.
- `src/styles/global.css` — layout, responsividade e estados visuais da página.
- `tests/site-content.test.mjs` — contrato do HTML estático gerado e dos fatos publicados.
- `tests/sobre-motion.test.mjs` — comportamento de movimento e redução verificado no Chrome headless.
- `package.json` — script reproduzível de teste do site.
- `START-HERE.md` — estado factual e arquitetura atualizados.

---

### Task 1: Consolidar fatos profissionais e atualizar os pontos compartilhados

**Files:**
- Create: `tests/site-content.test.mjs`
- Modify: `package.json`
- Modify: `src/data/site.ts`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/AboutPreview.astro`
- Modify: `START-HERE.md`

**Interfaces:**
- Consumes: fatos aprovados na seção 2 da especificação e `whatsappUrl` existente.
- Produces: `site.professional`, usado pelo rodapé e pela página Sobre; script `pnpm test:site` usado nas tarefas seguintes.

- [ ] **Step 1: Escrever o teste de saída estática que exige os novos fatos e a nova conversão da homepage**

Criar `tests/site-content.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readBuiltPage = (pathname) =>
  readFile(new URL(`../dist/${pathname}`, import.meta.url), "utf8");

test("publica identificação profissional e localidade confirmadas no rodapé", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /Adriana Rodrigues Reis de Andrade/);
  assert.match(html, /OAB\/SP nº 533\.644/);
  assert.match(html, /São Roque e região/);
});

test("a homepage conduz o resumo institucional para a página Sobre", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /Antes da estratégia, vem a compreensão do caso\./);
  assert.match(html, /href="\/sobre\/"[^>]*>\s*Conheça Adriana/);
});
```

Adicionar a `package.json`:

```json
"test:site": "astro build && node --test tests/*.test.mjs"
```

- [ ] **Step 2: Executar o teste e confirmar a falha esperada**

Run: `pnpm test:site`

Expected: FAIL porque o HTML atual não contém `OAB/SP nº 533.644`, `São Roque e região` nem o link `Conheça Adriana`.

- [ ] **Step 3: Criar a fonte única de fatos profissionais**

Em `src/data/site.ts`, adicionar `professional` dentro de `site` e remover os campos nulos redundantes `location` e `oab` de `contact`:

```ts
professional: {
  fullName: "Adriana Rodrigues Reis de Andrade",
  oab: {
    jurisdiction: "SP",
    number: "533.644",
    display: "OAB/SP nº 533.644",
  },
  location: "São Roque e região",
  serviceModes: ["Presencial", "Online"],
  education: [
    "Bacharel em Direito pela Universidade Nove de Julho — UNINOVE",
    "Pós-graduada em Direito Civil e Processual Civil pela Legale Educacional",
    "Cursos de qualificação em Direito e Processo do Trabalho e em Direito Previdenciário",
  ],
},
contact: {
  email: null,
  phone: "+55 11 93353-5801",
  whatsapp: "+55 11 93353-5801",
},
```

Substituir `pendingFacts` por:

```ts
export const pendingFacts = [
  "E-mail e demais canais de contato",
  "Endereço profissional e horários de atendimento",
  "Domínio definitivo",
] as const;
```

- [ ] **Step 4: Renderizar os fatos confirmados no rodapé**

Em `src/components/Footer.astro`, manter a navegação e o WhatsApp existentes e acrescentar ao bloco legal:

```astro
<div class="site-footer__professional">
  <p>{site.professional.fullName}</p>
  <p>{site.professional.oab.display}</p>
  <p>{site.professional.location}</p>
</div>
```

O bloco deve ficar antes do aviso `Conteúdo informativo. Cada situação requer análise individual.` e não deve repetir telefone, e-mail ou endereço.

- [ ] **Step 5: Atualizar o resumo institucional da homepage**

Em `src/components/AboutPreview.astro`, remover o import de `whatsappUrl`, manter a fotografia atual do bloco e substituir o conteúdo por:

```astro
<p class="eyebrow"><span aria-hidden="true"></span> Sobre Adriana Reis</p>
<h2 id="about-preview-title">
  Antes da estratégia, vem a compreensão do caso.
</h2>
<p>
  Adriana Reis conduz cada atendimento a partir da escuta, do exame dos
  documentos e das circunstâncias próprias da situação. Somente depois dessa
  compreensão são delimitados os possíveis caminhos jurídicos.
</p>
<a class="button button--primary" href="/sobre/">
  Conheça Adriana <span aria-hidden="true">→</span>
</a>
```

- [ ] **Step 6: Atualizar o estado factual do repositório**

Em `START-HERE.md`:

- mover OAB, São Roque e região, atendimento presencial/online, formação e autorização da fotografia para `Confirmado`;
- manter como pendentes e-mail, demais canais, endereço exato, horários e domínio;
- registrar `assets/references/foto-adriana-atual.jpeg` como fonte original autorizada para a página Sobre;
- manter explícito que o ano de início não será publicado.

- [ ] **Step 7: Executar o contrato estático e as verificações técnicas**

Run: `pnpm test:site && pnpm check`

Expected: todos os testes PASS; Astro reporta 0 errors, 0 warnings e 0 hints.

- [ ] **Step 8: Registrar a tarefa**

```bash
git add package.json tests/site-content.test.mjs src/data/site.ts src/components/Footer.astro src/components/AboutPreview.astro START-HERE.md
git commit -m "feat: consolidar perfil profissional da Adriana"
```

---

### Task 2: Construir o HTML semântico da página Sobre e integrar a fotografia

**Files:**
- Create: `src/assets/images/adriana-sobre.jpeg`
- Create: `src/components/AboutProfile.astro`
- Modify: `src/pages/sobre.astro`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `site.professional` e `whatsappUrl` produzidos pela Task 1; fotografia original em `assets/references/foto-adriana-atual.jpeg`.
- Produces: HTML estático completo com os hooks `data-about-*` consumidos pela animação da Task 3.

- [ ] **Step 1: Ampliar o contrato da página Sobre antes de implementar o conteúdo**

Adicionar a `tests/site-content.test.mjs`:

```js
test("a página Sobre publica o método, a citação e as credenciais aprovadas", async () => {
  const html = await readBuiltPage("sobre/index.html");

  assert.match(
    html,
    /<h1[^>]*>\s*Compreender o caso por completo precede a definição da estratégia jurídica\.\s*<\/h1>/,
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
});

test("a página Sobre usa fotografia responsiva e CTA centralizado", async () => {
  const html = await readBuiltPage("sobre/index.html");

  assert.match(html, /<picture/);
  assert.match(html, /alt="Adriana Reis em seu ambiente profissional"/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /href="https:\/\/wa\.me\/5511933535801/);
  assert.match(html, /Apresente sua situação/);
});

test("a página Sobre não publica alegações vedadas ou fatos recusados", async () => {
  const html = (await readBuiltPage("sobre/index.html")).toLowerCase();

  assert.doesNotMatch(html, /especialista|especializada|garantia de resultado/);
  assert.doesNotMatch(html, /ano de início|tempo de atuação/);
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha esperada**

Run: `pnpm test:site`

Expected: FAIL no teste da página Sobre porque a rota ainda contém o conteúdo provisório.

- [ ] **Step 3: Criar a cópia de trabalho da fotografia sem alterar a fonte**

Run:

```bash
cp assets/references/foto-adriana-atual.jpeg src/assets/images/adriana-sobre.jpeg
cmp assets/references/foto-adriana-atual.jpeg src/assets/images/adriana-sobre.jpeg
```

Expected: `cmp` encerra com status 0 e nenhuma saída.

- [ ] **Step 4: Implementar o componente semântico completo**

Criar `src/components/AboutProfile.astro` com esta estrutura e copy:

```astro
---
import { Picture } from "astro:assets";
import aboutImage from "../assets/images/adriana-sobre.jpeg";
import { site, whatsappUrl } from "../data/site";

const methods = [
  {
    number: "01",
    title: "Escutar antes de concluir",
    text: "O primeiro atendimento começa pela narrativa da pessoa. Perguntas ajudam a organizar juridicamente os fatos e a identificar circunstâncias que precisam ser aprofundadas antes de qualquer conclusão.",
  },
  {
    number: "02",
    title: "Examinar o conjunto, não apenas o episódio",
    text: "Documentos, registros e detalhes aparentemente menores podem alterar a leitura do caso. Por isso, a análise procura relacionar os fatos às suas consequências jurídicas, em vez de se contentar com uma resposta imediata.",
  },
  {
    number: "03",
    title: "Orientar sem antecipar certezas",
    text: "Depois de compreender o contexto, Adriana apresenta possibilidades, riscos e alternativas em linguagem acessível. Quando a matéria exige estudo adicional, a conclusão aguarda o exame diligente dos elementos disponíveis.",
  },
] as const;

const serviceModes = site.professional.serviceModes
  .join(" e ")
  .toLocaleLowerCase("pt-BR");
---

<article class="about-profile" data-about-profile>
  <section class="about-profile__hero" aria-labelledby="about-title" data-about-hero>
    <span class="about-profile__monogram" aria-hidden="true" data-about-monogram>AR</span>
    <div class="about-profile__hero-grid container">
      <div class="about-profile__hero-copy">
        <p class="eyebrow" data-about-intro><span aria-hidden="true"></span> Sobre Adriana Reis</p>
        <p class="about-profile__identity" data-about-intro>
          {site.professional.fullName} · {site.professional.oab.display}
        </p>
        <h1 id="about-title" data-about-intro>
          Compreender o caso por completo precede a definição da estratégia jurídica.
        </h1>
        <p class="about-profile__lead" data-about-intro>
          A atuação de Adriana começa pela escuta, avança pelo exame criterioso dos fatos
          e documentos e considera os riscos, as alternativas e as repercussões de cada caminho.
        </p>
      </div>
      <div class="about-profile__photo-frame" data-about-photo-frame>
        <div class="about-profile__photo" data-about-photo>
          <Picture
            src={aboutImage}
            formats={["avif", "webp"]}
            widths={[480, 640, 768, 1024]}
            sizes="(max-width: 767px) calc(100vw - 2.5rem), 44vw"
            alt="Adriana Reis em seu ambiente profissional"
            loading="eager"
            fetchpriority="high"
            class="about-profile__image"
          />
        </div>
      </div>
    </div>
  </section>

  <section class="about-profile__origin container" aria-labelledby="about-origin-title" data-about-reveal>
    <p class="eyebrow"><span aria-hidden="true"></span> Origem</p>
    <div>
      <h2 id="about-origin-title">Investigar, questionar e compreender.</h2>
      <p>
        Uma inclinação natural para compreender o que existe por trás de cada situação e
        como resolvê-la conduziu Adriana ao Direito. Na advocacia, encontrou um ofício em
        que conhecimento, estratégia e responsabilidade podem ser colocados a serviço de
        pessoas que, diante de um problema jurídico, nem sempre sabem quais caminhos têm
        à disposição.
      </p>
    </div>
  </section>

  <section class="about-profile__method" aria-labelledby="about-method-title">
    <div class="container">
      <header class="about-profile__section-header" data-about-reveal>
        <p class="eyebrow"><span aria-hidden="true"></span> Forma de atuação</p>
        <h2 id="about-method-title">Critério antes da conclusão.</h2>
      </header>
      <ol class="about-profile__method-list">
        {methods.map((method) => (
          <li data-about-reveal>
            <span>{method.number}</span>
            <h3>{method.title}</h3>
            <p>{method.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>

  <section class="about-profile__quote" aria-label="Princípio de atendimento" data-about-reveal>
    <div class="container">
      <blockquote>
        “Primeiro eu preciso entender o seu caso por inteiro. Depois, nós decidimos qual é o melhor caminho.”
      </blockquote>
      <p>Adriana Reis</p>
    </div>
  </section>

  <section class="about-profile__credentials container" aria-labelledby="about-credentials-title" data-about-reveal>
    <div>
      <p class="eyebrow"><span aria-hidden="true"></span> Identificação profissional</p>
      <h2 id="about-credentials-title">Formação e exercício profissional.</h2>
      <p>
        {site.professional.fullName} é advogada inscrita na {site.professional.oab.display}.
        Sua formação reúne graduação, pós-graduação e cursos de qualificação nas áreas que
        integram sua atuação.
      </p>
    </div>
    <ul>
      {site.professional.education.map((item) => <li>{item}</li>)}
    </ul>
  </section>

  <section class="about-profile__service" aria-labelledby="about-service-title" data-about-reveal>
    <div class="about-profile__service-grid container">
      <p class="eyebrow eyebrow--light"><span aria-hidden="true"></span> Atendimento</p>
      <div>
        <h2 id="about-service-title">Presença em São Roque. Atendimento também à distância.</h2>
        <p>
          Adriana atua profissionalmente em {site.professional.location}, com atendimentos
          {serviceModes}. Demandas em outras localidades podem ser acompanhadas quando
          a natureza do caso o permitir.
        </p>
      </div>
    </div>
  </section>

  <section class="about-profile__contact container" aria-labelledby="about-contact-title" data-about-reveal>
    <p class="eyebrow"><span aria-hidden="true"></span> Primeiro contato</p>
    <div>
      <h2 id="about-contact-title">Cada situação começa por uma história que precisa ser compreendida.</h2>
      <p>
        O primeiro contato permite apresentar o contexto e identificar quais informações e
        documentos serão necessários para a análise inicial.
      </p>
      <a class="button button--primary" href={whatsappUrl} target="_blank" rel="noreferrer">
        Apresente sua situação <span aria-hidden="true">↗</span>
      </a>
    </div>
  </section>
</article>
```

- [ ] **Step 5: Substituir o conteúdo provisório da rota e definir metadados factuais**

Substituir `src/pages/sobre.astro` por:

```astro
---
import AboutProfile from "../components/AboutProfile.astro";
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout
  title="Sobre Adriana Reis | Adriana Reis Advocacia"
  description="Conheça a formação, a forma de atuação e o atendimento de Adriana Reis, advogada inscrita na OAB/SP nº 533.644, em São Roque e região."
>
  <AboutProfile />
</BaseLayout>
```

- [ ] **Step 6: Executar o contrato estático e confirmar a entrega sem JavaScript**

Run: `pnpm test:site`

Expected: todos os testes PASS. Abrir `dist/sobre/index.html` e confirmar que H1, método, citação, formação, atendimento e CTA estão presentes no HTML gerado antes de scripts.

- [ ] **Step 7: Registrar a tarefa**

```bash
git add src/assets/images/adriana-sobre.jpeg src/components/AboutProfile.astro src/pages/sobre.astro tests/site-content.test.mjs
git commit -m "feat: criar conteúdo institucional da página Sobre"
```

---

### Task 3: Aplicar direção visual, parallax sutil e guardrails de performance

**Files:**
- Create: `tests/sobre-motion.test.mjs`
- Modify: `src/components/AboutProfile.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: hooks `data-about-profile`, `data-about-hero`, `data-about-photo`, `data-about-monogram`, `data-about-intro` e `data-about-reveal` da Task 2.
- Produces: experiência progressivamente aprimorada com `gsap.matchMedia()` e CSS mobile-first; `data-motion-state` expõe o estado efetivo para diagnóstico sem controlar a apresentação.

- [ ] **Step 1: Escrever o teste comportamental de movimento antes do script**

Criar `tests/sobre-motion.test.mjs`:

```js
import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import test, { after, before } from "node:test";

const execFileAsync = promisify(execFile);
const previewUrl = "http://127.0.0.1:4333/sobre/";
let preview;

before(async () => {
  preview = spawn(
    "pnpm",
    ["exec", "astro", "preview", "--host", "127.0.0.1", "--port", "4333"],
    { detached: true, stdio: "ignore" },
  );

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error("Astro preview não iniciou na porta 4333");
});

after(() => {
  if (preview?.pid) process.kill(-preview.pid, "SIGTERM");
});

const dumpDom = async (extraFlags = []) => {
  const { stdout } = await execFileAsync(
    "/usr/bin/google-chrome",
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--virtual-time-budget=2500",
      ...extraFlags,
      "--dump-dom",
      previewUrl,
    ],
    { maxBuffer: 10 * 1024 * 1024 },
  );
  return stdout;
};

test("ativa a composição animada e transforma a fotografia", async () => {
  const html = await dumpDom();
  const photo = html.match(/<div class="about-profile__photo"[^>]*>/)?.[0] ?? "";

  assert.match(html, /data-motion-state="active"/);
  assert.match(photo, /style="[^"]*transform:/);
});

test("movimento reduzido entrega o estado final sem transformar a fotografia", async () => {
  const html = await dumpDom(["--force-prefers-reduced-motion"]);
  const photo = html.match(/<div class="about-profile__photo"[^>]*>/)?.[0] ?? "";

  assert.match(html, /data-motion-state="reduced"/);
  assert.doesNotMatch(photo, /style=/);
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha esperada**

Run: `pnpm test:site`

Expected: os dois testes FAIL porque a página ainda não declara `data-motion-state` nem aplica transformação à fotografia.

- [ ] **Step 3: Adicionar a orquestração GSAP ao final de `AboutProfile.astro`**

Adicionar:

```astro
<script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  const profile = document.querySelector<HTMLElement>("[data-about-profile]");

  if (profile) {
    const media = gsap.matchMedia();

    media.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 48rem)",
      },
      (context) => {
        const { reduceMotion, desktop } = context.conditions as {
          reduceMotion: boolean;
          desktop: boolean;
        };
        const hero = profile.querySelector<HTMLElement>("[data-about-hero]");
        const introItems = profile.querySelectorAll<HTMLElement>("[data-about-intro]");
        const photoFrame = profile.querySelector<HTMLElement>("[data-about-photo-frame]");
        const photo = profile.querySelector<HTMLElement>("[data-about-photo]");
        const monogram = profile.querySelector<HTMLElement>("[data-about-monogram]");
        const revealItems = profile.querySelectorAll<HTMLElement>("[data-about-reveal]");

        if (reduceMotion || !hero || !photoFrame || !photo) {
          profile.dataset.motionState = "reduced";
          gsap.set([introItems, photoFrame, photo, monogram, revealItems], {
            clearProps: "all",
          });
          return;
        }

        profile.dataset.motionState = "active";

        const intro = gsap.timeline({
          defaults: { duration: desktop ? 0.72 : 0.5, ease: "power2.out" },
          onComplete: () =>
            gsap.set([introItems, photoFrame], { clearProps: "willChange" }),
        });

        intro
          .fromTo(
            introItems,
            { autoAlpha: 0, y: desktop ? 22 : 14, willChange: "transform,opacity" },
            { autoAlpha: 1, y: 0, stagger: 0.08 },
            0,
          )
          .fromTo(
            photoFrame,
            { autoAlpha: 0, y: desktop ? 26 : 16, willChange: "transform,opacity" },
            { autoAlpha: 1, y: 0 },
            0.18,
          );

        const photoTravel = desktop ? 24 : 8;
        const parallax = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: desktop ? 0.8 : 0.5,
          },
        });

        parallax.fromTo(
          photo,
          { y: photoTravel * -0.5 },
          { y: photoTravel * 0.5, ease: "none" },
          0,
        );

        if (desktop && monogram) {
          parallax.fromTo(monogram, { y: -6 }, { y: 6, ease: "none" }, 0);
        }

        revealItems.forEach((item) => {
          gsap.fromTo(
            item,
            { autoAlpha: 0, y: 24, willChange: "transform,opacity" },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.68,
              ease: "power2.out",
              clearProps: "willChange",
              scrollTrigger: {
                trigger: item,
                start: "clamp(top 84%)",
                once: true,
              },
            },
          );
        });

        return () => {
          intro.kill();
          parallax.kill();
        };
      },
    );

    document.addEventListener("astro:before-swap", () => media.revert(), {
      once: true,
    });
  }
</script>
```

- [ ] **Step 4: Adicionar o sistema visual mobile-first a `src/styles/global.css`**

Inserir antes dos media queries globais existentes. Usar exatamente estes limites estruturais; ajustes finos posteriores devem preservar proporções, contraste e área segura da fotografia:

```css
.about-profile {
  overflow: clip;
  background: var(--color-ivory-50);
}

.about-profile__hero {
  position: relative;
  min-height: 100svh;
  padding-block: calc(var(--header-height) + 3rem) 4.5rem;
  isolation: isolate;
}

.about-profile__hero::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  background:
    radial-gradient(circle at 82% 18%, rgb(183 138 85 / 10%), transparent 28rem),
    linear-gradient(145deg, var(--color-ivory-50), #fcfaf6 58%, var(--color-ivory-100));
  content: "";
}

.about-profile__hero-grid,
.about-profile__origin,
.about-profile__credentials,
.about-profile__service-grid,
.about-profile__contact {
  display: grid;
  gap: clamp(2.5rem, 7vw, 6rem);
}

.about-profile__hero-copy {
  position: relative;
  z-index: 2;
  align-self: center;
}

.about-profile__identity {
  margin: 1.35rem 0 0;
  color: rgb(40 36 34 / 64%);
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  line-height: 1.5;
  text-transform: uppercase;
}

.about-profile h1,
.about-profile h2,
.about-profile h3,
.about-profile blockquote {
  font-family: var(--font-display);
  font-weight: 470;
  text-wrap: balance;
}

.about-profile h1 {
  max-width: 13ch;
  margin: 1.5rem 0 1.4rem;
  font-size: clamp(3.2rem, 12.5vw, 5.6rem);
  letter-spacing: -0.045em;
  line-height: 0.94;
}

.about-profile__lead {
  max-width: 39rem;
  margin: 0;
  color: rgb(40 36 34 / 72%);
  font-size: clamp(1rem, 2vw, 1.16rem);
}

.about-profile__photo-frame {
  position: relative;
  min-height: 31rem;
  overflow: hidden;
  border: 1px solid rgb(118 38 56 / 16%);
  background: var(--color-wine-800);
  box-shadow: 0 2rem 5rem rgb(40 36 34 / 12%);
}

.about-profile__photo,
.about-profile__photo picture,
.about-profile__image {
  width: 100%;
  height: 100%;
}

.about-profile__photo {
  position: absolute;
  inset: -0.75rem 0;
}

.about-profile__image {
  object-fit: cover;
  object-position: 50% 38%;
}

.about-profile__monogram {
  position: absolute;
  z-index: -1;
  top: 30%;
  left: -0.08em;
  color: rgb(118 38 56 / 5%);
  font-family: var(--font-display);
  font-size: clamp(14rem, 55vw, 32rem);
  letter-spacing: -0.12em;
  line-height: 0.7;
  white-space: nowrap;
}

.about-profile__origin,
.about-profile__credentials,
.about-profile__contact {
  padding-block: clamp(5rem, 10vw, 9rem);
}

.about-profile__origin h2,
.about-profile__section-header h2,
.about-profile__credentials h2,
.about-profile__service h2,
.about-profile__contact h2 {
  max-width: 13ch;
  margin: 0 0 1.5rem;
  font-size: clamp(2.8rem, 8vw, 5.4rem);
  letter-spacing: -0.04em;
  line-height: 0.96;
}

.about-profile__origin p,
.about-profile__credentials p,
.about-profile__service p,
.about-profile__contact p {
  max-width: 40rem;
}

.about-profile__method {
  padding-block: clamp(5rem, 10vw, 9rem);
  background: #fcfaf6;
}

.about-profile__section-header {
  margin-bottom: clamp(3rem, 7vw, 5rem);
}

.about-profile__method-list,
.about-profile__credentials ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.about-profile__method-list li {
  display: grid;
  gap: 1rem;
  padding-block: 2.25rem;
  border-top: 1px solid var(--color-line);
}

.about-profile__method-list li:last-child {
  border-bottom: 1px solid var(--color-line);
}

.about-profile__method-list li > span {
  color: var(--color-gold-500);
  font-size: 0.7rem;
  font-weight: 750;
}

.about-profile__method-list h3 {
  max-width: 18ch;
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.25rem);
  line-height: 1;
}

.about-profile__method-list p,
.about-profile__credentials li {
  margin: 0;
  color: rgb(40 36 34 / 70%);
}

.about-profile__quote {
  padding-block: clamp(5.5rem, 12vw, 10rem);
  background: var(--color-wine-700);
  color: var(--color-ivory-100);
}

.about-profile__quote blockquote {
  max-width: 22ch;
  margin: 0;
  font-size: clamp(2.8rem, 8vw, 6.6rem);
  letter-spacing: -0.045em;
  line-height: 0.96;
}

.about-profile__quote p {
  margin: 2rem 0 0;
  color: rgb(244 235 221 / 68%);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.about-profile__credentials ul {
  border-top: 1px solid var(--color-line);
}

.about-profile__credentials li {
  padding-block: 1.35rem;
  border-bottom: 1px solid var(--color-line);
}

.about-profile__service {
  padding-block: clamp(5rem, 10vw, 8rem);
  background: var(--color-wine-800);
  color: var(--color-ivory-100);
}

.about-profile__service p:not(.eyebrow) {
  color: rgb(244 235 221 / 72%);
}

.about-profile__contact .button {
  margin-top: 1rem;
}

.site-footer__professional {
  display: grid;
  gap: 0.15rem;
  color: rgb(244 235 221 / 70%);
  font-size: 0.68rem;
}

.site-footer__professional p {
  margin: 0;
}
```

Acrescentar aos media queries existentes:

```css
@media (min-width: 48rem) {
  .about-profile__hero-grid {
    min-height: calc(100svh - var(--header-height) - 7rem);
    grid-template-columns: minmax(0, 1.08fr) minmax(21rem, 0.92fr);
    align-items: stretch;
  }

  .about-profile__photo-frame {
    min-height: 42rem;
  }

  .about-profile__origin,
  .about-profile__credentials,
  .about-profile__service-grid,
  .about-profile__contact {
    grid-template-columns: minmax(12rem, 0.7fr) minmax(0, 1.3fr);
    align-items: start;
  }

  .about-profile__method-list li {
    grid-template-columns: 3rem minmax(13rem, 0.8fr) minmax(18rem, 1fr);
    align-items: start;
    gap: clamp(1.5rem, 4vw, 4rem);
  }
}

@media (min-width: 80rem) {
  .about-profile__hero-grid {
    grid-template-columns: minmax(0, 1.16fr) minmax(28rem, 0.84fr);
  }

  .about-profile__photo-frame {
    min-height: 47rem;
  }
}
```

O media query global de `prefers-reduced-motion: reduce` já existente permanece como fallback CSS; o script deve igualmente mostrar o estado final de todos os elementos.

- [ ] **Step 5: Executar testes, tipos e build**

Run: `pnpm test:site && pnpm check && pnpm build`

Expected: testes PASS; Astro reporta 0 errors, 0 warnings e 0 hints; a rota `/sobre/` e as imagens AVIF/WebP são geradas.

- [ ] **Step 6: Registrar a tarefa**

```bash
git add tests/sobre-motion.test.mjs src/components/AboutProfile.astro src/styles/global.css
git commit -m "feat: aplicar direção visual e movimento à página Sobre"
```

---

### Task 4: Validar responsividade, acessibilidade, movimento e performance

**Files:**
- Modify when evidence requires correction: `src/components/AboutProfile.astro`
- Modify when evidence requires correction: `src/styles/global.css`
- Modify: `START-HERE.md`

**Interfaces:**
- Consumes: página completa das Tasks 1–3.
- Produces: evidência de aceite em 390 px, 1440 px, JavaScript desativado e movimento reduzido; documentação de estado final.

- [ ] **Step 1: Iniciar o servidor local sem redimensionar a viewport durante as capturas**

Run: `pnpm dev --host 127.0.0.1`

Expected: servidor disponível em `http://127.0.0.1:4321/` sem erros.

- [ ] **Step 2: Capturar a página em 390 px e 1440 px**

Em outro terminal:

```bash
google-chrome --headless --disable-gpu --hide-scrollbars --window-size=390,2400 --screenshot=/tmp/adriana-sobre-390.png http://127.0.0.1:4321/sobre/
google-chrome --headless --disable-gpu --hide-scrollbars --window-size=1440,1800 --screenshot=/tmp/adriana-sobre-1440.png http://127.0.0.1:4321/sobre/
```

Inspecionar as duas imagens e confirmar:

- rosto integralmente dentro da área segura;
- nenhum texto sobre o rosto;
- nenhum overflow horizontal;
- H1 sem palavras órfãs evitáveis;
- método legível e ordenado;
- contraste do vinho e dourado;
- CTA com altura mínima de 44 px;
- rodapé sem densidade excessiva.

- [ ] **Step 3: Confirmar o fallback sem JavaScript**

Run:

```bash
google-chrome --headless --disable-gpu --disable-javascript --hide-scrollbars --window-size=390,2400 --screenshot=/tmp/adriana-sobre-no-js.png http://127.0.0.1:4321/sobre/
```

Expected: todo o texto, fotografia e CTA permanecem visíveis; apenas o movimento deixa de ocorrer.

- [ ] **Step 4: Confirmar movimento reduzido**

Run:

```bash
google-chrome --headless --disable-gpu --force-prefers-reduced-motion --hide-scrollbars --window-size=390,2400 --screenshot=/tmp/adriana-sobre-reduced-motion.png http://127.0.0.1:4321/sobre/
```

Expected: conteúdo no estado final, sem parallax ou revelações perceptíveis.

- [ ] **Step 5: Auditar o parallax em navegador real**

Abrir `/sobre/` em 390 px e 1440 px, recarregar no topo e rolar uma vez sem redimensionar a viewport. Confirmar:

- deslocamento total aproximado de 8 px no mobile e 24 px no desktop;
- nenhum salto ao fim da timeline de entrada;
- nenhum espaço vazio exposto dentro do frame;
- texto permanece estável durante a rolagem;
- animações executadas uma vez não retornam ao rolar para cima;
- navegação por teclado e foco visível continuam funcionais.

- [ ] **Step 6: Medir o JavaScript referenciado pela página**

Após `pnpm build`, listar os scripts da rota:

```bash
rg -o '/_astro/[^" ]+\.js' dist/sobre/index.html | sort -u
```

Para cada arquivo listado, executar `gzip -c dist/_astro/<arquivo>.js | wc -c`. Registrar qualquer crescimento inesperado; não aceitar nova biblioteca ou bundle que não seja GSAP/ScrollTrigger e o JavaScript global já existente.

- [ ] **Step 7: Atualizar o estado final do projeto**

Em `START-HERE.md`, registrar:

- página Sobre completa no conceito Dossiê Humano;
- fotografia atual como ativo da página;
- identificação `OAB/SP nº 533.644`;
- São Roque e região, atendimento presencial e online;
- parallax sutil de 24 px no desktop e 8 px no mobile;
- fallback sem JS e movimento reduzido validados.

- [ ] **Step 8: Executar a verificação final obrigatória**

Run: `pnpm test:site && pnpm check && pnpm build && git diff --check`

Expected: testes PASS; 0 errors, 0 warnings e 0 hints; build completo; `git diff --check` sem saída.

- [ ] **Step 9: Registrar a validação final**

```bash
git add src/components/AboutProfile.astro src/styles/global.css START-HERE.md
git commit -m "test: validar página Sobre em mobile e desktop"
```
