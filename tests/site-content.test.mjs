import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readBuiltPage = (pathname) =>
  readFile(new URL(`../dist/${pathname}`, import.meta.url), "utf8");

test("publica identificação profissional e localidade confirmadas no rodapé", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /Adriana Rodrigues Reis de Andrade/);
  assert.match(html, /OAB\/SP nº 533\.644/);
  assert.match(html, /São Roque e região/);
});

test("a homepage conduz o resumo institucional para a página Sobre", async () => {
  const html = await readBuiltPage("index.html");

  assert.match(html, /Antes da estratégia, vem a compreensão do caso\./);
  assert.match(html, /href="\/sobre\/"[^>]*>\s*Conheça Adriana/);
});

test("a página Sobre publica o método, a citação e as credenciais aprovadas", async () => {
  const html = await readBuiltPage("sobre/index.html");

  assert.match(
    html,
    /<h1[^>]*>\s*Compreender o caso por completo precede a definição da estratégia jurídica\.\s*<\/h1>/,
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
});

test("a página Sobre usa fotografia responsiva e CTA centralizado", async () => {
  const html = await readBuiltPage("sobre/index.html");

  assert.match(html, /<picture/);
  assert.match(html, /alt="Adriana Reis em seu ambiente profissional"/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /href="https:\/\/wa\.me\/5511933535801/);
  assert.match(html, /Apresente sua situação/);
});

test("a página Sobre não publica alegações vedadas ou fatos recusados", async () => {
  const html = (await readBuiltPage("sobre/index.html")).toLowerCase();

  assert.doesNotMatch(html, /especialista|especializada|garantia de resultado/);
  assert.doesNotMatch(html, /ano de início|tempo de atuação/);
});
