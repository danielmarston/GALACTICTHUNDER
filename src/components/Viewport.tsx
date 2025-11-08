import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ViewportType } from '../types/types';
import type { SceneManager } from '../scene/SceneManager';
import { ViewportToolbar } from './ViewportToolbar';
import type { ViewportDisplayMode } from './ViewportToolbar';

interface ViewportProps {
  type: ViewportType;
  scene: THREE.Scene;
  sceneManager: SceneManager;
  onSelectObject: (id: string | null) => void;
  onMount?: (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void;
}

export function Viewport({ type, scene, sceneManager, onSelectObject, onMount }: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [displayMode, setDisplayMode] = useState<ViewportDisplayMode>('shaded');
  const viewportSceneRef = useRef<THREE.Scene | null>(null);
  const viewportMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Update materials when display mode changes
  useEffect(() => {
    const meshMap = viewportMeshesRef.current;
    const objects = sceneManager.getObjects();
    
    meshMap.forEach((viewportMesh, id) => {
      const obj = objects.find(o => o.id === id);
      if (obj) {
        // Dispose old material
        if (viewportMesh.material instanceof THREE.Material) {
          viewportMesh.material.dispose();
        }
        
        // Create new material based on display mode
        const originalMaterial = obj.mesh.material as THREE.MeshPhongMaterial;
        const baseColor = originalMaterial.color;
        
        let newMaterial: THREE.Material;
        switch (displayMode) {
          case 'wireframe':
            newMaterial = new THREE.MeshBasicMaterial({ 
              color: baseColor, 
              wireframe: true 
            });
            break;
          case 'solid':
            newMaterial = new THREE.MeshBasicMaterial({ 
              color: baseColor 
            });
            break;
          case 'shaded':
          default:
            newMaterial = new THREE.MeshPhongMaterial({ 
              color: baseColor 
            });
            break;
        }
        
        viewportMesh.material = newMaterial;
      }
    });
  }, [displayMode, sceneManager]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create camera based on viewport type
    let camera: THREE.Camera;
    
    if (type === 'perspective') {
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
    } else {
      const aspect = width / height;
      const frustumSize = 10;
      camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        0.1,
        1000
      );

      // Set camera position based on view type
      switch (type) {
        case 'front':
          camera.position.set(0, 0, 10);
          break;
        case 'top':
          camera.position.set(0, 10, 0);
          camera.up.set(0, 0, -1);
          break;
        case 'left':
          camera.position.set(-10, 0, 0);
          break;
      }
      camera.lookAt(0, 0, 0);
    }

    cameraRef.current = camera;

    // Create a viewport-specific scene that mirrors the main scene
    const viewportScene = new THREE.Scene();
    viewportScene.background = scene.background;
    
    // Copy helpers and lights from main scene
    scene.children.forEach(child => {
      if (child.type === 'GridHelper' || child.type === 'AxesHelper' || 
          child.type === 'AmbientLight' || child.type === 'DirectionalLight') {
        viewportScene.add(child.clone());
      }
    });
    
    viewportSceneRef.current = viewportScene;

    // Function to sync viewport scene with main scene
    const syncScene = () => {
      const objects = sceneManager.getObjects();
      const meshMap = viewportMeshesRef.current;
      
      // Remove meshes that no longer exist
      const currentIds = new Set(objects.map(obj => obj.id));
      meshMap.forEach((mesh, id) => {
        if (!currentIds.has(id)) {
          viewportScene.remove(mesh);
          mesh.geometry.dispose();
          if (mesh.material instanceof THREE.Material) {
            mesh.material.dispose();
          }
          meshMap.delete(id);
        }
      });
      
      // Add or update meshes
      objects.forEach(obj => {
        let viewportMesh = meshMap.get(obj.id);
        
        if (!viewportMesh) {
          // Create new mesh with custom material
          const geometry = obj.mesh.geometry;
          let material: THREE.Material;
          
          const originalMaterial = obj.mesh.material as THREE.MeshPhongMaterial;
          const baseColor = originalMaterial.color;
          
          switch (displayMode) {
            case 'wireframe':
              material = new THREE.MeshBasicMaterial({ 
                color: baseColor, 
                wireframe: true 
              });
              break;
            case 'solid':
              material = new THREE.MeshBasicMaterial({ 
                color: baseColor 
              });
              break;
            case 'shaded':
            default:
              material = new THREE.MeshPhongMaterial({ 
                color: baseColor 
              });
              break;
          }
          
          viewportMesh = new THREE.Mesh(geometry, material);
          viewportScene.add(viewportMesh);
          meshMap.set(obj.id, viewportMesh);
        }
        
        // Sync transform
        viewportMesh.position.copy(obj.mesh.position);
        viewportMesh.rotation.copy(obj.mesh.rotation);
        viewportMesh.scale.copy(obj.mesh.scale);
      });
      
      // Sync outline mesh from main scene
      const outlineMeshes = scene.children.filter(
        child => child instanceof THREE.Mesh && 
        child.material instanceof THREE.MeshBasicMaterial &&
        (child.material as THREE.MeshBasicMaterial).side === THREE.BackSide
      );
      
      // Remove old outline meshes
      const existingOutlines = viewportScene.children.filter(
        child => child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshBasicMaterial &&
        (child.material as THREE.MeshBasicMaterial).side === THREE.BackSide
      );
      existingOutlines.forEach(outline => viewportScene.remove(outline));
      
      // Add current outline meshes
      outlineMeshes.forEach(outline => {
        const outlineClone = outline.clone();
        viewportScene.add(outlineClone);
      });
    };
    
    // Initial sync
    syncScene();

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Style the canvas to fill container
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    if (type === 'perspective') {
      // Perspective: allow rotation, zoom, and pan
      controls.enableRotate = true;
      controls.enableZoom = true;
      controls.enablePan = true;
    } else {
      // Orthographic: only pan and zoom, no rotation
      controls.enableRotate = false;
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
    }
    
    controlsRef.current = controls;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Sync scene objects
      syncScene();
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      renderer.render(viewportScene, camera);
    };
    animate();

    // Handle object selection via raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseDownPos = { x: 0, y: 0 };
    let isDragging = false;

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownPos = { x: event.clientX, y: event.clientY };
      isDragging = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDownPos) {
        const dx = event.clientX - mouseDownPos.x;
        const dy = event.clientY - mouseDownPos.y;
        if (Math.sqrt(dx * dx + dy * dy) > 5) {
          isDragging = true;
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      // Only process selection if not dragging
      if (isDragging) {
        return;
      }

      const rect = container.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);

      // Get all scene objects
      const objects = sceneManager.getObjects();
      const meshes = objects.map(obj => obj.mesh);

      // Calculate intersections
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        // Find which object was clicked
        const clickedMesh = intersects[0].object;
        const clickedObject = objects.find(obj => obj.mesh === clickedMesh);
        
        if (clickedObject) {
          onSelectObject(clickedObject.id);
        }
      } else {
        // Clicked on background, deselect
        onSelectObject(null);
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Notify parent of mount
    if (onMount) {
      onMount(camera, renderer);
    }

    // Handle resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      // Update camera
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      } else if (camera instanceof THREE.OrthographicCamera) {
        const aspect = newWidth / newHeight;
        const frustumSize = 10;
        camera.left = -frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
      }

      // Update renderer
      renderer.setSize(newWidth, newHeight, false);
      renderer.setPixelRatio(window.devicePixelRatio);
    };

    // Use ResizeObserver for more accurate container size tracking
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      // Clean up viewport-specific meshes and materials
      viewportMeshesRef.current.forEach(mesh => {
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      });
      viewportMeshesRef.current.clear();
      
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [type, scene, sceneManager, onSelectObject, onMount, displayMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #444',
          boxSizing: 'border-box',
        }}
      />
      <ViewportToolbar 
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
      />
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '4px 8px',
          borderRadius: '4px',
          textTransform: 'uppercase',
        }}
      >
        {type}
      </div>
    </div>
  );
}
