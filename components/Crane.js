import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const roundedSquareWave = (t, delta, a, f) => {
  return ((2 * a) / Math.PI) * (Math.sin(2 * Math.PI * t * f) / delta);
};

export default function Model({ rotation, ...props }) {
  const crane = useRef();
  const { nodes } = useGLTF("/crane.gltf");

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // crane.current.rotation.y = -t
    // crane.current.rotation.y = (Math.PI / 2.2) + (Math.sin(t) / 2.5)
    // crane.current.position.y = roundedSquareWave(t / 2, 0.3, 0.1, 1 / 0.8);
    crane.current.position.y = Math.sin(t / 0.5) * 0.2 - 0.3
  });

  return (
    <group dispose={null}>
      <mesh
        scale={0.2}
        userData={{ name: "Crane" }}
        receiveShadow
        castShadow
        rotation={rotation}
        geometry={nodes.Crane.geometry}
        ref={crane}
      >
        <meshStandardMaterial {...props} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/crane.gltf");
