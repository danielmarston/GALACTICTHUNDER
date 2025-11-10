import type { SceneObject } from '../types/types';
import * as THREE from 'three';

interface ParametersPanelProps {
  selectedObject: SceneObject | null;
  onUpdateTransform?: () => void;
}

export function ParametersPanel({ selectedObject, onUpdateTransform }: ParametersPanelProps) {
  if (!selectedObject) {
    return (
      <div
        style={{
          width: '100%',
          backgroundColor: '#1e1e1e',
          borderLeft: '1px solid #444',
          borderTop: '1px solid #444',
          padding: '12px',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <h3 style={{ color: '#fff', fontSize: '14px', marginTop: 0, marginBottom: '12px' }}>
          Parameters
        </h3>
        <p style={{ color: '#888', fontSize: '12px' }}>No object selected</p>
      </div>
    );
  }

  const position = selectedObject.mesh.position;
  const rotation = selectedObject.mesh.rotation;
  const scale = selectedObject.mesh.scale;

  const inputStyle = {
    width: '52px',
    padding: '4px 6px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '11px',
    textAlign: 'right' as const,
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#1e1e1e',
        borderLeft: '1px solid #444',
        borderTop: '1px solid #444',
        padding: '12px',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <h3 style={{ color: '#fff', fontSize: '14px', marginTop: 0, marginBottom: '12px' }}>
        Parameters
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>
          Object Info
        </h4>
        <div style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>
          <strong>Name:</strong> {selectedObject.name}
        </div>
        <div style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>
          <strong>Type:</strong> {selectedObject.type}
        </div>
        <div style={{ fontSize: '12px', color: '#fff' }}>
          <strong>ID:</strong> {selectedObject.id}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>
          Material
        </h4>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Color</div>
          <input
            type="color"
            value={`#${(selectedObject.mesh.material as any).color.getHexString()}`}
            onChange={(e) => {
              (selectedObject.mesh.material as any).color.setStyle(e.target.value);
              onUpdateTransform?.();
            }}
            style={{
              width: '100%',
              height: '32px',
              padding: '2px',
              backgroundColor: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>
          Transform
        </h4>
        
        {/* Position */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Position</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>X</span>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>Y</span>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>Z</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="number"
              step="0.1"
              value={position.x.toFixed(2)}
              onChange={(e) => {
                selectedObject.mesh.position.x = parseFloat(e.target.value) || 0;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
            <input
              type="number"
              step="0.1"
              value={position.y.toFixed(2)}
              onChange={(e) => {
                selectedObject.mesh.position.y = parseFloat(e.target.value) || 0;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
            <input
              type="number"
              step="0.1"
              value={position.z.toFixed(2)}
              onChange={(e) => {
                selectedObject.mesh.position.z = parseFloat(e.target.value) || 0;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Scale */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Scale</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>X</span>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>Y</span>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>Z</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="number"
              step="0.1"
              value={scale.x.toFixed(2)}
              onChange={(e) => {
                selectedObject.mesh.scale.x = parseFloat(e.target.value) || 0;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
            <input
              type="number"
              step="0.1"
              value={scale.y.toFixed(2)}
              onChange={(e) => {
                selectedObject.mesh.scale.y = parseFloat(e.target.value) || 0;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
            <input
              type="number"
              step="0.1"
              value={scale.z.toFixed(2)}
              onChange={(e) => {
                selectedObject.mesh.scale.z = parseFloat(e.target.value) || 0;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Rotation (in degrees) */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Rotation</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>X</span>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>Y</span>
            <span style={{ width: '52px', textAlign: 'center', fontSize: '10px', color: '#888' }}>Z</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="number"
              step="1"
              value={(rotation.x * 180 / Math.PI).toFixed(1)}
              onChange={(e) => {
                selectedObject.mesh.rotation.x = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
            <input
              type="number"
              step="1"
              value={(rotation.y * 180 / Math.PI).toFixed(1)}
              onChange={(e) => {
                selectedObject.mesh.rotation.y = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
            <input
              type="number"
              step="1"
              value={(rotation.z * 180 / Math.PI).toFixed(1)}
              onChange={(e) => {
                selectedObject.mesh.rotation.z = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                onUpdateTransform?.();
              }}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px', marginTop: 0 }}>
          Dimensions
        </h4>
        
        {selectedObject.type === 'cube' && (() => {
          const geometry = selectedObject.mesh.geometry as THREE.BoxGeometry;
          const params = geometry.parameters;
          return (
            <>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Width × Height × Depth</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={params.width?.toFixed(2) || '1.00'}
                    onChange={(e) => {
                      const newWidth = parseFloat(e.target.value) || 0.1;
                      const newGeometry = new THREE.BoxGeometry(newWidth, params.height, params.depth);
                      selectedObject.mesh.geometry.dispose();
                      selectedObject.mesh.geometry = newGeometry;
                      onUpdateTransform?.();
                    }}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={params.height?.toFixed(2) || '1.00'}
                    onChange={(e) => {
                      const newHeight = parseFloat(e.target.value) || 0.1;
                      const newGeometry = new THREE.BoxGeometry(params.width, newHeight, params.depth);
                      selectedObject.mesh.geometry.dispose();
                      selectedObject.mesh.geometry = newGeometry;
                      onUpdateTransform?.();
                    }}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={params.depth?.toFixed(2) || '1.00'}
                    onChange={(e) => {
                      const newDepth = parseFloat(e.target.value) || 0.1;
                      const newGeometry = new THREE.BoxGeometry(params.width, params.height, newDepth);
                      selectedObject.mesh.geometry.dispose();
                      selectedObject.mesh.geometry = newGeometry;
                      onUpdateTransform?.();
                    }}
                    style={inputStyle}
                  />
                </div>
              </div>
            </>
          );
        })()}
        
        {selectedObject.type === 'sphere' && (() => {
          const geometry = selectedObject.mesh.geometry as THREE.SphereGeometry;
          const params = geometry.parameters;
          return (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Radius</div>
              <input
                type="number"
                step="0.1"
                value={params.radius?.toFixed(2) || '0.50'}
                onChange={(e) => {
                  const newRadius = parseFloat(e.target.value) || 0.1;
                  const newGeometry = new THREE.SphereGeometry(newRadius, 32, 32);
                  selectedObject.mesh.geometry.dispose();
                  selectedObject.mesh.geometry = newGeometry;
                  onUpdateTransform?.();
                }}
                style={inputStyle}
              />
            </div>
          );
        })()}
        
        {selectedObject.type === 'cylinder' && (() => {
          const geometry = selectedObject.mesh.geometry as THREE.CylinderGeometry;
          const params = geometry.parameters;
          return (
            <>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Radius (Top/Bottom)</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="number"
                    step="0.1"
                    value={params.radiusTop?.toFixed(2) || '0.50'}
                    onChange={(e) => {
                      const newRadius = parseFloat(e.target.value) || 0.1;
                      const newGeometry = new THREE.CylinderGeometry(newRadius, params.radiusBottom, params.height, 32);
                      selectedObject.mesh.geometry.dispose();
                      selectedObject.mesh.geometry = newGeometry;
                      onUpdateTransform?.();
                    }}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={params.radiusBottom?.toFixed(2) || '0.50'}
                    onChange={(e) => {
                      const newRadius = parseFloat(e.target.value) || 0.1;
                      const newGeometry = new THREE.CylinderGeometry(params.radiusTop, newRadius, params.height, 32);
                      selectedObject.mesh.geometry.dispose();
                      selectedObject.mesh.geometry = newGeometry;
                      onUpdateTransform?.();
                    }}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Height</div>
                <input
                  type="number"
                  step="0.1"
                  value={params.height?.toFixed(2) || '1.00'}
                  onChange={(e) => {
                    const newHeight = parseFloat(e.target.value) || 0.1;
                    const newGeometry = new THREE.CylinderGeometry(params.radiusTop, params.radiusBottom, newHeight, 32);
                    selectedObject.mesh.geometry.dispose();
                    selectedObject.mesh.geometry = newGeometry;
                    onUpdateTransform?.();
                  }}
                  style={inputStyle}
                />
              </div>
            </>
          );
        })()}
        
        {selectedObject.type === 'cone' && (() => {
          const geometry = selectedObject.mesh.geometry as THREE.ConeGeometry;
          const params = geometry.parameters;
          return (
            <>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Radius</div>
                <input
                  type="number"
                  step="0.1"
                  value={params.radius?.toFixed(2) || '0.50'}
                  onChange={(e) => {
                    const newRadius = parseFloat(e.target.value) || 0.1;
                    const newGeometry = new THREE.ConeGeometry(newRadius, params.height, 32);
                    selectedObject.mesh.geometry.dispose();
                    selectedObject.mesh.geometry = newGeometry;
                    onUpdateTransform?.();
                  }}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Height</div>
                <input
                  type="number"
                  step="0.1"
                  value={params.height?.toFixed(2) || '1.00'}
                  onChange={(e) => {
                    const newHeight = parseFloat(e.target.value) || 0.1;
                    const newGeometry = new THREE.ConeGeometry(params.radius, newHeight, 32);
                    selectedObject.mesh.geometry.dispose();
                    selectedObject.mesh.geometry = newGeometry;
                    onUpdateTransform?.();
                  }}
                  style={inputStyle}
                />
              </div>
            </>
          );
        })()}
        
        {selectedObject.type === 'torus' && (() => {
          const geometry = selectedObject.mesh.geometry as THREE.TorusGeometry;
          const params = geometry.parameters;
          return (
            <>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Major Radius</div>
                <input
                  type="number"
                  step="0.1"
                  value={params.radius?.toFixed(2) || '0.50'}
                  onChange={(e) => {
                    const newRadius = parseFloat(e.target.value) || 0.1;
                    const newGeometry = new THREE.TorusGeometry(newRadius, params.tube, 16, 100);
                    selectedObject.mesh.geometry.dispose();
                    selectedObject.mesh.geometry = newGeometry;
                    onUpdateTransform?.();
                  }}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Tube Radius</div>
                <input
                  type="number"
                  step="0.01"
                  value={params.tube?.toFixed(2) || '0.20'}
                  onChange={(e) => {
                    const newTube = parseFloat(e.target.value) || 0.01;
                    const newGeometry = new THREE.TorusGeometry(params.radius, newTube, 16, 100);
                    selectedObject.mesh.geometry.dispose();
                    selectedObject.mesh.geometry = newGeometry;
                    onUpdateTransform?.();
                  }}
                  style={inputStyle}
                />
              </div>
            </>
          );
        })()}
        
        {selectedObject.type === 'plane' && (() => {
          const geometry = selectedObject.mesh.geometry as THREE.PlaneGeometry;
          const params = geometry.parameters;
          return (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}>Width × Height</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  step="0.1"
                  value={params.width?.toFixed(2) || '1.00'}
                  onChange={(e) => {
                    const newWidth = parseFloat(e.target.value) || 0.1;
                    const newGeometry = new THREE.PlaneGeometry(newWidth, params.height);
                    selectedObject.mesh.geometry.dispose();
                    selectedObject.mesh.geometry = newGeometry;
                    onUpdateTransform?.();
                  }}
                  style={inputStyle}
                />
                <input
                  type="number"
                  step="0.1"
                  value={params.height?.toFixed(2) || '1.00'}
                  onChange={(e) => {
                    const newHeight = parseFloat(e.target.value) || 0.1;
                    const newGeometry = new THREE.PlaneGeometry(params.width, newHeight);
                    selectedObject.mesh.geometry.dispose();
                    selectedObject.mesh.geometry = newGeometry;
                    onUpdateTransform?.();
                  }}
                  style={inputStyle}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
