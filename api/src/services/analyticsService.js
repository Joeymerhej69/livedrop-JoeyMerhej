import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";

/**
 * Get daily revenue between fromDate and toDate
 * Uses pure MongoDB aggregation (no JS loops)
 * Returns: [{ date, revenue, orderCount }]
 */
export async function getDailyRevenue(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // Full aggregation pipeline
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: fromDate, $lte: toDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        revenue: { $sum: "$total" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: { $round: ["$revenue", 2] },
        orderCount: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  return result;
}

/**
 * Get overall dashboard metrics
 * Uses MongoDB aggregation for total revenue
 */
export async function getDashboardMetrics() {
  const [orderStats] = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: "$total" },
      },
    },
  ]);

  const totalCustomers = await Customer.countDocuments();
  const totalProducts = await Product.countDocuments();

  return {
    totalRevenue: orderStats?.totalRevenue || 0,
    totalOrders: orderStats?.totalOrders || 0,
    avgOrderValue: orderStats?.avgOrderValue || 0,
    totalCustomers,
    totalProducts,
  };
}
