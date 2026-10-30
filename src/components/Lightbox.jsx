import { useEffect, useRef } from 'react';

export default function Lightbox({ isOpen, current, index, total, onClose, onNext, onPrev }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement;
      closeRef.current?.focus();
    } else if (returnFocusRef.current instanceof HTMLElement) {
      returnFocusRef.current.focus();
      returnFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const focusable = () =>
      dialog.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

    const onTab = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = [...focusable()];
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener('keydown', onTab);
    return () => dialog.removeEventListener('keydown', onTab);
  }, [isOpen]);

  if (!isOpen || !current) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lightbox-inner">
        <button
          ref={closeRef}
          type="button"
          className="lightbox-close"
          aria-label="Close image"
          onClick={onClose}
        >
          ×
        </button>

        {total > 1 ? (
          <>
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              aria-label="Previous image"
              onClick={onPrev}
            >
              ‹
            </button>
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              aria-label="Next image"
              onClick={onNext}
            >
              ›
            </button>
          </>
        ) : null}

        <img src={current.src} alt={current.alt || current.title || ''} />
        <p className="lightbox-caption">
          {current.title}
          {total > 1 ? (
            <span>
              {' '}
              · {index + 1} / {total}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
