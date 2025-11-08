import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ViewportType } from '../types/types';
import type { SceneManager } from '../scene/SceneManager';

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

    // Add controls for perspective view
    if (type === 'perspective') {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controlsRef.current = controls;
    }

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle object selection via raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
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
      container.removeEventListener('click', handleClick);
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [type, scene, sceneManager, onSelectObject, onMount]);

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
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
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
