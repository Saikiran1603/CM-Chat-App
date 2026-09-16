import Modal from './Modal';
import { useOS } from '@/hooks/useOS';
import { OS } from '@/types';

interface ShortcutRow {
  label: string;
  keys: string[];
}

const globalShortcuts: ShortcutRow[] = [
  { label: 'Search chats', keys: ['/'] },
  { label: 'New chat', keys: ['N'] },
  { label: 'New group', keys: ['G'] },
  { label: 'Open Settings', keys: ['S'] },
  { label: 'Open Profile', keys: ['P'] },
];

function chatShortcuts(altLabel: string): ShortcutRow[] {
  return [
    { label: 'Toggle emoji panel', keys: ['E'] },
    { label: 'Mute / unmute chat', keys: ['M'] },
    { label: 'Pin / unpin chat', keys: ['Shift', 'P'] },
    { label: 'Delete chat', keys: ['Shift', 'D'] },
    { label: 'Next chat', keys: [altLabel, '↓'] },
    { label: 'Previous chat', keys: [altLabel, '↑'] },
  ];
}

function Key({ children }: { children: string }) {
  return (
    <kbd className="rounded-md border border-border bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      {children}
    </kbd>
  );
}

function ShortcutRowView({ row }: { row: ShortcutRow }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-1.5 text-sm dark:border-white/10">
      <span className="text-slate-600 dark:text-slate-300">{row.label}</span>
      <div className="flex shrink-0 items-center gap-1">
        {row.keys.map((k, i) => (
          <span key={i} className="flex items-center gap-1">
            <Key>{k}</Key>
            {i < row.keys.length - 1 && <span className="text-muted">+</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function KeyboardShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [os, setOs] = useOS();
  const altLabel = os === 'mac' ? 'Option' : 'Alt';

  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" widthClass="max-w-2xl">
      <div className="mb-4 flex items-center justify-end gap-2 text-sm">
        <span className="text-muted">Key labels for:</span>
        <div className="flex overflow-hidden rounded-lg border border-border dark:border-white/10">
          {(['mac', 'windows'] as OS[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setOs(opt)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                os === opt ? 'bg-accent text-white' : 'bg-transparent text-muted hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {opt === 'mac' ? 'macOS' : 'Windows'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Anywhere in the app</p>
      <div className="mb-5">
        {globalShortcuts.map((row) => (
          <ShortcutRowView key={row.label} row={row} />
        ))}
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">While a chat is open</p>
      <div className="mb-4">
        {chatShortcuts(altLabel).map((row) => (
          <ShortcutRowView key={row.label} row={row} />
        ))}
      </div>

      <p className="mb-4 text-xs text-muted">
        Shortcuts only fire when you're not typing in a text field, so they never interfere with your messages. Combos
        like Ctrl+N or Ctrl+F aren't used here because browsers permanently reserve those for their own tab/window
        controls — no website can override them.
      </p>

      <div className="flex justify-end">
        <button onClick={onClose} className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-600">
          OK
        </button>
      </div>
    </Modal>
  );
}
