import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Viewport } from './Viewport';
import type { SceneManager } from '../scene/SceneManager';
import type { CreationState } from '../types/creationMode';

interface ResizableViewportGridProps {
  sceneManager: SceneManager;
  onSelectObject: (id: string | null) => void;
  selectedObjectId: string | null;
  creationState: CreationState;
  onCreationStateChange: (state: CreationState) => void;
  onObjectCreated?: () => void;
}

export function ResizableViewportGrid({ 
  sceneManager, 
  onSelectObject, 
  selectedObjectId,
  creationState,
  onCreationStateChange,
  onObjectCreated
}: ResizableViewportGridProps) {
  const scene = sceneManager.getScene();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<{ horizontal: boolean; vertical: boolean }>({ horizontal: false, vertical: false });
  const horizontalSplitRef = useRef(50); // percentage
  const verticalSplitRef = useRef(50); // percentage

  // Memoize the onMount callback so it doesn't change on every render
  const handlePerspectiveCameraMount = useCallback((camera: THREE.Camera) => {
    if (camera.type === 'PerspectiveCamera') {
      sceneManager.setPerspectiveCamera(camera as THREE.PerspectiveCamera);
    }
  }, [sceneManager]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();

      if (isDraggingRef.current.horizontal) {
        const percentX = ((e.clientX - rect.left) / rect.width) * 100;
        horizontalSplitRef.current = Math.max(20, Math.min(80, percentX));
        updateGrid();
      }

      if (isDraggingRef.current.vertical) {
        const percentY = ((e.clientY - rect.top) / rect.height) * 100;
        verticalSplitRef.current = Math.max(20, Math.min(80, percentY));
        updateGrid();
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = { horizontal: false, vertical: false };
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const updateGrid = () => {
      if (containerRef.current) {
        containerRef.current.style.gridTemplateColumns = `${horizontalSplitRef.current}% 2px ${100 - horizontalSplitRef.current}%`;
        containerRef.current.style.gridTemplateRows = `${verticalSplitRef.current}% 2px ${100 - verticalSplitRef.current}%`;
        
        // Trigger window resize event to update viewports
        window.dispatchEvent(new Event('resize'));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleHorizontalDragStart = () => {
    isDraggingRef.current.horizontal = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const handleVerticalDragStart = () => {
    isDraggingRef.current.vertical = true;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '50% 2px 50%',
        gridTemplateRows: '50% 2px 50%',
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a1a',
      }}
    >
      {/* Top-left: Perspective */}
      <div style={{ gridColumn: '1', gridRow: '1', overflow: 'hidden' }}>
        <Viewport 
          type="perspective" 
          scene={scene} 
          sceneManager={sceneManager} 
          onSelectObject={onSelectObject} 
          selectedObjectId={selectedObjectId}
          creationState={creationState}
          onCreationStateChange={onCreationStateChange}
          onMount={handlePerspectiveCameraMount}
          onObjectCreated={onObjectCreated}
        />
      </div>
      
      {/* Vertical splitter (full height) */}
      <div
        onMouseDown={handleHorizontalDragStart}
        style={{
          gridColumn: '2',
          gridRow: '1 / 4',
          cursor: 'ew-resize',
          backgroundColor: '#1a1a1a',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0e639c';
        }}
        onMouseLeave={(e) => {
          if (!isDraggingRef.current.horizontal) {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
          }
        }}
      />
      
      {/* Top-right: Top view */}
      <div style={{ gridColumn: '3', gridRow: '1', overflow: 'hidden' }}>
        <Viewport type="top" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} creationState={creationState} onCreationStateChange={onCreationStateChange} onObjectCreated={onObjectCreated} />
      </div>
      
      {/* Horizontal splitter left column */}
      <div
        onMouseDown={handleVerticalDragStart}
        style={{
          gridColumn: '1',
          gridRow: '2',
          cursor: 'ns-resize',
          backgroundColor: '#1a1a1a',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0e639c';
        }}
        onMouseLeave={(e) => {
          if (!isDraggingRef.current.vertical) {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
          }
        }}
      />
      
      {/* Horizontal splitter right column */}
      <div
        onMouseDown={handleVerticalDragStart}
        style={{
          gridColumn: '3',
          gridRow: '2',
          cursor: 'ns-resize',
          backgroundColor: '#1a1a1a',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0e639c';
        }}
        onMouseLeave={(e) => {
          if (!isDraggingRef.current.vertical) {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
          }
        }}
      />
      
      {/* Bottom-left: Left view */}
      <div style={{ gridColumn: '1', gridRow: '3', overflow: 'hidden' }}>
        <Viewport type="left" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} creationState={creationState} onCreationStateChange={onCreationStateChange} onObjectCreated={onObjectCreated} />
      </div>
      
      {/* Bottom-right: Front view */}
      <div style={{ gridColumn: '3', gridRow: '3', overflow: 'hidden' }}>
        <Viewport type="front" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} creationState={creationState} onCreationStateChange={onCreationStateChange} onObjectCreated={onObjectCreated} />
      </div>
    </div>
  );
}
