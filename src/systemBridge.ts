export const getInstalledApps = async (): Promise<any[]> => {
  if (window.systemLockAPI && window.systemLockAPI.getInstalledApps) {
    try {
      return await window.systemLockAPI.getInstalledApps();
    } catch (e) {
      console.error("Failed to fetch native apps", e);
      return [];
    }
  }
  return [];
};

export const startLockdown = (allowedAppIds: string[]) => {
  if (window.systemLockAPI && window.systemLockAPI.startLockdown) {
    console.log("Triggering native OS lockdown with apps:", allowedAppIds);
    window.systemLockAPI.startLockdown(allowedAppIds);
  } else {
    console.log("Simulating lockdown. Browser environment cannot lock OS.");
  }
};

export const endLockdown = () => {
  if (window.systemLockAPI && window.systemLockAPI.endLockdown) {
    console.log("Releasing native OS lockdown.");
    window.systemLockAPI.endLockdown();
  } else {
    console.log("Simulating lockdown release.");
  }
};
