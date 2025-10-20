import express from "express";
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  fetchAllProducts, // ✅ import the new controller
} from "../controllers/productController.js";

const router = express.Router();

// ✅ GET /api/products/all — Get all products (no filters)
router.get("/all", fetchAllProducts);

// GET /api/products?search=&tag=&sort=&page=&limit=
router.get("/", fetchProducts);

// GET /api/products/:id
router.get("/:id", fetchProductById);

// POST /api/products
router.post("/", addProduct);

export default router;
