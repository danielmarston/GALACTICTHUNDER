import { useState, useEffect } from 'react';
import { ResizableViewportGrid } from './components/ResizableViewportGrid';
import { Toolbar } from './components/Toolbar';
import { SceneHierarchy } from './components/SceneHierarchy';
import { ParametersPanel } from './components/ParametersPanel';
import { ResizablePanel } from './components/ResizablePanel';
import { SceneManager } from './scene/SceneManager';
import type { SceneObject } from './types/types';
import './App.css';

function App() {
  const [sceneManager] = useState(() => new SceneManager());
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  useEffect(() => {
    // Update objects list initially
    setObjects(sceneManager.getObjects());
  }, [sceneManager]);

  const handleAddCube = () => {
    sceneManager.addCube();
    setObjects(sceneManager.getObjects());
  };

  const handleAddSphere = () => {
    sceneManager.addSphere();
    setObjects(sceneManager.getObjects());
  };

  const handleDeleteObject = (id: string) => {
    sceneManager.removeObject(id);
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
      sceneManager.setSelectedObject(null);
    }
    setObjects(sceneManager.getObjects());
  };

  const handleSelectObject = (id: string | null) => {
    setSelectedObjectId(id);
    sceneManager.setSelectedObject(id);
  };

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
      <Toolbar onAddCube={handleAddCube} onAddSphere={handleAddSphere} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <ResizableViewportGrid 
            sceneManager={sceneManager} 
            onSelectObject={handleSelectObject}
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
    </div>
  );
}

export default App;
