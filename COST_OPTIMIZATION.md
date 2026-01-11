# Cost Optimization Guide - Temple Website

## 💰 Zero-Cost Setup (For Small Temples)

This guide helps you run the temple website at **ZERO monthly cost** using free tiers.

## Service-by-Service Breakdown

### 1. Firebase Hosting (FREE Forever)

**Free Tier:**
- 10 GB storage
- 360 MB/day bandwidth
- SSL certificate included
- Custom domain support

**Typical Temple Website:**
- Website size: ~5 MB
- Daily visitors: 1000
- Daily bandwidth: ~50 MB

**Cost: ₹0/month** ✅

**Tips:**
- Optimize images (use WebP format)
- Enable browser caching
- Use lazy loading for images

### 2. Firebase Firestore (FREE for Small Usage)

**Free Tier:**
- 1 GB stored data
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

**Typical Temple Usage:**
- Content: ~1 MB
- Donations: ~100/month = 1 MB/year
- Gallery: ~100 images = 10 KB metadata

**Daily Operations:**
- Page views: 1000 = 5000 reads
- Donations: 10 = 10 writes
- Admin updates: 5 = 5 writes

**Cost: ₹0/month** ✅

### 3. Firebase Storage (FREE for Moderate Use)

**Free Tier:**
- 5 GB storage
- 1 GB/day download
- 50,000 uploads/day

**Typical Temple Usage:**
- Gallery images: 100 images × 500 KB = 50 MB
- Optimized images: 100 images × 100 KB = 10 MB

**Cost: ₹0/month** ✅

**Optimization Tips:**
```bash
# Compress images before upload
- Use online tools: TinyPNG, Squoosh
- Target size: 100-200 KB per image
- Max resolution: 1920×1080
```

### 4. Firebase Authentication (FREE Always)

**Free Tier:**
- Unlimited users
- Email/password authentication
- Phone authentication (limited)

**Temple Usage:**
- Admin users: 1-5

**Cost: ₹0/month** ✅

### 5. Firebase Cloud Functions

**Free Tier:**
- 2 million invocations/month
- 400,000 GB-seconds compute
- 200,000 GHz-seconds compute
- 5 GB outbound networking

**Temple Usage (Email Sending):**
- Donations: 10/day × 30 = 300/month
- Function duration: 2 seconds each
- Total: 600 invocations/month

**Cost: ₹0/month** ✅

### 6. Razorpay Payment Gateway

**Pricing:**
- 2% per successful transaction
- No setup fee
- No monthly fee
- No annual fee

**Example:**
- Donation: ₹1,000
- Razorpay fee: ₹20 (2%)
- You receive: ₹980

**Monthly Cost: Only on transactions** 💸

**Alternatives to Reduce Costs:**
- UPI QR Code (0% fee) - but manual tracking
- Bank account details - but no automation

### 7. Email Service

#### Option 1: Gmail (FREE)
- **Cost:** ₹0
- **Limit:** 500 emails/day
- **Setup:** 5 minutes

#### Option 2: SendGrid (FREE)
- **Cost:** ₹0
- **Limit:** 100 emails/day
- **Easier API**

#### Option 3: Mailgun (FREE)
- **Cost:** ₹0
- **Limit:** 100 emails/day

**Temple Usage:** 10 donations/day = 10 emails/day

**Cost: ₹0/month** ✅

### 8. Domain Name (Optional)

**Free Option:**
- Use Firebase subdomain: `your-temple.web.app`
- Cost: **₹0/year**

**Paid Option:**
- .com domain: ₹800-1000/year
- .org domain: ₹1000-1200/year
- .in domain: ₹400-600/year

**Recommended:** Start with free subdomain

## Total Cost Analysis

### Scenario 1: Small Temple (0-50 donations/month)
| Service | Monthly Cost |
|---------|-------------|
| Firebase (Hosting + DB + Storage) | ₹0 |
| Firebase Functions (Emails) | ₹0 |
| Razorpay (50 × ₹500 avg × 2%) | ₹500 |
| Domain (optional) | ₹0-83 |
| **TOTAL** | **₹500-583** |

### Scenario 2: Medium Temple (50-200 donations/month)
| Service | Monthly Cost |
|---------|-------------|
| Firebase | ₹0 |
| Firebase Functions | ₹0 |
| Razorpay (200 × ₹1000 × 2%) | ₹4,000 |
| Domain | ₹83 |
| **TOTAL** | **₹4,083** |

### Scenario 3: Large Temple (500+ donations/month)
| Service | Monthly Cost |
|---------|-------------|
| Firebase (Blaze Plan) | ₹0-2,000 |
| Firebase Functions | ₹0-500 |
| Razorpay (500 × ₹2000 × 2%) | ₹20,000 |
| Domain | ₹83 |
| **TOTAL** | **₹20,583-22,583** |

## Cost Reduction Strategies

### 1. Image Optimization

**Before:** 
- 100 images × 2 MB = 200 MB storage
- 1000 views/day = 200 GB bandwidth/month

**After Optimization:**
- 100 images × 100 KB = 10 MB storage
- 1000 views/day = 10 GB bandwidth/month

**Savings:** 95% reduction in storage and bandwidth

**Tools:**
```bash
# Online Tools (Free)
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim: https://imageoptim.com/

# Command Line
npm install -g sharp-cli
sharp input.jpg -o output.jpg --quality 80 --width 1920
```

### 2. Lazy Loading

Already implemented in the gallery component!
- Images load only when visible
- Reduces initial page load
- Saves bandwidth

### 3. Firestore Query Optimization

**Bad Practice:**
```typescript
// Loads ALL donations every time
getDonations() 
```

**Good Practice:**
```typescript
// Load only last 30 days
getDonations(limit: 100, startDate: lastMonth)
```

### 4. Caching Strategy

**Enable in `firebase.json`:**
```json
{
  "hosting": {
    "headers": [{
      "source": "**/*.@(jpg|jpeg|gif|png|webp)",
      "headers": [{
        "key": "Cache-Control",
        "value": "max-age=7200"
      }]
    }]
  }
}
```

### 5. Alternative to Razorpay

**UPI Integration (0% fees):**
- Display QR code on donation page
- Donors scan and pay
- Manual entry in admin dashboard
- No automation, but 0% fees

**Implementation:**
```typescript
// Generate UPI payment link
upiLink = `upi://pay?pa=temple@okicici&pn=Temple&am=${amount}&cu=INR`;
```

## Monitoring Costs

### Firebase Console
1. Go to Firebase Console
2. Click "Usage and billing"
3. See real-time usage
4. Set up budget alerts

### Set Budget Alerts
```bash
# In Firebase Console
1. Go to "Usage and billing"
2. Click "Set budget"
3. Set monthly budget (e.g., ₹1000)
4. Add email for alerts
```

### Monitor Razorpay
- Dashboard shows transaction fees
- Download monthly reports
- Track donor patterns

## When to Upgrade

### Firebase Blaze Plan (Pay as you go)
Upgrade when you exceed FREE tier:
- 100,000+ page views/month
- 1000+ donations/month
- Multiple admins
- Advanced features needed

**Estimated Cost:** ₹0-5000/month based on usage

## Cost Optimization Checklist

- [ ] Compress all images to < 200 KB
- [ ] Use lazy loading for images
- [ ] Enable Firebase caching
- [ ] Limit Firestore queries
- [ ] Use Firebase free subdomain initially
- [ ] Set up Firebase budget alerts
- [ ] Consider UPI for 0% fees
- [ ] Monitor usage weekly
- [ ] Optimize Cloud Functions
- [ ] Use SendGrid/Gmail for free emails

## Real-World Example: Small Temple

**Monthly Stats:**
- Visitors: 10,000
- Page views: 30,000
- Donations: 100
- Average donation: ₹1,000

**Costs:**
- Firebase: ₹0 (within free tier)
- Razorpay: ₹2,000 (2% of ₹100,000)
- Domain: ₹0 (using .web.app)
- **Total: ₹2,000/month**

**Donations Received:** ₹100,000
**Net Cost:** 2%

## Conclusion

✅ **Start FREE:** Use Firebase free tier + free email
✅ **Scale Gradually:** Only pay when you grow
✅ **Low Transaction Fees:** Only 2% on Razorpay
✅ **No Hidden Costs:** Everything is transparent

**For most small to medium temples: ₹0-2,000/month total cost!**

---

**Questions? Check the main README.md or QUICKSTART.md**

**Swamiye Saranam Ayyappa! 🙏**
