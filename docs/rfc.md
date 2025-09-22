# RFC: ShopLite AI-first Initiatives

This RFC collects high-level decisions and touchpoints for ShopLite's initial AI work.

## AI Touchpoints

- Selected: Typeahead Search and Support Assistant — see the capability map: `docs/ai-first/ai-capability-map.md` for details and rationale.

- Summary: These touchpoints are chosen to increase product discovery conversion and reduce repetitive support contacts while keeping integration risk low (uses SKU catalog and existing `order-status` API).
  
- Acceptance criteria: end-to-end prototype within latency targets (Typeahead p95 ≤300ms, Support p95 ≤1200ms) and cost estimates validated against the `docs/ai-first/cost-model.md`.

- Risks & privacy: See grounding, guardrails, and PII handling in `docs/ai-first/touchpoints.md`.
