import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SettingsDetail from '@/components/SettingsDetail';
import { useSettings } from '@/context/SettingsContext';
import { useContacts } from '@/context/ContactsContext';

const labels: Record<string, string> = {
  everyone: 'Everyone',
  contacts: 'My Contacts',
  nobody: 'Nobody',
};

export default function PrivacyPage() {
  const location = useLocation();
  const atRoot = location.pathname === '/settings/privacy';
  const { privacy } = useSettings();
  const { blockedIds } = useContacts();

  if (!atRoot) return <Outlet />;

  const items = [
    { to: 'last-seen', label: 'Last Seen', value: labels[privacy.lastSeen] ?? privacy.lastSeen },
    { to: 'profile-photo', label: 'Profile Photo', value: labels[privacy.profilePhoto] ?? privacy.profilePhoto },
    { to: 'about', label: 'About', value: labels[privacy.about] ?? privacy.about },
    { to: 'groups', label: 'Groups', value: labels[privacy.groups] ?? privacy.groups },
    { to: 'blocked-contacts', label: 'Blocked Contacts', value: String(blockedIds.length) },
  ];

  return (
    <SettingsDetail title="Privacy">
      <div className="max-w-lg divide-y divide-border rounded-xl border border-border dark:divide-white/10 dark:border-white/10">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className="flex items-center justify-between px-4 py-3.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <span className="text-slate-800 dark:text-slate-100">{it.label}</span>
            <span className="flex items-center gap-2 text-muted">
              {it.value}
              <ChevronRight size={14} />
            </span>
          </NavLink>
        ))}
      </div>
    </SettingsDetail>
  );
}
