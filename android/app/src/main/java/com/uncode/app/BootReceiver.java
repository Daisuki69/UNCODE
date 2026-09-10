package com.uncode.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

public class BootReceiver extends BroadcastReceiver {

    private static final String TAG = "BootReceiver";
    private static final String PREFS_NAME = "uncode_lock";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) return;

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        
        // 1. Reschedule all background schedule alarms & warning triggers
        ScheduleManager.rescheduleAll(context);

        // 2. Check lockdown status
        boolean lockdownWasActive = prefs.getBoolean("lockdown_active", false);
        long lockEndTime = prefs.getLong("lock_end_time", 0L);

        if (lockdownWasActive) {
            long now = System.currentTimeMillis();
            if (lockEndTime > 0 && now >= lockEndTime) {
                // Lock expired while device was powered off
                Log.i(TAG, "Boot detected: lockdown already expired while powered off — releasing");
                prefs.edit()
                        .putBoolean("lockdown_active", false)
                        .remove("lock_end_time")
                        .remove("active_schedule_id")
                        .apply();
            } else {
                Log.i(TAG, "Boot detected with active lockdown — rescheduling lock end and relaunching QIEZKA");
                if (lockEndTime > 0) {
                    AlarmReceiver.scheduleLockEndAlarm(context, lockEndTime, prefs.getString("active_schedule_id", ""));
                }
                Intent launch = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
                if (launch == null) {
                    launch = new Intent().setClassName(context.getPackageName(), "com.uncode.app.MainActivity");
                }
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                context.startActivity(launch);
            }
        }
    }
}
