/**
 * Payment Method Handler
 * Displays relevant payment instructions based on selected method
 */

document.addEventListener('DOMContentLoaded', function() {
  // Payment method change handler
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  const paymentDetailsDiv = document.getElementById('payment-details');

  if (paymentRadios.length > 0 && paymentDetailsDiv) {
    const updatePaymentDetails = function() {
      const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
      let detailsHTML = '';

      switch(selectedMethod) {
        case 'mtn':
          detailsHTML = `
            <div class="payment-instruction">
              <h5 style="color: #4a9eff; margin-bottom: 1rem;">MTN Mobile Money Payment</h5>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Step 1: Dial</span>
                <span class="payment-detail-value">*151*2*5*<your-phone>#</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Step 2: Follow Prompts</span>
                <span class="payment-detail-value">Enter amount and confirm</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Step 3: Get Code</span>
                <span class="payment-detail-value">Note your transaction code</span>
              </div>
              <p style="margin-top: 1rem; color: #a0a0a0; font-size: 0.85rem;">
                ℹ️ We will verify your payment within 2-4 hours
              </p>
            </div>
          `;
          break;

        case 'airtel':
          detailsHTML = `
            <div class="payment-instruction">
              <h5 style="color: #4a9eff; margin-bottom: 1rem;">Airtel Money Payment</h5>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Step 1: Dial</span>
                <span class="payment-detail-value">*150*1*<your-phone>#</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Step 2: Enter Amount</span>
                <span class="payment-detail-value">Total order amount</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Step 3: Confirm</span>
                <span class="payment-detail-value">Complete the transaction</span>
              </div>
              <p style="margin-top: 1rem; color: #a0a0a0; font-size: 0.85rem;">
                ℹ️ Payment confirmed instantly on Airtel network
              </p>
            </div>
          `;
          break;

        case 'bank':
          detailsHTML = `
            <div class="payment-instruction">
              <h5 style="color: #4a9eff; margin-bottom: 1rem;">Bank of Kigali Transfer</h5>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Bank Name</span>
                <span class="payment-detail-value">Bank of Kigali</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Account Name</span>
                <span class="payment-detail-value">EstoreRW Limited</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Account Number</span>
                <span class="payment-detail-value">1234567890</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">SWIFT Code</span>
                <span class="payment-detail-value">BOKB RW</span>
              </div>
              <p style="margin-top: 1rem; color: #a0a0a0; font-size: 0.85rem;">
                ℹ️ Please include your order number in the transfer reference
              </p>
            </div>
          `;
          break;

        case 'paypal':
          detailsHTML = `
            <div class="payment-instruction">
              <h5 style="color: #4a9eff; margin-bottom: 1rem;">PayPal Payment</h5>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Payment Method</span>
                <span class="payment-detail-value">Credit Card / Debit Card</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Accepted Cards</span>
                <span class="payment-detail-value">Visa, Mastercard, Amex</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Processing</span>
                <span class="payment-detail-value">Instant</span>
              </div>
              <p style="margin-top: 1rem; color: #a0a0a0; font-size: 0.85rem;">
                ℹ️ Click Next to be redirected to PayPal for secure payment
              </p>
            </div>
          `;
          break;

        case 'cod':
          detailsHTML = `
            <div class="payment-instruction">
              <h5 style="color: #4a9eff; margin-bottom: 1rem;">Cash on Delivery</h5>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Payment Timing</span>
                <span class="payment-detail-value">When you receive the package</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Accepted Currency</span>
                <span class="payment-detail-value">RWF Cash</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Delivery Timeframe</span>
                <span class="payment-detail-value">1-3 business days</span>
              </div>
              <p style="margin-top: 1rem; color: #a0a0a0; font-size: 0.85rem;">
                ℹ️ Our delivery agent will call you before arrival. Please have exact amount ready.
              </p>
            </div>
          `;
          break;

        case 'crypto':
          detailsHTML = `
            <div class="payment-instruction">
              <h5 style="color: #4a9eff; margin-bottom: 1rem;">Bitcoin Payment</h5>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Wallet Address</span>
                <span class="payment-detail-value" style="word-break: break-all;">1A1z7agoat2Bt89zn1fQCbBn622Esq7</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Network</span>
                <span class="payment-detail-value">Bitcoin (BTC)</span>
              </div>
              <div class="payment-detail-item">
                <span class="payment-detail-label">Confirmation</span>
                <span class="payment-detail-value">After blockchain confirmation</span>
              </div>
              <p style="margin-top: 1rem; color: #a0a0a0; font-size: 0.85rem;">
                ℹ️ Please reply with your transaction hash for order confirmation
              </p>
            </div>
          `;
          break;
      }

      paymentDetailsDiv.innerHTML = detailsHTML;
    };

    // Initial load
    paymentRadios.forEach(radio => radio.addEventListener('change', updatePaymentDetails));
    
    // Set initial state if one is selected
    if (document.querySelector('input[name="payment-method"]:checked')) {
      updatePaymentDetails();
    }
  }

  // Promo code handler
  const applyPromoBtn = document.getElementById('apply-promo');
  const promoInput = document.getElementById('promo-code');

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', function() {
      const code = promoInput.value.toUpperCase().trim();
      
      // Demo promo codes
      const promoCodes = {
        'WELCOME10': 5000,
        'SAVE15': 7500,
        'ESTORE20': 10000,
        'KIGALI5': 2500
      };

      if (promoCodes[code]) {
        const discount = promoCodes[code];
        store.checkoutData.discount = discount;
        store.updateCartUI();
        store.showNotification(`Promo code applied! Discount: RWF ${discount.toLocaleString()}`, 'success');
        promoInput.disabled = true;
        applyPromoBtn.disabled = true;
        applyPromoBtn.innerHTML = '<i class="fas fa-check"></i> Applied';
      } else {
        store.showNotification('Invalid promo code', 'error');
      }
    });
  }

  // Form accessibility improvements
  const allInputs = document.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    const label = input.parentElement.querySelector('label');
    if (!label && input.placeholder) {
      input.setAttribute('aria-label', input.placeholder);
    }
  });

  // Auto-populate email if user is logged in
  if (window.store && window.store.currentUser) {
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('full-name');
    
    if (emailInput && !emailInput.value) {
      emailInput.value = window.store.currentUser.email;
    }
    if (nameInput && !nameInput.value) {
      nameInput.value = window.store.currentUser.name;
    }
  }
});
