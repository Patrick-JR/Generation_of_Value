import express from 'express';
import Order from '../models/Order.js';
import { sendOrderEmail } from '../services/emailService.js';

const router = express.Router();

// ── POST /api/orders ──────────────────────────────────────────────────────────
// Save a new order and send an email notification
router.post('/', async (req, res) => {
  try {
    const { product, color, size, quantity, customer } = req.body;

    // Basic validation
    if (!product?.id || !product?.name || !product?.price) {
      return res.status(400).json({ error: 'Product details are required.' });
    }
    if (!color || !size) {
      return res.status(400).json({ error: 'Color and size are required.' });
    }
    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ error: 'Customer name and phone are required.' });
    }

    const total = product.price * (quantity || 1);

    // Save to DB
    const order = await Order.create({
      product: { id: product.id, name: product.name, price: product.price },
      color,
      size,
      quantity: quantity || 1,
      total,
      customer: {
        name:    customer.name.trim(),
        phone:   customer.phone.trim(),
        message: customer.message?.trim() || '',
      },
    });

    // Send email notification (non-blocking — don't fail the order if email fails)
    sendOrderEmail(order).catch((err) =>
      console.error('❌ Order email failed:', err.message)
    );

    res.status(201).json({ success: true, orderId: order._id });
  } catch (err) {
    console.error('❌ Order creation error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/orders ───────────────────────────────────────────────────────────
// List all orders (for admin use — add auth middleware before going live)
router.get('/', async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/orders/:id/status ──────────────────────────────────────────────
// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'paid', 'dispatched', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
