import { createContext, useContext, ReactNode } from 'react';
import { contacts as fallbackContacts } from '@/data/mockData';
import { useApiResource } from '@/hooks/useApiResource';
import { Contact } from '@/types';

interface ContactsContextValue {
  contacts: Contact[];
  loading: boolean;
  getContact: (id: string) => Contact | undefined;
}

const ContactsContext = createContext<ContactsContextValue | undefined>(undefined);

export function ContactsProvider({ children }: { children: ReactNode }) {
  const { data: contacts, loading } = useApiResource<Contact>('contacts', fallbackContacts);

  function getContact(id: string) {
    return contacts.find((c) => c.id === id);
  }

  return <ContactsContext.Provider value={{ contacts, loading, getContact }}>{children}</ContactsContext.Provider>;
}

export function useContacts() {
  const ctx = useContext(ContactsContext);
  if (!ctx) throw new Error('useContacts must be used within ContactsProvider');
  return ctx;
}
