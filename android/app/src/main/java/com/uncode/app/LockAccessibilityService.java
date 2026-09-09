package com.uncode.app;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.provider.MediaStore;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class LockAccessibilityService extends AccessibilityService {

    private static final String TAG = "LockAccessService";
    private static final String PREFS_NAME = "uncode_lock";

    /**
     * Packages that are always exempt from blocking.
     * NOTE: com.android.settings is intentionally NOT here — it should be blockable.
     * The launcher/home is also exempt because we actively send users there on block.
     */
    private static final Set<String> ALWAYS_EXEMPT = new HashSet<>(Arrays.asList(
        "android",                   // Core OS framework
        "com.android.systemui"       // Status bar, nav bar, recents UI
    ));

    /**
     * Known launcher packages. These are always allowed so the user can freely use
     * the home screen.
     */
    private static final Set<String> KNOWN_LAUNCHERS = new HashSet<>(Arrays.asList(
        "com.google.android.apps.nexuslauncher",
        "com.android.launcher",
        "com.android.launcher2",
        "com.android.launcher3",
        "com.miui.home",
        "com.sec.android.app.launcher",
        "com.huawei.android.launcher",
        "com.oneplus.launcher",
        "com.oppo.launcher",
        "com.coloros.launcher",
        "com.realme.launcher",
        "com.transsion.launcher",
        "com.bbk.launcher2",
        "com.vivo.launcher"
    ));

    /**
     * Common OEM cameras, galleries, and system file/photo pickers.
     * These must be exempt so users can take photos or upload images to submit homework.
     */
    private static final Set<String> MEDIA_AND_FILE_EXEMPT = new HashSet<>(Arrays.asList(
        // Camera apps
        "com.google.android.GoogleCamera",
        "com.sec.android.app.camera",
        "com.android.camera",
        "com.android.camera2",
        "com.miui.camera",
        "com.huawei.camera",
        "com.oppo.camera",
        "com.coloros.camera",
        "com.oneplus.camera",
        "com.vivo.camera",
        "org.codeaurora.snapcam",
        "net.sourceforge.opencamera",

        // Gallery & Photos
        "com.google.android.apps.photos",
        "com.google.android.apps.photosgo",
        "com.sec.android.gallery3d",
        "com.android.gallery3d",
        "com.android.gallery",
        "com.miui.gallery",
        "com.coloros.gallery3d",
        "com.oneplus.gallery",
        "com.huawei.photos",
        "com.vivo.gallery",

        // Document pickers, Media providers & File managers
        "com.android.documentsui",
        "com.google.android.documentsui",
        "com.google.android.providers.media.module",
        "com.android.providers.media",
        "com.sec.android.app.myfiles",
        "com.google.android.apps.nbu.files",
        "com.mi.android.globalFileexplorer",
        "com.coloros.filemanager",
        "com.oneplus.filemanager",
        "com.huawei.filemanager",
        "com.vivo.FileManager"
    ));

    private final Set<String> dynamicExemptPackages = new HashSet<>();
    private SharedPreferences prefs;

    @Override
    public void onServiceConnected() {
        super.onServiceConnected();
        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);

        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.packageNames = null; // Watch all packages
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS;
        info.notificationTimeout = 50;
        setServiceInfo(info);

        refreshDynamicExemptPackages();

        Log.i(TAG, "LockAccessibilityService connected");
    }

    /**
     * Dynamically discovers all installed apps that handle camera capture,
     * photo picking, and image document selection on this specific device.
     */
    private void refreshDynamicExemptPackages() {
        try {
            PackageManager pm = getPackageManager();
            if (pm == null) return;

            // Camera capture handlers
            Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            List<ResolveInfo> cameraApps = pm.queryIntentActivities(cameraIntent, 0);
            for (ResolveInfo info : cameraApps) {
                if (info.activityInfo != null && info.activityInfo.packageName != null) {
                    dynamicExemptPackages.add(info.activityInfo.packageName);
                }
            }

            // Photo picker & Gallery handlers
            Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            List<ResolveInfo> galleryApps = pm.queryIntentActivities(galleryIntent, 0);
            for (ResolveInfo info : galleryApps) {
                if (info.activityInfo != null && info.activityInfo.packageName != null) {
                    dynamicExemptPackages.add(info.activityInfo.packageName);
                }
            }

            // Document / image file picker handlers
            Intent getContentIntent = new Intent(Intent.ACTION_GET_CONTENT);
            getContentIntent.setType("image/*");
            List<ResolveInfo> fileApps = pm.queryIntentActivities(getContentIntent, 0);
            for (ResolveInfo info : fileApps) {
                if (info.activityInfo != null && info.activityInfo.packageName != null) {
                    dynamicExemptPackages.add(info.activityInfo.packageName);
                }
            }
            Log.d(TAG, "Discovered dynamic exempt media/file packages: " + dynamicExemptPackages.size());
        } catch (Exception e) {
            Log.w(TAG, "Error resolving dynamic media packages: " + e.getMessage());
        }
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (prefs == null) {
            prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        }

        boolean isLockdownActive = prefs.getBoolean("lockdown_active", false);
        if (!isLockdownActive) return;

        CharSequence pkgChar = event.getPackageName();
        if (pkgChar == null) return;
        String pkg = pkgChar.toString();

        // ── SystemUI handling ──
        if (pkg.equals("com.android.systemui")) {
            handleSystemUiEvent(event);
            return;
        }

        // ── Foreground app blocking ──
        if (event.getEventType() != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return;

        // Always exempt our own app and core OS
        if (pkg.equals(getPackageName())) return;
        if (ALWAYS_EXEMPT.contains(pkg)) return;

        // Always allow known launchers (home screen)
        if (KNOWN_LAUNCHERS.contains(pkg)) return;

        // Always allow Camera, Gallery, and File pickers so user can submit homework
        if (MEDIA_AND_FILE_EXEMPT.contains(pkg) || dynamicExemptPackages.contains(pkg)) return;

        // Check against user-defined whitelist
        Set<String> whitelist = prefs.getStringSet("whitelist", new HashSet<>());
        if (whitelist.contains(pkg)) return;

        // ── Blocked: send user to Home screen ──
        Log.d(TAG, "Blocked: " + pkg + " — sending to Home");
        goHome();
    }

    /**
     * Sends the user to the Home screen instead of forcing them back into UNCODE.
     * This is the correct behaviour: UNCODE is not a kiosk, just a selective blocker.
     */
    private void goHome() {
        try {
            performGlobalAction(GLOBAL_ACTION_HOME);
        } catch (Exception e) {
            Log.e(TAG, "goHome failed: " + e.getMessage());
        }
    }

    /**
     * Handles SystemUI events.
     * - Allows the notification shade to be pulled down.
     * - Collapses the Quick Settings (QS) tile panel immediately when expanded.
     * - Detects when UNCODE is swiped from recents and re-launches it.
     */
    private void handleSystemUiEvent(AccessibilityEvent event) {
        CharSequence classNameChar = event.getClassName();
        if (classNameChar == null) return;
        String cls = classNameChar.toString().toLowerCase();

        // Collapse QS tile panel (but allow the plain notification shade)
        if (cls.contains("qs")
                || cls.contains("quicksetting")
                || cls.contains("brightnesscontroller")
                || cls.contains("tilerecord")
                || cls.contains("quickstatusbar")) {
            collapseQsPanel();
        }

        // Detect if the user is in the recents overview and UNCODE is not there anymore.
        // Re-launch UNCODE to make it re-appear and prevent it from being cleared.
        if (cls.contains("recent") || cls.contains("overview") || cls.contains("taskview")) {
            ensureUncodeInRecents();
        }
    }

    /**
     * If UNCODE was swiped away from recents, re-launch it in the background
     * so it reappears in the recents stack.
     */
    private void ensureUncodeInRecents() {
        try {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK |
                Intent.FLAG_ACTIVITY_REORDER_TO_FRONT |
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            );
            startActivity(intent);
        } catch (Exception e) {
            Log.e(TAG, "ensureUncodeInRecents failed: " + e.getMessage());
        }
    }

    private void collapseQsPanel() {
        try {
            Object statusBarService = getSystemService("statusbar");
            if (statusBarService != null) {
                Method collapseMethod = statusBarService.getClass().getMethod("collapsePanels");
                collapseMethod.setAccessible(true);
                collapseMethod.invoke(statusBarService);
                return;
            }
        } catch (Exception e) {
            Log.w(TAG, "StatusBarManager reflection failed: " + e.getMessage());
        }
        // Fallback
        try {
            performGlobalAction(GLOBAL_ACTION_BACK);
        } catch (Exception e) {
            Log.e(TAG, "Fallback collapse failed: " + e.getMessage());
        }
    }

    @Override
    public void onInterrupt() {
        // Required override
    }
}
