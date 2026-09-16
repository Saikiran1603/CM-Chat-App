import { useState } from 'react';
import SettingsDetail from '@/components/SettingsDetail';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';

export default function KeyboardShortcutsPage() {
  const [open, setOpen] = useState(true);
  return (
    <SettingsDetail title="Keyboard Shortcuts">
      <p className="mb-4 max-w-md text-sm text-muted">
        View every shortcut for both Windows and macOS. You can also open this anytime from the icon at the bottom of
        the sidebar.
      </p>
      <button onClick={() => setOpen(true)} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-600">
        View shortcuts
      </button>
      <KeyboardShortcutsModal open={open} onClose={() => setOpen(false)} />
    </SettingsDetail>
  );
}
