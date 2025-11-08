import type { SceneObject } from '../types/types';

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
          Geometry
        </h4>
        {selectedObject.type === 'cube' && (
          <div style={{ fontSize: '12px', color: '#fff' }}>
            <strong>Size:</strong> 1.0 × 1.0 × 1.0
          </div>
        )}
        {selectedObject.type === 'sphere' && (
          <div style={{ fontSize: '12px', color: '#fff' }}>
            <strong>Radius:</strong> 0.5
          </div>
        )}
      </div>
    </div>
  );
}
