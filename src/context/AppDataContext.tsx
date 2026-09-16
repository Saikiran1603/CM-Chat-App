import { createContext, useContext, ReactNode } from 'react';
import { chats as fallbackChats } from '@/data/mockData';
import { useApiResource } from '@/hooks/useApiResource';
import { api } from '@/api/client';
import { Chat } from '@/types';

interface AppDataContextValue {
  chats: Chat[];
  loading: boolean;
  addChat: (chat: Chat) => void;
  findChatByContact: (contactId: string) => Chat | undefined;
  deleteChat: (chatId: string) => void;
  togglePin: (chatId: string) => void;
  toggleMute: (chatId: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { data: chats, setData: setChats, loading } = useApiResource<Chat>('chats', fallbackChats);

  // Every mutation updates local state immediately (so the UI never waits
  // on the network) and best-effort mirrors the change to the API. On
  // my-json-server (production) writes are faked and won't persist across
  // reloads — that's a limitation of the free host, not this code. Point
  // VITE_API_URL at your own hosted json-server for real persistence.

  function addChat(chat: Chat) {
    setChats((prev) => [chat, ...prev]);
    api.create('chats', chat).catch(() => {});
  }

  function findChatByContact(contactId: string) {
    return chats.find((c) => !c.isGroup && c.members.includes(contactId));
  }

  function deleteChat(chatId: string) {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    api.remove('chats', chatId).catch(() => {});
  }

  function togglePin(chatId: string) {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    const pinned = !chat.pinned;
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned } : c)));
    api.update('chats', chatId, { pinned }).catch(() => {});
  }

  function toggleMute(chatId: string) {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    const muted = !chat.muted;
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, muted } : c)));
    api.update('chats', chatId, { muted }).catch(() => {});
  }

  return (
    <AppDataContext.Provider value={{ chats, loading, addChat, findChatByContact, deleteChat, togglePin, toggleMute }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
