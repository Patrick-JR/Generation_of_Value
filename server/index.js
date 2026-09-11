import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import prisma from './prismaClient.js';

const app = express();
const PORT = 3010;
const JWT_SECRET = process.env.JWT_SECRET || 'gov-secret-key-change-in-production';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';

// Create email transporter
let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT),
    secure: EMAIL_PORT == 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
  console.log('📧 Email configured and ready');
} else {
  console.log('📧 Email not configured (set EMAIL_USER and EMAIL_PASS env vars)');
}

// Database Seeding
async function seedDatabase() {
  try {
    // Seed default admin if not exists
    const adminCount = await prisma.adminUser.count({ where: { username: 'admin' } });
    if (adminCount === 0) {
      const hashedPassword = bcrypt.hashSync('1234', 10);
      await prisma.adminUser.create({
        data: { username: 'admin', password: hashedPassword, email: 'govpccmateroyouth@gmail.com' }
      });
      console.log('✅ Default admin created (admin/1234)');
    }

    // Seed default settings if not exists
    const settingsCount = await prisma.setting.count();
    if (settingsCount === 0) {
      await prisma.setting.create({
        data: {
          churchName: 'Generation of Value',
          tagline: 'Raising a Victorious Generation',
          address: 'Praise Christian Centre, Matero, Lusaka, Zambia',
          phone: '+260 97 335 1036',
          email: 'govpccmateroyouth@gmail.com',
          whatsapp: 'https://wa.me/260973351036',
          serviceTimes: 'Sundays 08:00 AM - 12:00 PM\nWednesdays 18:00 PM - 20:00 PM',
          declaration: 'We are Generation of Value - A holy nation, a royal priesthood, a peculiar people who declare the praises of Him who called us out of darkness into His marvelous light.',
          vision: "To raise a generation of young people who walk in divine purpose, integrity, and excellence, impacting their communities for God's Kingdom.",
          mission: 'Equip, Empower, and Deploy young people to fulfill their God-given potential through mentorship, discipleship, and practical ministry experience.',
          wordOfYear: 'EXCELLENCE'
        }
      });
      console.log('✅ Settings seeded');
    }

    // Seed products if empty
    const productsCount = await prisma.product.count();
    if (productsCount === 0) {
      const products = [
        { name: 'GOV T-Shirt', description: 'Premium cotton t-shirt with embroidered GOV logo', price: 150, category: 'Apparel', sizes: 'S,M,L,XL,XXL', colors: 'Black,White,Navy' },
        { name: 'GOV Hoodie', description: 'Comfortable hoodie with embroidered logo', price: 280, category: 'Apparel', sizes: 'S,M,L,XL,XXL', colors: 'Black,Grey' },
        { name: 'GOV Cap', description: 'Adjustable cap with embroidered GOV logo', price: 80, category: 'Accessories', sizes: 'One Size', colors: 'Black,Navy' },
        { name: 'GOV Wristband', description: 'Silicone wristband with embossed logo', price: 30, category: 'Accessories', sizes: 'One Size', colors: 'Gold,Black' },
        { name: 'GOV Pouch', description: 'Drawstring bag for carrying essentials', price: 60, category: 'Bags', sizes: 'One Size', colors: 'Black,Navy' },
        { name: 'GOV Skin', description: 'Long sleeve undershirt for layering', price: 120, category: 'Apparel', sizes: 'S,M,L,XL', colors: 'Black,White' }
      ];
      for (const p of products) {
        await prisma.product.create({ data: p });
      }
      console.log('✅ Products seeded');
    }

    // Seed events if empty
    const eventsCount = await prisma.event.count();
    if (eventsCount === 0) {
      const events = [
        { title: 'Youth Sunday', description: 'Our special monthly service led entirely by the youth.', date: '2026-07-19', time: '08:00 AM', location: 'Praise Christian Centre Matero', category: 'Service', highlight: 1 },
        { title: 'Youth Worship Night', description: 'An evening of intense worship, prayers, and fellowship.', date: '2026-07-25', time: '06:00 PM', location: 'Praise Christian Centre Matero', category: 'Worship', highlight: 0 },
        { title: 'Month of Prayer - July', description: 'Join us for 31 days of focused prayer and fasting.', date: '2026-07-01', time: 'All Day', location: 'Various', category: 'Prayer', highlight: 0 }
      ];
      for (const e of events) {
        await prisma.event.create({ data: e });
      }
      console.log('✅ Events seeded');
    }

    // Seed carousel slides
    const slidesCount = await prisma.carouselSlide.count();
    if (slidesCount === 0) {
      const slides = [
        { title: 'Generation of Value', subtitle: 'Raising a Victorious Generation', ctaText: 'Join Us', ctaLink: '/contact', orderNum: 1 },
        { title: 'Youth Sunday', subtitle: 'Every 3rd Sunday of the Month', ctaText: 'Learn More', ctaLink: '/events', orderNum: 2 },
        { title: 'GOV Merchandise', subtitle: 'Represent the Movement', ctaText: 'Shop Now', ctaLink: '/shop', orderNum: 3 }
      ];
      for (const s of slides) {
        await prisma.carouselSlide.create({ data: s });
      }
      console.log('✅ Carousel slides seeded');
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
}
seedDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Send email function
async function sendEmail(to, subject, html) {
  if (!transporter) {
    console.log('📧 [DEMO] Email would be sent to:', to);
    console.log('📧 Subject:', subject);
    return { demo: true };
  }
  try {
    await transporter.sendMail({ from: `"GOV Admin" <${EMAIL_USER}>`, to, subject, html });
    console.log('✅ Email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { error: error.message };
  }
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.adminUser.findFirst({ where: { email } });
    if (!user) return res.json({ message: 'If that email exists, a reset code has been sent.' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetCode.create({ data: { email, code, expiresAt } });

    const emailResult = await sendEmail(email, 'GOV Admin - Password Reset Code', `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your reset code: <strong>${code}</strong></p>
        <p>This code expires in 15 minutes.</p>
      </div>
    `);
    if (emailResult.demo) console.log(`🔑 Reset code for ${email}: ${code}`);
    res.json({ message: 'Reset code sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.post('/api/auth/verify-reset-code', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const resetRecord = await prisma.passwordResetCode.findFirst({
      where: { email, code, used: 0, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });
    if (!resetRecord) return res.status(400).json({ error: 'Invalid or expired code' });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await prisma.adminUser.updateMany({ where: { email }, data: { password: hashedPassword } });
    await prisma.passwordResetCode.update({ where: { id: resetRecord.id }, data: { used: 1 } });
    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error('Verify code error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.adminId }, select: { id: true, username: true, email: true }
    });
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== DASHBOARD ROUTES ====================
app.get('/api/dashboard/stats', authenticate, async (req, res) => {
  try {
    const totalMembers = await prisma.membership.count();
    const pendingMembers = await prisma.membership.count({ where: { status: 'pending' } });
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
    const totalProducts = await prisma.product.count();
    const totalEvents = await prisma.event.count();

    const recentMemberships = await prisma.membership.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const members = await prisma.membership.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } });
      const orders = await prisma.order.count({ where: { createdAt: { gte: monthStart, lte: monthEnd } } });

      monthlyData.push({ month: date.toLocaleString('default', { month: 'short' }), members, orders });
    }
    const popularProducts = await prisma.product.findMany({ take: 5 });

    res.json({
      totalMembers,
      pendingMembers,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalEvents,
      recentMemberships: recentMemberships.map(m => ({
        ...m,
        full_name: m.name || m.full_name || '',
        location: m.location || 'Lusaka',
        created_at: m.createdAt || m.created_at || new Date().toISOString()
      })),
      monthlyData,
      popularProducts
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ==================== MEMBERSHIP ROUTES ====================
app.get('/api/memberships', authenticate, async (req, res) => {
  const memberships = await prisma.membership.findMany({ orderBy: { createdAt: 'desc' } });
  const mapped = memberships.map(m => ({
    ...m,
    full_name: m.name || m.full_name || '',
    age_range: m.age || m.age_range || '',
    created_at: m.createdAt || m.created_at || new Date().toISOString()
  }));
  res.json({ memberships: mapped, success: true });
});
app.put('/api/memberships/:id', authenticate, async (req, res) => {
  await prisma.membership.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status } });
  res.json({ success: true });
});
app.delete('/api/memberships/:id', authenticate, async (req, res) => {
  await prisma.membership.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// ==================== PRODUCTS ROUTES ====================
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  const mapped = products.map(p => ({
    ...p,
    in_stock: p.inStock ?? 1,
    created_at: p.createdAt || p.created_at || new Date().toISOString()
  }));
  res.json({ products: mapped, success: true });
});
app.post('/api/products', authenticate, async (req, res) => {
  const { name, description, price, category, sizes, colors, in_stock } = req.body;
  const product = await prisma.product.create({ data: { name, description, price, category, sizes, colors, inStock: in_stock ? 1 : 0 } });
  res.json(product);
});
app.put('/api/products/:id', authenticate, async (req, res) => {
  const { name, description, price, category, sizes, colors, in_stock } = req.body;
  await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: { name, description, price, category, sizes, colors, inStock: in_stock ? 1 : 0 }
  });
  res.json({ success: true });
});
app.delete('/api/products/:id', authenticate, async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// ==================== EVENTS ROUTES ====================
app.get('/api/events', async (req, res) => {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
  const mapped = events.map(e => ({
    ...e,
    created_at: e.createdAt || e.created_at || new Date().toISOString()
  }));
  res.json({ events: mapped, success: true });
});
app.post('/api/events', authenticate, async (req, res) => {
  const { title, description, date, time, location, category, highlight } = req.body;
  const event = await prisma.event.create({ data: { title, description, date, time, location, category, highlight: highlight ? 1 : 0 } });
  res.json(event);
});
app.put('/api/events/:id', authenticate, async (req, res) => {
  const { title, description, date, time, location, category, highlight } = req.body;
  await prisma.event.update({
    where: { id: Number(req.params.id) },
    data: { title, description, date, time, location, category, highlight: highlight ? 1 : 0 }
  });
  res.json({ success: true });
});
app.delete('/api/events/:id', authenticate, async (req, res) => {
  await prisma.event.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// ==================== ORDERS ROUTES ====================
app.get('/api/orders', authenticate, async (req, res) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  const mapped = orders.map(o => ({
    ...o,
    created_at: o.createdAt || o.created_at || new Date().toISOString()
  }));
  res.json({ orders: mapped, success: true });
});
app.post('/api/orders', async (req, res) => {
  try {
    const { name, phone, items, total } = req.body; // Adjusted this to expect typical order format
    const order = await prisma.order.create({
      data: { name, phone, items: typeof items === 'string' ? items : JSON.stringify(items), total }
    });
    res.json({ success: true, order });
  } catch {
    res.status(500).json({ error: 'Order failed' });
  }
});
app.put('/api/orders/:id', authenticate, async (req, res) => {
  await prisma.order.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status } });
  res.json({ success: true });
});
app.delete('/api/orders/:id', authenticate, async (req, res) => {
  await prisma.order.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// ==================== SETTINGS ROUTES ====================
app.get('/api/settings', async (req, res) => {
  const settings = await prisma.setting.findUnique({ where: { id: 1 } });
  const s = settings || {};
  res.json({
    settings: {
      ...s,
      church_name: s.churchName || s.church_name || 'Generation of Value',
      service_times: s.serviceTimes || s.service_times || 'Sunday: 08:00 - 13:00',
      word_of_year: s.wordOfYear || s.word_of_year || 'Year of Great Grace'
    },
    ...s,
    church_name: s.churchName || s.church_name || 'Generation of Value',
    service_times: s.serviceTimes || s.service_times || 'Sunday: 08:00 - 13:00',
    word_of_year: s.wordOfYear || s.word_of_year || 'Year of Great Grace'
  });
});
app.put('/api/settings', authenticate, async (req, res) => {
  const { church_name, tagline, address, phone, email, whatsapp, service_times, declaration, vision, mission, word_of_year } = req.body;
  await prisma.setting.upsert({
    where: { id: 1 },
    update: { churchName: church_name, tagline, address, phone, email, whatsapp, serviceTimes: service_times, declaration, vision, mission, wordOfYear: word_of_year },
    create: { id: 1, churchName: church_name, tagline, address, phone, email, whatsapp, serviceTimes: service_times, declaration, vision, mission, wordOfYear: word_of_year }
  });
  res.json({ success: true });
});

// ==================== CAROUSEL ROUTES ====================
app.get('/api/carousel', async (req, res) => {
  const slides = await prisma.carouselSlide.findMany({ where: { active: 1 }, orderBy: { orderNum: 'asc' } });
  const mapped = slides.map(s => ({
    ...s,
    cta_text: s.ctaText || s.cta_text || '',
    cta_link: s.ctaLink || s.cta_link || ''
  }));
  res.json({ slides: mapped, success: true });
});
app.put('/api/carousel', authenticate, async (req, res) => {
  const { slides } = req.body;
  await prisma.carouselSlide.updateMany({ data: { active: 0 } });
  if (slides && slides.length > 0) {
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (slide.id) {
        await prisma.carouselSlide.upsert({
          where: { id: slide.id },
          update: { title: slide.title, subtitle: slide.subtitle, ctaText: slide.cta_text, ctaLink: slide.cta_link, orderNum: i, active: 1 },
          create: { id: slide.id, title: slide.title, subtitle: slide.subtitle, ctaText: slide.cta_text, ctaLink: slide.cta_link, orderNum: i, active: 1 }
        });
      }
    }
  }
  res.json({ success: true });
});

// ==================== CONTACT FORM (PUBLIC) ====================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await prisma.membership.create({ data: { name, email, phone, message, status: 'contact' } });
    const admin = await prisma.adminUser.findFirst();
    if (admin && admin.email) {
      await sendEmail(admin.email, `New Contact: ${subject || 'GOV Website'}`, `
        <h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong> ${message}</p>
      `);
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// ==================== MEMBERSHIP FORM (PUBLIC) ====================
app.post('/api/membership', async (req, res) => {
  try {
    const { name, email, phone, age, message } = req.body;
    await prisma.membership.create({ data: { name, email, phone, age, message, status: 'pending' } });
    const admin = await prisma.adminUser.findFirst();
    if (admin && admin.email) {
      await sendEmail(admin.email, 'New GOV Membership Application', `<h2>New Application</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>`);
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to submit membership form' });
  }
});

// ==================== MYSTERY NOTE (PUBLIC) ====================
app.post('/api/mystery', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }
    const GOV_EMAIL = 'govpccmateroyouth@gmail.com';
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' });
    await sendEmail(GOV_EMAIL, '🔒 New Anonymous Mystery Note — GOV', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111827; color: #f9fafb; padding: 2rem; border-radius: 12px; border-top: 5px solid #D4AF37;">
        <h2 style="color: #D4AF37; margin-bottom: 0.5rem;">🔒 Anonymous Mystery Note</h2>
        <p style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 1.5rem;">Received on ${timestamp} (Lusaka Time) — The sender is completely anonymous.</p>
        <div style="background: #1f2937; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #D4AF37; font-size: 1rem; line-height: 1.8; color: #f9fafb; white-space: pre-wrap;">${message}</div>
        <p style="margin-top: 1.5rem; font-size: 0.8rem; color: #6b7280;">This note was submitted anonymously through the GOV website. Please handle it with confidentiality and prayer.</p>
      </div>
    `);
    res.json({ success: true });
  } catch (err) {
    console.error('Mystery note error:', err);
    res.status(500).json({ error: 'Failed to submit mystery note.' });
  }
});

// ==================== FEEDBACK (PUBLIC) ====================
app.post('/api/feedback', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Feedback cannot be empty.' });
    }
    const GOV_EMAIL = 'govpccmateroyouth@gmail.com';
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' });
    await sendEmail(GOV_EMAIL, '💬 New Feedback Submitted — GOV Website', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111827; color: #f9fafb; padding: 2rem; border-radius: 12px; border-top: 5px solid #D4AF37;">
        <h2 style="color: #D4AF37; margin-bottom: 0.5rem;">💬 New Feedback</h2>
        <p style="color: #9ca3af; font-size: 0.85rem; margin-bottom: 1.5rem;">Submitted on ${timestamp} (Lusaka Time)</p>
        <div style="background: #1f2937; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #D4AF37; font-size: 1rem; line-height: 1.8; color: #f9fafb; white-space: pre-wrap;">${message}</div>
        <p style="margin-top: 1.5rem; font-size: 0.8rem; color: #6b7280;">This feedback was submitted through the GOV website feedback box.</p>
      </div>
    `);
    res.json({ success: true });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GOV Server Running on http://0.0.0.0:${PORT}`);
});
