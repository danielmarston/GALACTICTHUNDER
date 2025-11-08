import * as THREE from 'three';

export type ViewportType = 'front' | 'left' | 'top' | 'perspective';

export interface SceneObject {
  id: string;
  name: string;
  type: 'cube' | 'sphere';
  mesh: THREE.Mesh;
}

export interface ViewportConfig {
  type: ViewportType;
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
}
