import mongoose from "mongoose";
import Customer from "./src/models/Customer.js";
import Product from "./src/models/Product.js";
import Order from "./src/models/Order.js";

const MONGO_URI =
  "mongodb+srv://joeymerhej9_db_user:joeymerhej987321@cluster0.bwau4b1.mongodb.net/storeDB?retryWrites=true&w=majority&appName=Cluster0"; // change this
await mongoose.connect(MONGO_URI);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDateInPast(days = 30) {
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - getRandomInt(0, days));
  past.setHours(getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59));
  return past;
}

function getRandomFutureDate(fromDate, maxDaysAhead = 7) {
  const future = new Date(fromDate);
  future.setDate(fromDate.getDate() + getRandomInt(1, maxDaysAhead));
  return future;
}

async function seedOrders(numberOfOrders = 15) {
  const customers = await Customer.find();
  const products = await Product.find();

  const carriers = ["DHL", "FedEx", "UPS", "USPS"];
  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  const orders = [];

  for (let i = 0; i < numberOfOrders; i++) {
    const customer = getRandomItem(customers);

    const numberOfItems = getRandomInt(1, 5);
    const shuffledProducts = products.sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, numberOfItems);

    const items = selectedProducts.map((p) => ({
      productId: p._id,
      name: p.name,
      price: p.price,
      quantity: getRandomInt(1, 3),
    }));

    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const createdAt = getRandomDateInPast(30);
    const updatedAt = getRandomDateInPast(10);
    const estimatedDelivery = getRandomFutureDate(createdAt, 7);

    const order = {
      customerId: customer._id,
      items,
      total: parseFloat(total.toFixed(2)),
      status: getRandomItem(statuses),
      carrier: getRandomItem(carriers),
      estimatedDelivery,
      createdAt,
      updatedAt,
    };

    orders.push(order);
  }

  await Order.insertMany(orders);
  console.log(`${orders.length} orders seeded successfully!`);
  mongoose.disconnect();
}

seedOrders();
