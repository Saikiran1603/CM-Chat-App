import SettingsDetail from '@/components/SettingsDetail';
import RadioGroup from '@/components/RadioGroup';
import { useSettings } from '@/context/SettingsContext';

export default function ProfilePhotoPrivacyPage() {
  const { privacy, setPrivacy } = useSettings();
  return (
    <SettingsDetail title="Profile Photo">
      <p className="mb-4 max-w-md text-sm text-muted">Choose who can see your profile photo.</p>
      <RadioGroup
        value={privacy.profilePhoto}
        onChange={(v) => setPrivacy('profilePhoto', v)}
        options={[
          { value: 'everyone', label: 'Everyone' },
          { value: 'contacts', label: 'My Contacts' },
          { value: 'nobody', label: 'Nobody' },
        ]}
      />
    </SettingsDetail>
  );
}
