import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'gov-secret-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
  console.log('📧 Email configured and ready');
} else {
  console.log('📧 Email not configured (set EMAIL_USER and EMAIL_PASS env vars)');
}

// Database setup
const dbPath = join(__dirname, 'gov.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    sizes TEXT,
    colors TEXT,
    in_stock INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT,
    category TEXT,
    highlight INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    age TEXT,
    status TEXT DEFAULT 'pending',
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    items TEXT,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    church_name TEXT,
    tagline TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    whatsapp TEXT,
    service_times TEXT,
    declaration TEXT,
    vision TEXT,
    mission TEXT,
    word_of_year TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS carousel_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    cta_text TEXT,
    cta_link TEXT,
    image_url TEXT,
    order_num INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default admin if not exists
const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('1234', 10);
  db.prepare('INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)').run('admin', hashedPassword, 'govpccmateroyouth@gmail.com');
  console.log('✅ Default admin created (admin/1234)');
}

// Seed default settings if not exists
const settingsExist = db.prepare('SELECT id FROM settings WHERE id = 1').get();
if (!settingsExist) {
  db.prepare(`
    INSERT INTO settings (id, church_name, tagline, address, phone, email, whatsapp, service_times, declaration, vision, mission, word_of_year)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Generation of Value',
    'Raising a Victorious Generation',
    'Praise Christian Centre, Matero, Lusaka, Zambia',
    '+260 97 335 1036',
    'govpccmateroyouth@gmail.com',
    'https://wa.me/260973351036',
    'Sundays 08:00 AM - 12:00 PM\nWednesdays 18:00 PM - 20:00 PM',
    'We are Generation of Value - A holy nation, a royal priesthood, a peculiar people who declare the praises of Him who called us out of darkness into His marvelous light.',
    'To raise a generation of young people who walk in divine purpose, integrity, and excellence, impacting their communities for God's Kingdom.',
    'Equip, Empower, and Deploy young people to fulfill their God-given potential through mentorship, discipleship, and practical ministry experience.',
    'EXCELLENCE'
  );
}

// Seed products if empty
const productsExist = db.prepare('SELECT id FROM products LIMIT 1').get();
if (!productsExist) {
  const products = [
    { name: 'GOV T-Shirt', description: 'Premium cotton t-shirt with embroidered GOV logo', price: 150, category: 'Apparel', sizes: 'S,M,L,XL,XXL', colors: 'Black,White,Navy' },
    { name: 'GOV Hoodie', description: 'Comfortable hoodie with embroidered logo', price: 280, category: 'Apparel', sizes: 'S,M,L,XL,XXL', colors: 'Black,Grey' },
    { name: 'GOV Cap', description: 'Adjustable cap with embroidered GOV logo', price: 80, category: 'Accessories', sizes: 'One Size', colors: 'Black,Navy' },
    { name: 'GOV Wristband', description: 'Silicone wristband with embossed logo', price: 30, category: 'Accessories', sizes: 'One Size', colors: 'Gold,Black' },
    { name: 'GOV Pouch', description: 'Drawstring bag for carrying essentials', price: 60, category: 'Bags', sizes: 'One Size', colors: 'Black,Navy' },
    { name: 'GOV Skin', description: 'Long sleeve undershirt for layering', price: 120, category: 'Apparel', sizes: 'S,M,L,XL', colors: 'Black,White' }
  ];

  const insertProduct = db.prepare('INSERT INTO products (name, description, price, category, sizes, colors) VALUES (?, ?, ?, ?, ?, ?)');
  products.forEach(p => insertProduct.run(p.name, p.description, p.price, p.category, p.sizes, p.colors));
  console.log('✅ Products seeded');
}

// Seed events if empty
const eventsExist = db.prepare('SELECT id FROM events LIMIT 1').get();
if (!eventsExist) {
  const events = [
    { title: 'Youth Sunday', description: 'Our special monthly service led entirely by the youth. Come and be blessed as our young people lead worship, preaching, and ministering.', date: '2026-07-19', time: '08:00 AM', location: 'Praise Christian Centre Matero', category: 'Service', highlight: 1 },
    { title: 'Youth Worship Night', description: 'An evening of intense worship, prayers, and fellowship. Come hungry and leave filled!', date: '2026-07-25', time: '06:00 PM', location: 'Praise Christian Centre Matero', category: 'Worship', highlight: 0 },
    { title: 'Month of Prayer - July', description: 'Join us for 31 days of focused prayer and fasting as we seek God together.', date: '2026-07-01', time: 'All Day', location: 'Various', category: 'Prayer', highlight: 0 }
  ];

  const insertEvent = db.prepare('INSERT INTO events (title, description, date, time, location, category, highlight) VALUES (?, ?, ?, ?, ?, ?, ?)');
  events.forEach(e => insertEvent.run(e.title, e.description, e.date, e.time, e.location, e.category, e.highlight));
  console.log('✅ Events seeded');
}

// Seed carousel slides
const slidesExist = db.prepare('SELECT id FROM carousel_slides LIMIT 1').get();
if (!slidesExist) {
  const slides = [
    { title: 'Generation of Value', subtitle: 'Raising a Victorious Generation', cta_text: 'Join Us', cta_link: '/contact', order_num: 1 },
    { title: 'Youth Sunday', subtitle: 'Every 3rd Sunday of the Month', cta_text: 'Learn More', cta_link: '/events', order_num: 2 },
    { title: 'GOV Merchandise', subtitle: 'Represent the Movement', cta_text: 'Shop Now', cta_link: '/shop', order_num: 3 }
  ];

  const insertSlide = db.prepare('INSERT INTO carousel_slides (title, subtitle, cta_text, cta_link, order_num) VALUES (?, ?, ?, ?, ?)');
  slides.forEach(s => insertSlide.run(s.title, s.subtitle, s.cta_text, s.cta_link, s.order_num));
  console.log('✅ Carousel slides seeded');
}

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
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
    await transporter.sendMail({
      from: `"GOV Admin" <${EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('✅ Email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { error: error.message };
  }
}

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If that email exists, a reset code has been sent.' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    // Save code to database
    db.prepare('INSERT INTO password_reset_codes (email, code, expires_at) VALUES (?, ?, ?)').run(email, code, expiresAt);

    // Send email
    const emailResult = await sendEmail(email, 'GOV Admin - Password Reset Code', `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D4AF37, #B8860B); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #000; margin: 0;">GOV Admin</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #64748b;">You requested a password reset for your GOV Admin account.</p>
          <div style="background: #fff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; color: #64748b; margin: 0 0 10px;">Your reset code:</p>
            <span style="font-size: 32px; font-weight: bold; color: #D4AF37; letter-spacing: 8px;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code expires in 15 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `);

    // In demo mode, also log the code
    if (emailResult.demo) {
      console.log(`🔑 Reset code for ${email}: ${code}`);
    }

    res.json({ message: 'Reset code sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Verify Reset Code
app.post('/api/auth/verify-reset-code', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Find valid code
    const resetRecord = db.prepare(`
      SELECT * FROM password_reset_codes 
      WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `).get(email, code);

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    // Update password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin_users SET password = ? WHERE email = ?').run(hashedPassword, email);

    // Mark code as used
    db.prepare('UPDATE password_reset_codes SET used = 1 WHERE id = ?').run(resetRecord.id);

    res.json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error('Verify code error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, username, email FROM admin_users WHERE id = ?').get(req.adminId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// ==================== DASHBOARD ROUTES ====================

app.get('/api/dashboard/stats', authenticate, (req, res) => {
  try {
    const totalMembers = db.prepare('SELECT COUNT(*) as count FROM memberships').get().count;
    const pendingMembers = db.prepare("SELECT COUNT(*) as count FROM memberships WHERE status = 'pending'").get().count;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalEvents = db.prepare('SELECT COUNT(*) as count FROM events').get().count;

    // Recent memberships
    const recentMemberships = db.prepare('SELECT * FROM memberships ORDER BY created_at DESC LIMIT 5').all();

    // Monthly data for charts (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = date.toISOString().slice(0, 7) + '-01';
      const monthEnd = date.toISOString().slice(0, 7) + '-31';

      const members = db.prepare("SELECT COUNT(*) as count FROM memberships WHERE created_at >= ? AND created_at <= ?").get(monthStart, monthEnd).count;
      const orders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE created_at >= ? AND created_at <= ?").get(monthStart, monthEnd).count;

      monthlyData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        members,
        orders
      });
    }

    // Popular products
    const popularProducts = db.prepare('SELECT * FROM products LIMIT 5').all();

    res.json({
      totalMembers,
      pendingMembers,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalEvents,
      recentMemberships,
      monthlyData,
      popularProducts
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ==================== MEMBERSHIP ROUTES ====================

app.get('/api/memberships', authenticate, (req, res) => {
  const memberships = db.prepare('SELECT * FROM memberships ORDER BY created_at DESC').all();
  res.json(memberships);
});

app.put('/api/memberships/:id', authenticate, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE memberships SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

app.delete('/api/memberships/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM memberships WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== PRODUCTS ROUTES ====================

app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

app.post('/api/products', authenticate, (req, res) => {
  const { name, description, price, category, sizes, colors, in_stock } = req.body;
  const result = db.prepare('INSERT INTO products (name, description, price, category, sizes, colors, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?)').run(name, description, price, category, sizes, colors, in_stock ? 1 : 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/products/:id', authenticate, (req, res) => {
  const { name, description, price, category, sizes, colors, in_stock } = req.body;
  db.prepare('UPDATE products SET name = ?, description = ?, price = ?, category = ?, sizes = ?, colors = ?, in_stock = ? WHERE id = ?').run(name, description, price, category, sizes, colors, in_stock ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/products/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== EVENTS ROUTES ====================

app.get('/api/events', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
  res.json(events);
});

app.post('/api/events', authenticate, (req, res) => {
  const { title, description, date, time, location, category, highlight } = req.body;
  const result = db.prepare('INSERT INTO events (title, description, date, time, location, category, highlight) VALUES (?, ?, ?, ?, ?, ?, ?)').run(title, description, date, time, location, category, highlight ? 1 : 0);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/events/:id', authenticate, (req, res) => {
  const { title, description, date, time, location, category, highlight } = req.body;
  db.prepare('UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?, highlight = ? WHERE id = ?').run(title, description, date, time, location, category, highlight ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/events/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== ORDERS ROUTES ====================

app.get('/api/orders', authenticate, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders);
});

app.put('/api/orders/:id', authenticate, (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

app.delete('/api/orders/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ==================== SETTINGS ROUTES ====================

app.get('/api/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  res.json(settings || {});
});

app.put('/api/settings', authenticate, (req, res) => {
  const { church_name, tagline, address, phone, email, whatsapp, service_times, declaration, vision, mission, word_of_year } = req.body;
  db.prepare(`
    UPDATE settings SET 
      church_name = ?, tagline = ?, address = ?, phone = ?, email = ?, 
      whatsapp = ?, service_times = ?, declaration = ?, vision = ?, 
      mission = ?, word_of_year = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run(church_name, tagline, address, phone, email, whatsapp, service_times, declaration, vision, mission, word_of_year);
  res.json({ success: true });
});

// ==================== CAROUSEL ROUTES ====================

app.get('/api/carousel', (req, res) => {
  const slides = db.prepare('SELECT * FROM carousel_slides WHERE active = 1 ORDER BY order_num ASC').all();
  res.json(slides);
});

app.put('/api/carousel', authenticate, (req, res) => {
  const { slides } = req.body;
  
  db.prepare('UPDATE carousel_slides SET active = 0').run();
  
  if (slides && slides.length > 0) {
    const insertOrUpdate = db.prepare(`
      INSERT INTO carousel_slides (id, title, subtitle, cta_text, cta_link, order_num, active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(id) DO UPDATE SET 
        title = excluded.title, subtitle = excluded.subtitle, 
        cta_text = excluded.cta_text, cta_link = excluded.cta_link,
        order_num = excluded.order_num, active = 1
    `);
    
    slides.forEach((slide, index) => {
      insertOrUpdate.run(slide.id, slide.title, slide.subtitle, slide.cta_text, slide.cta_link, index);
    });
  }
  
  res.json({ success: true });
});

// ==================== CONTACT FORM (PUBLIC) ====================

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Save to database
    db.prepare('INSERT INTO memberships (name, email, phone, message) VALUES (?, ?, ?, ?)').run(name, email, phone, message);

    // Send notification email to admin
    const admin = db.prepare('SELECT email FROM admin_users LIMIT 1').get();
    if (admin) {
      await sendEmail(admin.email, `New Contact: ${subject || 'GOV Website'}`, `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #D4AF37;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// ==================== MEMBERSHIP FORM (PUBLIC) ====================

app.post('/api/membership', async (req, res) => {
  try {
    const { name, email, phone, age, message } = req.body;

    db.prepare('INSERT INTO memberships (name, email, phone, age, message, status) VALUES (?, ?, ?, ?, ?, ?)').run(name, email, phone, age, message, 'pending');

    // Send notification
    const admin = db.prepare('SELECT email FROM admin_users LIMIT 1').get();
    if (admin) {
      await sendEmail(admin.email, 'New GOV Membership Application', `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #D4AF37;">New Membership Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Age:</strong> ${age || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message || 'N/A'}</p>
        </div>
      `);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Membership form error:', err);
    res.status(500).json({ error: 'Failed to submit membership form' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎉 GOV Backend Server Running!                            ║
║                                                            ║
║   📡 API: http://localhost:${PORT}                          ║
║   🗄️  Database: ${dbPath.slice(-20)}...                    ║
║                                                            ║
║   📧 Email: ${EMAIL_USER ? EMAIL_USER : 'Not configured'}                        ║
║                                                            ║
║   👤 Default login: admin / 1234                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
