import { Check } from 'lucide-react';
import SettingsDetail from '@/components/SettingsDetail';
import { useSettings } from '@/context/SettingsContext';

const swatches = ['#f4f5f9', '#dbeafe', '#dcfce7', '#fef3c7', '#fce7f3', '#e0e7ff', '#111827', '#0b0c12'];

export default function WallpaperPage() {
  const { wallpaper, setWallpaper } = useSettings();
  return (
    <SettingsDetail title="Chat Wallpaper">
      <p className="mb-4 max-w-md text-sm text-muted">
        Pick a background for your chat windows. This applies immediately to every conversation.
      </p>
      <div className="grid max-w-md grid-cols-4 gap-3">
        {swatches.map((color) => (
          <button
            key={color}
            onClick={() => setWallpaper(color)}
            className="flex aspect-square items-center justify-center rounded-xl border border-border dark:border-white/10"
            style={{ backgroundColor: color }}
          >
            {wallpaper === color && (
              <Check className={color === '#111827' || color === '#0b0c12' ? 'text-white' : 'text-accent'} />
            )}
          </button>
        ))}
      </div>
    </SettingsDetail>
  );
}
