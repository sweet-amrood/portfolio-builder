import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

export const HoloEdgeMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1,
    uColor: new THREE.Color('#67e8f9'),
  },
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.8);
      float scan = sin((gl_FragCoord.y + uTime * 55.0) * 0.75) * 0.5 + 0.5;
      float pulse = 0.85 + sin(uTime * 2.2) * 0.15;
      float alpha = (fresnel * 0.9 + scan * 0.1) * uIntensity * pulse;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
);

export const HoloScanMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 0.35,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      float lines = sin((vUv.y + uTime * 0.35) * 120.0) * 0.5 + 0.5;
      float sweep = smoothstep(0.0, 0.08, abs(fract(vUv.y - uTime * 0.18) - 0.5));
      float alpha = (lines * 0.08 + sweep * 0.22) * uOpacity;
      gl_FragColor = vec4(0.72, 0.95, 1.0, alpha);
    }
  `
);

extend({ HoloEdgeMaterial, HoloScanMaterial });
