import {
  getDailyRevenue,
  getDashboardMetrics,
} from "../services/analyticsService.js";

/**
 * GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function fetchDailyRevenue(req, res) {
  try {
    // Default to last 7 days if no query params
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const from = req.query.from || sevenDaysAgo.toISOString().split("T")[0];
    const to = req.query.to || today.toISOString().split("T")[0];

    const result = await getDailyRevenue(from, to);

    // ✅ Make sure to return an array, not an object
    res.json(Array.isArray(result) ? result : []);
  } catch (err) {
    console.error("Error fetching daily revenue:", err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/analytics/dashboard-metrics
 */
export async function fetchDashboardMetrics(req, res) {
  try {
    const metrics = await getDashboardMetrics();
    res.json(metrics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
