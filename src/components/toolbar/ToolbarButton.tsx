import type { ToolbarButton } from './types';

interface ToolbarButtonProps {
  button: ToolbarButton;
}

export function ToolbarButtonComponent({ button }: ToolbarButtonProps) {
  const buttonStyle = {
    padding: '6px 12px',
    backgroundColor: '#0e639c',
    color: '#fff',
    border: '1px solid #0a4a7a',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: '28px',
    boxSizing: 'border-box' as const,
  };

  return (
    <button
      onClick={button.action}
      title={button.tooltip}
      style={buttonStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#1177bb';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#0e639c';
      }}
    >
      {button.icon && <span>{button.icon}</span>}
      <span>{button.label}</span>
    </button>
  );
}
