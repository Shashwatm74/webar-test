"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SimpleIOSAR from "./components/SimpleIOSAR";

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
        <SimpleIOSAR
          src="/model.glb"
          alt="3D Model"
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <ARScene />
      )}
    </main>
  );
}
