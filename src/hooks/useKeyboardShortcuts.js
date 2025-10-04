import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is typing in an input
      if (event.target.tagName === 'INPUT' ||
          event.target.tagName === 'TEXTAREA' ||
          event.target.isContentEditable) {
        return;
      }

      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;

      for (const shortcut of shortcuts) {
        if (shortcut.key === key &&
            (shortcut.ctrl === undefined || shortcut.ctrl === ctrl) &&
            (shortcut.shift === undefined || shortcut.shift === shift)) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
