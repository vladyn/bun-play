import { describe, expect, test } from "bun:test";
import { renderMarkdownDocument } from "./markdown.ts";

describe("renderMarkdownDocument", () => {
    test("renders common Markdown as a complete HTML document", () => {
        const html = renderMarkdownDocument("# Summary\n\n- **Fast**\n- Clear", "What is Bun?");

        expect(html).toContain("<!doctype html>");
        expect(html).toContain("<h1>Summary</h1>");
        expect(html).toContain("<li><strong>Fast</strong></li>");
        expect(html).toContain("<li>Clear</li>");
        expect(html).toContain('<form method="get" action="/">');
        expect(html).toContain('name="q"');
        expect(html).toContain('value="What is Bun?"');
        expect(html).toContain('<button type="submit">Ask</button>');
    });

    test("removes unsafe HTML and URL protocols", () => {
        const html = renderMarkdownDocument(
            '<script>alert("xss")</script>\n\n[unsafe](javascript:alert("xss"))',
        );

        expect(html).not.toContain("<script");
        expect(html).not.toContain("javascript:");
    });

    test("adds safe link attributes", () => {
        const html = renderMarkdownDocument("[Bun](https://bun.sh)");

        expect(html).toContain('href="https://bun.sh"');
        expect(html).toContain('target="_blank"');
        expect(html).toContain('rel="noopener noreferrer"');
    });

    test("escapes the persisted question before placing it in the input", () => {
        const html = renderMarkdownDocument("Answer", '\"><script>alert("xss")</script>');

        expect(html).toContain('value="&quot;&gt;&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"');
        expect(html).not.toContain('<input type="search" name="q" value=""><script>');
    });
});
