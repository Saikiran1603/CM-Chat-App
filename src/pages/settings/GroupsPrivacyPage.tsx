import SettingsDetail from '@/components/SettingsDetail';
import RadioGroup from '@/components/RadioGroup';
import { useSettings } from '@/context/SettingsContext';

export default function GroupsPrivacyPage() {
  const { privacy, setPrivacy } = useSettings();
  return (
    <SettingsDetail title="Groups">
      <p className="mb-4 max-w-md text-sm text-muted">Choose who can add you to groups.</p>
      <RadioGroup
        value={privacy.groups}
        onChange={(v) => setPrivacy('groups', v)}
        options={[
          { value: 'everyone', label: 'Everyone' },
          { value: 'contacts', label: 'My Contacts' },
          { value: 'nobody', label: "Nobody (I'll get an invite instead)" },
        ]}
      />
    </SettingsDetail>
  );
}
