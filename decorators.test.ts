import { expect, test, describe } from "bun:test";
import { Example } from "./decorators.ts";

describe("Example", () =>{
    test("greet should log and say hello", () => {
        const example = new Example();
        // The method logs to the console and returns undefined.
        // We verify it executes without error in the describe block.
        expect(() => example.greet("world")).not.toThrow();
    });
});
