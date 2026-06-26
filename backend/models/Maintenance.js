import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    issueType: {
      type: String,
      required: [true, 'Please specify issue type'],
      enum: ['Repair & Maintenance', 'Damage Claim', 'Relocation Support', 'Return Request'],
    },
    description: {
      type: String,
      required: [true, 'Please describe your request in detail'],
    },
    scheduledDate: {
      type: Date,
      // Date scheduled by admin for a technician visit
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;
