import { useEffect, useRef, useState } from 'react';
import { api } from '@/api/client';

interface UseApiResourceResult<T> {
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  loading: boolean;
  /** True if the API call failed and we're showing the bundled fallback data instead. */
  usingFallback: boolean;
}

/**
 * Loads a json-server resource (e.g. "contacts", "chats") once on mount.
 * If the API is unreachable — offline, json-server not running locally,
 * my-json-server rate-limited — it silently falls back to the bundled
 * mock data so the app still works instead of showing a blank screen.
 */
export function useApiResource<T>(resource: string, fallback: T[]): UseApiResourceResult<T> {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getAll<T>(resource)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setUsingFallback(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(fallbackRef.current);
          setUsingFallback(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  return { data, setData, loading, usingFallback };
}
