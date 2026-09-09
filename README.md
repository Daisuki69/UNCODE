# ⚡ QIEZKA

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Android%2010%2B-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Bridge](https://img.shields.io/badge/Bridge-Capacitor%207-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![AI Engine](https://img.shields.io/badge/AI%20Evaluation-Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![API Model](https://img.shields.io/badge/API-Bring%20Your%20Own%20Key%20(BYOK)-FF9800?style=for-the-badge)
![Offline Support](https://img.shields.io/badge/Offline-Resources%20%26%20Lockdown-2196F3?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**The uncompromising, AI-evaluated study lockdown & focus enforcement system for Android.**

[Philosophy](#-philosophy-procrastination-prevention) • [Overview](#-overview) • [Connectivity & BYOK](#-online-architecture--offline-resources-byok) • [Key Features](#-key-features) • [Setup Guide](#-setup-guide) • [qiezka.bat Configuration](#%EF%B8%8F-customizing-qiezkabat) • [Security Model](#-security--anti-cheat-architecture) • [Tech Stack](#-tech-stack)

</div>

---

## 🎯 Philosophy: Procrastination Prevention

> ### *"We just want students to finish their homework. We didn't say prevent them from using modern tools — the sole enemy is procrastination."*

<div align="center">

```
   ╔═══════════════════════════════════════════════════════════════════════════════╗
   ║                        THE ENEMY IS PROCRASTINATION                           ║
   ║                         NOT RESEARCH, NOTES, OR AI                            ║
   ╚═══════════════════════════════════════════════════════════════════════════════╝
```

</div>

Most productivity blockers fail because they fall into one of two extremes:
1. **Too Soft**: A polite reminder dialog that users swipe away in half a second.
2. **Blindly Restrictive**: They turn the smartphone into an unusable brick, locking students out of their lecture slides, school portals, notes, or cutting-edge study tools.

**QIEZKA rejects both.** 

Our guiding directive is simple: **Eliminate the black holes of wasted time, while keeping the full homework and research arsenal permanently armed.**

---

### 🛑 What We Obliterate (The Distraction Pit)
Algorithmically engineered dopamine traps that hijack human psychology and steal hours of student productivity:

* 📱 **Short-Form Doomscrolling**: TikTok, Instagram Reels, YouTube Shorts, X/Twitter, Reddit, Facebook, Threads, CapCut.
* 🍿 **Streaming & Piracy Black Holes**: Bilibili, KissKH (`id.kisskh.twa`), Netflix, Disney+, WeTV, iQIYI, Crunchyroll, Loklok, CloudStream, Mihon, and micro-drama reels (ReelShort, DramaBox, ShortMax).
* 🎮 **Competitive Games & Gachas**: Roblox, Mobile Legends, Genshin Impact, Honkai: Star Rail, PUBG, Free Fire, Supercell titles, Candy Crush.
* 🛍️ **Impulsive Shopping**: Shopee, Lazada, Amazon, Temu, Shein, AliExpress, TikTok Shop.
* 💉 **Modded Clients & Game Hacks**: Lucky Patcher, InstaPrime, GameGuardian, ReVanced, Instander, AeroInsta.

---

### ⚡ What We Empower ("ALWAYS" Allowed Arsenal)
During lockdown, students need tools to learn, calculate, write, and submit assignments. These tools are **hardcoded as always allowed** and given priority placement in the app drawer:

| Category | Permitted Tools | Why It's Hardcoded Allowed |
|---|---|---|
| 🤖 **AI Study Assistants** | **Google Gemini, ChatGPT, Claude, Microsoft Copilot, Perplexity, DeepSeek, Poe, Pi AI** | **Why AI?** AI is the ultimate 24/7 personal tutor. If an AI helps you grasp complex physics, explain calculus, draft an outline, or debug code so you finish your homework on time, **that is a win**. The goal is conquering procrastination, not denying modern intelligence. |
| 📝 **All Notes Apps** | **Google Keep, Samsung Notes, Microsoft OneNote, Notion, Obsidian, Evernote, ColorNote, Squid, Simplenote** | Students must always be able to jot ideas, review lecture outlines, and brainstorm without obstacles. |
| 🎓 **Student Platforms & Storage** | **Google Classroom, Drive, Docs, Sheets, Slides, Canvas Student, Blackboard Learn, Schoology, Quizlet, AnkiDroid** | Your textbooks, problem sets, syllabi, and submission portals must never be blocked. |
| 🧮 **STEM Calculators** | **Desmos Graphing Calculator, GeoGebra, Photomath, WolframAlpha, system calculators** | Modern coursework requires computing and graphing horsepower. |
| 🛡️ **2FA Authenticators** | **Google Authenticator, Microsoft Authenticator, Duo Mobile, Authy, 2FAS, Aegis, Bitwarden** | Zero lockouts. Signing into university portals and Google accounts must remain frictionless. |
| 🎵 **Deep Focus Audio & Browsers** | **Spotify, YouTube Music, Apple Music, Tidal, Chrome, Firefox, Brave** | Deep work requires a flow state. Background binaural beats, lo-fi study tracks, and web research are always accessible. |

---

## 📖 Overview

**QIEZKA** is an uncompromising productivity and study-enforcement tool built for Android. Unlike generic timer apps that can be bypassed in two clicks, and unlike rigid enterprise kiosk lockdowns that break phone essentials, QIEZKA strikes a surgical balance using a **selective app-filtering architecture with native self-protection**:

- 📱 **Normal Phone Capabilities Preserved**: Navigation buttons (Home, Back, Recents) continue to work normally. You are not trapped in a broken full-screen jail.
- 🚫 **Instant Distraction Redirection**: Any attempt to open a non-whitelisted app or system settings immediately sends the user back to the Home screen in milliseconds.
- ⚡ **Quick Settings Tile Collapse**: The notification shade remains accessible for reading urgent messages, but the Quick Settings tile expansion is collapsed in real time to prevent toggling Wi-Fi, Airplane mode, or system toggles.
- 🌐 **Online AI-Verified Early Unlock (BYOK)**: No "give up" button or soft timers. The only way to unlock early is to write your homework or notes on physical paper, photograph it, and have **Google Gemini AI** evaluate your handwriting against your study rubric in real time using your own API key.
- 📴 **Offline Resource & Lockdown Capability**: All study resources, document ingestion (`.docx`, `.txt`, `.md`), notes management, timers, and Android native app blocking work **100% offline** without any internet connection.
- 📸 **Camera & File Picker Exemptions**: When taking photos or selecting documents for AI homework grading, QIEZKA's native accessibility engine intelligently recognizes system camera intents and file pickers, preventing false-positive lockouts.

---

## 🌐 Online Architecture & Offline Resources (BYOK)

QIEZKA is designed as a **hybrid online/offline system** with a strict **Bring Your Own Key (BYOK)** privacy model:

```
                                  QIEZKA SYSTEM
                                        │
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼                                                               ▼
[ ONLINE FEATURES ]                                             [ OFFLINE FEATURES ]
Requires Internet + Personal API Key                            Works 100% Without Internet
 • Handwritten Homework AI Evaluation (Gemini)                   • Study Resource Library & Notes Editor
 • Real-time Photo OCR Transcription (OCR.space)                 • Local Document Parsing (.docx, .txt, .md)
 • AI Prompt Refinement & Dynamic Rubrics                        • Focus Session Timers & Countdown
 • Cloud Model Selection (Gemini 2.5/2.0/Flash/Pro)              • Selective App Blocking (Accessibility)
                                                                 • Quick Settings Shield & Recents Guard
                                                                 • Device Admin Anti-Uninstall Protection
                                                                 • Full JSON Data Backup & Restore
```

### 1. What Works Offline (Resources & Lockdown Only)
- **Local Study Resources**: You can create, edit, search, organize, and review all your notes, syllabi, and study materials with zero internet connection.
- **Client-Side Document Parsing**: Ingestion of `.txt`, `.md`, and Microsoft Word `.docx` documents is processed directly inside your browser/WebView using local in-memory engines ([Mammoth](https://github.com/mwilliamson/mammoth.js)).
- **Focus Enforcement & Lockdown Engine**: Android Accessibility service app-blocking, Quick Settings tile collapse, Device Administrator uninstall prevention, and boot recovery operate strictly on-device via native Android OS APIs.
- **Data Backups**: Export and import complete JSON backups of your settings, resources, and schedules offline.

### 2. What Requires an Online Connection & Your Own API Key (BYOK)
- **AI Homework Evaluation**: Grading your handwritten homework photo against your study rubric requires connecting to the Google Gemini API.
- **Photo OCR Transcription**: Extracting text from photographed papers requires connecting to the OCR.space API.
- **Users Must Provide Their Own API Key (BYOK)**:
  - **Zero Central Servers**: QIEZKA has no middleman servers, no proxy backends, and no proprietary accounts.
  - **100% Private**: Your API keys and homework photos travel directly from your phone to Google / OCR.space over encrypted HTTPS.
  - **Always Free**: Both Google Gemini and OCR.space provide generous **free tiers** that require no payment.

---

## 🔑 How to Get Your Free API Keys

QIEZKA takes 1 minute to configure with free keys:

### 1. Google Gemini API Key (Required for AI Evaluation)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with any Google account.
3. Click **"Create API Key"** and copy the generated key (starts with `AIzaSy...`).
4. In QIEZKA, tap the **Settings (gear icon)** at the top right, paste it into **Gemini API Key**, and tap **Save**.

### 2. OCR.space API Key (Required for Image Transcription)
1. Visit [OCR.space Free API Registration](https://ocr.space/ocrapi/freekey).
2. Enter your email and name; your free API key will be delivered instantly.
3. In QIEZKA, paste it into **Simple OCR API Key** or **Formatted OCR API Key** under Settings and tap **Save**.

---

## ✨ Key Features

| Feature | Details | Network Requirement |
|---|---|:---:|
| 🎯 **Selective App Filtering** | Whitelist required tools (Calculator, Notes, Dictionary, Music, PDF Reader). All non-approved apps are immediately suppressed and routed to Home via Android Accessibility. | 📴 **Offline** |
| 🛡️ **Quick Settings Defense** | Allows the notification shade for reading text alerts while collapsing Quick Settings tiles to prevent bypass via status toggles. | 📴 **Offline** |
| 🔄 **Anti-Cheat Boot Persistence** | Restarting the phone will not break the lockdown session—`BootReceiver` detects active timers and immediately re-engages QIEZKA upon system boot. | 📴 **Offline** |
| 🔒 **Uninstall Protection** | Activated as a standard **Device Administrator**. Android blocks uninstallation until administrator privileges are revoked; because QIEZKA blocks Android Settings during lockdown, deactivation is impossible. | 📴 **Offline** |
| 📚 **Resource Library** | Create, view, edit, and organize lecture notes, study outlines, syllabi, and local `.docx`/`.txt` files client-side. | 📴 **Offline** |
| 🤖 **AI Homework Evaluation** | Built-in OCR pipeline connected with Google Gemini models (Gemini 2.5, Gemini 2.0, Gemini 1.5) that inspects work quality against a custom rubric before allowing an unlock. | 🌐 **Online (BYOK)** |
| 📑 **Dual Submission Flow** | Choose between capturing physical handwritten pages with your live camera (`capture="environment"`) or selecting files/photos from your device gallery. | 🌐 **Online (BYOK)** |
| 🔋 **Doze & Battery Saver Immunity** | Whitelists QIEZKA from aggressive Android Doze and OEM power managers (Samsung OneUI, Xiaomi MIUI/HyperOS, Pixel) to prevent timers from being killed. | 📴 **Offline** |
| 🛠️ **Dual Setup Pathways** | Complete configuration 100% on-device via guided interactive prompts, or automate the entire setup in seconds with `qiezka.bat` over USB debugging. | 📴 **Offline** |

---

## 🚀 Setup Guide

QIEZKA offers two distinct setup paths. Both yield the exact same security and app-blocking capabilities:

```
                            Choose Your Setup Path
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
      [ Method A: On-Device ]                     [ Method B: PC ADB Script ]
       • 100% on your phone                        • Automated via qiezka.bat
       • No PC or USB cable needed                 • Takes 5 seconds
       • Step-by-step guided UI                    • Pre-grants all permissions
```

---

### Method A: On-Device Setup (No PC Required)

Ideal for everyday use. Complete all 4 steps inside the in-app **Permission Walkthrough** screen:

1. **Step 1: Enable Accessibility Service (Required)**
   - Tap **Open Accessibility Settings**.
   - Navigate to *Installed Apps* / *Downloaded Services*.
   - Tap **QIEZKA** and toggle it **ON**.
2. **Step 2: Activate Device Administrator (Recommended)**
   - Tap **Activate Device Admin**.
   - Confirm the system prompt to prevent uninstallation during a lockdown session.
   - *(If the direct prompt does not open on your OEM ROM, tap "Open Device Admin Apps list" and toggle QIEZKA on manually).*
3. **Step 3: Unrestricted Battery / Background (Recommended)**
   - Tap **Allow Unrestricted Background Usage**.
   - Tap **Allow** on Android's native battery optimization exemption prompt (`ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`) to stop OEM task killers from freezing timers.
4. **Step 4: Allow Notifications (Recommended)**
   - Tap **Allow Notifications** to enable persistent timer alerts and lock completion alerts.
5. **Tap "Proceed to Dashboard"** to finish setup!

> [!TIP]
> #### Android 13/14+ "Restricted setting" Bypass Guide
> Android 13 and 14+ automatically mark sideloaded apps with a *"Restricted setting"* warning for Accessibility and Device Admin. You can unlock it in 10 seconds:
> 1. In the QIEZKA walkthrough, tap **Step 1** or **Step 2** once (this triggers Android to register the restriction attempt).
> 2. Tap the **Open App Info** button inside the walkthrough banner.
> 3. In the top-right corner of QIEZKA's App Info page, tap the **3 dots (⋮)** menu.
> 4. Tap **Allow restricted settings** and confirm with your device PIN or fingerprint.
> 5. Return to QIEZKA and complete the steps normally!

---

### Method B: PC Automated Setup (`qiezka.bat`)

Ideal for power users, developers, or anyone with a PC who wants an instant, 1-click setup:

1. Enable **Developer Options** on your Android phone (Go to *Settings > About Phone* and tap *Build Number* 7 times).
2. Go to *Settings > Developer Options* and turn on **USB Debugging**.
3. Connect your phone to your PC via USB cable and allow the USB Debugging authorization prompt on your phone screen.
4. Double-click **`qiezka.bat`** (or execute it in Command Prompt / PowerShell).
5. The script automatically verifies your device, checks if QIEZKA is installed (or installs a local APK), unlocks restricted settings, whitelists battery, enables accessibility, activates device admin, and launches QIEZKA!

---

## ⚙️ Customizing `qiezka.bat`

[`qiezka.bat`](file:///c:/Users/CxAdmin/Desktop/qiezka/uncode/qiezka.bat) includes a **User Configuration Section** at the very top. You can open `qiezka.bat` in any text editor (Notepad, VS Code) to customize every function using simple `true` or `false` flags:

```bat
:: ============================================================================
::                     USER CONFIGURATION / PREFERENCES
::  Edit the values below (true or false) to tailor the setup to your needs.
:: ============================================================================

:: 1. Force re-install local APK even if already installed on device (default: false)
set "FORCE_REINSTALL_APK=false"

:: 2. Unlock Android 13/14+ Restricted Settings automatically via ADB
set "BYPASS_RESTRICTED_SETTINGS=true"

:: 3. Grant elevated system permissions (WRITE_SECURE_SETTINGS, DUMP, POST_NOTIFICATIONS)
set "GRANT_SECURE_PERMISSIONS=true"

:: 4. Whitelist QIEZKA from aggressive OS battery savers (Samsung, Xiaomi, etc.)
set "WHITELIST_BATTERY=true"

:: 5. Automatically enable QIEZKA's Accessibility Service via ADB
set "ENABLE_ACCESSIBILITY=true"

:: 6. Activate Device Administrator to prevent uninstallation during lockdown
::    (100% realistic: works with all personal Google accounts logged in, no wipe needed)
set "ACTIVATE_DEVICE_ADMIN=true"

:: 7. Attempt Enterprise Device Owner mode (DEFAULT: false)
::    (Unrealistic for everyday devices: requires root or removing all Google accounts)
set "TRY_DEVICE_OWNER=false"

:: 8. Automatically launch QIEZKA on your phone after setup completes
set "LAUNCH_APP_ON_FINISH=true"
```

---

### Function Reference & Options Guide

| Function | Default | Value | What It Does & When To Use It |
|---|:---:|:---:|---|
| **`FORCE_REINSTALL_APK`** | `false` | `false`<br>`true` | **`false` (Recommended)**: The script checks `pm path com.uncode.app`. If QIEZKA is already installed on your device, it skips the install step and jumps straight to provisioning permissions.<br>**`true`**: Forces an `adb install -r` of the local APK file, overwriting the app on your phone even if already present. Use this when you built a new debug APK and want to push the latest code. |
| **`BYPASS_RESTRICTED_SETTINGS`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Runs `appops set com.uncode.app ACCESS_RESTRICTED_SETTINGS allow`. Bypasses Android 13/14's sideload restrictions instantly without needing to enter App Info or tap the 3-dot menu manually.<br>**`false`**: Skips the ADB appops call (requires manual permission granting on device). |
| **`GRANT_SECURE_PERMISSIONS`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Pre-grants `WRITE_SECURE_SETTINGS`, `DUMP`, and `POST_NOTIFICATIONS`. Enables seamless background system control without in-app dialog popups.<br>**`false`**: Skips secure permission granting. |
| **`WHITELIST_BATTERY`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Runs `dumpsys deviceidle whitelist +com.uncode.app`. Whitelists QIEZKA from Android Doze mode and OEM battery task killers (e.g. Samsung Device Care, Xiaomi MIUI Battery Saver).<br>**`false`**: Skips battery whitelisting. |
| **`ENABLE_ACCESSIBILITY`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Automatically registers and enables `LockAccessibilityService` in Android secure settings. Eliminates having to find QIEZKA under Accessibility menus.<br>**`false`**: Skips enabling Accessibility via ADB. |
| **`ACTIVATE_DEVICE_ADMIN`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Runs `dpm set-active-admin com.uncode.app/.AdminReceiver`. Makes QIEZKA an active Device Administrator. Android blocks uninstallation while active. Because QIEZKA blocks Settings during lockdown, you cannot uninstall during study sessions. Works on all phones with all accounts logged in.<br>**`false`**: Leaves Device Admin inactive. |
| **`TRY_DEVICE_OWNER`** | `false` | `false`<br>`true` | **`false` (Recommended)**: Device Owner is an enterprise MDM mode meant for factory-reset corporate devices. If personal Google/WhatsApp accounts exist, Android rejects it. Standard Device Admin + Settings blocking provides full protection without removing accounts.<br>**`true`**: Attempts `dpm set-device-owner`. Only succeeds on fresh/wiped devices with 0 accounts or rooted devices. |
| **`LAUNCH_APP_ON_FINISH`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Sends an `am start` command to bring QIEZKA to the foreground on your phone screen immediately after script execution.<br>**`false`**: Leaves the phone in its current state without launching the app. |

---

## 🛡️ Security & Anti-Cheat Architecture

```
                            ┌────────────────────────┐
                            │   Active Lock Session  │
                            └───────────┬────────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
  [ App Interception ]          [ SystemUI Defense ]          [ Anti-Bypass Guard ]
   • Window events monitored     • Quick Settings collapsed    • Device Admin prevents
   • Whitelisted: Allowed          in real time                  uninstallation
   • Blacklisted: Routed Home    • Notification shade stays    • Settings app: Blocked
   • Camera & File Pickers:        accessible for alerts       • BootReceiver: Resumes
     Exempt for homework         • Recents overview: Auto        lock after reboot
     submission without kick       re-launches if swiped
```

### Why Standard Device Administrator Over Device Owner?
- **Enterprise Device Owner Limitation**: Android requires that **zero** accounts (Google, WhatsApp, Telegram, etc.) exist on the device before setting a Device Owner (`IllegalStateException: Not allowed to set the device owner because there are already some accounts on the device`). Forcing users to delete their personal accounts or factory reset is impractical.
- **The QIEZKA Solution**: Standard **Device Administrator** (`DeviceAdminReceiver`):
  1. Once active, Android strictly prohibits the application from being uninstalled until the user deactivates administrator permissions in Android Settings.
  2. Because QIEZKA's accessibility engine **blocks the Android Settings app** during lockdown, the user cannot access the menu to deactivate Device Admin or uninstall the app.
  3. All personal accounts remain completely intact, and no root or wipe is required.

---

## 💻 Tech Stack

- **Core & Runtime**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Mobile Native Bridge**: [Capacitor 7](https://capacitorjs.com/) (`@capacitor/android`, `@capacitor/filesystem`)
- **Native Android Engine**: Java (Accessibility Service, DevicePolicyManager, BroadcastReceiver, ContentResolver SAF)
- **AI & Evaluation**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 2.5 / 2.0 / 1.5 Flash & Pro) + OCR.space
- **Styling & UI**: [Tailwind CSS 4](https://tailwindcss.com/), [Motion / Framer Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)

---

## 🛠️ Development & Building

### Prerequisites
- Node.js 18+ & npm
- Android Studio (Ladybug or newer) & Android SDK 34+
- Android platform-tools (ADB) in your system PATH

### Commands
```bash
# Install dependencies
npm install

# Run web dev server
npm run dev

# Build web distribution bundle
npm run build

# Sync web bundle and native plugins to Android
npx cap sync android

# Open Android project in Android Studio
npx cap open android
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
