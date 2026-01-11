# Quick Start Guide - Ayyappa Swami Temple Website

## 🚀 Get Started in 5 Minutes

### Step 1: Install Node.js
Download and install from [nodejs.org](https://nodejs.org/) (LTS version recommended)

### Step 2: Install Angular CLI
```bash
npm install -g @angular/cli
```

### Step 3: Install Dependencies
```bash
cd Templae
npm install
```

### Step 4: Run the Development Server
```bash
npm start
```

Visit: `http://localhost:4200`

## 🔥 Firebase Setup (10 minutes)

### 1. Create Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Add Project"
- Name: "ayyappa-swami-temple"
- Click Continue → Continue → Create Project

### 2. Enable Authentication
- Click "Authentication" from left menu
- Click "Get Started"
- Click "Email/Password" → Enable → Save

### 3. Create Firestore Database
- Click "Firestore Database" from left menu
- Click "Create database"
- Choose "Start in production mode"
- Select closest location → Enable

### 4. Enable Storage
- Click "Storage" from left menu
- Click "Get Started"
- Keep default rules → Next → Done

### 5. Get Your Config
- Click gear icon (⚙️) → Project settings
- Scroll down to "Your apps"
- Click web icon (</>) → Register app
- Copy the config object

### 6. Update Environment Files
Paste your config into:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

```typescript
firebase: {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 7. Create Admin User
- In Firebase Console → Authentication → Users
- Click "Add user"
- Email: `admin@temple.org`
- Password: (create a strong password)
- Click "Add user"

### 8. Deploy Security Rules
```bash
npm install -g firebase-tools
firebase login
firebase init

# Select:
# [x] Firestore
# [x] Hosting
# [x] Storage

# Choose "Use an existing project"
# Select your project

firebase deploy --only firestore:rules,storage:rules
```

## 💳 Razorpay Setup (5 minutes)

### 1. Create Account
- Sign up at [Razorpay](https://razorpay.com/)
- Complete KYC for live mode

### 2. Get Test Keys
- Dashboard → Settings → API Keys
- Generate Test Keys
- Copy "Key Id"

### 3. Update Environment
In `src/environments/environment.ts`:
```typescript
razorpay: {
  keyId: "rzp_test_XXXXXXXXXXXXX"
}
```

## 📧 Email Setup (Optional - 10 minutes)

### Option 1: Gmail (Free)

#### 1. Enable 2FA on Gmail
- Gmail → Manage Google Account → Security
- Enable 2-Step Verification

#### 2. Generate App Password
- Google Account → Security → App passwords
- Generate password for "Mail"
- Copy the 16-character password

#### 3. Create Firebase Function
```bash
cd Templae
firebase init functions
# Choose JavaScript
cd functions
npm install nodemailer
```

#### 4. Add Code to `functions/index.js`
```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-16-char-app-password'
  }
});

exports.sendDonationReceipt = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  const { to, subject, templateData } = req.body;

  const mailOptions = {
    from: 'Ayyappa Swami Temple <your-email@gmail.com>',
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b35;">Thank You for Your Donation!</h2>
        <p>Dear ${templateData.donorName},</p>
        <p>We have received your generous donation of <strong>₹${templateData.amount}</strong>.</p>
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Transaction ID:</strong> ${templateData.transactionId}</p>
          <p><strong>Date:</strong> ${templateData.date}</p>
        </div>
        <p>May Lord Ayyappa bless you and your family.</p>
        <p style="font-style: italic; color: #ff6b35;"><strong>Swamiye Saranam Ayyappa!</strong></p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          ${templateData.templeName}<br>
          ${templateData.templeAddress}
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).send({ error: error.message });
  }
});
```

#### 5. Deploy Function
```bash
firebase deploy --only functions
```

#### 6. Update Environment
Copy the function URL from deployment output:
```typescript
emailService: {
  functionsUrl: "https://us-central1-your-project.cloudfunctions.net"
}
```

### Option 2: SendGrid (Free - 100 emails/day)
Similar setup, use SendGrid API instead of Gmail

## 🎨 Add Initial Content

### In Firebase Console → Firestore Database

#### Create "content" collection:
```
Document ID: about-1
{
  section: "about",
  title: "About Lord Ayyappa",
  content: "Lord Ayyappa, also known as Dharma Sastha...",
  updatedAt: (click "timestamp")
}
```

#### Create "gallery" collection:
Upload images through admin dashboard after deployment

## 🚀 Deploy to Production

### 1. Build
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy
```

Your site will be live at: `https://your-project.web.app`

### 3. Add Custom Domain (Optional)
- Firebase Console → Hosting → Add custom domain
- Follow the instructions to point your domain

## 📱 Test Everything

1. ✅ Visit your website
2. ✅ Navigate all pages
3. ✅ Test donation (use Razorpay test card: 4111 1111 1111 1111)
4. ✅ Login to admin: `/admin/login`
5. ✅ Upload images in gallery
6. ✅ Check email receipt

## 🔒 Security

### Switch Razorpay to Live Mode
1. Razorpay Dashboard → Settings → API Keys
2. Generate Live Keys
3. Update `environment.prod.ts` with live key
4. Rebuild and redeploy

## 💰 Costs Summary

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Firebase Hosting | 10 GB storage, 360 MB/day | ₹0/month |
| Firebase Firestore | 50K reads, 20K writes/day | ₹0/month |
| Firebase Storage | 5 GB storage | ₹0/month |
| Firebase Auth | Unlimited users | ₹0/month |
| Razorpay | No monthly fee | 2% per transaction |
| SendGrid/Gmail | 100 emails/day | ₹0/month |

**Total: ₹0/month** for small to medium temple website!

## 🆘 Need Help?

### Common Issues

**Error: Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase deploy fails**
```bash
firebase login
firebase use --add
```

**Razorpay not loading**
- Check if key ID is correct in environment files
- Clear browser cache

## 📞 Support

- Email: admin@temple.org
- Check Firebase Console logs for errors
- Check browser console for frontend errors

---

**You're all set! 🎉 Swamiye Saranam Ayyappa! 🙏**
