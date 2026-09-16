import { useState } from 'react';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Video, Phone, ArrowLeft } from 'lucide-react';
import { callLog, getContact, contacts, currentUser } from '@/data/mockData';
import Avatar from '@/components/Avatar';
import EmptyState from '@/components/EmptyState';
import CallOverlay, { CallKind, CallTarget } from '@/components/CallOverlay';
import Modal from '@/components/Modal';

type Filter = 'all' | 'missed';

export default function CallsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{ kind: CallKind; target: CallTarget } | null>(null);
  const [newCallOpen, setNewCallOpen] = useState(false);

  const entries = callLog.filter((e) => (filter === 'missed' ? e.direction === 'missed' : true));
  const selectedEntry = callLog.find((e) => e.id === selectedId);
  const selectedContact = selectedEntry ? getContact(selectedEntry.contactId) : undefined;

  function startCall(contactId: string, kind: CallKind) {
    const c = getContact(contactId);
    if (!c) return;
    setActiveCall({
      kind,
      target: { name: c.name, initials: c.initials, avatarColor: c.avatarColor, avatarUrl: c.avatarUrl },
    });
    setNewCallOpen(false);
  }

  return (
    <div className="flex h-full w-full">
      {/* Call log list */}
      <div className={`flex h-full w-full flex-col border-r border-border bg-panel dark:border-white/10 dark:bg-[#15161f] md:w-[340px] ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Call log</h1>
          <button
            onClick={() => setNewCallOpen(true)}
            title="Start a new call"
            className="flex h-9 w-9 items-center justify-center rounded-full text-accent hover:bg-accent-50 dark:hover:bg-white/10"
          >
            <Phone size={18} />
          </button>
        </div>
        <div className="flex gap-2 px-4 pb-3">
          {(['all', 'missed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                filter === f ? 'bg-accent text-white' : 'bg-appbg text-muted hover:bg-slate-100 dark:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {entries.map((entry) => {
            const c = getContact(entry.contactId);
            if (!c) return null;
            const DirIcon =
              entry.direction === 'incoming' ? PhoneIncoming : entry.direction === 'outgoing' ? PhoneOutgoing : PhoneMissed;
            const dirColor = entry.direction === 'missed' ? 'text-red-500' : 'text-emerald-500';
            return (
              <div
                key={entry.id}
                className={`flex w-full items-center gap-3 px-4 py-3 transition-colors ${
                  selectedId === entry.id ? 'bg-accent-50 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <Avatar
                  initials={c.initials}
                  color={c.avatarColor}
                  src={c.avatarUrl}
                  size={44}
                  online={c.online}
                  onClick={() => setSelectedId(entry.id)}
                  title={`View ${c.name}`}
                />
                <button onClick={() => setSelectedId(entry.id)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{c.name}</p>
                  <div className={`flex items-center gap-1 text-xs ${dirColor}`}>
                    <DirIcon size={12} />
                    <span className="text-muted">{entry.time}</span>
                  </div>
                </button>
                <button
                  onClick={() => startCall(c.id, entry.type)}
                  title={entry.type === 'video' ? 'Video call again' : 'Call again'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-accent-50 hover:text-accent dark:hover:bg-white/10"
                >
                  {entry.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                </button>
              </div>
            );
          })}
          {entries.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">No calls yet</p>}
        </div>
      </div>

      {/* Detail / call stage */}
      <div className={`relative h-full min-w-0 flex-1 flex-col bg-panel dark:bg-[#0f1017] ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
        {selectedContact && selectedEntry ? (
          <div className="flex h-full flex-col items-center justify-center p-8">
            <button
              onClick={() => setSelectedId(null)}
              className="absolute left-4 top-4 flex items-center gap-1 text-sm text-muted hover:text-slate-800 dark:hover:text-white md:hidden"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <Avatar
              initials={selectedContact.initials}
              color={selectedContact.avatarColor}
              src={selectedContact.avatarUrl}
              size={110}
              online={selectedContact.online}
            />
            <h2 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">{selectedContact.name}</h2>
            <p className="mt-1 text-sm text-muted">{selectedContact.about}</p>
            <p className="mt-1 text-xs text-muted">
              Last call: {selectedEntry.time}
              {selectedEntry.duration ? ` · ${selectedEntry.duration}` : ' · Missed'}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => startCall(selectedContact.id, 'audio')}
                className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-600"
              >
                <Phone size={16} /> Audio call
              </button>
              <button
                onClick={() => startCall(selectedContact.id, 'video')}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <Video size={16} /> Video call
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <EmptyState title="No call selected" subtitle="Pick someone from the call log, or start a new call" />
          </div>
        )}

        {activeCall && (
          <CallOverlay
            kind={activeCall.kind}
            target={activeCall.target}
            selfAvatarUrl={currentUser.avatarUrl}
            onEnd={() => setActiveCall(null)}
          />
        )}
      </div>

      {/* New call picker */}
      <Modal open={newCallOpen} onClose={() => setNewCallOpen(false)} title="Start a call">
        <div className="max-h-80 overflow-y-auto">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5">
              <Avatar initials={c.initials} color={c.avatarColor} src={c.avatarUrl} size={40} online={c.online} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{c.name}</p>
                <p className="truncate text-xs text-muted">{c.about}</p>
              </div>
              <button
                onClick={() => startCall(c.id, 'audio')}
                title="Audio call"
                className="flex h-9 w-9 items-center justify-center rounded-full text-accent hover:bg-accent-50 dark:hover:bg-white/10"
              >
                <Phone size={16} />
              </button>
              <button
                onClick={() => startCall(c.id, 'video')}
                title="Video call"
                className="flex h-9 w-9 items-center justify-center rounded-full text-accent hover:bg-accent-50 dark:hover:bg-white/10"
              >
                <Video size={16} />
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
