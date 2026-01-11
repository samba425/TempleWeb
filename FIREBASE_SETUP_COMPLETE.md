# 🔥 Firebase Setup - Next Steps

## ✅ **Step 1: Firebase Config Added** 

Your Firebase configuration is now integrated into the app!

**Project:** uttharandhra-sabarimala
**Region:** Default (Realtime Database enabled)

---

## 📋 **Step 2: Enable Firebase Services**

Go to [Firebase Console](https://console.firebase.google.com/project/uttharandhra-sabarimala)

### **A. Enable Authentication** ✅

1. Click **Authentication** in left menu
2. Click **Get Started**
3. Click **Sign-in method** tab
4. Click **Email/Password**
5. **Enable** the first option (Email/Password)
6. Click **Save**

### **B. Create Admin User** 👤

1. Still in **Authentication** section
2. Click **Users** tab
3. Click **Add user** button
4. Enter:
   - **Email:** `admin@temple.com` (or your choice)
   - **Password:** Create a strong password (remember this!)
5. Click **Add user**
6. **SAVE YOUR PASSWORD SECURELY!** You'll need it to login

---

### **C. Enable Firestore Database** 📦

1. Click **Firestore Database** in left menu
2. Click **Create database**
3. Select **Start in production mode**
4. Click **Next**
5. Choose location: **asia-south1 (Mumbai)** (closest to you)
6. Click **Enable**

**Wait 1-2 minutes for database to be created...**

### **D. Update Firestore Rules** 🔒

Once database is created:

1. Click **Rules** tab
2. Replace the rules with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to content
    match /content/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read access to gallery
    match /gallery/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read access to services
    match /services/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read access to events
    match /events/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Donations - authenticated users can read/write
    match /donations/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

---

### **E. Enable Storage** 🖼️

1. Click **Storage** in left menu
2. Click **Get started**
3. Click **Next** (use default security rules)
4. Choose location: **asia-south1** (same as Firestore)
5. Click **Done**

**Wait 1-2 minutes for storage to be created...**

### **F. Update Storage Rules** 🔒

Once storage is created:

1. Click **Rules** tab
2. Replace the rules with this:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Gallery images - public read, authenticated write
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                  && request.resource.size < 5 * 1024 * 1024; // Max 5MB
    }
    
    // Allow reading all files publicly
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

---

## 🚀 **Step 3: Initialize Sample Data**

### **Option 1: Automatic (Copy JSON to Firestore)**

I'll create a script to upload your JSON data to Firestore automatically.

### **Option 2: Manual (Firebase Console)**

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `content`
4. Click **Next**

**Add Hero Document:**
- Document ID: `hero`
- Fields:
  - `section` (string): "hero"
  - `title` (string): "UTTHARANDHRA SABARIMALA"
  - `teluguText` (string): "ఉత్తరాంధ్ర శబరిమల (అయ్యప్ప స్వామి ఆలయం)"
  - `subtitle` (string): "Swamiye Saranam Ayyappa"
  - `location` (string): "Pendurthi, Visakhapatnam, Andhra Pradesh"
  - `carouselImages` (array): 
    - 0: "assets/images/480614142_1340522376959783_2104656479553551940_n.jpg"
    - 1: "assets/images/486472084_1196186785851212_8874622736568729395_n.jpg"
    - 2: "assets/images/474645972_1102912134661594_7088183194580120380_n.jpg"
  - `updatedAt` (timestamp): Click "Use server timestamp"

Click **Save**

Repeat for other sections (about, services, events)...

---

## 🧪 **Step 4: Test Firebase Connection**

### **Build and Run Locally:**

```bash
cd /Users/sambasiva/Documents/personal/Templae
npm start
```

Visit http://localhost:4200

### **Test Admin Login:**

1. Go to http://localhost:4200/admin/login
2. Enter your admin email and password
3. Should redirect to admin dashboard

**If login fails:**
- Check browser console for errors
- Verify Authentication is enabled
- Verify admin user exists

---

## 📦 **Step 5: Deploy to GitHub Pages**

Once everything works locally:

```bash
ng build --configuration production
npx angular-cli-ghpages --dir=dist/ayyappa-swami-temple
git add -A
git commit -m "Add Firebase integration"
git push origin main
```

---

## ✅ **What You Can Do Now:**

### **Admin Panel Features:**

1. **Login:** https://samba425.github.io/TempleWeb/admin/login
2. **Manage Content:** Edit hero, about, services, events
3. **Manage Gallery:** Upload temple photos
4. **View Donations:** Track all contributions

### **Public Website:**

- Content loads from Firestore (if available)
- Falls back to JSON if Firebase fails
- Gallery loads from Firebase Storage
- Everything editable from admin panel!

---

## 🎯 **Next Steps (Optional):**

### **1. Razorpay Integration** 💰
- Sign up at [Razorpay](https://razorpay.com/)
- Get API keys
- Update environment.ts

### **2. Email Service** 📧
- Set up Firebase Functions
- Configure SendGrid/Gmail
- Send donation receipts

### **3. Custom Domain** 🌐
- Point domain to GitHub Pages
- Update Firebase authorized domains

---

## 📞 **Need Help?**

**Common Issues:**

**Problem:** Can't login to admin
**Solution:** 
1. Check Firebase Authentication is enabled
2. Verify user exists in Authentication > Users
3. Check browser console for errors

**Problem:** Content not loading from Firebase
**Solution:**
1. Check Firestore rules allow read
2. Verify data exists in Firestore
3. Check browser network tab

**Problem:** Can't upload images
**Solution:**
1. Check Storage is enabled
2. Verify Storage rules allow write
3. Check file size < 5MB

---

## 🎉 **You're All Set!**

Your temple website now has:
- ✅ Firebase backend configured
- ✅ Authentication ready
- ✅ Database ready (Firestore)
- ✅ Storage ready (for images)
- ✅ Admin panel functional
- ✅ Content management system
- ✅ Gallery management
- ✅ Donation tracking (once Razorpay configured)

**Next:** Enable the Firebase services and test the admin panel! 🚀
