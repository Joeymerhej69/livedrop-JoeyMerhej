import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { classifyIntent } from "./intent-classifier.js";
import { setupFunctionRegistry } from "./function-registry.js";

const registry = setupFunctionRegistry();

// --- Load assistant config + knowledge base ---
const yamlPath = path.resolve("../docs/prompts.yaml");
const kbPath = path.resolve("../docs/ground-truth.json");

const assistantProfile = yaml.load(fs.readFileSync(yamlPath, "utf8"));
const policies = JSON.parse(fs.readFileSync(kbPath, "utf8"));

// --- Helper functions for smarter keyword matching ---
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "to",
  "of",
  "in",
  "on",
  "for",
  "and",
  "or",
  "but",
  "do",
  "does",
  "did",
  "how",
  "what",
  "when",
  "where",
  "why",
  "which",
  "can",
  "i",
  "you",
  "we",
  "me",
  "my",
  "your",
  "our",
  "it",
  "with",
  "about",
  "please",
  "tell",
  "me",
]);

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywords(s) {
  return normalize(s)
    .split(" ")
    .filter((w) => w && !STOP_WORDS.has(w));
}

function bigrams(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length - 1; i++)
    out.push(tokens[i] + " " + tokens[i + 1]);
  return out;
}

// Category keyword hints for context boosting
const CATEGORY_HINTS = {
  returns: ["return", "refund", "exchange", "rma"],
  shipping: ["ship", "shipping", "delivery", "carrier", "track", "tracking"],
  warranty: [
    "warranty",
    "guarantee",
    "defect",
    "repair",
    "replace",
    "coverage",
    "claim",
  ],
  payments: [
    "payment",
    "pay",
    "card",
    "credit",
    "debit",
    "paypal",
    "apple",
    "google",
  ],
  privacy: ["privacy", "data", "personal", "gdpr", "ccpa", "delete"],
  orders: ["order", "cancel", "modify", "status"],
  security: ["security", "secure", "ssl", "encryption", "2fa", "two-factor"],
  support: ["support", "help", "contact", "agent", "hours"],
  rewards: ["reward", "points", "loyalty", "promo", "code", "coupon", "gift"],
  pricing: ["price", "match", "discount"],
  general: ["store", "shoplite"],
};

function categoryBoost(query, qaCategory) {
  const hints = CATEGORY_HINTS[qaCategory] || [];
  return hints.some((h) => query.includes(h)) ? 1 : 0;
}

function scoreQA(userQuery, qaQuestion, qaCategory) {
  const qTokens = keywords(userQuery);
  const aTokens = keywords(qaQuestion);

  const setA = new Set(aTokens);
  let overlap = 0;
  for (const t of qTokens) if (setA.has(t)) overlap++;

  const qB = new Set(bigrams(qTokens));
  const aB = new Set(bigrams(aTokens));
  let bi = 0;
  for (const b of qB) if (aB.has(b)) bi++;

  const norm = Math.max(1, aTokens.length);
  const base = overlap / norm + bi * 0.5;
  const boost = categoryBoost(userQuery, qaCategory) * 2;

  return base + boost;
}

// --- Main Assistant Logic ---
export async function runAssistant(query) {
  const intent = classifyIntent(query);
  const functionsCalled = [];
  let text = "";
  let citations = [];

  if (intent === "policy_question") {
    const userQ = normalize(query);

    // ✅ Try exact question match first
    const exact = policies.find((p) => normalize(p.question) === userQ);
    if (exact) {
      return {
        text: `${exact.answer} [${exact.id}]`,
        intent,
        citations: [exact.id],
        functionsCalled,
        assistant: assistantProfile.assistant.name,
      };
    }

    // ✅ Try partial / contains match (helps when user paraphrases)
    const partial = policies.find((p) =>
      userQ.includes(normalize(p.question.split(" ")[0]))
    );
    if (partial) {
      return {
        text: `${partial.answer} [${partial.id}]`,
        intent,
        citations: [partial.id],
        functionsCalled,
        assistant: assistantProfile.assistant.name,
      };
    }

    // ✅ Fallback: scoring-based (the one you already have)
    const detectedCategory = Object.entries(CATEGORY_HINTS).find(([, kws]) =>
      kws.some((k) => userQ.includes(k))
    )?.[0];

    const candidates = detectedCategory
      ? policies.filter((p) => p.category === detectedCategory)
      : policies;

    const scored = candidates.map((p) => ({
      p,
      score: scoreQA(userQ, p.question, p.category),
    }));

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    if (best && best.score > 0.2) {
      text = `${best.p.answer} [${best.p.id}]`;
      citations.push(best.p.id);
    } else {
      text = "I’m not sure about that policy — please check our Help Center.";
    }
  }

  // 🚚 2. Order Status
  else if (intent === "order_status") {
    const idMatch = query.match(/([a-f0-9]{10,})/i);
    if (idMatch) {
      const orderId = idMatch[1];
      const result = await registry.execute("getOrderStatus", { orderId });
      functionsCalled.push({ name: "getOrderStatus" });

      if (!result.found) {
        text = `❌ No order found with ID ${orderId}.`;
      } else {
        text = `📦 Order ${orderId} is currently **${result.status.toUpperCase()}**.`;
        if (result.carrier) text += ` Carrier: ${result.carrier}.`;
        if (result.eta)
          text += ` ETA: ${new Date(result.eta).toLocaleDateString()}.`;
      }
    } else {
      text = "Please provide your order ID so I can check it for you.";
    }
  }

  // 🛍️ 3. Product Search
  else if (intent === "product_search") {
    const qMatch = query.match(/"(.*?)"|'(.*?)'|find (.*)/i);
    const searchTerm = qMatch ? qMatch[1] || qMatch[2] || qMatch[3] : query;
    const products = await registry.execute("searchProducts", {
      query: searchTerm,
    });
    functionsCalled.push({ name: "searchProducts" });

    if (!products.length) text = `No products found matching “${searchTerm}”.`;
    else {
      text =
        "Here are some products I found:\n" +
        products.map((p) => `• ${p.name} — $${p.price}`).join("\n");
    }
  }

  // 😞 4. Complaints
  else if (intent === "complaint") {
    text =
      "I’m sorry for the inconvenience. Please share your order ID and what went wrong, and I’ll help immediately.";
  }

  // 💬 5. Chitchat
  else if (intent === "chitchat") {
    text =
      "Hey there 👋 I'm Aria from ShopLite Support! How can I assist you today?";
  }

  // 🚫 6. Violations
  else if (intent === "violation") {
    text = "I can’t continue this conversation. Please keep things respectful.";
  }

  // ❓ 7. Off-topic
  else {
    text =
      "I’m not sure about that. I can help with orders, products, or store policies.";
  }

  return {
    text,
    intent,
    citations,
    functionsCalled,
    assistant: assistantProfile.assistant.name,
  };
}
