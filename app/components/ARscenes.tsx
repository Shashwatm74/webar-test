"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const loadARButton = async () => {
  const module = await import("three/examples/jsm/webxr/ARButton.js");
  return module.ARButton;
};

export default function ARScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let reticle: THREE.Mesh;
    let model: THREE.Group;

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

      // Load .obj model
      const loader = new OBJLoader();
      model = await loader.loadAsync("/model.obj");
      model.scale.set(0.1, 0.1, 0.1);
      model.visible = false;
      scene.add(model);

      // Reticle
      const ring = new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      reticle = new THREE.Mesh(ring, mat);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      const controller = renderer.xr.getController(0);
      scene.add(controller);

      controller.addEventListener("select", () => {
        if (reticle.visible) {
          model.position.setFromMatrixPosition(reticle.matrix);
          model.visible = true;
        }
      });

      // Load AR button
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
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
            }
          } else {
            reticle.visible = false;
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
      }}
    ></div>
  );
}
