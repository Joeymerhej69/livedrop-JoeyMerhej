import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  tags: [{ type: String }],
  imageUrl: { type: String },
  stock: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema);
