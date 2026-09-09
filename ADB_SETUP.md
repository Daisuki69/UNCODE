# ADB Setup — UNCODE Lockdown Reinforcement

Run these commands **once** after installing the APK. Requires a PC with ADB installed and USB debugging enabled on the device.

---

## Step 1 — Install the APK

```bash
adb install uncode.apk
```

---

## Step 2 — Set UNCODE as Device Owner

This is the most important command. It gives UNCODE the ability to suspend packages, block uninstalls, and manage policies.

```bash
adb shell dpm set-device-owner com.uncode.app/.AdminReceiver
```

> **Note:** If you get "Not allowed to set the device owner because there are already some accounts on the device" — go to **Settings → Accounts** and remove all Google/Samsung/etc accounts first, then re-run. You can add them back after.

> **On rooted devices (fallback):**
> ```bash
> adb shell su -c "dpm set-device-owner com.uncode.app/.AdminReceiver"
> ```

---

## Step 3 — Grant Elevated Permissions

```bash
# Status bar control (needed for QS panel suppression)
adb shell pm grant com.uncode.app android.permission.EXPAND_STATUS_BAR

# System settings write (fine-grained system tuning)
adb shell pm grant com.uncode.app android.permission.WRITE_SECURE_SETTINGS

# Dump permission (status bar reflection method)
adb shell pm grant com.uncode.app android.permission.DUMP
```

---

## Step 4 — Battery and Kill Protection

```bash
# Whitelist UNCODE from battery optimization (prevents Android from killing it)
adb shell dumpsys deviceidle whitelist +com.uncode.app

# Disable kill by low-memory killer (root required)
adb shell su -c "echo -1000 > /proc/$(pidof com.uncode.app)/oom_score_adj" 2>/dev/null || true
```

---

## Step 5 — Enable Accessibility Service (Manual, one time)

This cannot be done via ADB (Android restriction). Do it once on the device:

1. Open **Settings > Accessibility > Downloaded Apps (or Installed Services)**
2. Find **UNCODE**
3. Toggle it **ON**
4. Confirm the prompt

Root shortcut (skips the manual step):
```bash
adb shell su -c "settings put secure enabled_accessibility_services com.uncode.app/.LockAccessibilityService"
adb shell su -c "settings put secure accessibility_enabled 1"
```

---

## Step 6 — Prevent Uninstall

Once Device Owner is set, UNCODE calls `setUninstallBlocked()` automatically on first launch. The uninstall button in Settings will be grayed out.

---

## Verification

After all steps:

1. Open UNCODE, create a schedule, trigger lockdown
2. Try to open a non-whitelisted app: should be grayed out/blocked
3. Pull down notification shade: should work normally
4. Pull down again for QS tiles: should collapse immediately
5. Settings > Apps > UNCODE > Force Stop: button should be grayed out
6. Try to uninstall: should be blocked

---

## Recovery (If Something Goes Wrong)

```bash
# Remove Device Owner
adb shell dpm remove-active-admin com.uncode.app/.AdminReceiver

# Or with root
adb shell su -c "dpm remove-active-admin com.uncode.app/.AdminReceiver"

# Uninstall completely
adb shell pm uninstall com.uncode.app

# Disable accessibility if needed
adb shell su -c "settings put secure enabled_accessibility_services ''"
```
