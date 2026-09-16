import { Outlet } from 'react-router-dom';
import IconRail from './IconRail';
import StartNewConversationModal from './StartNewConversationModal';
import CreateGroupModal from './CreateGroupModal';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { useUI } from '@/context/UIContext';

export default function AppLayout() {
  useGlobalShortcuts();
  const { startConversationOpen, setStartConversationOpen, createGroupOpen, setCreateGroupOpen } = useUI();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-appbg dark:bg-[#0b0c12] md:flex-row">
      <main className="order-1 flex h-full min-h-0 min-w-0 flex-1 md:order-2">
        <Outlet />
      </main>
      <div className="order-2 shrink-0 md:order-1">
        <IconRail />
      </div>

      {/* Modals live here so they can be triggered globally (rail quick-actions, keyboard shortcuts) */}
      <StartNewConversationModal open={startConversationOpen} onClose={() => setStartConversationOpen(false)} />
      <CreateGroupModal open={createGroupOpen} onClose={() => setCreateGroupOpen(false)} />
    </div>
  );
}
