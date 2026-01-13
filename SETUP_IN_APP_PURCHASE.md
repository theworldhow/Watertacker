# In-App Purchase Setup Guide

This guide walks you through setting up the Lifetime Access in-app purchase for the Water Reminder app.

---

## Prerequisites

1. Apple Developer Account (enrolled in Apple Developer Program - $99/year)
2. App created in App Store Connect
3. Xcode installed on your Mac
4. Bank and tax information completed in App Store Connect

---

## Step 1: Enable In-App Purchase in Xcode

1. Open the iOS project in Xcode:
   ```bash
   cd ios/App
   open App.xcworkspace
   ```

2. Select the **App** target in the project navigator

3. Go to **Signing & Capabilities** tab

4. Click **+ Capability** and add **In-App Purchase**

5. Ensure your **Team** is selected and signing is configured

---

## Step 2: Create the In-App Purchase in App Store Connect

### 2.1 Navigate to In-App Purchases

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app: **Water Reminder**
3. Click on **Monetization** → **In-App Purchases**
4. Click the **+** button to create a new in-app purchase

### 2.2 Configure the Product

| Field | Value |
|-------|-------|
| **Type** | Non-Consumable |
| **Reference Name** | Lifetime Access |
| **Product ID** | `com.waterreminder.app.lifetime` |
| **Price** | $4.99 (or $3.99 - choose from price tier) |

> ⚠️ **Important:** The Product ID must match exactly what's in your code:
> ```typescript
> // src/hooks/usePurchases.ts
> export const PRODUCT_ID = 'com.waterreminder.app.lifetime';
> ```

### 2.3 Add Localization

Click **Add Localization** and fill in:

| Field | Value |
|-------|-------|
| **Display Name** | Lifetime Access |
| **Description** | Unlock all features forever with a one-time purchase. Track your hydration, get reminders, and view your complete history. |

Add localizations for all languages your app supports.

### 2.4 Review Screenshot

Upload a screenshot showing the purchase screen (Settings page with the purchase button).
- Size: 640 x 920 pixels (or appropriate for your device)
- This is for Apple's review only, not shown to users

### 2.5 Save and Submit

1. Click **Save** 
2. The status should show **Ready to Submit**

---

## Step 3: Create a Sandbox Test Account

### 3.1 Create Test User

1. In App Store Connect, go to **Users and Access**
2. Click **Sandbox** in the left sidebar
3. Click **Testers** → **+** to add a new sandbox tester
4. Fill in the details (use a real email you have access to)
5. Save the tester

### 3.2 Configure Device for Testing

On your iOS device:

1. Go to **Settings** → **App Store**
2. Scroll down to **Sandbox Account**
3. Sign in with your sandbox test account
4. **DO NOT** sign out of your regular Apple ID

---

## Step 4: Test the Purchase Flow

### 4.1 Build and Run

1. Build the app:
   ```bash
   npm run build
   npx cap sync ios
   ```

2. Open Xcode and run on a real device (IAP doesn't work in Simulator)
   ```bash
   npx cap open ios
   ```

3. Select your device and click Run

### 4.2 Test Purchase

1. Open the app and go to Settings
2. Tap **"Unlock Lifetime Access"**
3. Xcode console will show StoreKit logs
4. Complete the purchase with your sandbox account
5. Verify premium features are unlocked

### 4.3 Test Restore

1. Delete and reinstall the app
2. Go to Settings
3. Tap **"Restore Previous Purchase"**
4. Verify your purchase is restored

---

## Step 5: Production Checklist

Before submitting to App Store Review:

- [ ] In-App Purchase is **Ready to Submit** in App Store Connect
- [ ] Product ID matches code exactly
- [ ] Price tier is set correctly
- [ ] Localizations added for all supported languages
- [ ] Review screenshot uploaded
- [ ] Tested purchase flow with sandbox account
- [ ] Tested restore purchases functionality
- [ ] Removed all debug/test code
- [ ] Set StoreKit log level to QUIET for production

### Update Log Level for Production

In `src/hooks/usePurchases.ts`, change:

```typescript
// Development
store.verbosity = LogLevel.DEBUG;

// Production
store.verbosity = LogLevel.QUIET;
```

---

## Troubleshooting

### "Product not found" Error

1. Ensure Product ID matches exactly (case-sensitive)
2. Wait 15-30 minutes after creating the IAP in App Store Connect
3. Ensure your app's Bundle ID matches App Store Connect
4. Verify the IAP status is "Ready to Submit"

### "Cannot connect to iTunes Store"

1. Ensure you're testing on a real device (not Simulator)
2. Check your internet connection
3. Verify sandbox account is properly signed in
4. Try signing out and back in to sandbox account

### Purchase Completes but Premium Not Unlocked

1. Check Xcode console for errors
2. Verify the `verified` and `finished` handlers are being called
3. Check localStorage is being updated correctly

### Restore Doesn't Work

1. Ensure you completed a purchase first
2. Verify you're using the same sandbox account
3. Check that `restorePurchases()` is being called

---

## Code Reference

### Product ID Location
```
src/hooks/usePurchases.ts - Line 4
```

### Purchase Flow
```
src/hooks/usePurchases.ts - purchase() function
```

### Settings UI
```
src/components/Settings.tsx - Premium banner section
```

---

## Support

If you encounter issues with StoreKit integration:

1. Check Apple's [StoreKit Documentation](https://developer.apple.com/documentation/storekit)
2. Review [cordova-plugin-purchase documentation](https://github.com/j3k0/cordova-plugin-purchase)
3. Check the Xcode console for detailed error messages

---

## Price Tiers Reference

| Tier | USD | Notes |
|------|-----|-------|
| Tier 1 | $0.99 | |
| Tier 2 | $1.99 | |
| Tier 3 | $2.99 | |
| Tier 4 | $3.99 | Recommended |
| Tier 5 | $4.99 | Current setting |
| Tier 6 | $5.99 | |

Choose the price tier that matches your `$4.00` target (Tier 4 = $3.99 or Tier 5 = $4.99).

