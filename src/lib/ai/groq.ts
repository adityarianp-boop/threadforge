import "server-only";
import Groq from "groq-sdk";

export const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
}
