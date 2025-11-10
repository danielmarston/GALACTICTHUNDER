import * as THREE from 'three';

export type ViewportType = 'front' | 'left' | 'top' | 'perspective';

export type ObjectType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane';

export interface SceneObject {
  id: string;
  name: string;
  type: ObjectType;
  mesh: THREE.Mesh;
}

export interface ViewportConfig {
  type: ViewportType;
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
}
