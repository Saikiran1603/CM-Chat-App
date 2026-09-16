import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUI } from '@/context/UIContext';

export function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

/**
 * App-wide shortcuts that work reliably in every browser.
 * These deliberately avoid Ctrl/Cmd+letter combos that Chrome/Firefox/Safari
 * reserve for themselves (New Tab, New Window, Find, Print, etc.) and cannot
 * be overridden by any website. They only fire when focus isn't in a text
 * field, so they never interfere with typing.
 */
export function useGlobalShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStartConversationOpen, setCreateGroupOpen, focusChatSearch } = useUI();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case '/':
          e.preventDefault();
          if (location.pathname !== '/') navigate('/');
          setTimeout(focusChatSearch, 0);
          break;
        case 'n':
          e.preventDefault();
          navigate('/');
          setStartConversationOpen(true);
          break;
        case 'g':
          e.preventDefault();
          navigate('/groups');
          setCreateGroupOpen(true);
          break;
        case 's':
          e.preventDefault();
          navigate('/settings');
          break;
        case 'p':
          e.preventDefault();
          navigate('/profile');
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, location.pathname, setStartConversationOpen, setCreateGroupOpen, focusChatSearch]);
}
