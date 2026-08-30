import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import test from "node:test";

const readBuiltPage = (pathname) =>
  readFile(new URL(`../dist/${pathname}`, import.meta.url), "utf8");

const pathExists = (pathname) =>
  access(new URL(`../dist/${pathname}`, import.meta.url))
    .then(() => true)
    .catch(() => false);

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const listHtmlFiles = async (dir = new URL("../dist/", import.meta.url)) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dir);
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
  assert.match(html, /Primeiro eu preciso entender o seu caso por inteiro\./);
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
      new RegExp(`http-equiv="refresh" content="0;url=${escapeRegExp(target)}"`),
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
