import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ResizablePanelProps {
  children: ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right';
}

export function ResizablePanel({ 
  children, 
  initialWidth = 200, 
  minWidth = 150, 
  maxWidth = 400,
  side = 'right'
}: ResizablePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !panelRef.current) return;

      const panel = panelRef.current;
      const rect = panel.getBoundingClientRect();
      
      let newWidth: number;
      if (side === 'right') {
        newWidth = window.innerWidth - e.clientX;
      } else {
        newWidth = e.clientX - rect.left;
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      panel.style.width = `${newWidth}px`;
      
      // Trigger window resize event to update viewports
      window.dispatchEvent(new Event('resize'));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Final resize event when done dragging
      window.dispatchEvent(new Event('resize'));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minWidth, maxWidth, side]);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      ref={panelRef}
      style={{
        width: `${initialWidth}px`,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          [side === 'right' ? 'left' : 'right']: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          cursor: 'ew-resize',
          backgroundColor: 'transparent',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0e639c';
        }}
        onMouseLeave={(e) => {
          if (!isDraggingRef.current) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      />
      {children}
    </div>
  );
}
