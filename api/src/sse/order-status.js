import Order from "../models/Order.js";

export default function registerOrderStatusSSE(app) {
  // Store all connected clients
  const clients = new Set();

  // SSE endpoint
  app.get("/sse/order-status", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Add client
    clients.add(res);
    console.log(`🟢 Client connected (${clients.size} total)`);

    // Handle disconnects
    req.on("close", () => {
      clients.delete(res);
      console.log(`🔴 Client disconnected (${clients.size} remaining)`);
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
