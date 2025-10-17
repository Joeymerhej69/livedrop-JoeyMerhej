import express from "express";
import {
  fetchBusinessMetrics,
  fetchPerformanceMetrics,
  fetchAssistantStats,
} from "../controllers/dashboardController.js";

const router = express.Router();

// Revenue, orders, avg order value
router.get("/business-metrics", fetchBusinessMetrics);

// API latency, SSE connections
router.get("/performance", fetchPerformanceMetrics);

// Assistant stats: intent distribution, function calls
router.get("/assistant-stats", fetchAssistantStats);

export default router;
