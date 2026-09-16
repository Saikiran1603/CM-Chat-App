import SettingsDetail from '@/components/SettingsDetail';
import Toggle from '@/components/Toggle';
import { useSettings } from '@/context/SettingsContext';

const rows: { key: 'messageNotifications' | 'sound' | 'groupNotifications' | 'callNotifications' | 'reactionNotifications'; label: string; desc: string }[] = [
  { key: 'messageNotifications', label: 'Message notifications', desc: 'Show a notification for new messages' },
  { key: 'sound', label: 'Sound', desc: 'Play a sound for incoming messages' },
  { key: 'groupNotifications', label: 'Group notifications', desc: 'Show notifications for group activity' },
  { key: 'callNotifications', label: 'Call notifications', desc: 'Show a notification for incoming calls' },
  { key: 'reactionNotifications', label: 'Reaction notifications', desc: 'Notify when someone reacts to your message' },
];

export default function NotificationsPage() {
  const { notifications, setNotification } = useSettings();

  return (
    <SettingsDetail title="Notifications">
      <div className="max-w-lg divide-y divide-border dark:divide-white/10">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{r.label}</p>
              <p className="text-xs text-muted">{r.desc}</p>
            </div>
            <Toggle checked={notifications[r.key]} onChange={(v) => setNotification(r.key, v)} />
          </div>
        ))}
      </div>
    </SettingsDetail>
  );
}
