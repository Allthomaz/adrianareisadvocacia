# Instruções para agentes

Leia `START-HERE.md` antes de trabalhar neste repositório. Ele registra stack,
estado atual, decisões visuais, animações, fatos confirmados e pendências.

Regras obrigatórias:

1. Antes de editar, rode `git status --short`, `pnpm check` e `pnpm build`.
2. Preserve mudanças existentes e não execute operações destrutivas.
3. Não invente OAB, contato, localidade, domínio, formação, experiência ou
   qualquer informação profissional da cliente.
4. O WhatsApp confirmado é `+55 11 93353-5801`; mantenha a URL centralizada em
   `src/data/site.ts`.
5. Civil, Trabalhista e Previdenciário permanecem na homepage até nova decisão
   explícita da cliente.
6. Respeite `prefers-reduced-motion`, acessibilidade e conteúdo sem JS.
7. Não adicione islands apenas para satisfazer o Dev Toolbar; scripts
   client-side em `.astro` são intencionais.
8. Para alterações visuais, valide em 390 px e 1440 px.
9. Finalize com `pnpm check` e `pnpm build`.

Referências prioritárias:

- `docs/spec-site.md`
- `docs/spec-hero.md`
- `docs/astro-cloudflare-boas-praticas.md`
- `docs/brand-assets.md`
- `pesquisa-estrategica`
