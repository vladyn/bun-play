import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const allowedTags = [
    "a", "blockquote", "br", "code", "del", "em", "h1", "h2", "h3",
    "h4", "h5", "h6", "hr", "li", "ol", "p", "pre", "strong",
    "table", "tbody", "td", "th", "thead", "tr", "ul",
];

function escapeAttribute(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

export function renderMarkdownDocument(markdown: string, question = ""): string {
    const rendered = marked.parse(markdown, {
        async: false,
        gfm: true,
        breaks: true,
    });

    const content = sanitizeHtml(rendered, {
        allowedTags,
        allowedAttributes: {
            a: ["href", "title", "target", "rel"],
            code: ["class"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        transformTags: {
            a: (_tagName, attributes) => ({
                tagName: "a",
                attribs: {
                    ...attributes,
                    target: "_blank",
                    rel: "noopener noreferrer",
                },
            }),
        },
    });

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AI response</title>
    <style>
        :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
        body { margin: 0; background: Canvas; color: CanvasText; }
        main { width: min(52rem, calc(100% - 2rem)); margin: 3rem auto; line-height: 1.65; }
        form { display: flex; gap: .65rem; margin-bottom: 2rem; }
        input { min-width: 0; flex: 1; padding: .7rem .85rem; border: 1px solid GrayText; border-radius: .45rem; font: inherit; background: Canvas; color: CanvasText; }
        button { padding: .7rem 1.1rem; border: 0; border-radius: .45rem; background: ButtonText; color: ButtonFace; font: inherit; font-weight: 600; cursor: pointer; }
        button:hover { opacity: .85; }
        h1, h2, h3 { line-height: 1.2; margin-top: 1.8em; }
        a { color: LinkText; }
        pre { overflow-x: auto; padding: 1rem; border-radius: .5rem; background: color-mix(in srgb, CanvasText 8%, Canvas); }
        code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
        :not(pre) > code { padding: .15em .35em; border-radius: .25rem; background: color-mix(in srgb, CanvasText 8%, Canvas); }
        blockquote { margin-left: 0; padding-left: 1rem; border-left: .25rem solid GrayText; color: GrayText; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: .55rem .7rem; border: 1px solid GrayText; text-align: left; }
    </style>
</head>
<body>
    <main>
        <form method="get" action="/">
            <input type="search" name="q" value="${escapeAttribute(question)}" aria-label="Question" placeholder="Ask a question" required>
            <button type="submit">Ask</button>
        </form>
        <article>${content}</article>
    </main>
</body>
</html>`;
}
