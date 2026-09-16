import { useEffect, useState, ReactNode } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import Avatar from './Avatar';

export type CallKind = 'audio' | 'video';

export interface CallTarget {
  name: string;
  initials: string;
  avatarColor: string;
  avatarUrl?: string;
}

interface Props {
  kind: CallKind;
  target: CallTarget;
  onEnd: () => void;
  /** Optional second participant shown alongside (defaults to the current user). */
  selfName?: string;
  selfAvatarUrl?: string;
}

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CallOverlay({ kind, target, onEnd, selfName = 'You', selfAvatarUrl }: Props) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Simulate the connection handshake, then run the call timer.
  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [connected]);

  // Esc hangs up.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onEnd();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onEnd]);

  return (
    <div
      className={`z-30 flex flex-col bg-white dark:bg-[#12141d] ${
        expanded ? 'fixed inset-0 z-50' : 'absolute inset-0'
      }`}
    >
      {kind === 'video' ? (
        <VideoStage target={target} videoOff={videoOff} connected={connected} selfAvatarUrl={selfAvatarUrl} selfName={selfName} />
      ) : (
        <AudioStage target={target} connected={connected} selfName={selfName} selfAvatarUrl={selfAvatarUrl} />
      )}

      {/* Status line */}
      <div className="flex flex-col items-center gap-1 pb-4">
        {!connected ? (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Connecting…</p>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">Connected</p>
            <p className="text-lg font-semibold tabular-nums text-slate-800 dark:text-slate-100">{formatDuration(seconds)}</p>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pb-8">
        <ControlBtn active={muted} onClick={() => setMuted((v) => !v)} label={muted ? 'Unmute' : 'Mute'}>
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </ControlBtn>

        {kind === 'video' && (
          <ControlBtn active={videoOff} onClick={() => setVideoOff((v) => !v)} label={videoOff ? 'Start video' : 'Stop video'}>
            {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </ControlBtn>
        )}

        <ControlBtn active={speakerOff} onClick={() => setSpeakerOff((v) => !v)} label={speakerOff ? 'Speaker on' : 'Speaker off'}>
          {speakerOff ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </ControlBtn>

        <ControlBtn active={false} onClick={() => setExpanded((v) => !v)} label={expanded ? 'Exit full screen' : 'Full screen'}>
          {expanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </ControlBtn>

        <button
          onClick={onEnd}
          title="Hang up"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
        >
          <PhoneOff size={22} />
        </button>
      </div>

      <p className="pb-4 text-center text-[11px] text-muted">Press Esc to hang up</p>
    </div>
  );
}

function AudioStage({
  target,
  connected,
  selfName,
  selfAvatarUrl,
}: {
  target: CallTarget;
  connected: boolean;
  selfName: string;
  selfAvatarUrl?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <div className="flex items-center justify-center gap-8 sm:gap-14">
        <Participant name={selfName} initials="ME" color="#3366ff" avatarUrl={selfAvatarUrl} />
        <div className="relative flex items-center">
          <svg width="70" height="24" viewBox="0 0 70 24" className="text-accent">
            <path
              d="M2 12 Q 12 2, 22 12 T 42 12 T 68 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={connected ? '' : 'animate-pulseSlow'}
            />
          </svg>
        </div>
        <Participant name={target.name} initials={target.initials} color={target.avatarColor} avatarUrl={target.avatarUrl} />
      </div>
    </div>
  );
}

function VideoStage({
  target,
  videoOff,
  connected,
  selfName,
  selfAvatarUrl,
}: {
  target: CallTarget;
  videoOff: boolean;
  connected: boolean;
  selfName: string;
  selfAvatarUrl?: string;
}) {
  return (
    <div className="relative flex-1 overflow-hidden bg-slate-900">
      {/* Remote "video" feed */}
      {target.avatarUrl && !videoOff ? (
        <img src={target.avatarUrl} alt={target.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-800">
          <Avatar initials={target.initials} color={target.avatarColor} src={target.avatarUrl} size={110} />
          <p className="text-sm text-white/70">{videoOff ? 'Your video is off' : 'Camera unavailable'}</p>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute left-4 top-4 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-sm">
        <p className="text-sm font-medium text-white">{target.name}</p>
        {!connected && <p className="text-[11px] text-white/70">Connecting…</p>}
      </div>

      {/* Self preview (picture-in-picture) */}
      <div className="absolute right-4 top-4 h-28 w-20 overflow-hidden rounded-xl border-2 border-white/70 bg-slate-700 shadow-lg sm:h-36 sm:w-28">
        {videoOff ? (
          <div className="flex h-full w-full items-center justify-center">
            <VideoOff size={18} className="text-white/70" />
          </div>
        ) : selfAvatarUrl ? (
          <img src={selfAvatarUrl} alt={selfName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent text-sm font-semibold text-white">ME</div>
        )}
      </div>
    </div>
  );
}

function Participant({
  name,
  initials,
  color,
  avatarUrl,
}: {
  name: string;
  initials: string;
  color: string;
  avatarUrl?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar initials={initials} color={color} src={avatarUrl} size={96} />
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{name}</p>
    </div>
  );
}

function ControlBtn({
  children,
  active,
  onClick,
  label,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
        active
          ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  );
}
