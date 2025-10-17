import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import { getAverageLatency } from "../index.js"; // imported from middleware in app.js

/**
 * Business Metrics
 * Revenue, orders, and average order value
 */
export async function getBusinessMetrics() {
  const totalOrders = await Order.countDocuments();

  // Calculate total revenue
  const totalRevenueAgg = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
  ]);
  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

  // Calculate average order value
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalOrders,
    avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
  };
}

/**
 * Performance Metrics
 * Real API latency (tracked via middleware)
 * Real SSE connection count (tracked globally)
 */
export async function getPerformanceMetrics() {
  const apiLatency = getAverageLatency(); // calculated in app.js middleware
  const sseConnections = global.activeSSEConnections || 0;

  return {
    apiLatency: parseFloat(apiLatency.toFixed(2)), // in milliseconds
    sseConnections,
  };
}

/**
 * Assistant Stats (based on real data)
 * Could be extended to analyze intent logs if stored in DB
 * For now, derive from Orders and Products activity
 */
export async function getAssistantStats() {
  const totalOrders = await Order.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Example: derive intent categories dynamically
  const intents = {
    order_status: totalOrders,
    customer_queries: totalCustomers,
    product_info: totalProducts,
  };

  // Derived function calls (example: internal analytics)
  const functionCalls = {
    createOrder: totalOrders,
    getCustomerInfo: totalCustomers,
    getProductInfo: totalProducts,
  };

  return {
    intents,
    functionCalls,
  };
}
