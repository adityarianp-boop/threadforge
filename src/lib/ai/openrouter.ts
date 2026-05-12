import "server-only";

export const model = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3-haiku";

export function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    baseURL: "https://openrouter.ai/api/v1"
  };
}
