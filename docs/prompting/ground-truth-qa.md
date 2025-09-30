### Q01: How do I create a seller account on Shoplite?

**Expected retrieval context:** Document 8: Seller Account Setup and Management
**Authoritative answer:** To create a seller account, visit the Shoplite seller registration page, provide business information including tax ID, and complete the verification process which takes 2-3 business days.
**Required keywords in LLM response:** ["seller registration", "business verification", "2-3 business days"]
**Forbidden content:** ["instant approval", "no verification required", "personal accounts"]

### Q02: What are Shoplite's return policies and how do I track my order status?

**Expected retrieval context:** Document 6: Return and Refund Policies + Document 5: Order Tracking and Delivery
**Authoritative answer:** Shoplite provides a standard 30-day return window for most items. Buyers must request a return authorization through the order page and follow seller instructions. Order tracking is provided via carrier APIs with status updates shown in order history.
**Required keywords in LLM response:** ["30-day return window", "order tracking", "return authorization"]
**Forbidden content:** ["no returns accepted", "lifetime returns"]

### Q03: How does Shoplite handle payment security?

**Expected retrieval context:** Document 4: Payment Methods and Security
**Authoritative answer:** Shoplite uses PCI-compliant payment processors and tokenizes payment data. Fraud prevention includes device fingerprinting, velocity checks, and risk scoring.
**Required keywords in LLM response:** ["PCI-compliant", "tokenized", "fraud prevention"]

### Q04: Can I save items in my cart across devices?

**Expected retrieval context:** Document 2: Shoplite Shopping Cart Features
**Authoritative answer:** Yes, authenticated users have carts persisted across devices; guest carts are stored in cookies and merged at login.
**Required keywords in LLM response:** ["persisted across devices", "cookies", "merged at login"]

### Q05: What is the standard seller payout schedule?

**Expected retrieval context:** Document 3: Shoplite Checkout and Payment Flow
**Authoritative answer:** Seller payouts follow the seller agreement, typically net-7, and may be held for new sellers until verification completes.
**Required keywords in LLM response:** ["net-7", "payouts", "verification"]

### Q06: How do I report a fraudulent order?

**Expected retrieval context:** Document 11: Customer Support Procedures + Document 20: Fraud Prevention and Risk Management
**Authoritative answer:** Report suspected fraud through the support flow, provide order details, and the case will be triaged by the fraud team. High-risk orders may be held pending verification.
**Required keywords in LLM response:** ["support flow", "fraud team", "triaged"]

### Q07: What are Shoplite's API rate limits?

**Expected retrieval context:** Document 13: API Documentation for Developers
**Authoritative answer:** API keys are subject to rate limiting; details are in the API docs and depend on the key tier. Developers should implement exponential backoff.
**Required keywords in LLM response:** ["rate limits", "API keys", "exponential backoff"]

### Q08: How are returns processed and refunds issued?

**Expected retrieval context:** Document 6: Return and Refund Policies
**Authoritative answer:** Returns require authorization; refunds are issued to the original payment method after inspection and may take several business days.
**Required keywords in LLM response:** ["return authorization", "refunds", "inspection"]

### Q09: How can sellers manage inventory programmatically?

**Expected retrieval context:** Document 9: Inventory Management for Sellers
**Authoritative answer:** Use the REST API or bulk CSV uploads to update inventory; webhooks can sync with external systems.
**Required keywords in LLM response:** ["REST API", "CSV uploads", "webhooks"]

### Q10: What is the standard return window on Shoplite?

**Expected retrieval context:** Document 6: Return and Refund Policies
**Authoritative answer:** Most items have a 30-day return window, with seller-specific exceptions.
**Required keywords in LLM response:** ["30-day return window"]

### Q11: How do I enable two-factor authentication (2FA)?

**Expected retrieval context:** Document 1: Shoplite User Registration Process
**Authoritative answer:** 2FA can be enabled from account settings; follow the prompts to set up SMS or an authenticator app.
**Required keywords in LLM response:** ["account settings", "2FA", "authenticator app"]

### Q12: What shipping options can sellers configure?

**Expected retrieval context:** Document 16: Seller Fulfillment and Shipping Options
**Authoritative answer:** Sellers can set zone-based rates, flat rates, or calculated carrier rates, and select merchant-fulfilled or 3PL options.
**Required keywords in LLM response:** ["zone-based", "flat rates", "carrier rates"]

### Q13: How are reviews moderated?

**Expected retrieval context:** Document 7: Product Reviews and Ratings
**Authoritative answer:** Reviews go through automated filters and manual review for flagged content; verified purchase badges are applied to valid reviews.
**Required keywords in LLM response:** ["automated filters", "manual review", "verified purchase"]

### Q14: What localization features does Shoplite support?

**Expected retrieval context:** Document 19: Accessibility and Internationalization
**Authoritative answer:** Shoplite supports multiple locales, currencies, and localized content for major markets.
**Required keywords in LLM response:** ["locales", "currencies", "localized content"]

### Q15: What data is retained in audit logs?

**Expected retrieval context:** Document 18: Data Retention and Audit Logs
**Authoritative answer:** Audit logs for admin actions are retained for 90 days by default; longer retention may apply per legal requirements.
**Required keywords in LLM response:** ["audit logs", "90 days"]

### Q16: How does Shoplite handle chargebacks?

**Expected retrieval context:** Document 17: Dispute Resolution and Chargebacks
**Authoritative answer:** Sellers are provided tools to collect evidence and respond to chargebacks; Shoplite mediates disputes and may hold funds during resolution.
**Required keywords in LLM response:** ["chargebacks", "evidence collection"]

### Q17: What are the rules for coupon stacking?

**Expected retrieval context:** Document 15: Promotional Codes and Discounts
**Authoritative answer:** Coupon stacking rules are defined by merchants and validated at checkout; Shoplite enforces stacking and exclusion rules.
**Required keywords in LLM response:** ["coupon stacking", "exclusion rules"]

### Q18: What happens if an order is delayed by the carrier?

**Expected retrieval context:** Document 5: Order Tracking and Delivery
**Authoritative answer:** Delivery exceptions trigger support workflows; customers can request updates or refunds depending on seller policy.
**Required keywords in LLM response:** ["delivery exceptions", "support workflows"]

### Q19: How do I get developer API keys?

**Expected retrieval context:** Document 13: API Documentation for Developers
**Authoritative answer:** Register an account, request API access in the developer portal, and create API keys; store them securely.
**Required keywords in LLM response:** ["developer portal", "API keys"]

### Q20: What measures are in place for fraud prevention?

**Expected retrieval context:** Document 20: Fraud Prevention and Risk Management
**Authoritative answer:** Fraud prevention uses rule-based checks and machine-learning risk scoring with integration to external identity sources.
**Required keywords in LLM response:** ["rule-based checks", "machine-learning risk scoring"]
