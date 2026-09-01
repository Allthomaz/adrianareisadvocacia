import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

test("Vercel publica somente os quatro headers de segurança aprovados", async () => {
  const config = JSON.parse(
    await readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  );
  const rootRule = config.headers.find((rule) => rule.source === "/(.*)");
  const headers = Object.fromEntries(
    rootRule.headers.map(({ key, value }) => [key, value]),
  );

  assert.deepEqual(headers, expectedHeaders);
  assert.ok(!("Content-Security-Policy" in headers));
  assert.ok(!("Origin-Agent-Cluster" in headers));
});

test("Cloudflare mantém headers equivalentes sem conflito", async () => {
  const source = await readFile(
    new URL("../public/_headers", import.meta.url),
    "utf8",
  );
  const blocks = source
    .trim()
    .split(/\n(?=\/)/)
    .map((block) => block.split("\n"));
  const rootBlock = blocks.find(([pattern]) => pattern.trim() === "/*");
  const headers = Object.fromEntries(
    rootBlock.slice(1).map((line) => {
      const [key, ...value] = line.trim().split(/:\s*/);
      return [key, value.join(": ")];
    }),
  );

  assert.deepEqual(headers, expectedHeaders);
  assert.doesNotMatch(source, /Content-Security-Policy|Origin-Agent-Cluster/i);
});
