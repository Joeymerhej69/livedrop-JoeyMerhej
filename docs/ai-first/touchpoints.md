## Product Tagging

**Problem statement**

Merchandising and catalog teams spend manual effort tagging product attributes (color, material, style, use-case) from images and titles. This limits catalog coverage and slows new SKU onboarding, harming search relevance and personalization.

**Happy path**

1. New SKU is uploaded with images and title.
2. On upload, the Product Tagging service queues the image for processing.
3. An image model extracts visual features and candidate labels; a small LLM normalizes labels to attribute schema.
4. The service writes generated attributes to the SKU record (with confidence scores) and flags low-confidence items for human review.
5. Merch team reviews flagged SKUs in a review UI and accepts/rejects corrections.
6. Accepted attributes are indexed for search and recommendation pipelines.

**Grounding & guardrails**

- Source of truth: SKU catalog, product images, and title fields.
- Retrieval scope this sprint: new and updated SKUs only (approx. 200 images/day assumed), attributes limited to a 12-field schema (color, material, style, size hints, gender, category, usage, etc.).
- Max context: single image + title + existing SKU metadata (<= 1k tokens equivalent) per inference call.
- Refuse outside scope: do not infer pricing, inventory, or sensitive attributes (e.g., age-restricted categories) — route to human review.

**Human-in-the-loop**

- Escalation triggers: low-confidence attribute predictions (confidence < 0.6) or conflicting attributes across images.
- UI surface: batch review queue for merch with accept/modify/reject actions and quick edit shortcuts.
- Reviewer & SLA: Merch team reviews flagged items; SLA 24–72 hours depending on priority.

**Latency budget** (p95 target = 5,000 ms for near-real-time tagging)

- Image ingestion + queue: 200 ms
- Image model inference (p95): 2,000 ms
- LLM normalization + ranking: 1,000 ms
- Write to catalog + index: 500 ms
- Review flagging & UI enqueue: 1,300 ms
- Total p95 budget: 5,000 ms

Cache strategy: cached model warm pools and local batching for thumbnails; no external per-request cache required.

**Error & fallback behavior**

- If model inference fails, set attributes to unknown and send SKU to manual review queue. Log failures with image id and error reason.
- If normalization fails, retain raw labels and flag for merch verification.

**PII handling**

- What leaves the app: image-derived labels and normalized attribute data (no user PII).
- Redaction rules: strip any text detected in images that matches PII (emails, phone numbers); do not send full-resolution images to third-party services unless necessary and approved.
- Logging policy: store processing metadata, confidence scores, and anonymized image hashes; retain detailed images only in secure internal storage with access controls.

**Success metrics**

- Product metric 1 (Catalog coverage): % of SKUs with complete attribute set. Formula: skus_with_full_attributes / total_skus.
- Product metric 2 (Search relevance improvement): change in search CTR for attribute-filtered queries. Formula: CTR_post / CTR_pre - 1.
- Business metric (Manual tagging hours saved): estimated merch hours saved per week. Formula: (baseline_hours - post_automation_hours).

**Feasibility note**

Product images and titles exist in ShopLite. Prototype using an off-the-shelf image tagger + small LLM for normalization; next step: run a 1k-image batch to measure label accuracy and reviewer load.

## Personalized Recs

**Problem statement**

Shoppers benefit from personalized product suggestions, but ShopLite currently shows generic carousels that underperform for engagement and repeat purchase. Personalized recommendations can increase AOV and retention if surfaced where users shop.

**Happy path**

1. User visits a product or category page; frontend requests personalized recs.
2. Service checks for cached recommendations for the user/session; on miss, it retrieves user clickstream and purchase history and recent SKU embeddings.
3. A ranking model (lightweight scorer) generates top-N personalized SKUs with scores.
4. Service returns ranked recommendations with SKU ids, thumbnails, and reasons (optional short text).
5. Frontend displays recs in an inline carousel; user clicks through or adds to cart.
6. Clicks and conversions are recorded and fed back to update models and caches.

**Grounding & guardrails**

- Source of truth: clickstream events, SKU embeddings, and purchase history (aggregated).
- Retrieval scope this sprint: last 90 days of anonymized sessions and precomputed SKU embeddings for 10k SKUs.
- Max context: aggregated feature vectors + up to 1k tokens of session summary for contextual signals.
- Refuse outside scope: do not use raw user messages or sensitive profile fields; refuse to recommend age-restricted items without a verified flag.

**Human-in-the-loop**

- Escalation triggers: model drift detection, sudden drops in CTR, or biased recommendations flagged by QA.
- UI surface: internal dashboard for QA to mark poor recommendations; manual overrides for curated slots.
- Reviewer & SLA: Data Science and Merch review weekly; critical issues triaged within 24 hours.

**Latency budget** (p95 target = 500 ms)

- Frontend request + network: 60 ms
- Cache read (p95 warm): 30 ms
- Retrieval of user/session features + embeddings: 140 ms
- Ranking model inference: 200 ms
- Response serialization + network: 70 ms
- Total p95 budget: 500 ms

Cache strategy: per-user/session ephemeral cache with TTL 5 minutes and global popular lists cached for 24 hours. Expect ~60% cache hit on product pages.

**Error & fallback behavior**

- On retrieval or ranking failure, fall back to a generic "You may also like" best-sellers carousel and surface a small banner "Can't personalize right now".
- Log failures and sample inputs for debugging; do not expose internal model errors to users.

**PII handling**

- What leaves the app: anonymous user/session id and aggregated features; no raw PII or full purchase history sent to third-party models.
- Redaction rules: remove or hash any identifiers; do not include email, full addresses, or payment data in model inputs.
- Logging policy: store recommendation requests with hashed user ids and feature fingerprints; retain raw session data in secure analytics for 90 days.

**Success metrics**

- Product metric 1 (Rec CTR): clicks on recommended items / impressions. Formula: rec_clicks / rec_impressions.
- Product metric 2 (AOV lift for sessions with recs): avg_order_value_with_recs / avg_order_value_without_recs - 1.
- Business metric (Incremental revenue from recs): revenue_from_rec_sessions - baseline_revenue.

**Feasibility note**

Clickstream and SKU embeddings are available; prototype with a lightweight retrieval+ranking pipeline using precomputed embeddings and a small scorer. Next step: A/B test homepage and product page slots with cached personalized lists.
