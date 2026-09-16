import SettingsDetail from '@/components/SettingsDetail';
import RadioGroup from '@/components/RadioGroup';
import { useSettings } from '@/context/SettingsContext';

export default function AboutPrivacyPage() {
  const { privacy, setPrivacy } = useSettings();
  return (
    <SettingsDetail title="About">
      <p className="mb-4 max-w-md text-sm text-muted">Choose who can see your About info.</p>
      <RadioGroup
        value={privacy.about}
        onChange={(v) => setPrivacy('about', v)}
        options={[
          { value: 'everyone', label: 'Everyone' },
          { value: 'contacts', label: 'My Contacts' },
          { value: 'nobody', label: 'Nobody' },
        ]}
      />
    </SettingsDetail>
  );
}
