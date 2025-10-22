// Real API connection replacing the mock in-memory API

export type Product = {
  id: string
  title: string
  price: number
  image: string
  tags: string[]
  stockQty: number
  description?: string
}

export type Order = {
  orderId: string
  status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered'
  carrier?: string
  eta?: string
}
// lib/api.ts
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

/**
 * Place a real order in MongoDB
 */
export async function placeOrderForCustomer(
  customerId: string,
  cart: { id: string; qty: number }[],
  products: any[]
) {
  // Map cart to include names, prices, etc.
  const items = cart.map((line) => {
    const product = products.find((p) => p.id === line.id);
    return {
      productId: line.id,
      name: product?.title || "Unknown",
      price: product?.price || 0,
      quantity: line.qty,
    };
  });

  // Calculate total
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId,
      items,
      total,
      status: "PENDING",
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to place order: ${msg}`);
  }

  return await res.json(); // { ...order }
}


/**
 * Fetch all products from backend
 */
export async function listProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products/all`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
    const data = await res.json();

    // Map MongoDB fields to your frontend structure
    return data.map((p: any) => ({
      id: p._id,
      title: p.name,
      price: p.price,
      image: p.imageUrl,
      tags: p.tags || [],
      stockQty: p.stock ?? 0,
      description: p.description,
    }));
  } catch (err) {
    console.error("Error loading products:", err);
    return [];
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);
    const p = await res.json();

    return {
      id: p._id,
      title: p.name,
      price: p.price,
      image: p.imageUrl,
      tags: p.tags || [],
      stockQty: p.stock ?? 0,
      description: p.description,
    };
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}

/**
 * Place order (mocked locally for now)
 */
let orders: Record<string, Order> = {};


// export function placeOrder(_cart: { id: string; qty: number }[]): Promise<{ orderId: string }> {
//   const orderId = makeOrderId();
//   const placed: Order = { orderId, status: 'Placed' };
//   orders[orderId] = placed;

//   setTimeout(() => (orders[orderId].status = 'Packed'), 5000);
//   setTimeout(() => {
//     orders[orderId].status = 'Shipped';
//     orders[orderId].carrier = 'AcmeShip';
//     const eta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
//     orders[orderId].eta = eta.toISOString().slice(0, 10);
//   }, 10000);
//   setTimeout(() => (orders[orderId].status = 'Delivered'), 15000);

//   return Promise.resolve({ orderId });
// }

/**
 * Get order status (mocked)
 */
export function getOrderStatus(orderId: string): Promise<Order | null> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const order = orders[orderId];
      resolve(order ? { ...order } : null);
    }, 120)
  );
}

/**
 * Check if a customer exists by email
 */
export async function checkCustomerByEmail(email: string) {
  const res = await fetch(`${API_BASE}/customers?email=${encodeURIComponent(email)}`);

  if (res.status === 404) {
    // Customer not found — return null instead of throwing
    return null;
  }

  if (!res.ok) {
    // Handle other errors (500, 400, etc.)
    throw new Error(`Failed to check customer: ${res.statusText}`);
  }

  const data = await res.json();
  return data; // Found customer object
}
