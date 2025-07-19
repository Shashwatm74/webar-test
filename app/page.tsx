"use client";
import dynamic from "next/dynamic";

const ARScene = dynamic(() => import("./components/ARscenes"), { ssr: false });

export default function Home() {
  return (
    <main>
      <ARScene />
    </main>
  );
}
