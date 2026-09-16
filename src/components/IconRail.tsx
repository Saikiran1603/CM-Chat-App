import { NavLink } from 'react-router-dom';
import { MessageCircle, Phone, Users, Settings, Keyboard, CircleDashed, Sun, Moon } from 'lucide-react';
import Avatar from './Avatar';
import { useState } from 'react';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { useTheme } from '@/context/ThemeContext';
import { currentUser } from '@/data/mockData';

const navItems = [
  { to: '/', icon: MessageCircle, label: 'Chats', end: true },
  { to: '/updates', icon: CircleDashed, label: 'Updates' },
  { to: '/calls', icon: Phone, label: 'Calls' },
  { to: '/groups', icon: Users, label: 'Groups' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function IconRail() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <nav className="flex w-full flex-row items-center justify-around border-t border-border bg-white py-1.5 dark:border-white/10 dark:bg-rail md:h-full md:w-16 md:flex-col md:justify-between md:border-r md:border-t-0 md:py-4">
        <div className="flex flex-row items-center gap-1 md:flex-col md:gap-2">
          <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white md:mb-3 md:flex">
            CM
          </div>
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium transition-colors md:h-11 md:w-11 ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-railHover dark:hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="md:hidden">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex flex-row items-center gap-1 md:flex-col md:gap-3">
          <button
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="hidden h-9 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:text-accent dark:bg-white/10 dark:text-slate-300 md:flex"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            title="Keyboard shortcuts"
            onClick={() => setShortcutsOpen(true)}
            className="hidden h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-railHover dark:hover:text-white md:flex"
          >
            <Keyboard size={20} />
          </button>
          <NavLink to="/profile" title="Profile" className="flex h-11 w-11 items-center justify-center">
            <Avatar initials={currentUser.initials} color={currentUser.avatarColor} src={currentUser.avatarUrl} size={32} />
          </NavLink>
        </div>
      </nav>
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
