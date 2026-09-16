import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import ChatsPage from '@/pages/ChatsPage';
import UpdatesPage from '@/pages/UpdatesPage';
import CallsPage from '@/pages/CallsPage';
import GroupsPage from '@/pages/GroupsPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsLayout from '@/pages/SettingsLayout';
import NotificationsPage from '@/pages/settings/NotificationsPage';
import PrivacyPage from '@/pages/settings/PrivacyPage';
import LastSeenPage from '@/pages/settings/LastSeenPage';
import ProfilePhotoPrivacyPage from '@/pages/settings/ProfilePhotoPrivacyPage';
import AboutPrivacyPage from '@/pages/settings/AboutPrivacyPage';
import GroupsPrivacyPage from '@/pages/settings/GroupsPrivacyPage';
import BlockedContactsPage from '@/pages/settings/BlockedContactsPage';
import SecurityPage from '@/pages/settings/SecurityPage';
import ThemePage from '@/pages/settings/ThemePage';
import WallpaperPage from '@/pages/settings/WallpaperPage';
import RequestAccessPage from '@/pages/settings/RequestAccessPage';
import KeyboardShortcutsPage from '@/pages/settings/KeyboardShortcutsPage';
import HelpPage from '@/pages/settings/HelpPage';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ChatsPage />} />
        <Route path="chat/:chatId" element={<ChatsPage />} />
        <Route path="updates" element={<UpdatesPage />} />
        <Route path="calls" element={<CallsPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="profile" element={<ProfilePage />} />

        <Route path="settings" element={<SettingsLayout />}>
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="privacy" element={<PrivacyPage />}>
            <Route path="last-seen" element={<LastSeenPage />} />
            <Route path="profile-photo" element={<ProfilePhotoPrivacyPage />} />
            <Route path="about" element={<AboutPrivacyPage />} />
            <Route path="groups" element={<GroupsPrivacyPage />} />
            <Route path="blocked-contacts" element={<BlockedContactsPage />} />
          </Route>
          <Route path="security" element={<SecurityPage />} />
          <Route path="theme" element={<ThemePage />} />
          <Route path="wallpaper" element={<WallpaperPage />} />
          <Route path="request-access" element={<RequestAccessPage />} />
          <Route path="keyboard-shortcuts" element={<KeyboardShortcutsPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
