import Order from "../models/Order.js";

/**
 * Create a new order
 * @param {Object} data
 */
export async function createOrder(data) {
  const order = new Order(data);
  return await order.save();
}

/**
 * Get an order by ID
 * @param {string} id
 */
export async function getOrderById(id) {
  return await Order.findById(id)
    .populate("customerId", "name email")
    .populate("items.productId", "name price");
}

/**
 * Get all orders for a specific customer
 * @param {string} customerId
 */
export async function getOrdersByCustomer(customerId) {
  return await Order.find({ customerId })
    .populate("customerId", "name email")
    .populate("items.productId", "name price")
    .sort({ createdAt: -1 });
}
