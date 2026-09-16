import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface NotificationSettings {
  messageNotifications: boolean;
  sound: boolean;
  groupNotifications: boolean;
  callNotifications: boolean;
  reactionNotifications: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  loginAlerts: boolean;
  readReceipts: boolean;
}

interface PrivacySettings {
  lastSeen: string;
  profilePhoto: string;
  about: string;
  groups: string;
}

interface SettingsState {
  notifications: NotificationSettings;
  security: SecuritySettings;
  privacy: PrivacySettings;
  wallpaper: string;
}

const defaults: SettingsState = {
  notifications: {
    messageNotifications: true,
    sound: true,
    groupNotifications: true,
    callNotifications: true,
    reactionNotifications: false,
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
    readReceipts: true,
  },
  privacy: {
    lastSeen: 'everyone',
    profilePhoto: 'contacts',
    about: 'everyone',
    groups: 'everyone',
  },
  wallpaper: '#f4f5f9',
};

interface SettingsContextValue extends SettingsState {
  setNotification: (key: keyof NotificationSettings, value: boolean) => void;
  setSecurity: (key: keyof SecuritySettings, value: boolean) => void;
  setPrivacy: (key: keyof PrivacySettings, value: string) => void;
  setWallpaper: (value: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const STORAGE_KEY = 'cm-settings';

function loadInitial(): SettingsState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      notifications: { ...defaults.notifications, ...parsed.notifications },
      security: { ...defaults.security, ...parsed.security },
      privacy: { ...defaults.privacy, ...parsed.privacy },
      wallpaper: parsed.wallpaper ?? defaults.wallpaper,
    };
  } catch {
    return defaults;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>(loadInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function setNotification(key: keyof NotificationSettings, value: boolean) {
    setState((s) => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
  }
  function setSecurity(key: keyof SecuritySettings, value: boolean) {
    setState((s) => ({ ...s, security: { ...s.security, [key]: value } }));
  }
  function setPrivacy(key: keyof PrivacySettings, value: string) {
    setState((s) => ({ ...s, privacy: { ...s.privacy, [key]: value } }));
  }
  function setWallpaper(value: string) {
    setState((s) => ({ ...s, wallpaper: value }));
  }

  return (
    <SettingsContext.Provider value={{ ...state, setNotification, setSecurity, setPrivacy, setWallpaper }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
