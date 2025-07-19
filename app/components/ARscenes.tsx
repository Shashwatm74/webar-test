"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loadARButton = async () => {
  const module = await import("three/examples/jsm/webxr/ARButton.js");
  return module.ARButton;
};

export default function ARScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);
  const [modelVisible, setModelVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const dragging = useRef<boolean>(false);
  const lastTap = useRef<number>(0);

  // Touch state for pinch-to-zoom
  let currentTouches: TouchList | null = null;
  let lastPinchDistance = 0;

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let reticle: THREE.Mesh;

    const init = async () => {
      const canvas = document.createElement("canvas");
      containerRef.current?.appendChild(canvas);

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera();

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Load GLB model
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync("/model.glb");
      const model = gltf.scene;
      model.scale.set(0.0005, 0.0005, 0.0005); // very small default
      model.visible = false;
      modelRef.current = model;
      scene.add(model);

      // Reticle
      const ring = new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      reticle = new THREE.Mesh(ring, mat);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      reticleRef.current = reticle;
      scene.add(reticle);

      // AR controller
      const controller = renderer.xr.getController(0);
      scene.add(controller);

      controller.addEventListener("select", () => {
        if (reticle.visible && modelRef.current) {
          modelRef.current.position.setFromMatrixPosition(reticle.matrix);
          modelRef.current.position.y += 0.005;
          modelRef.current.visible = true;
          setShowInstructions(false);
        }
      });

      // ✅ Handle system-level gestures
      window.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
          currentTouches = e.touches;
          const dx = currentTouches[0].clientX - currentTouches[1].clientX;
          const dy = currentTouches[0].clientY - currentTouches[1].clientY;
          lastPinchDistance = Math.sqrt(dx * dx + dy * dy);
        }

        // Double tap to reset
        if (e.touches.length === 1) {
          const now = Date.now();
          if (now - lastTap.current < 300) {
            if (modelRef.current) {
              modelRef.current.scale.set(0.0005, 0.0005, 0.0005);
            }
          }
          lastTap.current = now;
        }

        if (e.touches.length === 1) dragging.current = true;
      });

      window.addEventListener("touchmove", (e) => {
        if (e.touches.length === 2) {
          currentTouches = e.touches;
        }
      });

      window.addEventListener("touchend", () => {
        currentTouches = null;
        dragging.current = false;
        lastPinchDistance = 0;
      });

      // AR Button + Hit Test
      const ARButton = await loadARButton();
      document.body.appendChild(
        ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
      );

      let hitTestSource: XRHitTestSource | undefined;
      let localSpace: XRReferenceSpace | undefined;

      renderer.xr.addEventListener("sessionstart", async () => {
        const session = renderer.xr.getSession();
        if (!session) return;

        const viewerSpace = await session.requestReferenceSpace("viewer");

        if (typeof session.requestHitTestSource === "function") {
          hitTestSource = await session.requestHitTestSource({
            space: viewerSpace,
          });
        }

        localSpace = await session.requestReferenceSpace("local");
      });

      renderer.xr.addEventListener("sessionend", () => {
        if (modelRef.current) {
          modelRef.current.visible = false;
        }
        setModelVisible(false);
        setShowInstructions(true);
      });

      renderer.setAnimationLoop((_, frame) => {
        // Pinch to resize
        if (currentTouches && currentTouches.length === 2 && modelRef.current) {
          const dx = currentTouches[0].clientX - currentTouches[1].clientX;
          const dy = currentTouches[0].clientY - currentTouches[1].clientY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delta = distance - lastPinchDistance;

          if (Math.abs(delta) > 0.5) {
            const scaleFactor = 1 + delta * 0.001;
            const model = modelRef.current;
            const newScale = THREE.MathUtils.clamp(
              model.scale.x * scaleFactor,
              0.0001,
              0.05
            );
            model.scale.set(newScale, newScale, newScale);
            lastPinchDistance = distance;
          }
        }

        // Drag-to-move
        if (dragging.current && reticleRef.current && modelRef.current) {
          modelRef.current.position.setFromMatrixPosition(
            reticleRef.current.matrix
          );
          modelRef.current.position.y += 0.005;
        }

        if (frame && hitTestSource && localSpace) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length > 0) {
            const pose = hitTestResults[0].getPose(localSpace);
            if (pose && reticleRef.current) {
              reticleRef.current.visible = true;
              reticleRef.current.matrix.fromArray(pose.transform.matrix);
            }
          } else if (reticleRef.current) {
            reticleRef.current.visible = false;
          }
        }

        renderer.render(scene, camera);
      });
    };

    init();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        touchAction: "none",
      }}
    >
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
          Tap to place, pinch to resize, double-tap to reset scale.
        </div>
      )}
    </div>
  );
}
