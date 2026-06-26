import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  tenure: {
    type: Number, // In months (e.g. 3, 6, 12, 24)
    required: true,
  },
  monthlyRent: {
    type: Number,
    required: true,
  },
  securityDeposit: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalMonthlyRent: {
      type: Number,
      required: true,
    },
    totalSecurityDeposit: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Please add a delivery address'],
    },
    deliveryCity: {
      type: String,
      required: [true, 'Please specify delivery city'],
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Please schedule a delivery date'],
    },
    status: {
      type: String,
      enum: ['Pending Delivery', 'Active', 'Returned', 'Cancelled'],
      default: 'Pending Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Paid',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
