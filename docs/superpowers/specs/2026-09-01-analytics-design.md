# Analytics Architecture Design

**Status:** aprovado em 2026-09-01

## Escopo

Adicionar observabilidade mínima sem alterar o SSG, a interface, SEO, GEO,
`llms.txt` ou WebMCP. A entrega local usa Vercel Web Analytics, Vercel Speed
Insights e um único evento de conversão `whatsapp_click`.

## Arquitetura

- `BaseLayout.astro` instala as integrações oficiais e um listener global leve.
- Links de WhatsApp declaram somente `placement` e `label` em atributos de dados.
- `trackEvent()` aceita eventos e propriedades tipados, isola falhas do fornecedor
  e nunca interfere na navegação.
- Clarity não é carregado nesta entrega. A ativação depende de política adequada,
  decisão de consentimento e `PUBLIC_CLARITY_PROJECT_ID` real.
- Search Console permanece uma configuração externa sem JavaScript.

## Imagem social

`public/og-adriana-reis.jpg` terá 1200 × 630 px e será composta de forma
determinística com a fotografia real existente em
`src/assets/images/adriana-hero-navy-cutout.png`. Nenhuma feição ou roupa será
gerada ou modificada.

## Privacidade

Eventos não contêm URL completa, telefone, mensagem, nome de visitante, IP ou
user agent. Não entram GA4, GTM, observers de scroll nem identificação individual.
