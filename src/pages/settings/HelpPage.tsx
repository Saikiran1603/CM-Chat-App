import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SettingsDetail from '@/components/SettingsDetail';

const faqs = [
  { q: 'How do I start a new conversation?', a: 'Click the pencil icon at the top of the Chats list and pick a contact.' },
  { q: 'How do I create a group?', a: 'Go to Groups in the sidebar and click the + icon, then name the group and add members.' },
  { q: 'How do I change my theme?', a: 'Open Settings → Theme and choose Light or Dark mode.' },
  { q: 'How do I block a contact?', a: 'Open a chat, click the info icon, then choose Block contact from the more menu, or manage it under Settings → Privacy → Blocked Contacts.' },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <SettingsDetail title="Help">
      <div className="max-w-lg space-y-2">
        {faqs.map((f, i) => (
          <div key={f.q} className="rounded-xl border border-border dark:border-white/10">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              {f.q}
              <ChevronDown size={16} className={`text-muted transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && <p className="border-t border-border px-4 py-3 text-sm text-muted dark:border-white/10">{f.a}</p>}
          </div>
        ))}
      </div>
    </SettingsDetail>
  );
}
