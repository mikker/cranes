import dynamic from "next/dynamic";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Cylinder,
  softShadows,
  Plane,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Crane = dynamic(() => import("../components/Crane"), { ssr: false });

import Picker from "../components/Picker";

// softShadows()

export default function Home() {
  // const [colors, setColors] = useState({
  //   bg: "#E2D5B5",
  //   floor: "#B5A880",
  //   crane: "#041BFB",
  //   emissive: "#FB8064",
  //   directLight: "#FFFFFF",
  //   piedestal: "#C1A16E",
  // });
  const [colors, setColors] = useState({
    bg: '#111',
    floor: '#444',
    crane: randomColor(),
    emissive: randomColor(),
    directLight: randomColor(),
  });

  return (
    <main className="p-5">
      <div className="max-w-4xl mx-auto bg-yellow-300 flex">
        <div className="flex-0 p-2 bg-gray-100 space-y-1 flex flex-col">
          {Object.keys(colors).map((key) => (
            <Picker
              key={key}
              color={colors[key]}
              onChange={(color) => {
                const newColors = { ...colors, [key]: color.hex };
                setColors(newColors);
              }}
            />
          ))}
          <button
            onClick={() => {
              setColors(randomColors(colors));
            }}
          >
            ♻️
          </button>
        </div>

        <div className="flex-1 flex aspect-w-1 aspect-h-1 relative z-0 bg-gray-800">
          <div>
            <Canvas
              dpr={1}
              shadows={{ enabled: false }}
              camera={{
                position: [0, 0.8, 2.3],
                rotation: [Math.PI / 1.5, 0, 0],
                fov: 70
              }}
            >
              <color attach="background" args={[colors.bg]} />
              <fog attach="fog" args={[colors.bg, 0, 10]} />
              {/* <OrbitControls /> */}

              <ambientLight intensity={0.1} />
              <directionalLight
                color={colors.directLight}
                intensity={2}
                position={[0, 3, 0]}
                castShadow
              />
              <directionalLight
                //color={colors.directLight}
                intensity={2}
                position={[0, 1, 2]}
                // castShadow
              />

              <EffectComposer>
                <Bloom intensity={1.0} />
              </EffectComposer>
              <Suspense fallback={null}>
                <Crane
                  rotation={[0, Math.PI / 4, 0]}
                  color={colors.crane}
                  emissive={colors.emissive}
                  emissiveIntensity={0.5}
                  metallic={0.6}
                  roughness={0.2}
                />
              </Suspense>
              <Plane
                args={[100, 10]}
                position={[0, -1, 0]}
                rotation-x={-Math.PI / 2}
                receiveShadow
              >
                <meshPhongMaterial color={colors.floor} refractionRatio={0.8} />
              </Plane>
              {/* <Environment preset="city" background={false} /> */}
            </Canvas>
          </div>
        </div>
      </div>
    </main>
  );
}

function randomColors(colors) {
  const out = {};
  for (const key in colors) {
    out[key] = randomColor()
  }
  return out;
}

function randomColor() {
      return "#" +
      Math.floor(Math.random() * 2 ** 24)
        .toString(16)
        .padStart(6, "0");
}
