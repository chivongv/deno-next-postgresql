import { APIServer } from "./src/APIServer.ts";

console.log();

const PORT = Number(Deno.env.get("PORT")) || 5000;

const server = new APIServer({ hostname: "localhost", port: PORT });
server.start();
