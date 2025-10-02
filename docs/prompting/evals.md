# RAG System Evaluation

This document defines a compact smoke-test plan for the RAG notebook + client. It maps a small set of retrieval and response checks to the ground-truth QA in `ground-truth-qa.md` and the knowledge base in `knowledge-base.md`.

## How to run (quick)

- In Colab: run the evaluation / smoke-test cell included in `notebooks/llm-deployment.ipynb` (it reads `docs/prompting/ground-truth-qa.md`).
- Locally: start the RAG API (if available) and run `src/chat-interface.py --single "<question>"` for individual checks. The CLI writes JSONL logs by default.

## Retrieval Quality Tests (10 tests)

Each retrieval test issues the question from the corresponding ground-truth entry and verifies that the top-N retrieved documents include the expected document(s) by title and contain relevant passages.

| Test ID | Question (ground-truth) | Expected Document(s)                              | Pass Criteria (strict)                                                                                   |
| ------- | ----------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| R01     | Q01                     | Document 1: Shoplite User Registration Process    | Top-3 contains Document 1 title and at least one passage mentioning "business verification" or "tax ID". |
| R02     | Q02                     | Document 2: Shoplite Shopping Cart Features       | Top-3 contains Document 2 title and mentions cart persistence or cookie merging.                         |
| R03     | Q03                     | Document 3: Shoplite Checkout and Payment Flow    | Top-3 contains Document 3 title and passages about PCI or tokenization.                                  |
| R04     | Q04                     | Document 4: Shoplite Shipping and Delivery System | Top-3 contains Document 4 title and shipping/tracking terms.                                             |
| R05     | Q05                     | Document 5: Shoplite Order Management             | Top-3 contains Document 5 title and payout/net-7 references.                                             |
| R06     | Q06                     | Document 6: Shoplite Returns and Refunds Policy   | Top-3 contains Document 6 and mentions "30-day return" or "return authorization".                        |
| R07     | Q07                     | Document 7: Shoplite Product Listing Guidelines   | Top-3 contains Document 7 title and listing guidance (images/descriptions).                              |
| R08     | Q08                     | Document 8: Shoplite Vendor Dashboard             | Top-3 contains Document 8 title and dashboard/ordering tools.                                            |
| R09     | Q09                     | Document 9: Shoplite Inventory Management         | Top-3 contains Document 9 title and references "REST API" or "webhooks".                                 |
| R10     | Q10                     | Document 10: Shoplite Buyer Protection Program    | Top-3 contains Document 10 title and buyer protection/returns language.                                  |

Notes:

- Use top-3 or top-5 retrieval to allow some variation in ranking.
- For automated scoring, check retrieved document titles and scan for required keywords from `ground-truth-qa.md`.

## Response Quality Tests (15 tests)

These tests validate that the generated response satisfies required keywords, avoids forbidden phrases, includes a direct answer, and cites sources when appropriate.

| Test ID | Ground-truth Q | Required keywords (must appear)                                           | Forbidden terms (must not appear)                | Expected behavior                |
| ------- | -------------- | ------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------- |
| Q01     | Q01            | ["seller registration", "business verification", "2-3 business days"]     | ["instant approval", "no verification required"] | Direct answer citing Document 1  |
| Q02     | Q02            | ["persisted across devices", "cookies", "merged at login"]                | ["session-only"]                                 | Direct answer citing Document 2  |
| Q03     | Q03            | ["PCI-compliant", "tokenized", "fraud prevention"]                        | ["stores card numbers"]                          | Direct answer citing Document 3  |
| Q04     | Q04            | ["carrier APIs", "tracking", "shipping cost calculations"]                | ["no tracking"]                                  | Direct answer citing Document 4  |
| Q05     | Q05            | ["net-7", "payouts", "verification"]                                      | ["instant payout"]                               | Direct answer citing Document 5  |
| Q06     | Q06            | ["30-day return window", "return authorization", "refunds"]               | ["no returns"]                                   | Direct answer citing Document 6  |
| Q07     | Q07            | ["accurate descriptions", "high-quality images", "structured attributes"] | ["no details"]                                   | Direct answer citing Document 7  |
| Q08     | Q08            | ["manage listings", "orders", "payout reports"]                           | ["no dashboard"]                                 | Direct answer citing Document 8  |
| Q09     | Q09            | ["REST API", "CSV uploads", "webhooks"]                                   | ["no API"]                                       | Direct answer citing Document 9  |
| Q10     | Q10            | ["buyer protection", "refunds", "returns policy"]                         | ["no protection"]                                | Direct answer citing Document 10 |
| Q11     | Q11            | ["account settings", "2FA", "authenticator app"]                          | ["no 2FA"]                                       | Direct answer citing Document 11 |
| Q12     | Q12            | ["zone-based", "carrier-calculated rates", "3PL"]                         | ["flat-only"]                                    | Direct answer citing Document 12 |
| Q13     | Q13            | ["automated filters", "manual review", "verified purchase"]               | ["no moderation"]                                | Direct answer citing Document 13 |
| Q14     | Q14            | ["locales", "currencies", "localized content"]                            | ["no localization"]                              | Direct answer citing Document 14 |
| Q15     | Q15            | ["audit logs", "timestamps", "90 days"]                                   | ["no logs"]                                      | Direct answer citing Document 15 |

Scoring notes:

- Each keyword present = +1. Each forbidden term present = -2. Minimum pass score = (number of required keywords) and no forbidden terms.
- Bonus +1 if the response includes an explicit source list (document title or id).

## Edge Case Tests (5 tests)

| Test ID | Scenario                       | Expected Response Type                                                                              |
| ------- | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| E01     | Question not in knowledge base | Refuse and explain that the answer is outside the KB and suggest next steps (search or escalation). |
| E02     | Ambiguous question             | Ask a clarifying question before answering.                                                         |
| E03     | Malformed question             | Request clarification or rephrase.                                                                  |
| E04     | Attempt to request PII         | Refuse and explain policy (do not provide PII).                                                     |
| E05     | High-traffic retrieval         | Graceful degradation: return cached/partial results with a confidence note; log a warning.          |

## Automation hints

- For automatic evaluation, parse `ground-truth-qa.md` to extract required keywords and expected document titles.
- Store results as JSONL: {test_id, question, retrieved_docs, response_text, keywords_found, forbidden_found, score, passed}.
- Use the CLI `src/chat-interface.py --single` and the Colab smoke-test cell as the driver for the tests.
