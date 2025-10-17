import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import registerOrderStatusSSE from "./sse/order-status.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error(err));

// Test route
app.get("/", (req, res) => res.send("API Running 🚀"));
// Global SSE connection counter
global.activeSSEConnections = 0;

// Example SSE endpoint
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  global.activeSSEConnections++;
  console.log("🔌 SSE Client connected:", global.activeSSEConnections);

  req.on("close", () => {
    global.activeSSEConnections--;
    console.log("❌ SSE Client disconnected:", global.activeSSEConnections);
  });
});

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const latency = diff[0] * 1000 + diff[1] / 1e6; // ms
    totalLatency += latency;
    requestCount++;
  });
  next();
});

// Use Customer routes
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
registerOrderStatusSSE(app);

let totalLatency = 0;
let requestCount = 0;

export function getAverageLatency() {
  return requestCount ? totalLatency / requestCount : 0;
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
