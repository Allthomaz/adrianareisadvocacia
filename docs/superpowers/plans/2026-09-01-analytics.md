# Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Instrumentar tráfego, performance e cliques humanos no WhatsApp com o mínimo de código e sem deploy.

**Architecture:** O layout global injeta os clientes oficiais da Vercel. Um módulo tipado recebe o único evento de conversão e um listener delegado lê atributos seguros dos links existentes.

**Tech Stack:** Astro 7, TypeScript, `@vercel/analytics`, `@vercel/speed-insights`, Node test runner e Sharp existente.

**Spec:** `docs/superpowers/specs/2026-09-01-analytics-design.md`

## Global Constraints

- Não fazer deploy ou commit.
- Preservar SEO, GEO, `llms.txt`, WebMCP e HTML sem JS.
- Clarity permanece bloqueado até consentimento e política apropriados.
- Não adicionar GA4, GTM, SPA, hydration ou eventos comportamentais redundantes.

---

### Task 1: Contratos de analytics e imagem social

- [ ] Escrever testes para eventos permitidos, falha segura, links e metadata.
- [ ] Confirmar que falham pela ausência da implementação.
- [ ] Instalar somente os dois pacotes oficiais da Vercel.
- [ ] Implementar integração global e marcação dos links.
- [ ] Gerar o ativo social real em 1200 × 630 px.
- [ ] Confirmar os testes verdes.

### Task 2: Documentação e verificação

- [ ] Criar `docs/analytics.md` com privacidade, Clarity e Search Console.
- [ ] Rodar formatação, check, testes e build.
- [ ] Comparar Lighthouse local sem publicar.
- [ ] Revisar o diff e parar antes de commit/deploy.
