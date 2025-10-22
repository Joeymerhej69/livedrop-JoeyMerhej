import ground from './ground-truth.json'
import { getOrderStatus } from '../lib/api'
import { last4 } from '../lib/format'

type QA = { qid: string; category: string; question: string; answer: string }

function tokenize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function scoreQuery(q: string, qa: QA) {
  const qt = tokenize(q)
  const kt = tokenize(qa.question + ' ' + qa.category)
  let score = 0
  for (const w of qt) if (kt.includes(w)) score++
  return score
}

export async function answerQuestion(input: string) {
  // 🔍 Detect order ID (Mongo-style alphanumeric, 10+ chars)
  const idMatch = input.match(/([a-f0-9]{10,})/i)
  let orderPart: string | null = null
  let orderStatus: any = null

  if (idMatch) {
    const id = idMatch[1]
    orderPart = id
    orderStatus = await getOrderStatus(id)

    // If not found or invalid
    if (!orderStatus || !orderStatus.status) {
      return {
        text: `❌ Sorry — no order found with ID ${last4(orderPart)}.`,
        citation: null,
      }
    }
  }

  // 💡 Score Q&A pairs from ground-truth.json
  const qas: QA[] = ground as QA[]
  const scored = qas.map((qa) => ({ qa, score: scoreQuery(input, qa) }))
  scored.sort((a, b) => b.score - a.score)

  const best = scored[0]
  const confidence = best ? best.score / Math.max(1, tokenize(input).length) : 0

  // 🧠 If confidence is low (not a known FAQ)
  if (confidence < 0.3) {
    // ✅ If user asked for order ID, reply only with status
    if (orderPart && orderStatus) {
      return {
        text: `📦 Order ${last4(orderPart)} is currently **${orderStatus.status.toUpperCase()}**.`,
        citation: null,
      }
    }

    // ❓ Otherwise, default fallback
    return {
      text: "I'm sorry — I can't answer that from our Q&A. Please contact support.",
      citation: null,
    }
  }

  // 🧾 If we have a relevant FAQ answer
  let answerText = best.qa.answer
  if (orderPart && orderStatus) {
    answerText += `\n\n📦 Order ${last4(orderPart)} status: **${orderStatus.status.toUpperCase()}**.`
  }

  return { text: answerText, citation: best.qa.qid }
}

export type { QA }
