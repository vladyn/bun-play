import type { GenerateContentResponse } from "@google/genai";
import { askAi } from "./ask-ai.ts";
import { questions } from "./enums/questions.ts";
import { shuffle } from "./helpers/array.ts";

export const server: Bun.Server<undefined> = Bun.serve({
    port: 3000,

    async fetch(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const question = url.searchParams.get("q") || shuffle(questions)[0].text;

        if (!question) {
            return new Response("No question provided", { status: 400 });
        }

        const encoder = new TextEncoder();
        const responseStream: AsyncIterable<GenerateContentResponse> = await askAi(question);
        const iterator: AsyncIterator<GenerateContentResponse> = responseStream[Symbol.asyncIterator]();

        const stream = new ReadableStream({
            async pull(controller: ReadableStreamDefaultController):Promise<void> {
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