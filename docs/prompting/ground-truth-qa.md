### Q01: How do I create a seller account on Shoplite?

**Expected retrieval context:** Document 1: Shoplite User Registration Process
**Authoritative answer:** To create a seller account, go to Shoplite’s seller registration page and provide accurate business details (legal business name, tax ID, business address, and banking details). Shoplite performs business verification (usually 2–3 business days) and may request supporting documents such as government IDs or business licenses. Personal accounts cannot be used for seller operations; sellers must complete verification before listing products and receiving payouts.
**Required keywords in LLM response:** ["seller registration", "business verification", "2-3 business days"]
**Forbidden content:** ["instant approval", "no verification required", "personal accounts"]

### Q02: Can I save items in my cart across devices?

**Expected retrieval context:** Document 2: Shoplite Shopping Cart Features
**Authoritative answer:** Yes. Authenticated users have their carts persisted across devices so items remain available when switching from desktop to mobile. Guest carts are stored in cookies and are merged with the user’s account cart when they log in, preventing duplication and loss of selections.
**Required keywords in LLM response:** ["persisted across devices", "cookies", "merged at login"]

### Q03: How does Shoplite handle payment security?

**Expected retrieval context:** Document 3: Shoplite Checkout and Payment Flow
**Authoritative answer:** Shoplite uses PCI-compliant payment processors and tokenizes payment credentials so card numbers and bank details are not stored on Shoplite servers. Fraud prevention includes device fingerprinting, velocity checks, and risk scoring; high-risk transactions can be flagged for review.
**Required keywords in LLM response:** ["PCI-compliant", "tokenized", "fraud prevention"]

### Q04: What shipping and delivery features does Shoplite provide?

**Expected retrieval context:** Document 4: Shoplite Shipping and Delivery System
**Authoritative answer:** Shoplite integrates with carrier APIs to provide shipping cost calculations, delivery estimates, and real-time tracking. The platform supports multi-seller shipments, shipping rate configuration, and notifications to keep buyers and sellers informed about transit status and exceptions.
**Required keywords in LLM response:** ["carrier APIs", "tracking", "shipping cost calculations"]

### Q05: What is the standard seller payout schedule?

**Expected retrieval context:** Document 5: Shoplite Order Management
**Authoritative answer:** Payouts are typically made on a net-7 schedule (funds disbursed seven days after settlement). Sellers must complete verification (banking details, tax ID) before receiving payouts; new or unverified sellers may experience holds until verification is complete.
**Required keywords in LLM response:** ["net-7", "payouts", "verification"]

### Q06: What are Shoplite’s returns and refund policies?

**Expected retrieval context:** Document 6: Shoplite Returns and Refunds Policy
**Authoritative answer:** Most items are covered under a standard 30-day return window from delivery. Buyers must request return authorization through their order page and follow seller instructions; refunds are issued to the original payment method after the item is inspected.
**Required keywords in LLM response:** ["30-day return window", "return authorization", "refunds"]

### Q07: How should I prepare product listings for Shoplite?

**Expected retrieval context:** Document 7: Shoplite Product Listing Guidelines
**Authoritative answer:** Follow Shoplite’s listing guidelines: provide clear titles, accurate descriptions, high-quality images, and correct category/taxonomy. Use structured attributes where supported, keep pricing and inventory updated, and comply with prohibited items and content standards.
**Required keywords in LLM response:** ["accurate descriptions", "high-quality images", "structured attributes"]

### Q08: What does the vendor dashboard let me do?

**Expected retrieval context:** Document 8: Shoplite Vendor Dashboard
**Authoritative answer:** The vendor dashboard provides tools to manage listings, view orders, track fulfillment status, monitor returns and refunds, and access payout reports. It also surfaces alerts about verification, chargebacks, and policy actions affecting your seller account.
**Required keywords in LLM response:** ["manage listings", "orders", "payout reports"]

### Q09: How can sellers manage inventory programmatically?

**Expected retrieval context:** Document 9: Shoplite Inventory Management
**Authoritative answer:** Sellers can update inventory via the REST API, perform bulk CSV uploads for large catalogs, and receive webhook notifications to sync external systems with Shoplite inventory changes to avoid overselling.
**Required keywords in LLM response:** ["REST API", "CSV uploads", "webhooks"]

### Q10: What buyer protections does Shoplite offer?

**Expected retrieval context:** Document 10: Shoplite Buyer Protection Program
**Authoritative answer:** Shoplite offers protections such as guaranteed refunds for eligible disputes, a structured returns process, and order tracking to resolve delivery problems. Policies and windows (for example, the 30-day return period) define eligibility.
**Required keywords in LLM response:** ["buyer protection", "refunds", "returns policy"]

### Q11: How do I enable two-factor authentication (2FA)?

**Expected retrieval context:** Document 11: Shoplite Vendor Onboarding Program
**Authoritative answer:** Enable 2FA from account settings; choose SMS-based one-time codes or an authenticator app. Keep backup codes secure for account recovery.
**Required keywords in LLM response:** ["account settings", "2FA", "authenticator app"]

### Q12: What shipping configuration options can sellers set?

**Expected retrieval context:** Document 12: Shoplite Customer Support System
**Authoritative answer:** Sellers can define zone-based or flat shipping rates, integrate carrier-calculated rates, and choose between merchant-fulfilled or 3PL fulfillment. Accurate shipping configuration keeps delivery estimates and tracking consistent.
**Required keywords in LLM response:** ["zone-based", "carrier-calculated rates", "3PL"]

### Q13: How does Shoplite moderate reviews?

**Expected retrieval context:** Document 13: Shoplite Fraud Detection and Security
**Authoritative answer:** Reviews pass through automated filters that detect spam or abusive content, and flagged items are escalated for manual moderation. Verified Purchase badges are applied to reviews that originate from completed transactions.
**Required keywords in LLM response:** ["automated filters", "manual review", "verified purchase"]

### Q14: What localization features does Shoplite support?

**Expected retrieval context:** Document 14: Shoplite Mobile App Features
**Authoritative answer:** Shoplite supports multiple locales and currencies, localized content and formatting, and allows sellers to set country-specific prices and translated product descriptions for international buyers.
**Required keywords in LLM response:** ["locales", "currencies", "localized content"]

### Q15: What audit logging does Shoplite keep?

**Expected retrieval context:** Document 15: Shoplite Advertising Solutions
**Authoritative answer:** Shoplite records administrative actions, payment adjustments, and content changes with timestamps and user identifiers. Logs are retained (default 90 days) and can be extended for legal or compliance needs.
**Required keywords in LLM response:** ["audit logs", "timestamps", "90 days"]

### Q16: How are chargebacks handled?

**Expected retrieval context:** Document 16: Shoplite Loyalty and Rewards Program
**Authoritative answer:** When a chargeback occurs, sellers collect and submit evidence (invoices, tracking, communications) via the platform; Shoplite mediates with the payment processor and may place funds on hold until resolution.
**Required keywords in LLM response:** ["chargebacks", "evidence collection", "mediation"]

### Q17: What are the rules for coupon stacking?

**Expected retrieval context:** Document 17: Shoplite Analytics and Reporting
**Authoritative answer:** Merchants define coupon stacking and exclusion rules which are validated at checkout; Shoplite enforces these rules consistently to prevent conflicting discounts.
**Required keywords in LLM response:** ["coupon stacking", "exclusion rules", "checkout validation"]

### Q18: What happens if an order is delayed by the carrier?

**Expected retrieval context:** Document 18: Shoplite API Integration
**Authoritative answer:** Delivery exceptions trigger support workflows that notify buyers and sellers; customers may request updates, refunds, or other remediation depending on seller policy and the severity of the delay.
**Required keywords in LLM response:** ["delivery exceptions", "support workflows", "refunds"]

### Q19: How do I obtain developer API keys?

**Expected retrieval context:** Document 19: Shoplite Compliance and Legal Policies
**Authoritative answer:** Register in the Shoplite Developer Portal, request API access, and create API keys tied to scopes and rate limits. Store keys securely and rotate them periodically.
**Required keywords in LLM response:** ["developer portal", "API keys", "rotate keys"]

### Q20: What measures are in place for fraud prevention?

**Expected retrieval context:** Document 20: Shoplite Future Roadmap
**Authoritative answer:** Shoplite applies rule-based checks and machine-learning risk scoring to detect fraud, integrates with external identity sources, and maintains a fraud team to triage high-risk cases. These measures evolve over time as new threats are identified.
**Required keywords in LLM response:** ["rule-based checks", "machine-learning risk scoring", "fraud team"]
