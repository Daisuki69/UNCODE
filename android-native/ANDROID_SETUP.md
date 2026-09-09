# UNCODE — Android Manifest Additions

After `npx cap add android`, open:
`android/app/src/main/AndroidManifest.xml`

## Permissions to add inside `<manifest>`:

```xml
<!-- Network: Gemini API + OCR.space calls -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Camera: homework photo capture -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<!-- Task Lock (Screen Pinning) — no extra permission needed, just API call -->

<!-- QS panel collapse -->
<uses-permission android:name="android.permission.EXPAND_STATUS_BAR" />

<!-- Battery optimization exemption (prevent Android from killing UNCODE) -->
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
```

## Components to add inside `<application>`:

```xml
<!-- Device Admin Receiver (required for DevicePolicyManager APIs) -->
<receiver
    android:name=".AdminReceiver"
    android:permission="android.permission.BIND_DEVICE_ADMIN"
    android:exported="true">
    <meta-data
        android:name="android.app.device_admin"
        android:resource="@xml/device_admin_config" />
    <intent-filter>
        <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
    </intent-filter>
</receiver>

<!-- Accessibility Service (QS panel blocker) -->
<service
    android:name=".LockAccessibilityService"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
    android:exported="true">
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data
        android:name="android.accessibilityservice"
        android:resource="@xml/accessibility_config" />
</service>
```

## MainActivity.kt — Register the plugin:

Open `android/app/src/main/java/com/uncode/app/MainActivity.kt` and add:

```kotlin
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(LockPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
```

## Copy native source files:

Copy the following files from `android-native/` to:
`android/app/src/main/java/com/uncode/app/`

- `AdminReceiver.kt`
- `LockPlugin.kt`
- `LockAccessibilityService.kt`

Copy from `android-native/res/xml/` to:
`android/app/src/main/res/xml/`

- `device_admin_config.xml`
- `accessibility_config.xml`

Also add to `android/app/src/main/res/values/strings.xml`:
```xml
<string name="accessibility_service_description">UNCODE uses this service to block Quick Settings access during study lockdown sessions.</string>
```
