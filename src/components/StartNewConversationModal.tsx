import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { contacts } from '@/data/mockData';
import { useAppData } from '@/context/AppDataContext';
import Avatar from './Avatar';
import Modal from './Modal';

export default function StartNewConversationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { findChatByContact, addChat, isBlocked } = useAppData();

  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  function openChatWith(contactId: string) {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;
    const existing = findChatByContact(contactId);
    if (existing) {
      onClose();
      navigate(`/chat/${existing.id}`);
      return;
    }
    const newChatId = `c-${contactId}-${Date.now()}`;
    addChat({
      id: newChatId,
      isGroup: false,
      name: contact.name,
      members: [contactId],
      avatarColor: contact.avatarColor,
      initials: contact.initials,
      lastMessage: 'No messages yet',
      lastTime: 'Now',
      unread: 0,
    });
    onClose();
    navigate(`/chat/${newChatId}`);
  }

  return (
    <Modal open={open} onClose={onClose} title="Start new conversation">
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
      <div className="max-h-80 overflow-y-auto">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => openChatWith(c.id)}
            disabled={isBlocked(c.id)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/5"
          >
            <Avatar initials={c.initials} color={c.avatarColor} src={c.avatarUrl} size={40} online={c.online} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{c.name}</p>
              <p className="truncate text-xs text-muted">{isBlocked(c.id) ? 'Blocked' : c.about}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <p className="py-6 text-center text-sm text-muted">No contacts found</p>}
      </div>
    </Modal>
  );
}
