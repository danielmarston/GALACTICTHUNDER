export type ViewportDisplayMode = 'wireframe' | 'solid' | 'shaded';

interface ViewportToolbarProps {
  displayMode: ViewportDisplayMode;
  onDisplayModeChange: (mode: ViewportDisplayMode) => void;
}

export function ViewportToolbar({ displayMode, onDisplayModeChange }: ViewportToolbarProps) {
  const buttonStyle = (mode: ViewportDisplayMode) => ({
    padding: '4px 8px',
    backgroundColor: displayMode === mode ? '#0e639c' : '#2a2a2a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: displayMode === mode ? 'bold' : 'normal',
  });

  const hoverStyle = {
    backgroundColor: '#3a3a3a',
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        display: 'flex',
        gap: '4px',
        zIndex: 10,
        pointerEvents: 'auto',
      }}
    >
      <button
        style={buttonStyle('wireframe')}
        onClick={() => onDisplayModeChange('wireframe')}
        onMouseOver={(e) => {
          if (displayMode !== 'wireframe') {
            e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
          }
        }}
        onMouseOut={(e) => {
          if (displayMode !== 'wireframe') {
            e.currentTarget.style.backgroundColor = buttonStyle('wireframe').backgroundColor;
          }
        }}
      >
        Wireframe
      </button>
      <button
        style={buttonStyle('solid')}
        onClick={() => onDisplayModeChange('solid')}
        onMouseOver={(e) => {
          if (displayMode !== 'solid') {
            e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
          }
        }}
        onMouseOut={(e) => {
          if (displayMode !== 'solid') {
            e.currentTarget.style.backgroundColor = buttonStyle('solid').backgroundColor;
          }
        }}
      >
        Solid
      </button>
      <button
        style={buttonStyle('shaded')}
        onClick={() => onDisplayModeChange('shaded')}
        onMouseOver={(e) => {
          if (displayMode !== 'shaded') {
            e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
          }
        }}
        onMouseOut={(e) => {
          if (displayMode !== 'shaded') {
            e.currentTarget.style.backgroundColor = buttonStyle('shaded').backgroundColor;
          }
        }}
      >
        Shaded
      </button>
    </div>
  );
}
