import { useState } from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  src?: string;
  size?: number;
  online?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export default function Avatar({ initials, color, src, size = 40, online, className = '', onClick, title }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      title={title}
      className={`relative shrink-0 ${onClick ? 'cursor-pointer transition-transform hover:scale-105' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={src}
          alt={initials}
          onError={() => setFailed(true)}
          className="h-full w-full rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full font-semibold text-white"
          style={{ backgroundColor: color, fontSize: size * 0.38 }}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-emerald-500 dark:border-[#1a1c27]"
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </Wrapper>
  );
}
