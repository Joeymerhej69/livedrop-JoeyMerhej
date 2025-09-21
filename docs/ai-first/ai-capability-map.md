# AI Capability Map

| Capability            | Intent (user)                                 | Inputs (this sprint)                   | Risk 1–5 | p95 ms | Est. cost/action | Fallback                        | Selected |
| --------------------- | --------------------------------------------- | -------------------------------------- | -------: | -----: | ---------------: | ------------------------------- | :------: |
| **Typeahead Search**  | Get faster, more relevant product suggestions | SKU titles, historical search queries  |        2 |    300 |           $0.002 | Default keyword search          |    ✅    |
| **Support Assistant** | Ask order/FAQ questions and get instant help  | FAQ markdown, `order-status` API by ID |        3 |   1200 |            $0.01 | Human agent escalation          |    ✅    |
| Product Tagging       | Auto-generate product attributes from images  | Product images and titles              |        4 |    N/A |      $0.05/image | Manual tagging by merch team    |          |
| Personalized Recs     | Show “You may also like” suggestions          | Clickstream + SKU purchase history     |        4 |    500 |            $0.01 | Generic “Best Sellers” carousel |          |
| Sentiment Analytics   | Detect customer sentiment from reviews        | Customer reviews text                  |        3 |    800 |           $0.005 | Manual moderation sampling      |          |


### Why These Two

Typeahead Search and the Support Assistant were chosen because they directly
improve **conversion** and reduce **support contact rate** with minimal
integration risk. Typeahead increases product discovery speed,
while the Support Assistant automates high-volume FAQ and order-status
requests using the existing `order-status` API and policies markdown.
Both can be built quickly with retrieval-augmented LLM calls and caching,
keeping latency within the 300 ms and 1200 ms p95 targets and
daily costs well below budget under the given traffic assumptions.
