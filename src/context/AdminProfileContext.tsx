import { createContext, useEffect, useMemo, useState } from 'react';
import { adminState, type AccountPreferences, type AdminProfile } from '@/services/adminState';

interface AdminProfileContextValue {
  profile: AdminProfile;
  preferences: AccountPreferences;
  updateProfile: (profile: AdminProfile) => void;
  updatePreferences: (preferences: AccountPreferences) => void;
}

export const AdminProfileContext = createContext<AdminProfileContextValue | null>(null);

export function AdminProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>(() => adminState.getProfile());
  const [preferences, setPreferences] = useState<AccountPreferences>(() => adminState.getPreferences());

  useEffect(() => {
    const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyAppearance = () => {
      const theme = preferences.theme === 'system' ? (systemQuery.matches ? 'dark' : 'light') : preferences.theme;
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.density = preferences.density;
      document.documentElement.dataset.reducedMotion = String(preferences.reducedMotion);
    };
    applyAppearance();
    if (preferences.theme !== 'system') return;
    systemQuery.addEventListener('change', applyAppearance);
    return () => systemQuery.removeEventListener('change', applyAppearance);
  }, [preferences]);

  const updateProfile = (next: AdminProfile) => { adminState.saveProfile(next); setProfile(next); };
  const updatePreferences = (next: AccountPreferences) => { adminState.savePreferences(next); setPreferences(next); };
  const value = useMemo(() => ({ profile, preferences, updateProfile, updatePreferences }), [profile, preferences]);

  return <AdminProfileContext.Provider value={value}>{children}</AdminProfileContext.Provider>;
}

