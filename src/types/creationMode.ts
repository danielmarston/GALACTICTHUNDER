import type { ObjectType } from './types';

export interface CreationPoint {
  x: number;
  y: number;
  z: number;
}

export interface CreationState {
  isActive: boolean;
  objectType: ObjectType | null;
  currentStep: number;
  points: CreationPoint[];
  previewMesh: any | null; // Will hold THREE.Mesh for preview
}

export interface CreationConfig {
  steps: number;
  stepDescriptions: string[];
  previewGenerator: (points: CreationPoint[]) => any; // Function to generate preview mesh
}

export const CREATION_CONFIGS: Record<ObjectType, CreationConfig> = {
  cube: {
    steps: 3,
    stepDescriptions: [
      'Click to place the first corner',
      'Click to set the opposite corner of the base',
      'Click to set the height'
    ],
    previewGenerator: (points: CreationPoint[]) => points
  },
  sphere: {
    steps: 2,
    stepDescriptions: [
      'Click to place the center',
      'Click to set the radius'
    ],
    previewGenerator: (points: CreationPoint[]) => points
  },
  cylinder: {
    steps: 3,
    stepDescriptions: [
      'Click to place the center of the base',
      'Click to set the radius',
      'Click to set the height'
    ],
    previewGenerator: (points: CreationPoint[]) => points
  },
  cone: {
    steps: 3,
    stepDescriptions: [
      'Click to place the center of the base',
      'Click to set the radius',
      'Click to set the height'
    ],
    previewGenerator: (points: CreationPoint[]) => points
  },
  torus: {
    steps: 3,
    stepDescriptions: [
      'Click to place the center',
      'Click to set the major radius (outer ring)',
      'Click to set the minor radius (tube thickness)'
    ],
    previewGenerator: (points: CreationPoint[]) => points
  },
  plane: {
    steps: 2,
    stepDescriptions: [
      'Click to place the first corner',
      'Click to set the opposite corner'
    ],
    previewGenerator: (points: CreationPoint[]) => points
  }
};
