/**
 * HeroScene3D.tsx - 3D Scene for Home Page Hero
 * 
 * Renders animated 3D shapes (icosahedron, torus, spheres, particles) 
 * as a background decoration for the home page hero section.
 * Uses @react-three/fiber and @react-three/drei for 3D rendering.
 */
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Icosahedron, Octahedron, Box } from "@react-three/drei";
import * as THREE from "three";

function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.5}>
      <Icosahedron ref={ref} args={[1.2, 1]} position={[2.5, 0.5, 0]}>
        <MeshDistortMaterial
          color="#3b82f6"
          wireframe
          distort={0.3}
          speed={2}
          transparent
          opacity={0.4}
        />
      </Icosahedron>
    </Float>
  );
}

function FloatingTorus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
      <Torus ref={ref} args={[0.8, 0.25, 16, 32]} position={[-2.8, -0.5, -1]}>
        <MeshWobbleMaterial
          color="#8b5cf6"
          wireframe
          factor={0.4}
          speed={1.5}
          transparent
          opacity={0.35}
        />
      </Torus>
    </Float>
  );
}

function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.25;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={2}>
      <Octahedron ref={ref} args={[0.7]} position={[-1.5, 1.5, -0.5]}>
        <MeshDistortMaterial
          color="#06b6d4"
          wireframe
          distort={0.2}
          speed={3}
          transparent
          opacity={0.3}
        />
      </Octahedron>
    </Float>
  );
}

function GlowingSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1);
  });
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
      <Sphere ref={ref} args={[0.5, 32, 32]} position={[1.5, -1.5, 0.5]}>
        <MeshDistortMaterial
          color="#3b82f6"
          distort={0.5}
          speed={2}
          transparent
          opacity={0.2}
        />
      </Sphere>
    </Float>
  );
}

function ParticleCloud() {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingBox() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.2}>
      <Box ref={ref} args={[0.6, 0.6, 0.6]} position={[3, -1, -1]}>
        <MeshWobbleMaterial
          color="#10b981"
          wireframe
          factor={0.3}
          speed={1}
          transparent
          opacity={0.25}
        />
      </Box>
    </Float>
  );
}

const HeroScene3D = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#3b82f6" />
        <pointLight position={[3, -2, -2]} intensity={0.3} color="#8b5cf6" />

        <FloatingIcosahedron />
        <FloatingTorus />
        <FloatingOctahedron />
        <GlowingSphere />
        <FloatingBox />
        <ParticleCloud />
      </Canvas>
    </div>
  );
};

// Export the component
export default HeroScene3D;
