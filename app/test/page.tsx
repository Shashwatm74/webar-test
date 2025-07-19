"use client";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [deviceInfo, setDeviceInfo] = useState<{
    userAgent: string;
    isIOS: boolean;
    isAndroid: boolean;
    isMobile: boolean;
  } | null>(null);
  
  const [cameraStatus, setCameraStatus] = useState<string>("Not tested");
  const [arSupport, setArSupport] = useState<string>("Checking...");

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isMobile = /Mobi|Android/i.test(ua);

    setDeviceInfo({
      userAgent: ua,
      isIOS,
      isAndroid,
      isMobile,
    });

    // Check AR support
    if (isIOS) {
      setArSupport("iOS - AR Quick Look supported");
    } else if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setArSupport(supported ? "WebXR AR supported" : "WebXR available but AR not supported");
      }).catch(() => {
        setArSupport("WebXR not available");
      });
    } else {
      setArSupport("No AR support detected");
    }
  }, []);

  const testCameraAccess = async () => {
    setCameraStatus("Testing...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStatus("✅ Camera access granted");
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setCameraStatus(`❌ Camera access denied: ${(error as Error).message}`);
    }
  };

  if (!deviceInfo) {
    return <div>Loading device info...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", color: "white", background: "#000", minHeight: "100vh" }}>
      <h1>Device Detection & AR Capability Test</h1>
      
      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>📱 Device Detection Results:</h3>
        <p><strong>Is iOS:</strong> {deviceInfo.isIOS ? "✅ YES" : "❌ NO"}</p>
        <p><strong>Is Android:</strong> {deviceInfo.isAndroid ? "✅ YES" : "❌ NO"}</p>
        <p><strong>Is Mobile:</strong> {deviceInfo.isMobile ? "✅ YES" : "❌ NO"}</p>
        <p><strong>User Agent:</strong> <small>{deviceInfo.userAgent}</small></p>
      </div>

      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>🎯 AR Support:</h3>
        <p><strong>AR Capability:</strong> {arSupport}</p>
      </div>

      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>📷 Camera Access Test:</h3>
        <p><strong>Status:</strong> {cameraStatus}</p>
        <button 
          onClick={testCameraAccess}
          style={{
            background: "#007AFF",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            marginTop: "10px"
          }}
        >
          Test Camera Access
        </button>
        <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "10px" }}>
          This will request camera permission if not already granted.
        </p>
      </div>

      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>🔧 Expected Behavior:</h3>
        <ul style={{ paddingLeft: "20px" }}>
          <li><strong>iOS devices:</strong> Will use SimpleIOSAR with camera-first AR experience (like Android)</li>
          <li><strong>Android/Other devices:</strong> Will use Three.js AR Scene with WebXR</li>
          <li><strong>Both platforms:</strong> Tap AR button → Camera opens → Tap to place object</li>
          <li><strong>No separate screens:</strong> Object appears directly in camera view on both platforms</li>
        </ul>
      </div>

      <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>🚨 Troubleshooting:</h3>
        {deviceInfo.isIOS ? (
          <div>
            <p><strong>For iOS:</strong></p>
            <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
              <li>Ensure you're using Safari or Chrome</li>
              <li>Enable camera permissions in Settings &gt; Safari &gt; Camera</li>
              <li>Make sure you're on HTTPS (required for camera access)</li>
              <li>Try refreshing the page after enabling permissions</li>
            </ul>
          </div>
        ) : (
          <div>
            <p><strong>For Android/Desktop:</strong></p>
            <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
              <li>Use Chrome or a WebXR-compatible browser</li>
              <li>Enable camera permissions when prompted</li>
              <li>Make sure you're on HTTPS (required for WebXR)</li>
            </ul>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <a 
          href="/"
          style={{
            background: "#28a745",
            color: "white",
            padding: "15px 30px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600"
          }}
        >
          🏠 Back to AR Experience
        </a>
      </div>
    </div>
  );
}
