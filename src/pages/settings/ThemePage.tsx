import SettingsDetail from '@/components/SettingsDetail';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemePage() {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsDetail title="Theme">
      <p className="mb-4 max-w-md text-sm text-muted">Choose how CM Chat looks on this device.</p>
      <div className="grid max-w-md grid-cols-2 gap-4">
        <button
          onClick={() => setTheme('light')}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 ${
            theme === 'light' ? 'border-accent' : 'border-border dark:border-white/10'
          }`}
        >
          <div className="flex h-20 w-full items-center justify-center rounded-lg bg-white shadow-inner">
            <Sun className="text-amber-400" />
          </div>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Light</span>
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 ${
            theme === 'dark' ? 'border-accent' : 'border-border dark:border-white/10'
          }`}
        >
          <div className="flex h-20 w-full items-center justify-center rounded-lg bg-[#12141d] shadow-inner">
            <Moon className="text-indigo-300" />
          </div>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Dark</span>
        </button>
      </div>
    </SettingsDetail>
  );
}
