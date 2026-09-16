import { createContext, useContext, ReactNode } from 'react';
import { contacts as fallbackContacts } from '@/data/mockData';
import { useApiResource } from '@/hooks/useApiResource';
import { api } from '@/api/client';
import { Contact } from '@/types';

interface ContactsContextValue {
  contacts: Contact[];
  blockedIds: string[];
  loading: boolean;
  getContact: (id: string) => Contact | undefined;
  isBlocked: (id: string) => boolean;
  blockContact: (id: string) => void;
  unblockContact: (id: string) => void;
}

const ContactsContext = createContext<ContactsContextValue | undefined>(undefined);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const { data: contacts, setData: setContacts, loading } = useApiResource<Contact>('contacts', fallbackContacts);

  function getContact(id: string) {
    return contacts.find((c) => c.id === id);
  }

  function isBlocked(id: string) {
    return getContact(id)?.blocked ?? false;
  }

  function setBlocked(id: string, blocked: boolean) {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, blocked } : c)));
    // Persisted as a field on the contact itself, not a separate resource —
    // my-json-server's free tier caps public repos at 5 top-level resources,
    // and contacts/chats/messages/callLog/updates already uses all 5.
    api.update('contacts', id, { blocked }).catch(() => {});
  }

  const blockContact = (id: string) => setBlocked(id, true);
  const unblockContact = (id: string) => setBlocked(id, false);
  const blockedIds = contacts.filter((c) => c.blocked).map((c) => c.id);

  return (
    <ContactsContext.Provider
      value={{ contacts, blockedIds, loading, getContact, isBlocked, blockContact, unblockContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const ctx = useContext(ContactsContext);
  if (!ctx) throw new Error('useContacts must be used within ContactsProvider');
  return ctx;
}
