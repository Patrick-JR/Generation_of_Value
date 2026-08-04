import express from 'express';
import Message from '../models/Message.js';
import { sendContactEmail } from '../services/emailService.js';

const router = express.Router();

// ── POST /api/contact ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name?.trim())    return res.status(400).json({ error: 'Name is required.' });
    if (!email?.trim())   return res.status(400).json({ error: 'Email is required.' });
    if (!subject?.trim()) return res.status(400).json({ error: 'Subject is required.' });
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' });

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Save to DB
    const msg = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send email notification
    sendContactEmail(msg).catch((err) =>
      console.error('❌ Contact email failed:', err.message)
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('❌ Contact form error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/contact ──────────────────────────────────────────────────────────
// List all messages (admin)
router.get('/', async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/contact/:id/read ───────────────────────────────────────────────
router.patch('/:id/read', async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
