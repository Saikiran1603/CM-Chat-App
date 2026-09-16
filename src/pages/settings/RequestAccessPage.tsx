import { useState } from 'react';
import SettingsDetail from '@/components/SettingsDetail';

export default function RequestAccessPage() {
  const [requested, setRequested] = useState(false);
  return (
    <SettingsDetail title="Request Account Info">
      <div className="max-w-md space-y-4">
        <p className="text-sm text-muted">
          You can request a report of your account information, including your profile and settings. This may take up
          to 24 hours to prepare.
        </p>
        <button
          disabled={requested}
          onClick={() => setRequested(true)}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {requested ? 'Report requested' : 'Request report'}
        </button>
      </div>
    </SettingsDetail>
  );
}
