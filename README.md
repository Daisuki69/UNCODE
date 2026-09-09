# 🔒 UNCODE

<div align="center">

![Android](https://img.shields.io/badge/Platform-Android%2010%2B-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Capacitor](https://img.shields.io/badge/Bridge-Capacitor%207-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Google Gemini](https://img.shields.io/badge/AI%20Evaluation-Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**The intelligent, AI-evaluated study lockdown & focus enforcement app for Android.**

[Features](#-key-features) • [Setup Methods](#-setup-guide) • [qiezka.bat Customization](#%EF%B8%8F-customizing-qiezkabat) • [Security Model](#-security--anti-cheat-architecture) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**UNCODE** is an uncompromising productivity and study-enforcement tool for Android. Unlike generic timer apps that can be bypassed in two clicks, and unlike rigid enterprise kiosk lockdowns that break your phone, UNCODE uses a **selective app-filtering architecture with native self-protection**:

- 📱 **You keep your phone**: Home, Back, and Recents buttons work normally.
- 🚫 **Distractions are squashed**: Any attempt to open a non-whitelisted app (or Android Settings) instantly sends you back to the Home screen.
- ⚡ **Quick Settings blocked**: The notification shade stays accessible for reading alerts, but the Quick Settings tile expansion is collapsed to prevent toggling Wi-Fi, Airplane mode, or settings.
- 🧠 **AI-Verified Early Unlock**: Need to unlock early? There are no bypass buttons. You must physically write your homework or study notes on paper, snap a photo, and submit it for real-time OCR and evaluation by **Google Gemini AI** against your predefined rubric!

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Selective App Blocker** | Whitelist study apps (Calculator, Notes, Dictionary, Music). Non-whitelisted apps are instantly redirected Home via Android Accessibility. |
| **Quick Settings Shield** | Notification shade remains viewable; Quick Settings panel expansion is collapsed automatically in real time. |
| **Anti-Cheat Boot Persistence** | Restarting your phone will not bypass a lock session—`BootReceiver` detects active locks and immediately relaunches UNCODE on boot. |
| **Uninstall Protection (No Account Wipe)** | Uses standard **Device Administrator** + accessibility settings blocking. Android prohibits uninstallation without deactivation, and settings are blocked during lock. |
| **Recents Self-Protection** | Swiping UNCODE away from the Recents overview triggers a silent re-launch to prevent task killing. |
| **AI Homework Evaluation** | Integrated OCR transcription + Google Gemini API (Gemini 3.7 / 2.5 / 2.0) that grades your physical handwriting against grading rubrics before granting an unlock. |
| **Dual Submission Modes** | Seamlessly capture physical work directly with your camera or select existing images from your gallery/files without lockdown bricking. |
| **Dual Setup Paths** | Configure 100% on-device via guided settings or automate the entire process in 5 seconds via `qiezka.bat` over USB debugging. |

---

## 🚀 Setup Guide

UNCODE offers two setup methods. Both yield the exact same security and app-blocking capabilities:

```
                      Choose Your Setup Path
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[ Method 1: On-Device ]                     [ Method 2: PC Script ]
 • 100% on your phone                        • 1-click automated via ADB
 • No PC or cables needed                    • Takes 5 seconds
 • Quick manual toggles                      • Pre-grants all permissions
```

---

### Method 1: On-Device Setup (No PC Required)

Ideal for everyday users. Complete all steps inside the in-app **Permission Walkthrough** screen:

1. **Step 1: Enable Accessibility Service (Required)**
   - Tap **Open Accessibility Settings**.
   - Find **UNCODE** under *Installed Apps* / *Downloaded Services*.
   - Toggle it **ON** and confirm.
2. **Step 2: Activate Device Admin (Recommended)**
   - Tap **Activate Device Admin** to prevent the app from being uninstalled during a lock session.
   - *(If the direct prompt doesn't open on your OEM ROM, tap "Open Device Admin Apps list" and toggle UNCODE on).*
3. **Step 3: Unrestricted Battery / Background (Recommended)**
   - Tap **Allow Unrestricted Background Usage**.
   - Tap **Allow** on the native Android prompt (`ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`) to prevent OEM battery savers from killing the lockdown timer.
4. **Step 4: Allow Notifications (Recommended)**
   - Tap **Allow Notifications** to enable persistent timer alerts and lock completion notifications.
5. **Tap "Proceed to Dashboard"** once ready!

> [!TIP]
> **Got "Restricted setting" on Android 13 or 14+?**
> Android blocks sideloaded apps from enabling Accessibility and Device Admin by default:
> 1. Try tapping Step 1 or Step 2 once (this triggers Android's restriction denial).
> 2. Tap the **Open App Info** button in the walkthrough.
> 3. Tap the **3 dots (⋮)** in the top-right corner of UNCODE's App Info page.
> 4. Tap **Allow restricted settings** and verify your PIN/fingerprint.
> 5. Return to UNCODE and complete your setup!

---

### Method 2: PC Automated Setup (`qiezka.bat`)

Ideal for developers, power users, or anyone with a PC who wants a 1-click automated setup without tapping through menus:

1. Enable **Developer Options** on your phone (tap *Settings > About Phone > Build Number* 7 times).
2. Go to *Settings > Developer Options* and turn on **USB Debugging**.
3. Connect your phone to your PC via USB cable and allow the USB Debugging prompt on your phone screen.
4. Double-click **`qiezka.bat`** (or run it from CMD/PowerShell).
5. The script will automatically:
   - Verify device connection.
   - Detect if UNCODE is installed (or install local APK).
   - Grant elevated permissions (`WRITE_SECURE_SETTINGS`, `DUMP`, `POST_NOTIFICATIONS`).
   - Automatically bypass Android 13/14+ Restricted Settings (`appops`).
   - Whitelist UNCODE from battery optimization (`deviceidle whitelist`).
   - Enable Accessibility Service automatically.
   - Activate Device Administrator to lock uninstalls.
   - Launch UNCODE on your phone ready to go!

---

## ⚙️ Customizing `qiezka.bat`

The [`qiezka.bat`](file:///c:/Users/CxAdmin/Desktop/qiezka/uncode/qiezka.bat) script includes a modular **User Configuration Section** at the very top. Open the file in Notepad or VSCode to tailor every step with simple `true` or `false` switches:

```bat
:: ============================================================================
::                     USER CONFIGURATION / PREFERENCES
::  Edit the values below (true or false) to tailor the setup to your needs.
:: ============================================================================

:: 1. Force re-install local APK even if already installed on device
set "FORCE_REINSTALL_APK=false"

:: 2. Unlock Android 13/14+ Restricted Settings automatically via ADB
set "BYPASS_RESTRICTED_SETTINGS=true"

:: 3. Grant elevated system permissions (WRITE_SECURE_SETTINGS, DUMP, POST_NOTIFICATIONS)
set "GRANT_SECURE_PERMISSIONS=true"

:: 4. Whitelist UNCODE from aggressive OS battery savers (Samsung, Xiaomi, etc.)
set "WHITELIST_BATTERY=true"

:: 5. Automatically enable UNCODE's Accessibility Service via ADB
set "ENABLE_ACCESSIBILITY=true"

:: 6. Activate Device Administrator to prevent uninstallation during lockdown
set "ACTIVATE_DEVICE_ADMIN=true"

:: 7. Attempt Enterprise Device Owner mode (DEFAULT: false)
set "TRY_DEVICE_OWNER=false"

:: 8. Automatically launch UNCODE on your phone after setup completes
set "LAUNCH_APP_ON_FINISH=true"
```

### Configuration Options Explained

| Variable | Default | Function |
|---|:---:|---|
| `FORCE_REINSTALL_APK` | `false` | When `false`, the script checks `pm path com.uncode.app`. If UNCODE is already installed on your device, it skips the reinstall step and goes straight to permissions. Set to `true` if you want to force-push a newly built APK. |
| `BYPASS_RESTRICTED_SETTINGS` | `true` | Executes `appops set com.uncode.app ACCESS_RESTRICTED_SETTINGS allow` via ADB. Completely bypasses Android 13/14's "Restricted setting" dialog without needing to open App Info or tap the 3-dot menu. |
| `GRANT_SECURE_PERMISSIONS` | `true` | Grants `WRITE_SECURE_SETTINGS`, `DUMP`, and `POST_NOTIFICATIONS` via `pm grant`. |
| `WHITELIST_BATTERY` | `true` | Whitelists UNCODE in Android's Doze engine (`dumpsys deviceidle whitelist +com.uncode.app`), stopping OS task killers from freezing timers. |
| `ENABLE_ACCESSIBILITY` | `true` | Silently enables `LockAccessibilityService` via `settings put secure enabled_accessibility_services ...` so you don't have to toggle it manually in Android Settings. |
| `ACTIVATE_DEVICE_ADMIN` | `true` | Runs `dpm set-active-admin com.uncode.app/.AdminReceiver` to activate Device Administrator mode. Blocks uninstallation during lockdown without needing to wipe or remove any Google accounts. |
| `TRY_DEVICE_OWNER` | `false` | **Leave false for personal devices.** Setting to `true` attempts `dpm set-device-owner`. Android will reject this on unrooted devices if personal Google/messaging accounts exist. Device Admin + Accessibility provides full protection without this. |
| `LAUNCH_APP_ON_FINISH` | `true` | Automatically brings UNCODE to the foreground on your phone once setup finishes. |

---

## 🛡️ Security & Anti-Cheat Architecture

```
                          ┌────────────────────────┐
                          │   Active Lock Session  │
                          └───────────┬────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
[ App Launch Interception ]     [ System UI Defense ]        [ Anti-Bypass Guard ]
 • Accessibility monitors        • Quick Settings collapsed   • Device Admin active
   window transitions              in real time                 (uninstall blocked)
 • Whitelisted apps: OK          • Notification shade stays   • Settings app: Blocked
 • Blocked apps: sent Home         viewable for alerts        • BootReceiver: Resumes
 • Camera & Gallery: Allowed     • Recents: Auto-reopens        lock automatically
   for homework submission         if swiped away               after phone reboot
```

### Why Device Owner Was Replaced with Device Admin
- **The Issue with Device Owner:** Android's security design blocks `dpm set-device-owner` on non-rooted phones if *any* user accounts (Google, WhatsApp, etc.) exist on the device, failing with `IllegalStateException: Not allowed to set the device owner because there are already some accounts`.
- **The Solution:** UNCODE uses **Standard Device Administrator** (`DeviceAdminReceiver`):
  - When an app is an active Device Administrator, Android **strictly prohibits uninstallation** and requires the user to deactivate it in Settings first.
  - Because UNCODE's accessibility service **blocks the Android Settings app** during lockdown, the user **cannot open Settings to deactivate Device Admin or uninstall the app!**
  - **Zero accounts need to be removed or wiped.**

---

## 💻 Tech Stack

- **Core & Runtime**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Mobile Native Bridge**: [Capacitor 7](https://capacitorjs.com/) (`@capacitor/android`, `@capacitor/filesystem`)
- **Native Android Engine**: Java (Accessibility Service, DevicePolicyManager, BroadcastReceiver, ContentResolver SAF)
- **AI & Evaluation**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 3.7 / 2.5 / 2.0 Flash & Pro) + OCR.space
- **Styling & UI**: [Tailwind CSS 4](https://tailwindcss.com/), [Motion / Framer Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)

---

## 🛠️ Development & Building

### Prerequisites
- Node.js 18+ & npm
- Android Studio Ladybug+ & Android SDK 34+
- Android platform-tools (ADB) in your system PATH

### Commands
```bash
# Install dependencies
npm install

# Run web dev server
npm run dev

# Build web distribution bundle
npm run build

# Sync web assets and plugins to native Android
npx cap sync android

# Open Android native project in Android Studio
npx cap open android
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
