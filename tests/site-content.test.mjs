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
