# RFC: ShopLite AI-first Initiatives

This RFC collects high-level decisions and touchpoints for ShopLite's initial AI work.

## AI Touchpoints

- Selected: Product Tagging and Personalized Recs — see the capability map: `docs/ai-first/ai-capability-map.md` for details and rationale.

- Summary: These touchpoints focus on improving catalog quality and personalized shopping experiences. Product Tagging reduces manual SKU work and improves metadata coverage; Personalized Recs increase engagement and AOV while staying within existing data boundaries (clickstream, SKU catalog).

- Acceptance criteria: end-to-end prototype within latency targets (Product Tagging p95 ≤5000ms for near-real-time tagging, Personalized Recs p95 ≤500ms) and cost estimates validated against the `docs/ai-first/cost-model.md`.

- Risks & privacy: See grounding, guardrails, and PII handling in `docs/ai-first/touchpoints.md`.
