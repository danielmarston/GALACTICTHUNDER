import type { SceneObject } from '../types/types';

interface SceneHierarchyProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
}

export function SceneHierarchy({ objects, selectedObjectId, onSelectObject, onDeleteObject }: SceneHierarchyProps) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#1e1e1e',
        borderLeft: '1px solid #444',
        padding: '12px',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <h3 style={{ color: '#fff', fontSize: '14px', marginTop: 0, marginBottom: '12px' }}>
        Scene Objects
      </h3>
      {objects.length === 0 ? (
        <p style={{ color: '#888', fontSize: '12px' }}>No objects in scene</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {objects.map((obj) => (
            <li
              key={obj.id}
              onClick={() => onSelectObject(obj.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 8px',
                marginBottom: '4px',
                backgroundColor: selectedObjectId === obj.id ? '#0e639c' : '#2a2a2a',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <span>{obj.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteObject(obj.id);
                }}
                style={{
                  padding: '2px 8px',
                  backgroundColor: '#c72e2e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e73838')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#c72e2e')}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
