"use client";
import React, { useEffect, useRef, useState } from "react";

interface IOSARViewerProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
}

export default function IOSARViewer({ src, alt = "3D Model", style }: IOSARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arAvailable, setArAvailable] = useState(false);

  useEffect(() => {
    // Check if we're on iOS and AR is available
    const checkARAvailability = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setArAvailable(isIOS);
    };

    // Request camera permission early
    const requestCameraPermission = async () => {
      try {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just needed permission
          console.log('Camera permission granted');
        }
      } catch (err) {
        console.warn('Camera permission denied or not available:', err);
      }
    };

    const initModelViewer = async () => {
      try {
        await import('@google/model-viewer');
        checkARAvailability();
        
        // Request camera permission early and more explicitly
        try {
          console.log('Requesting camera permission...');
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment', // Prefer back camera for AR
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          console.log('Camera permission granted successfully');
          stream.getTracks().forEach(track => track.stop());
        } catch (cameraErr) {
          console.warn('Camera permission issue:', cameraErr);
          // Continue anyway, AR might still work
        }
        
        if (containerRef.current) {
          // Create model-viewer element
          const modelViewer = document.createElement('model-viewer');
          
          // Set all necessary attributes for iOS AR
          modelViewer.setAttribute('src', src);
          modelViewer.setAttribute('alt', alt);
          modelViewer.setAttribute('ar', '');
          modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
          modelViewer.setAttribute('camera-controls', '');
          modelViewer.setAttribute('auto-rotate', '');
          modelViewer.setAttribute('loading', 'eager');
          modelViewer.setAttribute('reveal', 'auto');
          modelViewer.setAttribute('interaction-prompt', 'auto');
          modelViewer.setAttribute('interaction-prompt-threshold', '2000');
          modelViewer.setAttribute('ar-scale', 'auto');
          modelViewer.setAttribute('touch-action', 'pan-y');
          
          // iOS specific optimizations
          modelViewer.setAttribute('tone-mapping', 'neutral');
          modelViewer.setAttribute('shadow-intensity', '0.5');
          modelViewer.setAttribute('environment-image', 'neutral');
          
          // Style the element
          modelViewer.style.width = '100%';
          modelViewer.style.height = '100%';
          modelViewer.style.backgroundColor = 'transparent';
          
          // Event listeners
          modelViewer.addEventListener('load', () => {
            console.log('iOS Model loaded');
            setIsModelViewerLoaded(true);
          });
          
          modelViewer.addEventListener('error', (e) => {
            console.error('iOS Model error:', e);
            setError('Failed to load model');
          });

          modelViewer.addEventListener('ar-status', (event: any) => {
            console.log('iOS AR Status:', event.detail.status);
          });

          // Create AR button
          const arButton = document.createElement('button');
          arButton.setAttribute('slot', 'ar-button');
          arButton.innerHTML = '📱 Launch AR Camera';
          arButton.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #007AFF, #0056CC);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 122, 255, 0.4);
            transition: all 0.3s ease;
          `;

          arButton.addEventListener('touchstart', () => {
            arButton.style.transform = 'translateX(-50%) scale(0.95)';
          });

          arButton.addEventListener('touchend', () => {
            arButton.style.transform = 'translateX(-50%) scale(1)';
          });

          modelViewer.appendChild(arButton);
          containerRef.current.appendChild(modelViewer);
        }
      } catch (err) {
        console.error('Failed to initialize iOS AR viewer:', err);
        setError('Failed to initialize AR viewer');
      }
    };

    initModelViewer();

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
        flexDirection: 'column',
        color: 'white',
        background: '#000',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>⚠️ {error}</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>
            Please ensure you're on iOS Safari and camera permissions are enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {!isModelViewerLoaded && (
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
          <div style={{ marginBottom: '10px' }}>🔄 Loading AR experience...</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {arAvailable ? 'Camera access preparing...' : 'Checking device compatibility...'}
          </div>
        </div>
      )}

      {arAvailable && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          textAlign: 'center',
          zIndex: 999
        }}>
          🎯 Pinch, drag & rotate to explore • Tap AR button for camera view
        </div>
      )}
    </div>
  );
}
