import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { after, before } from "node:test";

const previewUrl = "http://127.0.0.1:4333/";
let preview;
let nextDebugPort = 9400;

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const waitFor = async (check, message) => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const result = await check();
      if (result) return result;
    } catch {}
    await wait(100);
  }

  throw new Error(message);
};

before(async () => {
  preview = spawn(
    "pnpm",
    ["exec", "astro", "preview", "--host", "127.0.0.1", "--port", "4333"],
    { detached: true, stdio: "ignore" },
  );

  await waitFor(
    async () => (await fetch(previewUrl)).ok,
    "Astro preview não iniciou na porta 4333",
  );
});

after(() => {
  if (preview?.pid) {
    try {
      process.kill(-preview.pid, "SIGTERM");
    } catch {}
  }
});

const inspectParallax = async ({ width, height, reducedMotion = false }) => {
  const debugPort = nextDebugPort++;
  const profileDir = await mkdtemp(join(tmpdir(), "about-parallax-chrome-"));
  const browser = spawn(
    "/usr/bin/google-chrome",
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu=false",
      "--enable-webgl",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${profileDir}`,
      ...(reducedMotion ? ["--force-prefers-reduced-motion"] : []),
      "about:blank",
    ],
    { detached: true, stdio: "ignore" },
  );

  try {
    const targets = await waitFor(async () => {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
      const pages = await response.json();
      return pages.find((page) => page.type === "page");
    }, "Chrome não iniciou o protocolo de diagnóstico");
    const socket = new WebSocket(targets.webSocketDebuggerUrl);
    let nextMessageId = 0;
    const pending = new Map();
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      const resolve = pending.get(message.id);
      if (resolve) {
        pending.delete(message.id);
        resolve(message);
      }
    });
    await new Promise((resolve) =>
      socket.addEventListener("open", resolve, { once: true }),
    );
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const id = ++nextMessageId;
        pending.set(id, resolve);
        socket.send(JSON.stringify({ id, method, params }));
      });
    const evaluate = async () => {
      const response = await send("Runtime.evaluate", {
        expression: `JSON.stringify({
          state: document.querySelector("#about-parallax-frame")?.dataset.parallaxState,
          input: document.querySelector("#about-parallax-frame")?.dataset.parallaxInput,
          canvas: Boolean(document.querySelector("#about-parallax-frame canvas")),
          overflow: document.documentElement.scrollWidth > innerWidth
        })`,
        returnByValue: true,
      });
      return JSON.parse(response.result.result.value);
    };

    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", {
      url: `${previewUrl}?viewport=${width}x${height}${
        reducedMotion ? "-reduced" : ""
      }#about-parallax-frame`,
    });

    const state = await waitFor(async () => {
      const current = await evaluate();
      return reducedMotion
        ? current.state === "reduced" && current
        : current.state === "active" && current.canvas && current;
    }, "O parallax não alcançou o estado esperado no Chrome");
    socket.close();
    return state;
  } finally {
    if (browser.pid) {
      try {
        process.kill(-browser.pid, "SIGTERM");
        await Promise.race([
          new Promise((resolve) => browser.once("exit", resolve)),
          wait(2_000),
        ]);
      } catch {}
    }
    await rm(profileDir, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100,
    });
  }
};

test("ativa o canvas 2.5D quando a moldura entra na viewport desktop", async () => {
  const state = await inspectParallax({ width: 1440, height: 1000 });
  assert.equal(state.input, "scroll-pointer");
  assert.equal(state.canvas, true);
  assert.equal(state.overflow, false);
});

test("ativa no mobile somente pela rolagem e sem overflow", async () => {
  const state = await inspectParallax({ width: 390, height: 844 });
  assert.equal(state.input, "scroll");
  assert.equal(state.canvas, true);
  assert.equal(state.overflow, false);
});

test("movimento reduzido mantém fallback e não cria canvas animado", async () => {
  const state = await inspectParallax({
    width: 390,
    height: 844,
    reducedMotion: true,
  });
  assert.equal(state.canvas, false);
});
