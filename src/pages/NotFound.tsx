import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-panel dark:bg-[#0f1017]">
      <p className="text-6xl font-bold text-accent">404</p>
      <p className="text-sm text-muted">This page doesn't exist.</p>
      <Link to="/" className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600">
        Back to Chats
      </Link>
    </div>
  );
}
