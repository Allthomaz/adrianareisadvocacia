import { Composio } from "@composio/core";

const [command, ...args] = process.argv.slice(2);
const apiKey = process.env.COMPOSIO_API_KEY;
const userId = process.env.COMPOSIO_USER_ID;

if (!apiKey || !userId) {
  console.error(
    "Defina COMPOSIO_API_KEY e COMPOSIO_USER_ID em .env.local antes de continuar.",
  );
  process.exit(1);
}

const composio = new Composio({ apiKey });
const session = await composio.sessions.create(userId, {
  sandbox: { enable: false },
});

const printUsage = () => {
  console.log(`Uso:
  pnpm composio discover [descrição da tarefa]
  pnpm composio connect <toolkit>
  pnpm composio call <TOOL_SLUG> '<JSON>'`);
};

if (command === "discover") {
  const query =
    args.join(" ") ||
    "Remove the background from a portrait photo and return a transparent PNG";
  const result = await session.search({ query });

  console.log(`Session: ${session.sessionId}`);
  console.log("Ferramentas sugeridas:");
  for (const schema of Object.values(result.toolSchemas)) {
    console.log(`- ${schema.toolSlug} (${schema.toolkit})`);
    if (schema.description) console.log(`  ${schema.description}`);
  }

  console.log("Conexões:");
  for (const status of result.toolkitConnectionStatuses) {
    console.log(
      `- ${status.toolkit}: ${status.hasActiveConnection ? "ativa" : "necessária"}`,
    );
  }

  if (result.nextStepsGuidance.length) {
    console.log("Próximos passos:");
    result.nextStepsGuidance.forEach((step) => console.log(`- ${step}`));
  }
} else if (command === "connect") {
  const [toolkit] = args;
  if (!toolkit) {
    printUsage();
    process.exit(1);
  }

  const request = await session.authorize(toolkit);
  if (!request.redirectUrl) {
    throw new Error(`O toolkit ${toolkit} não retornou um Connect Link.`);
  }

  console.log(`Abra para conectar ${toolkit}:\n${request.redirectUrl}`);
  console.log("Aguardando autorização por até 5 minutos...");
  const account = await request.waitForConnection(300_000);
  console.log(`Conexão ativa: ${account.id}`);
} else if (command === "call") {
  const [toolSlug, rawArguments = "{}"] = args;
  if (!toolSlug) {
    printUsage();
    process.exit(1);
  }

  let toolArguments;
  try {
    toolArguments = JSON.parse(rawArguments);
  } catch {
    throw new Error("Os argumentos da ferramenta precisam ser um JSON válido.");
  }

  const result = await session.execute(toolSlug, toolArguments);
  if (result.error) throw new Error(result.error);
  if (!result.logId) {
    throw new Error("A chamada não retornou um logId do Composio.");
  }

  console.log(`Composio logId: ${result.logId}`);
  console.log(JSON.stringify(result.data, null, 2));
} else {
  printUsage();
  process.exit(command ? 1 : 0);
}

await composio.flush();
