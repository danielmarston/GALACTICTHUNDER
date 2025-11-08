import { useState } from 'react';
import { CreateTab } from './toolbar/CreateTab';
import { EditTab } from './toolbar/EditTab';
import { MaterialsTab } from './toolbar/MaterialsTab';
import { RenderTab } from './toolbar/RenderTab';

interface ToolbarProps {
  onAddCube: () => void;
  onAddSphere: () => void;
}

type ToolTab = 'create' | 'edit' | 'materials' | 'render';

export function Toolbar({ onAddCube, onAddSphere }: ToolbarProps) {
  const [activeTab, setActiveTab] = useState<ToolTab>('create');

  const tabStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? '#0e639c' : '#2a2a2a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    marginRight: '2px',
  });

  return (
    <div style={{ backgroundColor: '#1e1e1e', borderBottom: '1px solid #444' }}>
      {/* Tab Headers */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          paddingLeft: '12px',
          paddingTop: '8px',
          backgroundColor: '#1a1a1a',
        }}
      >
        <button
          onClick={() => setActiveTab('create')}
          style={tabStyle(activeTab === 'create')}
          onMouseOver={(e) => {
            if (activeTab !== 'create') {
              e.currentTarget.style.backgroundColor = '#3a3a3a';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'create') {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
            }
          }}
        >
          Create
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          style={tabStyle(activeTab === 'edit')}
          onMouseOver={(e) => {
            if (activeTab !== 'edit') {
              e.currentTarget.style.backgroundColor = '#3a3a3a';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'edit') {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
            }
          }}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          style={tabStyle(activeTab === 'materials')}
          onMouseOver={(e) => {
            if (activeTab !== 'materials') {
              e.currentTarget.style.backgroundColor = '#3a3a3a';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'materials') {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
            }
          }}
        >
          Materials
        </button>
        <button
          onClick={() => setActiveTab('render')}
          style={tabStyle(activeTab === 'render')}
          onMouseOver={(e) => {
            if (activeTab !== 'render') {
              e.currentTarget.style.backgroundColor = '#3a3a3a';
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'render') {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
            }
          }}
        >
          Render
        </button>
      </div>

      {/* Tab Content */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px',
          minHeight: '50px',
          alignItems: 'center',
        }}
      >
        {activeTab === 'create' && <CreateTab onAddCube={onAddCube} onAddSphere={onAddSphere} />}
        {activeTab === 'edit' && <EditTab />}
        {activeTab === 'materials' && <MaterialsTab />}
        {activeTab === 'render' && <RenderTab />}
      </div>
    </div>
  );
}
