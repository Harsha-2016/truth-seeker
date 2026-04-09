import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { DetectiveState } from '../DetectiveScene';

interface DetectiveProps {
  state: DetectiveState;
}

export const Detective = ({ state }: DetectiveProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const headRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a2e', roughness: 0.7, metalness: 0.1 }), []);
  const coatMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2d2d44', roughness: 0.6, metalness: 0.15 }), []);
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4a574', roughness: 0.8 }), []);
  const hatMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1e1e32', roughness: 0.5, metalness: 0.2 }), []);
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c9a84c', roughness: 0.2, metalness: 0.8 }), []);
  const lensMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#4cc9f0', transparent: true, opacity: 0.4, roughness: 0.1, metalness: 0.3,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current || !glassRef.current || !glowRef.current || !headRef.current || !armRef.current) return;

    if (state === 'idle') {
      // Walking animation
      const walkX = Math.sin(t * 0.5) * 1.5;
      groupRef.current.position.x = walkX;
      groupRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.05;
      groupRef.current.rotation.y = Math.cos(t * 0.5) > 0 ? 0 : Math.PI;

      // Arm swing
      armRef.current.rotation.x = Math.sin(t * 2) * 0.15;
      glassRef.current.rotation.z = Math.sin(t * 1.5) * 0.1;

      // Glow
      glowRef.current.intensity = 0.5 + Math.sin(t * 2) * 0.2;
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.1;
    } else if (state === 'scanning') {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05);
      groupRef.current.position.y = 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);

      // Raise magnifying glass
      armRef.current.rotation.x = THREE.MathUtils.lerp(armRef.current.rotation.x, -1.2, 0.05);
      glassRef.current.rotation.z = 0;

      // Scanning head movement
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.3;
      headRef.current.rotation.x = Math.sin(t * 0.8) * 0.1 - 0.1;

      // Pulsing glow
      glowRef.current.intensity = 2 + Math.sin(t * 3) * 1.5;
      lensMat.opacity = 0.5 + Math.sin(t * 3) * 0.3;
    } else if (state === 'results') {
      groupRef.current.position.x = 0;
      armRef.current.rotation.x = -0.5;

      // Nod
      headRef.current.rotation.x = Math.sin(t * 2) * 0.15;
      headRef.current.rotation.y = 0;

      glowRef.current.intensity = 3;
      lensMat.opacity = 0.7;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} castShadow>
      {/* Body / Trench Coat */}
      <mesh material={coatMat} position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 1.2, 8]} />
      </mesh>
      {/* Coat tail */}
      <mesh material={coatMat} position={[0, 0.2, -0.05]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.35]} />
      </mesh>
      {/* Coat collar */}
      <mesh material={bodyMat} position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 8]} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 1.85, 0]}>
        {/* Face */}
        <mesh material={skinMat} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
        </mesh>
        {/* Fedora - brim */}
        <mesh material={hatMat} position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 16]} />
        </mesh>
        {/* Fedora - crown */}
        <mesh material={hatMat} position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.22, 0.22, 8]} />
        </mesh>
        {/* Hat band */}
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.225, 0.225, 0.03, 16]} />
          <meshStandardMaterial color="#c9a84c" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Left arm (magnifying glass arm) */}
      <group ref={armRef} position={[0.4, 1.3, 0]}>
        {/* Upper arm */}
        <mesh material={coatMat} position={[0.05, -0.2, 0.15]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
        </mesh>
        {/* Forearm */}
        <mesh material={coatMat} position={[0.05, -0.5, 0.3]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.35, 0.1]} />
        </mesh>

        {/* Magnifying Glass */}
        <group ref={glassRef} position={[0.05, -0.65, 0.45]}>
          {/* Handle */}
          <mesh material={glassMat} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.25, 8]} />
          </mesh>
          {/* Ring */}
          <mesh material={glassMat} position={[0, 0.08, 0.1]}>
            <torusGeometry args={[0.12, 0.015, 8, 24]} />
          </mesh>
          {/* Lens */}
          <mesh material={lensMat} position={[0, 0.08, 0.1]}>
            <circleGeometry args={[0.11, 24]} />
          </mesh>
          <mesh material={lensMat} position={[0, 0.08, 0.1]} rotation={[Math.PI, 0, 0]}>
            <circleGeometry args={[0.11, 24]} />
          </mesh>
          {/* Glow light */}
          <pointLight ref={glowRef} position={[0, 0.08, 0.15]} color="#4cc9f0" intensity={0.5} distance={4} />
        </group>
      </group>

      {/* Right arm */}
      <mesh material={coatMat} position={[-0.4, 1.1, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
      </mesh>

      {/* Legs */}
      <mesh material={bodyMat} position={[0.15, -0.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
      </mesh>
      <mesh material={bodyMat} position={[-0.15, -0.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
      </mesh>

      {/* Shoes */}
      <mesh position={[0.15, -0.4, 0.05]} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.25]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-0.15, -0.4, 0.05]} castShadow>
        <boxGeometry args={[0.16, 0.08, 0.25]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
};
