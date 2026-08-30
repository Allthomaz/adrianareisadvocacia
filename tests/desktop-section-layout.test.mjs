import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(
  new URL("../src/styles/global.css", import.meta.url),
  "utf8",
);

test("compacta a abertura de Atuação e amplia seu título somente no desktop", () => {
  assert.match(
    css,
    /@media \(min-width: 48rem\)[\s\S]*?\.practice-overview \{\s*padding-block: clamp\(3\.5rem, 5vw, 5\.5rem\);/,
  );
  assert.match(
    css,
    /@media \(min-width: 48rem\)[\s\S]*?\.practice-overview h2 \{\s*max-width: 16ch;/,
  );
});

test("compacta o CTA e libera sua composição na largura desktop", () => {
  assert.match(
    css,
    /@media \(min-width: 48rem\)[\s\S]*?\.contact-callout \{\s*padding-block: clamp\(5\.5rem, 7vw, 7rem\) clamp\(3\.5rem, 5vw, 5rem\);/,
  );
  assert.match(
    css,
    /\.contact-callout__inner > div \{[\s\S]*?grid-column: 1 \/ -1;[\s\S]*?grid-template-columns: minmax\(0, 1\.35fr\) minmax\(20rem, 0\.85fr\);/,
  );
  assert.doesNotMatch(
    css,
    /\.first-steps__header,\s*\.contact-callout__inner \{\s*grid-template-columns: 0\.7fr 1\.3fr;/,
  );
});
