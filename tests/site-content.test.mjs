import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import test from "node:test";

const readBuiltPage = (pathname) =>
  readFile(new URL(`../dist/${pathname}`, import.meta.url), "utf8");

const pathExists = (pathname) =>
  access(new URL(`../dist/${pathname}`, import.meta.url))
    .then(() => true)
    .catch(() => false);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const listHtmlFiles = async (dir = new URL("../dist/", import.meta.url)) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = new URL(
        `${entry.name}${entry.isDirectory() ? "/" : ""}`,
        dir,
      );
      return entry.isDirectory() ? listHtmlFiles(path) : Promise.resolve(path);
    }),
  );
  return files.flat();
};

test("publica identificação profissional e localidade confirmadas no rodapé", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /Adriana Rodrigues Reis de Andrade/);
  assert.match(html, /OAB\/SP nº 533\.644/);
  assert.match(html, /São Roque e região/);
});

test("a homepage publica o método, a citação e as credenciais aprovadas", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(
    html,
    /<h2[^>]*>\s*Compreender o caso por completo precede a definição da estratégia jurídica\.\s*<\/h2>/,
  );
  assert.match(html, /Investigar, questionar e compreender\./);
  assert.match(html, /Escutar antes de concluir/);
  assert.match(html, /Examinar o conjunto, não apenas o episódio/);
  assert.match(html, /Orientar sem antecipar certezas/);
  assert.match(html, /<blockquote/);
  assert.match(
    html,
    /Primeiro eu preciso entender<\/span>[\s\S]*?o seu caso por inteiro\./,
  );
  assert.match(html, /Universidade Nove de Julho/);
  assert.match(html, /Legale Educacional/);
  assert.match(html, /Atendimento também à distância/);
  assert.match(html, /id="sobre"/);
});

test("a seção Sobre usa fotografia responsiva e CTA centralizado", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /<picture/);
  assert.match(html, /alt="Adriana Reis em seu ambiente profissional"/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /data-about-parallax-frame/);
  assert.match(html, /data-about-parallax-host[^>]*aria-hidden="true"/);
  assert.match(html, /data-about-parallax-fallback/);
  assert.match(html, /data-parallax-state="fallback"/);
  assert.match(html, /href="https:\/\/wa\.me\/5511933535801/);
  assert.match(html, /Apresente sua situação/);
});

test("a homepage publica a FAQ de objeções em details nativos", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /id="duvidas"/);
  assert.match(html, /<h2[^>]*>\s*Dúvidas comuns\s*<\/h2>/);
  assert.match(html, /A primeira conversa gera compromisso\?/);
  assert.match(html, /O atendimento precisa ser presencial\?/);
  assert.match(html, /O que levar para a primeira conversa\?/);
  assert.match(html, /Quanto custa\?/);
  assert.match(html, /Quanto tempo demora\?/);
  assert.match(html, /<details[^>]*open/);
  assert.match(html, /wa\.me\/5511933535801/);
});

test("a navegação da LP tem exatamente os 4 itens aprovados", async () => {
  const html = await readBuiltPage("index.html");
  // O rodapé usa nav própria (âncoras distintas), então o teste considera
  // apenas os navs do header: desktop ("Navegação principal") e mobile
  // ("Navegação móvel").
  const headerNavs =
    html.match(
      /<nav[^>]*aria-label="Navegação (principal|móvel)"[^>]*>[\s\S]*?<\/nav>/g,
    ) ?? [];

  assert.ok(headerNavs.length === 2);
  for (const nav of headerNavs) {
    assert.match(nav, /href="#atuacao"[^>]*>\s*Atuação/);
    assert.match(nav, /href="#sobre"[^>]*>\s*Sobre/);
    assert.match(nav, /href="#duvidas"[^>]*>\s*Dúvidas/);
    assert.match(nav, /href="#como-comecar"[^>]*>\s*Como começar/);
    assert.doesNotMatch(nav, /Conteúdos|Contato/);
  }
});

test("a faixa de credenciais segue o hero", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /OAB\/SP nº 533\.644/);
  assert.match(html, /São Roque e região/);
  // "Online" vem maiúsculo em site.ts e o CSS aplica uppercase ao renderizar.
  assert.match(html, /Presencial e [Oo]nline/);
});

test("a seção Sobre não publica alegações vedadas ou fatos recusados", async () => {
  const html = (await readBuiltPage("index.html")).toLowerCase();

  assert.doesNotMatch(html, /especialista|especializada|garantia de resultado/);
  assert.doesNotMatch(html, /ano de início|tempo de atuação/);
});

// Nota de adaptação: em output "static" o Astro materializa cada redirect como
// uma página HTML de meta-refresh no mesmo path da rota antiga (ex.:
// dist/sobre/index.html). O teste abaixo verifica o conteúdo do redirect, e
// não a ausência do arquivo.
test("rotas secundárias viram redirects noindex para âncoras da LP", async () => {
  assert.ok(await pathExists("index.html"));
  assert.ok(await pathExists("politica-de-privacidade/index.html"));

  const expectations = [
    ["sobre/index.html", "/#sobre"],
    ["atuacao/index.html", "/#atuacao"],
    ["atuacao/direito-civil/index.html", "/#atuacao"],
    ["atuacao/direito-trabalhista/index.html", "/#atuacao"],
    ["atuacao/direito-previdenciario/index.html", "/#atuacao"],
    ["contato/index.html", "/#como-comecar"],
    ["conteudos/index.html", "/"],
  ];

  for (const [pathname, target] of expectations) {
    const html = await readBuiltPage(pathname);
    assert.match(
      html,
      new RegExp(
        `http-equiv="refresh" content="0;url=${escapeRegExp(target)}"`,
      ),
      `${pathname} deve redirecionar para ${target}`,
    );
    assert.match(html, /name="robots" content="noindex"/, pathname);
  }
});

test("nenhum link interno aponta para rota removida", async () => {
  const htmlFiles = await listHtmlFiles();
  // Exclui as próprias páginas de redirect (meta-refresh) geradas pelo Astro.
  const pages = [];
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    if (!/http-equiv="refresh"/.test(html)) pages.push({ file, html });
  }
  assert.ok(pages.length >= 4, "build deve conter as páginas reais do site");

  for (const { file, html } of pages) {
    assert.doesNotMatch(html, /href="\/sobre\/"/, String(file));
    assert.doesNotMatch(html, /href="\/atuacao\//, String(file));
    assert.doesNotMatch(html, /href="\/contato\/"/, String(file));
    assert.doesNotMatch(html, /href="\/conteudos\/"/, String(file));
  }
});

test("publica somente o domínio canônico confirmado em URLs públicas", async () => {
  const publicFiles = [
    ...(await listHtmlFiles()),
    new URL("../dist/robots.txt", import.meta.url),
    new URL("../dist/sitemap-index.xml", import.meta.url),
    new URL("../dist/sitemap-0.xml", import.meta.url),
  ];

  for (const file of publicFiles) {
    const content = await readFile(file, "utf8");
    assert.doesNotMatch(content, /adriana-reis-advocacia\.example/);
    assert.doesNotMatch(
      content,
      /adrianareisadvocacia\.vercel\.app/,
      `${file} não pode publicar o host de preview como entidade principal`,
    );
  }

  const homepage = await readBuiltPage("index.html");
  assert.match(
    homepage,
    /<link rel="canonical" href="https:\/\/www\.dradrireisadvocacia\.com\.br\/">/,
  );
});

test("publica metadata Open Graph e Twitter completa com imagem canônica", async () => {
  const html = await readBuiltPage("index.html");
  const canonicalImage =
    "https://www.dradrireisadvocacia.com.br/images/brand/adriana-reis-logo-wine.png";

  assert.match(html, /property="og:title" content="[^"]+"/);
  assert.match(html, /property="og:description" content="[^"]+"/);
  assert.match(
    html,
    /property="og:url" content="https:\/\/www\.dradrireisadvocacia\.com\.br\/"/,
  );
  assert.match(
    html,
    new RegExp(`property="og:image" content="${canonicalImage}"`),
  );
  assert.match(html, /property="og:image:width" content="940"/);
  assert.match(html, /property="og:image:height" content="460"/);
  assert.match(
    html,
    /property="og:image:alt" content="Adriana Reis Advocacia"/,
  );
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:title" content="[^"]+"/);
  assert.match(html, /name="twitter:description" content="[^"]+"/);
  assert.match(
    html,
    new RegExp(`name="twitter:image" content="${canonicalImage}"`),
  );
  assert.match(
    html,
    /name="twitter:image:alt" content="Adriana Reis Advocacia"/,
  );
});

test("sitemap nativo lista somente a homepage indexável e robots aponta para ele", async () => {
  const sitemapIndex = await readBuiltPage("sitemap-index.xml");
  const sitemap = await readBuiltPage("sitemap-0.xml");
  const robots = await readBuiltPage("robots.txt");

  assert.match(
    sitemapIndex,
    /<loc>https:\/\/www\.dradrireisadvocacia\.com\.br\/sitemap-0\.xml<\/loc>/,
  );
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]),
    ["https://www.dradrireisadvocacia.com.br/"],
  );
  assert.match(
    robots,
    /Sitemap: https:\/\/www\.dradrireisadvocacia\.com\.br\/sitemap-index\.xml/,
  );
});

test("fotografia da seção Sobre não compete com a imagem LCP da hero", async () => {
  const html = await readBuiltPage("index.html");
  const aboutImage = html.match(
    /<img[^>]+alt="Adriana Reis em seu ambiente profissional"[^>]*>/,
  )?.[0];

  assert.ok(aboutImage);
  assert.match(aboutImage, /loading="lazy"/);
  assert.doesNotMatch(aboutImage, /fetchpriority="high"/);
});

test("homepage publica um único grafo JSON-LD factual e parseável", async () => {
  const html = await readBuiltPage("index.html");
  const scripts = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];

  assert.equal(scripts.length, 1);
  const graph = JSON.parse(scripts[0][1]);
  assert.equal(graph["@context"], "https://schema.org");
  assert.deepEqual(
    graph["@graph"].map((entity) => entity["@id"]),
    [
      "https://www.dradrireisadvocacia.com.br/#website",
      "https://www.dradrireisadvocacia.com.br/#webpage",
      "https://www.dradrireisadvocacia.com.br/#legal-service",
      "https://www.dradrireisadvocacia.com.br/#person",
    ],
  );
  assert.deepEqual(
    graph["@graph"].map((entity) => entity["@type"]),
    ["WebSite", "WebPage", "LegalService", "Person"],
  );
  assert.match(JSON.stringify(graph), /Adriana Rodrigues Reis de Andrade/);
  assert.match(JSON.stringify(graph), /OAB\/SP nº 533\.644/);

  const forbiddenProperties = [
    "aggregateRating",
    "review",
    "award",
    "sameAs",
    "email",
    "address",
    "openingHours",
    "priceRange",
    "alumniOf",
  ];
  for (const property of forbiddenProperties) {
    assert.ok(
      graph["@graph"].every((entity) => !(property in entity)),
      `JSON-LD não deve publicar ${property}`,
    );
  }
});

test("llms.txt v2 descreve somente recursos reais e é descoberto pela homepage", async () => {
  const html = await readBuiltPage("index.html");
  const llms = await readBuiltPage("llms.txt");
  const base = "https://www.dradrireisadvocacia.com.br/";

  assert.match(html, /<link rel="describedby" href="\/llms\.txt">/);
  assert.doesNotMatch(html, /rel="alternate"[^>]+text\/markdown/);
  assert.match(llms, /^# Adriana Reis Advocacia\n\n> /);
  for (const fragment of [
    "",
    "#direito-civil",
    "#direito-trabalhista",
    "#direito-previdenciario",
    "#sobre",
    "#duvidas",
    "#como-comecar",
  ]) {
    assert.match(llms, new RegExp(escapeRegExp(`${base}${fragment}`)));
  }
  assert.doesNotMatch(llms, /pol[ií]tica-de-privacidade/i);
  assert.doesNotMatch(llms, /adriana-reis-advocacia\.example|vercel\.app/);
});
