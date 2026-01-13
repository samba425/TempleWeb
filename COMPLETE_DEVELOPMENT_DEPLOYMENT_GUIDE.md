# 🕉️ Temple Website - Complete Development & Deployment Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Local Development Setup](#local-development-setup)
4. [Project Structure](#project-structure)
5. [Features & How to Use](#features--how-to-use)
6. [Admin Panel Guide](#admin-panel-guide)
7. [Firebase Setup](#firebase-setup)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance & Updates](#maintenance--updates)

---

## 🎯 Project Overview

**Uttharandhra Sabarimala Temple Website**
- Live URL: https://uttharandhra-sabarimala.web.app
- Admin Panel: https://uttharandhra-sabarimala.web.app/admin/login
- Firebase Project: uttharandhra-sabarimala

**Purpose:** 
A dynamic temple website with admin panel to manage announcements, services, events, and temple information without touching code.

---

## 💻 Technology Stack

### **Frontend**
- **Angular 15+** - Web framework
- **TypeScript** - Programming language
- **Angular Material** - UI components
- **SCSS** - Styling

### **Backend/Database**
- **Firebase Firestore** - NoSQL database
- **Firebase Hosting** - Website hosting
- **Firebase Authentication** - Admin login

### **Tools**
- **Node.js** - Runtime environment
- **npm** - Package manager
- **Firebase CLI** - Deployment tool

---

## 🛠️ Local Development Setup

### **Prerequisites**

1. **Install Node.js** (v16 or higher)
   ```bash
   # Check if installed
   node --version
   npm --version
   ```
   Download from: https://nodejs.org

2. **Install Angular CLI**
   ```bash
   npm install -g @angular/cli
   ```

3. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

### **Setup Steps**

#### **Step 1: Clone/Download Project**
```bash
cd /Users/sambasiva/Documents/personal/Templae
```

#### **Step 2: Install Dependencies**
```bash
npm install
```
This installs all required packages (Angular, Material, Firebase, etc.)

#### **Step 3: Configure Firebase**

Your Firebase config is in: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDHq0n7JN7wCVCLI_1s7SjY5x5MqV0RtNc",
    authDomain: "uttharandhra-sabarimala.firebaseapp.com",
    projectId: "uttharandhra-sabarimala",
    storageBucket: "uttharandhra-sabarimala.firebasestorage.app",
    messagingSenderId: "72046519850",
    appId: "1:72046519850:web:f43d0e9f7e2b3a91b5f8b9"
  }
};
```

#### **Step 4: Login to Firebase**
```bash
firebase login
```
This opens browser to authenticate with your Google account.

#### **Step 5: Run Development Server**
```bash
ng serve
```
or
```bash
npm start
```

**Website will open at:** http://localhost:4200

---

## 📁 Project Structure

```
Templae/
├── src/
│   ├── app/
│   │   ├── components/          # UI Components
│   │   │   ├── home/           # Home page
│   │   │   ├── footer/         # Footer (dynamic)
│   │   │   ├── navbar/         # Navigation bar
│   │   │   ├── about/          # About page
│   │   │   └── services/       # Services page
│   │   │
│   │   ├── admin/              # Admin Panel
│   │   │   ├── admin-login/    # Login page
│   │   │   ├── admin-dashboard/# Dashboard
│   │   │   ├── manage-announcements/  # Announcements CRUD
│   │   │   └── manage-content/ # Content management
│   │   │
│   │   └── services/           # Business Logic
│   │       ├── firebase.service.ts      # Firebase operations
│   │       ├── content.service.ts       # Content management
│   │       └── auth.service.ts          # Authentication
│   │
│   ├── assets/
│   │   └── data/
│   │       └── temple-content.json  # Fallback data
│   │
│   └── environments/
│       ├── environment.ts           # Development config
│       └── environment.prod.ts      # Production config
│
├── firebase.json              # Firebase hosting config
├── firestore.rules           # Database security rules
├── angular.json              # Angular configuration
├── package.json              # Dependencies
└── README.md                 # Documentation
```

---

## ✨ Features & How to Use

### **1. Home Page**
- **Hero Section:** Temple name, subtitle, location
- **Announcements Carousel:** Auto-scrolling active announcements
- **Quick Links:** Navigation to main sections
- **Dynamic Footer:** Contact info, social links

### **2. Announcements System**
- Create/Edit/Delete announcements
- Set start/end dates
- Toggle active/inactive status
- Upload images (max 100KB, auto-compressed)
- Priority-free (just Active/Inactive)

### **3. Content Management**
- **Hero Section:** Edit temple name, subtitle, location
- **Services:** Add temple services with name, description, price, icon
- **Events:** Manage temple events with dates
- **Features:** Highlight temple features
- **Contact Info:** Update address, phone, email, timings
- **Footer:** Edit description, social media links

### **4. Admin Authentication**
- Secure login with email/password
- Protected admin routes
- Session management

---

## 👨‍💼 Admin Panel Guide

### **Accessing Admin Panel**

**URL:** https://uttharandhra-sabarimala.web.app/admin/login

**Default Admin Credentials:**
- Email: `admin@temple.com`
- Password: `admin123`

⚠️ **Change these immediately after first login!**

### **Admin Dashboard**

After login, you'll see:
- **Manage Announcements** - CRUD operations for announcements
- **Manage Content** - Edit all temple content
- **Analytics** (future) - View visitor statistics
- **Logout** - Sign out

### **Managing Announcements**

#### **View Announcements**
1. Click **"Manage Announcements"**
2. See table with all announcements
3. Columns: Title, Dates, Status, Actions

#### **Create New Announcement**
1. Click **"+ Create Announcement"** button
2. Fill form:
   - **Title:** e.g., "Mandala Season Started"
   - **Message:** Full announcement text
   - **Start Date:** When to show
   - **End Date:** When to stop showing
   - **Upload Image:** (Optional) Click to select image
     - Max size: 100KB
     - Auto-compressed if larger
     - Stored as base64
   - **Active:** Toggle on to show immediately
3. Click **"Create"**
4. Announcement appears in table and on homepage!

#### **Edit Announcement**
1. Click **Edit icon** (pencil) on any row
2. Modify fields
3. Click **"Update"**

#### **Delete Announcement**
1. Click **Delete icon** (trash) on any row
2. Confirm deletion
3. Announcement removed immediately

#### **Toggle Active/Inactive**
1. Use the **toggle switch** in Status column
2. Badge updates: Green "Active" or Gray "Inactive"
3. Only active announcements show on homepage

### **Managing Content**

Click **"Manage Content"** → Opens tabbed interface:

#### **Tab 1: Hero Section**
- Edit temple name
- Update Telugu text
- Change subtitle
- Update location
- Click **"Edit Hero"** → Make changes → **"Update"**

#### **Tab 2: Services**
- **View:** Table of all services
- **Add:** Click **"+ Add Service"**
  - Name: e.g., "Special Abhishekam"
  - Description: Details about service
  - Price: e.g., "₹500"
  - Icon: Material icon name (e.g., `temple_hindu`)
- **Edit:** Click edit icon on row
- **Delete:** Click delete icon on row

#### **Tab 3: Events**
- **View:** Table of all events
- **Add:** Click **"+ Add Event"**
  - Name: e.g., "Maha Shivaratri"
  - Date: e.g., "March 8, 2024"
  - Description: Event details
  - Icon: Material icon name (e.g., `celebration`)
- **Edit/Delete:** Same as services

#### **Tab 4: Features**
- **View:** Table of temple features
- **Add:** Click **"+ Add Feature"**
  - Title: e.g., "Daily Rituals"
  - Description: Feature details
  - Icon: Material icon name (e.g., `star`)
- **Edit/Delete:** Same as services

#### **Tab 5: Contact Info**
- Edit temple name
- Update full address
- Change phone number
- Update email
- Set website URL
- Update morning timings
- Update evening timings
- Click **"Edit Contact"** → Make changes → **"Update"**

#### **Tab 6: Footer**
- Edit footer description
- Update social media URLs:
  - Facebook
  - Twitter
  - Instagram
  - YouTube
- Add additional info
- Click **"Edit Footer"** → Make changes → **"Update"**

### **Icon Names Guide**

Popular Material Icons for temple:
- `temple_hindu` - Temple
- `volunteer_activism` - Donation/Service
- `celebration` - Festival
- `water_drop` - Holy water
- `self_improvement` - Meditation
- `event` - Event/Calendar
- `star` - Feature highlight
- `local_fire_department` - Hawan

**Find more:** https://fonts.google.com/icons

---

## 🔥 Firebase Setup

### **Initial Firebase Configuration**

#### **Step 1: Create Firebase Project** (Already Done)
- Project Name: uttharandhra-sabarimala
- Project ID: uttharandhra-sabarimala
- Location: Not specified

#### **Step 2: Enable Services**

**Firestore Database:**
1. Go to Firebase Console → Firestore Database
2. Create database in **Production mode**
3. Location: Choose closest region (e.g., asia-south1)

**Firebase Authentication:**
1. Go to Firebase Console → Authentication
2. Enable **Email/Password** sign-in method
3. Add first admin user:
   - Email: admin@temple.com
   - Password: admin123

**Firebase Hosting:**
- Already enabled and deployed

#### **Step 3: Security Rules**

**Firestore Rules** (`firestore.rules`):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, authenticated write
    match /siteContent/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /announcements/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### **Step 4: Deploy Rules**
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### **Initialize Firestore Data**

**Option 1: From Admin Panel** (Recommended)
1. Login to admin panel
2. Go to Manage Content
3. Edit any section (Hero, Services, etc.)
4. Click Save
5. This creates the Firestore document automatically

**Option 2: Manual in Firebase Console**
1. Visit: https://console.firebase.google.com/project/uttharandhra-sabarimala/firestore
2. Click **"Start collection"**
3. Collection ID: `siteContent`
4. Document ID: `templeContent`
5. Copy data from `src/assets/data/temple-content.json`
6. Paste and save

---

## 🚀 Deployment Guide

### **Build for Production**

```bash
# Build the Angular app
npm run build --configuration production
```

This creates optimized files in `dist/ayyappa-swami-temple/`

### **Deploy to Firebase Hosting**

```bash
# Deploy everything (hosting + rules)
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting

# Or deploy only firestore rules
firebase deploy --only firestore:rules
```

### **Deployment Checklist**

Before deploying:
- [ ] Update version in `package.json`
- [ ] Test locally (`ng serve`)
- [ ] Check all forms work
- [ ] Verify images load
- [ ] Test admin login
- [ ] Review Firebase console for errors
- [ ] Build succeeds without errors
- [ ] Deploy to Firebase
- [ ] Test live site
- [ ] Check Firebase usage limits

### **Post-Deployment**

1. **Verify Website:**
   - Visit: https://uttharandhra-sabarimala.web.app
   - Check home page loads
   - Verify announcements show
   - Test navigation

2. **Verify Admin Panel:**
   - Visit: https://uttharandhra-sabarimala.web.app/admin/login
   - Login with credentials
   - Test creating announcement
   - Test editing content

3. **Check Firebase Console:**
   - Firestore: Data is being saved
   - Hosting: Latest version deployed
   - Authentication: Users can login

### **Common Deployment Commands**

```bash
# Full deployment
firebase deploy

# Hosting only (fastest for UI changes)
firebase deploy --only hosting

# Firestore rules only
firebase deploy --only firestore:rules

# View deployment history
firebase hosting:sites:list

# Rollback deployment
firebase hosting:clone SOURCE_SITE:VERSION TARGET_SITE

# Check Firebase project
firebase projects:list
```

---

## 🐛 Troubleshooting

### **Issue: "Missing or insufficient permissions"**

**Problem:** Firestore denies read/write access

**Solution:**
1. Check `firestore.rules` allows public read
2. Deploy rules: `firebase deploy --only firestore:rules`
3. Verify in Firebase Console → Firestore → Rules

### **Issue: "Failed to load module script"**

**Problem:** Wrong base href in build

**Solution:**
1. Edit `angular.json`
2. Find: `"baseHref": "/TempleWeb/"`
3. Change to: `"baseHref": "/"`
4. Rebuild: `npm run build --configuration production`
5. Redeploy: `firebase deploy --only hosting`

### **Issue: "Admin login fails"**

**Problem:** No admin user in Firebase Authentication

**Solution:**
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Email: admin@temple.com
4. Password: admin123
5. Save and try login again

### **Issue: "Announcements not showing"**

**Problem:** No active announcements or Firestore empty

**Solution:**
1. Login to admin panel
2. Create new announcement
3. Toggle "Active" ON
4. Set valid date range
5. Save and refresh homepage

### **Issue: "Image upload fails"**

**Problem:** Image too large

**Solution:**
- Images auto-compress to 100KB
- Use JPG/PNG formats
- Original size doesn't matter (auto-compressed)
- If still fails, try smaller image

### **Issue: "Build fails with budget errors"**

**Problem:** CSS/JS files too large

**Solution:**
1. Edit `angular.json`
2. Increase budget limits:
   ```json
   "budgets": [
     {
       "type": "anyComponentStyle",
       "maximumWarning": "40kb",
       "maximumError": "50kb"
     }
   ]
   ```
3. Rebuild

### **Issue: "Firebase CLI not found"**

**Problem:** Firebase tools not installed

**Solution:**
```bash
npm install -g firebase-tools
firebase login
```

### **Issue: "Site shows old content after deployment"**

**Problem:** Browser cache

**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Try incognito/private window
4. Wait 5-10 minutes for CDN to update

---

## 🔧 Maintenance & Updates

### **Regular Maintenance Tasks**

#### **Weekly**
- Check announcements dates (auto-hide expired ones)
- Review Firebase usage (should be < 1% of free tier)
- Backup Firestore data

#### **Monthly**
- Update npm packages: `npm update`
- Check Firebase console for errors
- Review Analytics (if enabled)

#### **Quarterly**
- Update Angular: `ng update @angular/core @angular/cli`
- Update Firebase: `npm update firebase`
- Test all features after updates

### **Updating Content**

**To Update Temple Info:**
1. Login to admin panel
2. Go to Manage Content → Contact Info tab
3. Click "Edit Contact"
4. Update fields
5. Save

**To Add New Service:**
1. Login to admin panel
2. Go to Manage Content → Services tab
3. Click "+ Add Service"
4. Fill details
5. Save

**To Update Social Links:**
1. Login to admin panel
2. Go to Manage Content → Footer tab
3. Click "Edit Footer"
4. Update URLs
5. Save

### **Making Code Changes**

#### **For Developers:**

1. **Pull Latest Code:**
   ```bash
   git pull origin main
   ```

2. **Make Changes:**
   - Edit components in `src/app/components/`
   - Edit services in `src/app/services/`
   - Update styles in respective `.scss` files

3. **Test Locally:**
   ```bash
   ng serve
   ```

4. **Build & Deploy:**
   ```bash
   npm run build --configuration production
   firebase deploy --only hosting
   ```

5. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

### **Backup Strategy**

#### **Firestore Backup**

**Export Data:**
```bash
# Manual export from Firebase Console
# Go to Firestore → Import/Export
# Select collections and export to Cloud Storage
```

**Backup Schedule:**
- Manual export: Monthly
- Automatic: Enable in Firebase Console

#### **Code Backup**

```bash
# Push to GitHub regularly
git add .
git commit -m "Backup $(date)"
git push origin main
```

---

## 📊 Firebase Usage Monitoring

### **Check Usage:**

1. Firebase Console → Usage and billing
2. Monitor:
   - **Firestore:** Reads, writes, deletes
   - **Hosting:** Bandwidth
   - **Storage:** File storage
   - **Authentication:** Active users

### **Free Tier Limits:**

| Resource | Free Limit | Your Usage | Status |
|----------|-----------|------------|--------|
| Firestore Reads | 50,000/day | ~500-2000 | ✅ 2-4% |
| Firestore Writes | 20,000/day | ~10-50 | ✅ <1% |
| Hosting Bandwidth | 10 GB/month | ~1-3 GB | ✅ 10-30% |
| Storage | 5 GB | ~100-500 MB | ✅ 2-10% |

**You will NEVER exceed free limits with normal usage!**

---

## 🔐 Security Best Practices

### **Admin Credentials**

1. **Change default password immediately:**
   - Login to Firebase Console
   - Go to Authentication
   - Edit admin user
   - Set strong password

2. **Strong Password Requirements:**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Not a common word
   - Store securely (password manager)

### **Firestore Security**

- ✅ Public read access (website content)
- ✅ Authenticated write access (admin only)
- ✅ Rules deployed and active
- ❌ Never expose API keys in public repos
- ❌ Never commit `.env` files

### **Code Security**

- Keep dependencies updated
- Review security alerts in GitHub
- Use HTTPS only (Firebase auto-provides)
- Validate user inputs in forms

---

## 📞 Support & Resources

### **Official Documentation**

- **Angular:** https://angular.io/docs
- **Firebase:** https://firebase.google.com/docs
- **Material Icons:** https://fonts.google.com/icons
- **Angular Material:** https://material.angular.io

### **Common Commands Reference**

```bash
# Development
ng serve                          # Run dev server
ng build                          # Build for production
ng test                           # Run tests

# Firebase
firebase login                    # Login to Firebase
firebase deploy                   # Deploy everything
firebase deploy --only hosting    # Deploy hosting only
firebase projects:list            # List Firebase projects

# Package Management
npm install                       # Install dependencies
npm update                        # Update packages
npm outdated                      # Check for updates

# Git
git status                        # Check changes
git add .                         # Stage all changes
git commit -m "message"          # Commit changes
git push origin main             # Push to GitHub
```

### **Project Files Reference**

| File | Purpose |
|------|---------|
| `angular.json` | Angular configuration |
| `firebase.json` | Firebase hosting config |
| `firestore.rules` | Database security rules |
| `package.json` | Dependencies list |
| `src/environments/environment.ts` | Firebase config |
| `src/app/app-routing.module.ts` | URL routes |
| `src/assets/data/temple-content.json` | Fallback data |

---

## 🎯 Quick Start Summary

### **First Time Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Login to Firebase
firebase login

# 3. Run locally
ng serve

# 4. Visit http://localhost:4200
```

### **Daily Development:**
```bash
# 1. Make code changes
# 2. Test locally: ng serve
# 3. Build: npm run build --configuration production
# 4. Deploy: firebase deploy --only hosting
```

### **Managing Content:**
1. Visit https://uttharandhra-sabarimala.web.app/admin/login
2. Login with admin credentials
3. Edit content in admin panel
4. Save changes (auto-updates website!)

---

## 🎉 Success Checklist

### **Development Environment:**
- [x] Node.js installed
- [x] Angular CLI installed
- [x] Firebase CLI installed
- [x] Project dependencies installed
- [x] Can run `ng serve` successfully

### **Firebase Setup:**
- [x] Firebase project created
- [x] Firestore enabled
- [x] Authentication enabled
- [x] Hosting enabled
- [x] Security rules deployed

### **Deployment:**
- [x] Build succeeds
- [x] Deployed to Firebase
- [x] Live site accessible
- [x] Admin panel working
- [x] Can create/edit content

### **Content:**
- [x] Hero section configured
- [x] Services added
- [x] Events added
- [x] Features added
- [x] Contact info updated
- [x] Footer configured
- [x] Announcements created

---

## 📈 Next Steps

### **Recommended Enhancements:**

1. **Custom Domain:** Buy domain and connect to Firebase
2. **Analytics:** Enable Google Analytics for visitor tracking
3. **SEO:** Add meta tags, sitemap, robots.txt
4. **Images:** Upload temple photos to gallery
5. **Donations:** Integrate payment gateway
6. **Email:** Set up email notifications for donations
7. **Multi-language:** Add Telugu language support
8. **Mobile App:** Create mobile app version

### **Advanced Features:**

- Online pooja booking
- Event registration
- Volunteer management
- Donation reports
- Photo gallery with categories
- Live darshan streaming
- Push notifications
- WhatsApp integration

---

## 💝 Final Notes

**This website is:**
- ✅ FREE to host (Firebase free tier)
- ✅ Easy to manage (admin panel)
- ✅ Secure (Firebase security)
- ✅ Fast (CDN hosting)
- ✅ Scalable (handles growth)

**Cost:** Only ₹600-1000/year for domain name!

**Maintenance:** 10-15 minutes/week for content updates

**For Help:** Refer to this guide or Firebase documentation

---

🕉️ **May Lord Ayyappa bless your temple website!** 🙏

**Swamiye Saranam Ayyappa!**
