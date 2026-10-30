import { useCallback, useEffect, useState } from 'react';

/**
 * Manage lightbox open state and keyboard navigation across a list of items.
 * @param {Array<{ src: string, alt?: string, title?: string }>} items
 */
export function useLightbox(items = []) {
  const [index, setIndex] = useState(null);
  const isOpen = index !== null && index >= 0;
  const current = isOpen ? items[index] ?? null : null;

  const open = useCallback((i) => {
    if (i < 0 || i >= items.length) return;
    setIndex(i);
  }, [items.length]);

  const close = useCallback(() => setIndex(null), []);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i === null || items.length === 0) return i;
      return (i + 1) % items.length;
    });
  }, [items.length]);

  const prev = useCallback(() => {
    setIndex((i) => {
      if (i === null || items.length === 0) return i;
      return (i - 1 + items.length) % items.length;
    });
  }, [items.length]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, next, prev]);

  return { isOpen, index, current, open, close, next, prev };
}
