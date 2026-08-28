# Astro + Cloudflare — boas práticas do projeto

**Atualizado em:** 2026-08-27  
**Base:** Astro 7, TypeScript estrito, Tailwind CSS 4, GSAP e Cloudflare Workers

## Decisão arquitetural

O site começa como **site estático multipágina**. Cada rota gera HTML próprio,
sem SPA e sem framework de UI. Componentes Astro são o padrão; JavaScript no
cliente só entra em interações que realmente precisam dele, como menu e
animações GSAP.

Não instalar `@astrojs/cloudflare` inicialmente. O adapter só será necessário se
o projeto adotar renderização sob demanda, actions, sessions ou server islands.
O deploy estático será feito como assets de um Cloudflare Worker.

## Versões e instalação

- Node.js: versão par LTS compatível com Astro 7; mínimo documentado `22.12.0`.
- Gerenciador: `pnpm`, com lockfile versionado.
- Astro: dependência local do projeto, não global.
- TypeScript: preset `strict` ou `strictest` no `astro/tsconfigs`.
- Tailwind 4: integração pelo plugin Vite oficial, via `astro add tailwind`.
- GSAP: importado apenas nos scripts/componentes animados.
- Wrangler: dependência de desenvolvimento para preview e deploy.

Instalação prevista quando a implementação começar:

```bash
pnpm create astro@latest .
pnpm astro add tailwind sitemap
pnpm add gsap lucide-astro
pnpm add -D wrangler @astrojs/check prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

O scaffolding deve preservar `assets/`, `docs/`, `pesquisa-estrategica` e as
skills locais já existentes.

## Estrutura e componentes

- `src/pages/` representa as rotas reais do site.
- `src/layouts/BaseLayout.astro` concentra head, canonical, metadados sociais,
  fontes, header e footer.
- `src/components/` contém blocos reutilizáveis e pequenos.
- `src/data/site.ts` concentra navegação, contato e dados factuais.
- `src/content.config.ts` e content collections entram na fase de Conteúdos.
- Assets processados ficam em `src/assets/`; arquivos que precisam manter o nome
  literal ficam em `public/`.

Evitar `client:*` por padrão. Um componente Astro gera HTML sem runtime no
navegador. Scripts simples dentro de `.astro` já são processados, agrupados e
deduplicados pelo Astro.

## Imagens e fontes

- A fotografia da hero fica em `src/assets/images/` e usa `<Picture>` ou
  `<Image>` de `astro:assets`, com largura, altura, `sizes` e formatos modernos.
- Reservar espaço para evitar CLS e não usar background CSS para conteúdo
  essencial.
- A imagem LCP não deve usar lazy loading; imagens abaixo da dobra devem.
- Logos que precisam de URL estável podem permanecer em `public/images/brand/`.
- Usar WOFF2, preferencialmente fontes variáveis, e carregar somente os eixos e
  pesos necessários.
- Usar a Fonts API do Astro 7 ou fontes locais; preload apenas da fonte realmente
  necessária na primeira dobra.

## GSAP fluido e responsável

- Registrar plugins uma vez e usar `gsap.matchMedia()` para desktop, mobile e
  `prefers-reduced-motion`.
- Animar `transform`, `opacity` e `autoAlpha`; evitar propriedades que recalculam
  layout, como `top`, `left`, `width` e `height`.
- Usar timelines e labels para sequências, sem cadeias de delays.
- No mobile, preferir entradas curtas e discretas, executadas uma vez.
- Não usar pinning ou parallax na hero; não adotar ScrollSmoother nesta fase.
- Remover `will-change` após a animação e garantir cleanup com `revert()`.
- Todo conteúdo e CTA devem estar disponíveis sem GSAP e com movimento reduzido.

## SEO e conteúdo multipágina

- Definir `site` em `astro.config` para canonical e sitemap corretos.
- Usar `@astrojs/sitemap` e publicar `robots.txt`.
- Cada página tem `title`, description, canonical, Open Graph e um único `h1`.
- Rotas de atuação respondem a intenções específicas sem duplicar texto.
- A futura área de artigos usa content collections com schema Zod, datas e slug
  validados; listas devem ser ordenadas explicitamente.
- Prefetch é seletivo. Em mobile, `tap` é a primeira opção; respeitar Save-Data e
  conexões lentas.

## Acessibilidade e desempenho

- WCAG 2.2 AA, navegação por teclado, foco visível e alvos de pelo menos 44 px.
- Menu mobile usa botão real, `aria-expanded`, `aria-controls`, Escape e retorno
  de foco.
- Orçamento inicial: JS próprio da homepage até 45 kB gzip, CLS até 0,05 e LCP
  até 2,5 s no percentil 75 quando houver dados reais.
- Validar em 390 px e aparelho Android intermediário/entrada, não apenas desktop.
- Rodar `astro check`, build, Lighthouse e auditoria manual de teclado.

## Cloudflare Workers

Configuração estática inicial em `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "adriana-reis-advocacia",
  "compatibility_date": "2026-08-27",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
  },
}
```

Fluxo local e de produção:

```bash
pnpm build
pnpm wrangler dev
pnpm wrangler deploy
```

Criar `src/pages/404.astro`. Usar `public/_headers` para cabeçalhos de segurança e
cache somente após testar; os assets com hash já recebem cache eficiente do
Cloudflare. Nunca aplicar cache imutável ao HTML.

No Workers Builds: comando de build `pnpm build` e comando de deploy
`pnpm wrangler deploy`. Deploy permanece uma ação explícita e não faz parte da
implementação local automática.

## Fontes locais

- Astro: `docs/references/astro/`
- Cloudflare: `docs/references/cloudflare/`
- GSAP: `.agents/skills/gsap-*`
