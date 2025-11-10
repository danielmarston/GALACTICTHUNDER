import { useState, useEffect, useCallback } from 'react';
import { ResizableViewportGrid } from './components/ResizableViewportGrid';
import { Toolbar } from './components/Toolbar';
import { SceneHierarchy } from './components/SceneHierarchy';
import { ParametersPanel } from './components/ParametersPanel';
import { ResizablePanel } from './components/ResizablePanel';
import { RenderModal } from './components/RenderModal';
import { RenderSettingsModal, type RenderSettings } from './components/RenderSettingsModal';
import { getCreationInstructions } from './components/CreationMode';
import { SceneManager } from './scene/SceneManager';
import type { SceneObject, ObjectType } from './types/types';
import type { CreationState } from './types/creationMode';
import './App.css';

function getStepCount(objectType: ObjectType | null): number {
  if (!objectType) return 0;
  const stepCounts: Record<ObjectType, number> = {
    cube: 3,
    sphere: 2,
    cylinder: 3,
    cone: 3,
    torus: 3,
    plane: 2,
  };
  return stepCounts[objectType];
}

function App() {
  const [sceneManager] = useState(() => new SceneManager());
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [isRenderSettingsOpen, setIsRenderSettingsOpen] = useState(false);
  const [creationState, setCreationState] = useState<CreationState>({
    isActive: false,
    objectType: null,
    currentStep: 0,
    points: [],
    previewMesh: null,
  });
  const [renderSettings, setRenderSettings] = useState<RenderSettings>({
    samples: 250,
    bounces: 5,
    transmissiveBounces: 5,
    tileX: 2,
    tileY: 2,
    resolutionWidth: 800,
    resolutionHeight: 600,
  });

  useEffect(() => {
    // Update objects list initially
    setObjects(sceneManager.getObjects());
  }, [sceneManager]);

  // Handle Escape key to cancel creation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && creationState.isActive) {
        setCreationState({
          isActive: false,
          objectType: null,
          currentStep: 0,
          points: [],
          previewMesh: null,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [creationState.isActive]);

  const startCreationMode = (objectType: ObjectType) => {
    setCreationState({
      isActive: true,
      objectType,
      currentStep: 0,
      points: [],
      previewMesh: null,
    });
  };

  const handleAddCube = () => {
    startCreationMode('cube');
  };

  const handleAddSphere = () => {
    startCreationMode('sphere');
  };

  const handleAddCylinder = () => {
    startCreationMode('cylinder');
  };

  const handleAddCone = () => {
    startCreationMode('cone');
  };

  const handleAddTorus = () => {
    startCreationMode('torus');
  };

  const handleAddPlane = () => {
    startCreationMode('plane');
  };

  const handleDeleteObject = (id: string) => {
    sceneManager.removeObject(id);
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
      sceneManager.setSelectedObject(null);
    }
    setObjects(sceneManager.getObjects());
  };

  const handleSelectObject = useCallback((id: string | null) => {
    setSelectedObjectId(id);
    sceneManager.setSelectedObject(id);
  }, [sceneManager]);

  const handleObjectCreated = useCallback(() => {
    setObjects(sceneManager.getObjects());
  }, [sceneManager]);

  const handleUpdatePosition = () => {
    // Update outline to match transformed object
    sceneManager.updateOutline();
    // Force re-render when transform changes
    setObjects([...sceneManager.getObjects()]);
  };

  const selectedObject = selectedObjectId 
    ? objects.find(obj => obj.id === selectedObjectId) || null
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Toolbar 
        onAddCube={handleAddCube} 
        onAddSphere={handleAddSphere}
        onAddCylinder={handleAddCylinder}
        onAddCone={handleAddCone}
        onAddTorus={handleAddTorus}
        onAddPlane={handleAddPlane}
        onRender={() => {
          setIsRenderModalOpen(true);
        }}
        onRenderSettings={() => setIsRenderSettingsOpen(true)}
      />
      {creationState.isActive && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#0e639c',
          color: '#ffffff',
          fontSize: '13px',
          borderBottom: '1px solid #0a4a7a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <strong>Creating {creationState.objectType}:</strong>
            {' '}
            {creationState.objectType && getCreationInstructions(creationState.objectType, creationState.currentStep)}
            {' '}
            <span style={{ opacity: 0.8 }}>
              (Step {creationState.currentStep + 1} of {getStepCount(creationState.objectType)})
            </span>
          </div>
          <button
            onClick={() => setCreationState({
              isActive: false,
              objectType: null,
              currentStep: 0,
              points: [],
              previewMesh: null,
            })}
            style={{
              padding: '4px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #ffffff',
              borderRadius: '3px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Cancel (Esc)
          </button>
        </div>
      )}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ResizableViewportGrid 
            sceneManager={sceneManager} 
            onSelectObject={handleSelectObject}
            selectedObjectId={selectedObjectId}
            creationState={creationState}
            onCreationStateChange={setCreationState}
            onObjectCreated={handleObjectCreated}
          />
        </div>
        <ResizablePanel initialWidth={200} minWidth={150} maxWidth={400} side="right">
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <SceneHierarchy 
              objects={objects} 
              selectedObjectId={selectedObjectId}
              onSelectObject={handleSelectObject}
              onDeleteObject={handleDeleteObject} 
            />
            <ParametersPanel 
              selectedObject={selectedObject}
              onUpdateTransform={handleUpdatePosition}
            />
          </div>
        </ResizablePanel>
      </div>
      <RenderModal 
        isOpen={isRenderModalOpen}
        onClose={() => setIsRenderModalOpen(false)}
        sceneManager={sceneManager}
        settings={renderSettings}
      />
      <RenderSettingsModal 
        isOpen={isRenderSettingsOpen}
        onClose={() => setIsRenderSettingsOpen(false)}
        settings={renderSettings}
        onSave={setRenderSettings}
      />
    </div>
  );
}

export default App;
