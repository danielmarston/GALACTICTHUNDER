import { Viewport } from './Viewport';
import { SceneManager } from '../scene/SceneManager';

interface ViewportGridProps {
  sceneManager: SceneManager;
  onSelectObject: (id: string | null) => void;
  selectedObjectId: string | null;
}

export function ViewportGrid({ sceneManager, onSelectObject, selectedObjectId }: ViewportGridProps) {
  const scene = sceneManager.getScene();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        width: '100%',
        height: '100%',
        gap: '2px',
        backgroundColor: '#1a1a1a',
      }}
    >
      <Viewport type="perspective" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} />
      <Viewport type="top" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} />
      <Viewport type="left" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} />
      <Viewport type="front" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} />
    </div>
  );
}
