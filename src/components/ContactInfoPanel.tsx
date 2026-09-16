import { ReactNode } from 'react';
import { X, Star, Image as ImageIcon, FileText, Link2, Ban, Trash2, Download, ArrowLeft } from 'lucide-react';
import { Chat, Message } from '@/types';
import Avatar from './Avatar';
import { useContacts } from '@/context/ContactsContext';

export type InfoPanelTab = 'info' | 'media' | 'starred' | 'search' | 'more';

interface Props {
  chat: Chat;
  tab: InfoPanelTab;
  messages: Message[];
  blocked: boolean;
  onClose: () => void;
  onTabChange: (t: InfoPanelTab) => void;
  onDeleteChat: () => void;
  onBlockOrExit: () => void;
}

const tabs: { id: InfoPanelTab; label: string }[] = [
  { id: 'info', label: 'Contact Info' },
  { id: 'media', label: 'Shared content' },
  { id: 'starred', label: 'Starred' },
];

export default function ContactInfoPanel({ chat, tab, messages, blocked, onClose, onTabChange, onDeleteChat, onBlockOrExit }: Props) {
  const { getContact } = useContacts();
  const starred = messages.filter((m) => m.starred);
  const media = messages.filter((m) => m.type === 'image' && m.mediaUrl);
  const docs = messages.filter((m) => m.type === 'doc');

  return (
    <aside className="fixed inset-0 z-40 flex h-full w-full flex-col bg-panel dark:bg-[#15161f] lg:static lg:z-auto lg:w-[320px] lg:shrink-0 lg:border-l lg:border-border lg:dark:border-white/10">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 dark:border-white/10">
        <button onClick={onClose} className="rounded-full p-1 text-muted hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden">
          <ArrowLeft size={18} />
        </button>
        <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {tab === 'search' ? 'Search in chat' : tab === 'more' ? 'More options' : 'Details'}
        </span>
        <button onClick={onClose} className="hidden rounded-full p-1 text-muted hover:bg-slate-100 dark:hover:bg-white/10 lg:block">
          <X size={16} />
        </button>
      </div>

      {tab === 'search' && (
        <div className="p-4">
          <input
            autoFocus
            placeholder="Search messages"
            className="w-full rounded-lg bg-appbg px-3 py-2 text-sm outline-none dark:bg-white/5"
          />
          <p className="mt-4 text-center text-xs text-muted">Type to search messages in this conversation</p>
        </div>
      )}

      {tab === 'more' && (
        <div className="p-2">
          <MoreRow
            icon={<Ban size={16} />}
            label={chat.isGroup ? 'Exit group' : blocked ? 'Unblock contact' : 'Block contact'}
            danger
            onClick={onBlockOrExit}
          />
          <MoreRow icon={<Trash2 size={16} />} label="Delete chat" danger onClick={onDeleteChat} />
        </div>
      )}

      {(tab === 'info' || tab === 'media' || tab === 'starred') && (
        <>
          <div className="flex flex-col items-center gap-2 border-b border-border px-4 py-6 dark:border-white/10">
            <Avatar initials={chat.initials} color={chat.avatarColor} src={chat.avatarUrl} size={72} />
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{chat.name}</p>
            <p className="text-xs text-muted">{chat.isGroup ? `${chat.members.length} members` : 'Online'}</p>
          </div>

          <div className="flex border-b border-border dark:border-white/10">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`flex-1 border-b-2 py-2.5 text-xs font-medium transition-colors ${
                  tab === t.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {tab === 'info' && (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase text-muted">About</p>
                  <p className="mt-1 text-slate-700 dark:text-slate-200">Hey there! I am using CM Chat.</p>
                </div>
                {chat.isGroup && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase text-muted">{chat.members.length} members</p>
                    <div className="space-y-2">
                      {chat.members.map((id) => {
                        const member = getContact(id);
                        return (
                          <div key={id} className="flex items-center gap-2">
                            <Avatar
                              initials={member?.initials ?? id.slice(0, 2).toUpperCase()}
                              color={member?.avatarColor ?? '#94a3b8'}
                              src={member?.avatarUrl}
                              size={28}
                              online={member?.online}
                            />
                            <span className="text-slate-700 dark:text-slate-200">{member?.name ?? `Member ${id}`}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'media' && (
              <div className="space-y-5">
                <MediaSection icon={<ImageIcon size={14} />} label={`Media (${media.length})`}>
                  {media.length === 0 ? (
                    <p className="text-xs text-muted">No media shared yet</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5">
                      {media.map((m) => (
                        <a key={m.id} href={m.mediaUrl} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-md">
                          <img src={m.mediaUrl} alt="Shared media" className="h-full w-full object-cover" loading="lazy" />
                        </a>
                      ))}
                    </div>
                  )}
                </MediaSection>
                <MediaSection icon={<Link2 size={14} />} label="Links">
                  <p className="text-xs text-muted">No links shared yet</p>
                </MediaSection>
                <MediaSection icon={<FileText size={14} />} label={`Docs (${docs.length})`}>
                  {docs.length === 0 ? (
                    <p className="text-xs text-muted">No documents shared yet</p>
                  ) : (
                    <div className="space-y-2">
                      {docs.map((d) => (
                        <a
                          key={d.id}
                          href={d.mediaUrl ?? '#'}
                          download={d.fileName}
                          className="flex items-center gap-3 rounded-lg bg-appbg p-2.5 dark:bg-white/5"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-white/10">
                            <FileText size={16} className="text-emerald-500" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-medium text-slate-700 dark:text-slate-200">{d.fileName}</span>
                            <span className="block text-[10px] text-muted">{d.fileSize}</span>
                          </span>
                          <Download size={14} className="text-muted" />
                        </a>
                      ))}
                    </div>
                  )}
                </MediaSection>
              </div>
            )}

            {tab === 'starred' && (
              <div className="space-y-3">
                {starred.length === 0 && <p className="text-center text-xs text-muted">No starred messages</p>}
                {starred.map((m) => (
                  <div key={m.id} className="rounded-lg bg-appbg p-3 text-sm dark:bg-white/5">
                    <div className="mb-1 flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] text-muted">{m.time}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200">{m.text || (m.type === 'image' ? 'Photo' : m.fileName)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

function MediaSection({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase text-muted">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function MoreRow({ icon, label, danger, onClick }: { icon: ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5 ${
        danger ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
