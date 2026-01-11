# Ayyappa Swami Temple Website

A modern, beautiful, and cost-effective temple website built with Angular and Firebase featuring:
- 🏛️ Beautiful responsive temple website
- 💰 Razorpay payment integration for donations
- 📧 Automated email receipts for donors
- 🎨 Admin dashboard for content and gallery management
- 💾 Firebase for hosting, database, storage, and authentication
- ⚡ Fast, secure, and scalable

## Tech Stack

- **Frontend**: Angular 17 with Angular Material
- **Backend**: Firebase (Firestore, Storage, Auth, Hosting)
- **Payment Gateway**: Razorpay
- **Email Service**: Firebase Cloud Functions (with SendGrid or Nodemailer)

## Features

### Public Website
- **Home Page**: Hero section, services, upcoming events, call-to-action
- **About Page**: Temple history and significance
- **Services Page**: List of poojas and rituals with pricing
- **Gallery**: Beautiful image gallery with Firebase Storage
- **Donations**: Secure payment integration with Razorpay
- **Contact**: Contact form and temple information

### Admin Dashboard
- **Authentication**: Secure Firebase Authentication
- **Dashboard Overview**: Statistics and recent donations
- **Donation Management**: View all donation history
- **Content Management**: Edit temple content dynamically
- **Gallery Management**: Upload and delete images

## Cost Breakdown (Minimum Cost Setup)

### Firebase (Free Tier - Spark Plan)
- **Hosting**: 10 GB storage, 360 MB/day transfer - **FREE**
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day - **FREE**
- **Storage**: 5 GB storage, 1 GB/day download - **FREE**
- **Authentication**: Unlimited users - **FREE**

**Estimated: ₹0/month** for small to medium traffic

### Razorpay
- **Transaction Fee**: 2% per transaction + ₹0 setup fee
- No monthly fees, only pay when you receive donations

### Email Service (Choose one)
1. **SendGrid Free Tier**: 100 emails/day - **FREE**
2. **Gmail with Nodemailer**: Free - **FREE**
3. **Firebase Extensions (Trigger Email)**: ~₹0.01 per email

**Total Monthly Cost: ₹0 - ₹500** (depending on usage)

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ and npm
- Angular CLI: `npm install -g @angular/cli`
- Firebase CLI: `npm install -g firebase-tools`

### 2. Install Dependencies
```bash
cd Templae
npm install
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "ayyappa-swami-temple"
4. Disable Google Analytics (optional)

#### Enable Services
1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Create admin user manually

2. **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in production mode
   - Choose location closest to your users

3. **Storage**:
   - Go to Storage → Get Started
   - Use default security rules (we'll update them)

4. **Hosting**:
   - Go to Hosting → Get Started

#### Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" → Add app → Web
3. Copy the config object
4. Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  razorpay: {
    keyId: "YOUR_RAZORPAY_KEY_ID"
  },
  emailService: {
    functionsUrl: "YOUR_FIREBASE_FUNCTIONS_URL"
  }
};
```

5. Copy same config to `src/environments/environment.prod.ts` (set production: true)

### 4. Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test Keys (use Test mode for development)
4. Copy Key ID to environment files
5. For production, generate Live Keys

### 5. Deploy Firebase Rules

```bash
firebase login
firebase init

# Select:
# - Firestore
# - Hosting
# - Storage

# Use existing project

firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 6. Create Admin User

```bash
# In Firebase Console:
# Authentication → Users → Add User
# Email: admin@temple.org
# Password: (create strong password)
```

### 7. Run Locally

```bash
npm start
# Navigate to http://localhost:4200
```

### 8. Build and Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase
npm run deploy
# OR
firebase deploy
```

## Firebase Functions (Email Service)

Create a Cloud Function to send emails:

### Setup
```bash
firebase init functions
cd functions
npm install nodemailer
```

### Create Function (`functions/index.js`)
```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // Use App Password, not regular password
  }
});

exports.sendDonationReceipt = functions.https.onRequest(async (req, res) => {
  const { to, subject, templateData } = req.body;

  const mailOptions = {
    from: 'Ayyappa Swami Temple <your-email@gmail.com>',
    to: to,
    subject: subject,
    html: `
      <h2>Thank You for Your Donation!</h2>
      <p>Dear ${templateData.donorName},</p>
      <p>We have received your generous donation of ₹${templateData.amount}.</p>
      <p><strong>Transaction ID:</strong> ${templateData.transactionId}</p>
      <p><strong>Date:</strong> ${templateData.date}</p>
      <p>May Lord Ayyappa bless you and your family.</p>
      <p>Swamiye Saranam Ayyappa!</p>
      <br>
      <p>${templateData.templeName}</p>
      <p>${templateData.templeAddress}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
```

### Deploy Function
```bash
firebase deploy --only functions
```

Update `environment.ts` with function URL:
```typescript
emailService: {
  functionsUrl: "https://us-central1-your-project.cloudfunctions.net"
}
```

## Initial Data Setup

Add initial content to Firestore:

### Content Collection
```javascript
// In Firebase Console → Firestore Database → Start collection
Collection: content

Document 1:
{
  section: "about",
  title: "About Lord Ayyappa",
  content: "Lord Ayyappa is a revered Hindu deity...",
  updatedAt: (timestamp)
}

Document 2:
{
  section: "services",
  title: "Temple Services",
  content: "We offer various poojas and sevas...",
  updatedAt: (timestamp)
}
```

## Admin Login

- URL: `https://your-domain.web.app/admin/login`
- Email: admin@temple.org
- Password: (your created password)

## Production Checklist

- [ ] Update Firebase config in environment files
- [ ] Set Razorpay to LIVE mode
- [ ] Configure custom domain in Firebase Hosting
- [ ] Set up SSL (automatically done by Firebase)
- [ ] Test all payment flows
- [ ] Test email sending
- [ ] Add real temple images to gallery
- [ ] Update content with real information
- [ ] Set up Firebase backups
- [ ] Enable Firebase Analytics (optional)

## Performance Optimization

- Images are lazy-loaded
- Firebase CDN for fast global delivery
- Optimized Angular bundles
- Material Design for fast rendering

## Security Features

- Firebase Security Rules for database access
- Admin authentication required for modifications
- Razorpay secure payment processing
- HTTPS enforced by Firebase Hosting

## Support

For issues or questions, contact: admin@temple.org

## License

This project is created for Ayyappa Swami Temple.

---

**Swamiye Saranam Ayyappa! 🙏**
