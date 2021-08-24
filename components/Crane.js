import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const roundedSquareWave = (t, delta, a, f) => {
  return ((2 * a) / Math.PI) * (Math.sin(2 * Math.PI * t * f) / delta)
}

export default function Model({ rotation, ...props }) {
  const crane = useRef();
  const { nodes } = useGLTF("/crane.gltf");

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    crane.current.rotation.z = Math.sin(t) / 2.5
    crane.current.position.y = roundedSquareWave(t / 2, 0.5, 0.1, 1/0.8)
  });

  return (
    <group dispose={null}>
      <mesh
        name="1994a6e96ae44d89880db3a0b954255d"
        receiveShadow
        castShadow
        rotation={rotation}
        geometry={nodes["1994a6e96ae44d89880db3a0b954255d"].geometry}
        ref={crane}
      >
        <meshStandardMaterial {...props} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/crane.gltf");
