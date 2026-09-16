import { useEffect, useRef, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Video,
  Search,
  Info,
  Paperclip,
  Smile,
  Send,
  MoreVertical,
  Image as ImageIcon,
  FileText,
  Star,
  Download,
} from 'lucide-react';
import { Chat, Message } from '@/types';
import { messages as fallbackMessages, currentUser } from '@/data/mockData';
import { useContacts } from '@/context/ContactsContext';
import { useAppData } from '@/context/AppDataContext';
import { useSettings } from '@/context/SettingsContext';
import { isTyping } from '@/hooks/useGlobalShortcuts';
import { isLightColor } from '@/utils/color';
import { api } from '@/api/client';
import Avatar from './Avatar';
import EmojiPicker from './EmojiPicker';
import ContactInfoPanel, { InfoPanelTab } from './ContactInfoPanel';
import CallOverlay, { CallKind } from './CallOverlay';

export default function ChatWindow({ chat }: { chat: Chat }) {
  const navigate = useNavigate();
  const { chats, toggleMute, togglePin, deleteChat } = useAppData();
  const { getContact, blockContact, unblockContact, isBlocked } = useContacts();
  const { wallpaper } = useSettings();
  const wallpaperIsLight = isLightColor(wallpaper);
  const [draft, setDraft] = useState('');
  const [panelTab, setPanelTab] = useState<InfoPanelTab | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<CallKind | null>(null);
  const messageStorageKey = `cm-messages-${chat.id}`;
  const cachedMessagesRef = useRef(false);
  const [msgs, setMsgs] = useState<Message[]>(() => {
    try {
      const raw = window.localStorage.getItem(messageStorageKey);
      if (raw) {
        cachedMessagesRef.current = true;
        return JSON.parse(raw) as Message[];
      }
    } catch {
      window.localStorage.removeItem(messageStorageKey);
    }
    return fallbackMessages.filter((m) => m.chatId === chat.id);
  });
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load this conversation's messages from the API (falls back to the
  // bundled mock thread if the API is unreachable). This component
  // remounts per chat (see key={chat.id} in ChatsPage), so this only
  // needs to run once per mount.
  useEffect(() => {
    if (cachedMessagesRef.current) return;
    let cancelled = false;
    api
      .getByQuery<Message>('messages', { chatId: chat.id })
      .then((res) => {
        if (!cancelled && res.length > 0) {
          setMsgs(res);
          window.localStorage.setItem(messageStorageKey, JSON.stringify(res));
        }
      })
      .catch(() => {
        /* keep the bundled fallback already in state */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contactId = !chat.isGroup ? chat.members[0] : undefined;
  const blocked = contactId ? isBlocked(contactId) : false;

  function handleDeleteChat() {
    if (window.confirm(`Delete this chat with ${chat.name}? This can't be undone.`)) {
      deleteChat(chat.id);
      navigate('/');
    }
  }

  function handleBlockOrExit() {
    if (chat.isGroup) {
      if (window.confirm(`Exit "${chat.name}"? You'll stop receiving messages from this group.`)) {
        deleteChat(chat.id);
        navigate('/');
      }
      return;
    }
    if (!contactId) return;
    if (blocked) unblockContact(contactId);
    else blockContact(contactId);
  }

  // Chat-scoped shortcuts: only active while this thread is open, and only
  // when focus isn't in a text field (so they never hijack typing).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTyping(e.target)) return;
      if (e.key === 'e' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setEmojiOpen((v) => !v);
      } else if (e.key.toLowerCase() === 'm' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleMute(chat.id);
      } else if (e.key.toLowerCase() === 'p' && e.shiftKey) {
        e.preventDefault();
        togglePin(chat.id);
      } else if (e.key.toLowerCase() === 'd' && e.shiftKey) {
        e.preventDefault();
        handleDeleteChat();
      } else if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const idx = chats.findIndex((c) => c.id === chat.id);
        const next = chats[idx + (e.key === 'ArrowDown' ? 1 : -1)];
        if (next) navigate(`/chat/${next.id}`);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.id, chats]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs.length]);

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(partial: Partial<Message>) {
    const msg: Message = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      chatId: chat.id,
      senderId: 'me',
      text: '',
      time: nowTime(),
      outgoing: true,
      ...partial,
    };
    setMsgs((prev) => {
      const next = [...prev, msg];
      window.localStorage.setItem(messageStorageKey, JSON.stringify(next));
      return next;
    });
    // Best-effort persist to the API — on my-json-server (production) this
    // is faked and won't survive a reload, which is a hosting limitation,
    // not a bug; see README.
    api.create('messages', msg).catch(() => {});
  }

  function handleSend() {
    if (!draft.trim()) return;
    appendMessage({ text: draft.trim(), type: 'text' });
    setDraft('');
  }

  function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      appendMessage({ type: 'image', mediaUrl: URL.createObjectURL(file), text: '' });
    }
    setAttachOpen(false);
    e.target.value = '';
  }

  function handleDocSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      appendMessage({
        type: 'doc',
        text: '',
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        mediaUrl: URL.createObjectURL(file),
      });
    }
    setAttachOpen(false);
    e.target.value = '';
  }

  function toggleStar(id: string) {
    setMsgs((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m));
      window.localStorage.setItem(messageStorageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="relative flex h-full min-w-0 flex-1">
      <div className="flex h-full min-w-0 flex-1 flex-col" style={{ backgroundColor: wallpaper }}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-border bg-panel px-3 py-2.5 dark:border-white/10 dark:bg-[#15161f] sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button className="shrink-0 text-muted md:hidden" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
            </button>
            <Avatar
              initials={chat.initials}
              color={chat.avatarColor}
              src={chat.avatarUrl}
              size={38}
              onClick={() => setPanelTab('info')}
              title={`View ${chat.name}'s info`}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{chat.name}</p>
              <p className="truncate text-xs text-muted">{chat.isGroup ? `${chat.members.length} members` : 'Online'}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 text-muted sm:gap-1">
            <IconBtn title="Audio call" onClick={() => setActiveCall('audio')}>
              <Phone size={18} />
            </IconBtn>
            <IconBtn title="Video call" onClick={() => setActiveCall('video')}>
              <Video size={18} />
            </IconBtn>
            <IconBtn title="Search in chat" onClick={() => setPanelTab('search')}>
              <Search size={18} />
            </IconBtn>
            <IconBtn title="Contact info" onClick={() => setPanelTab('info')}>
              <Info size={18} />
            </IconBtn>
            <IconBtn title="More" onClick={() => setPanelTab('more')}>
              <MoreVertical size={18} />
            </IconBtn>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-8">
          {msgs.length === 0 && (
            <p className={`mt-10 text-center text-sm ${wallpaperIsLight ? 'text-slate-500' : 'text-slate-300'}`}>No messages yet. Say hello 👋</p>
          )}
          {msgs.map((m) => (
            <div key={m.id} className={`group flex items-end gap-1.5 ${m.outgoing ? 'justify-end' : 'justify-start'}`}>
              {!m.outgoing && (
                <button
                  onClick={() => toggleStar(m.id)}
                  className={`opacity-0 transition-opacity group-hover:opacity-100 ${m.starred ? '!opacity-100 text-amber-500' : 'text-muted'}`}
                  title={m.starred ? 'Unstar' : 'Star message'}
                >
                  <Star size={13} fill={m.starred ? 'currentColor' : 'none'} />
                </button>
              )}
              <MessageBubble message={m} wallpaperIsLight={wallpaperIsLight} />
              {m.outgoing && (
                <button
                  onClick={() => toggleStar(m.id)}
                  className={`opacity-0 transition-opacity group-hover:opacity-100 ${m.starred ? '!opacity-100 text-amber-500' : 'text-muted'}`}
                  title={m.starred ? 'Unstar' : 'Star message'}
                >
                  <Star size={13} fill={m.starred ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Composer */}
        {blocked ? (
          <div className="flex items-center justify-between gap-3 border-t border-border bg-panel px-4 py-3 text-sm dark:border-white/10 dark:bg-[#15161f]">
            <span className="text-muted">You blocked {chat.name}. Unblock to send messages.</span>
            <button
              onClick={handleBlockOrExit}
              className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-600"
            >
              Unblock
            </button>
          </div>
        ) : (
        <div className="relative flex items-center gap-1.5 border-t border-border bg-panel px-3 py-2.5 dark:border-white/10 dark:bg-[#15161f] sm:gap-2 sm:px-4 sm:py-3">
          {(attachOpen || emojiOpen) && (
            <div
              className="fixed inset-0 z-[5]"
              onClick={() => {
                setAttachOpen(false);
                setEmojiOpen(false);
              }}
            />
          )}
          <div className="relative">
            <button
              className={`hover:text-accent ${emojiOpen ? 'text-accent' : 'text-muted'}`}
              title="Emoji"
              onClick={() => {
                setEmojiOpen((v) => !v);
                setAttachOpen(false);
              }}
            >
              <Smile size={20} />
            </button>
            {emojiOpen && (
              <EmojiPicker
                onSelect={(emoji) => {
                  setDraft((d) => d + emoji);
                }}
              />
            )}
          </div>
          <div className="relative">
            <button
              className={`hover:text-accent ${attachOpen ? 'text-accent' : 'text-muted'}`}
              title="Attach"
              onClick={() => {
                setAttachOpen((v) => !v);
                setEmojiOpen(false);
              }}
            >
              <Paperclip size={20} />
            </button>
            {attachOpen && (
              <div className="absolute bottom-11 left-0 z-10 w-44 overflow-hidden rounded-xl border border-border bg-panel shadow-lg dark:border-white/10 dark:bg-[#1a1c27]">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  <ImageIcon size={16} className="text-accent" /> Photo
                </button>
                <button
                  onClick={() => docInputRef.current?.click()}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  <FileText size={16} className="text-emerald-500" /> Document
                </button>
              </div>
            )}
            <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={handlePhotoSelected} />
            <input ref={docInputRef} type="file" hidden onChange={handleDocSelected} />
          </div>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type a message"
            className="min-w-0 flex-1 rounded-full bg-appbg px-3.5 py-2.5 text-sm outline-none dark:bg-white/5 sm:px-4"
          />
          <button
            onClick={handleSend}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white hover:bg-accent-600 disabled:opacity-40"
            disabled={!draft.trim()}
          >
            <Send size={16} />
          </button>
        </div>
        )}
      </div>

      {activeCall && (
        <CallOverlay
          kind={activeCall}
          target={{
            name: chat.name,
            initials: chat.initials,
            avatarColor: chat.avatarColor,
            avatarUrl: chat.avatarUrl ?? (contactId ? getContact(contactId)?.avatarUrl : undefined),
          }}
          selfAvatarUrl={currentUser.avatarUrl}
          onEnd={() => setActiveCall(null)}
        />
      )}

      {panelTab && (
        <ContactInfoPanel
          chat={chat}
          tab={panelTab}
          messages={msgs}
          blocked={blocked}
          onClose={() => setPanelTab(null)}
          onTabChange={setPanelTab}
          onDeleteChat={handleDeleteChat}
          onBlockOrExit={handleBlockOrExit}
        />
      )}
    </div>
  );
}

function MessageBubble({ message: m, wallpaperIsLight }: { message: Message; wallpaperIsLight: boolean }) {
  const base = 'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm sm:max-w-[60%]';
  const outgoingCls = 'rounded-br-sm bg-bubbleOut text-white';
  // Incoming-bubble contrast follows the wallpaper's actual brightness, not the
  // app theme — a light wallpaper needs a light bubble + dark text even in dark
  // mode, and vice versa, otherwise text can end up invisible.
  const incomingCls = wallpaperIsLight
    ? 'rounded-bl-sm bg-white text-slate-800 shadow'
    : 'rounded-bl-sm bg-white/10 text-slate-100';

  if (m.type === 'image' && m.mediaUrl) {
    return (
      <div className={`${base} ${m.outgoing ? outgoingCls : incomingCls} !p-1.5`}>
        <img src={m.mediaUrl} alt="Shared" className="max-h-72 w-full rounded-xl object-cover" loading="lazy" />
        {m.text && <p className="px-1.5 pt-1.5">{m.text}</p>}
        <p className={`px-1.5 pt-1 text-right text-[10px] ${m.outgoing ? 'text-white/70' : 'text-muted'}`}>{m.time}</p>
      </div>
    );
  }

  if (m.type === 'doc') {
    return (
      <a
        href={m.mediaUrl ?? '#'}
        download={m.fileName}
        className={`${base} ${m.outgoing ? outgoingCls : incomingCls} flex items-center gap-3`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            m.outgoing ? 'bg-white/20' : wallpaperIsLight ? 'bg-slate-100' : 'bg-white/10'
          }`}
        >
          <FileText size={18} className={m.outgoing ? 'text-white' : 'text-emerald-500'} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{m.fileName ?? 'Document'}</span>
          <span className={`block text-[11px] ${m.outgoing ? 'text-white/70' : 'text-muted'}`}>{m.fileSize ?? 'File'}</span>
        </span>
        <Download size={16} className={m.outgoing ? 'text-white/80' : 'text-muted'} />
      </a>
    );
  }

  return (
    <div className={`${base} ${m.outgoing ? outgoingCls : incomingCls}`}>
      <p className="whitespace-pre-wrap break-words">{m.text}</p>
      <p className={`mt-1 text-right text-[10px] ${m.outgoing ? 'text-white/70' : 'text-muted'}`}>{m.time}</p>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  className = '',
}: {
  children: ReactNode;
  title: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 sm:h-9 sm:w-9 ${className}`}
    >
      {children}
    </button>
  );
}
