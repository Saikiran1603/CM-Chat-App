import { Contact, Chat, Message, CallLogEntry, Update } from '@/types';

export const contacts: Contact[] = [
  { id: 'u1', avatarUrl: 'https://i.pravatar.cc/300?img=47', name: 'Layla Kian', initials: 'LK', avatarColor: '#3366ff', online: true, about: 'Living my best life ✨', lastSeen: 'Online' },
  { id: 'u2', avatarUrl: 'https://i.pravatar.cc/300?img=12', name: 'Broad Bridget', initials: 'BB', avatarColor: '#f59e0b', online: false, about: 'At the gym 💪', lastSeen: 'Today at 09:12' },
  { id: 'u3', avatarUrl: 'https://i.pravatar.cc/300?img=32', name: 'Kyalinda', initials: 'KY', avatarColor: '#10b981', online: true, about: 'Busy building things', lastSeen: 'Online' },
  { id: 'u4', avatarUrl: 'https://i.pravatar.cc/300?img=13', name: 'Marcus Hale', initials: 'MH', avatarColor: '#ef4444', online: false, about: 'Coffee first.', lastSeen: 'Yesterday at 22:40' },
  { id: 'u5', avatarUrl: 'https://i.pravatar.cc/300?img=45', name: 'Priya N.', initials: 'PN', avatarColor: '#8b5cf6', online: false, about: 'Traveling ✈️', lastSeen: '2 days ago' },
  { id: 'u6', avatarUrl: 'https://i.pravatar.cc/300?img=15', name: 'Diego R.', initials: 'DR', avatarColor: '#06b6d4', online: true, about: 'Available', lastSeen: 'Online' },
  { id: 'u7', avatarUrl: 'https://i.pravatar.cc/300?img=44', name: 'Amara O.', initials: 'AO', avatarColor: '#ec4899', online: false, about: 'Design is thinking made visual', lastSeen: 'Today at 07:03' },
  { id: 'u8', avatarUrl: 'https://i.pravatar.cc/300?img=18', name: 'Noah F.', initials: 'NF', avatarColor: '#84cc16', online: false, about: 'On leave', lastSeen: '3 days ago' },
];

export const chats: Chat[] = [
  { id: 'c1', avatarUrl: 'https://i.pravatar.cc/300?img=47', isGroup: false, name: 'Layla Kian', members: ['u1'], avatarColor: '#3366ff', initials: 'LK', lastMessage: 'Sounds great, see you then!', lastTime: '09:41', unread: 2, pinned: true },
  { id: 'c2', avatarUrl: 'https://i.pravatar.cc/300?img=12', isGroup: false, name: 'Broad Bridget', members: ['u2'], avatarColor: '#f59e0b', initials: 'BB', lastMessage: 'Sent a photo', lastTime: '09:02', unread: 0 },
  { id: 'c3', isGroup: true, name: 'Product Team', members: ['u1', 'u3', 'u6'], avatarColor: '#10b981', initials: 'PT', lastMessage: 'Kyalinda: Updated the deck', lastTime: 'Yesterday', unread: 5 },
  { id: 'c4', avatarUrl: 'https://i.pravatar.cc/300?img=13', isGroup: false, name: 'Marcus Hale', members: ['u4'], avatarColor: '#ef4444', initials: 'MH', lastMessage: 'Call me when free', lastTime: 'Yesterday', unread: 0 },
  { id: 'c5', avatarUrl: 'https://i.pravatar.cc/300?img=45', isGroup: false, name: 'Priya N.', members: ['u5'], avatarColor: '#8b5cf6', initials: 'PN', lastMessage: 'Landed safely 🛬', lastTime: 'Mon', unread: 0 },
  { id: 'c6', isGroup: true, name: 'Weekend Trip', members: ['u2', 'u6', 'u7'], avatarColor: '#06b6d4', initials: 'WT', lastMessage: 'Amara: Booked the cabin', lastTime: 'Sun', unread: 0 },
  { id: 'c7', avatarUrl: 'https://i.pravatar.cc/300?img=44', isGroup: false, name: 'Amara O.', members: ['u7'], avatarColor: '#ec4899', initials: 'AO', lastMessage: 'Thanks so much!', lastTime: 'Sat', unread: 0 },
  { id: 'c8', avatarUrl: 'https://i.pravatar.cc/300?img=18', isGroup: false, name: 'Noah F.', members: ['u8'], avatarColor: '#84cc16', initials: 'NF', lastMessage: 'Sure, works for me', lastTime: '08/09', unread: 0 },
];

export const messages: Message[] = [
  { id: 'm1', chatId: 'c1', senderId: 'u1', text: 'Hey! Are we still on for the sync tomorrow?', time: '09:32', outgoing: false },
  { id: 'm2', chatId: 'c1', senderId: 'me', text: 'Yes definitely, 10am works for me', time: '09:35', outgoing: true },
  { id: 'm3', chatId: 'c1', senderId: 'u1', text: 'Perfect, I will send the agenda tonight', time: '09:36', outgoing: false, starred: true },
  {
    id: 'm3b',
    chatId: 'c1',
    senderId: 'u1',
    text: '',
    time: '09:38',
    outgoing: false,
    type: 'doc',
    fileName: 'Sync-Agenda.pdf',
    fileSize: '212 KB',
  },
  { id: 'm4', chatId: 'c1', senderId: 'me', text: 'Sounds great, see you then!', time: '09:41', outgoing: true },
  {
    id: 'm5',
    chatId: 'c2',
    senderId: 'u2',
    text: 'Check this out',
    time: '08:58',
    outgoing: false,
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/cmchat-gym/500/360',
  },
  { id: 'm6', chatId: 'c2', senderId: 'me', text: 'Nice! Where was this taken?', time: '09:00', outgoing: true },
  {
    id: 'm7',
    chatId: 'c2',
    senderId: 'u2',
    text: '',
    time: '09:02',
    outgoing: false,
    type: 'image',
    mediaUrl: 'https://picsum.photos/seed/cmchat-run/500/360',
  },
  { id: 'm8', chatId: 'c3', senderId: 'u3', text: 'Updated the deck with the new numbers', time: 'Yesterday', outgoing: false },
  {
    id: 'm8b',
    chatId: 'c3',
    senderId: 'u3',
    text: '',
    time: 'Yesterday',
    outgoing: false,
    type: 'doc',
    fileName: 'Q3-Product-Deck.pptx',
    fileSize: '4.8 MB',
  },
  { id: 'm9', chatId: 'c3', senderId: 'u6', text: 'Looks good, minor tweak on slide 4', time: 'Yesterday', outgoing: false },
];

export const callLog: CallLogEntry[] = [
  { id: 'cl1', contactId: 'u1', type: 'video', direction: 'incoming', time: 'Today, 09:15', duration: '12:04' },
  { id: 'cl2', contactId: 'u3', type: 'audio', direction: 'outgoing', time: 'Today, 08:02', duration: '03:21' },
  { id: 'cl3', contactId: 'u4', type: 'audio', direction: 'missed', time: 'Yesterday, 22:40' },
  { id: 'cl4', contactId: 'u6', type: 'video', direction: 'outgoing', time: 'Yesterday, 18:11', duration: '25:47' },
  { id: 'cl5', contactId: 'u7', type: 'audio', direction: 'incoming', time: 'Mon, 14:03', duration: '01:09' },
  { id: 'cl6', contactId: 'u8', type: 'video', direction: 'missed', time: 'Sun, 11:22' },
];

export const updates: Update[] = [
  { id: 'up1', contactId: 'u1', type: 'image', content: 'https://picsum.photos/seed/cmchat-status1/400/720', time: '10m ago', viewed: false },
  { id: 'up2', contactId: 'u3', type: 'text', content: 'Shipping the new release today 🚀', bgColor: '#3366ff', time: '35m ago', viewed: false },
  { id: 'up3', contactId: 'u6', type: 'image', content: 'https://picsum.photos/seed/cmchat-status2/400/720', time: '1h ago', viewed: false },
  { id: 'up4', contactId: 'u7', type: 'text', content: 'Coffee ☕ then design review', bgColor: '#ec4899', time: '3h ago', viewed: true },
  { id: 'up5', contactId: 'u2', type: 'image', content: 'https://picsum.photos/seed/cmchat-status3/400/720', time: 'Yesterday', viewed: true },
];

export function getContact(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id);
}

/** The signed-in user. */
export const currentUser: Contact = {
  id: 'me',
  name: 'Snorlax User',
  initials: 'ME',
  avatarColor: '#3366ff',
  avatarUrl: 'https://i.pravatar.cc/300?img=68',
  about: 'Hey there! I am using CM Chat.',
  online: true,
};
