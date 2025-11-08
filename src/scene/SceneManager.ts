import * as THREE from 'three';
import type { SceneObject } from '../types/types';

export class SceneManager {
  private scene: THREE.Scene;
  private objects: Map<string, SceneObject>;
  private objectCounter: number;
  private selectedObjectId: string | null = null;
  private outlineMesh: THREE.Mesh | null = null;
  private perspectiveCamera: THREE.PerspectiveCamera | null = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a2a2a);
    this.objects = new Map();
    this.objectCounter = 0;

    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x333333);
    this.scene.add(gridHelper);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  private getRandomColor(): number {
    // Generate a random color that's reasonably bright and visible
    const hue = Math.random();
    const saturation = 0.6 + Math.random() * 0.4; // 0.6-1.0
    const lightness = 0.5 + Math.random() * 0.2; // 0.5-0.7
    
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
    const m = lightness - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (hue < 1/6) { r = c; g = x; b = 0; }
    else if (hue < 2/6) { r = x; g = c; b = 0; }
    else if (hue < 3/6) { r = 0; g = c; b = x; }
    else if (hue < 4/6) { r = 0; g = x; b = c; }
    else if (hue < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return (r << 16) | (g << 8) | b;
  }

  addCube(position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)): SceneObject {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: this.getRandomColor() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    this.scene.add(mesh);

    const id = `cube_${++this.objectCounter}`;
    const sceneObject: SceneObject = {
      id,
      name: `Cube ${this.objectCounter}`,
      type: 'cube',
      mesh,
    };

    this.objects.set(id, sceneObject);
    return sceneObject;
  }

  addSphere(position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)): SceneObject {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: this.getRandomColor() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    this.scene.add(mesh);

    const id = `sphere_${++this.objectCounter}`;
    const sceneObject: SceneObject = {
      id,
      name: `Sphere ${this.objectCounter}`,
      type: 'sphere',
      mesh,
    };

    this.objects.set(id, sceneObject);
    return sceneObject;
  }

  addCylinder(position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)): SceneObject {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshPhongMaterial({ color: this.getRandomColor() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    this.scene.add(mesh);

    const id = `cylinder_${++this.objectCounter}`;
    const sceneObject: SceneObject = {
      id,
      name: `Cylinder ${this.objectCounter}`,
      type: 'cylinder',
      mesh,
    };

    this.objects.set(id, sceneObject);
    return sceneObject;
  }

  addCone(position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)): SceneObject {
    const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    const material = new THREE.MeshPhongMaterial({ color: this.getRandomColor() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    this.scene.add(mesh);

    const id = `cone_${++this.objectCounter}`;
    const sceneObject: SceneObject = {
      id,
      name: `Cone ${this.objectCounter}`,
      type: 'cone',
      mesh,
    };

    this.objects.set(id, sceneObject);
    return sceneObject;
  }

  addTorus(position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)): SceneObject {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
    const material = new THREE.MeshPhongMaterial({ color: this.getRandomColor() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    this.scene.add(mesh);

    const id = `torus_${++this.objectCounter}`;
    const sceneObject: SceneObject = {
      id,
      name: `Torus ${this.objectCounter}`,
      type: 'torus',
      mesh,
    };

    this.objects.set(id, sceneObject);
    return sceneObject;
  }

  addPlane(position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)): SceneObject {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({ color: this.getRandomColor(), side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.rotation.x = -Math.PI / 2; // Rotate to be horizontal

    this.scene.add(mesh);

    const id = `plane_${++this.objectCounter}`;
    const sceneObject: SceneObject = {
      id,
      name: `Plane ${this.objectCounter}`,
      type: 'plane',
      mesh,
    };

    this.objects.set(id, sceneObject);
    return sceneObject;
  }

  removeObject(id: string): boolean {
    const obj = this.objects.get(id);
    if (obj) {
      // Remove outline if this object is selected
      if (this.selectedObjectId === id) {
        this.setSelectedObject(null);
      }
      
      this.scene.remove(obj.mesh);
      obj.mesh.geometry.dispose();
      if (obj.mesh.material instanceof THREE.Material) {
        obj.mesh.material.dispose();
      }
      this.objects.delete(id);
      return true;
    }
    return false;
  }

  getObjects(): SceneObject[] {
    return Array.from(this.objects.values());
  }

  setSelectedObject(id: string | null): void {
    // Remove previous outline
    if (this.outlineMesh) {
      this.scene.remove(this.outlineMesh);
      this.outlineMesh.geometry.dispose();
      if (this.outlineMesh.material instanceof THREE.Material) {
        this.outlineMesh.material.dispose();
      }
      this.outlineMesh = null;
    }

    this.selectedObjectId = id;

    // Create outline for new selection
    if (id) {
      const obj = this.objects.get(id);
      if (obj) {
        // Clone the geometry and scale it slightly larger
        const outlineGeometry = obj.mesh.geometry.clone();
        const outlineMaterial = new THREE.MeshBasicMaterial({
          color: 0xaaff00, // Bright lime green
          side: THREE.BackSide,
        });
        
        this.outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
        
        // Copy position, rotation, and scale from the original mesh
        this.outlineMesh.position.copy(obj.mesh.position);
        this.outlineMesh.rotation.copy(obj.mesh.rotation);
        this.outlineMesh.scale.copy(obj.mesh.scale).multiplyScalar(1.05); // 5% larger
        
        this.scene.add(this.outlineMesh);
      }
    }
  }

  getSelectedObjectId(): string | null {
    return this.selectedObjectId;
  }

  updateOutline(): void {
    // Update outline position/rotation/scale to match the selected object
    if (this.outlineMesh && this.selectedObjectId) {
      const obj = this.objects.get(this.selectedObjectId);
      if (obj) {
        this.outlineMesh.position.copy(obj.mesh.position);
        this.outlineMesh.rotation.copy(obj.mesh.rotation);
        this.outlineMesh.scale.copy(obj.mesh.scale).multiplyScalar(1.05);
      }
    }
  }

  setPerspectiveCamera(camera: THREE.PerspectiveCamera): void {
    this.perspectiveCamera = camera;
  }

  getPerspectiveCamera(): THREE.PerspectiveCamera | null {
    return this.perspectiveCamera;
  }
}
