# Agent Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar uma camada estática, factual e verificável de SEO, GEO, structured data, `llms.txt` v2 e WebMCP read-only.

**Architecture:** `src/data/site.ts` fornece identidade, URLs, contato e áreas para HTML, JSON-LD e WebMCP. O build estático publica metadata, sitemap nativo filtrado, robots e `llms.txt`; um script com feature detection registra apenas três tools sem efeitos externos.

**Tech Stack:** Astro 7, TypeScript estrito, Node test runner, Vercel Static Hosting e Cloudflare Static Assets.

**Spec:** `docs/superpowers/specs/2026-09-01-agent-readiness-design.md`

## Global Constraints

- URL canônica: `https://www.dradrireisadvocacia.com.br`.
- Nenhum fato novo, qualificação, rota SEO, dependência ou alteração visual.
- Política provisória continua `noindex` e ausente do sitemap e `llms.txt`.
- WebMCP expõe somente três tools read-only e nenhum side effect.
- CSP, formulários, analytics e refatoração de Three.js ficam fora do escopo.

---

### Task 1: Contratos de URL, sitemap e metadata

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `src/data/site.ts`
- Modify: `astro.config.mjs`
- Modify: `public/robots.txt`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/AboutProfile.astro`

**Interfaces:**
- Consumes: `site.url`, build Astro e imagem `adriana-reis-logo-wine.png`.
- Produces: metadata canônica e sitemap filtrado para consumo dos testes seguintes.

- [ ] Escrever testes que falhem para o domínio `.example`, metadata social incompleta, sitemap com `noindex`, robots divergente e fotografia Sobre eager.
- [ ] Rodar `pnpm build && node --import tsx --test tests/site-content.test.mjs` e confirmar as falhas esperadas.
- [ ] Atualizar a URL central, filtro do sitemap, robots, metadata Open Graph/Twitter e prioridade da fotografia.
- [ ] Repetir o teste até passar sem alterar a copy.

### Task 2: Grafo JSON-LD factual

**Files:**
- Create: `src/components/StructuredData.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `site`, `practiceAreas`, title, description e canonical.
- Produces: `<script type="application/ld+json">` com `@graph` na homepage.

- [ ] Escrever teste que exija JSON parseável, quatro tipos/IDs estáveis e ausência de propriedades proibidas.
- [ ] Confirmar RED no teste de build.
- [ ] Implementar o menor grafo factual, limitado à homepage.
- [ ] Confirmar GREEN e revisar se cada propriedade tem fonte no repositório.

### Task 3: `llms.txt` v2

**Files:**
- Create: `public/llms.txt`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: URL canônica e IDs reais da homepage.
- Produces: `/llms.txt` curto e `rel="describedby"`.

- [ ] Escrever testes para H1, resumo, links reais, ausência da política e ausência de alternate Markdown.
- [ ] Confirmar RED.
- [ ] Criar o arquivo e link de descoberta.
- [ ] Confirmar GREEN.

### Task 4: WebMCP somente leitura

**Files:**
- Create: `src/scripts/webmcp-tools.ts`
- Create: `src/components/WebMcpTools.astro`
- Create: `tests/webmcp-tools.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site`, `practiceAreas` serializados no HTML.
- Produces: `registerWebMcpTools(modelContext, data)` e registros `get_practice_areas`, `get_practice_area_information`, `get_contact_options`.

- [ ] Escrever testes unitários com model context local que capture registros e execute handlers reais.
- [ ] Exigir enum fechado, annotations read-only, correspondência das três áreas e ausência dos tokens de side effect proibidos.
- [ ] Confirmar RED por módulo ausente.
- [ ] Implementar tipos mínimos, handlers determinísticos, feature detection e cleanup por abort signal.
- [ ] Confirmar GREEN e rodar o teste de build para garantir que navegadores sem WebMCP permanecem funcionais.

### Task 5: Headers da Vercel e Cloudflare

**Files:**
- Create: `vercel.json`
- Modify: `public/_headers`
- Create: `tests/hosting-config.test.mjs`

**Interfaces:**
- Consumes: requisitos de headers sem CSP.
- Produces: configurações equivalentes e não conflitantes.

- [ ] Escrever teste que exija os quatro headers em ambos os ambientes e proíba CSP.
- [ ] Confirmar RED porque `vercel.json` não existe.
- [ ] Implementar configuração mínima da Vercel e alinhar `_headers`.
- [ ] Confirmar GREEN.

### Task 6: Documentação e agentic readiness

**Files:**
- Create: `docs/agent-readiness.md`
- Modify: `tests/site-content.test.mjs`
- Create: `tests/webmcp-tools.test.mjs`
- Modify: `START-HERE.md`

**Interfaces:**
- Consumes: output e contratos das Tasks 1–5.
- Produces: checklist reproduzível e respostas estruturadas para as dez perguntas agentic.

- [ ] Escrever teste que extraia do build quem, áreas, contato, canonical, tools e read-only/side effects.
- [ ] Confirmar RED antes da documentação/contratos finais.
- [ ] Documentar implementação, riscos, limitações, ambientes, especificações consultadas e pendências.
- [ ] Confirmar GREEN.

### Task 7: Verificação integral

**Files:**
- Verify: todos os arquivos alterados e criados.

**Interfaces:**
- Consumes: implementação completa.
- Produces: evidência local e lista explícita do que depende de deploy.

- [ ] Rodar `pnpm format:check`, `pnpm check`, `pnpm test:site` e `pnpm build`.
- [ ] Inspecionar `dist` para domínios vedados, metadata, JSON-LD, robots, sitemap e `llms.txt`.
- [ ] Validar homepage em 390 px e 1440 px, teclado, reduced-motion e console.
- [ ] Rodar Lighthouse se disponível sem instalar nova dependência.
- [ ] Revisar `git diff --check`, `git diff --stat` e o diff completo.
- [ ] Relatar separadamente `LOCAL VERIFIED`, `DEPLOY REQUIRED` e `PRODUCTION VERIFIED`.
