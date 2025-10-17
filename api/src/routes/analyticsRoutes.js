import express from "express";
import {
  fetchDailyRevenue,
  fetchDashboardMetrics,
} from "../controllers/analyticsController.js";

const router = express.Router();

// GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/daily-revenue", fetchDailyRevenue);

// GET /api/analytics/dashboard-metrics
router.get("/dashboard-metrics", fetchDashboardMetrics);

export default router;
