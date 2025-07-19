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
  ar = true,
  arModes = "webxr scene-viewer quick-look",
  autoRotate = true,
  cameraControls = true,
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
  const [arSupported, setArSupported] = useState(false);

  useEffect(() => {
    // Check for AR support
    const checkARSupport = () => {
      // Check for WebXR support
      if ('xr' in navigator) {
        (navigator as any).xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
          setArSupported(supported);
        }).catch(() => {
          // Fallback to checking for iOS AR Quick Look
          const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
          setArSupported(isIOSDevice);
        });
      } else {
        // Fallback for iOS devices without WebXR
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setArSupported(isIOSDevice);
      }
    };

    // Dynamically import model-viewer to avoid SSR issues
    import('@google/model-viewer')
      .then(() => {
        checkARSupport();
        
        if (modelViewerRef.current) {
          const element = modelViewerRef.current;
          
          // Set basic attributes
          element.setAttribute('src', src);
          element.setAttribute('alt', alt);
          element.setAttribute('loading', 'eager');
          element.setAttribute('reveal', 'auto');
          
          // Set AR attributes
          if (ar) {
            element.setAttribute('ar', '');
            element.setAttribute('ar-modes', arModes);
            element.setAttribute('ar-scale', 'auto');
          }
          
          // Set interaction attributes
          if (autoRotate) element.setAttribute('auto-rotate', '');
          if (cameraControls) element.setAttribute('camera-controls', '');
          element.setAttribute('touch-action', 'pan-y');
          
          // Set rendering attributes
          element.setAttribute('tone-mapping', toneMapping);
          element.setAttribute('shadow-intensity', shadowIntensity);
          element.setAttribute('interaction-prompt', interactionPrompt);
          element.setAttribute('interaction-prompt-threshold', '2000');
          
          // iOS specific attributes
          if (iosSrc) element.setAttribute('ios-src', iosSrc);
          if (poster) element.setAttribute('poster', poster);
          
          // Environment and lighting
          element.setAttribute('environment-image', 'neutral');
          element.setAttribute('skybox-image', 'neutral');
          
          // Add event listeners
          element.addEventListener('load', () => {
            console.log('Model loaded successfully');
            setIsLoaded(true);
          });
          
          element.addEventListener('error', (e) => {
            console.error('Model Viewer Error:', e);
            setError('Failed to load 3D model');
          });
          
          element.addEventListener('ar-status', (event: any) => {
            console.log('AR Status:', event.detail.status);
            if (event.detail.status === 'not-presenting') {
              console.log('AR session ended');
            }
          });

          // Camera permission handling for AR
          element.addEventListener('camera-change', (event: any) => {
            console.log('Camera changed:', event.detail);
          });

          // Handle quick-look AR for iOS
          element.addEventListener('quick-look-button-tapped', () => {
            console.log('Quick Look AR initiated');
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
        style: { 
          width: '100%', 
          height: '100%',
          backgroundColor: 'transparent'
        },
      }, children)}
      
      {!isLoaded && (
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
          <div>Loading 3D model...</div>
          {arSupported && (
            <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
              AR Ready
            </div>
          )}
        </div>
      )}

      {isLoaded && !arSupported && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 193, 7, 0.9)',
          color: '#000',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 1000,
          textAlign: 'center'
        }}>
          ⚠️ AR not supported on this device
        </div>
      )}
    </div>
  );
}
