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

// --- ✅ PERFORMANCE METRICS SETUP ---
let totalLatency = 0;
let requestCount = 0;
global.activeSSEConnections = 0;

// Middleware to measure API latency
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

// Exported function so dashboard can access it
export function getAverageLatency() {
  return requestCount ? totalLatency / requestCount : 0;
}

// --- ✅ OPTIONAL: Test SSE connections (demo endpoint) ---
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  global.activeSSEConnections++;
  console.log("🔌 SSE Client connected:", global.activeSSEConnections);

  const interval = setInterval(() => {
    res.write(
      `data: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`
    );
  }, 3000);

  req.on("close", () => {
    clearInterval(interval);
    global.activeSSEConnections--;
    console.log("❌ SSE Client disconnected:", global.activeSSEConnections);
  });
});

// --- ✅ DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error(err));

// --- ✅ ROUTES ---
app.get("/", (req, res) => res.send("API Running 🚀"));
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// SSE stream for order updates
registerOrderStatusSSE(app);

// --- ✅ SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
