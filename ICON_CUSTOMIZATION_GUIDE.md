# 🎨 Icon Customization Guide

## What Icon System We're Using

We're using **Material Icons** (Google's Material Design Icons) through Angular Material.

---

## Current Icons Used

### **Admin Panel Icons (Fixed in HTML)**

| Location | Icon Name | Usage |
|----------|-----------|-------|
| Page Header | `dashboard` | Main "Manage Content" title |
| Hero Tab | `home` | Hero section header |
| Hero Edit Button | `edit` | Edit hero button |
| Services Tab | `room_service` | Services section header |
| Add Service Button | `add` | Add new service |
| Events Tab | `event` | Events section header |
| Add Event Button | `add` | Add new event |
| Features Tab | `star` | Features section header |
| Add Feature Button | `add` | Add new feature |
| Contact Tab | `contact_mail` | Contact section header |
| Contact Edit Button | `edit` | Edit contact button |
| Edit Buttons (Table) | `edit` | Edit action in tables |
| Delete Buttons (Table) | `delete` | Delete action in tables |
| Modal Close | `close` | Close modal button |
| Modal Add | `add_circle` | Add new item in modal |
| Modal Edit | `edit` | Edit item in modal |
| Modal Save | `save` | Save button |

### **Dynamic Content Icons (Stored in Database)**

These icons are **user-editable** and stored for each item:

- **Services** - Each service has its own icon (e.g., `temple_hindu`, `self_improvement`, `event_note`)
- **Events** - Each event has its own icon (e.g., `celebration`, `festival`, `calendar_today`)
- **Features** - Each feature has its own icon (e.g., `wb_sunny`, `local_parking`, `water_drop`)

---

## How to Change Icons

### **Option 1: Change Fixed Admin Panel Icons**

Edit the HTML file: `src/app/admin/manage-content/manage-content.component.html`

**Example - Change Page Header Icon:**
```html
<!-- From -->
<h1><mat-icon>dashboard</mat-icon> Manage Temple Content</h1>

<!-- To -->
<h1><mat-icon>temple_hindu</mat-icon> Manage Temple Content</h1>
```

**Example - Change Tab Header Icons:**
```html
<!-- From -->
<h2><mat-icon>room_service</mat-icon> Temple Services</h2>

<!-- To -->
<h2><mat-icon>volunteer_activism</mat-icon> Temple Services</h2>
```

### **Option 2: Change Dynamic Content Icons**

When you **Add/Edit** a service, event, or feature in the admin panel, you'll see an **Icon** field. Just type the icon name!

**Steps:**
1. Go to Admin → Manage Content
2. Click "Add Service" (or Edit existing)
3. In the "Icon" field, type the icon name (e.g., `temple_hindu`)
4. Save

The icon will automatically display in both the admin table and the public website.

---

## 🔍 Finding Material Icon Names

### **Browse All Icons:**
Visit: **https://fonts.google.com/icons**

### **Popular Temple/Religious Icons:**

```
temple_hindu         - Hindu temple
temple_buddhist      - Buddhist temple
synagogue            - Synagogue
self_improvement     - Meditation/spiritual
volunteer_activism   - Donation/charity
auto_awesome         - Divine/special
celebration          - Festival
festival             - Festival/celebration
event_note          - Event/ritual
calendar_today      - Calendar/dates
wb_sunny            - Sun/light
star                - Star/highlight
favorite            - Heart/love
local_fire_department - Fire/hawan
water_drop          - Holy water
eco                 - Nature/plants
park                - Garden/outdoor
music_note          - Music/bhajan
voice_over_off      - Silence/meditation
group               - Community
family_restroom     - Family services
accessible          - Accessibility
local_parking       - Parking
directions_walk     - Walking/parikrama
location_on         - Location
schedule            - Timing
phone               - Phone contact
email               - Email contact
```

### **Service-Related Icons:**
```
room_service        - General service
restaurant          - Food/prasad
bakery_dining       - Sweets/offerings
local_cafe          - Tea/refreshments
event_available     - Booking available
payment             - Payment/donation
card_giftcard       - Gift/offering
redeem              - Redeem/blessing
verified            - Verified service
new_releases        - New service
```

### **Event-Related Icons:**
```
event               - General event
event_note          - Scheduled event
celebration         - Celebration
festival            - Festival
calendar_month      - Monthly event
date_range          - Date range
alarm               - Reminder/alert
notification_important - Important event
campaign            - Special campaign
attractions         - Special attraction
```

### **Feature Icons:**
```
star                - Main feature
grade               - Quality
verified_user       - Verified/trusted
security            - Safe/secure
accessible          - Accessible
wifi                - WiFi available
ac_unit             - AC/cooling
electric_bolt       - Electricity
light_mode          - Lighting
videocam            - CCTV/video
```

---

## 📝 Examples: Changing Icons

### **Example 1: Change Services Icon**

**File:** `src/app/admin/manage-content/manage-content.component.html`

```html
<!-- Current (Line ~53) -->
<h2><mat-icon>room_service</mat-icon> Temple Services</h2>

<!-- Change to temple icon -->
<h2><mat-icon>temple_hindu</mat-icon> Temple Services</h2>

<!-- Or to hands/offering icon -->
<h2><mat-icon>volunteer_activism</mat-icon> Temple Services</h2>
```

### **Example 2: Add Service with Custom Icon**

In Admin Panel:
1. Click "Add Service"
2. Fill in:
   - **Name:** "Abhishekam"
   - **Description:** "Special abhishekam for Lord Ayyappa"
   - **Price:** "₹500"
   - **Icon:** `water_drop` ← Type this!
3. Save

### **Example 3: Change Multiple Icons at Once**

Search and replace in HTML file:
- Find: `<mat-icon>edit</mat-icon>`
- Replace with: `<mat-icon>mode_edit</mat-icon>`

---

## 💡 Best Practices

1. **Keep it Simple** - Use clear, recognizable icons
2. **Be Consistent** - Use similar icon style across sections
3. **Test First** - Preview the icon on Google Fonts before using
4. **Meaningful Icons** - Choose icons that represent the content well
5. **Don't Overdo** - Too many different icons can look cluttered

---

## 🛠️ Quick Icon Change Commands

### To change all service tab icons to temple:
```html
Line 53: <h2><mat-icon>temple_hindu</mat-icon> Temple Services</h2>
```

### To change all event tab icons to celebration:
```html
Line 102: <h2><mat-icon>celebration</mat-icon> Temple Events</h2>
```

### To change all feature tab icons to verified:
```html
Line 151: <h2><mat-icon>verified</mat-icon> Temple Features</h2>
```

---

## 🎯 Icon Field in Forms

When you see the "Icon" input field in the modal form, just type the **icon name** (without `<mat-icon>` tags).

**Examples:**
- ✅ Correct: `temple_hindu`
- ✅ Correct: `celebration`
- ✅ Correct: `water_drop`
- ❌ Wrong: `<mat-icon>temple_hindu</mat-icon>`
- ❌ Wrong: `mat-icon temple_hindu`

---

## 📚 Additional Resources

- **Official Material Icons:** https://fonts.google.com/icons
- **Material Design Guidelines:** https://material.io/design/iconography
- **Angular Material Icons:** https://material.angular.io/components/icon/overview

---

## 🔄 Need Help?

If you want to change icons but aren't sure which one to use:
1. Visit https://fonts.google.com/icons
2. Search for keywords (e.g., "temple", "prayer", "festival")
3. Click the icon you like
4. Copy the icon name (shown on the right side)
5. Use that name in your form or HTML

**That's it!** 🎉
