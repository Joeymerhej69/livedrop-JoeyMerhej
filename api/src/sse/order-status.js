import Order from "../models/Order.js";

export default function registerOrderStatusSSE(app) {
  // Store all connected clients
  const clients = new Set();

  // SSE endpoint for order status updates
  app.get("/sse/order-status", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Add client
    clients.add(res);

    // ✅ Increment global connection counter
    global.activeSSEConnections = (global.activeSSEConnections || 0) + 1;
    console.log(`🟢 Client connected (${clients.size} total)`);
    console.log(`🌐 Global SSE count: ${global.activeSSEConnections}`);

    // Handle disconnects
    req.on("close", () => {
      clients.delete(res);

      // ✅ Decrement global counter
      global.activeSSEConnections = Math.max(
        0,
        (global.activeSSEConnections || 1) - 1
      );

      console.log(`🔴 Client disconnected (${clients.size} remaining)`);
      console.log(`🌐 Global SSE count: ${global.activeSSEConnections}`);
    });
  });

  // Watch for changes in MongoDB orders collection
  const changeStream = Order.watch();

  changeStream.on("change", (change) => {
    if (
      change.operationType === "update" ||
      change.operationType === "replace"
    ) {
      const orderId = change.documentKey._id;
      const updatedFields = change.updateDescription?.updatedFields || {};

      if (updatedFields.status) {
        const payload = JSON.stringify({
          orderId,
          newStatus: updatedFields.status,
          updatedAt: new Date(),
        });

        // Broadcast to all connected clients
        for (const client of clients) {
          client.write(`event: orderStatusUpdate\n`);
          client.write(`data: ${payload}\n\n`);
        }

        console.log(
          `📢 Order ${orderId} status changed to ${updatedFields.status}`
        );
      }
    }
  });
}
