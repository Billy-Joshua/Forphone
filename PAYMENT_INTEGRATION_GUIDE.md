# Payment Gateway Integration Guide

## Overview
This guide shows how to integrate real payment processors with the checkout system.

---

## 1️⃣ MTN Mobile Money Integration

### API Setup
```javascript
// In payment-handler.js, replace processMTNPayment()
async function processMTNPayment(amount, phone) {
  try {
    const response = await fetch('https://api.mtn.co.rw/payment/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MTN_API_KEY}`
      },
      body: JSON.stringify({
        msisdn: phone,
        amount: amount,
        externalId: `ORDER-${Date.now()}`,
        payerMessage: 'Payment for EstoreRW order',
        payeeNote: 'Payment received'
      })
    });

    const data = await response.json();
    if (data.status === 'PENDING') {
      // Customer will receive USSD prompt
      store.showNotification(
        `USSD prompt sent to ${phone}. Please complete the payment.`,
        'success'
      );
      
      // Poll for payment status
      pollMTNPaymentStatus(data.referenceId);
    }
  } catch (error) {
    store.showNotification('Payment failed: ' + error.message, 'error');
  }
}

// Poll for payment completion
async function pollMTNPaymentStatus(referenceId) {
  const maxAttempts = 30; // 5 minutes with 10-second intervals
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;
    
    const response = await fetch(
      `https://api.mtn.co.rw/payment/status/${referenceId}`,
      {
        headers: { 'Authorization': `Bearer ${MTN_API_KEY}` }
      }
    );
    
    const data = await response.json();
    
    if (data.status === 'SUCCESSFUL') {
      clearInterval(interval);
      store.completeOrder();
    } else if (data.status === 'FAILED' || attempts > maxAttempts) {
      clearInterval(interval);
      store.showNotification('Payment failed or timeout', 'error');
    }
  }, 10000); // Check every 10 seconds
}
```

### Implementation
1. Get API key from MTN Rwanda
2. Add `MTN_API_KEY` to environment variables
3. Replace phone with user's phone number
4. Handle webhook for payment notifications

---

## 2️⃣ Airtel Money Integration

### API Setup
```javascript
async function processAirtelPayment(amount, phone) {
  try {
    const response = await fetch('https://api.airtel.co.rw/payment/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': AIRTEL_API_KEY
      },
      body: JSON.stringify({
        phoneNumber: phone,
        amount: amount,
        currency: 'RWF',
        externalReference: `ORD-${Date.now()}`,
        description: 'EstoreRW Purchase'
      })
    });

    const data = await response.json();
    
    if (data.statusCode === '00') {
      store.showNotification(
        'Payment initiated. Please check your Airtel balance.',
        'success'
      );
      pollAirtelPaymentStatus(data.transactionId);
    } else {
      throw new Error(data.statusDescription);
    }
  } catch (error) {
    store.showNotification('Payment failed: ' + error.message, 'error');
  }
}
```

---

## 3️⃣ PayPal Integration

### Setup
```javascript
// Add PayPal Client ID to HTML head
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

// Update checkout form
<div id="paypal-button-container"></div>

async function processPayPalPayment(amount) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: (amount / 1250).toFixed(2) // Convert RWF to USD (approx)
          },
          description: 'EstoreRW Phone Purchase'
        }],
        application_context: {
          brand_name: 'EstoreRW',
          user_action: 'PAY_NOW'
        }
      });
    },
    
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        if (details.status === 'COMPLETED') {
          store.checkoutData.payment.transactionId = details.id;
          store.completeOrder();
          store.showNotification('Payment successful!', 'success');
        }
      });
    },
    
    onError: (error) => {
      store.showNotification('PayPal payment failed', 'error');
      console.error(error);
    }
  }).render('#paypal-button-container');
}
```

---

## 4️⃣ Bank Transfer Integration (Bank of Kigali)

### Implementation
```javascript
// Send payment request to bank
async function processBankPayment(orderId, amount, email) {
  try {
    // Create bank transfer request
    const response = await fetch('https://api.bog.rw/transfer/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BOG_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'RWF',
        recipientAccount: 'ESTORE_ACCOUNT_NUMBER',
        description: `Order ${orderId}`,
        customerEmail: email,
        callbackUrl: 'https://estore.rw/api/payment-callback'
      })
    });

    const data = await response.json();
    
    // Send instructions email
    await sendBankPaymentEmail(email, {
      accountNumber: data.accountNumber,
      accountName: 'EstoreRW Limited',
      bank: 'Bank of Kigali',
      amount: amount,
      orderId: orderId,
      reference: data.referenceId
    });

    store.showNotification(
      'Payment instructions sent to your email',
      'success'
    );

    // Store pending payment reference
    store.checkoutData.payment.referenceId = data.referenceId;
    store.completeOrder();
  } catch (error) {
    store.showNotification('Bank payment setup failed: ' + error.message, 'error');
  }
}

async function sendBankPaymentEmail(email, details) {
  // Send via email service
  await fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
      to: email,
      subject: 'Bank Payment Instructions - EstoreRW',
      template: 'bank-payment',
      data: details
    })
  });
}
```

**Webhook Listener** (Backend):
```javascript
// Listen for bank payment confirmations
app.post('/api/payment-callback/bank', (req, res) => {
  const { referenceId, status, amount } = req.body;
  
  if (status === 'COMPLETED') {
    // Mark order as paid
    Order.updateOne(
      { paymentReference: referenceId },
      { status: 'paid', confirmedAt: new Date() }
    );
    
    // Send confirmation email
    sendOrderConfirmation(referenceId);
  }
  
  res.json({ success: true });
});
```

---

## 5️⃣ Stripe Card Integration

### Setup
```javascript
// Add Stripe to HTML
<script src="https://js.stripe.com/v3/"></script>

async function initStripe() {
  const stripe = Stripe(STRIPE_PUBLIC_KEY);
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  
  cardElement.mount('#card-element');
  
  return { stripe, elements, cardElement };
}

async function processCardPayment(amount, email) {
  const { stripe, elements } = await initStripe();
  
  const { paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: { email: email }
  });
  
  if (paymentMethod) {
    // Send to backend for processing
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        amount: Math.round(amount * 100), // Stripe uses cents
        currency: 'usd',
        orderId: `ORD-${Date.now()}`
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      store.completeOrder();
      store.showNotification('Payment successful!', 'success');
    } else {
      store.showNotification('Payment failed: ' + result.error, 'error');
    }
  }
}
```

---

## 6️⃣ Bitcoin/Crypto Integration

### Using Coinbase Commerce
```javascript
async function processCryptoPayment(amount, email) {
  try {
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'X-CC-Api-Key': COINBASE_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'EstoreRW Order',
        description: `Payment for order ${Date.now()}`,
        local_price: {
          amount: (amount / 50000).toFixed(4), // RWF to BTC estimate
          currency: 'BTC'
        },
        pricing_type: 'fixed_price',
        metadata: {
          orderId: `ORD-${Date.now()}`,
          email: email
        },
        redirect_url: 'https://estore.rw/payment-success',
        cancel_url: 'https://estore.rw/payment-cancel'
      })
    });

    const charge = await response.json();
    
    // Redirect to payment page
    window.location.href = charge.data.hosted_url;
  } catch (error) {
    store.showNotification('Crypto payment failed: ' + error.message, 'error');
  }
}
```

---

## Backend Example (Node.js + Express)

```javascript
const express = require('express');
const app = express();

// Payment webhook
app.post('/api/webhook/payment', async (req, res) => {
  const { orderId, status, amount, method, transactionId } = req.body;
  
  if (status === 'completed') {
    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'confirmed',
        paymentMethod: method,
        transactionId: transactionId,
        paidAt: new Date()
      }
    );
    
    // Send confirmation
    await sendConfirmationEmail(order);
    
    // Trigger fulfillment
    await triggerFulfillment(order);
    
    res.json({ success: true });
  }
});

// Process payment
app.post('/api/process-payment', async (req, res) => {
  try {
    const { paymentMethodId, amount, orderId } = req.body;
    
    // Create payment intent
    const intent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true
    });
    
    if (intent.status === 'succeeded') {
      // Save order
      const order = await Order.create({
        orderId: orderId,
        status: 'confirmed',
        paymentIntentId: intent.id
      });
      
      res.json({ success: true, orderId: order.orderId });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
```

---

## Environment Variables

Create `.env` file:
```
MTN_API_KEY=your_mtn_key
AIRTEL_API_KEY=your_airtel_key
BOG_API_KEY=your_bank_of_kigali_key
PAYPAL_CLIENT_ID=your_paypal_id
STRIPE_PUBLIC_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
COINBASE_API_KEY=your_coinbase_key
```

---

## Testing Credentials

### Stripe Test Cards
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0025 0000 3155

### PayPal Sandbox
- Buyer: sb-buyer@example.com
- Password: Test1234!

---

## Error Handling

```javascript
// Add to payment functions
try {
  // Payment processing
} catch (error) {
  // Log error
  console.error('Payment failed:', error);
  
  // Notify user
  store.showNotification(
    `Payment Error: ${error.message}`,
    'error'
  );
  
  // Save failed attempt
  await saveFailedPaymentLog({
    orderId: order.id,
    method: paymentMethod,
    error: error.message,
    timestamp: new Date()
  });
  
  // Allow retry
  return false;
}
```

---

## Security Best Practices

✅ Never expose API keys in frontend code
✅ Use backend to process sensitive data
✅ Implement HTTPS/SSL
✅ Validate all amounts on backend
✅ Log all payment attempts
✅ Use webhooks for verification
✅ Implement rate limiting
✅ Add fraud detection
✅ Store tokens, not card numbers
✅ Follow PCI compliance

---

## Production Checklist

- [ ] All API keys in environment variables
- [ ] HTTPS enabled
- [ ] Webhook handlers implemented
- [ ] Error logging setup
- [ ] Payment verification working
- [ ] Email notifications setup
- [ ] Testing with real payment processors
- [ ] Refund process implemented
- [ ] Invoice generation ready
- [ ] Customer support process documented

---

**Last Updated**: February 13, 2026
**Version**: 1.0

Ready to integrate real payments! 🚀
