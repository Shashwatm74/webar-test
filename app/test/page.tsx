"use client";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [deviceInfo, setDeviceInfo] = useState<{
    userAgent: string;
    isIOS: boolean;
    isAndroid: boolean;
    isMobile: boolean;
  } | null>(null);

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
  }, []);

  if (!deviceInfo) {
    return <div>Loading device info...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Device Detection Test</h1>
      <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
        <h3>Detection Results:</h3>
        <p><strong>Is iOS:</strong> {deviceInfo.isIOS ? "✅ YES" : "❌ NO"}</p>
        <p><strong>Is Android:</strong> {deviceInfo.isAndroid ? "✅ YES" : "❌ NO"}</p>
        <p><strong>Is Mobile:</strong> {deviceInfo.isMobile ? "✅ YES" : "❌ NO"}</p>
        <p><strong>User Agent:</strong> {deviceInfo.userAgent}</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Expected Behavior:</h3>
        <ul>
          <li>iOS devices: Will use model-viewer with GLB support</li>
          <li>Android/Other devices: Will use Three.js AR Scene</li>
        </ul>
      </div>
    </div>
  );
}
