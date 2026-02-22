import { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

interface Props {
  pageSize: number;
  onSelect: (n: number) => void;
}

export function SelectNPanel({ pageSize, onSelect }: Props) {
  const panel = useRef<OverlayPanel>(null);
  const [count, setCount] = useState<number | null>(1);

  function apply() {
    if (count !== null && count > 0) {
      onSelect(Math.min(count, pageSize));
    }
    panel.current?.hide();
  }

  return (
    <>
      <button
        onClick={(e) => panel.current?.toggle(e)}
        title="Select N rows"
        className="w-6 h-6 flex items-center justify-center rounded border border-(--border) text-(--text-2) hover:border-(--accent) hover:text-(--accent) transition-all duration-150 cursor-pointer active:scale-90"
        aria-label="Select a custom number of rows"
      >
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <OverlayPanel ref={panel} className="select-n-overlay">
        <p className="text-[11px] font-medium text-(--text-2) mb-0">
          Select first N rows on this page
        </p>
        <div className="select-n-row">
          <InputNumber
            value={count}
            onValueChange={(e) => setCount(e.value ?? null)}
            min={1}
            max={pageSize}
            showButtons
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            inputStyle={{ width: '4rem', textAlign: 'center' }}
          />
          <Button
            label="Apply"
            onClick={apply}
            style={{
              height: '30px',
              padding: '0 14px',
              fontSize: '12px',
              fontWeight: 500,
              background: 'var(--accent)',
              borderColor: 'var(--accent)',
              borderRadius: '6px',
            }}
          />
        </div>
      </OverlayPanel>
    </>
  );
}

