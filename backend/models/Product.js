import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Furniture', 'Appliances'],
    },
    subcategory: {
      type: String,
      required: [true, 'Please specify a subcategory'],
      // e.g., Bed, Sofa, Table, Chair, Fridge, Washing Machine, TV, Microwave, Air Conditioner
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one product image URL'],
    },
    baseRent: {
      type: Number,
      required: [true, 'Please add a base monthly rent'],
    },
    deposit: {
      type: Number,
      required: [true, 'Please add a security deposit'],
    },
    // Map of tenure options to pricing multiplier
    // Key: tenure in months (e.g. "3", "6", "12", "24")
    // Value: percentage of baseRent (e.g. 1.0, 0.85, 0.70, 0.60)
    tenureRates: {
      type: Map,
      of: Number,
      default: {
        '3': 1.0,
        '6': 0.85,
        '12': 0.70,
        '24': 0.60,
      },
    },
    inventory: {
      type: Number,
      required: [true, 'Please specify total inventory count'],
      default: 5,
    },
    rentedCount: {
      type: Number,
      default: 0,
    },
    citiesAvailable: {
      type: [String],
      default: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
