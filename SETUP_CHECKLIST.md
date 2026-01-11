# Setup Checklist - Ayyappa Swami Temple Website

Use this checklist to ensure everything is set up correctly.

## ✅ Pre-Setup Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Text editor ready (VS Code recommended)
- [ ] Modern web browser (Chrome/Firefox)
- [ ] Gmail account (for email service)
- [ ] Bank account details (for Razorpay KYC)

## ✅ Firebase Setup

### Project Creation
- [ ] Created Firebase project at console.firebase.google.com
- [ ] Project name: ayyappa-swami-temple (or your choice)
- [ ] Disabled Google Analytics (optional)

### Authentication
- [ ] Enabled Email/Password authentication
- [ ] Created admin user (email: admin@temple.org)
- [ ] Saved admin password securely
- [ ] Tested admin login

### Firestore Database
- [ ] Created Firestore database
- [ ] Selected production mode
- [ ] Chose nearest region
- [ ] Deployed firestore.rules
- [ ] Created "content" collection with sample data
- [ ] Created "donations" collection (will auto-populate)
- [ ] Created "gallery" collection (will auto-populate)

### Storage
- [ ] Enabled Firebase Storage
- [ ] Deployed storage.rules
- [ ] Created "gallery" folder

### Hosting
- [ ] Enabled Firebase Hosting
- [ ] Connected project locally (`firebase init`)
- [ ] Configured hosting settings

### Configuration
- [ ] Copied Firebase config from console
- [ ] Updated `src/environments/environment.ts`
- [ ] Updated `src/environments/environment.prod.ts`
- [ ] Config includes: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId

## ✅ Razorpay Setup

### Account Creation
- [ ] Signed up at razorpay.com
- [ ] Verified email address
- [ ] Completed profile information
- [ ] (Optional) Completed KYC for live mode

### API Keys
- [ ] Generated Test Keys (for development)
- [ ] Copied Test Key ID
- [ ] Updated environment.ts with Test Key ID
- [ ] (Production) Generated Live Keys
- [ ] (Production) Updated environment.prod.ts with Live Key ID

### Testing
- [ ] Tested payment with test card: 4111 1111 1111 1111
- [ ] Verified payment appears in Razorpay dashboard
- [ ] Checked transaction details

## ✅ Email Service Setup

### Gmail Setup
- [ ] Created dedicated Gmail account (or using existing)
- [ ] Enabled 2-Factor Authentication
- [ ] Generated App Password
- [ ] Saved App Password securely

### Firebase Functions
- [ ] Ran `firebase init functions`
- [ ] Installed nodemailer: `npm install nodemailer`
- [ ] Created sendDonationReceipt function
- [ ] Updated email credentials in functions/index.js
- [ ] Deployed function: `firebase deploy --only functions`
- [ ] Copied function URL
- [ ] Updated environment files with function URL

### Testing
- [ ] Made test donation
- [ ] Verified email received
- [ ] Checked email formatting
- [ ] Confirmed all details correct (amount, transaction ID, etc.)

## ✅ Initial Content Setup

### Content Collection
- [ ] Added "about" document
- [ ] Added "services" document
- [ ] Added "contact" document
- [ ] Verified content displays on website

### Gallery Setup
- [ ] Logged into admin dashboard
- [ ] Uploaded at least 5 temple images
- [ ] Verified images display in gallery
- [ ] Images optimized (< 200 KB each)

## ✅ Local Development

### Installation
- [ ] Cloned/downloaded project
- [ ] Ran `npm install`
- [ ] No installation errors
- [ ] All dependencies installed

### Running Locally
- [ ] Ran `npm start`
- [ ] Website opens at localhost:4200
- [ ] All pages load without errors
- [ ] Navigation works
- [ ] No console errors

### Testing Features
- [ ] Home page displays correctly
- [ ] About page shows content
- [ ] Services page lists all services
- [ ] Gallery loads images
- [ ] Donation form submits
- [ ] Razorpay checkout opens
- [ ] Contact form works
- [ ] Admin login successful
- [ ] Admin dashboard displays
- [ ] Can upload images in admin
- [ ] Can edit content in admin
- [ ] Donation history visible

## ✅ Production Deployment

### Build
- [ ] Ran `npm run build`
- [ ] Build completed without errors
- [ ] dist/ folder created
- [ ] Files generated in dist/ayyappa-swami-temple/

### Firebase Deployment
- [ ] Logged in: `firebase login`
- [ ] Selected project: `firebase use --add`
- [ ] Deployed: `firebase deploy` or `./deploy.sh`
- [ ] Deployment successful
- [ ] Received hosting URL

### Post-Deployment Testing
- [ ] Visited production URL
- [ ] All pages load correctly
- [ ] Test donation works
- [ ] Email received
- [ ] Admin login works
- [ ] Can manage content
- [ ] Can upload images
- [ ] SSL certificate active (https://)

## ✅ Security & Optimization

### Security
- [ ] Firebase security rules deployed
- [ ] Admin password is strong
- [ ] API keys not exposed in public code
- [ ] HTTPS enforced
- [ ] Cross-origin requests configured

### Performance
- [ ] Images optimized
- [ ] Lazy loading enabled
- [ ] Caching configured
- [ ] Lighthouse score > 90
- [ ] Mobile responsive

## ✅ Monitoring Setup

### Firebase Monitoring
- [ ] Set up usage monitoring
- [ ] Configured budget alerts
- [ ] Added alert email
- [ ] Budget set (e.g., ₹1000/month)

### Razorpay Monitoring
- [ ] Dashboard access verified
- [ ] Transaction notifications enabled
- [ ] Settlement account configured
- [ ] Email notifications enabled

## ✅ Documentation

- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Read COST_OPTIMIZATION.md
- [ ] Saved all passwords securely
- [ ] Documented Firebase config
- [ ] Documented Razorpay keys
- [ ] Created backup of environment files

## ✅ Going Live Checklist

### Content
- [ ] Replaced all placeholder text
- [ ] Added real temple information
- [ ] Uploaded actual temple photos
- [ ] Updated contact information
- [ ] Added temple address
- [ ] Added temple phone number
- [ ] Added temple email

### Razorpay Live Mode
- [ ] Completed KYC
- [ ] Generated Live API Keys
- [ ] Updated environment.prod.ts
- [ ] Tested live transaction
- [ ] Verified settlement account

### Domain Setup (Optional)
- [ ] Purchased domain name
- [ ] Added domain in Firebase Hosting
- [ ] Updated DNS records
- [ ] SSL certificate issued
- [ ] Domain verified and active

### Final Testing
- [ ] All pages work on mobile
- [ ] All pages work on desktop
- [ ] All pages work on tablet
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Payment flow works end-to-end
- [ ] Email delivery confirmed
- [ ] Admin panel accessible
- [ ] No broken links
- [ ] No console errors

## ✅ Post-Launch

### Week 1
- [ ] Monitor Firebase usage daily
- [ ] Check Razorpay transactions
- [ ] Verify email delivery
- [ ] Test all features
- [ ] Collect user feedback

### Month 1
- [ ] Review Firebase costs
- [ ] Review Razorpay fees
- [ ] Optimize if needed
- [ ] Add more content
- [ ] Update gallery

### Ongoing
- [ ] Regular backups of Firestore
- [ ] Monthly cost review
- [ ] Update content regularly
- [ ] Add new images monthly
- [ ] Monitor donation trends
- [ ] Send thank you emails
- [ ] Update services as needed

## 🆘 Troubleshooting Checklist

If something doesn't work:

- [ ] Check Firebase Console for errors
- [ ] Check browser console (F12)
- [ ] Verify internet connection
- [ ] Clear browser cache
- [ ] Check Firebase rules
- [ ] Verify API keys
- [ ] Check function logs
- [ ] Restart development server
- [ ] Rebuild project
- [ ] Redeploy if needed

## 📞 Support Resources

- [ ] Firebase Documentation: firebase.google.com/docs
- [ ] Razorpay Documentation: razorpay.com/docs
- [ ] Angular Documentation: angular.io/docs
- [ ] Stack Overflow for questions
- [ ] Firebase Support (if issues)
- [ ] Razorpay Support (if issues)

## ✅ Completion

When all checkboxes are checked:

**🎉 Congratulations! Your temple website is fully set up and running!**

**Swamiye Saranam Ayyappa! 🙏**

---

## Quick Reference

### Important URLs
- Firebase Console: https://console.firebase.google.com
- Razorpay Dashboard: https://dashboard.razorpay.com
- Your Website: https://your-project.web.app
- Admin Login: https://your-project.web.app/admin/login

### Important Commands
```bash
# Development
npm start

# Build
npm run build

# Deploy
firebase deploy
# or
./deploy.sh

# Check logs
firebase functions:log

# Check usage
firebase hosting:channel:list
```

### Emergency Contacts
- Firebase Support: Firebase Console → Support
- Razorpay Support: support@razorpay.com
- Email Issues: Check Gmail/SendGrid settings

---

**Keep this checklist for reference and future updates!**
