# bun-play

A small Bun and TypeScript playground for asking Google Gemini questions in a browser. The server sends a question to Gemini, collects the streamed response, renders its Markdown as sanitized HTML, and shows a form for asking another question.

## Requirements

- [Bun](https://bun.sh/)
- A Google Gemini API key, available as `GEMINI_API_KEY`

## Run locally

Install dependencies:

```sh
bun install
```

Set the API key in your shell, then start the server:

```sh
export GEMINI_API_KEY="your-api-key"
bun run start
```

Open <http://localhost:3000>. A request to `/` picks one of the sample questions in `enums/questions.ts`; submitting the form or visiting `/?q=Your%20question` asks your own question. Each request waits for the Gemini response and returns an HTML page. The server uses the `gemini-3-flash-preview` model configured in `ask-ai.ts`.

The separate `index.ts` file is a playground script: it starts the server, demonstrates a method decorator, and prints a sample Gemini response to the terminal. Use `bun run index.ts` if you want to run that demo.

## Tests

```sh
bun test
bun test --coverage
```

The request-handler tests inject a fake response generator, so they do not need an API key or make Gemini requests. The coverage thresholds used by the project's quality gate are in `.coverage-thresholds.json`.

## Project layout

- `server.ts` starts the Bun HTTP server on port 3000.
- `api.ts` handles requests, selects a sample question when `q` is absent, and collects the Gemini response.
- `ask-ai.ts` calls the Gemini API using `GEMINI_API_KEY`.
- `markdown.ts` renders and sanitizes the response before building the HTML page.
- `enums/questions.ts` contains the sample questions.
- `index.ts`, `decorators.ts`, and `explain-ai.ts` contain the standalone playground demo.

## License

See [LICENSE](LICENSE).
