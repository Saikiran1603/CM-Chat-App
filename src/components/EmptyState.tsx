interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="h-28 w-28 animate-pulseSlow text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        >
          <circle cx="50" cy="50" r="42" strokeDasharray="10 8" />
          <path
            d="M50 26a24 24 0 1 0 17 41"
            strokeLinecap="round"
          />
          <path d="M67 24v14h-14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-slate-500 dark:text-slate-300">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
