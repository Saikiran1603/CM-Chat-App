export interface Contact {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  avatarUrl?: string;
  online?: boolean;
  lastSeen?: string;
  about?: string;
  blocked?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  time: string;
  outgoing: boolean;
  starred?: boolean;
  type?: 'text' | 'image' | 'doc' | 'link';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Update {
  id: string;
  contactId: string;
  type: 'image' | 'text';
  content: string;
  bgColor?: string;
  time: string;
  viewed: boolean;
}

export interface Chat {
  id: string;
  isGroup: boolean;
  name: string;
  members: string[];
  avatarColor: string;
  initials: string;
  avatarUrl?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  pinned?: boolean;
  archived?: boolean;
  muted?: boolean;
}

export interface CallLogEntry {
  id: string;
  contactId: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration?: string;
}

export type OS = 'mac' | 'windows';
export type ThemeMode = 'light' | 'dark';
