# Agent Readiness Design

**Status:** aprovado em 2026-09-01
**Escopo:** camada estática enxuta + WebMCP somente leitura

## Objetivo

Tornar a landing page institucional tecnicamente consistente para SEO, GEO,
crawling, structured data, `llms.txt` v2 e descoberta WebMCP, sem alterar o
design, inventar fatos ou criar efeitos externos para agentes.

## Fonte factual e URL canônica

`src/data/site.ts` permanece a fonte central de identidade, contato e áreas de
atuação. A URL canônica única é
`https://www.dradrireisadvocacia.com.br`.

Nenhum output público pode conter `adriana-reis-advocacia.example`. O domínio
`adrianareisadvocacia.vercel.app` pode continuar acessível, mas não aparece em
canonical, metadata social, schema, sitemap ou entidades.

## SEO, crawling e metadata

- A homepage conserva title, description, headings e copy.
- Canonical, Open Graph, Twitter e JSON-LD derivam de `site.url`.
- A imagem social existente é PNG público de 940 × 460 px.
- O sitemap nativo do Astro é filtrado para conter somente a homepage. Se o
  plugin continuar publicando `sitemap-index.xml`, essa URL real será mantida;
  não será criado alias artificial para `/sitemap.xml`.
- `robots.txt` aponta para o sitemap efetivamente gerado.
- Laboratórios, redirects, 404 e política provisória permanecem fora do sitemap.
- A política provisória permanece `noindex` e fora de `llms.txt`.
- A fotografia abaixo da dobra da seção Sobre usa `loading="lazy"` e não usa
  `fetchpriority="high"`.

## Structured data

A homepage publica um único JSON-LD com `@graph` e estes IDs estáveis:

- `/#website` — `WebSite`;
- `/#webpage` — `WebPage`;
- `/#legal-service` — `LegalService`;
- `/#person` — `Person`.

O grafo usa somente nome, URL, descrição, imagem pública, áreas e fatos
expressamente publicados. Não inclui ratings, reviews, awards, `sameAs`,
endereço, e-mail, horários, preços ou propriedades inferidas. Entidades se
relacionam por `isPartOf`, `about`, `mainEntity` e `provider` apenas quando a
semântica e o conteúdo publicado sustentarem a relação.

## GEO e `llms.txt`

GEO é estrutural: consistência de entidades, headings, IDs, links e conteúdo
factual extraível. Nenhuma copy será duplicada para robôs.

`/llms.txt` segue a proposta v2, é curto e aponta somente para a homepage e as
âncoras existentes: `#direito-civil`, `#direito-trabalhista`,
`#direito-previdenciario`, `#sobre`, `#duvidas` e `#como-comecar`. A homepage
declara `<link rel="describedby" href="/llms.txt">`. Não haverá representação
Markdown duplicada nem `rel="alternate"`.

## WebMCP

Um script progressivo registra, somente quando `document.modelContext` existir:

1. `get_practice_areas`: lista ID, nome e URL das três áreas.
2. `get_practice_area_information`: aceita `area` enumerado como `civil`,
   `trabalhista` ou `previdenciario` e retorna somente o conteúdo publicado.
3. `get_contact_options`: retorna o canal público de WhatsApp sem abri-lo.

Todas usam `annotations: { readOnlyHint: true, untrustedContentHint: false }`.
Nenhuma navega, chama serviço externo, transmite dados, abre WhatsApp, altera
storage, submete formulário ou dispara analytics. Dados são serializados a
partir de `src/data/site.ts`; os handlers apenas selecionam e retornam dados.
Um `AbortController` cancela os registros durante descarte da página.

## Headers e ambientes

A documentação atual do Chrome exige documentos origin-isolated para WebMCP.
Como a produção Vercel não envia `Origin-Agent-Cluster: ?0`, o contexto HTTPS
já usa a origem estável esperada; `Origin-Agent-Cluster: ?1` será configurado
explicitamente somente se a validação no navegador atual demonstrar necessidade.

`vercel.json` é a configuração efetiva da produção atual. `public/_headers`
mantém equivalência para o futuro Cloudflare. Ambos definem, sem conflito:

- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: SAMEORIGIN`;
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

CSP fica fora desta entrega.

## Testes e limites

Testes de build verificam URLs, metadata, JSON-LD, sitemap, robots, `llms.txt`,
tools WebMCP e proibição de side effects. Os contratos existentes continuam
verificando conteúdo, redirects, responsividade e movimento reduzido.

A validação local não equivale a produção. O relatório final separará
`LOCAL VERIFIED`, `DEPLOY REQUIRED` e `PRODUCTION VERIFIED`. O bundle acima de
500 kB e a política provisória permanecem dívidas documentadas.
