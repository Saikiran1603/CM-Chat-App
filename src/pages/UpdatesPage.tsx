import { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { updates as initialUpdates, getContact, contacts, currentUser } from '@/data/mockData';
import { Update } from '@/types';
import Avatar from '@/components/Avatar';
import EmptyState from '@/components/EmptyState';

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeIndex = updates.findIndex((u) => u.id === activeId);
  const active = activeIndex >= 0 ? updates[activeIndex] : undefined;
  const unviewed = updates.filter((u) => !u.viewed);
  const viewed = updates.filter((u) => u.viewed);

  function open(id: string) {
    setActiveId(id);
    setUpdates((prev) => prev.map((u) => (u.id === id ? { ...u, viewed: true } : u)));
  }

  function step(delta: number) {
    const next = updates[activeIndex + delta];
    if (next) open(next.id);
    else setActiveId(null);
  }

  return (
    <div className="flex h-full w-full">
      <div className={`flex h-full w-full flex-col border-r border-border bg-panel dark:border-white/10 dark:bg-[#15161f] md:w-[340px] ${active ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Updates</h1>
        </div>

        <button className="mx-2 mb-1 flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50 dark:hover:bg-white/5">
          <div className="relative">
            <Avatar initials={currentUser.initials} color={currentUser.avatarColor} src={currentUser.avatarUrl} size={48} />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white ring-2 ring-panel dark:ring-[#15161f]">
              <Plus size={12} />
            </span>
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">My Update</p>
            <p className="truncate text-xs text-muted">Tap to add a status update</p>
          </div>
        </button>

        <div className="flex-1 overflow-y-auto scrollbar-none px-1">
          {unviewed.length > 0 && (
            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">Recent updates</p>
          )}
          {unviewed.map((u) => (
            <UpdateRow key={u.id} update={u} onClick={() => open(u.id)} />
          ))}
          {viewed.length > 0 && (
            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">Viewed updates</p>
          )}
          {viewed.map((u) => (
            <UpdateRow key={u.id} update={u} onClick={() => open(u.id)} />
          ))}
          {updates.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">No updates yet</p>}
        </div>
      </div>

      <div className={`h-full min-w-0 flex-1 bg-[#0b0c12] ${active ? 'flex' : 'hidden md:flex'}`}>
        {active ? <UpdateViewer update={active} onClose={() => setActiveId(null)} onPrev={() => step(-1)} onNext={() => step(1)} /> : (
          <div className="flex h-full w-full items-center justify-center bg-panel dark:bg-[#0f1017]">
            <EmptyState title="Click on update to view" subtitle="Select an update from the list to see it here" />
          </div>
        )}
      </div>
    </div>
  );
}

function UpdateRow({ update, onClick }: { update: Update; onClick: () => void }) {
  const contact = getContact(update.contactId) ?? contacts[0];
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-white/5">
      <div className={`rounded-full p-[2px] ${update.viewed ? 'bg-slate-300 dark:bg-white/15' : 'bg-accent'}`}>
        <div className="rounded-full bg-panel p-[2px] dark:bg-[#15161f]">
          <Avatar initials={contact.initials} color={contact.avatarColor} src={contact.avatarUrl} size={44} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{contact.name}</p>
        <p className="truncate text-xs text-muted">{update.time}</p>
      </div>
    </button>
  );
}

function UpdateViewer({ update, onClose, onPrev, onNext }: { update: Update; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const contact = getContact(update.contactId) ?? contacts[0];
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
          <div className="h-full w-full animate-pulseSlow bg-white" />
        </div>
      </div>
      <div className="absolute left-4 top-8 z-10 flex items-center gap-2 text-white">
        <Avatar initials={contact.initials} color={contact.avatarColor} src={contact.avatarUrl} size={36} />
        <div>
          <p className="text-sm font-semibold">{contact.name}</p>
          <p className="text-xs text-white/70">{update.time}</p>
        </div>
      </div>
      <button onClick={onClose} className="absolute right-4 top-8 z-10 rounded-full bg-black/30 p-1.5 text-white hover:bg-black/50">
        <X size={18} />
      </button>

      <button onClick={onPrev} className="absolute left-2 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 sm:flex">
        <ChevronLeft size={20} />
      </button>
      <button onClick={onNext} className="absolute right-2 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 sm:flex">
        <ChevronRight size={20} />
      </button>

      <div className="flex h-full max-h-[720px] w-full max-w-md items-center justify-center overflow-hidden sm:rounded-2xl">
        {update.type === 'image' ? (
          <img src={update.content} alt="Status" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8 text-center" style={{ backgroundColor: update.bgColor ?? '#3366ff' }}>
            <p className="text-2xl font-semibold text-white">{update.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
