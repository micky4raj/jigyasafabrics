import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  fabricAttributes: {
    material: String,
    weave: String,
    gsm: Number,
    widthInches: Number,
    pattern: String
  },
  pricePerMeter: { type: Number, required: true },
  stockMeters: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);