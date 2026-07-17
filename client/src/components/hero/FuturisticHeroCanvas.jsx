import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARD_W = 2.35;
const CARD_H = 1.55;
const DEPTH = 0.04;

function useHeroPointer(containerRef) {
  const pointer = useRef({
    ndcX: 0,
    ndcY: 0,
    x: 0,
    y: 0,
    px: 0.5,
    py: 0.5,
    active: false,
  });
  const smooth = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useEffect(() => {
    const update = (clientX, clientY, active) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect?.width || !rect?.height) return;

      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!inside) {
        pointer.current.active = false;
        return;
      }

      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      const ndcX = px * 2 - 1;
      const ndcY = -(py * 2 - 1);

      pointer.current.ndcX = ndcX;
      pointer.current.ndcY = ndcY;
      pointer.current.x = ndcX;
      pointer.current.y = ndcY;
      pointer.current.px = px;
      pointer.current.py = py;
      pointer.current.active = active;
    };

    const onMove = (event) => update(event.clientX, event.clientY, true);
    const onLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [containerRef]);

  useFrame((_, delta) => {
    const lerp = 1 - Math.exp(-5.5 * delta);
    const prevX = smooth.current.x;
    const prevY = smooth.current.y;
    smooth.current.x += (pointer.current.x - smooth.current.x) * lerp;
    smooth.current.y += (pointer.current.y - smooth.current.y) * lerp;
    smooth.current.vx = (smooth.current.x - prevX) / Math.max(delta, 0.001);
    smooth.current.vy = (smooth.current.y - prevY) / Math.max(delta, 0.001);
  });

  return { pointer, smooth };
}

function OrbitingParticles({ count = 160, mouse }) {
  const pointsRef = useRef();
  const speeds = useMemo(() => Float32Array.from({ length: count }, () => 0.18 + Math.random() * 0.7), [count]);
  const radii = useMemo(() => Float32Array.from({ length: count }, () => 1.5 + Math.random() * 3.1), [count]);
  const phases = useMemo(() => Float32Array.from({ length: count }, () => Math.random() * Math.PI * 2), [count]);
  const heights = useMemo(() => Float32Array.from({ length: count }, () => (Math.random() - 0.5) * 2.6), [count]);
  const sizes = useMemo(() => Float32Array.from({ length: count }, () => 0.018 + Math.random() * 0.03), [count]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const a = phases[i];
      arr[i * 3] = Math.cos(a) * radii[i];
      arr[i * 3 + 1] = heights[i];
      arr[i * 3 + 2] = Math.sin(a) * radii[i];
    }
    return arr;
  }, [count, phases, radii, heights]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const pos = points.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    for (let i = 0; i < count; i += 1) {
      const a = phases[i] + t * speeds[i];
      const pulse = 1 + Math.sin(t * 1.4 + phases[i]) * 0.04;
      pos[i * 3] = Math.cos(a) * radii[i] * pulse + mx * 0.55 * (0.35 + sizes[i] * 8);
      pos[i * 3 + 1] = heights[i] + Math.sin(t * 0.8 + phases[i]) * 0.18 + my * -0.45 * (0.4 + sizes[i] * 6);
      pos[i * 3 + 2] = Math.sin(a) * radii[i] * pulse + mx * -0.2;
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.rotation.y = t * 0.04 + mx * 0.12;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        color="#67e8f9"
        transparent
        opacity={0.82}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HoloRings({ mouse }) {
  const group = useRef();
  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, t * 0.12 + mx * 0.35, 1 - Math.exp(-2 * delta));
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.sin(t * 0.2) * 0.1 + my * -0.25, 1 - Math.exp(-2 * delta));
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx * 0.4, 1 - Math.exp(-2 * delta));
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      {[1.85, 2.4, 3.0].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2.35, 0, index * 0.45]}>
          <torusGeometry args={[radius, 0.01, 16, 160]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={1.35 - index * 0.28}
            transparent
            opacity={0.48}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function HeroFace({ activeRef, mouse }) {
  const glow = useRef();
  const bars = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const active = activeRef.current;
    if (glow.current) {
      glow.current.emissiveIntensity = (active ? 1.6 : 0.55) + Math.sin(t * 2.2) * 0.2;
      glow.current.opacity = active ? 0.9 : 0.35;
    }
    bars.current.forEach((mesh, i) => {
      if (!mesh) return;
      const wave = 0.35 + (Math.sin(t * 2.4 + i) * 0.5 + 0.5) * 0.55 + Math.abs(mouse.current.x) * 0.1;
      mesh.scale.y = wave;
      mesh.position.y = -0.22 + wave * 0.28;
    });
  });

  return (
    <group position={[0, 0, 0.025]}>
      <mesh position={[-0.72, 0.18, 0]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial ref={glow} color="#22d3ee" emissive="#0891b2" emissiveIntensity={1.2} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.18, 0.34, 0]}>
        <planeGeometry args={[0.9, 0.16]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#38bdf8" emissiveIntensity={0.45} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.1, 0.12, 0]}>
        <planeGeometry args={[1.05, 0.1]} />
        <meshStandardMaterial color="#94a3b8" emissive="#0ea5e9" emissiveIntensity={0.2} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.32, -0.12, 0]}>
        <planeGeometry args={[0.55, 0.14]} />
        <meshStandardMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={1.1} transparent opacity={0.8} />
      </mesh>
      {[0.35, 0.55, 0.75].map((x, i) => (
        <mesh
          key={x}
          ref={(el) => {
            bars.current[i] = el;
          }}
          position={[x, -0.22, 0]}
        >
          <boxGeometry args={[0.14, 0.55, 0.01]} />
          <meshStandardMaterial color="#a5f3fc" emissive="#22d3ee" emissiveIntensity={1.05} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function WorkFace({ activeRef, mouse }) {
  const cards = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const active = activeRef.current;
    cards.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.y = 0.05 + Math.sin(t * 1.8 + i * 1.1) * 0.03 * (active ? 1 : 0.3);
      mesh.material.emissiveIntensity = (active ? 0.85 : 0.25) + Math.abs(mouse.current.y) * 0.2;
      mesh.material.opacity = active ? 0.88 : 0.3;
    });
  });

  const items = [
    [-0.7, 0.15],
    [-0.05, 0.15],
    [0.6, 0.15],
    [-0.7, -0.35],
    [-0.05, -0.35],
    [0.6, -0.35],
  ];

  return (
    <group position={[0, 0, 0.025]}>
      <mesh position={[0, 0.48, 0]}>
        <planeGeometry args={[1.6, 0.12]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#818cf8" emissiveIntensity={0.45} transparent opacity={0.75} />
      </mesh>
      {items.map(([x, y], i) => (
        <mesh
          key={`${x}-${y}`}
          ref={(el) => {
            cards.current[i] = el;
          }}
          position={[x, y, 0]}
        >
          <planeGeometry args={[0.55, 0.38]} />
          <meshStandardMaterial color="#0f172a" emissive="#4f46e5" emissiveIntensity={0.7} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function AboutFace({ activeRef, mouse }) {
  const lines = useRef([]);
  const avatar = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const active = activeRef.current;
    if (avatar.current) {
      avatar.current.emissiveIntensity = active ? 1.3 : 0.4;
      avatar.current.opacity = active ? 0.85 : 0.3;
    }
    lines.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 0.55 + Math.sin(t * 2 + i * 0.6) * 0.08 + mouse.current.x * 0.04;
      mesh.scale.x = pulse * (1.1 - i * 0.12);
      mesh.material.opacity = (active ? 0.75 : 0.28) * pulse;
    });
  });

  return (
    <group position={[0, 0, 0.025]}>
      <mesh position={[-0.75, 0.2, 0]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial ref={avatar} color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={1} transparent opacity={0.7} />
      </mesh>
      {[0.42, 0.22, 0.02, -0.18, -0.38].map((y, i) => (
        <mesh
          key={y}
          ref={(el) => {
            lines.current[i] = el;
          }}
          position={[0.35, y, 0]}
        >
          <planeGeometry args={[1.2, 0.09]} />
          <meshStandardMaterial color="#cbd5e1" emissive="#22d3ee" emissiveIntensity={0.35} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function PortfolioPage({ kind, pageSmooth, index, mouse }) {
  const activeRef = useRef(false);
  useFrame(() => {
    activeRef.current = Math.abs(pageSmooth.current - index) < 0.55;
  });

  return (
    <group>
      {kind === 'hero' ? <HeroFace activeRef={activeRef} mouse={mouse} /> : null}
      {kind === 'work' ? <WorkFace activeRef={activeRef} mouse={mouse} /> : null}
      {kind === 'about' ? <AboutFace activeRef={activeRef} mouse={mouse} /> : null}
    </group>
  );
}

function HoloCardShell({ children, intensity = 1 }) {
  const rim = useRef();

  useFrame((state) => {
    if (!rim.current) return;
    rim.current.emissiveIntensity = 0.8 * intensity + Math.sin(state.clock.elapsedTime * 2.6) * 0.25;
  });

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[CARD_W, CARD_H, DEPTH]} />
        <meshStandardMaterial color="#07101d" metalness={0.75} roughness={0.28} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0, DEPTH * 0.55]}>
        <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
        <meshStandardMaterial color="#020617" metalness={0.35} roughness={0.4} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, CARD_H * 0.5 - 0.08, DEPTH * 0.62]}>
        <planeGeometry args={[CARD_W - 0.16, 0.08]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.35} emissive="#164e63" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-CARD_W * 0.38, CARD_H * 0.5 - 0.08, DEPTH * 0.66]}>
        <circleGeometry args={[0.025, 16]} />
        <meshStandardMaterial color="#f87171" emissive="#ef4444" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-CARD_W * 0.32, CARD_H * 0.5 - 0.08, DEPTH * 0.66]}>
        <circleGeometry args={[0.025, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-CARD_W * 0.26, CARD_H * 0.5 - 0.08, DEPTH * 0.66]}>
        <circleGeometry args={[0.025, 16]} />
        <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, DEPTH * 0.7]}>
        <planeGeometry args={[CARD_W + 0.04, CARD_H + 0.04]} />
        <meshStandardMaterial
          ref={rim}
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={0.9}
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -DEPTH * 0.55]}>
        <planeGeometry args={[CARD_W - 0.1, CARD_H - 0.1]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0891b2" emissiveIntensity={0.55 * intensity} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      {children}
    </group>
  );
}

function ScanLine({ mouse, pageSmooth, index }) {
  const line = useRef();
  useFrame(() => {
    if (!line.current) return;
    const active = Math.abs(pageSmooth.current - index) < 0.55;
    line.current.position.y = THREE.MathUtils.lerp(line.current.position.y, mouse.current.y * -0.55, 0.12);
    line.current.material.opacity = active ? 0.45 : 0.12;
  });
  return (
    <mesh ref={line} position={[0, 0, 0.08]}>
      <planeGeometry args={[CARD_W - 0.2, 0.035]} />
      <meshBasicMaterial color="#a5f3fc" transparent opacity={0.35} depthWrite={false} />
    </mesh>
  );
}

function mapPointerToPage(px, fullBleed) {
  const zoneStart = fullBleed ? 0.4 : 0.22;
  const zoneEnd = fullBleed ? 0.94 : 0.9;
  const t = THREE.MathUtils.clamp((px - zoneStart) / (zoneEnd - zoneStart), 0, 1);
  return t * 2;
}

function HolographicPortfolioCard({ mouse, pointer, offsetX = 0, fullBleed = false }) {
  const root = useRef();
  const cards = useRef([]);
  const labels = useRef([]);
  const hit = useRef();
  const hover = useRef(0);
  const page = useRef(1);
  const pageSmooth = useRef(1);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const { camera } = useThree();

  const pages = useMemo(
    () => [
      { kind: 'hero', label: 'Hero' },
      { kind: 'work', label: 'Work' },
      { kind: 'about', label: 'About' },
    ],
    []
  );

  useFrame((state, delta) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const ease = 1 - Math.exp(-4.4 * delta);

    ndc.set(pointer.current.ndcX, pointer.current.ndcY);
    raycaster.setFromCamera(ndc, camera);
    const hits = hit.current ? raycaster.intersectObject(hit.current, true) : [];
    hover.current = THREE.MathUtils.lerp(hover.current, hits.length ? 1 : 0, 1 - Math.exp(-6 * delta));

    const mapped = pointer.current.active
      ? mapPointerToPage(pointer.current.px, fullBleed)
      : pageSmooth.current;
    page.current = mapped;
    pageSmooth.current = THREE.MathUtils.lerp(pageSmooth.current, page.current, ease);

    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, mx * 0.55, ease);
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, my * -0.35 + hover.current * -0.06, ease);
    root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, mx * -0.06, ease);
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, offsetX + mx * 0.22, ease);
    root.current.position.y = THREE.MathUtils.lerp(
      root.current.position.y,
      0.05 + Math.sin(t * 1.05) * 0.1 + hover.current * 0.16,
      ease
    );
    root.current.position.z = THREE.MathUtils.lerp(root.current.position.z, hover.current * 0.25, ease);
    root.current.scale.setScalar(THREE.MathUtils.lerp(root.current.scale.x, 0.96 + hover.current * 0.06, ease));

    cards.current.forEach((card, i) => {
      if (!card) return;
      const dist = Math.abs(pageSmooth.current - i);
      const focus = Math.max(0, 1 - dist);
      const side = i - pageSmooth.current;
      const targetX = side * 0.55;
      const targetZ = focus * 0.55 - dist * 0.35;
      const targetY = focus * 0.08 + Math.sin(t * 1.3 + i) * 0.015;
      const targetRotY = side * -0.38;
      const targetRotX = dist * 0.08;
      card.position.x = THREE.MathUtils.lerp(card.position.x, targetX, ease);
      card.position.y = THREE.MathUtils.lerp(card.position.y, targetY, ease);
      card.position.z = THREE.MathUtils.lerp(card.position.z, targetZ, ease);
      card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, targetRotY, ease);
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, targetRotX, ease);
      card.scale.setScalar(THREE.MathUtils.lerp(card.scale.x, 0.88 + focus * 0.14, ease));
    });

    labels.current.forEach((label, i) => {
      if (!label) return;
      const focus = Math.max(0, 1 - Math.abs(pageSmooth.current - i));
      label.material.opacity = 0.2 + focus * 0.75;
      label.position.y = -1.05 + focus * 0.04;
    });
  });

  return (
    <Float speed={1.15} rotationIntensity={0.1} floatIntensity={0.22}>
      <group ref={root} position={[offsetX, 0.05, 0]}>
        <mesh ref={hit} visible={false} position={[0, 0, 0.2]}>
          <boxGeometry args={[3.4, 2.4, 2]} />
        </mesh>

        {pages.map((pageItem, i) => (
          <group
            key={pageItem.kind}
            ref={(el) => {
              cards.current[i] = el;
            }}
            position={[(i - 1) * 0.55, 0, -i * 0.2]}
          >
            <HoloCardShell intensity={1}>
              <PortfolioPage kind={pageItem.kind} pageSmooth={pageSmooth} index={i} mouse={mouse} />
              <ScanLine mouse={mouse} pageSmooth={pageSmooth} index={i} />
            </HoloCardShell>
          </group>
        ))}

        {pages.map((pageItem, i) => (
          <mesh
            key={`label-${pageItem.kind}`}
            ref={(el) => {
              labels.current[i] = el;
            }}
            position={[(i - 1) * 0.72, -1.05, 0.6]}
          >
            <planeGeometry args={[0.55, 0.12]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} depthWrite={false} />
          </mesh>
        ))}

        <pointLight position={[0, 0.8, 1.4]} intensity={1.4} color="#67e8f9" distance={5} />
        <pointLight position={[1.2, -0.2, 0.8]} intensity={0.55} color="#818cf8" distance={4} />
      </group>
    </Float>
  );
}

function CursorOrb({ pointer, lookAtX }) {
  const light = useRef();
  const orb = useRef();
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const planeNormal = useMemo(() => new THREE.Vector3(), []);
  const planePoint = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!light.current || !orb.current || !pointer.current.active) return;

    ndc.set(pointer.current.ndcX, pointer.current.ndcY);
    raycaster.setFromCamera(ndc, camera);
    camera.getWorldDirection(planeNormal);
    planePoint.set(lookAtX, 0.2, 0);
    plane.setFromNormalAndCoplanarPoint(planeNormal.negate(), planePoint);

    if (raycaster.ray.intersectPlane(plane, hit)) {
      light.current.position.copy(hit);
      orb.current.position.copy(hit);
      light.current.intensity = 2.2 + Math.abs(pointer.current.x) * 0.8 + Math.abs(pointer.current.y) * 0.5;
      orb.current.material.opacity = 0.42;
    }
  });

  return (
    <>
      <pointLight ref={light} color="#67e8f9" intensity={2.2} distance={8} decay={2} />
      <mesh ref={orb}>
        <sphereGeometry args={[0.06, 20, 20]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

function DynamicLights({ mouse, offsetX }) {
  const key = useRef();
  const rim = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    if (key.current) {
      key.current.position.x = offsetX + 2.1 + mx * 1.1;
      key.current.position.y = 2.5 + my * -0.6 + Math.sin(t) * 0.15;
      key.current.position.z = 2 + mx * 0.3;
      key.current.intensity = 2.4 + Math.abs(mx) * 0.6;
    }
    if (rim.current) {
      rim.current.position.x = offsetX - 2.6 + mx * -0.9;
      rim.current.position.y = 1.1 + my * 0.35;
      rim.current.intensity = 1.7 + Math.abs(my) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.22} color="#94a3b8" />
      <hemisphereLight intensity={0.35} color="#e2e8f0" groundColor="#020617" />
      <directionalLight ref={key} position={[2.4, 2.8, 2]} intensity={2.4} color="#f8fafc" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight ref={rim} position={[-2.6, 1.2, -1.4]} intensity={1.7} color="#22d3ee" />
    </>
  );
}

function CameraRig({ mouse, scrollProxy, fullBleed, lookAtX }) {
  const { camera } = useThree();
  const intro = useRef({
    z: fullBleed ? 9.0 : 8.3,
    y: fullBleed ? 1.1 : 1.3,
  });

  useEffect(() => {
    camera.position.set(fullBleed ? -0.55 : 0, intro.current.y, intro.current.z);
    camera.lookAt(lookAtX, 0.25, 0);
    const tween = gsap.to(intro.current, {
      z: fullBleed ? 5.4 : 5.1,
      y: fullBleed ? 0.55 : 0.7,
      duration: 2.5,
      ease: 'power3.out',
    });
    return () => tween.kill();
  }, [camera, fullBleed, lookAtX]);

  useFrame((_, delta) => {
    const scroll = scrollProxy.current || 0;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const targetX = (fullBleed ? -0.45 : 0) + mx * 0.85;
    const targetY = intro.current.y + my * -0.4 + scroll * 0.55;
    const targetZ = intro.current.z + scroll * 1.8 - Math.abs(mx) * 0.15;
    const lerp = 1 - Math.exp(-3.6 * delta);
    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY - camera.position.y) * lerp;
    camera.position.z += (targetZ - camera.position.z) * lerp;
    camera.lookAt(lookAtX + mx * 0.35, 0.2 + my * -0.1 - scroll * 0.12, 0);
  });

  return null;
}

function SceneContent({ scrollProxy, fullBleed, containerRef }) {
  const { pointer, smooth } = useHeroPointer(containerRef);
  const cardOffset = fullBleed ? 1.25 : 0;
  const lookAtX = cardOffset * 0.65;

  return (
    <>
      <CameraRig mouse={smooth} scrollProxy={scrollProxy} fullBleed={fullBleed} lookAtX={lookAtX} />
      <DynamicLights mouse={smooth} offsetX={cardOffset} />
      <CursorOrb pointer={pointer} lookAtX={lookAtX} />
      <HolographicPortfolioCard mouse={smooth} pointer={pointer} offsetX={cardOffset} fullBleed={fullBleed} />
      <group position={[cardOffset, 0, 0]}>
        <HoloRings mouse={smooth} />
        <OrbitingParticles count={fullBleed ? 190 : 150} mouse={smooth} />
        <Sparkles count={fullBleed ? 64 : 44} scale={[8.5, 5, 8.5]} size={2.4} speed={0.4} color="#a5f3fc" opacity={0.5} />
        <ContactShadows position={[0, -1.25, 0]} opacity={0.55} scale={12} blur={2.6} far={5} color="#0a0f1e" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.28, 0]} receiveShadow>
          <circleGeometry args={[5, 64]} />
          <meshStandardMaterial color="#0a0f1e" emissive="#082f49" emissiveIntensity={0.22} roughness={0.9} metalness={0.1} />
        </mesh>
      </group>
    </>
  );
}

export default function FuturisticHeroCanvas({ className = '', fullBleed = false }) {
  const wrapRef = useRef(null);
  const cursorRef = useRef(null);
  const scrollProxy = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    const cursor = cursorRef.current;
    if (!el) return undefined;

    const moveCursor = (clientX, clientY, visible) => {
      if (!cursor) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!inside || !visible) {
        cursor.style.opacity = '0';
        return;
      }

      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      cursor.style.left = `${px * 100}%`;
      cursor.style.top = `${py * 100}%`;
      cursor.style.opacity = '1';
    };

    const onMove = (event) => moveCursor(event.clientX, event.clientY, true);
    const onLeave = () => moveCursor(0, 0, false);

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.15, ease: 'power2.out', delay: 0.05 });

      ScrollTrigger.create({
        trigger: fullBleed ? el.parentElement || el : el,
        start: fullBleed ? 'top top' : 'top 70%',
        end: 'bottom top',
        scrub: 0.65,
        onUpdate: (self) => {
          scrollProxy.current = self.progress;
        },
      });
    }, el);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      ctx.revert();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [fullBleed]);

  return (
    <div
      ref={wrapRef}
      className={`futuristic-hero-canvas${fullBleed ? ' futuristic-hero-canvas--fullbleed' : ''} ${className}`.trim()}
    >
      <div ref={cursorRef} className="hero-cursor-follower" aria-hidden="true" />
      <Canvas
        dpr={[1, 1.75]}
        shadows
        camera={{
          position: fullBleed ? [-0.55, 1.1, 9] : [0, 1.2, 8],
          fov: fullBleed ? 46 : 42,
          near: 0.1,
          far: 60,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0a0f1e']} />
        <fog attach="fog" args={['#0a0f1e', fullBleed ? 8 : 7, fullBleed ? 22 : 18]} />
        <Suspense fallback={null}>
          <SceneContent scrollProxy={scrollProxy} fullBleed={fullBleed} containerRef={wrapRef} />
        </Suspense>
      </Canvas>
      <div
        className={`futuristic-hero-canvas-vignette${fullBleed ? ' futuristic-hero-canvas-vignette--fullbleed' : ''}`}
        aria-hidden="true"
      />
    </div>
  );
}
