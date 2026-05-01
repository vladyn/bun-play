import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function askAi(question: string) {
    return ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: question,
    });
}