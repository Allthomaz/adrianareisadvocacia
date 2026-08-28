# Spec mestre — site Adriana Reis Advocacia

**Status:** base técnica definida; conteúdo factual e direção visual em validação  
**Estratégia:** site institucional multipágina, construído por etapas  
**Primeira entrega:** fundação global + homepage/hero

## 1. Objetivo

Construir um site institucional elegante, humano e rápido, que apresente Adriana
Reis, organize suas frentes de atuação e facilite compreensão e contato sem
promessas de resultado ou alegações profissionais não comprovadas.

## 2. Posicionamento e mensagem

Mensagem principal proposta:

> Soluções jurídicas com estratégia, ética e clareza.

Camadas da hero:

- Eyebrow: `DIREITO CIVIL · TRABALHISTA · PREVIDENCIÁRIO`
- H1: `Soluções jurídicas com estratégia, ética e clareza.`
- Apoio: `Adriana Reis atua em demandas civis, trabalhistas e previdenciárias, com atenção às particularidades de cada contexto.`
- CTA principal: `Conheça a atuação`
- CTA secundário: `Entre em contato`

“Resultados” não entra no H1: é amplo, pouco verificável e pode sugerir promessa.
“Clareza” diferencia a comunicação e reduz ansiedade sem antecipar desfecho.

## 3. Mapa inicial do site

```text
/
├── /atuacao/
│   ├── /direito-civil/
│   ├── /direito-trabalhista/
│   └── /direito-previdenciario/
├── /sobre/
├── /conteudos/
│   └── /[slug]/
├── /contato/
├── /politica-de-privacidade/
└── /404.html
```

`Serviços` não será uma rota vaga no início; a navegação usa `Atuação`. Novas
frentes entram como páginas próprias somente após confirmação de escopo e copy.

## 4. Entregas por etapa

### Etapa 0 — fundação

- Astro 7, TypeScript estrito, Tailwind 4, GSAP e Wrangler.
- Tokens de cor, tipografia, espaçamento, container e estados interativos.
- Layout base, SEO global, header, footer, 404, sitemap e robots.
- Pipeline de imagens, fontes locais e testes mínimos.

### Etapa 1 — homepage e hero

- Hero responsiva descrita em `docs/spec-hero.md`.
- Frentes de atuação, apresentação curta, processo de contato e CTA final.
- Motion discreto, progressivo e mobile-first.

### Etapa 2 — páginas institucionais

- Hub e páginas das frentes de atuação.
- Página Sobre e página Contato.
- Conteúdo factual aprovado, OAB/UF, canais e avisos necessários.

### Etapa 3 — Conteúdos

- Content collection validada com Zod.
- Listagem, artigos, metadados sociais e conteúdo relacionado.
- Processo editorial antes de qualquer CMS.

### Etapa 4 — qualidade e lançamento

- Acessibilidade WCAG 2.2 AA, responsividade, Lighthouse e testes reais mobile.
- Revisão jurídica/ética da copy e revisão factual da cliente.
- Preview no Cloudflare Workers; deploy somente quando autorizado.

## 5. Stack e princípios

- Astro 7 em output estático.
- TypeScript estrito.
- Tailwind CSS 4 via plugin Vite oficial.
- GSAP core + ScrollTrigger somente onde elevar compreensão e ritmo.
- Sem React, SPA, hidratação global, CMS ou biblioteca de UI nesta fase.
- Cloudflare Workers Static Assets com Wrangler; sem adapter no início.
- Conteúdo essencial sempre disponível em HTML, mesmo sem JavaScript.

As regras detalhadas estão em `docs/astro-cloudflare-boas-praticas.md`.

## 6. Direção visual

- Base marfim clara, bloco vinho ligeiramente luminoso e detalhes dourados
  contidos.
- Serif editorial para títulos e sans legível para interface e corpo.
- Fotografia real de Adriana como principal elemento humano.
- Monograma AR em escala grande e opacidade baixa, sem clichês jurídicos.
- Mobile recebe composição própria, não uma redução do desktop.

## 7. Requisitos transversais

- Sem `especialista`, `especializada`, liderança de mercado, números ou resultados
  sem comprovação e aprovação.
- Componentes semânticos, foco visível, contraste AA e movimento reduzido.
- Imagens responsivas, dimensões declaradas e fontes locais.
- SEO técnico por rota e dados estruturados apenas quando factualmente válidos.
- Dados de contato e identidade centralizados, sem valores repetidos em templates.

## 8. Critérios da primeira entrega

- Homepage funcional em 390 px, tablet, notebook e 1440 px.
- Navegação para a arquitetura futura, sem links falsos ou rotas quebradas.
- Hero fiel à direção aprovada e sem deformar fotografia/logo.
- Sem overflow horizontal; menu completo por teclado.
- `astro check` e `astro build` sem erros.
- JS e animações dentro do orçamento e totalmente dispensáveis para leitura.
- Preview local pelo Wrangler reproduz a entrega estática.

## 9. Pendências factuais

1. Confirmar Direito Previdenciário como frente de atuação.
2. Aprovar a mensagem principal e o texto de apoio.
3. Confirmar que “atenção às particularidades de cada contexto” descreve a prática.
4. Informar OAB/UF e número de inscrição.
5. Confirmar telefone, WhatsApp, e-mail, cidade/abrangência e horários.
6. Delimitar temas atendidos dentro de cada frente.
7. Aprovar fotografia recortada e versões finais da marca.

Placeholders podem sustentar o protótipo, mas não devem chegar à publicação.
