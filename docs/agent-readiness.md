# Agent readiness — Adriana Reis Advocacia

**Atualizado em:** 2026-09-01
**Produção atual:** Vercel
**URL canônica:** `https://www.dradrireisadvocacia.com.br`

## Escopo

Esta camada melhora descoberta e interpretação do site sem alterar a identidade
visual ou acrescentar conteúdo jurídico. `src/data/site.ts` é a fonte factual
para identidade, contato, URL e áreas de atuação.

## SEO implementado

- Canonical, Open Graph, Twitter e JSON-LD usam o domínio confirmado.
- A imagem social pública é
  `/images/brand/adriana-reis-logo-wine.png` (PNG, 940 × 460 px).
- O sitemap nativo do Astro é filtrado para conter somente a homepage.
- O plugin publica `sitemap-index.xml`, que aponta para `sitemap-0.xml`.
- `robots.txt` aponta para o sitemap efetivamente publicado.
- Laboratórios, redirects, 404 e páginas `noindex` ficam fora do sitemap.
- A fotografia abaixo da dobra da seção Sobre usa carregamento lazy.

## GEO implementado

GEO é estrutural: nomes consistentes, headings associados ao conteúdo, IDs
estáveis para as três áreas, canonical, JSON-LD e links de descoberta. A copy
editorial não foi duplicada nem reescrita para mecanismos de IA.

As lacunas factuais continuam explícitas: e-mail, endereço profissional,
horários e outros canais não foram inventados.

## Structured data

A homepage contém um único `@graph` com:

- `WebSite` — `/#website`;
- `WebPage` — `/#webpage`;
- `LegalService` — `/#legal-service`;
- `Person` — `/#person`.

O grafo usa apenas dados publicados e omite avaliações, prêmios, redes sociais,
endereço, e-mail, horários, preços e propriedades geográficas não confirmadas.

## llms.txt

`/llms.txt` segue a proposta v2 consultada em 2026-09-01. Ele aponta para a
homepage e para as âncoras reais de Civil, Trabalhista, Previdenciário, Sobre,
Dúvidas e Como começar. A homepage publica `rel="describedby"`.

Não foi criada representação Markdown duplicada, portanto não existe
`rel="alternate" type="text/markdown"`.

**llms.txt não substitui robots.txt ou sitemap.xml.** Neste projeto, o sitemap
efetivo é o índice nativo `/sitemap-index.xml`.

## WebMCP

Referências consultadas em 2026-09-01:

- Chrome WebMCP, atualizado em 2026-08-07;
- WebMCP Draft Community Group Report disponível em
  `https://webmachinelearning.github.io/webmcp/`.

WebMCP permanece experimental e está sujeito a mudanças. A implementação usa a
API imperativa atual `document.modelContext.registerTool()`, JSON Schema,
feature detection e cancelamento de registros por `AbortController`.

**WebMCP é progressive enhancement; a interface convencional continua sendo a
fonte funcional primária.** Navegadores sem `document.modelContext` usam o site
normalmente e não recebem erro visível.

### Tools expostas

| Tool | Input | Retorno | Anotações |
|---|---|---|---|
| `get_practice_areas` | objeto vazio | IDs, nomes e URLs das três áreas | read-only, conteúdo confiável |
| `get_practice_area_information` | enum `civil`, `trabalhista` ou `previdenciario` | introdução e situações já publicadas | read-only, conteúdo confiável |
| `get_contact_options` | objeto vazio | informação pública do WhatsApp | read-only, conteúdo confiável |

Todas usam `readOnlyHint: true` e `untrustedContentHint: false`.

### Ações deliberadamente não expostas

- abrir ou navegar para o WhatsApp;
- preparar ou enviar mensagem;
- transmitir dados pessoais;
- criar lead ou solicitar atendimento;
- preencher ou submeter formulário;
- escrever em localStorage ou sessionStorage;
- disparar analytics;
- avaliar caso, direito, resultado ou estratégia jurídica.

## Segurança e privacidade

As tools não recebem texto livre, exceto o enum fechado de área; não acessam
rede, storage, formulários, credenciais ou serviços externos. Os dados retornam
de `src/data/site.ts` e não incluem conteúdo fornecido por terceiros.

A produção atual usa `vercel.json`. `public/_headers` mantém a configuração
equivalente para Cloudflare. Os dois ambientes definem `nosniff`, política de
referrer, proteção contra framing e bloqueio de câmera, microfone e
geolocalização. CSP não faz parte desta entrega.

A documentação do Chrome exige origin isolation e informa que
`Origin-Agent-Cluster: ?0` desativa WebMCP. O header `?1` não foi adicionado,
pois a documentação atual não o exige literalmente para uma página HTTPS já
origin-keyed. A disponibilidade real precisa ser validada em navegador com
WebMCP habilitado após o deploy.

## Checklist agentic reproduzível

1. Quem é Adriana Reis? Verificar `#sobre` e a entidade `#person`.
2. Quais são as áreas? Verificar os três capítulos e
   `get_practice_areas`.
3. Como obter informações sobre Civil? Usar `#direito-civil` ou a tool com
   `area: "civil"`.
4. Como obter informações sobre Trabalhista? Usar `#direito-trabalhista` ou a
   tool com `area: "trabalhista"`.
5. Como obter informações sobre Previdenciário? Usar
   `#direito-previdenciario` ou a tool com `area: "previdenciario"`.
6. Como entrar em contato? Consultar `get_contact_options`; a decisão de abrir
   o WhatsApp permanece humana.
7. Qual é a URL canônica? Conferir canonical, `og:url`, JSON-LD e sitemap.
8. Quais tools existem? Conferir a tabela acima ou o inspetor WebMCP.
9. Quais são somente leitura? Todas as três.
10. Alguma ação produz efeito externo? Não; os testes instalam sentinelas para
    rede, navegação e storage ao executar os handlers.

## Como testar

```bash
pnpm format:check
pnpm check
pnpm test:site
pnpm build
```

Após o build, inspecionar `dist/index.html`, `dist/robots.txt`,
`dist/sitemap-index.xml`, `dist/sitemap-0.xml` e `dist/llms.txt`. A validação de
produção só pode ocorrer após novo deploy.

## Limitações e pendências

- A política de privacidade permanece provisória, `noindex` e fora do sitemap e
  de `llms.txt`; depende de revisão editorial/jurídica.
- WebMCP depende de suporte experimental do navegador e visita direta à página.
- O aviso de bundle acima de 500 kB, associado à experiência Three.js, permanece
  dívida técnica fora deste escopo.
- Acessibilidade automatizada não substitui teste manual com leitor de tela.
