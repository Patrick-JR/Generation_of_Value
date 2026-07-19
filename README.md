# Generation of Value (GOV) Website

The official youth ministry website for Praise Christian Centre Matero.

## Features

- **Public Website**: Responsive, modern design with:
  - Home page with hero carousel, about, values, leadership preview, ministries, events, and church details
  - About page with Bishop's declaration, vision, mission, and core values
  - Leadership page with full organizational structure
  - Events page with upcoming events calendar
  - Contact page with church details and contact form
  - Shop page with product catalog and Mobile Money ordering

- **Admin Dashboard**: Full CMS with:
  - Dashboard overview with charts and statistics
  - Membership management
  - Events management (CRUD)
  - Shop management (products and orders)
  - Settings management (content, contact info, carousel)
  - Modern, beautiful UI with Recharts visualizations

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Framer Motion, Recharts
- **Backend**: Express.js, SQLite (better-sqlite3)
- **Styling**: Custom CSS with CSS Variables, Gold (#D4AF37) brand color
- **Icons**: Lucide React

## Development Setup

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Install dependencies
npm install

# Start frontend development server
npm run dev

# In a separate terminal, start backend server
npm run dev:server

# Or run both together
npm run dev:all
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Admin Login

- **URL**: /admin
- **Default Credentials**:
  - Username: `admin`
  - Password: `1234`

### Forgot Password
1. Click "Forgot Password?" on login page
2. Enter admin email
3. Check email (or console in demo mode) for 6-digit reset code
4. Enter code and new password

## Deployment

### Option 1: Static Hosting (Frontend Only)
For static hosting (Vercel, Netlify, etc.):
```bash
npm run build
```
Upload the `dist` folder contents.

**Note**: Admin features require a backend server. The admin will show connection errors in static-only hosting.

### Option 2: Full Stack Deployment
For full functionality:

1. **Backend Server**
   - Deploy to services like Railway, Render, Fly.io, or any Node.js hosting
   - Set environment variable `PORT` for the server port
   - The SQLite database is file-based (`server/gov.db`)

2. **Frontend**
   - Set `VITE_API_URL` environment variable to your backend URL
   - Build and deploy:
   ```bash
   npm run build
   ```

### Environment Variables
- `PORT` - Backend server port (default: 3001)
- `JWT_SECRET` - Secret for JWT tokens (change in production)
- `VITE_API_URL` - Frontend API URL (for production)

## Database

SQLite database file: `server/gov.db`

### Tables
- `admin_users` - Admin login credentials
- `products` - Shop products
- `events` - Church events
- `memberships` - Membership submissions
- `orders` - Shop orders
- `settings` - Website settings
- `carousel_slides` - Homepage carousel
- `password_reset_codes` - Password reset tokens

## Features for Production

To fully prepare for production:

1. **Email Service**: Replace console logging with actual email service (SendGrid, Mailgun, etc.)
2. **Image Storage**: Set up cloud storage (AWS S3, Cloudinary) for carousel images
3. **Authentication**: Set up proper JWT refresh tokens and expiration
