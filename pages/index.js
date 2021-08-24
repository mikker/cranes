import dynamic from "next/dynamic";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Cylinder,
  softShadows
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Crane = dynamic(() => import("../components/Crane"), { ssr: false });

import Picker from "../components/Picker";

// softShadows()

export default function Home() {
  const [colors, setColors] = useState({
    bg: "#E2D5B5",
    floor: "#B5A880",
    crane: "#041BFB",
    emissive: "#FB8064",
    directLight: "#FFFFFF",
    piedestal: "#C1A16E",
  });

  return (
    <main className="">
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
              shadows={{ enabled: true }}
              camera={{
                position: [0, 1.3, 3],
                rotation: [Math.PI / 1.5, 0, 0],
              }}
            >
              <color attach="background" args={[colors.bg]} />
              {/* <OrbitControls /> */}
              <directionalLight
                color={colors.directLight}
                position={[0, 2, 0]}
                castShadow
              />
              <Suspense fallback={null}>
                <EffectComposer>
                  <Bloom intensity={0.5} />
                </EffectComposer>
                <Crane
                  rotation={[Math.PI / 2, 0, 0]}
                  color={colors.crane}
                  emissive={colors.emissive}
                  metallic={0.6}
                  roughness={0.2}
                />
                <Cylinder
                  position={[0, -0.7, 0]}
                  args={[0.8, 0.8, 0.2, 50]}
                  receiveShadow
                  castShadow
                >
                  <meshStandardMaterial color={colors.piedestal} />
                </Cylinder>
                <Cylinder
                  position={[0, -0.9, 0]}
                  args={[1, 1, 0.2, 50]}
                  receiveShadow
                  castShadow
                >
                  <meshStandardMaterial color={colors.piedestal} />
                </Cylinder>
                <mesh
                  position={[0, -1, 0]}
                  rotation-x={-Math.PI / 2}
                  receiveShadow
                >
                  <planeGeometry args={[100, 10]} />
                  <meshStandardMaterial color={colors.floor} />
                </mesh>
                <Environment preset="city" background={false} />
              </Suspense>
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
    out[key] =
      "#" +
      Math.floor(Math.random() * 2 ** 24)
        .toString(16)
        .padStart(6, "0");
  }
  return out;
}
