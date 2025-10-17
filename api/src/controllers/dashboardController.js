import {
  getBusinessMetrics,
  getPerformanceMetrics,
  getAssistantStats,
} from "../services/dashboardService.js";

/**
 * GET /api/dashboard/business-metrics
 */
export async function fetchBusinessMetrics(req, res) {
  try {
    const metrics = await getBusinessMetrics();
    res.json(metrics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/dashboard/performance
 */
export async function fetchPerformanceMetrics(req, res) {
  try {
    const metrics = await getPerformanceMetrics();
    res.json(metrics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/dashboard/assistant-stats
 */
export async function fetchAssistantStats(req, res) {
  try {
    const stats = await getAssistantStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
