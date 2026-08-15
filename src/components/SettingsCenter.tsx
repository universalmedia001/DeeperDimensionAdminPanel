import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Globe2, Palette, UserRound, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAdminProfile } from '@/context/useAdminProfile';
import type { AccountPreferences } from '@/services/adminState';
import { LocalToast } from '@/components/AdminPages';

export default function SettingsCenter() {
  const { preferences, updatePreferences } = useAdminProfile();
  const [toast, setToast] = useState('');
  const update = <K extends keyof AccountPreferences>(key: K, value: AccountPreferences[K], message: string) => {
    updatePreferences({ ...preferences, [key]: value });
    setToast(message);
  };
  const sections = [['Admin Profile', 'Name, email, and profile photo', '/admin/profile', UserRound], ['Website Settings', 'Website identity, contact, and social links', '/admin/website-settings', Globe2], ['Notifications', 'Activity center and notification history', '/admin/notifications', Bell], ['Integrations', 'Future connections, intentionally inactive', '/admin/integrations', Zap]] as const;
  return <div className="space-y-6">
    <div><p className="eyebrow">Console configuration</p><h2 className="page-title mt-2">Settings</h2><p className="mt-2 text-sm text-stone-500">Manage your workspace, account, and future website connections.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">{sections.map(([title, description, href, Icon]) => <Link to={href} key={href} className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-amber-500/30"><div className="rounded-xl bg-amber-500/10 p-3 text-amber-300"><Icon size={18} /></div><div className="min-w-0"><h3 className="text-sm font-semibold text-stone-100">{title}</h3><p className="mt-1 text-xs leading-5 text-stone-500">{description}</p></div><ChevronRight size={16} className="ml-auto shrink-0 text-stone-600" /></Link>)}</div>
    <div className="glass max-w-3xl rounded-2xl p-6"><div className="flex items-center gap-3"><Palette size={18} className="text-amber-300" /><div><h3 className="font-display text-xl text-stone-100">Appearance & preferences</h3><p className="mt-1 text-xs text-stone-600">Changes apply immediately and persist on this device.</p></div></div>
      <div className="mt-6 space-y-5">
        <PreferenceToggle label="Reduced motion" description="Minimize transitions and movement." value={preferences.reducedMotion} onChange={value => update('reducedMotion', value, value ? 'Reduced motion enabled' : 'Reduced motion disabled')} />
        <PreferenceToggle label="Sidebar" description="Show a compact icon-only navigation on desktop." value={preferences.sidebarCollapsed} onChange={value => update('sidebarCollapsed', value, value ? 'Sidebar collapsed' : 'Sidebar expanded')} />
        <PreferenceToggle label="Remember this session" description="Keep the local demo session active after refresh." value={preferences.rememberSession} onChange={value => update('rememberSession', value, value ? 'Session preference enabled' : 'Session preference disabled')} />
        <PreferenceToggle label="Confirm before deleting" description="Ask before destructive actions." value={preferences.confirmDelete} onChange={value => update('confirmDelete', value, value ? 'Delete confirmations enabled' : 'Delete confirmations disabled')} />
        <div className="flex items-center justify-between gap-5 border-b border-white/[.06] pb-4"><div><p className="text-sm text-stone-200">Interface density</p><p className="mt-1 text-xs text-stone-600">Adjust spacing across lists, cards, and forms.</p></div><select className="input-field max-w-[150px]" value={preferences.density} onChange={event => update('density', event.target.value as AccountPreferences['density'], `${event.target.value === 'compact' ? 'Compact' : 'Comfortable'} interface enabled`)}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></div>
        <div className="flex items-center justify-between gap-5"><div><p className="text-sm text-stone-200">Theme</p><p className="mt-1 text-xs text-stone-600">Choose dark, light, or your system setting.</p></div><select className="input-field max-w-[150px]" value={preferences.theme} onChange={event => update('theme', event.target.value as AccountPreferences['theme'], `Theme changed to ${event.target.value}`)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select></div>
      </div>
    </div>{toast && <LocalToast message={toast} onClose={() => setToast('')} />}
  </div>;
}

function PreferenceToggle({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (value: boolean) => void }) { return <div className="flex items-center justify-between gap-5 border-b border-white/[.06] pb-4"><div><p className="text-sm text-stone-200">{label}</p><p className="mt-1 text-xs text-stone-600">{description}</p></div><button type="button" aria-pressed={value} onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full ${value ? 'bg-amber-500' : 'bg-white/10'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} /></button></div>; }
