import { askAi } from "./ask-ai.ts";

const server = Bun.serve({
    port: 3000,

    async fetch(req) {
        const encoder = new TextEncoder();
        const responseStream = await askAi("what is the meaning of life?");
        const iterator = responseStream[Symbol.asyncIterator]();

        const stream = new ReadableStream({
            async pull(controller) {
                const { value, done } = await iterator.next();

                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(encoder.encode(value.text));
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "X-Content-Type-Options": "nosniff",
            },
        });
    },
});

console.log(`Listening on http://localhost:${server.port}`);