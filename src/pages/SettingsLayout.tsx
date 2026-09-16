import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Bell,
  Lock,
  ShieldCheck,
  Palette,
  Image as ImageIcon,
  KeyRound,
  Keyboard,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import Avatar from '@/components/Avatar';
import EmptyState from '@/components/EmptyState';
import { useTheme } from '@/context/ThemeContext';
import { currentUser } from '@/data/mockData';

const items = [
  { to: 'notifications', label: 'Notifications', icon: Bell },
  { to: 'privacy', label: 'Privacy', icon: Lock },
  { to: 'security', label: 'Security', icon: ShieldCheck },
  { to: 'theme', label: 'Theme', icon: Palette },
  { to: 'wallpaper', label: 'Chat Wallpaper', icon: ImageIcon },
  { to: 'request-access', label: 'Request Account Info', icon: KeyRound },
  { to: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { to: 'help', label: 'Help', icon: HelpCircle },
];

export default function SettingsLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const atRoot = location.pathname === '/settings';

  return (
    <div className="flex h-full w-full">
      <div className={`flex h-full w-full flex-col border-r border-border bg-panel dark:border-white/10 dark:bg-[#15161f] md:w-[320px] ${atRoot ? 'flex' : 'hidden md:flex'}`}>
        <div className="px-4 pb-2 pt-4">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Settings</h1>
        </div>

        <NavLink to="/profile" className="mx-2 mb-2 flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50 dark:hover:bg-white/5">
          <Avatar initials={currentUser.initials} color={currentUser.avatarColor} src={currentUser.avatarUrl} size={48} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">Snorlax User</p>
            <p className="truncate text-xs text-muted">Hey there! I am using CM Chat.</p>
          </div>
        </NavLink>

        <div className="flex-1 overflow-y-auto scrollbar-none px-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-accent-50 text-accent dark:bg-white/10' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={14} className="text-muted" />
            </NavLink>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          className="m-3 flex items-center justify-center gap-2 rounded-lg bg-appbg py-2.5 text-sm font-medium text-slate-600 dark:bg-white/5 dark:text-slate-200"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          Switch to {theme === 'dark' ? 'light' : 'dark'} mode
        </button>
      </div>

      <div className={`h-full min-w-0 flex-1 bg-panel dark:bg-[#0f1017] ${atRoot ? 'hidden md:flex' : 'flex'}`}>
        {atRoot ? <EmptyState title="Settings" subtitle="Choose a category to manage your preferences" /> : <Outlet />}
      </div>
    </div>
  );
}
