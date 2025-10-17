import {
  getDailyRevenue,
  getDashboardMetrics,
} from "../services/analyticsService.js";

/**
 * GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function fetchDailyRevenue(req, res) {
  try {
    const { from, to } = req.query;
    if (!from || !to)
      return res
        .status(400)
        .json({ message: "from and to query parameters are required" });

    const revenue = await getDailyRevenue(from, to);
    res.json(revenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
