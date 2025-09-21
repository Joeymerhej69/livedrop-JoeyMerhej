## Typeahead Search

**Problem statement**

Shoppers need fast, relevant product suggestions while they type to shorten search-to-purchase time and increase conversion. Current keyword search on ShopLite is adequate but returns many low-relevance results for partial queries and misspellings, increasing time-to-first-click and drop-off during search-heavy sessions.

**Happy path**

1. User focuses the search box and types a partial query (e.g., "blue running").
2. Frontend sends the current input to the Typeahead service (debounced at 100 ms, only when length >= 2).
3. Service checks local in-memory cache for the query key; on miss, it performs a fast vector or term-relevance retrieval over indexed SKU titles and aliases.
4. Service ranks and returns up to 10 suggestions with SKU id, title, thumbnail, and match score.
5. Frontend displays suggestions; user selects a suggestion or continues typing.
6. Selection navigates to product page or search results; click is instrumented for conversion attribution.

## Typeahead Search

**Problem statement**

Shoppers need fast, relevant product suggestions while they type to shorten search-to-purchase time and increase conversion. Current keyword search on ShopLite is adequate but returns many low-relevance results for partial queries and misspellings, increasing time-to-first-click and drop-off during search-heavy sessions.

**Happy path**

1. User focuses the search box and types a partial query (e.g., "blue running").
2. Frontend sends the current input to the Typeahead service (debounced at 100 ms, only when length >= 2).
3. Service checks local in-memory cache for the query key; on miss, it performs a fast vector or term-relevance retrieval over indexed SKU titles and aliases.
4. Service ranks and returns up to 10 suggestions with SKU id, title, thumbnail, and match score.
5. Frontend displays suggestions; user selects a suggestion or continues typing.
6. Selection navigates to product page or search results; click is instrumented for conversion attribution.

**Grounding & guardrails**

- Source of truth: SKU catalog (titles, aliases), historical search logs for query expansions.
- Retrieval scope this sprint: top 10k SKUs (ShopLite baseline) with precomputed embeddings + title/token index.
- Max context: only the current query string (<= 64 characters) and optional last-clicked SKU id for personalization (one ID). No free-form doc retrieval.
- Refuse outside scope: if query contains requests for order/support ("where is my order"), return a routing suggestion to Support Assistant instead.

**Human-in-the-loop**

- Escalation triggers: low-confidence matches below a threshold (match score < 0.2) or queries that appear to be support requests.
- UI surface: a small "Ask support" suggestion in the typeahead dropdown that routes to the Support Assistant.
- Reviewer & SLA: Search relevance QA by product ops; weekly sampling of low-score queries; reviewer SLA 48 hours for flagged batches.

**Latency budget** (p95 target = 300 ms)

- Frontend debounce + network: 60 ms
- Cache read (p95 warm): 10 ms
- Retrieval + ranking (cold vector/term lookup): 160 ms
- Response serialization + network: 70 ms
- Total p95 budget: 300 ms

Cache strategy: 70% expected cache hit for popular prefixes using an LRU in-memory cache populated from recent queries and precomputed top suggestions.

**Error & fallback behavior**

- If retrieval fails or times out (> 250 ms for backend), fall back to the existing keyword search endpoint and show generic "Best sellers" suggestions.
- Log the query and error with non-PII context for debugging; do not block the UI.

**PII handling**

- What leaves the app: the raw query string is sent to the Typeahead service; queries are retained for analytics but masked for PII.
- Redaction rules: detect and redact tokens that match email, phone, or order-id patterns before logging or sending to third-party services. If query matches an order-id pattern, route to Support Assistant instead of sending to search index.
- Logging policy: store hashes of raw queries (SHA-256) for analytics, store redacted plaintext for UX debugging only, and keep retention to 30 days. No user identifiers with query text in logs.

**Success metrics**

- Product metric 1 (Time-to-first-click): median seconds from focus to first suggestion click. Formula: median(click_time - focus_time).
- Product metric 2 (Search conversion lift): conversion rate for sessions using typeahead vs baseline. Formula: orders_from_sessions_with_typeahead / sessions_with_typeahead.
- Business metric (Revenue per search session): total revenue from sessions started by search / number of search sessions.

**Feasibility note**

SKU titles and historical search logs exist in ShopLite; embeddings can be precomputed for 10k SKUs using any small embedding model or term index. Next prototype step: build a minimal service that serves cached top suggestions for 100 popular prefixes and measure end-to-end latency in staging.

## Support Assistant

**Problem statement**

Customer support receives high-volume, repeatable questions about order status, returns, and policies that increase human agent load and response time. Shoppers expect instant answers for order lookups and policy clarifications; automating these reduces support contact rate and operational cost while improving response time.

**Happy path**

1. User opens the support widget and types "Where's my order #12345?" or selects an FAQ question.
2. Frontend authenticates user session and optionally attaches order id from URL or user account.
3. Support Assistant checks intent and extracts the referenced order id.
4. Assistant retrieves grounding documents: policies markdown and `order-status` API by id for the referenced order.
5. Assistant composes a concise answer with order status, expected delivery, and next steps; shows the cited sources (policy paragraph and order id) in the UI.
6. If the assistant is confident, it returns the answer; user marks the issue resolved or clicks "contact agent".

**Grounding & guardrails**

- Source of truth: `docs/policies/*` markdown files (FAQ) and the `order-status` API (by order id).
- Retrieval scope this sprint: the policies markdown and order-status API only; do not retrieve user messages or other DB tables.
- Max context: 4k tokens (policy excerpts + order JSON). Responses must cite the policy filename and order id.
- Refuse outside scope: for account changes, refunds not available via API, or transactional disputes, the assistant should refuse and route to human agent.

**Human-in-the-loop**

- Escalation triggers: low-confidence answers (LLM confidence < 0.7), ambiguous order ids, or requests for refunds/chargebacks.
- UI surface: "Escalate to agent" button and a pre-filled transcript with user query + assistant draft answer for quick agent takeover.
- Reviewer & SLA: Support lead reviews escalation queue; SLA 4 hours for customer-visible responses during business hours.

**Latency budget** (p95 target = 1200 ms)

- Frontend auth + network: 120 ms
- Retrieval of policy & order API: 300 ms (includes network to internal API)
- RAG assembly + LLM call (p95): 600 ms
- Response rendering + network: 180 ms
- Total p95 budget: 1,200 ms

Cache strategy: cache recent order-status responses for 30 seconds and policy excerpts in-memory with TTL 24 hours. Expect ~30% cache hit rate.

**Error & fallback behavior**

- If an order lookup fails (API error or order not found), provide a clear message with next steps ("We couldn't find that order; check the number or contact support") and present "Contact agent" action.
- If LLM times out or returns low-confidence output, show a safe canned response and surface the option to contact an agent. Log the event for review.

**PII handling**

- What leaves the app: order id (when present) and redacted user query may be sent to the LLM provider for generation when necessary.
- Redaction rules: redact payment card numbers, full addresses, and personally identifiable contact info before sending to third-party LLMs. Include only order id and last 4 digits when needed.
- Logging policy: log events with order id hashed, assistant confidence score, and redacted transcript. Store detailed transcripts only in an internal secure store with restricted access and 90-day retention.

**Success metrics**

- Product metric 1 (First contact resolution rate with assistant): percentage of support widget sessions resolved without agent handoff. Formula: resolved_by_assistant / total_assistant_sessions.
- Product metric 2 (Median response time): median time from user message to assistant reply. Formula: median(reply_time - message_time).
- Business metric (Support contacts avoided): reduction in agent-handled tickets per day. Formula: (baseline_agent_tickets - agent_tickets_after_assistant).

**Feasibility note**

Policies markdown exists in the repo and ShopLite exposes an `order-status` API by id. Use a retrieval-augmented approach with short policy excerpts and the order JSON as grounding. Next prototype step: wire a mock `order-status` endpoint and test a small LLM prompt that returns status + citation within the latency budget.

---

**Estimated cost per action (assumptions)**

- Pricing examples used: `GPT-4o-mini` ($0.15/1K prompt, $0.60/1K completion) and `Llama 3.1 8B Instruct` via OpenRouter ($0.05/1K prompt, $0.20/1K completion).
- Typeahead: typical request uses a small prompt (32 tokens) + small completion (32 tokens) for ranking/rewriting. Estimated cost per request: ~0.000032 _ prompt_price + 0.000032 _ completion_price ≈ $0.000019 (Llama) — effectively negligible; with 50k requests/day and 70% cache hit, incremental model calls ~15k/day -> ~$0.3/day using Llama pricing.
- Support Assistant: typical RAG prompt ~400 tokens + completion ~200 tokens. Using `GPT-4o-mini` cost estimate: (0.4 _ $0.15) + (0.2 _ $0.60) = $0.06 + $0.12 = $0.18 per full call. With 1,000 requests/day and 30% cache hit -> ~700 model calls/day ≈ $126/day. Using Llama pricing would be ~ (0.4*$0.05)+(0.2*$0.20) = $0.02+$0.04 = $0.06/call -> $42/day.
