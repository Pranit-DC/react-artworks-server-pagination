import { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  duration?: number;
  className?: string;
}

export function ThemeToggle({ duration = 400, className = '' }: ThemeToggleProps) {
  const { isDark, setIsDark } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(async () => {
    if (!buttonRef.current) return;

    const startTransition = async () => {
      flushSync(() => {
        setIsDark((prev) => !prev);
      });
    };

    if (!document.startViewTransition) {
      await startTransition();
      return;
    }

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    const transition = document.startViewTransition(startTransition);
    await transition.ready;

    // Always expand NEW layer from the button — wave color = target theme
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  }, [isDark, setIsDark, duration]);

  return (
    <button
      ref={buttonRef}
      onClick={toggle}
      aria-label="Toggle theme"
      data-tooltip={isDark ? 'Switch to light' : 'Switch to dark'}
      data-tooltip-pos="bottom"
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-(--text-2) hover:text-(--text-1) hover:bg-black/5 dark:hover:bg-white/8 transition-colors cursor-pointer ${className}`}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
