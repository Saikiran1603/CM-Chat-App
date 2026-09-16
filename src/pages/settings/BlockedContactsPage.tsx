import { useState } from 'react';
import { UserX, Plus, Search } from 'lucide-react';
import SettingsDetail from '@/components/SettingsDetail';
import Avatar from '@/components/Avatar';
import Modal from '@/components/Modal';
import { useContacts } from '@/context/ContactsContext';

export default function BlockedContactsPage() {
  const { contacts, getContact, blockedIds, blockContact, unblockContact } = useContacts();
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');
  const blockedContacts = blockedIds.map((id) => getContact(id)).filter(Boolean) as ReturnType<typeof getContact>[];
  const available = contacts.filter((c) => !blockedIds.includes(c.id) && c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <SettingsDetail title="Blocked Contacts">
      <button
        onClick={() => setAddOpen(true)}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-accent hover:underline"
      >
        <Plus size={16} /> Add blocked contact
      </button>

      <div className="max-w-md divide-y divide-border rounded-xl border border-border dark:divide-white/10 dark:border-white/10">
        {blockedContacts.map(
          (c) =>
            c && (
              <div key={c.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar initials={c.initials} color={c.avatarColor} src={c.avatarUrl} size={36} />
                  <span className="text-sm text-slate-800 dark:text-slate-100">{c.name}</span>
                </div>
                <button
                  onClick={() => unblockContact(c.id)}
                  className="flex items-center gap-1 text-xs font-medium text-red-500 hover:underline"
                >
                  <UserX size={14} /> Unblock
                </button>
              </div>
            )
        )}
        {blockedContacts.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">No blocked contacts</p>}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Block a contact">
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-appbg px-3 py-2 dark:bg-white/5">
          <Search size={16} className="text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <div className="max-h-72 overflow-y-auto">
          {available.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                blockContact(c.id);
                setAddOpen(false);
                setQuery('');
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <Avatar initials={c.initials} color={c.avatarColor} src={c.avatarUrl} size={36} />
              <span className="text-sm text-slate-800 dark:text-slate-100">{c.name}</span>
            </button>
          ))}
          {available.length === 0 && <p className="py-6 text-center text-sm text-muted">No contacts to block</p>}
        </div>
      </Modal>
    </SettingsDetail>
  );
}
