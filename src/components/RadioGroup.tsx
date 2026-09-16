interface Option {
  value: string;
  label: string;
  desc?: string;
}

export default function RadioGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <div className="max-w-md space-y-1 rounded-xl border border-border dark:border-white/10">
      {options.map((opt, i) => (
        <label
          key={opt.value}
          className={`flex cursor-pointer items-center justify-between px-4 py-3.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5 ${
            i !== options.length - 1 ? 'border-b border-border dark:border-white/10' : ''
          }`}
        >
          <div>
            <p className="text-slate-800 dark:text-slate-100">{opt.label}</p>
            {opt.desc && <p className="text-xs text-muted">{opt.desc}</p>}
          </div>
          <input
            type="radio"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 accent-accent"
          />
        </label>
      ))}
    </div>
  );
}
