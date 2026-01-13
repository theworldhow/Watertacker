# App Store Screenshot Guide

Apple rejected the app because screenshots don't show the current version. Follow this guide to capture proper screenshots.

---

## Required Screenshot Sizes

| Device | Size (pixels) | Required |
|--------|---------------|----------|
| 6.9" iPhone (iPhone 16 Pro Max) | 1320 × 2868 | Yes |
| 6.7" iPhone (iPhone 15 Pro Max) | 1290 × 2796 | Yes |
| 6.5" iPhone (iPhone 11 Pro Max) | 1284 × 2778 | **REQUIRED** |
| 5.5" iPhone (iPhone 8 Plus) | 1242 × 2208 | Optional |
| iPad Pro 13" | 2064 × 2752 | Yes (if supporting iPad) |
| iPad Pro 12.9" | 2048 × 2732 | Yes (if supporting iPad) |

---

## How to Capture Screenshots

### Option 1: iOS Simulator (Recommended)

1. **Open Xcode and run the app:**
   ```bash
   npx cap open ios
   ```

2. **Select the correct simulator:**
   - For 6.5" screenshots: iPhone 11 Pro Max, iPhone 12 Pro Max, or iPhone 13 Pro Max
   - For 6.7" screenshots: iPhone 14 Pro Max or iPhone 15 Pro Max

3. **Run the app** (Cmd + R)

4. **Navigate to each screen and capture:**
   - **Cmd + S** to save screenshot
   - Screenshots save to Desktop by default

5. **Capture these screens:**
   - Dashboard (main hydration tracking screen)
   - History view (week/month/year charts)
   - Settings (showing premium purchase option)
   - Quick add drinks in action

### Option 2: Real Device

1. Connect your iPhone
2. Open the app
3. Press **Side Button + Volume Up** simultaneously
4. Screenshots save to Photos app
5. AirDrop to Mac

---

## Screenshot Requirements from Apple

✅ **DO:**
- Show the app's main features and functionality
- Show the actual UI the user will see
- Include the Dashboard, History, and key features
- Show the app in use (not just splash screens)

❌ **DON'T:**
- Use marketing materials or mockups
- Show splash screens or loading screens
- Show login screens as primary screenshots
- Use screenshots from a different device type

---

## Recommended Screenshots (5-10 total)

1. **Dashboard** - Main hydration tracking with progress ring
2. **Quick Add** - Adding water/drinks
3. **History - Week** - Weekly chart view
4. **History - Month** - Monthly chart view  
5. **Settings** - Premium features / purchase option
6. **Notifications** - Reminder feature (optional)

---

## Uploading to App Store Connect

1. Go to **App Store Connect** → Your App → **App Store** tab

2. Scroll to **Screenshots** section

3. Click **"View All Sizes in Media Manager"**

4. Select **6.5-inch Display** (or other required sizes)

5. Delete old screenshots and upload new ones

6. Repeat for each required device size

---

## Quick Capture Script

Run this to open the simulator with the right device:

```bash
# Open iOS Simulator with iPhone 14 Pro Max
xcrun simctl boot "iPhone 14 Pro Max" 2>/dev/null || true
open -a Simulator

# Then run your app
npx cap run ios --target "iPhone 14 Pro Max"
```

---

## After Capturing Screenshots

1. Upload all screenshots to App Store Connect
2. Make sure the IAP product is submitted (see main issue)
3. Submit a new build for review

