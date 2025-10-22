// /apps/storefront/src/assistant/engine.ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Send user message to backend assistant
 */
export async function askAssistant(message: string) {
  try {
    const res = await fetch(`${API_BASE}/assistant/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message }),
    });

    if (!res.ok) throw new Error("Failed to get response");
    return await res.json();
  } catch (err) {
    console.error("Assistant API error:", err);
    return {
      text: "Sorry, I’m having trouble connecting to support right now.",
      intent: "error",
    };
  }
}
