import { useEffect, useState } from 'react';

export type CursorState = 'reading' | 'ready' | 'restart';

export function CustomCursor({ state }: { state: CursorState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        left: 0,
        top: 0,
        transform: 'translate(-50%, -50%)',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: state === 'ready' || state === 'restart'
          ? 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 70%, transparent 100%)'
          : 'rgba(255, 255, 255, 0.3)',
        boxShadow: state === 'ready' || state === 'restart'
          ? '0 0 8px 2px rgba(255, 255, 255, 0.3), 0 0 16px 4px rgba(255, 255, 255, 0.2)'
          : 'none',
        transition: 'all 0.3s ease-out',
        animation: state === 'ready' || state === 'restart' ? 'pulse 2s ease-in-out infinite' : 'none',
        cursor: state === 'reading' ? 'wait' : 'pointer',
      }}
    >
      {(state === 'ready' || state === 'restart') && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'white',
          }}
        />
      )}
    </div>
  );
}