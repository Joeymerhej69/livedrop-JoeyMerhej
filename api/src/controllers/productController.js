import {
  getProducts,
  getProductById,
  createProduct,
  getAllProducts,
} from "../services/productService.js";

/**
 * GET /api/products
 */
export async function fetchProducts(req, res) {
  try {
    const { search, tag, sort, page = 1, limit = 10 } = req.query;
    const products = await getProducts({ search, tag, sort, page, limit });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/products/:id
 */
export async function fetchProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/products
 */
export async function addProduct(req, res) {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}
/**
 * Controller: Get all products
 */
export async function fetchAllProducts(req, res) {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}
