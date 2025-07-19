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
  const prevDistance = useRef<number | null>(null);
  const dragging = useRef<boolean>(false);
  const [showInstructions, setShowInstructions] = useState(true);

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

      // Load .glb model
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync("/model.glb");
      const model = gltf.scene;
      model.scale.set(0.0005, 0.0005, 0.0005);
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

      // Tap to place
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

      // Touch gestures
      canvas.addEventListener("touchmove", (event) => {
        if (!modelRef.current) return;

        if (event.touches.length === 2) {
          // Pinch to zoom
          const dx = event.touches[0].clientX - event.touches[1].clientX;
          const dy = event.touches[0].clientY - event.touches[1].clientY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (prevDistance.current !== null) {
            const delta = distance - prevDistance.current;
            const scaleFactor = 1 + delta * 0.001;
            const model = modelRef.current;
            const newScale = model.scale.x * scaleFactor;
            const clamped = Math.max(0.0001, Math.min(0.05, newScale));
            model.scale.set(clamped, clamped, clamped);
          }

          prevDistance.current = distance;
        } else if (
          event.touches.length === 1 &&
          modelRef.current &&
          dragging.current
        ) {
          // Dragging with 1 finger
          if (!reticleRef.current) return;
          const matrix = reticleRef.current.matrix;
          modelRef.current.position.setFromMatrixPosition(matrix);
          modelRef.current.position.y += 0.005;
        }
      });

      canvas.addEventListener("touchstart", (event) => {
        if (event.touches.length === 1) {
          dragging.current = true;
        }
      });

      canvas.addEventListener("touchend", (event) => {
        prevDistance.current = null;
        dragging.current = false;
      });

      // Double-tap to reset scale
      let lastTap = 0;
      canvas.addEventListener("touchstart", (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
          // Double-tap detected
          if (modelRef.current) {
            modelRef.current.scale.set(0.0005, 0.0005, 0.0005);
          }
        }
        lastTap = currentTime;
      });

      // ARButton and hit-test setup
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

      renderer.setAnimationLoop((_, frame) => {
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
          Tap to place, pinch to resize, drag to move, double-tap to reset
          scale.
        </div>
      )}
    </div>
  );
}

// "use client";
// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// // @ts-ignore
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// const loadARButton = async () => {
//   const module = await import("three/examples/jsm/webxr/ARButton.js");
//   return module.ARButton;
// };

// export default function ARScene() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const modelRef = useRef<THREE.Group | null>(null);
//   const prevDistance = useRef<number | null>(null);

//   useEffect(() => {
//     let renderer: THREE.WebGLRenderer;
//     let camera: THREE.PerspectiveCamera;
//     let scene: THREE.Scene;
//     let reticle: THREE.Mesh;

//     const init = async () => {
//       const canvas = document.createElement("canvas");
//       containerRef.current?.appendChild(canvas);

//       renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       renderer.xr.enabled = true;

//       scene = new THREE.Scene();
//       camera = new THREE.PerspectiveCamera();

//       const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//       scene.add(light);

//       // Load .glb model
//       const loader = new GLTFLoader();
//       const gltf = await loader.loadAsync("/model.glb");
//       const model = gltf.scene;
//       model.scale.set(0.0005, 0.0005, 0.0005); // much smaller default scale
//       model.visible = false;
//       modelRef.current = model;
//       scene.add(model);

//       // Reticle
//       const ring = new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2);
//       const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//       reticle = new THREE.Mesh(ring, mat);
//       reticle.matrixAutoUpdate = false;
//       reticle.visible = false;
//       scene.add(reticle);

//       // Tap-to-place
//       const controller = renderer.xr.getController(0);
//       scene.add(controller);

//       controller.addEventListener("select", () => {
//         if (reticle.visible && modelRef.current) {
//           modelRef.current.position.setFromMatrixPosition(reticle.matrix);
//           modelRef.current.position.y += 0.005; // closer to surface
//           modelRef.current.visible = true;
//         }
//       });

//       // Pinch to zoom
//       canvas.addEventListener("touchmove", (event) => {
//         if (event.touches.length === 2 && modelRef.current) {
//           const dx = event.touches[0].clientX - event.touches[1].clientX;
//           const dy = event.touches[0].clientY - event.touches[1].clientY;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (prevDistance.current !== null) {
//             const delta = distance - prevDistance.current;
//             const scaleFactor = 1 + delta * 0.001;
//             const model = modelRef.current;
//             const newScale = model.scale.x * scaleFactor;

//             const clamped = Math.max(0.0001, Math.min(0.05, newScale));
//             model.scale.set(clamped, clamped, clamped);
//           }

//           prevDistance.current = distance;
//         }
//       });

//       canvas.addEventListener("touchend", () => {
//         prevDistance.current = null;
//       });

//       // ARButton and hit-test setup
//       const ARButton = await loadARButton();
//       document.body.appendChild(
//         ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
//       );

//       let hitTestSource: XRHitTestSource | undefined;
//       let localSpace: XRReferenceSpace | undefined;

//       renderer.xr.addEventListener("sessionstart", async () => {
//         const session = renderer.xr.getSession();
//         if (!session) return;

//         const viewerSpace = await session.requestReferenceSpace("viewer");

//         if (typeof session.requestHitTestSource === "function") {
//           hitTestSource = await session.requestHitTestSource({
//             space: viewerSpace,
//           });
//         }

//         localSpace = await session.requestReferenceSpace("local");
//       });

//       renderer.setAnimationLoop((_, frame) => {
//         if (frame && hitTestSource && localSpace) {
//           const hitTestResults = frame.getHitTestResults(hitTestSource);
//           if (hitTestResults.length > 0) {
//             const pose = hitTestResults[0].getPose(localSpace);
//             if (pose) {
//               reticle.visible = true;
//               reticle.matrix.fromArray(pose.transform.matrix);
//             }
//           } else {
//             reticle.visible = false;
//           }
//         }

//         renderer.render(scene, camera);
//       });
//     };

//     init();
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//         position: "relative",
//         touchAction: "none", // Needed for pinch gesture support
//       }}
//     />
//   );
// }
