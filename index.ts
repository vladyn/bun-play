import { Example } from "./decorators";
import { explainAi } from "./explain-ai";
import { server } from "./server.ts";
server;
new Example().greet("world");

try {
    await explainAi("Describe the Fintech business");
} catch (error) {
    console.error("Failed to fetch AI response:", error);
}
