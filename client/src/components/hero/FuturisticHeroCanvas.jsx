import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float, Html, Sparkles } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_PORTFOLIO_CARDS, getHeroCardTemplate } from './heroCardConfig';
import { createTemplateTexture } from './createTemplateTexture';
import './holoShader';

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
  const cardHover = useRef(0);

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

    const el = containerRef.current;
    if (el) {
      const inCardZone = pointer.current.active && pointer.current.px > 0.38;
      el.classList.toggle('futuristic-hero-canvas--card-hover', inCardZone && cardHover.current > 0.25);
    }
  });

  return { pointer, smooth, cardHover };
}

function mapPointerToPage(px, fullBleed) {
  const zoneStart = fullBleed ? 0.4 : 0.22;
  const zoneEnd = fullBleed ? 0.94 : 0.9;
  const t = THREE.MathUtils.clamp((px - zoneStart) / (zoneEnd - zoneStart), 0, 1);
  return t * 2;
}

function CinematicEffects() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0004, 0.0004)}
        radialModulation
        modulationOffset={0.15}
      />
    </EffectComposer>
  );
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

function TemplateFace({ template, pageSmooth, index }) {
  const texture = useMemo(() => createTemplateTexture(template), [template]);
  const screen = useRef();

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (!screen.current) return;
    const active = Math.abs(pageSmooth.current - index) < 0.55;
    screen.current.opacity = active ? 1 : 0.82;
  });

  return (
    <group position={[0, -0.02, DEPTH * 0.72]}>
      <mesh>
        <planeGeometry args={[CARD_W - 0.14, CARD_H - 0.22]} />
        <meshBasicMaterial
          ref={screen}
          map={texture}
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function HoloEdgeOverlay({ pageSmooth, index, accent = '#67e8f9' }) {
  const edge = useRef();
  const scan = useRef();
  const color = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame((state) => {
    const active = Math.abs(pageSmooth.current - index) < 0.55;
    const t = state.clock.elapsedTime;
    if (edge.current) {
      edge.current.uTime = t;
      edge.current.uIntensity = active ? 0.55 : 0.22;
      edge.current.uColor = color;
    }
    if (scan.current) {
      scan.current.uTime = t;
      scan.current.uOpacity = active ? 0.12 : 0.04;
    }
  });

  return (
    <group position={[0, 0, DEPTH * 0.76]}>
      <mesh>
        <planeGeometry args={[CARD_W + 0.02, CARD_H + 0.02]} />
        <holoEdgeMaterial ref={edge} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
        <holoScanMaterial ref={scan} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function HoloCardShell({ children, template, pageSmooth, index, intensity = 1 }) {
  const rim = useRef();
  const accent = template.accent || template.colors?.[1] || '#67e8f9';

  useFrame((state) => {
    if (!rim.current) return;
    const active = Math.abs(pageSmooth.current - index) < 0.55;
    rim.current.emissiveIntensity = (active ? 0.55 : 0.22) * intensity + Math.sin(state.clock.elapsedTime * 2.6) * 0.08;
    rim.current.opacity = active ? 0.12 : 0.05;
  });

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[CARD_W, CARD_H, DEPTH]} />
        <meshStandardMaterial color="#0b1220" metalness={0.75} roughness={0.3} transparent opacity={0.96} />
      </mesh>
      <mesh position={[0, 0, DEPTH * 0.55]}>
        <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
        <meshStandardMaterial color="#020617" metalness={0.2} roughness={0.55} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, CARD_H * 0.5 - 0.08, DEPTH * 0.62]}>
        <planeGeometry args={[CARD_W - 0.16, 0.08]} />
        <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.4} />
      </mesh>
      {['#f87171', '#fbbf24', '#4ade80'].map((color, i) => (
        <mesh key={color} position={[-CARD_W * 0.38 + i * 0.06, CARD_H * 0.5 - 0.08, DEPTH * 0.66]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
        </mesh>
      ))}
      <TemplateFace template={template} pageSmooth={pageSmooth} index={index} />
      <HoloEdgeOverlay pageSmooth={pageSmooth} index={index} accent={accent} />
      <mesh position={[0, 0, DEPTH * 0.78]}>
        <planeGeometry args={[CARD_W + 0.04, CARD_H + 0.04]} />
        <meshStandardMaterial
          ref={rim}
          color={accent}
          emissive={accent}
          emissiveIntensity={0.4}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {children}
    </group>
  );
}

function ScanLine({ mouse, pageSmooth, index, accent = '#a5f3fc' }) {
  const line = useRef();
  useFrame(() => {
    if (!line.current) return;
    const active = Math.abs(pageSmooth.current - index) < 0.55;
    line.current.position.y = THREE.MathUtils.lerp(line.current.position.y, mouse.current.y * -0.55, 0.12);
    line.current.material.opacity = active ? 0.18 : 0.04;
  });
  return (
    <mesh ref={line} position={[0, 0, 0.08]}>
      <planeGeometry args={[CARD_W - 0.2, 0.028]} />
      <meshBasicMaterial color={accent} transparent opacity={0.12} depthWrite={false} />
    </mesh>
  );
}

function CardClickBridge({ pointer, fullBleed, pages, onCardSelect, containerRef }) {
  useEffect(() => {
    if (!onCardSelect) return undefined;

    const onClick = (event) => {
      if (!pointer.current.active) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect?.width) return;

      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) return;

      const px = (event.clientX - rect.left) / rect.width;
      const index = Math.round(THREE.MathUtils.clamp(mapPointerToPage(px, fullBleed), 0, pages.length - 1));
      onCardSelect(pages[index].templateId);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [pointer, fullBleed, pages, onCardSelect, containerRef]);

  return null;
}

function HolographicPortfolioCard({
  mouse,
  pointer,
  cardHover,
  offsetX = 0,
  fullBleed = false,
  onCardSelect,
  containerRef,
}) {
  const root = useRef();
  const cards = useRef([]);
  const pageSmooth = useRef(1);
  const hover = useRef(0);

  const pages = useMemo(
    () =>
      HERO_PORTFOLIO_CARDS.map((card) => ({
        ...card,
        template: getHeroCardTemplate(card.templateId),
      })),
    []
  );

  useFrame((state, delta) => {
    if (!root.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const ease = 1 - Math.exp(-4.4 * delta);

    const inCardZone =
      pointer.current.active &&
      pointer.current.px > (fullBleed ? 0.38 : 0.22) &&
      pointer.current.px < 0.96;
    hover.current = THREE.MathUtils.lerp(hover.current, inCardZone ? 1 : 0, 1 - Math.exp(-6 * delta));
    cardHover.current = hover.current;

    const mapped = pointer.current.active
      ? mapPointerToPage(pointer.current.px, fullBleed)
      : pageSmooth.current;
    pageSmooth.current = THREE.MathUtils.lerp(pageSmooth.current, mapped, ease);

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
      card.position.x = THREE.MathUtils.lerp(card.position.x, side * 0.55, ease);
      card.position.y = THREE.MathUtils.lerp(card.position.y, focus * 0.08 + Math.sin(t * 1.3 + i) * 0.015, ease);
      card.position.z = THREE.MathUtils.lerp(card.position.z, focus * 0.55 - dist * 0.35, ease);
      card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, side * -0.38, ease);
      card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, dist * 0.08, ease);
      card.scale.setScalar(THREE.MathUtils.lerp(card.scale.x, 0.88 + focus * 0.14, ease));
    });
  });

  return (
    <>
      <CardClickBridge
        pointer={pointer}
        fullBleed={fullBleed}
        pages={pages}
        onCardSelect={onCardSelect}
        containerRef={containerRef}
      />
      <Float speed={1.15} rotationIntensity={0.1} floatIntensity={0.22}>
        <group ref={root} position={[offsetX, 0.05, 0]}>
          {pages.map((pageItem, i) => (
            <group
              key={pageItem.templateId}
              ref={(el) => {
                cards.current[i] = el;
              }}
              position={[(i - 1) * 0.55, 0, -i * 0.2]}
            >
              <HoloCardShell template={pageItem.template} pageSmooth={pageSmooth} index={i}>
                <ScanLine
                  mouse={mouse}
                  pageSmooth={pageSmooth}
                  index={i}
                  accent={pageItem.template.accent || '#a5f3fc'}
                />
              </HoloCardShell>
              <Html
                center
                distanceFactor={2.2}
                position={[0, -CARD_H * 0.5 - 0.18, 0.58]}
                style={{ pointerEvents: 'none' }}
              >
                <div className="hero-card-label">
                  <strong>{pageItem.template.name}</strong>
                  <span>{pageItem.label} · Click to edit</span>
                </div>
              </Html>
            </group>
          ))}
          <pointLight position={[0, 0.8, 1.4]} intensity={1.4} color="#67e8f9" distance={5} />
          <pointLight position={[1.2, -0.2, 0.8]} intensity={0.55} color="#818cf8" distance={4} />
        </group>
      </Float>
    </>
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

function SceneContent({ scrollProxy, fullBleed, containerRef, onCardSelect }) {
  const { pointer, smooth, cardHover } = useHeroPointer(containerRef);
  const cardOffset = fullBleed ? 1.25 : 0;
  const lookAtX = cardOffset * 0.65;

  return (
    <>
      <CameraRig mouse={smooth} scrollProxy={scrollProxy} fullBleed={fullBleed} lookAtX={lookAtX} />
      <DynamicLights mouse={smooth} offsetX={cardOffset} />
      <CursorOrb pointer={pointer} lookAtX={lookAtX} />
      <HolographicPortfolioCard
        mouse={smooth}
        pointer={pointer}
        cardHover={cardHover}
        offsetX={cardOffset}
        fullBleed={fullBleed}
        onCardSelect={onCardSelect}
        containerRef={containerRef}
      />
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
      <CinematicEffects />
    </>
  );
}

export default function FuturisticHeroCanvas({ className = '', fullBleed = false, onCardSelect }) {
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
        start: 'top top',
        end: 'bottom top',
        scrub: 0.75,
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
        style={{ pointerEvents: 'none' }}
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
          <SceneContent
            scrollProxy={scrollProxy}
            fullBleed={fullBleed}
            containerRef={wrapRef}
            onCardSelect={onCardSelect}
          />
        </Suspense>
      </Canvas>
      <div
        className={`futuristic-hero-canvas-vignette${fullBleed ? ' futuristic-hero-canvas-vignette--fullbleed' : ''}`}
        aria-hidden="true"
      />
    </div>
  );
}
