import { Viewport } from './Viewport';
import { SceneManager } from '../scene/SceneManager';
import type { CreationState } from '../types/creationMode';

interface ViewportGridProps {
  sceneManager: SceneManager;
  onSelectObject: (id: string | null) => void;
  selectedObjectId: string | null;
  creationState: CreationState;
  onCreationStateChange: (state: CreationState) => void;
}

export function ViewportGrid({ 
  sceneManager, 
  onSelectObject, 
  selectedObjectId,
  creationState,
  onCreationStateChange 
}: ViewportGridProps) {
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
      <Viewport type="perspective" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} creationState={creationState} onCreationStateChange={onCreationStateChange} />
      <Viewport type="top" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} creationState={creationState} onCreationStateChange={onCreationStateChange} />
      <Viewport type="left" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} creationState={creationState} onCreationStateChange={onCreationStateChange} />
      <Viewport type="front" scene={scene} sceneManager={sceneManager} onSelectObject={onSelectObject} selectedObjectId={selectedObjectId} creationState={creationState} onCreationStateChange={onCreationStateChange} />
    </div>
  );
}
