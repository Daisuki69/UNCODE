import { registerPlugin } from '@capacitor/core';

interface LockPluginInterface {
  startLockdown(options: { allowedAppIds: string[] }): Promise<void>;
  endLockdown(): Promise<void>;
  getInstalledApps(): Promise<{ apps: Array<{ id: string; name: string; iconName: string }> }>;
  checkPermissions(): Promise<{
    isDeviceOwner: boolean;
    isAccessibilityEnabled: boolean;
    isAdminActive: boolean;
    isBatteryOptimizationIgnored: boolean;
    isNotificationGranted: boolean;
  }>;
  openAccessibilitySettings(): Promise<void>;
  openDeviceAdminSettings(): Promise<void>;
  openDeviceAdminList(): Promise<void>;
  openAppInfo(): Promise<void>;
  requestBatteryOptimization(): Promise<void>;
  requestNotificationPermission(): Promise<void>;
  exportBackup(options: { tempFileName: string; defaultName: string }): Promise<void>;
}

// Register the native plugin - falls back gracefully in browser/dev mode
const LockPlugin = registerPlugin<LockPluginInterface>('LockPlugin', {
  web: {
    startLockdown: async (opts: { allowedAppIds: string[] }) => {
      console.log('[Dev] Simulating lockdown with:', opts.allowedAppIds);
    },
    endLockdown: async () => {
      console.log('[Dev] Simulating lockdown release');
    },
    getInstalledApps: async () => ({ apps: [] }),
    checkPermissions: async () => ({
      isDeviceOwner: true,
      isAccessibilityEnabled: true,
      isAdminActive: true,
      isBatteryOptimizationIgnored: true,
      isNotificationGranted: true,
      isAdbInstall: true,
      installSource: 'ADB (PC Script / USB)',
    }), // Mock true for web dev
    openAccessibilitySettings: async () => console.log('[Dev] Opening Accessibility Settings'),
    openDeviceAdminSettings: async () => console.log('[Dev] Opening Device Admin Settings'),
    openDeviceAdminList: async () => console.log('[Dev] Opening Device Admin List'),
    openAppInfo: async () => console.log('[Dev] Opening App Info'),
    requestBatteryOptimization: async () => console.log('[Dev] Requesting Battery Optimization'),
    requestNotificationPermission: async () => console.log('[Dev] Requesting Notification Permission'),
    exportBackup: async (opts: { tempFileName: string; defaultName: string }) => console.log('[Dev] Exporting backup', opts),
  },
});

export const getInstalledApps = async (): Promise<Array<{ id: string; name: string; iconName: string }>> => {
  try {
    const result = await LockPlugin.getInstalledApps();
    return result.apps || [];
  } catch (e) {
    console.error('Failed to fetch native apps', e);
    return [];
  }
};

export const checkPermissions = async (): Promise<{
  isDeviceOwner: boolean;
  isAccessibilityEnabled: boolean;
  isAdminActive: boolean;
  isBatteryOptimizationIgnored: boolean;
  isNotificationGranted: boolean;
  isAdbInstall?: boolean;
  installSource?: string;
}> => {
  try {
    return await LockPlugin.checkPermissions();
  } catch (e) {
    console.error('Failed to check permissions', e);
    return {
      isDeviceOwner: false,
      isAccessibilityEnabled: false,
      isAdminActive: false,
      isBatteryOptimizationIgnored: false,
      isNotificationGranted: false,
      isAdbInstall: false,
      installSource: 'Unknown',
    };
  }
};

export const openAccessibilitySettings = async (): Promise<void> => {
  try {
    await LockPlugin.openAccessibilitySettings();
  } catch (e) {
    console.error('Failed to open settings', e);
  }
};

export const openDeviceAdminSettings = async (): Promise<void> => {
  try {
    await LockPlugin.openDeviceAdminSettings();
  } catch (e) {
    console.error('Failed to open device admin settings', e);
  }
};

export const openDeviceAdminList = async (): Promise<void> => {
  try {
    await LockPlugin.openDeviceAdminList();
  } catch (e) {
    console.error('Failed to open device admin list', e);
  }
};

export const openAppInfo = async (): Promise<void> => {
  try {
    await LockPlugin.openAppInfo();
  } catch (e) {
    console.error('Failed to open app info', e);
  }
};

export const requestBatteryOptimization = async (): Promise<void> => {
  try {
    await LockPlugin.requestBatteryOptimization();
  } catch (e) {
    console.error('Failed to request battery optimization', e);
  }
};

export const requestNotificationPermission = async (): Promise<void> => {
  try {
    await LockPlugin.requestNotificationPermission();
  } catch (e) {
    console.error('Failed to request notification permission', e);
  }
};

export const startLockdown = (allowedAppIds: string[]) => {
  LockPlugin.startLockdown({ allowedAppIds }).catch(e => {
    console.error('startLockdown failed', e);
  });
};

export const endLockdown = () => {
  LockPlugin.endLockdown().catch(e => {
    console.error('endLockdown failed', e);
  });
};

export const exportBackup = async (tempFileName: string, defaultName: string): Promise<void> => {
  await LockPlugin.exportBackup({ tempFileName, defaultName });
};
