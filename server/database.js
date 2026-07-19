const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'gov.db'));

// Initialize database tables
db.exec(`
  -- Products table
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    colors TEXT,
    sizes TEXT,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Events table
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT,
    description TEXT,
    category TEXT,
    highlight INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Membership submissions table
  CREATE TABLE IF NOT EXISTS memberships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    age_range TEXT,
    location TEXT,
    ministry_interest TEXT,
    hear_about_us TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Admin users table
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Password reset codes
  CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Site settings
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Carousel slides
  CREATE TABLE IF NOT EXISTS carousel_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    button_text TEXT,
    button_link TEXT,
    image_url TEXT,
    order_num INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Orders
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_phone TEXT,
    delivery_address TEXT,
    items TEXT,
    total_amount REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default admin if not exists
const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!adminExists) {
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('1234', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)').run('admin', hash, 'govpccmateroyouth@gmail.com');
}

// Seed default settings if not exists
const defaultSettings = [
  ['word_of_year', 'The Year of Giving Gratitude to God'],
  ['mission', 'Winning 100 million souls for Christ'],
  ['church_name', 'Praise Christian Centre Matero'],
  ['bishop', 'Bishop Paul Karonga'],
  ['email', 'govpccmateroyouth@gmail.com'],
  ['phone', '+260 573 351 036'],
  ['address', 'Off Chitanda Road, opposite Hillside Primary School'],
  ['service_time', '09:00 AM to 12:00 PM']
];

const settingsStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
defaultSettings.forEach(([key, value]) => settingsStmt.run(key, value));

// Seed default products if not exists
const productsExist = db.prepare('SELECT id FROM products').get();
if (!productsExist) {
  const defaultProducts = [
    ['GOV Classic T-Shirt', 'Premium cotton t-shirt with embroidered GOV logo', 150, 'Black,White,Gold', 'S,M,L,XL,XXL', 'tshirt'],
    ['GOV Premium Hoodie', 'Warm and comfortable hoodie with embroidered logo', 350, 'Black,Navy', 'S,M,L,XL,XXL', 'hoodie'],
    ['GOV Phone Pouch', 'Stylish phone pouch with GOV branding', 80, 'Black,White', 'Universal', 'pouch'],
    ['GOV Laptop Skin', 'Premium vinyl skin for laptops', 120, 'Black,White', '13",15",16"', 'skin'],
    ['GOV Cap', 'Adjustable cap with embroidered GOV logo', 90, 'Black,Gold', 'One Size', 'cap'],
    ['GOV Wristband', 'Silicone wristband with embossed logo', 30, 'Gold,Black,White', 'One Size', 'wristband']
  ];
  const productStmt = db.prepare('INSERT INTO products (name, description, price, colors, sizes, image) VALUES (?, ?, ?, ?, ?, ?)');
  defaultProducts.forEach(([name, desc, price, colors, sizes, image]) => productStmt.run(name, desc, price, colors, sizes, image));
}

// Seed default events if not exists
const eventsExist = db.prepare('SELECT id FROM events').get();
if (!eventsExist) {
  const defaultEvents = [
    ['Youth Worship Night', 'July 31, 2026', '20:00 to 05:00', 'Praise Christian Centre Matero', 'Join us for a night of powerful worship, praise, and intimate fellowship with God.', 'Special', 0],
    ['August Month of Prayer', 'August 1-30, 2026', '17:00 to 19:00', 'Praise Christian Centre Matero', 'A dedicated month of intense prayer and intercession. Every Monday to Friday.', 'Monthly', 0],
    ['Youth Sunday', 'September 6, 2026', '08:00 to 13:00', 'Praise Christian Centre Matero', 'THE BIGGEST EVENT OF THE YEAR! A special Sunday dedicated to the youth.', 'Special', 1]
  ];
  const eventStmt = db.prepare('INSERT INTO events (title, date, time, location, description, category, highlight) VALUES (?, ?, ?, ?, ?, ?, ?)');
  defaultEvents.forEach(([title, date, time, location, desc, cat, highlight]) => eventStmt.run(title, date, time, location, desc, cat, highlight));
}

// Seed default carousel slides if not exists
const carouselExist = db.prepare('SELECT id FROM carousel_slides').get();
if (!carouselExist) {
  const defaultSlides = [
    ['Generation of Value', 'A Chosen Generation, Raised for Such a Time as This', 'Welcome to the official youth ministry of Praise Christian Centre Matero', 'Explore our Shop', '/shop', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1920&h=1080&fit=crop', 1],
    ['2026 - Year of Gratitude', 'Giving Thanks to God in All Things', 'This year, we focus on acknowledging God\'s faithfulness', 'See Our Products', '/shop', 'https://images.unsplash.com/photo-1519834089822-3389d7f76b6c?w=1920&h=1080&fit=crop', 2],
    ['Winning 100 Million Souls', 'Our Mission', 'We are committed to soul-winning and spreading the Gospel', 'Get Involved', '/#ministries', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1920&h=1080&fit=crop', 3]
  ];
  const slideStmt = db.prepare('INSERT INTO carousel_slides (title, subtitle, description, button_text, button_link, image_url, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)');
  defaultSlides.forEach(([title, sub, desc, btn, link, img, order]) => slideStmt.run(title, sub, desc, btn, link, img, order));
}

module.exports = db;
