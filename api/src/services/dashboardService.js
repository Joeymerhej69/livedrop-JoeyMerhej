import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import { getAverageLatency } from "../index.js"; // imported from index.js

/**
 * Business Metrics
 */
export async function getBusinessMetrics() {
  const totalOrders = await Order.countDocuments();

  const totalRevenueAgg = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
  ]);
  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalOrders,
    avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
  };
}

/**
 * ✅ Performance Metrics (match frontend expectations)
 */
export async function getPerformanceMetrics() {
  const avgLatency = getAverageLatency(); // from middleware
  const activeSSE = global.activeSSEConnections || 0;

  return {
    avgLatency: parseFloat(avgLatency.toFixed(2)),
    activeSSE,
  };
}

/**
 * Assistant Stats
 */
export async function getAssistantStats() {
  const totalOrders = await Order.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  const totalProducts = await Product.countDocuments();

  const intents = [
    { intent: "order_status", count: totalOrders },
    { intent: "customer_queries", count: totalCustomers },
    { intent: "product_info", count: totalProducts },
  ];

  return { intents };
}
