import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  allowedEventNames,
  trackEvent,
} from "../src/scripts/analytics-events.ts";

test("aceita somente os eventos próprios aprovados", () => {
  assert.deepEqual(allowedEventNames, ["whatsapp_click", "cta_click"]);
});

test("falha do fornecedor não interrompe o clique", () => {
  assert.doesNotThrow(() =>
    trackEvent(
      {
        name: "whatsapp_click",
        properties: { placement: "hero", label: "Falar no WhatsApp" },
      },
      () => {
        throw new Error("analytics indisponível");
      },
    ),
  );
});

test("imagem social usa fotografia real e dimensões sociais", async () => {
  const image = fileURLToPath(
    new URL("../public/og-adriana-reis.jpg", import.meta.url),
  );
  const metadata = await sharp(image).metadata();

  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.equal(metadata.format, "jpeg");
  const { size } = await stat(image);
  assert.ok(size < 500_000, `imagem possui ${size} bytes`);
});

test("não instala fornecedores de analytics fora do escopo", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const packages = Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  });

  assert.ok(packages.includes("@vercel/analytics"));
  assert.ok(packages.includes("@vercel/speed-insights"));
  assert.ok(!packages.some((name) => /google-analytics|gtag|tag-manager|umami/i.test(name)));
  assert.ok(!packages.includes("@microsoft/clarity"));
});
