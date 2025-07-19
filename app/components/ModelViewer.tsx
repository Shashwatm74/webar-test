"use client";
import React, { useEffect, useRef, useState } from "react";

interface ModelViewerProps {
  src: string;
  alt?: string;
  ar?: boolean;
  arModes?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  toneMapping?: string;
  shadowIntensity?: string;
  interactionPrompt?: string;
  iosSrc?: string;
  poster?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function ModelViewer({
  src,
  alt = "3D Model",
  ar = false,
  arModes = "scene-viewer quick-look",
  autoRotate = false,
  cameraControls = false,
  toneMapping = "neutral",
  shadowIntensity = "1",
  interactionPrompt = "auto",
  iosSrc,
  poster,
  style,
  children,
}: ModelViewerProps) {
  const modelViewerRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import model-viewer to avoid SSR issues
    import('@google/model-viewer')
      .then(() => {
        if (modelViewerRef.current) {
          const element = modelViewerRef.current;
          element.setAttribute('src', src);
          element.setAttribute('alt', alt);
          if (ar) element.setAttribute('ar', '');
          element.setAttribute('ar-modes', arModes);
          if (autoRotate) element.setAttribute('auto-rotate', '');
          if (cameraControls) element.setAttribute('camera-controls', '');
          element.setAttribute('tone-mapping', toneMapping);
          element.setAttribute('shadow-intensity', shadowIntensity);
          element.setAttribute('interaction-prompt', interactionPrompt);
          if (iosSrc) element.setAttribute('ios-src', iosSrc);
          if (poster) element.setAttribute('poster', poster);
          
          // Add event listeners
          element.addEventListener('load', () => setIsLoaded(true));
          element.addEventListener('error', (e) => {
            console.error('Model Viewer Error:', e);
            setError('Failed to load 3D model');
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load model-viewer:', err);
        setError('Failed to load model viewer');
      });
  }, [src, alt, ar, arModes, autoRotate, cameraControls, toneMapping, shadowIntensity, interactionPrompt, iosSrc, poster]);

  if (error) {
    return (
      <div style={{ 
        ...style, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        background: '#000'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>⚠️ {error}</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Please check your model file and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      {React.createElement('model-viewer', {
        ref: modelViewerRef,
        style: { width: '100%', height: '100%' },
      }, children)}
      
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '16px',
          zIndex: 1000
        }}>
          Loading 3D model...
        </div>
      )}
    </div>
  );
}
