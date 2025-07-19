"use client";
import React, { useEffect, useRef, useState } from "react";

interface SimpleIOSARProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
}

export default function SimpleIOSAR({ src, alt = "3D Model", style }: SimpleIOSARProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const initCameraAR = async () => {
      try {
        // Import model-viewer
        await import('@google/model-viewer');
        
        if (containerRef.current) {
          // Create model-viewer that immediately starts AR-like experience
          const modelViewer = document.createElement('model-viewer');
          
          // Configure for immediate camera-like experience
          modelViewer.setAttribute('src', src);
          modelViewer.setAttribute('alt', alt);
          modelViewer.setAttribute('ar', '');
          modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
          modelViewer.setAttribute('camera-controls', '');
          modelViewer.setAttribute('auto-rotate', '');
          modelViewer.setAttribute('touch-action', 'pan-y');
          modelViewer.setAttribute('loading', 'eager');
          modelViewer.setAttribute('reveal', 'auto');
          // Set initial orientation (Y axis rotation example, adjust as needed)
          modelViewer.setAttribute('rotation', '0deg 0deg 0deg');
          // Maximize visibility
          modelViewer.setAttribute('shadow-intensity', '0');
          modelViewer.setAttribute('environment-image', 'neutral');
          modelViewer.setAttribute('exposure', '1');
          modelViewer.setAttribute('disable-zoom', '');
          modelViewer.setAttribute('disable-pan', '');
          modelViewer.setAttribute('disable-tap', '');
          // Remove any possible translucency
          modelViewer.style.opacity = '1';
          modelViewer.style.filter = 'none';
          
          // Make it fullscreen like Android
          modelViewer.style.width = '100%';
          modelViewer.style.height = '100%';
          modelViewer.style.backgroundColor = '#000';
          
          // Auto-enter AR mode on load (simulate Android behavior)
          modelViewer.addEventListener('load', () => {
            console.log('Model loaded - ready for AR');
            // Try to auto-activate AR experience
            setTimeout(() => {
              const arButton = modelViewer.querySelector('[slot="ar-button"]') as HTMLElement;
              if (arButton) {
                // Don't auto-click, but make it very prominent
                arButton.style.display = 'block';
              }
            }, 1000);
          });

          // AR session events - hide instructions when AR starts
          modelViewer.addEventListener('ar-status', (event: any) => {
            if (event.detail.status === 'session-started') {
              setShowInstructions(false);
            } else if (event.detail.status === 'not-presenting') {
              setShowInstructions(true);
            }
          });

          // Create a prominent AR button (like Android's WebXR button)
          const arButton = document.createElement('button');
          arButton.setAttribute('slot', 'ar-button');
          arButton.innerHTML = 'START AR';
          arButton.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.9);
            color: #000;
            border: none;
            border-radius: 4px;
            padding: 16px 32px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            text-transform: uppercase;
            letter-spacing: 1px;
          `;

          modelViewer.appendChild(arButton);
          containerRef.current.appendChild(modelViewer);
        }
      } catch (err) {
        console.error('Failed to initialize AR:', err);
      }
    };

    initCameraAR();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [src, alt]);

  return (
    <div style={{ position: 'relative', ...style }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Instructions overlay - exactly like Android */}
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
          Tap START AR, then tap to place object
        </div>
      )}
    </div>
  );
}
