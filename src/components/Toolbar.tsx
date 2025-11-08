import { useState, useMemo } from 'react';
import { ToolbarButtonComponent } from './toolbar/ToolbarButton';
import type { TabConfig } from './toolbar/types';

interface ToolbarProps {
  onAddCube: () => void;
  onAddSphere: () => void;
}

export function Toolbar({ onAddCube, onAddSphere }: ToolbarProps) {
  const [activeTab, setActiveTab] = useState<string>('create');

  // Define all tabs as configuration objects
  const tabs: TabConfig[] = useMemo(() => [
    {
      id: 'create',
      label: 'Create',
      buttons: [
        {
          label: 'Add Cube',
          tooltip: 'Add a cube to the scene',
          action: onAddCube,
        },
        {
          label: 'Add Sphere',
          tooltip: 'Add a sphere to the scene',
          action: onAddSphere,
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      buttons: [],
    },
    {
      id: 'materials',
      label: 'Materials',
      buttons: [],
    },
    {
      id: 'lighting',
      label: 'Lighting',
      buttons: [],
    },
    {
      id: 'animation',
      label: 'Animation',
      buttons: [],
    },
    {
      id: 'render',
      label: 'Render',
      buttons: [],
    },
  ], [onAddCube, onAddSphere]);

  const activeTabConfig = tabs.find(tab => tab.id === activeTab);

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    backgroundColor: isActive ? '#0e639c' : '#2a2a2a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold' as const,
    marginRight: '2px',
    verticalAlign: 'bottom' as const,
    boxSizing: 'border-box' as const,
    height: '36px',
    fontFamily: 'inherit',
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
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = '#3a3a3a';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
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
        {activeTabConfig && activeTabConfig.buttons.length > 0 ? (
          activeTabConfig.buttons.map((button, index) => (
            <ToolbarButtonComponent key={index} button={button} />
          ))
        ) : (
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
            {activeTabConfig?.label} tools coming soon...
          </p>
        )}
      </div>
    </div>
  );
}
