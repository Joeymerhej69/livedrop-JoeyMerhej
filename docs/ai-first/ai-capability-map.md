# AI Capability Map

| Capability            | Intent (user)                                 | Inputs (this sprint)                   | Risk 1–5 | p95 ms | Est. cost/action | Fallback                        | Selected |
| --------------------- | --------------------------------------------- | -------------------------------------- | -------: | -----: | ---------------: | ------------------------------- | :------: |
| **Typeahead Search**  | Get faster, more relevant product suggestions | SKU titles, historical search queries  |        2 |    300 |           $0.002 | Default keyword search          |          |
| **Support Assistant** | Ask order/FAQ questions and get instant help  | FAQ markdown, `order-status` API by ID |        3 |   1200 |            $0.01 | Human agent escalation          |          |
| Product Tagging       | Auto-generate product attributes from images  | Product images and titles              |        4 |    N/A |      $0.05/image | Manual tagging by merch team    |    ✅    |
| Personalized Recs     | Show “You may also like” suggestions          | Clickstream + SKU purchase history     |        4 |    500 |            $0.01 | Generic “Best Sellers” carousel |    ✅    |
| Sentiment Analytics   | Detect customer sentiment from reviews        | Customer reviews text                  |        3 |    800 |           $0.005 | Manual moderation sampling      |          |


### Why These Two

Product Tagging and Personalized Recommendations were chosen because they
directly improve catalog quality and long-term conversion by surfacing
relevant items and enriching SKU metadata with minimal customer-facing
surface changes. Product Tagging reduces manual effort for merchandising
and improves search/recs coverage by auto-generating attributes from
images and titles, while Personalized Recs increase average order value
and repeat purchase rate by leveraging clickstream and purchase history.
Both touchpoints primarily use existing product data (images, titles,
and clickstream) which lowers integration risk and keeps engineering
work scoped to retrieval and ranking components.
