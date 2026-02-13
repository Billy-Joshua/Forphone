# 📧 Email Notification Integration Guide

## Overview

Your e-commerce system now captures order information and is ready to send email notifications. This guide shows how to integrate with a real email service.

---

## Quick Setup Options

### Option 1: Mailgun (Recommended - Free tier available)

**Step 1: Create Mailgun Account**
1. Go to https://www.mailgun.com
2. Sign up for free account
3. Get your API key and domain

**Step 2: Create Backend Endpoint**

```javascript
// backend.js (Node.js with Express)
const express = require('express');
const mailgun = require('mailgun.js');
const FormData = require('form-data');

const app = express();
app.use(express.json());

const mg = new mailgun(FormData);
const domain = 'YOUR_MAILGUN_DOMAIN.com';
const client = mg.client({username: 'api', key: 'YOUR_MAILGUN_API_KEY'});

app.post('/api/send-order-email', async (req, res) => {
  const { adminEmail, customerEmail, order } = req.body;

  const emailToAdmin = `
    <h2>New Order Received!</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Email:</strong> ${order.customerEmail}</p>
    <p><strong>Phone:</strong> ${order.customerPhone}</p>
    <p><strong>Address:</strong> ${order.shippingAddress}</p>
    
    <h3>Items:</h3>
    <pre>${order.items}</pre>
    
    <h3>Summary:</h3>
    <p>Subtotal: RWF ${order.subtotal.toLocaleString()}</p>
    <p>Shipping: RWF ${order.shipping.toLocaleString()}</p>
    <p>Discount: RWF ${order.discount.toLocaleString()}</p>
    <p><strong>Total: RWF ${order.total.toLocaleString()}</strong></p>
    
    <p>Payment Method: ${order.paymentMethod}</p>
  `;

  const emailToCustomer = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <h3>Items:</h3>
    <pre>${order.items}</pre>
    <p><strong>Total: RWF ${order.total.toLocaleString()}</strong></p>
    <p>We'll contact you shortly with shipping updates.</p>
  `;

  try {
    // Send to admin
    await client.messages.create(domain, {
      from: `Forphone Store <noreply@${domain}>`,
      to: adminEmail,
      subject: `New Order - ${order.orderId}`,
      html: emailToAdmin
    });

    // Send to customer
    await client.messages.create(domain, {
      from: `Forphone Store <noreply@${domain}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html: emailToCustomer
    });

    res.json({ success: true, message: 'Emails sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### Option 2: SendGrid (Popular, Free tier available)

**Step 1: Create SendGrid Account**
1. Go to https://sendgrid.com
2. Sign up for free account
3. Get API key from Settings

**Step 2: Create Backend Endpoint**

```javascript
// backend.js (Node.js with Express)
const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-order-email', async (req, res) => {
  const { adminEmail, customerEmail, order } = req.body;

  const emailToAdmin = `
    <h2>New Order Received!</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Customer:</strong> ${order.customerName}</p>
    <p><strong>Email:</strong> ${order.customerEmail}</p>
    <p><strong>Phone:</strong> ${order.customerPhone}</p>
    <p><strong>Address:</strong> ${order.shippingAddress}</p>
    <h3>Items:</h3>
    <pre>${order.items}</pre>
    <h3>Summary:</h3>
    <p>Subtotal: RWF ${order.subtotal.toLocaleString()}</p>
    <p>Shipping: RWF ${order.shipping.toLocaleString()}</p>
    <p>Total: RWF ${order.total.toLocaleString()}</p>
  `;

  try {
    await sgMail.send({
      to: adminEmail,
      from: 'noreply@forphone.rw',
      subject: `New Order - ${order.orderId}`,
      html: emailToAdmin
    });

    await sgMail.send({
      to: customerEmail,
      from: 'support@forphone.rw',
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Order ID: ${order.orderId}</p>
        <p>Total: RWF ${order.total.toLocaleString()}</p>
        <p>We'll contact you shortly with updates.</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running'));
```

---

## Step 3: Uncomment Email Code

In [login-checkout.js](login-checkout.js#L495-502), uncomment the fetch call in `sendOrderEmail()`:

```javascript
// Before: (commented out)
// fetch('/api/send-order-email', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ adminEmail, customerEmail, order: emailData })
// }).catch(err => console.error('Email send failed:', err));

// After: (uncommented)
fetch('/api/send-order-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    adminEmail: 'billyjoshuaishimwe@gmail.com',
    customerEmail: emailData.customerEmail,
    order: emailData 
  })
}).catch(err => console.error('Email send failed:', err));
```

---

## Step 4: Test Email Sending

**Frontend Testing:**
1. Complete a purchase
2. Open Developer Tools (F12)
3. Check Console tab
4. You should see: `📧 NEW ORDER EMAIL NOTIFICATION`
5. Check that localStorage has `estore_email_notifications`

**Backend Testing:**
```bash
curl -X POST http://localhost:3000/api/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "adminEmail": "billyjoshuaishimwe@gmail.com",
    "customerEmail": "test@example.com",
    "order": {
      "orderId": "ORD-123456",
      "customerName": "John Doe",
      "total": 50000
    }
  }'
```

---

## Environment Variables

Create `.env` file on your server:

```
MAILGUN_API_KEY=your_key_here
MAILGUN_DOMAIN=your_domain.com
SENDGRID_API_KEY=your_key_here
ADMIN_EMAIL=billyjoshuaishimwe@gmail.com
```

Load in Node.js:
```javascript
require('dotenv').config();
const apiKey = process.env.MAILGUN_API_KEY;
```

---

## Email Data Structure

The system sends this data to your backend:

```javascript
{
  orderId: "ORD-1734543210000",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+250792123456",
  shippingAddress: "Kigali, Rwanda",
  items: "Product 1 x2 = RWF 20,000\nProduct 2 x1 = RWF 15,000",
  paymentMethod: "MTN",
  subtotal: 35000,
  shipping: 5000,
  discount: 0,
  total: 40000,
  date: "2/13/2026, 10:30:45 AM"
}
```

---

## Testing with Dummy Service (Dev Only)

If you don't want to set up email yet, add this to your backend temporarily:

```javascript
app.post('/api/send-order-email', (req, res) => {
  const { order } = req.body;
  console.log('📧 ORDER EMAIL:');
  console.log(JSON.stringify(order, null, 2));
  res.json({ success: true, message: 'Email logged to console' });
});
```

---

## Important Notes

1. **API Key Security**: Never put API keys in frontend code
2. **CORS**: Enable CORS on your backend to allow requests from frontend
3. **Rate Limiting**: Implement rate limiting to prevent spam
4. **Error Handling**: Always catch and log email errors
5. **Testing**: Use sandbox mode first before going live

---

## CORS Setup Example

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://yourforphone.com',
  credentials: true
}));
```

---

## Email Templates

You can use HTML email templates. Popular services:
- Mailgun Templates
- SendGrid Dynamic Templates
- Custom HTML templates

---

## Current Email Recipients

**Admin Email:** billyjoshuaishimwe@gmail.com
**Customer Email:** From order form (dynamically captured)

To change admin email, edit [login-checkout.js](login-checkout.js#L475):
```javascript
const adminEmail = 'NEW_EMAIL@gmail.com';
```

---

## Troubleshooting

### Email not sending?
1. Check API key is correct
2. Verify domain is authorized
3. Check console for errors
4. Look at email service's activity log
5. Test with curl command first

### Emails going to spam?
1. Set up SPF/DKIM records
2. Add unsubscribe link
3. Use professional sender domain
4. Avoid spam trigger words

### Rate limiting issues?
1. Implement queue system
2. Add delays between emails
3. Use batching for multiple emails

---

## Next Steps

1. ✅ Choose email service (Mailgun/SendGrid)
2. ✅ Create account and get API key
3. ✅ Set up backend endpoint
4. ✅ Uncomment `fetch()` in login-checkout.js
5. ✅ Test with sample order
6. ✅ Deploy to production
7. ✅ Monitor email delivery

---

**Questions?** Check your email service's documentation or the inline comments in the code.

**Status:** Ready to implement! 🚀
