interface CreateTabProps {
  onAddCube: () => void;
  onAddSphere: () => void;
}

export function CreateTab({ onAddCube, onAddSphere }: CreateTabProps) {
  const buttonStyle = {
    padding: '6px 12px',
    backgroundColor: '#0e639c',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'normal',
  };

  return (
    <>
      <button
        onClick={onAddCube}
        style={buttonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1177bb')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0e639c')}
      >
        Add Cube
      </button>
      <button
        onClick={onAddSphere}
        style={buttonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1177bb')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0e639c')}
      >
        Add Sphere
      </button>
    </>
  );
}
