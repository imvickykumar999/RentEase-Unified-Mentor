import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import City from '../models/City.js';
import Order from '../models/Order.js';
import Maintenance from '../models/Maintenance.js';
import connectDB from '../config/db.js';

dotenv.config();

const cities = [
  { name: 'Bangalore', isActive: true },
  { name: 'Mumbai', isActive: true },
  { name: 'Delhi', isActive: true },
  { name: 'Pune', isActive: true },
  { name: 'Chennai', isActive: true },
];

const products = [
  {
    name: 'Queen Size Solid Wood Bed',
    category: 'Furniture',
    subcategory: 'Bed',
    description: 'Elegant queen size bed made of high-grade solid wood with a rich teak finish. Features a sturdy headboard and a robust slatted base for ultimate sleeping comfort.',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 800,
    deposit: 1600,
    tenureRates: {
      '3': 1.0,
      '6': 0.85,
      '12': 0.70,
      '24': 0.55,
    },
    inventory: 15,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
  },
  {
    name: 'Premium 3-Seater Fabric Sofa',
    category: 'Furniture',
    subcategory: 'Sofa',
    description: 'Chic charcoal grey 3-seater sofa with high-density foam cushions and durable linen upholstery. Perfectly complements modern living rooms.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 950,
    deposit: 1900,
    tenureRates: {
      '3': 1.0,
      '6': 0.82,
      '12': 0.68,
      '24': 0.50,
    },
    inventory: 10,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Pune'],
  },
  {
    name: 'Ergonomic Office Workstation',
    category: 'Furniture',
    subcategory: 'Table',
    description: 'Spacious study/office desk featuring integrated cable management slots, dynamic leg levelers, and a scratch-resistant oak wood top.',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 350,
    deposit: 700,
    tenureRates: {
      '3': 1.0,
      '6': 0.85,
      '12': 0.75,
      '24': 0.60,
    },
    inventory: 20,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
  },
  {
    name: 'High-Back Ergonomic Office Chair',
    category: 'Furniture',
    subcategory: 'Chair',
    description: 'Professional mesh chair featuring 3D adjustable armrests, active lumbar support, synchro-tilt mechanism, and smooth nylon casters.',
    images: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 300,
    deposit: 600,
    tenureRates: {
      '3': 1.0,
      '6': 0.88,
      '12': 0.75,
      '24': 0.60,
    },
    inventory: 25,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
  },
  {
    name: 'Double Door Convertible Refrigerator (340L)',
    category: 'Appliances',
    subcategory: 'Fridge',
    description: 'Frost-free double door refrigerator with smart inverter compressor and convertible freezer mode. Highly energy efficient with clean steel finish.',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 1200,
    deposit: 2400,
    tenureRates: {
      '3': 1.0,
      '6': 0.85,
      '12': 0.70,
      '24': 0.55,
    },
    inventory: 12,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Chennai'],
  },
  {
    name: 'Fully Automatic Front Load Washing Machine (8Kg)',
    category: 'Appliances',
    subcategory: 'Washing Machine',
    description: 'High-performance washing machine with 14 built-in wash programs, steam wash cycles, and an eco-silicon motor for ultra-quiet operation.',
    images: [
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 1100,
    deposit: 2200,
    tenureRates: {
      '3': 1.0,
      '6': 0.84,
      '12': 0.72,
      '24': 0.58,
    },
    inventory: 15,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
  },
  {
    name: '55-inch 4K Ultra HD Smart LED TV',
    category: 'Appliances',
    subcategory: 'TV',
    description: 'Enjoy crisp cinematic details with HDR10+ support, Dolby Audio, voice control remote, and built-in Netflix, Prime Video, and YouTube.',
    images: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 1500,
    deposit: 3000,
    tenureRates: {
      '3': 1.0,
      '6': 0.80,
      '12': 0.65,
      '24': 0.50,
    },
    inventory: 8,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
  },
  {
    name: 'Convection Microwave Oven (28L)',
    category: 'Appliances',
    subcategory: 'Microwave',
    description: 'Versatile microwave supporting baking, grilling, and reheating. Features auto-cook menus, slim fry technology, and a ceramic cavity.',
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 400,
    deposit: 800,
    tenureRates: {
      '3': 1.0,
      '6': 0.85,
      '12': 0.75,
      '24': 0.60,
    },
    inventory: 18,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'],
  },
  {
    name: '1.5 Ton 5-Star Split Air Conditioner',
    category: 'Appliances',
    subcategory: 'Air Conditioner',
    description: 'Split AC featuring dual inverter technology, 4-in-1 cooling modes, PM 2.5 air filtration, and auto-clean function for pristine air circulation.',
    images: [
      'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=600&auto=format&fit=crop&q=80',
    ],
    baseRent: 1600,
    deposit: 3200,
    tenureRates: {
      '3': 1.0,
      '6': 0.80,
      '12': 0.65,
      '24': 0.50,
    },
    inventory: 10,
    citiesAvailable: ['Bangalore', 'Mumbai', 'Chennai'],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Maintenance.deleteMany();
    await Product.deleteMany();
    await City.deleteMany();
    await User.deleteMany();

    console.log('Existing collections cleared...');

    // Seed cities
    const seededCities = await City.insertMany(cities);
    console.log(`${seededCities.length} cities seeded successfully.`);

    // Seed users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'RentEase Admin',
      email: 'admin@rentease.com',
      password: 'admin123',
      role: 'admin',
    });
    // Wait, since we are doing User.create, the pre-save hook will hash it. Let's pass raw strings!
    
    const customer = await User.create({
      name: 'John Doe',
      email: 'user@rentease.com',
      password: 'user123',
      city: 'Bangalore',
    });

    console.log('Default users seeded:');
    console.log(`- Admin: ${admin.email} (pwd: admin123)`);
    console.log(`- Customer: ${customer.email} (pwd: user123)`);

    // Seed products
    const seededProducts = await Product.insertMany(products);
    console.log(`${seededProducts.length} products seeded successfully.`);

    console.log('Database Seeding Completed!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
