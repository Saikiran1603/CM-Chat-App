import { createContext, useContext, useState, ReactNode } from 'react';
import { chats as initialChats } from '@/data/mockData';
import { Chat } from '@/types';

interface AppDataContextValue {
  chats: Chat[];
  blockedIds: string[];
  addChat: (chat: Chat) => void;
  findChatByContact: (contactId: string) => Chat | undefined;
  deleteChat: (chatId: string) => void;
  togglePin: (chatId: string) => void;
  toggleMute: (chatId: string) => void;
  blockContact: (contactId: string) => void;
  unblockContact: (contactId: string) => void;
  isBlocked: (contactId: string) => boolean;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  function addChat(chat: Chat) {
    setChats((prev) => [chat, ...prev]);
  }

  function findChatByContact(contactId: string) {
    return chats.find((c) => !c.isGroup && c.members.includes(contactId));
  }

  function deleteChat(chatId: string) {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
  }

  function togglePin(chatId: string) {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned: !c.pinned } : c)));
  }

  function toggleMute(chatId: string) {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, muted: !c.muted } : c)));
  }

  function blockContact(contactId: string) {
    setBlockedIds((prev) => (prev.includes(contactId) ? prev : [...prev, contactId]));
  }

  function unblockContact(contactId: string) {
    setBlockedIds((prev) => prev.filter((id) => id !== contactId));
  }

  function isBlocked(contactId: string) {
    return blockedIds.includes(contactId);
  }

  return (
    <AppDataContext.Provider
      value={{ chats, blockedIds, addChat, findChatByContact, deleteChat, togglePin, toggleMute, blockContact, unblockContact, isBlocked }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
