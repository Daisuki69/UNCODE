import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Settings, CheckCircle, Loader2, Terminal, ExternalLink, Copy, Check, ShieldCheck, Smartphone, Laptop, AlertTriangle, Info, ArrowRight, ListFilter, BatteryCharging, Bell } from 'lucide-react';
import { checkPermissions, openAccessibilitySettings, openDeviceAdminSettings, openDeviceAdminList, openAppInfo, requestBatteryOptimization, requestNotificationPermission } from '../systemBridge';

interface PermissionWalkthroughProps {
  onComplete: () => void;
}

export function PermissionWalkthrough({ onComplete }: PermissionWalkthroughProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'device' | 'pc'>('device');
  const [showRestrictedHelp, setShowRestrictedHelp] = useState(false);
  const [perms, setPerms] = useState<{
    isAccessibilityEnabled: boolean;
    isAdminActive: boolean;
    isDeviceOwner: boolean;
    isBatteryOptimizationIgnored: boolean;
    isNotificationGranted: boolean;
  }>({
    isAccessibilityEnabled: false,
    isAdminActive: false,
    isDeviceOwner: false,
    isBatteryOptimizationIgnored: false,
    isNotificationGranted: false,
  });

  const gitHubUrl = 'https://github.com/Daisuki69/uncode';

  const verifyPermissions = async () => {
    setIsChecking(true);
    const result = await checkPermissions();
    setPerms(result);
    setIsChecking(false);
  };

  useEffect(() => {
    verifyPermissions();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canProceed = perms.isAccessibilityEnabled || perms.isDeviceOwner;

  return (
    <div className="min-h-screen w-full bg-gray-950 flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 text-white text-center overflow-y-auto pb-24 pt-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl relative my-auto"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-t-3xl" />
        
        <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4 relative mt-2">
          {canProceed ? (
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-8 h-8 text-red-500" />
          )}
          {isChecking && (
            <div className="absolute inset-0 border-4 border-red-500/30 border-t-red-500 rounded-2xl animate-spin" />
          )}
        </div>
        
        <h2 className="text-2xl font-black mb-2 tracking-wide text-white uppercase">Setup Permissions</h2>
        
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Configure permissions to enforce lock sessions and protect against uninstallation.
        </p>

        {/* Permission Status Badges (2x2 Grid) */}
        <div className="w-full grid grid-cols-2 gap-2 mb-6">
          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${perms.isAccessibilityEnabled ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-gray-950 border-gray-800 text-gray-400'}`}>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 uppercase font-bold">App Blocking</span>
              <span className="font-bold">Accessibility</span>
            </div>
            {perms.isAccessibilityEnabled ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold"><Check className="w-4 h-4" /> Enabled</span>
            ) : (
              <span className="text-[10px] uppercase font-bold text-red-400">Required</span>
            )}
          </div>

          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${perms.isAdminActive ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-gray-950 border-gray-800 text-gray-400'}`}>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Uninstall Lock</span>
              <span className="font-bold">Device Admin</span>
            </div>
            {perms.isAdminActive ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold"><Check className="w-4 h-4" /> Active</span>
            ) : (
              <span className="text-[10px] uppercase font-bold text-amber-400">Recommended</span>
            )}
          </div>

          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${perms.isBatteryOptimizationIgnored ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-gray-950 border-gray-800 text-gray-400'}`}>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Background</span>
              <span className="font-bold">Battery Saver</span>
            </div>
            {perms.isBatteryOptimizationIgnored ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold"><Check className="w-4 h-4" /> Unrestricted</span>
            ) : (
              <span className="text-[10px] uppercase font-bold text-amber-400">Recommended</span>
            )}
          </div>

          <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${perms.isNotificationGranted ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-gray-950 border-gray-800 text-gray-400'}`}>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Lock Timers</span>
              <span className="font-bold">Notifications</span>
            </div>
            {perms.isNotificationGranted ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold"><Check className="w-4 h-4" /> Allowed</span>
            ) : (
              <span className="text-[10px] uppercase font-bold text-amber-400">Recommended</span>
            )}
          </div>
        </div>

        {/* Method Tabs */}
        <div className="w-full flex bg-gray-950 p-1 rounded-xl border border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('device')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'device' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span>On Device</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pc')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'pc' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <Laptop className="w-4 h-4" />
            <span>PC Script (qiezka.bat)</span>
          </button>
        </div>

        {activeTab === 'device' ? (
          <div className="w-full flex flex-col gap-4 mb-6">
            {/* Restricted Settings Notice (Android 13+) */}
            <div className="bg-amber-950/25 border border-amber-800/50 rounded-2xl p-4 text-left transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>"Restricted setting" or button won't open?</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowRestrictedHelp(!showRestrictedHelp)} 
                  className="text-[11px] text-amber-400 hover:text-amber-200 font-semibold underline underline-offset-2 ml-2 shrink-0"
                >
                  {showRestrictedHelp ? 'Hide' : 'Show Fix'}
                </button>
              </div>

              {showRestrictedHelp && (
                <div className="mt-3 pt-3 border-t border-amber-900/40 text-xs text-gray-300 flex flex-col gap-2.5">
                  <p className="leading-relaxed text-gray-300">
                    Android 13+ blocks sideloaded apps from toggling Accessibility & Admin until you allow it once:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 bg-black/40 p-3.5 rounded-xl border border-amber-900/30">
                    <li>
                      First, tap <strong className="text-white">Step 1</strong> or <strong className="text-white">Step 2</strong> below once so Android triggers the restriction denial.
                      <span className="block text-[11px] text-amber-400/90 mt-0.5 ml-4">
                        * The 3 dots menu in App Info only appears AFTER you have attempted a restricted setting!
                      </span>
                    </li>
                    <li>
                      Then tap <strong className="text-white">Open App Info</strong> below.
                    </li>
                    <li>
                      In the top-right corner, tap the <strong className="text-white">3 dots (⋮)</strong>.
                    </li>
                    <li>
                      Tap <strong className="text-amber-300 font-bold">Allow restricted settings</strong> and verify with your PIN or fingerprint.
                    </li>
                    <li>
                      Return to QIEZKA and complete the steps!
                    </li>
                  </ol>
                  <button
                    type="button"
                    onClick={() => openAppInfo()}
                    className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 self-start shadow-md"
                  >
                    <Info className="w-4 h-4" />
                    <span>Open App Info (Allow Restricted Settings)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Step 1: Accessibility */}
            <div className={`border rounded-2xl p-4 text-left transition-all ${perms.isAccessibilityEnabled ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-black/40 border-gray-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Step 1: Enable Accessibility</h3>
                {perms.isAccessibilityEnabled && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Enabled</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">Required to block non-whitelisted apps and collapse Quick Settings.</p>
              <button 
                onClick={() => openAccessibilitySettings()}
                className={`w-full py-3 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 ${perms.isAccessibilityEnabled ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                <Settings className="w-4 h-4" />
                <span>{perms.isAccessibilityEnabled ? 'Reopen Accessibility Settings' : 'Open Accessibility Settings'}</span>
              </button>
            </div>

            {/* Step 2: Device Admin */}
            <div className={`border rounded-2xl p-4 text-left transition-all ${perms.isAdminActive ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-black/40 border-gray-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Step 2: Activate Device Admin</h3>
                {perms.isAdminActive && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Active</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">Prevents QIEZKA from being uninstalled during lockdown (no account removal needed).</p>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => openDeviceAdminSettings()}
                  className={`w-full py-3 text-white font-bold text-sm rounded-xl border transition-all flex items-center justify-center space-x-2 ${perms.isAdminActive ? 'bg-gray-800 border-emerald-700 text-emerald-300' : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500'}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{perms.isAdminActive ? 'Device Administrator Active' : 'Activate Device Admin'}</span>
                </button>

                {!perms.isAdminActive && (
                  <button 
                    onClick={() => openDeviceAdminList()}
                    type="button"
                    className="w-full py-2 bg-gray-950 hover:bg-gray-800 text-gray-400 hover:text-gray-200 font-medium text-xs rounded-lg border border-gray-800 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Prompt didn't open? Open Device Admin Apps list</span>
                  </button>
                )}
              </div>
            </div>

            {/* Step 3: Battery Optimization */}
            <div className={`border rounded-2xl p-4 text-left transition-all ${perms.isBatteryOptimizationIgnored ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-black/40 border-gray-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Step 3: Unrestricted Battery / Background</h3>
                {perms.isBatteryOptimizationIgnored && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Unrestricted</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">Prevents aggressive OEM battery savers (Samsung/Xiaomi/Pixel) from killing QIEZKA.</p>
              <button 
                onClick={async () => {
                  await requestBatteryOptimization();
                  setTimeout(verifyPermissions, 1000);
                }}
                className={`w-full py-3 text-white font-bold text-sm rounded-xl border transition-all flex items-center justify-center space-x-2 ${perms.isBatteryOptimizationIgnored ? 'bg-gray-800 border-emerald-700 text-emerald-300' : 'bg-amber-600 hover:bg-amber-700 border-amber-500'}`}
              >
                <BatteryCharging className="w-4 h-4" />
                <span>{perms.isBatteryOptimizationIgnored ? 'Background Usage Unrestricted' : 'Allow Unrestricted Background Usage'}</span>
              </button>
            </div>

            {/* Step 4: Notifications */}
            <div className={`border rounded-2xl p-4 text-left transition-all ${perms.isNotificationGranted ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-black/40 border-gray-800'}`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Step 4: Allow Notifications</h3>
                {perms.isNotificationGranted && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Allowed</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-3">Allows ongoing lock timer status, completion alerts, and foreground service priority.</p>
              <button 
                onClick={async () => {
                  await requestNotificationPermission();
                  setTimeout(verifyPermissions, 1000);
                }}
                className={`w-full py-3 text-white font-bold text-sm rounded-xl border transition-all flex items-center justify-center space-x-2 ${perms.isNotificationGranted ? 'bg-gray-800 border-emerald-700 text-emerald-300' : 'bg-sky-600 hover:bg-sky-700 border-sky-500'}`}
              >
                <Bell className="w-4 h-4" />
                <span>{perms.isNotificationGranted ? 'Notifications Allowed' : 'Allow Notifications'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full bg-black/40 border border-gray-800 rounded-2xl p-5 mb-6 text-left flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Automated Setup via ADB
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Connect your phone via USB with <strong>USB Debugging</strong> enabled, then run <code className="text-amber-300 bg-black/60 px-1 py-0.5 rounded font-mono">qiezka.bat</code> to grant all permissions and bypass restricted settings automatically.
            </p>

            <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
              <span className="text-gray-300 truncate mr-2">{gitHubUrl}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(gitHubUrl)}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                  title="Copy Repo URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={gitHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                  title="Open GitHub"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <ol className="text-xs text-gray-400 list-decimal list-inside space-y-1 mt-1">
              <li>Download or clone the repo from GitHub.</li>
              <li>Connect your phone to your PC via USB.</li>
              <li>Double-click <strong className="text-white">qiezka.bat</strong> to run.</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button 
            onClick={verifyPermissions}
            disabled={isChecking}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl border border-gray-700 transition-all uppercase tracking-wider text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isChecking ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying...</span></> : <span>Re-Check Status</span>}
          </button>

          {canProceed && (
            <button
              onClick={onComplete}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-xl shadow-lg shadow-emerald-950 transition-all text-sm flex items-center justify-center space-x-2 cursor-pointer animate-pulse hover:animate-none"
            >
              <span>Proceed to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
