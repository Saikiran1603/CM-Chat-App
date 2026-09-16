import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { useUI } from '@/context/UIContext';
import Avatar from '@/components/Avatar';
import EmptyState from '@/components/EmptyState';

export default function GroupsPage() {
  const { setCreateGroupOpen } = useUI();
  const navigate = useNavigate();
  const { chats } = useAppData();
  const groups = chats.filter((c) => c.isGroup);

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col border-r border-border bg-panel dark:border-white/10 dark:bg-[#15161f] md:w-[340px]">
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Groups</h1>
          <button
            onClick={() => setCreateGroupOpen(true)}
            title="Create group"
            className="flex h-9 w-9 items-center justify-center rounded-full text-accent hover:bg-accent-50 dark:hover:bg-white/10"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => navigate(`/chat/${g.id}`)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <Avatar initials={g.initials} color={g.avatarColor} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{g.name}</p>
                <p className="truncate text-xs text-muted">{g.members.length} members · {g.lastMessage}</p>
              </div>
            </button>
          ))}
          {groups.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">No groups yet</p>}
        </div>
      </div>

      <div className="hidden flex-1 bg-panel dark:bg-[#0f1017] md:flex">
        <EmptyState title="Your groups" subtitle="Select a group to open the conversation, or create a new one" />
      </div>
    </div>
  );
}
