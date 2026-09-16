import SettingsDetail from '@/components/SettingsDetail';
import RadioGroup from '@/components/RadioGroup';
import { useSettings } from '@/context/SettingsContext';

export default function LastSeenPage() {
  const { privacy, setPrivacy } = useSettings();
  return (
    <SettingsDetail title="Last Seen">
      <p className="mb-4 max-w-md text-sm text-muted">Choose who can see when you were last online.</p>
      <RadioGroup
        value={privacy.lastSeen}
        onChange={(v) => setPrivacy('lastSeen', v)}
        options={[
          { value: 'everyone', label: 'Everyone' },
          { value: 'contacts', label: 'My Contacts' },
          { value: 'nobody', label: 'Nobody' },
        ]}
      />
    </SettingsDetail>
  );
}
