import { describe, expect, test } from "bun:test";
import { createRequestHandler } from "./api.ts";

describe("API response formatting", () => {
    test("returns the model Markdown as safe browser-renderable HTML", async () => {
        const generate = async function* () {
            yield { text: "# Result\n\nThis is **formatted**." };
        };
        const handler = createRequestHandler(async () => generate());

        const response = await handler(new Request("http://localhost/?q=hello"));
        const html = await response.text();

        expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
        expect(response.headers.get("content-security-policy")).toContain("default-src 'none'");
        expect(response.headers.get("content-security-policy")).toContain("form-action 'self'");
        expect(html).toContain("<h1>Result</h1>");
        expect(html).toContain("<strong>formatted</strong>");
        expect(html).toContain('name="q" value="hello"');
    });
});
