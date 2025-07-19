"use client";
import React, { useEffect, useRef, useState } from "react";

interface SimpleIOSARProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
}

export default function SimpleIOSAR({ src, alt = "3D Model", style }: SimpleIOSARProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const initSimpleAR = async () => {
      try {
        // Import model-viewer
        await import('@google/model-viewer');
        
        if (containerRef.current) {
          // Create a simple model-viewer element that works like Android
          const modelViewer = document.createElement('model-viewer');
          
          // Basic AR setup - similar to Android approach
          modelViewer.setAttribute('src', src);
          modelViewer.setAttribute('alt', alt);
          modelViewer.setAttribute('ar', '');
          modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
          modelViewer.setAttribute('camera-controls', '');
          modelViewer.setAttribute('touch-action', 'pan-y');
          modelViewer.setAttribute('loading', 'eager');
          
          // Style for full camera view
          modelViewer.style.width = '100%';
          modelViewer.style.height = '100%';
          modelViewer.style.backgroundColor = 'transparent';
          
          // Event listeners
          modelViewer.addEventListener('load', () => {
            console.log('Model loaded for iOS AR');
            setIsReady(true);
          });
          
          modelViewer.addEventListener('error', (e) => {
            console.error('Model loading error:', e);
            setError('Failed to load model');
          });

          // AR session events
          modelViewer.addEventListener('ar-status', (event: any) => {
            console.log('AR Status:', event.detail.status);
            if (event.detail.status === 'session-started') {
              setShowInstructions(false);
            } else if (event.detail.status === 'not-presenting') {
              setShowInstructions(true);
            }
          });

          containerRef.current.appendChild(modelViewer);
        }
      } catch (err) {
        console.error('Failed to initialize iOS AR:', err);
        setError('AR not supported');
      }
    };

    initSimpleAR();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [src, alt]);

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
            Please use Safari or Chrome on iOS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Instructions overlay - similar to Android */}
      {showInstructions && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            zIndex: 999,
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          Tap AR button to start camera, then tap to place object
        </div>
      )}

      {/* Loading indicator */}
      {!isReady && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '16px',
          zIndex: 1000,
          textAlign: 'center'
        }}>
          Loading AR...
        </div>
      )}
    </div>
  );
}
