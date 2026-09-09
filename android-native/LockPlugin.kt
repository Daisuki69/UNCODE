package com.uncode.app

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "LockPlugin")
class LockPlugin : Plugin() {

    private lateinit var dpm: DevicePolicyManager
    private lateinit var adminComponent: ComponentName
    private lateinit var prefs: android.content.SharedPreferences

    override fun load() {
        dpm = activity.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        adminComponent = ComponentName(activity, AdminReceiver::class.java)
        prefs = activity.getSharedPreferences("uncode_lock", Context.MODE_PRIVATE)
    }

    @PluginMethod
    fun startLockdown(call: PluginCall) {
        try {
            val allowedAppIds = call.getArray("allowedAppIds")
            val whitelist = mutableSetOf<String>()
            // Always allow our own app
            whitelist.add(activity.packageName)
            for (i in 0 until allowedAppIds.length()) {
                whitelist.add(allowedAppIds.getString(i))
            }

            // Save whitelist to SharedPreferences for AccessibilityService to read
            prefs.edit()
                .putStringSet("whitelist", whitelist)
                .putBoolean("lockdown_active", true)
                .apply()

            // Suspend all non-whitelisted user packages
            if (dpm.isDeviceOwnerApp(activity.packageName)) {
                val allPackages = activity.packageManager
                    .getInstalledApplications(PackageManager.GET_META_DATA)
                    .filter { (it.flags and ApplicationInfo.FLAG_SYSTEM) == 0 }
                    .map { it.packageName }
                    .filter { it !in whitelist }
                    .toTypedArray()

                dpm.setPackagesSuspended(adminComponent, allPackages, true)
            }

            // Pin the app (Task Lock / Screen Pinning)
            activity.startLockTask()

            call.resolve()
        } catch (e: Exception) {
            call.reject("startLockdown failed: ${e.message}")
        }
    }

    @PluginMethod
    fun endLockdown(call: PluginCall) {
        try {
            prefs.edit()
                .putBoolean("lockdown_active", false)
                .putStringSet("whitelist", emptySet())
                .apply()

            // Un-suspend all packages
            if (dpm.isDeviceOwnerApp(activity.packageName)) {
                val allPackages = activity.packageManager
                    .getInstalledApplications(PackageManager.GET_META_DATA)
                    .filter { (it.flags and ApplicationInfo.FLAG_SYSTEM) == 0 }
                    .map { it.packageName }
                    .toTypedArray()

                dpm.setPackagesSuspended(adminComponent, allPackages, false)
            }

            // Stop Task Lock
            activity.stopLockTask()

            call.resolve()
        } catch (e: Exception) {
            call.reject("endLockdown failed: ${e.message}")
        }
    }

    @PluginMethod
    fun getInstalledApps(call: PluginCall) {
        try {
            val pm = activity.packageManager
            val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
                .filter { (it.flags and ApplicationInfo.FLAG_SYSTEM) == 0 }
                .filter { it.packageName != activity.packageName }
                .map { info ->
                    JSObject().apply {
                        put("id", info.packageName)
                        put("name", pm.getApplicationLabel(info).toString())
                        put("iconName", "LayoutGrid") // Default icon name for the React UI
                    }
                }

            val result = JSObject()
            result.put("apps", JSArray(apps))
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("getInstalledApps failed: ${e.message}")
        }
    }
}
