# 📘 System Design – README

## 📖 Overview

This system is designed to support a **high-traffic product drop platform** with features such as:

- Real-time product releases ("drops").
- Secure order processing with idempotency.
- Social features (follow/unfollow creators).
- Scalable notification delivery via WebSockets and push (FCM).

The architecture is **microservices-based**, combining **synchronous RPC** for critical paths and **asynchronous Kafka events** for scalability and decoupling.  
Caching is handled through **Redis Cluster**, while **API Gateway** provides **load balancing, rate limiting, and authentication enforcement**.

---

## 🔹 API Contract Outline

### **Public APIs** (via API Gateway)

The **API Gateway** is the single entry point for **Web clients** and **Mobile apps**. It provides:

- **Load Balancing** across service replicas.
- **Rate Limiting** to protect services from abuse.
- **Authentication** by validating JWT tokens.

#### Endpoints:

- **Auth Service**

  - `POST /auth/login` → Authenticate, return JWT token.
  - `POST /auth/refresh` → Refresh expired token.
  - `POST /auth/logout` → Invalidate session/token.

- **User Service**

  - `GET /users/{id}` → Fetch user profile.
  - `POST /users/{id}/follow` → Follow a user.
  - `DELETE /users/{id}/follow` → Unfollow a user.
  - **Webhooks** → Notify clients of profile or follow/unfollow changes.

- **Creator Service**

  - `GET /creators/{id}` → Fetch creator metadata.
  - `GET /creators/{id}/products` → List creator products.
  - `POST /creators/{id}/products` → Add products (creator only).

- **Drop Service**

  - `GET /drops/upcoming` → List upcoming drops.
  - `GET /drops/{id}` → Fetch drop details.
  - **WebSocket** → Subscribe to live drop announcements.

- **Order Service**

  - `POST /orders` → Place an order (requires idempotency key).
  - `GET /orders/{id}` → Fetch order status.

- **Notification Service**
  - **WebSocket / Push (FCM)** → Notify users of order updates, drops, and stock changes.

---

### **Internal APIs (RPC Connections)**

The system uses **RPC** for synchronous calls between services. The **Auth Service** acts as a **central trust authority** and communicates with all core services.

#### RPC interactions:

1. API Gateway → Auth Service (token validation).
2. Auth Service → User Service (identity, profile validation).
3. Auth Service → Creator Service (authenticate creator actions).
4. Auth Service → Drop Service (authorize scheduling & publishing).
5. Auth Service → Order Service (authenticate before placing orders).
6. Auth Service → Notification Service (validate sessions/subscriptions).
7. Drop Service → Order Service (sync drop states with orders).
8. Order Service → Notification Service (push order events).

---

### **Internal APIs (Event-driven via Kafka)**

Kafka ensures **loose coupling** and **scalable event distribution**.

- **Drop Service → Kafka**: Publishes `drop_events`.
- **Order Service → Kafka**: Publishes `order_events`.
- **Notification Service → Kafka**: Consumes `notification_events`.
- **Inventory changes → Kafka**: Broadcasts stock updates.

---

## 🔹 Caching & Invalidation Strategy

### **Redis Cluster**

Used for:

- **Hot stock counters** → Real-time stock tracking during drops.
- **Follower cache** → Speeds up social graph lookups.
- **Idempotency keys** → Prevents duplicate order submissions.

### **Invalidation Strategy**

- **Write-through caching (Orders/Stock)**

  - Order Service updates Redis counters immediately when orders are placed.
  - Periodic reconciliation with DB ensures consistency.

- **Event-driven invalidation (Kafka)**

  - `order_events`, `inventory_changes` trigger cache refreshes.

- **TTL-based eviction**
  - Idempotency keys: expire after a few minutes.
  - Follower cache: longer TTL, refreshed periodically or on change events.

---

## 🔹 Tradeoffs & Reasoning

### **API Gateway (Load Balancer + Rate Limiter)**

- ✅ Pros: Protects backend, enforces fair usage, balances requests across replicas.
- ⚠️ Cons: Must be deployed in high-availability mode to avoid single point of failure.

### **JWT Authentication**

- ✅ Pros: Stateless, scalable.
- ⚠️ Cons: Token revocation is hard → mitigated with short TTLs and refresh tokens.

### **RPC + Kafka Hybrid**

- ✅ RPC: Low-latency for critical synchronous flows (auth, orders).
- ✅ Kafka: Scalable async communication for drops, notifications, and inventory.
- ⚠️ Cons: Added complexity in managing two communication models.

### **Redis for Hot Stock + Idempotency**

- ✅ Pros: Sub-millisecond performance for high-traffic events.
- ⚠️ Cons: Requires reconciliation with DB for consistency.

### **Idempotency in Orders**

- ✅ Prevents duplicate orders during retries.
- ⚠️ Needs additional Redis storage for temporary keys.

### **Real-time Notifications**

- ✅ Improves UX with instant updates.
- ⚠️ Requires robust WebSocket infrastructure to handle disconnects and scaling.

---

## 🔹 Summary

This design achieves:

- **Scalability** → API Gateway, load balancing, Kafka event distribution.
- **Performance** → Redis caching for hot paths.
- **Reliability** → Idempotent orders, DB reconciliation.
- **Great UX** → Real-time WebSocket and FCM notifications.

By carefully combining **load balancing, rate limiting, caching, RPC, and event-driven messaging**, the system can handle **high-traffic product drops** reliably and at scale.

---
