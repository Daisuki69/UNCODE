package com.uncode.app;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.provider.MediaStore;
import android.provider.Settings;
import android.net.Uri;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.inputmethod.InputMethodManager;
import android.view.inputmethod.InputMethodInfo;

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

    /**
     * Known Music & Audio player packages that are hardcoded to be allowed during lock.
     */
    private static final Set<String> KNOWN_MUSIC_APPS = new HashSet<>(Arrays.asList(
        "com.spotify.music",
        "com.google.android.apps.youtube.music",
        "com.apple.android.music",
        "com.amazon.mp3",
        "com.aspiro.tidal",
        "deezer.android.app",
        "com.soundcloud.android",
        "com.sec.android.app.music",
        "com.miui.player",
        "com.android.music",
        "com.oppo.music",
        "com.vivo.musicplayer"
    ));

    /**
     * Common OEM and popular third-party keyboard packages (Input Method Editors).
     * These are permanently hardcoded as exempt to prevent the device from bricking during typing.
     */
    private static final Set<String> KNOWN_KEYBOARDS = new HashSet<>(Arrays.asList(
        "com.google.android.inputmethod.latin", // Gboard
        "com.samsung.android.honeyboard",       // Samsung Keyboard
        "com.touchtype.swiftkey",              // Microsoft SwiftKey
        "com.touchtype.swiftkey.beta",
        "com.android.inputmethod.latin",        // AOSP Keyboard
        "com.miui.voiceassist",
        "com.sohu.inputmethod.sogou.xiaomi",
        "com.huawei.ohos.inputmethod",
        "com.oppo.keyboard",
        "com.coloros.keyboard",
        "com.vivo.keyboard",
        "com.syntellia.fleksy.keyboard",
        "org.pocketworkstation.pckeyboard",
        "org.dslul.openboard.inputmethod.latin",
        "com.menny.android.anysoftkeyboard",
        "com.grammarly.android.keyboard",
        "com.baidu.input",
        "com.sohu.inputmethod.sogou",
        "com.google.android.tts"                // Google Speech Services / Voice Typing IME
    ));

    /**
     * Known 2FA Authenticator application package IDs.
     * Always exempt natively so students can sign into school portals and 2FA accounts.
     */
    private static final Set<String> KNOWN_AUTHENTICATORS = new HashSet<>(Arrays.asList(
        "com.google.android.apps.authenticator2",
        "com.azure.authenticator",
        "com.duosecurity.duomobile",
        "com.authy.authy",
        "com.twofasapp",
        "com.beemdevelopment.aegis",
        "com.bitwarden.authenticator",
        "com.lastpass.authenticator",
        "org.fedorahosted.freeotp",
        "com.yubico.yubioath"
    ));

    /**
     * Known Notes & Productivity applications permanently allowed to prevent procrastination
     * while enabling students to take notes, study, and complete homework.
     */
    private static final Set<String> KNOWN_NOTES_APPS = new HashSet<>(Arrays.asList(
        "com.google.android.keep",
        "com.samsung.android.app.notes",
        "com.microsoft.office.onenote",
        "notion.id",
        "md.obsidian",
        "com.evernote",
        "com.socialnmobile.dictapps.notepad.color.note",
        "com.zoho.notebook",
        "com.automattic.simplenote",
        "com.steadfastinnovation.android.furret",
        "com.nebula.notes",
        "com.colornote.notepad",
        "com.acadoid.lecturenotes"
    ));

    /**
     * Known Student, Coursework & Educational applications permanently allowed.
     */
    private static final Set<String> KNOWN_STUDENT_APPS = new HashSet<>(Arrays.asList(
        "com.google.android.apps.classroom",
        "com.google.android.apps.docs",
        "com.google.android.apps.docs.editors.docs",
        "com.google.android.apps.docs.editors.sheets",
        "com.google.android.apps.docs.editors.slides",
        "com.instructure.candroid",
        "com.blackboard.android.bbmatx",
        "com.schoology.app",
        "com.quizlet.quizletandroid",
        "com.ichi2.anki",
        "com.microblink.photomath",
        "com.desmos.calculator",
        "org.geogebra.android",
        "com.wolfram.android.alpha",
        "com.microsoft.office.officehubrow",
        "com.microsoft.office.word",
        "com.microsoft.office.excel",
        "com.microsoft.office.powerpoint"
    ));

    /**
     * Known AI Assistants & Research tools permanently allowed for study assistance.
     */
    private static final Set<String> KNOWN_AI_APPS = new HashSet<>(Arrays.asList(
        "com.google.android.apps.bard",
        "com.openai.chatgpt",
        "com.anthropic.claude",
        "com.microsoft.copilot",
        "ai.perplexity.app.android",
        "com.deepseek.chat",
        "com.quora.poe.android",
        "ai.inflection.pi"
    ));

    private final Set<String> dynamicExemptPackages = new HashSet<>();
    private final Set<String> dynamicKeyboardPackages = new HashSet<>();
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

            // Web browser handlers (always hardcoded to be allowed during lockdown)
            try {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com"));
                browserIntent.addCategory(Intent.CATEGORY_BROWSABLE);
                List<ResolveInfo> browserApps = pm.queryIntentActivities(browserIntent, 0);
                for (ResolveInfo info : browserApps) {
                    if (info.activityInfo != null && info.activityInfo.packageName != null) {
                        String bPkg = info.activityInfo.packageName;
                        if (!BlacklistConstants.isBlacklisted(bPkg)) {
                            dynamicExemptPackages.add(bPkg);
                        }
                    }
                }
            } catch (Exception ignore) {}

            // Music / Audio player category handlers
            try {
                Intent musicIntent = new Intent(Intent.ACTION_MAIN);
                musicIntent.addCategory(Intent.CATEGORY_APP_MUSIC);
                List<ResolveInfo> musicApps = pm.queryIntentActivities(musicIntent, 0);
                for (ResolveInfo info : musicApps) {
                    if (info.activityInfo != null && info.activityInfo.packageName != null) {
                        String mPkg = info.activityInfo.packageName;
                        if (!BlacklistConstants.isBlacklisted(mPkg)) {
                            dynamicExemptPackages.add(mPkg);
                        }
                    }
                }
            } catch (Exception ignore) {}

            // ── Input Method Editors (Keyboards) handlers ──
            try {
                // Query active/default IME from Settings
                String defaultIme = Settings.Secure.getString(getContentResolver(), Settings.Secure.DEFAULT_INPUT_METHOD);
                if (defaultIme != null && defaultIme.contains("/")) {
                    String defaultImePkg = defaultIme.split("/")[0];
                    dynamicKeyboardPackages.add(defaultImePkg);
                }

                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                if (imm != null) {
                    List<InputMethodInfo> imis = imm.getInputMethodList();
                    if (imis != null) {
                        for (InputMethodInfo imi : imis) {
                            if (imi != null && imi.getPackageName() != null) {
                                dynamicKeyboardPackages.add(imi.getPackageName());
                            }
                        }
                    }
                    List<InputMethodInfo> enabledImis = imm.getEnabledInputMethodList();
                    if (enabledImis != null) {
                        for (InputMethodInfo imi : enabledImis) {
                            if (imi != null && imi.getPackageName() != null) {
                                dynamicKeyboardPackages.add(imi.getPackageName());
                            }
                        }
                    }
                }
            } catch (Exception ignore) {}

            // Add authenticators, notes, student apps, and AI assistants to dynamic exemptions
            dynamicExemptPackages.addAll(KNOWN_AUTHENTICATORS);
            dynamicExemptPackages.addAll(KNOWN_NOTES_APPS);
            dynamicExemptPackages.addAll(KNOWN_STUDENT_APPS);
            dynamicExemptPackages.addAll(KNOWN_AI_APPS);

            Log.d(TAG, "Discovered dynamic exempt packages: media=" + dynamicExemptPackages.size() + ", keyboards=" + dynamicKeyboardPackages.size());
        } catch (Exception e) {
            Log.w(TAG, "Error resolving dynamic media/keyboard packages: " + e.getMessage());
        }
    }

    private boolean isAuthenticatorApp(String pkg) {
        if (pkg == null) return false;
        if (KNOWN_AUTHENTICATORS.contains(pkg)) return true;
        String lower = pkg.toLowerCase();
        return lower.contains("authenticator") || lower.contains("twofas") || lower.contains("duomobile") || lower.contains("yubioath");
    }

    private boolean isNotesApp(String pkg) {
        if (pkg == null) return false;
        if (KNOWN_NOTES_APPS.contains(pkg)) return true;
        String lower = pkg.toLowerCase();
        return lower.contains("keep") || 
               lower.contains("onenote") || 
               lower.contains("obsidian") || 
               lower.contains("notion") || 
               lower.contains("notepad") || 
               lower.contains(".notes") || 
               lower.contains("memo") || 
               lower.contains("simplenote") || 
               lower.contains("colornote");
    }

    private boolean isStudentApp(String pkg) {
        if (pkg == null) return false;
        if (KNOWN_STUDENT_APPS.contains(pkg)) return true;
        String lower = pkg.toLowerCase();
        return lower.contains("classroom") || 
               lower.contains("canvas") || 
               lower.contains("blackboard") || 
               lower.contains("schoology") || 
               lower.contains("quizlet") || 
               lower.contains("anki") || 
               lower.contains("desmos") || 
               lower.contains("geogebra") || 
               lower.contains("calculator") || 
               lower.contains("docs.editors") || 
               (lower.contains("google") && lower.contains("docs")) || 
               lower.contains("photomath") || 
               lower.contains("wolfram");
    }

    private boolean isAiApp(String pkg) {
        if (pkg == null) return false;
        if (KNOWN_AI_APPS.contains(pkg)) return true;
        String lower = pkg.toLowerCase();
        return lower.contains("chatgpt") || 
               lower.contains("bard") || 
               lower.contains("gemini") || 
               lower.contains("claude") || 
               lower.contains("copilot") || 
               lower.contains("perplexity") || 
               lower.contains("deepseek") || 
               lower.contains(".poe");
    }

    private boolean isKeyboardApp(String pkg) {
        if (pkg == null) return false;
        if (KNOWN_KEYBOARDS.contains(pkg) || dynamicKeyboardPackages.contains(pkg)) return true;
        String lower = pkg.toLowerCase();
        if (lower.contains("inputmethod") || 
            lower.contains("honeyboard") || 
            lower.contains("keyboard") || 
            lower.contains("gboard") || 
            lower.contains("swiftkey") || 
            lower.contains(".ime")) {
            return true;
        }
        try {
            String defaultIme = Settings.Secure.getString(getContentResolver(), Settings.Secure.DEFAULT_INPUT_METHOD);
            if (defaultIme != null && defaultIme.startsWith(pkg + "/")) {
                dynamicKeyboardPackages.add(pkg);
                return true;
            }
        } catch (Exception ignore) {}
        return false;
    }

    private boolean isHiddenInfrastructureApp(String pkg) {
        if (pkg == null) return false;
        String lower = pkg.toLowerCase();
        return lower.contains("cameraextension") ||
               lower.contains("extensionproxy") ||
               lower.contains("lenslauncher") ||
               lower.contains("aperturelenslauncher") ||
               lower.contains("opensourcemusicplayer") ||
               lower.contains("androidopensourcemusicplayer");
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

        // Always exempt our own app, core OS, soft keyboards, authenticators, notes, student apps, AI tools, and internal camera/music infrastructure
        if (pkg.equals(getPackageName())) return;
        if (ALWAYS_EXEMPT.contains(pkg)) return;
        if (isKeyboardApp(pkg)) return;
        if (isAuthenticatorApp(pkg)) return;
        if (isNotesApp(pkg)) return;
        if (isStudentApp(pkg)) return;
        if (isAiApp(pkg)) return;
        if (isHiddenInfrastructureApp(pkg)) return;

        // ── Hardcoded Distraction Blacklist Check (Strictly Takes Precedence) ──
        if (BlacklistConstants.isBlacklisted(pkg)) {
            Log.w(TAG, "Blocked hardcoded distracting app: " + pkg + " — sending to Home");
            goHome();
            return;
        }

        // Always allow known launchers (home screen)
        if (KNOWN_LAUNCHERS.contains(pkg)) return;

        // Always allow Camera, Gallery, File pickers, Web Browsers, Music Players, Authenticators, Notes, Student apps, AI
        if (MEDIA_AND_FILE_EXEMPT.contains(pkg) || dynamicExemptPackages.contains(pkg) || KNOWN_MUSIC_APPS.contains(pkg) || isAuthenticatorApp(pkg) || isNotesApp(pkg) || isStudentApp(pkg) || isAiApp(pkg)) return;

        // Check against user-defined whitelist (including auto-whitelisted messaging apps)
        Set<String> whitelist = prefs.getStringSet("whitelist", new HashSet<>());
        if (whitelist.contains(pkg)) return;

        // ── Blocked: send user to Home screen ──
        Log.d(TAG, "Blocked: " + pkg + " — sending to Home");
        goHome();
    }

    /**
     * Sends the user to the Home screen instead of forcing them back into QIEZKA.
     * This is the correct behaviour: QIEZKA is not a kiosk, just a selective blocker.
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
     * - Detects when QIEZKA is swiped from recents and re-launches it.
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

        // Detect if the user is in the recents overview and QIEZKA is not there anymore.
        // Re-launch QIEZKA to make it re-appear and prevent it from being cleared.
        if (cls.contains("recent") || cls.contains("overview") || cls.contains("taskview")) {
            ensureUncodeInRecents();
        }
    }

    /**
     * If QIEZKA was swiped away from recents, re-launch it in the background
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
