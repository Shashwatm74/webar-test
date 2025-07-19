"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ModelViewer from "./components/ModelViewer";

const ARScene = dynamic(() => import("./components/ARscenes"), { ssr: false });

export default function Home() {
  const [isIOS, setIsIOS] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Detect iOS devices
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsLoaded(true);
  }, []);

  // Don't render until we've detected the platform to avoid hydration mismatch
  if (!isLoaded) {
    return (
      <main style={{ width: "100vw", height: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "white", fontSize: "18px" }}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={{ width: "100vw", height: "100vh", background: "#000" }}>
      {isIOS ? (
        <ModelViewer
          src="/model.glb"
          alt="3D Model"
          ar
          arModes="scene-viewer quick-look"
          autoRotate
          cameraControls
          toneMapping="neutral"
          shadowIntensity="1"
          interactionPrompt="auto"
          style={{ width: "100%", height: "100%" }}
        >
          <button 
            slot="ar-button" 
            id="ar-button"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              borderRadius: "25px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              zIndex: 1000
            }}
          >
            View in your space
          </button>
        </ModelViewer>
      ) : (
        <ARScene />
      )}
    </main>
  );
}
