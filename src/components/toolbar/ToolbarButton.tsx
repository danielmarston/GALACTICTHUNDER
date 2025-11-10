import type { ToolbarButton } from './types';

interface ToolbarButtonProps {
  button: ToolbarButton;
}

export function ToolbarButtonComponent({ button }: ToolbarButtonProps) {
  const buttonStyle = {
    padding: button.icon ? '8px' : '6px 12px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '1px solid #4a4a4a',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: '36px',
    width: button.icon ? '36px' : 'auto',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
  };

  return (
    <button
      onClick={button.action}
      title={button.tooltip}
      style={buttonStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#3a3a3a';
        e.currentTarget.style.borderColor = '#5a5a5a';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#2a2a2a';
        e.currentTarget.style.borderColor = '#4a4a4a';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {button.icon ? (
        <img 
          src={button.icon} 
          alt={button.label} 
          style={{ 
            width: '24px', 
            height: '24px',
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))'
          }} 
        />
      ) : (
        <span>{button.label}</span>
      )}
    </button>
  );
}
