import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function explainAi(question: string) {
    const response = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: question,
    });

    for await (const chunk of response) {
        answer(chunk);
    }
}

const answer = (chunk: GenerateContentResponse) => {
    console.log(chunk.text);
    return chunk.text;
}
