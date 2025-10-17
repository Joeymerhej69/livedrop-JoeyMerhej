import express from "express";
import {
  getCustomerByEmail,
  getCustomerById,
} from "../controllers/customerController.js";

const router = express.Router();

/**
 * GET /api/customers?email=user@example.com
 * Look up customer by email
 */
router.get("/", getCustomerByEmail);

/**
 * GET /api/customers/:id
 * Get customer profile by ID
 */
router.get("/:id", getCustomerById);

export default router;
