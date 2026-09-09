package com.uncode.app

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.app.StatusBarManager
import android.content.Context
import android.content.SharedPreferences
import android.view.accessibility.AccessibilityEvent

class LockAccessibilityService : AccessibilityService() {

    private lateinit var prefs: SharedPreferences

    override fun onServiceConnected() {
        super.onServiceConnected()
        prefs = getSharedPreferences("uncode_lock", Context.MODE_PRIVATE)

        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS
            notificationTimeout = 100
        }
        serviceInfo = info
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val isLockdownActive = prefs.getBoolean("lockdown_active", false)
        if (!isLockdownActive) return

        val pkg = event.packageName?.toString() ?: return

        // Intercept Quick Settings panel expansion (SystemUI)
        // The notification shade itself is allowed — only the QS tile area is blocked
        if (pkg == "com.android.systemui") {
            val className = event.className?.toString() ?: return
            // QS panel class names vary by ROM but generally contain "qs" or "QuickSettings"
            if (className.contains("qs", ignoreCase = true) ||
                className.contains("QuickSettings", ignoreCase = true) ||
                className.contains("BrightnessController", ignoreCase = true)
            ) {
                // Collapse QS back to notification shade
                try {
                    val statusBarService = getSystemService(STATUSBAR_SERVICE)
                    val collapseMethod = statusBarService?.javaClass?.getMethod("collapsePanels")
                    collapseMethod?.isAccessible = true
                    collapseMethod?.invoke(statusBarService)
                } catch (e: Exception) {
                    // Fallback: use the public API if available (Android 12+ requires EXPAND_STATUS_BAR permission)
                    try {
                        performGlobalAction(GLOBAL_ACTION_BACK)
                    } catch (e2: Exception) {
                        // Ignored
                    }
                }
            }
        }
    }

    override fun onInterrupt() {
        // Required override
    }
}
