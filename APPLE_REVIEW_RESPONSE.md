# Apple App Review - Business Model Documentation

**App Name:** Water Reminder  
**Date:** January 7, 2026

---

## Business Model Overview

Water Reminder is a hydration tracking app that helps users monitor their daily water intake. The app offers a **7-day free trial** with full feature access, followed by a **one-time lifetime purchase** of $4.00 USD to continue using the app.

---

## Responses to Review Questions

### 1. Who are the users that will use the paid subscriptions in the app?

**This app does not use subscriptions.** Instead, we offer a **one-time lifetime purchase**.

The users who purchase lifetime access are:

- **Health-conscious individuals** who want to track and improve their daily hydration habits
- **Fitness enthusiasts** who need to monitor water intake as part of their health routine
- **Users with medical recommendations** to maintain proper hydration levels
- **Anyone seeking to build better hydration habits** through daily tracking and reminders

All users receive a **7-day free trial** with complete access to all features. After the trial period, users can purchase lifetime access for $4.00 USD to continue tracking their hydration.

---

### 2. Where can users purchase the subscriptions that can be accessed in the app?

**All purchases are made exclusively through Apple's In-App Purchase system within the app.**

- Users navigate to the **Settings** tab in the app
- A prominent banner displays their trial status (days remaining or expired)
- Users tap the **"Keep Forever ($4.00)"** or **"Unlock Lifetime Access ($4.00)"** button
- This initiates Apple's standard In-App Purchase flow
- Payment is processed entirely through Apple's payment system
- No external payment methods or websites are used

**There is no way to purchase access outside of the app or outside of Apple's In-App Purchase system.**

---

### 3. What specific types of previously purchased subscriptions can a user access in the app?

**This app uses a Non-Consumable In-App Purchase (Lifetime Access), not subscriptions.**

If a user has previously purchased lifetime access:

- **Restore Purchases:** Users can restore their purchase on a new device or after reinstalling the app using Apple's standard restore functionality
- **Purchase Type:** Non-Consumable (one-time purchase, permanent access)
- **Product ID:** `com.waterreminder.app.lifetime`
- **Price:** $4.00 USD (or equivalent in local currency)

The app verifies previous purchases through Apple's StoreKit framework and automatically unlocks premium features for users who have previously purchased lifetime access.

---

### 4. What paid content, subscriptions, or features are unlocked within your app that do not use in-app purchase?

**None. All paid features are unlocked exclusively through Apple's In-App Purchase system.**

Our monetization model:

| Feature | Free Trial (7 Days) | After Trial (No Purchase) | Lifetime Access ($4.00 IAP) |
|---------|---------------------|---------------------------|----------------------------|
| Water intake tracking | ✅ Full access | ❌ Locked | ✅ Full access |
| Quick-add drink buttons | ✅ Full access | ❌ Locked | ✅ Full access |
| History & statistics | ✅ Full access | ❌ Locked | ✅ Full access |
| Hydration reminders | ✅ Full access | ❌ Locked | ✅ Full access |
| Voice control | ✅ Full access | ❌ Locked | ✅ Full access |
| All drink types | ✅ Full access | ❌ Locked | ✅ Full access |

**Important clarifications:**

- ❌ We do NOT accept payments outside of Apple's In-App Purchase
- ❌ We do NOT use any third-party payment processors
- ❌ We do NOT offer promo codes that bypass In-App Purchase
- ❌ We do NOT have any web-based payment options
- ❌ We do NOT link to external websites for purchases

**All premium features are gated behind Apple's In-App Purchase system, ensuring full compliance with App Store guidelines.**

---

## Technical Implementation

- **StoreKit Version:** StoreKit 2 (recommended) or StoreKit 1
- **Product Type:** Non-Consumable
- **Receipt Validation:** Server-side validation recommended (or on-device for basic implementation)
- **Restore Purchases:** Implemented via StoreKit 2 equivalent


