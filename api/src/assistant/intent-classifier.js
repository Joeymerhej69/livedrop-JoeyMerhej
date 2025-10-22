// /apps/api/src/assistant/intent-classifier.js
export function classifyIntent(query) {
  const q = query.toLowerCase().trim();

  // 🚨 Toxic / abuse
  if (/\b(kill|hate|stupid|idiot|die|dumb|curse)\b/.test(q)) return "violation";

  const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(q);
  const hasOrderId = /[a-f0-9]{10,}/i.test(q);
  const trackWords =
    /\b(track|tracking|where.*order|status of (my )?order|order status)\b/.test(
      q
    );

  // ✅ If email or tracking details → treat as order lookup
  if (hasEmail || hasOrderId || trackWords) return "order_status";

  // ✅ Policy-related
  if (
    /\b(return|refund|exchange|cancel|modify|warranty|guarantee|policy|shipping|delivery|privacy|security|payment|price|discount|coupon|loyalty|support|hours|contact|help|store|warranty|tax|data|gift|account)\b/.test(
      q
    )
  )
    return "policy_question";

  // 🛍️ Product search
  if (
    /\b(find|show|buy|looking for|recommend|product|item|available)\b/.test(q)
  )
    return "product_search";

  // 😞 Complaint
  if (
    /\b(broken|late|problem|angry|missing|defect|damaged|not working)\b/.test(q)
  )
    return "complaint";

  // 💬 Chitchat
  if (/\b(hi|hello|hey|thanks?|how are you|who are you)\b/.test(q))
    return "chitchat";

  return "off_topic";
}
