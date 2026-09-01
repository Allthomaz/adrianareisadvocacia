import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { practiceAreas, site, whatsappUrl } from "../src/data/site.ts";
import { registerWebMcpTools } from "../src/scripts/webmcp-tools.ts";

const captureTools = async () => {
  const tools = [];
  const signals = [];
  await registerWebMcpTools({
    async registerTool(tool, options) {
      tools.push(tool);
      signals.push(options.signal);
    },
  });
  return { tools, signals };
};

test("registra exatamente as três tools informativas aprovadas", async () => {
  const { tools } = await captureTools();

  assert.deepEqual(
    tools.map((tool) => tool.name),
    [
      "get_practice_areas",
      "get_practice_area_information",
      "get_contact_options",
    ],
  );
  for (const tool of tools) {
    assert.deepEqual(tool.annotations, {
      readOnlyHint: true,
      untrustedContentHint: false,
    });
  }
});

test("lista as mesmas três áreas da fonte factual", async () => {
  const { tools } = await captureTools();
  const tool = tools.find((item) => item.name === "get_practice_areas");
  const result = await tool.execute(
    {},
    { signal: new AbortController().signal },
  );

  assert.deepEqual(result, {
    areas: practiceAreas.map((area) => ({
      id: area.slug.replace("direito-", ""),
      name: area.title,
      url: `${site.url}/#${area.slug}`,
    })),
  });
});

test("consulta uma área somente por enum fechado e retorna conteúdo publicado", async () => {
  const { tools } = await captureTools();
  const tool = tools.find(
    (item) => item.name === "get_practice_area_information",
  );

  assert.deepEqual(tool.inputSchema.properties.area.enum, [
    "civil",
    "trabalhista",
    "previdenciario",
  ]);
  assert.deepEqual(tool.inputSchema.required, ["area"]);
  assert.equal(tool.inputSchema.additionalProperties, false);

  const result = await tool.execute(
    { area: "civil" },
    { signal: new AbortController().signal },
  );
  assert.deepEqual(result, {
    id: "civil",
    name: practiceAreas[0].title,
    url: `${site.url}/#${practiceAreas[0].slug}`,
    introduction: practiceAreas[0].introduction,
    situations: practiceAreas[0].examples.map(({ title, description }) => ({
      title,
      description,
    })),
  });
  await assert.rejects(
    tool.execute(
      { area: "tributario" },
      { signal: new AbortController().signal },
    ),
    /rea de atuação inválida/,
  );
});

test("retorna o contato público sem acionar URL ou transmitir dados", async () => {
  const originalGlobals = {
    fetch: globalThis.fetch,
    window: globalThis.window,
    location: globalThis.location,
    localStorage: globalThis.localStorage,
    sessionStorage: globalThis.sessionStorage,
  };
  const forbidden = () => {
    throw new Error("side effect proibido");
  };
  Object.assign(globalThis, {
    fetch: forbidden,
    window: { open: forbidden },
    location: { href: "" },
    localStorage: { setItem: forbidden },
    sessionStorage: { setItem: forbidden },
  });

  try {
    const { tools } = await captureTools();
    const tool = tools.find((item) => item.name === "get_contact_options");
    const result = await tool.execute(
      {},
      { signal: new AbortController().signal },
    );

    assert.deepEqual(result, {
      options: [
        {
          type: "whatsapp",
          url: whatsappUrl,
          description: site.contact.description,
        },
      ],
    });
    assert.equal(globalThis.location.href, "");
  } finally {
    Object.assign(globalThis, originalGlobals);
  }
});

test("usa o abort signal de registro para permitir cleanup", async () => {
  const { signals } = await captureTools();
  assert.equal(signals.length, 3);
  assert.ok(signals.every((signal) => signal instanceof AbortSignal));
  assert.ok(signals.every((signal) => signal === signals[0]));
});

test("implementação das tools não contém primitivas de side effect", async () => {
  const source = await readFile(
    new URL("../src/scripts/webmcp-tools.ts", import.meta.url),
    "utf8",
  );
  const forbiddenCalls = [
    /window\.open\s*\(/,
    /location\.href\s*=/,
    /fetch\s*\(/,
    /form\.submit\s*\(/,
    /localStorage\.setItem\s*\(/,
    /sessionStorage\.setItem\s*\(/,
  ];

  for (const pattern of forbiddenCalls) assert.doesNotMatch(source, pattern);
});
