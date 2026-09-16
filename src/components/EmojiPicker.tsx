import { useState } from 'react';

const categories: { label: string; emojis: string[] }[] = [
  {
    label: 'Smileys',
    emojis: ['😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😜', '🤔', '🙄', '😴', '😭', '😡', '🥳', '😎', '🤗', '🙃', '😇'],
  },
  {
    label: 'Gestures',
    emojis: ['👍', '👎', '👏', '🙌', '🙏', '👋', '✌️', '🤝', '💪', '🤙', '👌', '✋'],
  },
  {
    label: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💕', '💖', '💔', '❣️'],
  },
  {
    label: 'Objects',
    emojis: ['🔥', '✨', '🎉', '🎂', '☕', '🍕', '📌', '📎', '📷', '🎵', '⏰', '💡'],
  },
  {
    label: 'Travel',
    emojis: ['🚗', '✈️', '🏠', '🌴', '⛰️', '🌊', '☀️', '🌙', '⭐', '🌧️', '❄️', '🌈'],
  },
];

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [active, setActive] = useState(0);

  return (
    <div className="absolute bottom-11 left-0 z-10 w-72 overflow-hidden rounded-xl border border-border bg-panel shadow-lg dark:border-white/10 dark:bg-[#1a1c27]">
      <div className="flex gap-1 overflow-x-auto border-b border-border p-2 scrollbar-none dark:border-white/10">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              active === i ? 'bg-accent text-white' : 'text-muted hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid max-h-48 grid-cols-6 gap-1 overflow-y-auto p-2">
        {categories[active].emojis.map((e) => (
          <button
            key={e}
            onClick={() => onSelect(e)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg hover:bg-slate-100 dark:hover:bg-white/10"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
