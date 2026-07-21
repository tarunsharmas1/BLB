# Bliss Bin — Mobile App (Android + iOS)

A native Android and iOS app for the Bliss Bin storefront, built with
[Capacitor](https://capacitorjs.com/). The full storefront (home, product
listing, product detail, cart, checkout, order confirmation, wishlist, account,
corporate-gifting quote) runs inside a native shell, with a mobile-reflowed
layout, safe-area handling for notches/home indicators, native status bar and
splash screen, and Android hardware-back support.

It reuses the exact same web app that ships at the site root
(`../index.html`) — the mobile build layers a responsive stylesheet and the
Capacitor native bridge on top; there is no separate codebase to maintain.

## What's here

```
mobile/
  package.json           Capacitor deps + scripts
  capacitor.config.json  app id/name, splash, status bar, colors
  scripts/copy-web.mjs   assembles www/ from the storefront + mobile head/CSS
  www/        (generated) the web bundle Capacitor packages
  android/    (generated) Android Studio project — build APK/AAB here
  ios/        (generated) Xcode project — build IPA here
```

`www/`, `android/`, `ios/`, and `node_modules/` are generated and git-ignored.
Everything needed to reproduce them is committed.

## Prerequisites

- **Node.js 18+**
- **Android build:** [Android Studio](https://developer.android.com/studio) (includes the Android SDK + Gradle)
- **iOS build:** a **Mac** with [Xcode](https://developer.apple.com/xcode/) and [CocoaPods](https://cocoapods.org/) (`sudo gem install cocoapods`). iOS cannot be built on Windows/Linux.

## First-time setup

From this `mobile/` directory:

```bash
npm install            # install Capacitor
npm run copy:web       # assemble www/ from the storefront
npx cap add android    # create the Android project
npx cap add ios        # create the iOS project (run on a Mac)
```

## Run on a device / emulator

```bash
npm run sync           # copy latest web build + sync native plugins
npm run open:android   # opens Android Studio → press Run to build & launch
npm run open:ios       # opens Xcode → press Run to build & launch
```

Or launch directly onto a connected device/emulator:

```bash
npm run run:android
npm run run:ios
```

## Build a shippable binary

**Android (APK / AAB):**
```bash
npm run sync
npm run open:android
# In Android Studio: Build → Build Bundle(s) / APK(s), or Build → Generate Signed Bundle / APK
```

**iOS (IPA):**
```bash
npm run sync
npm run open:ios
# In Xcode: select a Team under Signing & Capabilities, then Product → Archive → Distribute App
```

## After editing the storefront

Any change to `../index.html`, `../Bliss Bin.dc.html`, `../support.js`, the
design system, or assets is picked up by re-running:

```bash
npm run sync
```

which rebuilds `www/` and copies it into both native projects.

## Configuration

- **App id / name / colors / splash / status bar:** `capacitor.config.json`
- **Mobile head, responsive CSS, native bridge wiring:** `scripts/copy-web.mjs`
  (injected into `www/index.html` at build time)
- **App icons & splash art:** add source images and generate with
  [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets)
  (`npx @capacitor/assets generate`), then `npm run sync`.

## Notes

- Product/hero **images are empty placeholders** — the design project has no
  photography yet. Drop real photos into the storefront's image slots and they
  flow through to the app on the next `npm run sync`.
- **Sign-in** uses the project's Supabase backend and needs network; browse as a
  guest via "Continue without signing in". Google Fonts also load over the
  network, with system-font fallbacks when offline.
