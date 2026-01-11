# Firebase Cloud Functions Setup Guide

This guide explains how to set up Firebase Cloud Functions for sending donation receipt emails.

## Step 1: Initialize Firebase Functions

```bash
cd /Users/sambasiva/Documents/personal/Templae
firebase init functions

# Select:
# - Use an existing project (select your temple project)
# - JavaScript
# - Yes to ESLint
# - Yes to install dependencies
```

## Step 2: Install Dependencies

```bash
cd functions
npm install nodemailer cors
```

## Step 3: Create the Function

Create or edit `functions/index.js` with the following code:

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Configure the email transport using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-temple-email@gmail.com', // Replace with your email
    pass: 'your-16-char-app-password'     // Replace with your App Password
  }
});

/**
 * Send donation receipt email to donor
 */
exports.sendDonationReceipt = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { to, subject, templateData } = req.body;

      // Validate required fields
      if (!to || !templateData) {
        res.status(400).send({ error: 'Missing required fields' });
        return;
      }

      // Create email HTML
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .details {
              background: #f5f5f5;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
              border-left: 4px solid #ff6b35;
            }
            .details p {
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .mantra {
              font-style: italic;
              color: #ff6b35;
              font-weight: bold;
              font-size: 18px;
              margin: 20px 0;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🙏 Thank You for Your Donation!</h1>
            </div>
            <div class="content">
              <p>Dear ${templateData.donorName},</p>
              
              <p>We have received your generous donation to ${templateData.templeName}. May Lord Ayyappa bless you and your family with peace, prosperity, and happiness.</p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #ff6b35;">Donation Details</h3>
                <p><strong>Amount:</strong> ₹${templateData.amount}</p>
                <p><strong>Transaction ID:</strong> ${templateData.transactionId}</p>
                <p><strong>Date:</strong> ${templateData.date}</p>
              </div>
              
              <p>Your contribution helps us in:</p>
              <ul>
                <li>Conducting daily poojas and rituals</li>
                <li>Maintaining temple premises</li>
                <li>Serving devotees through Annadanam</li>
                <li>Supporting community service activities</li>
              </ul>
              
              <div class="mantra">
                Swamiye Saranam Ayyappa!
              </div>
              
              <div class="footer">
                <p><strong>${templateData.templeName}</strong></p>
                <p>${templateData.templeAddress}</p>
                <p>This is an automated receipt. Please keep it for your records.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      const mailOptions = {
        from: `${templateData.templeName} <your-temple-email@gmail.com>`,
        to: to,
        subject: subject || 'Donation Receipt - Ayyappa Swami Temple',
        html: emailHtml
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log('Email sent:', info.messageId);
      res.status(200).send({ 
        success: true, 
        messageId: info.messageId 
      });

    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ 
        error: 'Failed to send email', 
        details: error.message 
      });
    }
  });
});

/**
 * Create Razorpay Order (Optional - for server-side order creation)
 */
exports.createRazorpayOrder = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { amount, currency = 'INR', receipt } = req.body;

      // In production, use Razorpay SDK to create order
      // const Razorpay = require('razorpay');
      // const razorpay = new Razorpay({
      //   key_id: functions.config().razorpay.key_id,
      //   key_secret: functions.config().razorpay.key_secret
      // });
      //
      // const order = await razorpay.orders.create({
      //   amount: amount * 100,
      //   currency: currency,
      //   receipt: receipt,
      //   payment_capture: 1
      // });

      // For now, return mock order
      const order = {
        id: 'order_' + Date.now(),
        amount: amount * 100,
        currency: currency,
        receipt: receipt
      };

      res.status(200).send({ success: true, order });

    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).send({ 
        error: 'Failed to create order', 
        details: error.message 
      });
    }
  });
});

/**
 * Verify Razorpay Payment (Optional - for server-side verification)
 */
exports.verifyRazorpayPayment = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      // In production, verify signature using Razorpay SDK
      // const crypto = require('crypto');
      // const generated_signature = crypto
      //   .createHmac('sha256', functions.config().razorpay.key_secret)
      //   .update(razorpay_order_id + '|' + razorpay_payment_id)
      //   .digest('hex');
      //
      // const isValid = generated_signature === razorpay_signature;

      // For now, return success
      res.status(200).send({ 
        success: true, 
        verified: true 
      });

    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).send({ 
        error: 'Failed to verify payment', 
        details: error.message 
      });
    }
  });
});
```

## Step 4: Configure Gmail

### Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable it

### Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other" → type "Temple Website"
4. Click "Generate"
5. Copy the 16-character password (no spaces)
6. Update the password in your functions/index.js

## Step 5: Deploy the Function

```bash
cd /Users/sambasiva/Documents/personal/Templae
firebase deploy --only functions
```

Wait for deployment to complete. You'll see output like:
```
✔  functions[sendDonationReceipt]: Successful create operation.
Function URL: https://us-central1-your-project.cloudfunctions.net/sendDonationReceipt
```

## Step 6: Update Environment Files

Copy the function URL and update both environment files:

**src/environments/environment.ts:**
```typescript
emailService: {
  functionsUrl: "https://us-central1-your-project.cloudfunctions.net"
}
```

**src/environments/environment.prod.ts:**
```typescript
emailService: {
  functionsUrl: "https://us-central1-your-project.cloudfunctions.net"
}
```

## Step 7: Test the Function

### Test from Command Line
```bash
curl -X POST \
  https://us-central1-your-project.cloudfunctions.net/sendDonationReceipt \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "subject": "Test Donation Receipt",
    "templateData": {
      "donorName": "Test User",
      "amount": 1000,
      "transactionId": "test_12345",
      "date": "2026-01-11",
      "templeName": "Ayyappa Swami Temple",
      "templeAddress": "Sabarimala, Kerala, India"
    }
  }'
```

### Test from Website
Make a test donation and check if email is received.

## Troubleshooting

### Function Not Deploying
```bash
# Check Firebase login
firebase login --reauth

# Check project
firebase use --add

# Try deploying again
firebase deploy --only functions
```

### Emails Not Sending

1. **Check Gmail settings:**
   - 2FA enabled?
   - App Password correct?
   - Less secure app access (not needed with App Password)

2. **Check function logs:**
   ```bash
   firebase functions:log --only sendDonationReceipt
   ```

3. **Test email credentials:**
   Create a simple test script:
   ```javascript
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-app-password'
     }
   });
   
   transporter.sendMail({
     from: 'your-email@gmail.com',
     to: 'test@example.com',
     subject: 'Test',
     text: 'Test email'
   }).then(info => {
     console.log('Success:', info);
   }).catch(err => {
     console.error('Error:', err);
   });
   ```

### CORS Errors
The function includes CORS handling. If you still get errors:
```javascript
const cors = require('cors')({ 
  origin: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
});
```

## Alternative: SendGrid

If you prefer SendGrid over Gmail:

```bash
cd functions
npm install @sendgrid/mail
```

**functions/index.js:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

exports.sendDonationReceipt = functions.https.onRequest(async (req, res) => {
  const msg = {
    to: req.body.to,
    from: 'temple@yourdomain.com', // Must be verified in SendGrid
    subject: req.body.subject,
    html: emailHtml
  };
  
  try {
    await sgMail.send(msg);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
```

## Monitoring

### View Function Logs
```bash
firebase functions:log
```

### Monitor in Console
1. Go to Firebase Console
2. Click "Functions"
3. Click on function name
4. See logs, metrics, and errors

## Cost Monitoring

Free tier includes:
- 2M invocations/month
- 400K GB-seconds
- 200K GHz-seconds

Check usage:
1. Firebase Console → Functions
2. Click "Usage" tab
3. See invocation count and costs

---

**Your email service is now ready! 📧**

**Swamiye Saranam Ayyappa! 🙏**
