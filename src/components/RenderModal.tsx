import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { WebGLPathTracer } from 'three-gpu-pathtracer';
import type { SceneManager } from '../scene/SceneManager';
import type { RenderSettings } from './RenderSettingsModal';

interface RenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneManager: SceneManager;
  settings: RenderSettings;
}

export function RenderModal({ isOpen, onClose, sceneManager, settings }: RenderModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pathTracerRef = useRef<WebGLPathTracer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sampleCountRef = useRef(0);
  const isRenderingRef = useRef(false);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null); // Track which canvas we're using

  // Initialize renderer only once when modal first opens
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    // Always create a fresh renderer when modal opens
    // This ensures we don't have stale WebGL context issues
    
    // Clean up old renderer if it exists
    if (rendererRef.current || pathTracerRef.current) {
      try {
        if (pathTracerRef.current) {
          pathTracerRef.current.dispose();
          pathTracerRef.current = null;
        }
      } catch (e) {
        console.warn('Error disposing path tracer:', e);
        pathTracerRef.current = null;
      }
      
      try {
        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current = null;
        }
      } catch (e) {
        console.warn('Error disposing renderer:', e);
        rendererRef.current = null;
      }
    }

    // Setup renderer and path tracer
    const canvas = canvasRef.current;
    canvasElementRef.current = canvas;
    
    // Create a new renderer just for this modal
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: false,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(settings.resolutionWidth, settings.resolutionHeight);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    const pathTracer = new WebGLPathTracer(renderer);
    pathTracer.tiles.set(settings.tileX, settings.tileY);
    pathTracer.renderToCanvas = true; // Automatically render to canvas
    
    // Set path tracer quality settings from user configuration
    pathTracer.bounces = settings.bounces;
    pathTracer.transmissiveBounces = settings.transmissiveBounces;
    
    pathTracerRef.current = pathTracer;
  }, [isOpen, settings]);

  // Update scene when modal opens or sceneManager changes
  useEffect(() => {
    if (!isOpen || !pathTracerRef.current) {
      return;
    }

    const pathTracer = pathTracerRef.current;
    const scene = sceneManager.getScene();
    
    // Use the perspective camera from the viewport
    const perspectiveCamera = sceneManager.getPerspectiveCamera();
    
    if (!perspectiveCamera) {
      console.warn('Perspective camera not available yet');
      return;
    }
    
    // Create a new camera with the same properties as the perspective camera
    const camera = new THREE.PerspectiveCamera(
      perspectiveCamera.fov,
      settings.resolutionWidth / settings.resolutionHeight,
      perspectiveCamera.near,
      perspectiveCamera.far
    );
    
    // Copy position, rotation, and other properties
    camera.position.copy(perspectiveCamera.position);
    camera.rotation.copy(perspectiveCamera.rotation);
    camera.quaternion.copy(perspectiveCamera.quaternion);
    camera.up.copy(perspectiveCamera.up);
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    
    pathTracer.setScene(scene, camera);
    pathTracer.reset();
    pathTracer.renderToCanvas = true;
    
    // Reset progress when scene changes or modal opens
    setProgress(0);
    setIsRendering(false);
    isRenderingRef.current = false;
    sampleCountRef.current = 0;
    
    // Stop any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
  }, [isOpen, sceneManager, settings]);

  // Handle modal closing - stop rendering
  useEffect(() => {
    if (!isOpen) {
      // Modal is closing, stop any ongoing render
      isRenderingRef.current = false;
      setIsRendering(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isOpen]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      isRenderingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      try {
        if (pathTracerRef.current) {
          pathTracerRef.current.dispose();
        }
      } catch (e) {
        console.warn('Error disposing path tracer on unmount:', e);
      }
      
      try {
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      } catch (e) {
        console.warn('Error disposing renderer on unmount:', e);
      }
    };
  }, []);

  const startRender = () => {
    if (!pathTracerRef.current || !rendererRef.current) {
      console.error('Path tracer or renderer not initialized');
      return;
    }

    const pathTracer = pathTracerRef.current;
    
    setIsRendering(true);
    isRenderingRef.current = true;
    setProgress(0);
    sampleCountRef.current = 0;

    const targetSamples = settings.samples;

    const render = () => {
      if (!isRenderingRef.current || !pathTracer) {
        return;
      }

      try {
        // Render multiple samples per frame for better performance
        const samplesPerFrame = 1;
        for (let i = 0; i < samplesPerFrame && sampleCountRef.current < targetSamples; i++) {
          pathTracer.renderSample();
          sampleCountRef.current++;
        }
        
        const progressPercent = (sampleCountRef.current / targetSamples) * 100;
        setProgress(progressPercent);

        if (sampleCountRef.current < targetSamples) {
          animationFrameRef.current = requestAnimationFrame(render);
        } else {
          setIsRendering(false);
          isRenderingRef.current = false;
        }
      } catch (error) {
        console.error('Error during rendering:', error);
        setIsRendering(false);
        isRenderingRef.current = false;
      }
    };

    pathTracer.reset();
    pathTracer.renderToCanvas = true;
    render();
  };

  const stopRender = () => {
    setIsRendering(false);
    isRenderingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const saveImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `render_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Path Traced Render</h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: '#fff',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 8px',
            }}
          >
            ×
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={settings.resolutionWidth}
          height={settings.resolutionHeight}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(90vh - 150px)',
            border: '1px solid #444',
            backgroundColor: '#1a1a1a',
            display: 'block',
          }}
        />

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!isRendering ? (
            <button
              onClick={startRender}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0e639c',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Start Render
            </button>
          ) : (
            <button
              onClick={stopRender}
              style={{
                padding: '8px 16px',
                backgroundColor: '#c41e3a',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Stop
            </button>
          )}

          <button
            onClick={saveImage}
            disabled={isRendering}
            style={{
              padding: '8px 16px',
              backgroundColor: isRendering ? '#555' : '#0e639c',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isRendering ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
          >
            Save Image
          </button>

          {isRendering && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <progress
                value={progress}
                max={100}
                style={{
                  flex: 1,
                  height: '20px',
                  accentColor: '#0e639c',
                }}
              />
              <span style={{ color: '#fff', fontSize: '14px', minWidth: '50px' }}>
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
