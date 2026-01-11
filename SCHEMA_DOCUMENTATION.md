# 📊 Unified Schema Documentation

## ✅ **Schema is EXACTLY THE SAME for JSON and Firebase**

This ensures seamless fallback and easy migration between JSON file and Firebase database.

---

## 🗂️ **Data Structure**

### **JSON File Structure** (`temple-content.json`)
```json
{
  "hero": { ... },
  "about": { ... },
  "services": [ ... ],
  "events": [ ... ],
  "features": [ ... ],
  "contact": { ... }
}
```

### **Firebase Firestore Structure**

**Collection:** `content`

**Documents:**
```
content/
  ├── hero (document)
  │   ├── section: "hero"
  │   ├── data: { title, teluguText, subtitle, ... }
  │   └── updatedAt: timestamp
  │
  ├── about (document)
  │   ├── section: "about"
  │   ├── data: { title, sections: [...] }
  │   └── updatedAt: timestamp
  │
  ├── services (document)
  │   ├── section: "services"
  │   ├── data: [ { name, price, description, icon }, ... ]
  │   └── updatedAt: timestamp
  │
  └── events (document)
      ├── section: "events"
      ├── data: [ { name, date, description, icon }, ... ]
      └── updatedAt: timestamp
```

---

## 📋 **Detailed Schema Definitions**

### **1. Hero Section**

**JSON & Firebase:**
```typescript
{
  "title": string,              // "UTTHARANDHRA SABARIMALA"
  "teluguText": string,         // "ఉత్తరాంధ్ర శబరిమల..."
  "subtitle": string,           // "Swamiye Saranam Ayyappa"
  "location": string,           // "Pendurthi, Visakhapatnam..."
  "carouselImages": string[]    // ["assets/images/1.jpg", ...]
}
```

### **2. About Section**

**JSON & Firebase:**
```typescript
{
  "title": string,              // "Lord Ayyappa - Dharma Sastha"
  "sections": [
    {
      "heading": string,        // "About Lord Ayyappa"
      "content": string         // Long description text
    },
    ...
  ]
}
```

### **3. Services**

**JSON & Firebase:**
```typescript
[
  {
    "name": string,             // "Daily Pooja"
    "description": string,      // "Traditional worship services..."
    "price": string,            // "Free" or "₹500"
    "icon": string              // "self_improvement"
  },
  ...
]
```

### **4. Events**

**JSON & Firebase:**
```typescript
[
  {
    "name": string,             // "Mandala Pooja"
    "date": string,             // "November - December"
    "description": string,      // "41-day vratham period..."
    "icon": string              // "event"
  },
  ...
]
```

### **5. Features**

**JSON & Firebase:**
```typescript
[
  {
    "icon": string,             // "self_improvement"
    "title": string,            // "Daily Pooja"
    "description": string       // "Traditional worship services..."
  },
  ...
]
```

### **6. Contact**

**JSON & Firebase:**
```typescript
{
  "templeName": string,         // "UTTHARANDHRA SABARIMALA"
  "address": string,            // Full address
  "phone": string,              // "+91 1234567890"
  "email": string,              // "info@..."
  "timings": {
    "morning": string,          // "5:00 AM - 12:00 PM"
    "evening": string           // "4:00 PM - 9:00 PM"
  }
}
```

---

## 🔄 **How Fallback Works**

### **Component Loading Logic:**

```typescript
ngOnInit() {
  this.loadContent();
}

async loadContent() {
  try {
    // 1. Try Firebase first
    const firebaseData = await this.firebaseService.getContentSection('hero');
    if (firebaseData) {
      this.hero = firebaseData;
      return;
    }
  } catch (error) {
    console.log('Firebase not available, loading from JSON...');
  }
  
  try {
    // 2. Fallback to JSON file
    const jsonData = await this.http.get('assets/data/temple-content.json').toPromise();
    this.hero = jsonData.hero;
  } catch (error) {
    // 3. Use hardcoded defaults
    this.hero = {
      title: 'UTTHARANDHRA SABARIMALA',
      // ... defaults
    };
  }
}
```

---

## 📝 **How to Update Content**

### **Option 1: Edit JSON File (No Firebase)**

1. Edit `src/assets/data/temple-content.json`
2. Rebuild and deploy:
   ```bash
   ng build --configuration production
   npx angular-cli-ghpages --dir=dist/ayyappa-swami-temple
   ```

### **Option 2: Use Admin Panel (With Firebase)**

1. Login to admin panel: `/admin/login`
2. Navigate to "Manage Content"
3. Edit sections directly in browser
4. Changes save to Firebase automatically
5. Website updates instantly!

---

## 🔥 **Firebase Setup for Admin Panel**

### **Initialize Firestore with JSON Data**

When you first set up Firebase, you can seed it with your JSON data:

```typescript
// One-time setup script
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import templeContent from './assets/data/temple-content.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Seed each section
Object.keys(templeContent).forEach(async (section) => {
  await setDoc(doc(db, 'content', section), {
    section: section,
    data: templeContent[section],
    updatedAt: new Date()
  });
});
```

---

## ✅ **Key Benefits of Unified Schema**

1. **Same Structure** - JSON matches Firebase exactly
2. **Easy Migration** - Copy JSON → Firebase with no conversion
3. **Reliable Fallback** - If Firebase fails, JSON works seamlessly
4. **Type Safety** - TypeScript interfaces match both sources
5. **No Duplication** - Same data model everywhere
6. **Admin Friendly** - Edit in browser, same format as JSON

---

## 📚 **TypeScript Interfaces**

All interfaces are defined in `src/app/services/firebase.service.ts`:

- `HeroContent`
- `AboutContent` & `AboutSection`
- `ServiceItem`
- `EventItem`
- `FeatureItem`
- `ContactInfo`
- `TempleContentData` (complete structure)

These interfaces ensure type safety across the entire application.

---

**Last Updated:** January 11, 2026
