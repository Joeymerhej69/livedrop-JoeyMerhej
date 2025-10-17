import Product from "../models/Product.js";

/**
 * Get products with optional search, tag, sort, pagination
 */
export async function getProducts({ search, tag, sort, page = 1, limit = 10 }) {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (tag) {
    query.tags = tag;
  }

  let mongoQuery = Product.find(query);

  // Sorting
  if (sort === "price_asc") mongoQuery = mongoQuery.sort({ price: 1 });
  else if (sort === "price_desc") mongoQuery = mongoQuery.sort({ price: -1 });
  else if (sort === "name_asc") mongoQuery = mongoQuery.sort({ name: 1 });
  else if (sort === "name_desc") mongoQuery = mongoQuery.sort({ name: -1 });

  // Pagination
  const skip = (page - 1) * limit;
  mongoQuery = mongoQuery.skip(skip).limit(parseInt(limit));

  return await mongoQuery.exec();
}

/**
 * Get a product by ID
 */
export async function getProductById(id) {
  return await Product.findById(id);
}

/**
 * Create a new product
 */
export async function createProduct(data) {
  const product = new Product(data);
  return await product.save();
}
