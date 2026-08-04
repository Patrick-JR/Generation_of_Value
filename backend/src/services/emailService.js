import nodemailer from 'nodemailer';

// Reusable transporter (lazy-created once)
let _transporter = null;

const getTransporter = () => {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return _transporter;
};

// ── New Order Notification ────────────────────────────────────────────────────
export const sendOrderEmail = async (order) => {
  const transporter = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); padding: 2rem; border-radius: 12px 12px 0 0;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 1.6rem;">🛍️ New GOV Shop Order</h1>
        <p style="color: #aaa; margin: 0.5rem 0 0;">Received at ${new Date().toLocaleString('en-ZM')}</p>
      </div>

      <div style="background: #f9fafb; padding: 2rem; border: 1px solid #e5e7eb; border-top: none;">

        <h2 style="color: #111; font-size: 1.1rem; border-bottom: 2px solid #D4AF37; padding-bottom: 0.5rem;">Product Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 0.4rem 0; color: #555;">Product</td><td style="font-weight: 700;">${order.product.name}</td></tr>
          <tr><td style="padding: 0.4rem 0; color: #555;">Colour</td><td>${order.color}</td></tr>
          <tr><td style="padding: 0.4rem 0; color: #555;">Size</td><td>${order.size}</td></tr>
          <tr><td style="padding: 0.4rem 0; color: #555;">Quantity</td><td>${order.quantity}</td></tr>
          <tr><td style="padding: 0.4rem 0; color: #555;">Unit Price</td><td>K${order.product.price}</td></tr>
          <tr>
            <td style="padding: 0.4rem 0; color: #555; font-weight: 700;">Total</td>
            <td style="font-size: 1.2rem; font-weight: 800; color: #D4AF37;">K${order.total}</td>
          </tr>
        </table>

        <h2 style="color: #111; font-size: 1.1rem; border-bottom: 2px solid #D4AF37; padding-bottom: 0.5rem; margin-top: 1.5rem;">Customer Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 0.4rem 0; color: #555;">Name</td><td style="font-weight: 700;">${order.customer.name}</td></tr>
          <tr><td style="padding: 0.4rem 0; color: #555;">Phone</td><td>${order.customer.phone}</td></tr>
          ${order.customer.message ? `<tr><td style="padding: 0.4rem 0; color: #555;">Note</td><td><em>${order.customer.message}</em></td></tr>` : ''}
        </table>

        <div style="background: #D4AF37; padding: 1rem; border-radius: 8px; margin-top: 1.5rem; text-align: center;">
          <p style="margin: 0; font-weight: 700; color: #000;">
            💬 WhatsApp was also opened on the customer's device. Follow up if needed!
          </p>
        </div>
      </div>

      <div style="background: #0a0a0a; padding: 1rem; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #666; font-size: 0.85rem; margin: 0;">Generation of Value – GOV Shop Notifications</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"GOV Shop 🛍️" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // send to yourself
    subject: `New Order: ${order.product.name} — K${order.total} (${order.customer.name})`,
    html,
  });
};

// ── New Contact Message Notification ─────────────────────────────────────────
export const sendContactEmail = async (msg) => {
  const transporter = getTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a2e); padding: 2rem; border-radius: 12px 12px 0 0;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 1.6rem;">✉️ New Contact Message</h1>
        <p style="color: #aaa; margin: 0.5rem 0 0;">Received at ${new Date().toLocaleString('en-ZM')}</p>
      </div>

      <div style="background: #f9fafb; padding: 2rem; border: 1px solid #e5e7eb; border-top: none;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 0.4rem 0; color: #555; width: 100px;">From</td><td style="font-weight: 700;">${msg.name}</td></tr>
          <tr><td style="padding: 0.4rem 0; color: #555;">Email</td><td><a href="mailto:${msg.email}">${msg.email}</a></td></tr>
          <tr><td style="padding: 0.4rem 0; color: #555;">Subject</td><td>${msg.subject}</td></tr>
        </table>

        <div style="background: #fff; border-left: 4px solid #D4AF37; padding: 1rem 1.25rem; border-radius: 0 8px 8px 0; margin-top: 1.25rem;">
          <p style="margin: 0; line-height: 1.7; color: #333;">${msg.message.replace(/\n/g, '<br>')}</p>
        </div>

        <div style="margin-top: 1.5rem; text-align: center;">
          <a href="mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}"
             style="background: #D4AF37; color: #000; padding: 0.75rem 2rem; border-radius: 50px; text-decoration: none; font-weight: 700; display: inline-block;">
            Reply to ${msg.name}
          </a>
        </div>
      </div>

      <div style="background: #0a0a0a; padding: 1rem; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #666; font-size: 0.85rem; margin: 0;">Generation of Value – Contact Form Notifications</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"GOV Website ✉️" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: msg.email,
    subject: `Contact: ${msg.subject} — from ${msg.name}`,
    html,
  });
};
