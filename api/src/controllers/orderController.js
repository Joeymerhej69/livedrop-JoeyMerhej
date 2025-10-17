import {
  createOrder,
  getOrderById,
  getOrdersByCustomer,
} from "../services/orderService.js";

/**
 * POST /api/orders
 */
export async function addOrder(req, res) {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

/**
 * GET /api/orders/:id
 */
export async function fetchOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/orders?customerId=:customerId
 */
export async function fetchOrdersByCustomer(req, res) {
  try {
    const { customerId } = req.query;
    if (!customerId)
      return res
        .status(400)
        .json({ message: "customerId query parameter is required" });

    const orders = await getOrdersByCustomer(customerId);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
