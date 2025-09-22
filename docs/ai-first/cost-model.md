## Assumptions

- Model (text): Llama 3.1 8B Instruct via OpenRouter at $0.05/1K prompt tokens, $0.20/1K completion tokens
- Image inference cost (vision model): approx $0.01 per image processed (batch pricing estimate)
- Personalized ranking scorer (lightweight) costs similar to a small model call: assume 50 in tokens in + 50 out equivalent
- Product Tagging avg: 1 image processed + 100 tokens of LLM normalization
- Personalized Recs avg: 100 tokens in (features) + 50 tokens out (ranking/metadata)
- Requests/day (defaults): Product Tagging 200 images/day (new SKUs) Personalized Recs 20,000 pageviews/day
- Cache hit rate: Product Tagging: N/A (one-time on upload); Personalized Recs cache hit 60%

## Calculation

Cost/action (text) = (tokens*in/1000 * prompt*price) + (tokens_out/1000 * completion*price)
Cost/image = image_inference_cost (when applicable)
Daily cost = Cost/action * Requests/day \_ (1 - cache_hit_rate) + Cost_image \* images_processed

### Product Tagging (Llama + image model)

- Image cost per SKU = $0.01 (vision model) \* 1 image = $0.01
- LLM normalization cost = (100/1000 _ $0.05) + (0/1000 _ $0.20) = $0.005
- Cost/action (per new SKU) = $0.01 + $0.005 = $0.015
- Daily volume = 200 new SKUs/day -> Daily cost = $0.015 \* 200 = $3.00

### Personalized Recs (Llama)

- Cost/action = (100/1000 _ $0.05) + (50/1000 _ $0.20) = $0.005 + $0.01 = $0.015
- Effective daily calls (misses) = 20,000 \* (1 - 0.60) = 8,000
- Daily cost = $0.015 \* 8,000 = $120.00

### Comparison with GPT-4o-mini

- Product Tagging (GPT-4o-mini LLM portion): (100/1000 \* $0.15) = $0.015 per normalization + $0.01 image = $0.025 per SKU -> 200/day = $5.00/day
- Personalized Recs (GPT-4o-mini): (100/1000 _ $0.15) + (50/1000 _ $0.60) = $0.015 + $0.03 = $0.045 per call -> 8,000 misses/day = $360/day

## Results

- Product Tagging (Llama): Cost/action = $0.015, Daily = $3.00
- Personalized Recs (Llama): Cost/action = $0.015, Daily = $120.00

Comparison (GPT-4o-mini):

- Product Tagging: $0.025/action, Daily = $5.00
- Personalized Recs: $0.045/action, Daily = $360.00

## Cost lever if over budget

- Increase personalization cache hit rate (longer TTLs, precompute popular segments).
- Batch image processing for tagging during low-cost windows to reduce per-image inference cost.
- Use Llama for high-volume ranking and reserve GPT-4o-mini for complex, high-value re-ranks.
