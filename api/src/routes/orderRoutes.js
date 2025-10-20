import express from "express";
import {
  addOrder,
  fetchOrderById,
  fetchOrdersByCustomer,
} from "../controllers/orderController.js";
import Order from "../models/Order.js";

const router = express.Router();

// POST /api/orders
router.post("/", addOrder);

// GET /api/orders/:id
router.get("/:id", fetchOrderById);

// GET /api/orders?customerId=...
router.get("/", fetchOrdersByCustomer);

/**
 * SSE Endpoint: GET /api/orders/:id/stream
 * Simulates real-time order status updates
 */
router.get("/:id/stream", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // ✅ Increment global SSE counter
    global.activeSSEConnections = (global.activeSSEConnections || 0) + 1;
    console.log(`🟢 Client connected to order stream for ${id}`);
    console.log(`🌐 Active SSE connections: ${global.activeSSEConnections}`);

    // Helper to send SSE events
    const sendEvent = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Send the current order status immediately
    sendEvent({
      orderId: id,
      status: order.status,
      timestamp: new Date(),
    });

    // Define order status flow
    const flow = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
    let currentIndex = flow.indexOf(order.status);
    if (currentIndex < 0) currentIndex = 0;

    // Function to advance order status
    const advanceStatus = async () => {
      if (currentIndex < flow.length - 1) {
        currentIndex++;
        const newStatus = flow[currentIndex];

        await Order.findByIdAndUpdate(id, {
          status: newStatus,
          updatedAt: new Date(),
        });

        sendEvent({
          orderId: id,
          status: newStatus,
          timestamp: new Date(),
        });

        console.log(`🚚 Order ${id} → ${newStatus}`);

        // Close the stream when delivered
        if (newStatus === "DELIVERED") {
          clearInterval(interval);
          // ✅ Decrement global SSE counter
          global.activeSSEConnections = Math.max(
            0,
            (global.activeSSEConnections || 1) - 1
          );
          console.log(`✅ Order ${id} delivered — stream closed`);
          console.log(
            `🌐 Active SSE connections: ${global.activeSSEConnections}`
          );

          res.write("event: close\n");
          res.write("data: Stream closed - order delivered\n\n");
          res.end();
        }
      }
    };

    // Generate random interval for each step (3–7s)
    const randomDelay = () => Math.floor(Math.random() * 4000) + 3000;
    const interval = setInterval(advanceStatus, randomDelay());

    // Handle client disconnect
    req.on("close", () => {
      clearInterval(interval);
      // ✅ Decrement global counter on disconnect
      global.activeSSEConnections = Math.max(
        0,
        (global.activeSSEConnections || 1) - 1
      );
      console.log(`❌ Client disconnected from order stream for ${id}`);
      console.log(`🌐 Active SSE connections: ${global.activeSSEConnections}`);
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent)
      res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
