import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import type { ViewportType } from '../types/types';
import type { SceneManager } from '../scene/SceneManager';
import type { CreationState } from '../types/creationMode';
import { CREATION_CONFIGS } from '../types/creationMode';
import { generatePreviewGeometry } from '../components/CreationMode';
import { ViewportToolbar } from './ViewportToolbar';
import type { ViewportDisplayMode } from './ViewportToolbar';
import { ObjectToolbar } from './ObjectToolbar';

interface ViewportProps {
  type: ViewportType;
  scene: THREE.Scene;
  sceneManager: SceneManager;
  onSelectObject: (id: string | null) => void;
  selectedObjectId: string | null;
  creationState: CreationState;
  onCreationStateChange: (state: CreationState) => void;
  onMount?: (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void;
  onObjectCreated?: () => void;
}

export function Viewport({ 
  type, 
  scene, 
  sceneManager, 
  onSelectObject, 
  selectedObjectId,
  creationState,
  onCreationStateChange,
  onMount,
  onObjectCreated
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [displayMode, setDisplayMode] = useState<ViewportDisplayMode>('shaded');
  const viewportSceneRef = useRef<THREE.Scene | null>(null);
  const viewportMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale' | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const selectedObjectIdRef = useRef<string | null>(null);
  const previewMeshRef = useRef<THREE.Mesh | null>(null);
  const currentMousePositionRef = useRef<THREE.Vector3 | null>(null);
  const creationStateRef = useRef<CreationState>(creationState);
  const onCreationStateChangeRef = useRef(onCreationStateChange);

  // Keep refs in sync with props
  useEffect(() => {
    creationStateRef.current = creationState;
    onCreationStateChangeRef.current = onCreationStateChange;
  }, [creationState, onCreationStateChange]);

  // Keep selectedObjectIdRef in sync
  useEffect(() => {
    selectedObjectIdRef.current = selectedObjectId;
  }, [selectedObjectId]);

  // Calculate toolbar position when object is selected
  useEffect(() => {
    if (!selectedObjectId || !containerRef.current || !cameraRef.current) {
      setToolbarPosition(null);
      return;
    }

    const selectedObject = sceneManager.getObjects().find(obj => obj.id === selectedObjectId);
    if (!selectedObject) {
      setToolbarPosition(null);
      return;
    }

    // Get object's world position
    const objectPosition = new THREE.Vector3();
    selectedObject.mesh.getWorldPosition(objectPosition);
    
    // Offset position above the object
    const offsetPosition = objectPosition.clone();
    offsetPosition.y += 2; // Position above object

    // Project to screen space
    const camera = cameraRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const vector = offsetPosition.clone().project(camera);
    const x = (vector.x * 0.5 + 0.5) * rect.width;
    const y = (-(vector.y * 0.5) + 0.5) * rect.height;

    setToolbarPosition({ x, y });
  }, [selectedObjectId, sceneManager]);

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

  // Update TransformControls when transform mode or selected object changes
  useEffect(() => {
    const transformControls = transformControlsRef.current;
    if (!transformControls) return;

    if (selectedObjectId && transformMode) {
      // Attach to the viewport mesh
      const viewportMesh = viewportMeshesRef.current.get(selectedObjectId);
      if (viewportMesh) {
        transformControls.attach(viewportMesh);
        transformControls.setMode(transformMode);
        transformControls.enabled = true;
        transformControls.showX = true;
        transformControls.showY = true;
        transformControls.showZ = true;
      }
    } else {
      transformControls.detach();
      transformControls.enabled = false;
    }
  }, [selectedObjectId, transformMode, sceneManager]);

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

    // Add perspective camera to viewport scene so lights attached to it work
    if (type === 'perspective') {
      viewportScene.add(camera);
    }
    
    // Copy helpers from main scene
    scene.children.forEach(child => {
      if (child.type === 'GridHelper' || child.type === 'AxesHelper') {
        viewportScene.add(child.clone());
      }
    });

    // Add default lighting for non-perspective viewports (orthographic views)
    if (type !== 'perspective') {
      // For ortho views, add simple directional lighting
      const orthoAmbient = new THREE.AmbientLight(0xffffff, 0.5);
      viewportScene.add(orthoAmbient);
      
      const orthoLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
      orthoLight1.position.set(5, 10, 7);
      viewportScene.add(orthoLight1);
      
      const orthoLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
      orthoLight2.position.set(-5, 5, -5);
      viewportScene.add(orthoLight2);
    }
    
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
        
        // Sync material color
        const originalMaterial = obj.mesh.material as THREE.MeshPhongMaterial;
        if (viewportMesh.material instanceof THREE.Material && 'color' in viewportMesh.material) {
          (viewportMesh.material as any).color.copy(originalMaterial.color);
        }
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

      // Handle creation mode preview mesh
      if (creationStateRef.current.isActive && creationStateRef.current.objectType && currentMousePositionRef.current) {
        const geometry = generatePreviewGeometry(
          creationStateRef.current.objectType,
          creationStateRef.current.points,
          currentMousePositionRef.current
        );

        if (geometry) {
          // Remove old preview mesh
          if (previewMeshRef.current) {
            viewportScene.remove(previewMeshRef.current);
            previewMeshRef.current.geometry.dispose();
            if (previewMeshRef.current.material instanceof THREE.Material) {
              previewMeshRef.current.material.dispose();
            }
          }

          // Create new preview mesh with semi-transparent material
          const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
          });
          const previewMesh = new THREE.Mesh(geometry, material);
          viewportScene.add(previewMesh);
          previewMeshRef.current = previewMesh;
        }
      } else {
        // Not in creation mode - remove preview mesh if it exists
        if (previewMeshRef.current) {
          viewportScene.remove(previewMeshRef.current);
          previewMeshRef.current.geometry.dispose();
          if (previewMeshRef.current.material instanceof THREE.Material) {
            previewMeshRef.current.material.dispose();
          }
          previewMeshRef.current = null;
        }
      }
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

    // Add TransformControls for object manipulation
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.setSize(0.75); // Make gizmo a bit smaller
    transformControls.enabled = false; // Start disabled
    
    transformControls.addEventListener('dragging-changed', (event) => {
      // Disable orbit controls while dragging transform gizmo
      controls.enabled = !event.value;
    });
    
    transformControls.addEventListener('objectChange', () => {
      // The transform controls are manipulating the viewport mesh
      // Sync back to the main scene object
      if (transformControls.object && selectedObjectIdRef.current) {
        const mainObject = sceneManager.getObjects().find(obj => obj.id === selectedObjectIdRef.current);
        if (mainObject) {
          mainObject.mesh.position.copy(transformControls.object.position);
          mainObject.mesh.rotation.copy(transformControls.object.rotation);
          mainObject.mesh.scale.copy(transformControls.object.scale);
          sceneManager.updateOutline();
        }
      }
    });
    
    // Add TransformControls helper to the viewport scene
    // This is the key - we need to add the helper, not the controls itself
    viewportScene.add(transformControls.getHelper());
    transformControlsRef.current = transformControls;

    // Call onMount callback if provided
    if (onMount) {
      onMount(camera, renderer);
    }

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Sync scene objects
      syncScene();
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Render viewport scene
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

      // Update mouse position for creation mode preview
      if (creationStateRef.current.isActive && creationStateRef.current.objectType) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        // Determine if we're on a height step (step 3 for cube, cylinder, cone)
        const isHeightStep = 
          (creationStateRef.current.objectType === 'cube' && creationStateRef.current.currentStep === 2) ||
          (creationStateRef.current.objectType === 'cylinder' && creationStateRef.current.currentStep === 2) ||
          (creationStateRef.current.objectType === 'cone' && creationStateRef.current.currentStep === 2);

        if (isHeightStep && creationStateRef.current.points.length >= 2) {
          // For height steps, use the base center point and calculate height from mouse Y movement
          const basePoint = creationStateRef.current.points[0];
          // Map screen Y position to height (mouse.y ranges from -1 to 1)
          // Moving mouse up (positive mouse.y) increases height
          const heightMultiplier = 5; // Adjust sensitivity
          const height = Math.max(0.1, mouse.y * heightMultiplier + 2); // Ensure minimum height
          
          currentMousePositionRef.current = new THREE.Vector3(
            basePoint.x,
            basePoint.y + height,
            basePoint.z
          );
        } else {
          // For other steps, raycast to ground plane to get 3D position
          const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const intersectionPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(groundPlane, intersectionPoint);

          if (intersectionPoint) {
            currentMousePositionRef.current = intersectionPoint;
          }
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      // Only process if not dragging
      if (isDragging) {
        return;
      }

      const rect = container.getBoundingClientRect();
      
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);

      // If in creation mode, add a point
      if (creationStateRef.current.isActive && creationStateRef.current.objectType) {
        // Determine if we're on a height step (step 3 for cube, cylinder, cone)
        const isHeightStep = 
          (creationStateRef.current.objectType === 'cube' && creationStateRef.current.currentStep === 2) ||
          (creationStateRef.current.objectType === 'cylinder' && creationStateRef.current.currentStep === 2) ||
          (creationStateRef.current.objectType === 'cone' && creationStateRef.current.currentStep === 2);

        let intersectionPoint: THREE.Vector3 | null = null;

        if (isHeightStep && creationStateRef.current.points.length >= 2) {
          // For height steps, use mouse Y position to determine height
          const basePoint = creationStateRef.current.points[0];
          const heightMultiplier = 5;
          const height = Math.max(0.1, mouse.y * heightMultiplier + 2);
          
          intersectionPoint = new THREE.Vector3(
            basePoint.x,
            basePoint.y + height,
            basePoint.z
          );
        } else {
          // For other steps, raycast to ground plane
          const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          intersectionPoint = new THREE.Vector3();
          raycaster.ray.intersectPlane(groundPlane, intersectionPoint);
        }

        if (intersectionPoint) {
          const newPoints = [...creationStateRef.current.points, { x: intersectionPoint.x, y: intersectionPoint.y, z: intersectionPoint.z }];
          const nextStep = creationStateRef.current.currentStep + 1;

          // Check if creation is complete
          const config = CREATION_CONFIGS[creationStateRef.current.objectType];

          if (nextStep >= config.steps) {
            // Creation complete - finalize object
            const objectType = creationStateRef.current.objectType;
            const points = newPoints;
            
            // Calculate center position and scale based on points
            let createdObject: any;
            
            switch (objectType) {
              case 'cube': {
                // Points: [corner1, corner2, heightPoint]
                const p1 = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
                const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
                const p3 = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
                
                const width = Math.abs(p2.x - p1.x);
                const depth = Math.abs(p2.z - p1.z);
                const height = Math.abs(p3.y - p1.y);
                
                const centerX = (p1.x + p2.x) / 2;
                const centerZ = (p1.z + p2.z) / 2;
                const centerY = p1.y + height / 2;
                
                createdObject = sceneManager.addCube(new THREE.Vector3(centerX, centerY, centerZ));
                createdObject.mesh.scale.set(width, height, depth);
                break;
              }
              case 'sphere': {
                // Points: [center, radiusPoint]
                const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
                const radiusPoint = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
                const radius = center.distanceTo(radiusPoint);
                
                createdObject = sceneManager.addSphere(center);
                createdObject.mesh.scale.setScalar(radius);
                break;
              }
              case 'cylinder': {
                // Points: [center, radiusPoint, heightPoint]
                const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
                const radiusPoint = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
                const heightPoint = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
                
                const radius = Math.sqrt(
                  Math.pow(radiusPoint.x - center.x, 2) +
                  Math.pow(radiusPoint.z - center.z, 2)
                );
                const height = Math.abs(heightPoint.y - center.y);
                
                const finalCenter = new THREE.Vector3(center.x, center.y + height / 2, center.z);
                createdObject = sceneManager.addCylinder(finalCenter);
                createdObject.mesh.scale.set(radius, height, radius);
                break;
              }
              case 'cone': {
                // Points: [center, radiusPoint, heightPoint]
                const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
                const radiusPoint = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
                const heightPoint = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
                
                const radius = Math.sqrt(
                  Math.pow(radiusPoint.x - center.x, 2) +
                  Math.pow(radiusPoint.z - center.z, 2)
                );
                const height = Math.abs(heightPoint.y - center.y);
                
                const finalCenter = new THREE.Vector3(center.x, center.y + height / 2, center.z);
                createdObject = sceneManager.addCone(finalCenter);
                createdObject.mesh.scale.set(radius, height, radius);
                break;
              }
              case 'torus': {
                // Points: [center, majorRadiusPoint, minorRadiusPoint]
                const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
                const majorPoint = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
                
                const majorRadius = Math.sqrt(
                  Math.pow(majorPoint.x - center.x, 2) +
                  Math.pow(majorPoint.z - center.z, 2)
                );
                // TODO: Properly calculate and apply minor radius
                // const minorPoint = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
                // const minorRadius = ...
                
                createdObject = sceneManager.addTorus(center);
                createdObject.mesh.scale.set(majorRadius / 0.5, majorRadius / 0.5, majorRadius / 0.5);
                // Note: Torus scaling is complex, this is a simplified version
                break;
              }
              case 'plane': {
                // Points: [corner1, corner2]
                const p1 = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
                const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
                
                const width = Math.abs(p2.x - p1.x);
                const depth = Math.abs(p2.z - p1.z);
                
                const centerX = (p1.x + p2.x) / 2;
                const centerZ = (p1.z + p2.z) / 2;
                
                createdObject = sceneManager.addPlane(new THREE.Vector3(centerX, 0, centerZ));
                createdObject.mesh.scale.set(width, 1, depth);
                break;
              }
            }

            // Notify parent that an object was created
            if (onObjectCreated) {
              onObjectCreated();
            }

            // Exit creation mode
            onCreationStateChangeRef.current({
              isActive: false,
              objectType: null,
              currentStep: 0,
              points: [],
              previewMesh: null,
            });
          } else {
            // Continue to next step
            onCreationStateChangeRef.current({
              ...creationStateRef.current,
              currentStep: nextStep,
              points: newPoints,
            });
          }
        }
        return;
      }

      // Normal selection mode
      // Get viewport meshes (not main scene meshes)
      const meshMap = viewportMeshesRef.current;
      const viewportMeshes = Array.from(meshMap.values());

      // Calculate intersections
      const intersects = raycaster.intersectObjects(viewportMeshes, false);

      if (intersects.length > 0) {
        // Find which object was clicked by matching the mesh
        const clickedMesh = intersects[0].object;
        
        // Find the object ID by looking up which ID maps to this mesh
        let clickedObjectId: string | null = null;
        for (const [id, mesh] of meshMap.entries()) {
          if (mesh === clickedMesh) {
            clickedObjectId = id;
            break;
          }
        }
        
        if (clickedObjectId) {
          onSelectObject(clickedObjectId);
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
      
      if (transformControlsRef.current) {
        transformControlsRef.current.detach();
        transformControlsRef.current.dispose();
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
  }, [type, sceneManager, onSelectObject, onMount]);
  
  // Note: creationState and onCreationStateChange are intentionally NOT in dependencies
  // because they change frequently and we don't want to recreate the entire viewport
  // They are used in event handlers which always have access to current values

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
      {toolbarPosition && selectedObjectId && (
        <div
          style={{
            position: 'absolute',
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
            marginTop: '-10px',
          }}
        >
          <ObjectToolbar
            onTranslate={() => setTransformMode(transformMode === 'translate' ? null : 'translate')}
            onRotate={() => setTransformMode(transformMode === 'rotate' ? null : 'rotate')}
            onScale={() => setTransformMode(transformMode === 'scale' ? null : 'scale')}
            activeMode={transformMode}
          />
        </div>
      )}
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
