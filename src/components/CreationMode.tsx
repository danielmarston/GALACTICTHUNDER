import * as THREE from 'three';
import type { ObjectType } from '../types/types';
import type { CreationPoint, CreationState } from '../types/creationMode';

interface CreationPreviewProps {
  creationState: CreationState;
  mousePosition: THREE.Vector3 | null;
}

export function CreationPreview({ creationState }: CreationPreviewProps) {
  if (!creationState.isActive || !creationState.objectType) {
    return null;
  }

  // This component will render visual hints and preview in the viewport
  // The actual preview mesh will be created in the viewport itself
  return null;
}

export function generatePreviewGeometry(
  objectType: ObjectType,
  points: CreationPoint[],
  currentMousePos: THREE.Vector3 | null
): THREE.BufferGeometry | null {
  if (!currentMousePos && points.length === 0) return null;

  switch (objectType) {
    case 'cube':
      return generateCubePreview(points, currentMousePos);
    case 'sphere':
      return generateSpherePreview(points, currentMousePos);
    case 'cylinder':
      return generateCylinderPreview(points, currentMousePos);
    case 'cone':
      return generateConePreview(points, currentMousePos);
    case 'torus':
      return generateTorusPreview(points, currentMousePos);
    case 'plane':
      return generatePlanePreview(points, currentMousePos);
    default:
      return null;
  }
}

function generateCubePreview(points: CreationPoint[], mousePos: THREE.Vector3 | null): THREE.BufferGeometry | null {
  if (points.length === 0) return null;

  const p1 = new THREE.Vector3(points[0].x, points[0].y, points[0].z);

  if (points.length === 1 && mousePos) {
    // Show preview of base rectangle
    const width = Math.abs(mousePos.x - p1.x);
    const depth = Math.abs(mousePos.z - p1.z);
    const geometry = new THREE.BoxGeometry(width, 0.1, depth);
    const centerX = (p1.x + mousePos.x) / 2;
    const centerZ = (p1.z + mousePos.z) / 2;
    geometry.translate(centerX, p1.y, centerZ);
    return geometry;
  } else if (points.length === 2 && mousePos) {
    // Show full cube with height
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const width = Math.abs(p2.x - p1.x);
    const depth = Math.abs(p2.z - p1.z);
    const height = Math.abs(mousePos.y - p1.y);
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const centerX = (p1.x + p2.x) / 2;
    const centerZ = (p1.z + p2.z) / 2;
    const centerY = (p1.y + mousePos.y) / 2;
    geometry.translate(centerX, centerY, centerZ);
    return geometry;
  } else if (points.length >= 3) {
    // Final cube
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const p3 = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
    const width = Math.abs(p2.x - p1.x);
    const depth = Math.abs(p2.z - p1.z);
    const height = Math.abs(p3.y - p1.y);
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const centerX = (p1.x + p2.x) / 2;
    const centerZ = (p1.z + p2.z) / 2;
    const centerY = (p1.y + p3.y) / 2;
    geometry.translate(centerX, centerY, centerZ);
    return geometry;
  }

  return null;
}

function generateSpherePreview(points: CreationPoint[], mousePos: THREE.Vector3 | null): THREE.BufferGeometry | null {
  if (points.length === 0) return null;

  const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);

  if (points.length === 1 && mousePos) {
    // Show sphere with radius from center to mouse
    const radius = center.distanceTo(mousePos);
    const geometry = new THREE.SphereGeometry(radius, 32, 16);
    geometry.translate(center.x, center.y, center.z);
    return geometry;
  } else if (points.length >= 2) {
    // Final sphere
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const radius = center.distanceTo(p2);
    const geometry = new THREE.SphereGeometry(radius, 32, 16);
    geometry.translate(center.x, center.y, center.z);
    return geometry;
  }

  return null;
}

function generateCylinderPreview(points: CreationPoint[], mousePos: THREE.Vector3 | null): THREE.BufferGeometry | null {
  if (points.length === 0) return null;

  const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);

  if (points.length === 1 && mousePos) {
    // Show circle at base
    const radius = Math.sqrt(
      Math.pow(mousePos.x - center.x, 2) + Math.pow(mousePos.z - center.z, 2)
    );
    const geometry = new THREE.CylinderGeometry(radius, radius, 0.1, 32);
    geometry.translate(center.x, center.y, center.z);
    return geometry;
  } else if (points.length === 2 && mousePos) {
    // Show cylinder with height
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const radius = Math.sqrt(
      Math.pow(p2.x - center.x, 2) + Math.pow(p2.z - center.z, 2)
    );
    const height = Math.abs(mousePos.y - center.y);
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    geometry.translate(center.x, center.y + height / 2, center.z);
    return geometry;
  } else if (points.length >= 3) {
    // Final cylinder
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const p3 = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
    const radius = Math.sqrt(
      Math.pow(p2.x - center.x, 2) + Math.pow(p2.z - center.z, 2)
    );
    const height = Math.abs(p3.y - center.y);
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    geometry.translate(center.x, center.y + height / 2, center.z);
    return geometry;
  }

  return null;
}

function generateConePreview(points: CreationPoint[], mousePos: THREE.Vector3 | null): THREE.BufferGeometry | null {
  if (points.length === 0) return null;

  const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);

  if (points.length === 1 && mousePos) {
    // Show circle at base
    const radius = Math.sqrt(
      Math.pow(mousePos.x - center.x, 2) + Math.pow(mousePos.z - center.z, 2)
    );
    const geometry = new THREE.CylinderGeometry(radius, radius, 0.1, 32);
    geometry.translate(center.x, center.y, center.z);
    return geometry;
  } else if (points.length === 2 && mousePos) {
    // Show cone with height
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const radius = Math.sqrt(
      Math.pow(p2.x - center.x, 2) + Math.pow(p2.z - center.z, 2)
    );
    const height = Math.abs(mousePos.y - center.y);
    const geometry = new THREE.ConeGeometry(radius, height, 32);
    geometry.translate(center.x, center.y + height / 2, center.z);
    return geometry;
  } else if (points.length >= 3) {
    // Final cone
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const p3 = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
    const radius = Math.sqrt(
      Math.pow(p2.x - center.x, 2) + Math.pow(p2.z - center.z, 2)
    );
    const height = Math.abs(p3.y - center.y);
    const geometry = new THREE.ConeGeometry(radius, height, 32);
    geometry.translate(center.x, center.y + height / 2, center.z);
    return geometry;
  }

  return null;
}

function generateTorusPreview(points: CreationPoint[], mousePos: THREE.Vector3 | null): THREE.BufferGeometry | null {
  if (points.length === 0) return null;

  const center = new THREE.Vector3(points[0].x, points[0].y, points[0].z);

  if (points.length === 1 && mousePos) {
    // Show outer circle
    const majorRadius = Math.sqrt(
      Math.pow(mousePos.x - center.x, 2) + Math.pow(mousePos.z - center.z, 2)
    );
    const geometry = new THREE.TorusGeometry(majorRadius, 0.1, 16, 32);
    geometry.translate(center.x, center.y, center.z);
    return geometry;
  } else if (points.length === 2 && mousePos) {
    // Show torus with tube
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const majorRadius = Math.sqrt(
      Math.pow(p2.x - center.x, 2) + Math.pow(p2.z - center.z, 2)
    );
    const minorRadius = Math.sqrt(
      Math.pow(mousePos.x - p2.x, 2) + Math.pow(mousePos.z - p2.z, 2)
    );
    const geometry = new THREE.TorusGeometry(majorRadius, Math.max(minorRadius, 0.1), 16, 32);
    geometry.translate(center.x, center.y, center.z);
    return geometry;
  } else if (points.length >= 3) {
    // Final torus
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const p3 = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
    const majorRadius = Math.sqrt(
      Math.pow(p2.x - center.x, 2) + Math.pow(p2.z - center.z, 2)
    );
    const minorRadius = Math.sqrt(
      Math.pow(p3.x - p2.x, 2) + Math.pow(p3.z - p2.z, 2)
    );
    const geometry = new THREE.TorusGeometry(majorRadius, Math.max(minorRadius, 0.1), 16, 32);
    geometry.translate(center.x, center.y, center.z);
    return geometry;
  }

  return null;
}

function generatePlanePreview(points: CreationPoint[], mousePos: THREE.Vector3 | null): THREE.BufferGeometry | null {
  if (points.length === 0) return null;

  const p1 = new THREE.Vector3(points[0].x, points[0].y, points[0].z);

  if (points.length === 1 && mousePos) {
    // Show rectangle
    const width = Math.abs(mousePos.x - p1.x);
    const depth = Math.abs(mousePos.z - p1.z);
    const geometry = new THREE.PlaneGeometry(width, depth);
    geometry.rotateX(-Math.PI / 2);
    const centerX = (p1.x + mousePos.x) / 2;
    const centerZ = (p1.z + mousePos.z) / 2;
    geometry.translate(centerX, p1.y, centerZ);
    return geometry;
  } else if (points.length >= 2) {
    // Final plane
    const p2 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const width = Math.abs(p2.x - p1.x);
    const depth = Math.abs(p2.z - p1.z);
    const geometry = new THREE.PlaneGeometry(width, depth);
    geometry.rotateX(-Math.PI / 2);
    const centerX = (p1.x + p2.x) / 2;
    const centerZ = (p1.z + p2.z) / 2;
    geometry.translate(centerX, p1.y, centerZ);
    return geometry;
  }

  return null;
}

export function getCreationInstructions(objectType: ObjectType, step: number): string {
  const configs: Record<ObjectType, string[]> = {
    cube: [
      'Click to place the first corner',
      'Click to set the opposite corner of the base',
      'Click to set the height'
    ],
    sphere: [
      'Click to place the center',
      'Click to set the radius'
    ],
    cylinder: [
      'Click to place the center of the base',
      'Click to set the radius',
      'Click to set the height'
    ],
    cone: [
      'Click to place the center of the base',
      'Click to set the radius',
      'Click to set the height'
    ],
    torus: [
      'Click to place the center',
      'Click to set the major radius (outer ring)',
      'Click to set the minor radius (tube thickness)'
    ],
    plane: [
      'Click to place the first corner',
      'Click to set the opposite corner'
    ]
  };

  return configs[objectType][step] || '';
}
