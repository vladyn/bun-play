import { createRequestHandler } from "./api.ts";

export const server: Bun.Server<undefined> = Bun.serve({
    port: 3000,

    fetch: createRequestHandler(),
});

console.log(`Listening on http://localhost:${server.port}`);
