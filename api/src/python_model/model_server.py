import os
import time
import numpy as np
from threading import Thread
from dotenv import load_dotenv
from flask import Flask, request, jsonify

# === load env ===
load_dotenv()
PORT = int(os.getenv("PORT", "5050"))
NGROK_TOKEN = os.getenv("NGROK_AUTHTOKEN")

# ===============================
# 1) IMPORTS FOR MODEL + RETRIEVAL
# ===============================
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from sentence_transformers import SentenceTransformer
import faiss

# Cell 3: Knowledge base data (manual definition)

KNOWLEDGE_BASE = [
    {
        "id": "doc1",
        "title": "Shoplite User Registration Process",
                  "content": """Creating a seller account on Shoplite is a structured process designed to protect buyers
        and maintain marketplace trust. Sellers must complete the seller registration process, which begins
        by providing accurate business information such as legal business name, tax ID, business address,
        and banking details. Shoplite performs business verification to ensure that each seller is a legitimate
        entity and complies with local regulations, financial reporting, and tax obligations. Verification
        typically takes 2-3 business days, during which Shoplite may request additional documents, such as
        government-issued IDs, business licenses, or proof of tax registration. Sellers can track the status
        of their verification at every step. Only after successful verification can a seller begin listing
        products and accepting orders. The system is intentionally designed to avoid instant approval,
        and personal accounts cannot be used for seller operations to ensure accountability. During onboarding,
        step-by-step guidance is provided to ensure sellers understand their obligations, including compliance
        with Shoplite’s seller policies, dispute resolution mechanisms, and marketplace standards. Completing
        seller registration and verification ensures that buyers can trust the products offered, protects
        financial transactions, and maintains the integrity of Shoplite’s platform. Sellers are encouraged
        to carefully follow all instructions and provide complete documentation to avoid delays in the 2-3
        business day verification process. This approach balances efficiency with security, enabling sellers
        to operate confidently while preserving the marketplace ecosystem."""
    },
    {
        "id": "doc2",
        "title": "Shoplite Shopping Cart Features",
"content": """Shoplite’s return and refund system is designed to protect both buyers and sellers while
        maintaining clarity and fairness. Most items are covered under a standard 30-day return window, which
        begins from the date of delivery. Buyers seeking to return items must request a return authorization
        through their order page and follow the seller’s instructions for preparing and shipping the return.
        The system integrates order tracking through carrier APIs, ensuring that buyers can monitor the progress
        of both shipments and returns. Sellers are expected to approve or reject return requests promptly;
        disputes may be escalated to Shoplite arbitration if necessary. Once a return is authorized and the
        item has been received and inspected, refunds are issued to the original payment method. Shoplite
        emphasizes the importance of adhering to the 30-day return window; policies such as lifetime returns
        are not supported. The combination of return authorization, structured seller instructions, and
        automated order tracking ensures that the return process is transparent and reduces errors or disputes.
        Buyers can also view return status and tracking information in their order history, creating a seamless
        and predictable experience. Sellers are encouraged to communicate clearly, follow all platform guidelines,
        and maintain high standards of item description and packaging to reduce returns and disputes."""
    },
    {
        "id": "doc3",
        "title": "Shoplite Checkout and Payment Flow",
"content": """Shoplite takes payment security seriously to protect buyers and sellers. All transactions
        are processed using PCI-compliant payment processors, and sensitive payment information is tokenized
        to prevent unauthorized access. Card numbers, bank account details, and other credentials are never
        stored directly on Shoplite servers. Fraud prevention is implemented through multiple layers, including
        device fingerprinting, velocity checks to monitor unusual transaction patterns, and risk scoring to
        evaluate transaction legitimacy. The platform supports multiple payment methods, including credit cards,
        PayPal, Apple Pay, and Google Pay, with seamless integration into the checkout flow. Multi-seller orders
        are split programmatically, ensuring that each seller receives the correct portion of the payment, while
        Shoplite retains its commission. These processes are carefully monitored and logged for audit purposes.
        Machine learning algorithms detect potentially fraudulent activity in real-time, allowing Shoplite to
        intervene before funds are released. Sellers are notified of high-risk orders or potential chargebacks.
        By combining PCI-compliant systems, tokenization, and robust fraud prevention measures, Shoplite
        ensures that payments are processed securely, efficiently, and with minimal risk to all parties
        involved. This comprehensive approach protects both buyers’ financial information and sellers’ revenues,
        while maintaining trust across the marketplace."""
    },
    {
        "id": "doc4",
        "title": "Shoplite Shipping and Delivery System",
"content": """Shoplite provides a shopping cart system that allows items to be saved and accessed across
        multiple devices, ensuring a seamless shopping experience. Authenticated users have their carts persisted
        across devices in real-time, allowing them to start shopping on a desktop, continue on a mobile device,
        and finalize purchases on a tablet without losing items. For guest users, items are stored in cookies,
        and when the user logs in, these items are merged at login with any existing cart contents. This ensures
        that no selected item is lost and prevents duplication or loss of stock availability. The cart system
        also includes features such as quantity adjustments, item removal, automated price recalculation with
        discounts, tax estimation, and shipping cost calculations. Real-time synchronization with inventory
        prevents checkout errors caused by out-of-stock items. Multi-seller support allows items from different
        vendors to be combined seamlessly, maintaining an accurate cart state across all sessions. The system
        is designed for reliability, user convenience, and to enhance conversion by reducing friction during
        checkout. Cart persistence across devices increases engagement, provides a consistent experience, and
        aligns inventory, payment state, and session management across all Shoplite platforms."""
    },
    {
        "id": "doc5",
        "title": "Shoplite Order Management",
"content": """Shoplite provides a standardized seller payout schedule to ensure transparency and
        predictability for sellers. Payouts are typically made on a net-7 basis, meaning funds from completed
        transactions are disbursed seven days after settlement. Sellers are required to complete business
        verification before receiving payouts, which includes confirmation of banking details, tax ID, and
        legal business registration. New sellers or those with pending verification may experience temporary
        holds on payouts until compliance is confirmed. Multi-seller orders are processed to split payments
        programmatically, ensuring each seller receives their accurate share while Shoplite retains the
        appropriate commission. Sellers can monitor pending, completed, and scheduled payouts through the
        vendor dashboard, providing full visibility into transaction flows. The payout process is designed to
        balance timely access to funds with fraud prevention and operational integrity. By maintaining a
        verification step and adhering to the net-7 schedule, Shoplite ensures that sellers are paid promptly
        while minimizing risk. Clear communication, detailed reporting, and a structured payout workflow create
        confidence for sellers and support long-term marketplace sustainability."""
    },
    {
        "id": "doc6",
        "title": "Shoplite Returns and Refunds Policy",
"content": """Shoplite has established a structured support flow to allow sellers and buyers
        to report suspected fraudulent orders. When a potentially fraudulent order is identified, users
        must provide detailed order information through the customer support interface. The submitted
        case is triaged by Shoplite’s dedicated fraud team, which assesses the risk level using historical
        data, machine-learning risk scoring, and rule-based checks. High-risk orders may be held for
        verification before shipment or payment release. The fraud team works closely with payment
        processors and internal monitoring systems to ensure that fraudulent activities are intercepted
        efficiently. Sellers are notified about actions taken and may be asked to provide additional
        documentation or evidence to aid in the investigation. Shoplite also tracks patterns of repeated
        suspicious behavior, allowing proactive measures to prevent future fraud. The support flow ensures
        that reports are handled systematically, transparently, and in compliance with PCI-DSS and
        consumer protection regulations. Users are encouraged to report any abnormal transactions promptly,
        and the fraud team prioritizes high-risk cases to minimize financial losses for both buyers and sellers.
        By integrating a structured support flow, dedicated fraud team, and triaging mechanisms, Shoplite
        maintains marketplace trust, mitigates risks, and ensures that legitimate transactions proceed safely."""
    },
    {
        "id": "doc7",
        "title": "Shoplite Product Listing Guidelines",
"content": """Shoplite provides REST API access for developers and enterprise clients, allowing
        integration with inventory, orders, and payment reconciliation. API keys are required for authentication,
        and each key is subject to rate limits to ensure system stability and fair usage across all clients.
        Details of rate limits depend on the API key tier and can be found in the official API documentation.
        Developers are strongly encouraged to implement exponential backoff strategies when requests exceed
        thresholds, to reduce throttling and maintain operational continuity. The API supports endpoints for
        product uploads, inventory updates, order retrieval, and payout tracking. SDKs for popular languages
        including Python, Java, and JavaScript provide additional convenience for integrating with Shoplite’s
        platform. Error handling, logging, and monitoring are recommended best practices to ensure reliable
        API consumption. By enforcing rate limits, validating API keys, and using exponential backoff strategies,
        Shoplite protects platform integrity while enabling developers to build scalable, automated solutions
        efficiently and safely."""
    },
    {
        "id": "doc8",
        "title": "Shoplite Vendor Dashboard",
 "content": """Shoplite requires that returns are always authorized before shipment back to the seller.
        Buyers must request return authorization through their order page, providing reasons and supporting
        evidence such as photos for defective or misrepresented items. Once authorized, the item must be
        shipped according to seller instructions. Upon receipt, the item undergoes inspection to verify
        condition, completeness, and compliance with the return policy. Refunds are then issued to the original
        payment method, and processing may take several business days depending on the payment provider.
        Shoplite monitors all returns and refunds to ensure sellers comply with policies and maintain quality
        standards. Unauthorized returns are rejected, and buyers are guided through the correct procedures.
        The system integrates with order tracking and buyer notifications to maintain transparency throughout
        the process. Returns and refunds management includes auditing logs, dispute resolution support, and
        fraud detection to prevent misuse. By combining return authorization, inspection, and structured
        refund issuance, Shoplite ensures buyers are protected while sellers can manage returns efficiently,
        preserving trust across the marketplace ecosystem."""
    },
    {
        "id": "doc9",
        "title": "Shoplite Inventory Management",
"content": """Shoplite enables sellers to manage inventory programmatically through multiple
        channels. The REST API allows real-time updates to product availability, pricing, and descriptions.
        Sellers can also perform bulk updates using CSV uploads, which simplifies large-scale inventory
        management for extensive catalogs. Webhooks provide notifications about changes in orders, stock
        levels, or product status, allowing external systems to synchronize automatically. Integration with
        inventory management software or ERP systems is supported, ensuring accurate, consistent data
        across multiple sales channels. The platform validates data to prevent overselling or inconsistent
        inventory states. Sellers are advised to monitor webhook logs and API responses for errors and
        confirmation of successful updates. The combination of REST API, CSV uploads, and webhooks empowers
        sellers to efficiently control stock, respond to market demand, and maintain accurate product
        availability information for buyers. By leveraging these tools, Shoplite ensures operational efficiency,
        minimizes order errors, and supports scalable growth for sellers of all sizes."""
    },
    {
        "id": "doc10",
        "title": "Shoplite Buyer Protection Program",
"content": """Most items sold on Shoplite fall under a standard 30-day return window. This period
        starts from the date of delivery to the buyer and applies to new, unused, and properly packaged items.
        Sellers may specify exceptions, which are clearly communicated in product listings. During this window,
        buyers can request return authorization, follow instructions for returning items, and receive refunds
        after inspection. The 30-day return window balances buyer protection with operational efficiency for
        sellers, reducing long-term disputes and maintaining marketplace trust. Shoplite integrates tracking
        systems and notifications to guide buyers through the return process, ensuring transparency and
        accountability. By standardizing the 30-day return window, Shoplite establishes predictable rules
        for returns and refunds while allowing sellers to manage exceptions responsibly."""
    },
    {
        "id": "doc11",
        "title": "Shoplite Vendor Onboarding Program",
"content": """By offering 2FA, Shoplite strengthens overall platform security and builds user confidence in the marketplace. Enabling this feature helps safeguard buyer information, protects seller accounts, and reduces the likelihood of fraudulent transactions or unauthorized changes to account data. Through a combination of user-friendly setup, reliable verification options, and secure recovery mechanisms, Shoplite ensures that accounts remain protected without compromising usability or accessibility.
"""
    },
    {
        "id": "doc12",
        "title": "Shoplite Customer Support System",
"content": """Shoplite provides sellers with comprehensive and flexible shipping configuration options, enabling precise control over how products are delivered to buyers. Sellers can define zone-based shipping rates tailored to different geographic regions, establish flat rates for specific shipping methods, or integrate dynamic carrier-calculated rates through real-time logistics APIs. This flexibility ensures that shipping costs are accurately calculated, reflecting both regional variations and the chosen delivery method.
The platform supports multiple fulfillment strategies, including merchant-fulfilled shipments and third-party logistics (3PL) providers. Sellers can select the approach that best fits their operational capabilities, whether managing fulfillment internally or outsourcing to specialized logistics partners. By accommodating a variety of shipping workflows, Shoplite allows sellers to optimize delivery speed, cost, and reliability while maintaining consistency across orders.
Accurate shipping configuration also ties directly into Shoplite’s order tracking system. Delivery estimates, tracking updates, and notifications are automatically generated based on the configured shipping rules, keeping buyers informed throughout the fulfillment process. This transparency minimizes confusion, reduces the likelihood of disputes, and strengthens buyer confidence in the marketplace.
Sellers are encouraged to maintain clear and consistent shipping policies, including specifying processing times, handling fees, and regional restrictions. Well-defined configurations help manage buyer expectations, improve satisfaction, and prevent delays or misunderstandings."""
    },
    {
        "id": "doc13",
        "title": "Shoplite Fraud Detection and Security",
  "content": """Shoplite enforces a structured review moderation system to protect marketplace credibility and ensure that feedback remains authentic, relevant, and trustworthy. All customer review submissions pass through automated filters that scan for spam, offensive language, and suspicious patterns such as repetitive posting or artificially generated content. These filters serve as the first line of defense, allowing the platform to detect and block low-quality or potentially harmful reviews before they are published.
When a review is flagged by the automated system, it is escalated for manual review by trained moderators. This human oversight provides an additional safeguard to ensure accuracy in the moderation process. Moderators assess whether the content violates Shoplite’s community standards, review guidelines, or platform policies. Reviews found to be inappropriate, fraudulent, or manipulative are either removed or restricted from public visibility.
To strengthen authenticity, Shoplite applies a “Verified Purchase” badge to reviews submitted by customers who have completed a genuine transaction on the platform. This distinction helps buyers identify credible feedback and reduces the influence of fake or misleading reviews. By prioritizing verified reviews, the system enhances transparency and encourages trust in product evaluations.
Sellers are notified when reviews related to their products are removed, flagged, or moderated. This communication provides transparency and valuable feedback on how products are being perceived. Sellers gain insight into customer sentiment while also understanding the reasons behind moderation actions."""
    },
    {
        "id": "doc14",
        "title": "Shoplite Mobile App Features",
"content": """Shoplite supports multiple locales and currencies to enable seamless participation from international buyers and sellers. The platform is designed to adapt content dynamically for global markets, ensuring that users experience an interface that aligns with their preferred language, regional conventions, and currency standards. Product descriptions, interface text, and currency symbols are localized to major markets, reducing friction and making the marketplace accessible to a broader audience.
For sellers, localization provides flexibility in configuring listings. They can set country-specific prices, define shipping rules tailored to different regions, and upload translated product content. This allows sellers to maintain a unified catalog while still accommodating the unique expectations of buyers across multiple markets. Sellers benefit from centralized product management tools, which ensure consistency in their offerings, while still providing the ability to target international buyers with localized detail.
Buyers, in turn, experience a seamless shopping journey in their preferred language and currency. Pricing is automatically displayed with appropriate symbols and formatting, eliminating the need for manual conversions or guesswork. Localized product descriptions and interface elements increase clarity, foster trust, and improve the overall user experience. This reduces barriers to purchase, enhances accessibility, and ultimately improves conversion rates for sellers.
Beyond usability, Shoplite’s localization framework strengthens marketplace integrity by ensuring compliance with local standards and expectations. By adapting its interface and content to the cultural and economic context of each market, Shoplite provides a platform that feels both global and locally relevant."""
    },
    {
        "id": "doc15",
        "title": "Shoplite Advertising Solutions",
 "content": """Shoplite maintains comprehensive audit logs to ensure accountability and traceability across the platform. These logs capture detailed records of all administrative actions, including user management tasks, payment adjustments, and content modifications. Every action is stored with a timestamp, user identifier, and description of the event, creating a transparent history of changes that supports oversight and security.
By default, audit logs are retained for 90 days. However, Shoplite acknowledges that in certain jurisdictions or under specific legal requirements, longer retention periods may be mandated. In such cases, log storage policies are extended to meet compliance obligations while preserving the integrity of recorded data. This flexibility allows Shoplite to align with global regulatory frameworks and maintain adherence to industry best practices.
Audit logs serve multiple operational and security purposes. For administrators, they provide a reliable record of system changes and policy enforcement, enabling effective operational oversight. Security teams rely on the logs for proactive monitoring, forensic investigations, and incident response, ensuring that any unauthorized or suspicious activities can be quickly detected and analyzed.
The presence of audit logs also supports dispute resolution. In cases where actions are contested—such as account modifications, payment changes, or policy enforcement—logs provide verifiable evidence of what occurred and when. This transparency reduces uncertainty, strengthens accountability, and protects both platform operators and users from unjust claims.
By combining structured recordkeeping with secure retention practices, Shoplite ensures that audit logs contribute to compliance, operational resilience, and trust across the marketplace. The system balances regulatory requirements with business needs, offering a robust tool for oversight while safeguarding the integrity of administrative processes."""
    },
    {
        "id": "doc16",
        "title": "Shoplite Loyalty and Rewards Program",
"content": """Shoplite provides structured tools and processes to manage chargebacks, ensuring that disputed transactions are handled fairly and efficiently. A chargeback occurs when a buyer contests a payment through their financial institution, often claiming issues such as non-receipt of goods, defective products, or unauthorized charges. To address these disputes, Shoplite equips sellers with the ability to gather and submit evidence directly through the platform. This evidence may include order invoices, shipment tracking information, delivery confirmations, and relevant buyer communications that demonstrate the legitimacy of the transaction.
Once a chargeback is initiated, Shoplite mediates the dispute between the buyer, the seller, and the payment processor. During this period, funds associated with the contested transaction may be temporarily placed on hold to ensure neutrality until the case is resolved. This prevents premature financial loss for one party while maintaining fairness for both sides. The mediation process is designed to be transparent and structured, providing clear timelines and requirements for evidence submission.
For sellers, effective chargeback management is critical to protecting revenue and maintaining trust in the platform. By offering a clear path to defend against unjust claims, Shoplite reduces the risk of fraudulent or unfounded disputes resulting in financial losses. For buyers, the process reinforces confidence that legitimate concerns will be taken seriously and addressed appropriately.
Beyond individual cases, chargeback management contributes to overall marketplace integrity. By balancing protections for both buyers and sellers, Shoplite ensures that contested payments are resolved fairly, discouraging abuse while fostering accountability. The system encourages responsible transactions, reduces disputes, and strengthens trust across the ecosystem."""
    },
    {
        "id": "doc17",
        "title": "Shoplite Analytics and Reporting",
 "content": """Shoplite enforces strict coupon stacking and exclusion rules during the checkout process to ensure discounts are applied fairly and in accordance with merchant policies. Merchants have the flexibility to define how multiple promotional codes can be combined, whether they can be stacked together, or if certain discounts should be applied exclusively. Once these rules are configured, the platform automatically validates them in real time whenever a customer attempts to apply one or more coupons to their purchase.
This automated validation plays a critical role in maintaining pricing accuracy. By preventing unauthorized stacking or conflicting discounts, Shoplite ensures that promotions are applied correctly and that sellers retain control over their intended pricing strategies. For example, a merchant may allow a seasonal discount to be combined with free shipping but restrict its use alongside a high-value promotional code. Shoplite enforces these conditions consistently, eliminating ambiguity at checkout and reducing the risk of revenue loss.
In addition to protecting merchants, these rules safeguard buyer confidence by ensuring transparency in how discounts are applied. Customers see clear messaging about which coupons are valid, which cannot be combined, and why certain codes may be rejected. This clarity minimizes frustration, sets accurate expectations, and prevents disputes related to pricing or promotions.
The flexibility of coupon stacking rules also supports diverse promotional strategies. Sellers can encourage sales with targeted combinations of discounts while still preserving profit margins and preventing misuse. By balancing merchant flexibility with system safeguards, Shoplite strengthens the integrity of its marketplace and delivers a consistent, trustworthy checkout experience.
Through its structured enforcement of coupon stacking and exclusion policies, Shoplite enables sellers to design effective promotions while ensuring fairness, accuracy, and transparency for buyers. This system protects both sides of the marketplace and reinforces trust in Shoplite’s commerce ecosystem.
"""
    },
    {
        "id": "doc18",
        "title": "Shoplite API Integration",
 "content": """Shoplite has structured processes in place to handle order delays caused by carriers. When a delay is detected, the system automatically triggers support workflows designed to manage exceptions efficiently. These workflows ensure that both buyers and sellers are kept informed and that issues are resolved in a timely and transparent manner.
Customers experiencing a delay have access to support options directly through the platform. Depending on the seller’s policies, they may request status updates, file inquiries, or initiate refund requests. By centralizing these options, Shoplite reduces confusion and gives customers clear, actionable choices when a delivery does not proceed as expected.
Real-time tracking forms a core part of the delay management system. Shoplite continuously updates order status information, notifying buyers and sellers whenever there is a change. These updates allow customers to monitor the progress of their shipment and provide sellers with visibility into potential delivery issues. Proactive notifications not only keep all parties informed but also help prevent unnecessary disputes.
Transparency and responsiveness are central to maintaining trust in the marketplace. By structuring its response to delays, Shoplite minimizes customer frustration and reassures buyers that their concerns are being addressed. At the same time, sellers benefit from streamlined communication channels that reduce the burden on their own support operations.
In the event that delays escalate, Shoplite’s system ensures that any refunds or compensations are processed according to policy, balancing fairness for buyers while respecting seller terms. This structured approach safeguards marketplace reliability, reinforces accountability, and supports long-term trust between all participants."""
    },
    {
        "id": "doc19",
        "title": "Shoplite Compliance and Legal Policies",
   "content": """Shoplite enforces strict compliance and legal policies to ensure secure and responsible use of its platform. A central part of these policies is the management of API keys, which act as secure credentials for developers integrating with Shoplite services. To obtain an API key, developers must create an account and request access through the Shoplite Developer Portal. Each key is uniquely issued and linked to specific permissions, scopes, and rate limits, ensuring that developers only access the resources they are authorized to use.
API keys provide programmatic access to critical platform features, including inventory management, order processing, and payments. Because of the sensitivity of these operations, Shoplite requires that keys be stored securely and never exposed in public repositories, client-side applications, or other unsecured environments. Developers are responsible for rotating keys periodically, revoking unused or compromised keys, and treating them with the same level of caution as other confidential credentials.
All activity conducted with an API key is logged and monitored by Shoplite. This monitoring enforces rate limits, detects unusual usage patterns, and ensures compliance with platform policies. By linking actions directly to specific keys, Shoplite maintains accountability and supports adherence to data protection regulations and industry standards for online commerce. In cases where keys are misused, shared, or exploited, Shoplite reserves the right to suspend or revoke access immediately.
Compliance extends beyond technical requirements to legal obligations as well. Developers must follow Shoplite’s Terms of Service and data protection policies, ensuring that integrations remain secure and aligned with regulatory frameworks. Failure to comply can result in restricted access, termination of integrations, or further legal consequences."""
    },
    {
        "id": "doc20",
        "title": "Shoplite Future Roadmap",
    "content": """Shoplite employs a layered approach to fraud prevention that combines both traditional rule-based checks and advanced machine-learning risk scoring. This dual strategy ensures that suspicious activities are flagged quickly and accurately, minimizing the risk of fraudulent transactions while maintaining trust and confidence across the platform.
The rule-based system relies on predefined conditions and thresholds to catch obvious red flags. For instance, it can detect repeated failed login attempts, unusually high purchase amounts, or mismatched billing and shipping addresses. These straightforward checks provide an initial layer of defense, filtering out clear risks before they can impact the system.
Beyond that, Shoplite integrates machine-learning models that continuously analyze vast amounts of behavioral and transactional data. These models identify subtle patterns that may indicate fraudulent activity, such as unusual purchase frequencies, location inconsistencies, or deviations from a customer’s typical spending behavior. Because the models learn and adapt over time, they become more effective at spotting new or evolving fraud tactics that static rules alone may miss.
Shoplite also enhances its fraud prevention capabilities by connecting with external identity and verification sources. This integration provides additional confirmation of user authenticity, further reducing the chances of account takeovers or identity-based fraud. When potential risks are detected, the system responds dynamically—triggering alerts, placing temporary holds, or requiring extra verification steps such as multi-factor authentication.
These safeguards are designed to strike a balance between security and user experience. By applying interventions proportionally to the level of detected risk, Shoplite ensures that genuine buyers and sellers can continue transacting smoothly without unnecessary disruptions. At the same time, fraudulent attempts are intercepted before they cause harm."""
    }
]
# ===============================
# Cell 4: Prompts (direct Python dicts)
# ===============================
PROMPTS = {
    "base_retrieval_prompt": {
        "role": "You are a helpful Shoplite customer service assistant.",
        "goal": "Provide accurate answers using only the provided Shoplite documentation.",
        "context_guidelines": [
            "Use only information from the provided document snippets",
            "Cite specific documents when possible"
        ],
        "response_format": "Answer: [Your response based on context]\nSources: [List document titles referenced]"
    },
    "complex_multi_doc_prompt": {
        "role": "You are a Shoplite knowledge synthesis assistant.",
        "goal": "Synthesize information from multiple documents to answer complex questions, and list supporting documents.",
        "context_guidelines": [
            "If multiple documents provide partial answers, combine them and cite each source",
            "If no sufficient context is found, say so and ask for clarification"
        ],
        "response_format": "Answer: [Synthesis]\nSources: [Doc titles]"
    },
    "refusal_and_clarification_prompt": {
        "role": "You are a safe Shoplite assistant that refuses to answer when outside scope.",
        "goal": "Refuse to answer when the knowledge base lacks relevant context or when the request involves PII or policy violations.",
        "context_guidelines": [
            "If requested data is not in the knowledge base, respond with a refusal and a short explanation",
            "When user query is ambiguous, ask one clarifying question"
        ],
        "response_format": "Answer: [Refusal or Clarification]\nReason: [Short rationale]"
    },
    "short_customer_facing_snippet": {
        "role": "You are a concise Shoplite customer assistant.",
        "goal": "Provide short, actionable answers suitable for UI tooltips or quick replies.",
        "context_guidelines": [
            "Limit answers to 2-3 sentences",
            "Include a single actionable next step when possible"
        ],
        "response_format": "Answer: [2-3 sentence reply]\nActions: [Optional next step]"
    }
}

print("Available prompts:", list(PROMPTS.keys()))

print(f"Loaded {len(KNOWLEDGE_BASE)} KB docs (manually defined)")
# ===============================
# 3) LOAD LLM (FLAN-T5 Large)
# ===============================
print("Loading FLAN-T5 small")
model_name = "google/flan-t5-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto" if torch.cuda.is_available() else None
)
llm_pipeline = pipeline(
    "text2text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=512
)
print("✅ FLAN-T5 loaded")

# ===============================
# 4) EMBEDDINGS + FAISS
# ===============================
print("Building FAISS index…")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
corpus = [doc["content"] for doc in KNOWLEDGE_BASE]
doc_embeddings = embedder.encode(corpus, convert_to_numpy=True, show_progress_bar=False)
dimension = doc_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(doc_embeddings)
print(f"✅ FAISS ready (docs: {len(KNOWLEDGE_BASE)})")

def retrieve_docs(query, top_k=3):
    query_embedding = embedder.encode([query], convert_to_numpy=True)
    distances, indices = index.search(query_embedding, top_k)
    results = [KNOWLEDGE_BASE[i] for i in indices[0]]
    best_dist = float(distances[0][0]) if distances.size > 0 else 99.0
    return results, best_dist

def build_prompt(query, prompt_type, retrieved):
    if not prompt_type or prompt_type not in PROMPTS:
        prompt_type = "base_retrieval_prompt"
    prompt_cfg = PROMPTS[prompt_type]
    context_text = "\n\n".join([f"{d['title']}: {d['content']}" for d in retrieved])
    return f"""{prompt_cfg['role']}
Goal: {prompt_cfg['goal']}

Context Guidelines:
- {'; '.join(prompt_cfg['context_guidelines'])}

User Query: {query}

Context:
{context_text}

{prompt_cfg['response_format']}
"""

def generate_response(query, prompt_type=None):
    retrieved, best_dist = retrieve_docs(query)
    prompt = build_prompt(query, prompt_type, retrieved)

    out = llm_pipeline(prompt, max_new_tokens=300)[0]["generated_text"]

    if best_dist < 0.5:
        confidence = "high"
    elif best_dist < 1.0:
        confidence = "mid"
    else:
        confidence = "low"

    return {
        "answer": out,
        "sources": [d["title"] for d in retrieved],
        "confidence": confidence
    }

# ===============================
# 5) FLASK API
# ===============================
app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    query = data.get("query", "")
    prompt_type = data.get("prompt_type") or "base_retrieval_prompt"
    result = generate_response(query, prompt_type)
    return jsonify(result)

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "LLM alive!"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "docs_loaded": len(KNOWLEDGE_BASE)})

# ===============================
# 6) START SERVER + NGROK
# ===============================
def run_flask():
    app.run(host="0.0.0.0", port=PORT, use_reloader=False)

def main():
    # start Flask in a thread
    t = Thread(target=run_flask, daemon=True)
    t.start()
    time.sleep(1.5)

    # start ngrok
    from pyngrok import ngrok, conf
    if NGROK_TOKEN:
        conf.get_default().auth_token = NGROK_TOKEN
    public_url = ngrok.connect(PORT).public_url
    print(f"✅ Public URL: {public_url}")
    print("Health:", public_url + "/health")

    # keep process alive
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        print("Shutting down…")
        ngrok.kill()

if __name__ == "__main__":
    main()