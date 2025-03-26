import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: KeyHandler;
}

interface UseKeyboardShortcutOptions {
  shortcuts: Shortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcut = ({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      shortcuts.forEach((shortcut) => {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = !shortcut.ctrlKey || event.ctrlKey;
        const matchesShift = !shortcut.shiftKey || event.shiftKey;
        const matchesAlt = !shortcut.altKey || event.altKey;
        const matchesMeta = !shortcut.metaKey || event.metaKey;

        if (
          matchesKey &&
          matchesCtrl &&
          matchesShift &&
          matchesAlt &&
          matchesMeta
        ) {
          event.preventDefault();
          shortcut.handler(event);
        }
      });
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}; 