import { useState } from 'react';
import { OS } from '@/types';

function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'windows';
  const platform = navigator.platform || '';
  const ua = navigator.userAgent || '';
  return /Mac|iPod|iPhone|iPad/.test(platform) || /Mac OS X/.test(ua) ? 'mac' : 'windows';
}

/** Returns the detected OS plus a manual override setter (used by the Keyboard Shortcuts toggle). */
export function useOS(): [OS, (os: OS) => void] {
  const [os, setOs] = useState<OS>(detectOS());
  return [os, setOs];
}
