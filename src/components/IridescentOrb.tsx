"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Iridescent Fresnel Orb — premium accent inspired by Starry Labs reel.
 *
 * Renderiza una esfera con shader Fresnel + gradiente iridiscente
 * (cyan → magenta → cobalt) que respira sutilmente y rota lento.
 * Sin lights externas, todo se calcula en el fragment shader, así que
 * pesa <2kb en runtime y es 60fps en mobile.
 */
const IridescentMaterial = shaderMaterial(
  {
    time: 0,
    colorA: new THREE.Color("#06d6a0"), // cyan/aqua
    colorB: new THREE.Color("#ef476f"), // magenta/rose
    colorC: new THREE.Color("#3236b7"), // muffment cobalt
  },
  // Vertex
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment
  /* glsl */ `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 colorC;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;

    void main() {
      // Fresnel edge glow
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - dot(viewDir, vNormal), 2.2);

      // Iridescent gradient driven by view angle + time
      float t = sin(time * 0.4 + vNormal.y * 2.0 + vNormal.x * 1.5) * 0.5 + 0.5;
      vec3 iridA = mix(colorA, colorB, t);
      vec3 iridB = mix(colorB, colorC, t);
      vec3 base = mix(iridA, iridB, fresnel);

      // Soft inner shine
      float shine = pow(fresnel, 4.0);
      vec3 finalColor = base + shine * 0.55;

      gl_FragColor = vec4(finalColor, 0.9);
    }
  `,
);
extend({ IridescentMaterial });

// TS augmentation
declare module "@react-three/fiber" {
  interface ThreeElements {
    iridescentMaterial: object;
  }
}

function Orb() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.time = clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.25;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 8]} />
      <iridescentMaterial
        ref={matRef}
        key={IridescentMaterial.key}
        transparent
      />
    </mesh>
  );
}

type Props = {
  size?: number;
  className?: string;
};

export function IridescentOrb({ size = 96, className }: Props) {
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Orb />
      </Canvas>
    </div>
  );
}
