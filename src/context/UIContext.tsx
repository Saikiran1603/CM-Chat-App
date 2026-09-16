import { createContext, useContext, useRef, useState, ReactNode, RefObject } from 'react';

interface UIContextValue {
  startConversationOpen: boolean;
  setStartConversationOpen: (v: boolean) => void;
  createGroupOpen: boolean;
  setCreateGroupOpen: (v: boolean) => void;
  chatSearchRef: RefObject<HTMLInputElement>;
  focusChatSearch: () => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [startConversationOpen, setStartConversationOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const chatSearchRef = useRef<HTMLInputElement>(null);

  function focusChatSearch() {
    chatSearchRef.current?.focus();
  }

  return (
    <UIContext.Provider
      value={{ startConversationOpen, setStartConversationOpen, createGroupOpen, setCreateGroupOpen, chatSearchRef, focusChatSearch }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
