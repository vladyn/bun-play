import { askAi } from "./ask-ai.ts";
import { questions } from "./enums/questions.ts";
import { shuffle } from "./helpers/array.ts";
import { renderMarkdownDocument } from "./markdown.ts";

type AiChunk = { text?: string };
type GenerateMarkdown = (question: string) => Promise<AsyncIterable<AiChunk>>;

export function createRequestHandler(generate: GenerateMarkdown = askAi) {
    return async function handleRequest(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const question = url.searchParams.get("q") || shuffle(questions)[0]?.text;

        if (!question) {
            return new Response("No question provided", { status: 400 });
        }

        const responseStream = await generate(question);
        let markdown = "";

        for await (const chunk of responseStream) {
            markdown += chunk.text ?? "";
        }

        return new Response(renderMarkdownDocument(markdown), {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
                "X-Content-Type-Options": "nosniff",
            },
        });
    };
}
