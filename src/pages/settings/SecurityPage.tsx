import SettingsDetail from '@/components/SettingsDetail';
import Toggle from '@/components/Toggle';
import { useSettings } from '@/context/SettingsContext';

export default function SecurityPage() {
  const { security, setSecurity } = useSettings();

  return (
    <SettingsDetail title="Security">
      <div className="max-w-lg divide-y divide-border dark:divide-white/10">
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Two-step verification</p>
            <p className="text-xs text-muted">Add an extra layer of security to your account</p>
          </div>
          <Toggle checked={security.twoFactor} onChange={(v) => setSecurity('twoFactor', v)} />
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">New login alerts</p>
            <p className="text-xs text-muted">Get notified when your account is used on a new device</p>
          </div>
          <Toggle checked={security.loginAlerts} onChange={(v) => setSecurity('loginAlerts', v)} />
        </div>
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Read receipts</p>
            <p className="text-xs text-muted">Let others see when you've read their messages</p>
          </div>
          <Toggle checked={security.readReceipts} onChange={(v) => setSecurity('readReceipts', v)} />
        </div>
      </div>
    </SettingsDetail>
  );
}
