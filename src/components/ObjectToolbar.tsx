interface ObjectToolbarProps {
  onTranslate: () => void;
  onRotate: () => void;
  onScale: () => void;
  activeMode: 'translate' | 'rotate' | 'scale' | null;
}

export function ObjectToolbar({ onTranslate, onRotate, onScale, activeMode }: ObjectToolbarProps) {
  const toolbarStyle = {
    display: 'flex',
    gap: '4px',
    padding: '6px',
    backgroundColor: 'rgba(42, 42, 42, 0.5)',
    border: '1px solid rgba(68, 68, 68, 0.5)',
    borderRadius: '20px',
    backdropFilter: 'blur(4px)',
  };

  const buttonStyle = (isActive: boolean) => ({
    width: '32px',
    height: '32px',
    backgroundColor: isActive ? 'rgba(14, 99, 156, 0.8)' : 'rgba(68, 68, 68, 0.6)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  });

  return (
    <div style={toolbarStyle}>
      <button
        onClick={onTranslate}
        style={buttonStyle(activeMode === 'translate')}
        title="Translate (Move)"
        onMouseOver={(e) => {
          if (activeMode !== 'translate') {
            e.currentTarget.style.backgroundColor = 'rgba(90, 90, 90, 0.8)';
          }
        }}
        onMouseOut={(e) => {
          if (activeMode !== 'translate') {
            e.currentTarget.style.backgroundColor = 'rgba(68, 68, 68, 0.6)';
          }
        }}
      >
        ⇄
      </button>
      <button
        onClick={onScale}
        style={buttonStyle(activeMode === 'scale')}
        title="Scale"
        onMouseOver={(e) => {
          if (activeMode !== 'scale') {
            e.currentTarget.style.backgroundColor = 'rgba(90, 90, 90, 0.8)';
          }
        }}
        onMouseOut={(e) => {
          if (activeMode !== 'scale') {
            e.currentTarget.style.backgroundColor = 'rgba(68, 68, 68, 0.6)';
          }
        }}
      >
        ⇱
      </button>
      <button
        onClick={onRotate}
        style={buttonStyle(activeMode === 'rotate')}
        title="Rotate"
        onMouseOver={(e) => {
          if (activeMode !== 'rotate') {
            e.currentTarget.style.backgroundColor = 'rgba(90, 90, 90, 0.8)';
          }
        }}
        onMouseOut={(e) => {
          if (activeMode !== 'rotate') {
            e.currentTarget.style.backgroundColor = 'rgba(68, 68, 68, 0.6)';
          }
        }}
      >
        ↻
      </button>
      
    </div>
  );
}
