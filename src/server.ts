import { createServer } from "./createServer";

async function main() {
  try {
    const server = await createServer();
    await server.start();

    // eslint-disable-next-line no-inner-declarations
    async function shutdown() {
      await server.stop();
      process.exit(0);
    }

    process.on("SIGTERM", shutdown);
    process.on("SIGQUIT", shutdown);
  } catch (error) {
    process.exit(1);
  }
}
main();
