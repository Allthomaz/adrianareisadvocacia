# Landing Page Única de Conversão Total

**Status:** direção aprovada em 30 de agosto de 2026
**Escopo:** homepage como única rota pública de funil, menu de 4 seções,
seção de dúvidas comuns (FAQ), redirects das rotas secundárias e estratégia de
CTA única
**Referências:** `docs/superpowers/specs/2026-08-30-sobre-dossie-humano-design.md`
(emendada), `START-HERE.md`, Startup Handbook de Julian Shapiro
(`Desejo − (esforço + confusão)`)

## 1. Objetivo

Concentrar todo o funil de conversão em uma única página: quem chega, percorre
uma narrativa contínua — hero, atuação, a advogada, dúvidas, primeiros passos —
e converte no WhatsApp. Eliminar caminhos paralelos que disputam a atenção
(menu de 5 itens, páginas de apoio, CTAs concorrentes).

## 2. Decisões aprovadas

1. **LP única** (opção A): páginas secundárias saem do build com redirect.
2. **4ª seção do menu = "Dúvidas"** (FAQ de objeções), pontuada por ICE.
3. **Sobre vira seção da homepage** (`#sobre`), conforme spec emendada do
   dossiê humano.

## 3. Estrutura da homepage

```
Hero (h1 atual mantido)
→ faixa de credenciais: OAB/SP nº 533.644 · São Roque e região ·
  presencial e online
→ Atuação (#atuacao) — 3 capítulos GSAP existentes
→ Sobre (#sobre) — AboutProfile completo (dossiê humano)
→ Dúvidas comuns (#duvidas) — FAQ de objeções
→ Como começar (#como-comecar) — primeiros passos existentes
→ CTA final — WhatsApp
```

A faixa de credenciais logo após o hero cumpre o papel de prova social
permitido no contexto jurídico: identificação verificável, sem depoimentos,
FOMO ou números.

## 4. Navegação

- `landingNavigation` passa a 4 itens: `Atuação · Sobre · Dúvidas ·
  Como começar`, todos âncoras da própria página.
- O array `navigation` (5 itens) é extinto; `Header.astro` e `MobileMenu.astro`
  passam a usar apenas a navegação da LP — não existe mais "outra página".
- Botão WhatsApp permanece fixo no header (desktop) e no rodapé do painel
  mobile, fora da contagem de seções.

## 5. FAQ — Dúvidas comuns

### 5.1 Formato

- 5 perguntas em `<details>/<summary>` nativos — funcionam sem JavaScript.
- Primeira aberta por padrão (`open`).
- Cada resposta termina convergindo para o WhatsApp.
- Heading da seção: `h2` "Dúvidas comuns".

### 5.2 Perguntas (objeções dominantes)

1. **A primeira conversa gera compromisso?** — Não; serve para apresentar o
   contexto e identificar o que a análise inicial precisa.
2. **O atendimento precisa ser presencial?** — Não; presencial em São Roque e
   região e online, com acompanhamento em outras localidades quando a natureza
   do caso permitir.
3. **O que levar para a primeira conversa?** — A narrativa dos fatos e
   documentos que já estiverem às mãos (contratos, mensagens, comprovantes,
   extratos); nada é exigido antes da conversa.
4. **Quanto custa?** — Depende da natureza e da complexidade do caso; a
   primeira conversa permite delimitar o que será necessário antes de qualquer
   definição. Não publicar valores.
5. **Quanto tempo demora?** — Cada situação tem ritmo próprio, dependendo da
   análise necessária e do andamento dos órgãos envolvidos; sem promessa de
   prazo ou resultado.

### 5.3 Guardrails de copy

- Nada de `especialista`, promessa de resultado, urgência ou escassez.
- Fatos apenas dos já confirmados em `src/data/site.ts`.
- **A copy integral da FAQ é enviada à Adriana para aprovação antes da
  publicação**; se não houver resposta, a seção não entra no ar.

## 6. Estratégia de CTA

- Um único destino na página inteira: `whatsappUrl` (`src/data/site.ts`).
- Sem e-mail, telefone alternativo, formulário ou redes sociais.
- CTAs repetidos nos pontos de decisão: header fixo, fim de cada capítulo de
  atuação (já existem), encerramento do Sobre, fim da FAQ e CTA final.
- Mesma ação, mesma URL — sem variação de canal.

## 7. Rotas e redirects

Removidas do build; redirects 301 declarados em `astro.config.mjs`:

| Rota antiga | Destino |
|---|---|
| `/sobre/` | `/#sobre` |
| `/atuacao/` e subpáginas das 3 áreas | `/#atuacao` |
| `/contato/` | `/#como-comecar` |
| `/conteudos/` | `/` |

Permanecem: `/`, `/politica-de-privacidade/`, `/404` e as rotas de laboratório
(`noindex`, fora da navegação).

Arquivos de página removidos: `src/pages/sobre.astro`, `src/pages/atuacao/`,
`src/pages/contato.astro`, `src/pages/conteudos/`, `src/components/AboutPreview.astro`
e `src/components/PageIntro.astro` (se sem outros consumidores).

## 8. Testes

- `tests/site-content.test.mjs`:
  - contrato da FAQ (perguntas presentes, `<details>`, âncora `#duvidas`);
  - menu com exatamente os 4 itens aprovados;
  - URLs antigas respondem redirect no preview;
  - nenhum link interno aponta para rota removida.
- `tests/sobre-motion.test.mjs`: `previewUrl` aponta para `/` (a seção
  `#sobre` está na homepage).
- Fluxo TDD preservado: teste vermelho antes de cada mudança funcional.

## 9. Verificação e aceite

- `pnpm check`, `pnpm build` e `pnpm test:site` passam.
- Homepage validada em 390 px e 1440 px.
- Menu (desktop e hambúrguer) com 4 itens + botão WhatsApp.
- Nenhuma rota morta: todos os links internos resolvem.
- Redirects 301 funcionando no preview.
- FAQ legível e acionável sem JavaScript.
- Copy da FAQ aprovada pela cliente antes da publicação.
- Domínio `site.url` permanece placeholder até confirmação (fora do escopo).
