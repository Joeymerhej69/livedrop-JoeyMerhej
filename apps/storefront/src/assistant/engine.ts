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
  // detect order id
  const idMatch = input.match(/([A-Z0-9]{10,})/i)
  let orderPart: string | null = null
  let orderStatus = null

  if (idMatch) {
    const id = idMatch[1].toUpperCase()
    orderPart = id
    orderStatus = await getOrderStatus(id)
    if (!orderStatus) {
      return {
        text: `Sorry — there is no order with ID ${last4(orderPart)}.`,
        citation: null,
      }
    }
  }

  // score QAs
  const qas: QA[] = ground as QA[]
  const scored = qas.map((qa) => ({ qa, score: scoreQuery(input, qa) }))
  scored.sort((a, b) => b.score - a.score)

  const best = scored[0]

  // If no QA matches confidently, refuse
  const confidence = best ? best.score / Math.max(1, tokenize(input).length) : 0
  if (confidence < 0.3) {
    // If order id present, respond with order status only (no citation)
    if (orderPart && orderStatus) {
      return {
        text: `Order ${last4(orderPart)} is currently ${orderStatus.status}. ${
          orderStatus.carrier ? `Carrier: ${orderStatus.carrier}. ETA: ${orderStatus.eta}.` : ''
        }`,
        citation: null,
      }
    }

    // Refuse to answer unrelated questions
    return {
      text: "I'm sorry — I can't answer that from our Q&A. Please contact support.",
      citation: null,
    }
  }

  // prepare answer, include order status if present
  let answerText = best.qa.answer
  if (orderPart && orderStatus) {
    answerText += `\n\nOrder ${last4(orderPart)} status: ${orderStatus.status}.`
  }

  return { text: answerText, citation: best.qa.qid }
}

export type { QA }
