import { useParams } from 'react-router-dom';
import ChatListPanel from '@/components/ChatListPanel';
import ChatWindow from '@/components/ChatWindow';
import EmptyState from '@/components/EmptyState';
import { useAppData } from '@/context/AppDataContext';

export default function ChatsPage() {
  const { chatId } = useParams();
  const { chats } = useAppData();
  const chat = chats.find((c) => c.id === chatId);

  return (
    <div className="flex h-full w-full">
      <ChatListPanel activeId={chatId} />
      <div className={`h-full min-w-0 flex-1 bg-panel dark:bg-[#0f1017] ${chatId ? 'flex' : 'hidden md:flex'}`}>
        {chat ? (
          <ChatWindow key={chat.id} chat={chat} />
        ) : (
          <EmptyState title="CM Chat App" subtitle="Select a conversation to start messaging" />
        )}
      </div>
    </div>
  );
}
