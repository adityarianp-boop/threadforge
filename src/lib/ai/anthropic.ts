import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const model = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}
