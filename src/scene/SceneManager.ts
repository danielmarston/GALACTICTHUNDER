import * as THREE from 'three';
import type { SceneObject } from '../types/types';

export class SceneManager {
  private scene: THREE.Scene;
  private objects: Map<string, SceneObject>;
  private objectCounter: number;
  private selectedObjectId: string | null = null;
  private outlineMesh: THREE.Mesh | null = null;

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

  addCube(position: THREE.Vector3 = new THREE.Vector3(0, 0.5, 0)): SceneObject {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00aaff });
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
    const material = new THREE.MeshPhongMaterial({ color: 0xff6b00 });
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
}
