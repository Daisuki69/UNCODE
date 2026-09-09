package com.uncode.app;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.Log;
import java.io.ByteArrayOutputStream;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONException;

import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.annotation.ActivityCallback;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.io.InputStream;

@CapacitorPlugin(name = "LockPlugin")
public class LockPlugin extends Plugin {

    private static final String TAG = "LockPlugin";
    private static final String PREFS_NAME = "uncode_lock";
    private DevicePolicyManager dpm;
    private ComponentName adminComponent;
    private SharedPreferences prefs;

    @Override
    public void load() {
        dpm = (DevicePolicyManager) getActivity().getSystemService(Context.DEVICE_POLICY_SERVICE);
        adminComponent = new ComponentName(getActivity(), AdminReceiver.class);
        prefs = getActivity().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    @PluginMethod
    public void startLockdown(PluginCall call) {
        try {
            JSArray allowedAppIds = call.getArray("allowedAppIds");

            Set<String> whitelist = new HashSet<>();
            whitelist.add(getActivity().getPackageName()); // Always allow UNCODE itself
            if (allowedAppIds != null) {
                for (int i = 0; i < allowedAppIds.length(); i++) {
                    whitelist.add(allowedAppIds.getString(i));
                }
            }

            // Save whitelist for AccessibilityService
            prefs.edit()
                    .putStringSet("whitelist", whitelist)
                    .putBoolean("lockdown_active", true)
                    .apply();

            // If Device Owner: protect UNCODE from force-stop and uninstall
            if (dpm.isDeviceOwnerApp(getActivity().getPackageName())) {
                // Block uninstall while lockdown is active
                dpm.setUninstallBlocked(adminComponent, getActivity().getPackageName(), true);
                Log.i(TAG, "Lockdown active as Device Owner — uninstall blocked");
            }

            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "startLockdown failed", e);
            call.reject("startLockdown failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void endLockdown(PluginCall call) {
        try {
            prefs.edit()
                    .putBoolean("lockdown_active", false)
                    .putStringSet("whitelist", new HashSet<>())
                    .apply();

            // If Device Owner: re-allow uninstall when lockdown ends
            if (dpm.isDeviceOwnerApp(getActivity().getPackageName())) {
                dpm.setUninstallBlocked(adminComponent, getActivity().getPackageName(), false);
                Log.i(TAG, "Lockdown ended — uninstall re-enabled");
            }

            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "endLockdown failed", e);
            call.reject("endLockdown failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        try {
            PackageManager pm = getActivity().getPackageManager();
            List<ApplicationInfo> installedApps = pm.getInstalledApplications(PackageManager.GET_META_DATA);

            JSArray apps = new JSArray();
            for (ApplicationInfo info : installedApps) {
                boolean isSystemApp = (info.flags & ApplicationInfo.FLAG_SYSTEM) != 0;
                if (!isSystemApp && !info.packageName.equals(getActivity().getPackageName())) {
                    JSObject app = new JSObject();
                    app.put("id", info.packageName);
                    app.put("name", pm.getApplicationLabel(info).toString());
                    app.put("iconName", "LayoutGrid"); // Fallback for web UI
                    
                    try {
                        Drawable icon = pm.getApplicationIcon(info);
                        String base64Icon = getBase64Icon(icon);
                        if (base64Icon != null) {
                            app.put("iconBase64", base64Icon);
                        }
                    } catch (Exception ignore) {}

                    apps.put(app);
                }
            }

            JSObject result = new JSObject();
            result.put("apps", apps);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "getInstalledApps failed", e);
            call.reject("getInstalledApps failed: " + e.getMessage());
        }
    }

    private String getBase64Icon(Drawable icon) {
        try {
            int width = Math.max(icon.getIntrinsicWidth(), 1);
            int height = Math.max(icon.getIntrinsicHeight(), 1);
            // Limit size to prevent memory issues with high-res icons
            if (width > 256 || height > 256) {
                width = 128;
                height = 128;
            }
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(bitmap);
            icon.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
            icon.draw(canvas);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 80, outputStream);
            return Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP);
        } catch (Exception e) {
            return null;
        }
    }
    @PluginMethod
    public void checkPermissions(PluginCall call) {
        JSObject result = new JSObject();
        result.put("isDeviceOwner", dpm.isDeviceOwnerApp(getActivity().getPackageName()));
        result.put("isAdminActive", dpm.isAdminActive(adminComponent));
        
        boolean accessibilityEnabled = false;
        try {
            int enabled = android.provider.Settings.Secure.getInt(
                getActivity().getContentResolver(),
                android.provider.Settings.Secure.ACCESSIBILITY_ENABLED, 0);
            if (enabled == 1) {
                String services = android.provider.Settings.Secure.getString(
                    getActivity().getContentResolver(),
                    android.provider.Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
                if (services != null) {
                    String pkg = getActivity().getPackageName();
                    // Android stores services as "com.pkg/com.pkg.ServiceClass" or "com.pkg/.ServiceClass"
                    // Check for both formats
                    if (services.contains(pkg + "/") || services.contains("LockAccessibilityService")) {
                        accessibilityEnabled = true;
                    }
                }
            }
        } catch (Exception e) {}
        
        result.put("isAccessibilityEnabled", accessibilityEnabled);

        boolean isBatteryIgnored = false;
        try {
            android.os.PowerManager pm = (android.os.PowerManager) getActivity().getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                isBatteryIgnored = pm.isIgnoringBatteryOptimizations(getActivity().getPackageName());
            }
        } catch (Exception e) {}
        result.put("isBatteryOptimizationIgnored", isBatteryIgnored);

        boolean isNotificationGranted = true;
        try {
            if (android.os.Build.VERSION.SDK_INT >= 33) {
                isNotificationGranted = androidx.core.content.ContextCompat.checkSelfPermission(
                    getActivity(), android.Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
            } else {
                isNotificationGranted = androidx.core.app.NotificationManagerCompat.from(getActivity()).areNotificationsEnabled();
            }
        } catch (Exception e) {}
        result.put("isNotificationGranted", isNotificationGranted);

        call.resolve(result);
    }

    @PluginMethod
    public void requestBatteryOptimization(PluginCall call) {
        try {
            android.os.PowerManager pm = (android.os.PowerManager) getActivity().getSystemService(Context.POWER_SERVICE);
            if (pm != null && !pm.isIgnoringBatteryOptimizations(getActivity().getPackageName())) {
                Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + getActivity().getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getActivity().startActivity(intent);
            }
            call.resolve();
        } catch (Exception e) {
            try {
                Intent fallback = new Intent(android.provider.Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getActivity().startActivity(fallback);
                call.resolve();
            } catch (Exception ex) {
                Log.e(TAG, "Failed to request battery optimization", ex);
                call.reject("Failed to request battery optimization: " + ex.getMessage());
            }
        }
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        try {
            if (android.os.Build.VERSION.SDK_INT >= 33) {
                if (androidx.core.content.ContextCompat.checkSelfPermission(
                    getActivity(), android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    androidx.core.app.ActivityCompat.requestPermissions(
                        getActivity(), new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 1003);
                }
            } else {
                Intent intent = new Intent(android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                intent.putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, getActivity().getPackageName());
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getActivity().startActivity(intent);
            }
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "Failed to request notification permission", e);
            call.reject("Failed to request notification permission: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void openAccessibilitySettings(PluginCall call) {
        android.content.Intent intent = new android.content.Intent(android.provider.Settings.ACTION_ACCESSIBILITY_SETTINGS);
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        getActivity().startActivity(intent);
        call.resolve();
    }

    @PluginMethod
    public void openAppInfo(PluginCall call) {
        try {
            Intent intent = new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(android.net.Uri.parse("package:" + getActivity().getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "Failed to open app info", e);
            call.reject("Failed to open app info: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openDeviceAdminSettings(PluginCall call) {
        try {
            Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent);
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                "Activate UNCODE as Device Administrator to prevent uninstallation during lockdown.");
            startActivityForResult(call, intent, "deviceAdminResult");
        } catch (Exception e) {
            Log.e(TAG, "Direct ADD_DEVICE_ADMIN failed, opening settings list", e);
            openDeviceAdminListFallback(call);
        }
    }

    @PluginMethod
    public void openDeviceAdminList(PluginCall call) {
        openDeviceAdminListFallback(call);
    }

    private void openDeviceAdminListFallback(PluginCall call) {
        try {
            Intent intent = new Intent("android.settings.DEVICE_ADMIN_SETTINGS");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e1) {
            try {
                Intent fallback = new Intent(android.provider.Settings.ACTION_SECURITY_SETTINGS);
                fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getActivity().startActivity(fallback);
                call.resolve();
            } catch (Exception ex) {
                Log.e(TAG, "Failed to open device admin settings", ex);
                call.reject("Failed to open device admin settings: " + ex.getMessage());
            }
        }
    }

    @ActivityCallback
    private void deviceAdminResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        boolean isAdmin = dpm.isAdminActive(adminComponent);
        JSObject ret = new JSObject();
        ret.put("isAdminActive", isAdmin);
        call.resolve(ret);
    }

    @PluginMethod
    public void exportBackup(PluginCall call) {
        String tempFileName = call.getString("tempFileName");
        String defaultName = call.getString("defaultName", "backup.json");

        if (tempFileName == null) {
            call.reject("Must provide tempFileName");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, defaultName);

        startActivityForResult(call, intent, "exportBackupResult");
    }

    @ActivityCallback
    private void exportBackupResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() == android.app.Activity.RESULT_OK) {
            Intent data = result.getData();
            if (data != null && data.getData() != null) {
                Uri uri = data.getData();
                String tempFileName = call.getString("tempFileName");
                
                try {
                    File cacheDir = getContext().getCacheDir();
                    File tempFile = new File(cacheDir, tempFileName);
                    
                    if (!tempFile.exists()) {
                        call.reject("Temp file not found");
                        return;
                    }
                    
                    InputStream in = new FileInputStream(tempFile);
                    OutputStream out = getContext().getContentResolver().openOutputStream(uri);
                    
                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = in.read(buffer)) != -1) {
                        out.write(buffer, 0, read);
                    }
                    
                    in.close();
                    if (out != null) {
                        out.flush();
                        out.close();
                    }
                    
                    tempFile.delete();
                    
                    call.resolve();
                } catch (Exception e) {
                    call.reject("Failed to copy file", e);
                }
            } else {
                call.reject("No URI returned");
            }
        } else {
            call.reject("User canceled");
        }
    }
}
