import { practiceAreas, site, whatsappUrl } from "../data/site";

type ToolExecutionOptions = { signal: AbortSignal };

type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: {
    readOnlyHint: true;
    untrustedContentHint: false;
  };
  execute: (
    input: Record<string, unknown>,
    options: ToolExecutionOptions,
  ) => Promise<unknown>;
};

export type WebMcpModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options: { signal: AbortSignal },
  ) => Promise<undefined> | Promise<void>;
};

const annotations = {
  readOnlyHint: true,
  untrustedContentHint: false,
} as const;

const areaEntries = practiceAreas.map((area) => ({
  id: area.slug.replace("direito-", ""),
  source: area,
}));

const areaIds = areaEntries.map(({ id }) => id);

export async function registerWebMcpTools(modelContext: WebMcpModelContext) {
  const registrationController = new AbortController();
  const registrationOptions = { signal: registrationController.signal };

  const tools: WebMcpTool[] = [
    {
      name: "get_practice_areas",
      title: "Consultar áreas de atuação",
      description:
        "Retorna as áreas de atuação publicadas nesta página, com nome, identificador e URL. Não oferece aconselhamento jurídico e não altera a página.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations,
      execute: async () => ({
        areas: areaEntries.map(({ id, source }) => ({
          id,
          name: source.title,
          url: `${site.url}/#${source.slug}`,
        })),
      }),
    },
    {
      name: "get_practice_area_information",
      title: "Consultar informações de uma área",
      description:
        "Retorna somente informações publicadas sobre uma das três áreas de atuação. Não interpreta casos, não avalia direitos e não oferece aconselhamento jurídico.",
      inputSchema: {
        type: "object",
        properties: {
          area: {
            type: "string",
            enum: areaIds,
          },
        },
        required: ["area"],
        additionalProperties: false,
      },
      annotations,
      execute: async (input) => {
        const entry = areaEntries.find(({ id }) => id === input.area);
        if (!entry) throw new TypeError("Área de atuação inválida.");

        return {
          id: entry.id,
          name: entry.source.title,
          url: `${site.url}/#${entry.source.slug}`,
          introduction: entry.source.introduction,
          situations: entry.source.examples.map(({ title, description }) => ({
            title,
            description,
          })),
        };
      },
    },
    {
      name: "get_contact_options",
      title: "Consultar opções de contato",
      description:
        "Retorna os meios públicos de contato exibidos nesta página. Não abre links, não envia mensagens, não transmite dados e não cria atendimento.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations,
      execute: async () => ({
        options: [
          {
            type: "whatsapp",
            url: whatsappUrl,
            description: site.contact.description,
          },
        ],
      }),
    },
  ];

  await Promise.all(
    tools.map((tool) => modelContext.registerTool(tool, registrationOptions)),
  );

  return () => registrationController.abort();
}
