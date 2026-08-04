import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Product info (snapshot at time of order)
    product: {
      id:    { type: Number, required: true },
      name:  { type: String, required: true },
      price: { type: Number, required: true },
    },

    // Chosen options
    color:    { type: String, required: true },
    size:     { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    total:    { type: Number, required: true }, // price × quantity

    // Customer details
    customer: {
      name:    { type: String, required: true, trim: true },
      phone:   { type: String, required: true, trim: true },
      message: { type: String, default: '' },
    },

    // Order tracking
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'dispatched', 'completed', 'cancelled'],
      default: 'pending',
    },

    // WhatsApp was also opened (for reference)
    whatsappSent: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model('Order', orderSchema);
