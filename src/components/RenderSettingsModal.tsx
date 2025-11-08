import { useState, useEffect } from 'react';

export interface RenderSettings {
  samples: number;
  bounces: number;
  transmissiveBounces: number;
  tileX: number;
  tileY: number;
  resolutionWidth: number;
  resolutionHeight: number;
}

interface RenderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RenderSettings;
  onSave: (settings: RenderSettings) => void;
}

export function RenderSettingsModal({ isOpen, onClose, settings, onSave }: RenderSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<RenderSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#2b2b2b',
        border: '1px solid #3f3f3f',
        borderRadius: '4px',
        padding: '20px',
        width: '500px',
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px',
          color: '#cccccc',
        }}>Render Settings</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Samples */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontSize: '13px',
              color: '#cccccc',
            }}>
              Samples
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={localSettings.samples}
              onChange={(e) => setLocalSettings({ ...localSettings, samples: parseInt(e.target.value) || 1 })}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1e1e1e',
                border: '1px solid #3f3f3f',
                borderRadius: '2px',
                color: '#cccccc',
                fontSize: '13px',
              }}
            />
            <small style={{ color: '#858585', fontSize: '11px' }}>
              Number of samples per pixel (higher = better quality, slower)
            </small>
          </div>

          {/* Bounces */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontSize: '13px',
              color: '#cccccc',
            }}>
              Light Bounces
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={localSettings.bounces}
              onChange={(e) => setLocalSettings({ ...localSettings, bounces: parseInt(e.target.value) || 1 })}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1e1e1e',
                border: '1px solid #3f3f3f',
                borderRadius: '2px',
                color: '#cccccc',
                fontSize: '13px',
              }}
            />
            <small style={{ color: '#858585', fontSize: '11px' }}>
              Maximum number of light bounces
            </small>
          </div>

          {/* Transmissive Bounces */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontSize: '13px',
              color: '#cccccc',
            }}>
              Transmissive Bounces
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={localSettings.transmissiveBounces}
              onChange={(e) => setLocalSettings({ ...localSettings, transmissiveBounces: parseInt(e.target.value) || 1 })}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1e1e1e',
                border: '1px solid #3f3f3f',
                borderRadius: '2px',
                color: '#cccccc',
                fontSize: '13px',
              }}
            />
            <small style={{ color: '#858585', fontSize: '11px' }}>
              Maximum number of transmissive (glass/transparent) bounces
            </small>
          </div>

          {/* Tile Size */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontSize: '13px',
              color: '#cccccc',
            }}>
              Tile Size
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                max="8"
                value={localSettings.tileX}
                onChange={(e) => setLocalSettings({ ...localSettings, tileX: parseInt(e.target.value) || 1 })}
                style={{
                  flex: 1,
                  padding: '6px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3f3f3f',
                  borderRadius: '2px',
                  color: '#cccccc',
                  fontSize: '13px',
                }}
              />
              <span style={{ color: '#cccccc' }}>×</span>
              <input
                type="number"
                min="1"
                max="8"
                value={localSettings.tileY}
                onChange={(e) => setLocalSettings({ ...localSettings, tileY: parseInt(e.target.value) || 1 })}
                style={{
                  flex: 1,
                  padding: '6px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3f3f3f',
                  borderRadius: '2px',
                  color: '#cccccc',
                  fontSize: '13px',
                }}
              />
            </div>
            <small style={{ color: '#858585', fontSize: '11px' }}>
              Number of tiles to divide the render into (lower = faster progress, higher = better performance)
            </small>
          </div>

          {/* Resolution */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontSize: '13px',
              color: '#cccccc',
            }}>
              Resolution
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                min="100"
                max="4096"
                value={localSettings.resolutionWidth}
                onChange={(e) => setLocalSettings({ ...localSettings, resolutionWidth: parseInt(e.target.value) || 100 })}
                style={{
                  flex: 1,
                  padding: '6px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3f3f3f',
                  borderRadius: '2px',
                  color: '#cccccc',
                  fontSize: '13px',
                }}
              />
              <span style={{ color: '#cccccc' }}>×</span>
              <input
                type="number"
                min="100"
                max="4096"
                value={localSettings.resolutionHeight}
                onChange={(e) => setLocalSettings({ ...localSettings, resolutionHeight: parseInt(e.target.value) || 100 })}
                style={{
                  flex: 1,
                  padding: '6px',
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #3f3f3f',
                  borderRadius: '2px',
                  color: '#cccccc',
                  fontSize: '13px',
                }}
              />
            </div>
            <small style={{ color: '#858585', fontSize: '11px' }}>
              Output image resolution in pixels (Width × Height)
            </small>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '24px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3f3f3f',
              border: 'none',
              borderRadius: '2px',
              color: '#cccccc',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0e639c',
              border: 'none',
              borderRadius: '2px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
