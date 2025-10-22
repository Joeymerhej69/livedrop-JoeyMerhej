// /apps/api/src/assistant/function-registry.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

export class FunctionRegistry {
  constructor() {
    this.registry = new Map();
  }

  register(name, handler) {
    this.registry.set(name, handler);
  }

  async execute(name, args) {
    if (!this.registry.has(name)) throw new Error(`Unknown function: ${name}`);
    return await this.registry.get(name)(args);
  }
}

export function setupFunctionRegistry() {
  const reg = new FunctionRegistry();

  // ✅ 1. Get Order Status
  reg.register("getOrderStatus", async ({ orderId }) => {
    const order = await Order.findById(orderId);
    if (!order) return { found: false };
    return {
      found: true,
      status: order.status,
      carrier: order.carrier,
      eta: order.estimatedDelivery,
    };
  });

  // ✅ 2. Search Products
  reg.register("searchProducts", async ({ query, limit = 5 }) => {
    const regex = new RegExp(query, "i");
    const products = await Product.find({ name: regex }).limit(limit);
    return products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      category: p.category,
    }));
  });

  // ✅ 3. Get Customer Orders
  reg.register("getCustomerOrders", async ({ email }) => {
    const customer = await Customer.findOne({ email }).lean();
    if (!customer) return { found: false, orders: [] };

    const orders = await Order.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // return only what the assistant needs to format responses
    const slim = orders.map((o) => ({
      _id: o._id,
      status: o.status,
      total: o.total,
      createdAt: o.createdAt,
    }));

    return { found: true, orders: slim };
  });

  return reg;
}
