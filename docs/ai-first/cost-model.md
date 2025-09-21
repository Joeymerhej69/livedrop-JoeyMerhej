## Assumptions

- Model (primary): Llama 3.1 8B Instruct via OpenRouter at $0.05/1K prompt tokens, $0.20/1K completion tokens
- Comparison model: GPT-4o-mini at $0.15/1K prompt tokens, $0.60/1K completion tokens
- Typeahead avg tokens in: 32  Avg tokens out: 32
- Support Assistant avg tokens in: 400  Avg tokens out: 200
- Requests/day (defaults): Typeahead 50,000  Support Assistant 1,000
- Cache hit rate: Typeahead 70% (apply miss cost only), Support Assistant 30% cache hit

## Calculation

Cost/action = (tokens_in/1000 * prompt_price) + (tokens_out/1000 * completion_price)
Daily cost = Cost/action * Requests/day * (1 - cache_hit_rate)

### Llama 3.1 8B (primary)

- Typeahead:

  - Cost/action = (32/1000 * $0.05) + (32/1000 * $0.20) = $0.0016 + $0.0064 = $0.0080
  - Effective daily calls (misses) = 50,000 * (1 - 0.70) = 15,000
  - Daily cost = $0.0080 * 15,000 = $120.00

- Support Assistant:
  - Cost/action = (400/1000 * $0.05) + (200/1000 * $0.20) = $0.02 + $0.04 = $0.06
  - Effective daily calls (misses) = 1,000 * (1 - 0.30) = 700
  - Daily cost = $0.06 * 700 = $42.00

### GPT-4o-mini (comparison)

- Typeahead:

  - Cost/action = (32/1000 * $0.15) + (32/1000 * $0.60) = $0.0048 + $0.0192 = $0.0240
  - Daily cost (misses) = $0.0240 * 15,000 = $360.00

- Support Assistant:
  - Cost/action = (400/1000 * $0.15) + (200/1000 * $0.60) = $0.06 + $0.12 = $0.18
  - Daily cost (misses) = $0.18 * 700 = $126.00

## Results

- Support Assistant (Llama): Cost/action = $0.06, Daily = $42.00
- Typeahead (Llama): Cost/action = $0.0080, Daily = $120.00

Comparison with GPT-4o-mini:

- Support Assistant (GPT-4o-mini): Cost/action = $0.18, Daily = $126.00
- Typeahead (GPT-4o-mini): Cost/action = $0.0240, Daily = $360.00

## Cost lever if over budget

- Shorten RAG context for Support Assistant to reduce token_in (e.g., trim policy excerpts to 200 tokens).
- Increase cache TTLs or precompute top suggestions to raise typeahead hit rate from 70% to 85%.
- Use Llama 3.1 for high-volume paths and route sensitive/complex requests to GPT-4o-mini.
