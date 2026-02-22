import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  pageSize: number;
  onSelect: (n: number) => void;
  disabled?: boolean;
  /** When true, renders inside a parent segmented group — removes own border/radius */
  compact?: boolean;
}

export function SelectNPanel({ pageSize, onSelect, disabled, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Position popup below the trigger button using fixed coords
  function openPopup() {
    if (disabled) return;
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPopupPos({ top: r.bottom + 8, left: r.left });
    }
    setOpen(v => !v);
  }

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    function close(e: PointerEvent) {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    function onScroll() { setOpen(false); }
    document.addEventListener('pointerdown', close);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('pointerdown', close);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  function apply() {
    onSelect(Math.max(1, Math.min(count, pageSize)));
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter')  apply();
    if (e.key === 'Escape') setOpen(false);
  }

  const popup = open ? createPortal(
    <div
      ref={popupRef}
      className="select-n-popup animate-scale-in"
      style={{ top: popupPos.top, left: popupPos.left }}
      role="dialog"
      aria-label="Select N rows panel"
    >
      <p className="text-[11px] font-semibold text-(--text-2) tracking-[.45px] uppercase mb-3 select-none">
        Select first N rows
      </p>

      <div className="flex items-center gap-2">
        {/* Stepper */}
        <div className="flex items-center rounded-[10px] border border-(--border) overflow-hidden bg-(--surface)">
          <button
            onClick={() => setCount(c => Math.max(1, c - 1))}
            className="w-8 h-8 flex items-center justify-center text-(--text-2) hover:bg-(--surface-2) hover:text-(--text-1) transition-colors cursor-pointer text-[18px] font-light leading-none select-none"
            aria-label="Decrease"
          >−</button>
          <input
            type="number"
            value={count}
            min={1}
            max={pageSize}
            onChange={e => {
              const v = parseInt(e.target.value);
              if (!isNaN(v)) setCount(Math.max(1, Math.min(pageSize, v)));
            }}
            onKeyDown={handleKey}
            className="w-10 h-8 text-center text-[13px] font-semibold text-(--text-1) bg-(--surface) border-x border-(--border) focus:outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Row count"
          />
          <button
            onClick={() => setCount(c => Math.min(pageSize, c + 1))}
            className="w-8 h-8 flex items-center justify-center text-(--text-2) hover:bg-(--surface-2) hover:text-(--text-1) transition-colors cursor-pointer text-[18px] font-light leading-none select-none"
            aria-label="Increase"
          >+</button>
        </div>

        {/* Apply */}
        <button
          onClick={apply}
          className="h-8 px-4 rounded-[10px] bg-(--accent) text-white text-[12px] font-medium hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer select-none"
        >
          Apply
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={openPopup}
        className={[
          'flex items-center justify-center transition-all duration-150',
          compact ? 'w-[26px] h-[26px]' : 'w-[22px] h-[22px] rounded-[7px] border',
          disabled
            ? (compact ? 'text-(--text-3) opacity-40 pointer-events-none' : 'border-(--border-subtle) text-(--text-3) opacity-40 pointer-events-none')
            : open
            ? (compact ? 'text-(--accent) bg-(--accent-muted) cursor-pointer' : 'border-(--accent) text-(--accent) bg-(--accent-muted) cursor-pointer')
            : (compact ? 'text-(--text-2) hover:text-(--accent) hover:bg-(--accent-muted) cursor-pointer' : 'border-(--border) text-(--text-2) hover:border-(--accent) hover:text-(--accent) cursor-pointer active:scale-90'),
        ].join(' ')}
        aria-label="Select first N rows"
        aria-expanded={open}
        aria-haspopup="dialog"
        data-tooltip={open ? undefined : 'Select first N rows'}
        data-tooltip-pos="bottom"
      >
        <svg width="9" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path
            d={open ? 'M1 5L5 1L9 5' : 'M1 1L5 5L9 1'}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {popup}
    </>
  );
}
