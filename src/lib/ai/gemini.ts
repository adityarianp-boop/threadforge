import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}
