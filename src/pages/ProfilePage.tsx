import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { currentUser } from '@/data/mockData';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('Snorlax User');
  const [about, setAbout] = useState('Hey there! I am using CM Chat.');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex h-full w-full flex-col bg-panel dark:bg-[#0f1017]">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 dark:border-white/10">
        <button className="text-muted md:hidden" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Profile</h2>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar initials={currentUser.initials} color={currentUser.avatarColor} src={currentUser.avatarUrl} size={100} />
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow">
              <Camera size={14} />
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent dark:border-white/10"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-accent dark:border-white/10"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-600"
          >
            {saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
