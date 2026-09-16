import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, SquarePen, Pin } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { useUI } from '@/context/UIContext';
import { Chat } from '@/types';
import Avatar from './Avatar';

export default function ChatListPanel({ activeId }: { activeId?: string }) {
  const [query, setQuery] = useState('');
  const { chats } = useAppData();
  const { setStartConversationOpen, chatSearchRef } = useUI();

  const filtered = chats.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const pinned = filtered.filter((c) => c.pinned);
  const rest = filtered.filter((c) => !c.pinned);

  return (
    <div className={`flex h-full w-full flex-col border-r border-border bg-panel dark:border-white/10 dark:bg-[#15161f] md:w-[340px] ${activeId ? 'hidden md:flex' : 'flex'}`}>
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Chats</h1>
        <button
          onClick={() => setStartConversationOpen(true)}
          title="Start new conversation"
          className="flex h-9 w-9 items-center justify-center rounded-full text-accent hover:bg-accent-50 dark:hover:bg-white/10"
        >
          <SquarePen size={18} />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-lg bg-appbg px-3 py-2 dark:bg-white/5">
          <Search size={16} className="text-muted" />
          <input
            ref={chatSearchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        {pinned.length > 0 && (
          <p className="px-4 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted">Pinned</p>
        )}
        {pinned.map((chat) => (
          <ChatRow key={chat.id} chat={chat} />
        ))}
        {rest.length > 0 && pinned.length > 0 && (
          <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">All chats</p>
        )}
        {rest.map((chat) => (
          <ChatRow key={chat.id} chat={chat} />
        ))}
        {filtered.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">No chats found</p>}
      </div>
    </div>
  );
}

function ChatRow({ chat }: { chat: Chat }) {
  return (
    <NavLink
      to={`/chat/${chat.id}`}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 transition-colors ${
          isActive ? 'bg-accent-50 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
        }`
      }
    >
      <Avatar initials={chat.initials} color={chat.avatarColor} src={chat.avatarUrl} size={44} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{chat.name}</span>
          <span className="shrink-0 text-[11px] text-muted">{chat.lastTime}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted">{chat.muted ? 'Muted · ' : ''}{chat.lastMessage}</span>
          <div className="flex shrink-0 items-center gap-1">
            {chat.pinned && <Pin size={12} className="text-muted" />}
            {chat.unread > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </NavLink>
  );
}
