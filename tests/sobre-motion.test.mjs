import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import test, { after, before } from "node:test";

const execFileAsync = promisify(execFile);
const previewUrl = "http://127.0.0.1:4333/sobre/";
let preview;

before(async () => {
  preview = spawn(
    "pnpm",
    ["exec", "astro", "preview", "--host", "127.0.0.1", "--port", "4333"],
    { detached: true, stdio: "ignore" },
  );

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error("Astro preview não iniciou na porta 4333");
});

after(() => {
  if (preview?.pid) process.kill(-preview.pid, "SIGTERM");
});

const dumpDom = async (extraFlags = []) => {
  const { stdout } = await execFileAsync(
    "/usr/bin/google-chrome",
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--virtual-time-budget=2500",
      ...extraFlags,
      "--dump-dom",
      previewUrl,
    ],
    { maxBuffer: 10 * 1024 * 1024 },
  );

  return stdout;
};

test("ativa a composição animada e transforma a fotografia", async () => {
  const html = await dumpDom();
  const photo =
    html.match(/<div class="about-profile__photo"[^>]*>/)?.[0] ?? "";

  assert.match(html, /data-motion-state="active"/);
  assert.match(photo, /style="[^"]*transform:/);
});

test("ativa o parallax reduzido na composição mobile", async () => {
  const html = await dumpDom(["--window-size=390,844"]);
  const photo =
    html.match(/<div class="about-profile__photo"[^>]*>/)?.[0] ?? "";

  assert.match(html, /data-motion-state="active"/);
  assert.match(photo, /style="[^"]*transform:/);
});

test("movimento reduzido entrega o estado final sem transformar a fotografia", async () => {
  const html = await dumpDom(["--force-prefers-reduced-motion"]);
  const photo =
    html.match(/<div class="about-profile__photo"[^>]*>/)?.[0] ?? "";

  assert.match(html, /data-motion-state="reduced"/);
  assert.doesNotMatch(photo, /style=/);
});
