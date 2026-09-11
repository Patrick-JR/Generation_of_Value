# GOV Website - Setup & Download Guide

## 📦 What You Get

This is a complete website package with:
- **Public Website** - Beautiful homepage, about, events, contact, shop pages
- **Admin Dashboard** - Full CMS to manage everything
- **Backend API** - Handles data and emails
- **SQLite Database** - All your data stored locally

---

## 🚀 Quick Start (Run on Your PC)

### Step 1: Download & Extract
1. Download the project folder
2. Extract it to your desired location
3. Open terminal/command prompt in the folder

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Everything
```bash
# Start both frontend and backend together
npm run dev:all

# OR start them separately:
npm run dev          # Application (http://localhost:3010)
npm run dev:server   # Backend (http://localhost:3001)
```

### Step 4: Open in Browser
- **Website**: http://localhost:3010
- **Admin**: http://localhost:3010/admin
- **Login**: `admin` / `1234`

---

## 📧 Setting Up Real Emails (Password Reset)

### Option 1: Gmail (Easiest)

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not enabled
3. Go to "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "GOV Website" and click Generate
6. Copy the 16-character password

7. Create a file called `.env` in the project folder:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

### Option 2: Other Email Services

You can also use:
- **SendGrid**: Sign up at sendgrid.com, get free API key
- **Mailgun**: Sign up at mailgun.com, get free credits
- **Brevo (Sendinblue)**: Sign up at brevo.com, get free SMTP

For any service, just set these in `.env`:
```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
```

---

## 🖼️ Adding Your Photos

### Shop Products

1. Go to Admin Dashboard → Shop tab
2. Click "Add Product"
3. For the image, you have two options:

**Option A: Use Image URLs (Recommended)**
- Upload images to free hosting like:
  - https://imgur.com/ (free, easy)
  - https://imgbb.com/
  - https://postimages.org/
- Copy the direct image URL
- Paste it in the product form

**Option B: Replace Placeholder Colors**
- Currently products use colored placeholders
- Edit `/workspace/gov-website/src/data/content.js`
- Change the `image` property from `tshirt`, `hoodie`, etc. to:
  ```javascript
  image: "url:https://your-image-url.com/image.jpg"
  ```

### Homepage Carousel

1. Go to Admin Dashboard → Settings tab
2. Find "Homepage Carousel" section
3. Add your image URLs for each slide
4. Or edit `/workspace/gov-website/src/data/content.js`:
  ```javascript
  carouselSlides: [
    {
      title: "Generation of Value",
      subtitle: "Raising a Victorious Generation",
      image: "https://your-image-url.com/hero1.jpg",
      ctaText: "Join Us",
      ctaLink: "/contact"
    },
    // ... more slides
  ]
  ```

### Leadership Photos

1. Edit `/workspace/gov-website/src/data/content.js`
2. Find the `leadership` section
3. Update `image` URLs for each leader

### Event Photos

1. Go to Admin Dashboard → Events tab
2. Edit each event
3. Add image URLs

---

## 📱 Shop - Mobile Money Setup

The shop uses **Mobile Money** (not Airtel API).

### Current Setup
- **Payment Method**: Send Money manually
- **Phone Number**: +260 97 335 1036 (set in church info)

### To Change the Number

Edit `/workspace/gov-website/src/data/content.js`:
```javascript
export const churchInfo = {
  phone: "+260 XX XXX XXXX",  // <-- Change this
  // ...
};
```

### How It Works
1. Customer selects products and clicks "Buy Now"
2. Enters name and phone number
3. Clicks "Order via WhatsApp"
4. WhatsApp opens with pre-filled order message
5. Customer sends payment to the Mobile Money number manually

---

## 🌐 Deploying to the Internet

### Option 1: Static Hosting (Frontend Only)

**Vercel (Recommended - Free)**
1. Go to https://vercel.com
2. Sign up with GitHub/email
3. Click "Add New Project"
4. Upload the `dist` folder or connect your repo
5. Deploy!

**Netlify (Free)**
1. Go to https://netlify.com
2. Sign up
3. Drag and drop the `dist` folder
4. Done!

**Note**: Admin dashboard won't work because it needs the backend.

---

### Option 2: Full Deployment (Everything Online)

#### Deploy Backend (Railway - Recommended)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your repo
5. Railway will auto-detect Node.js
6. Add Environment Variables:
   - `PORT`: 3001
   - `JWT_SECRET`: any-random-string
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASS`: your-app-password
7. Deploy!

#### Update Frontend

1. Create `.env.production`:
```env
VITE_API_URL=https://your-railway-app.railway.app/api
```

2. Rebuild:
```bash
npm run build
```

3. Deploy the `dist` folder to Vercel/Netlify

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- Make sure backend is running: `npm run dev:server`
- Check if port 3001 is not blocked

### "Reset code not working"
- Make sure email is configured in `.env`
- Check spam folder
- Code expires after 15 minutes

### "Images not showing"
- Make sure image URLs are direct links (end in .jpg, .png, etc.)
- Avoid links that require login

### "Build failed"
```bash
npm install
npm run build
```

---

## 📁 File Structure

```
gov-website/
├── server/
│   ├── index.js          # Backend API
│   └── gov.db            # SQLite database (created on first run)
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── data/
│   │   └── content.js    # Website content & church info
│   └── App.jsx           # Main app
├── dist/                 # Built website (after npm run build)
├── .env                  # Environment variables (create this)
└── package.json
```

---

## 🆘 Need Help?

If something doesn't work, check:
1. Is `npm install` completed?
2. Is the backend running?
3. Are there any error messages in the terminal?

Contact me if you need further assistance!
