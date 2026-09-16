import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contacts } from '@/data/mockData';
import { useAppData } from '@/context/AppDataContext';
import Avatar from './Avatar';
import Modal from './Modal';

const GROUP_COLORS = ['#3366ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function CreateGroupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const { addChat } = useAppData();
  const navigate = useNavigate();

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function initialsFor(groupName: string) {
    const words = groupName.trim().split(/\s+/);
    return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'GR';
  }

  function handleCreate() {
    const id = `g-${Date.now()}`;
    addChat({
      id,
      isGroup: true,
      name: name.trim(),
      members: selected,
      avatarColor: GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)],
      initials: initialsFor(name),
      lastMessage: 'Group created',
      lastTime: 'Now',
      unread: 0,
    });
    setName('');
    setSelected([]);
    onClose();
    navigate(`/chat/${id}`);
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Group">
      <label className="mb-1 block text-xs font-medium text-muted">Group name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Weekend Trip"
        className="mb-4 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-accent dark:border-white/10"
      />

      <p className="mb-2 text-xs font-medium text-muted">Add members ({selected.length} selected)</p>
      <div className="mb-4 max-h-56 overflow-y-auto">
        {contacts.map((c) => (
          <label
            key={c.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
              className="h-4 w-4 accent-accent"
            />
            <Avatar initials={c.initials} color={c.avatarColor} src={c.avatarUrl} size={36} />
            <span className="text-sm text-slate-700 dark:text-slate-200">{c.name}</span>
          </label>
        ))}
      </div>

      <button
        disabled={!name.trim() || selected.length === 0}
        onClick={handleCreate}
        className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-opacity hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Create Group
      </button>
    </Modal>
  );
}
