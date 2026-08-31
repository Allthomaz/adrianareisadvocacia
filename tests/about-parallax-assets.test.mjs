import assert from "node:assert/strict";
import { access, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

const assets = {
  background: new URL(
    "../src/assets/images/about-parallax/background.png",
    import.meta.url,
  ),
  subject: new URL(
    "../src/assets/images/about-parallax/adriana-subject.png",
    import.meta.url,
  ),
  foreground: new URL(
    "../src/assets/images/about-parallax/foreground.png",
    import.meta.url,
  ),
};

test("publica três camadas 2.5D alinhadas em 1024 por 1536", async () => {
  for (const url of Object.values(assets)) {
    await access(url);
    const path = fileURLToPath(url);
    const metadata = await sharp(path).metadata();
    assert.equal(metadata.width, 1024);
    assert.equal(metadata.height, 1536);
    assert.equal(metadata.format, "png");
    assert.ok((await stat(path)).size < 4 * 1024 * 1024);
  }
});

test("retrato e primeiro plano preservam transparência real", async () => {
  assert.equal(
    (await sharp(fileURLToPath(assets.subject)).metadata()).hasAlpha,
    true,
  );
  assert.equal(
    (await sharp(fileURLToPath(assets.foreground)).metadata()).hasAlpha,
    true,
  );
});
