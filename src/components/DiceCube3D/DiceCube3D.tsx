import { useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { DiceOrientation, DiceRollProfile } from './dicePhysics';
import styles from './DiceCube3D.module.css';

interface DiceCube3DProps {
  faces: string[];
  orientation: DiceOrientation;
  rolling: boolean;
  disabled?: boolean;
  label: string;
  onRoll: () => void;
  rollProfile?: DiceRollProfile | null;
}

/* ─── Face colors (premium vibrant palette — each face distinctly colored) ─── */
const FACE_COLORS = [
  '#FF6B35', // front - vibrant orange
  '#2EC4B6', // back - teal
  '#3B82F6', // right - royal blue
  '#E040FB', // left - magenta/purple
  '#FFD23F', // top - golden yellow (winner)
  '#06D6A0', // bottom - emerald green
];

const TEXT_COLOR = '#FFFFFF';

/* ─── Canvas texture generator (premium glossy, clean) ─── */
function createFaceTexture(text: string, bgColor: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Solid color fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Subtle top-to-bottom gradient for depth/dimension
  const depthGrad = ctx.createLinearGradient(0, 0, 0, size);
  depthGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
  depthGrad.addColorStop(0.4, 'rgba(255,255,255,0.05)');
  depthGrad.addColorStop(0.6, 'rgba(0,0,0,0)');
  depthGrad.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = depthGrad;
  ctx.fillRect(0, 0, size, size);

  // Specular highlight (top-left circular gloss)
  const specGrad = ctx.createRadialGradient(size * 0.3, size * 0.25, 0, size * 0.3, size * 0.25, size * 0.4);
  specGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
  specGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
  specGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = specGrad;
  ctx.fillRect(0, 0, size, size);

  // Syllable text — white, bold, always lowercase
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Text outline/shadow for readability
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = 'bold 180px Nunito, sans-serif';
  ctx.fillText(text.toLowerCase(), size / 2, size / 2 + 6);

  // Redraw crisp on top
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = TEXT_COLOR;
  ctx.fillText(text.toLowerCase(), size / 2, size / 2 + 6);

  // Subtle stroke for premium engraved look
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeText(text.toLowerCase(), size / 2, size / 2 + 6);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* ─── Easing functions ─── */
function easeOutElastic(t: number): number {
  if (t === 0 || t === 1) return t;
  const p = 0.4;
  return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
}

/* ─── Degree/radian helpers ─── */
const DEG2RAD = Math.PI / 180;

function degToRad(deg: number): number {
  return deg * DEG2RAD;
}

/* ─── Three.js scene state ─── */
interface SceneState {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cube: THREE.Mesh;
  animId: number;
  rolling: boolean;
  rollStart: number;
  rollDuration: number;
  startRotation: THREE.Euler;
  targetRotation: THREE.Euler;
  launchHeight: number;
  impactDepth: number;
  currentOrientation: DiceOrientation;
  idleTime: number;
}

/* ─── Component ─── */
function DiceCube3D({
  faces,
  orientation,
  rolling,
  disabled = false,
  label,
  onRoll,
  rollProfile,
}: DiceCube3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneState | null>(null);

  /* ─── Initialize Three.js scene ─── */
  const initScene = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Gracefully handle environments without WebGL (e.g., tests)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
    } catch {
      return;
    }

    // Scene
    const scene = new THREE.Scene();

    // Camera — slightly elevated for premium showcase angle
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 2.8, 5.8);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const size = Math.min(container.clientWidth, container.clientHeight, 320);
    renderer.setSize(size, size);
    container.appendChild(renderer.domElement);

    // Lighting — premium studio setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb4d7ff, 0.5);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff0dd, 0.4);
    rimLight.position.set(0, -1, 5);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0xe8e0ff, 0.2);
    bottomLight.position.set(0, -4, 0);
    scene.add(bottomLight);

    // Ground plane for shadow
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.4;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create cube with face textures
    const safeFaces = faces.slice(0, 6);
    while (safeFaces.length < 6) safeFaces.push('');

    // Rounded box for premium smooth edges (width, height, depth, segments, radius)
    const geometry = new RoundedBoxGeometry(2, 2, 2, 6, 0.25);

    // Three.js face order: +X, -X, +Y, -Y, +Z, -Z
    // Our face order: front(+Z=0), back(-Z=1), right(+X=2), left(-X=3), top(+Y=4), bottom(-Y=5)
    // Mapping: Three[0]=+X=right=our[2], Three[1]=-X=left=our[3],
    //          Three[2]=+Y=top=our[4], Three[3]=-Y=bottom=our[5],
    //          Three[4]=+Z=front=our[0], Three[5]=-Z=back=our[1]
    const faceMap = [2, 3, 4, 5, 0, 1];
    const materials = faceMap.map((ourIdx) =>
      new THREE.MeshPhysicalMaterial({
        map: createFaceTexture(safeFaces[ourIdx], FACE_COLORS[ourIdx]),
        roughness: 0.18,
        metalness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        reflectivity: 0.5,
      }),
    );

    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // Set initial rotation
    cube.rotation.set(
      degToRad(orientation.x),
      degToRad(orientation.y),
      degToRad(orientation.z),
    );

    const state: SceneState = {
      scene,
      camera,
      renderer,
      cube,
      animId: 0,
      rolling: false,
      rollStart: 0,
      rollDuration: 2500,
      startRotation: new THREE.Euler(),
      targetRotation: new THREE.Euler(
        degToRad(orientation.x),
        degToRad(orientation.y),
        degToRad(orientation.z),
      ),
      launchHeight: 1.2,
      impactDepth: 0.15,
      currentOrientation: { ...orientation },
      idleTime: 0,
    };

    sceneRef.current = state;

    // Animation loop
    let lastTime = performance.now();
    function animate() {
      state.animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (state.rolling) {
        const elapsed = now - state.rollStart;
        const progress = Math.min(elapsed / state.rollDuration, 1);

        // Roll rotation (elastic ease for satisfying overshoot)
        const rotProgress = easeOutElastic(Math.min(progress * 1.1, 1));
        cube.rotation.x = state.startRotation.x + (state.targetRotation.x - state.startRotation.x) * rotProgress;
        cube.rotation.y = state.startRotation.y + (state.targetRotation.y - state.startRotation.y) * rotProgress;
        cube.rotation.z = state.startRotation.z + (state.targetRotation.z - state.startRotation.z) * rotProgress;

        // Bounce trajectory
        let yOffset = 0;
        if (progress < 0.3) {
          const launchT = progress / 0.3;
          yOffset = Math.sin(launchT * Math.PI) * state.launchHeight;
        } else if (progress < 0.7) {
          const fallT = (progress - 0.3) / 0.4;
          yOffset = Math.sin(fallT * Math.PI) * state.launchHeight * 0.3;
        } else if (progress < 0.88) {
          const bounceT = (progress - 0.7) / 0.18;
          yOffset = Math.sin(bounceT * Math.PI) * state.launchHeight * 0.08;
        } else {
          const settleT = (progress - 0.88) / 0.12;
          yOffset = -state.impactDepth * Math.sin(settleT * Math.PI);
        }
        cube.position.y = yOffset;

        // Squash/stretch during impacts
        if (progress > 0.65 && progress < 0.75) {
          const squashT = (progress - 0.65) / 0.1;
          const squash = 1 + 0.12 * Math.sin(squashT * Math.PI);
          cube.scale.set(squash, 2 - squash, squash);
        } else if (progress > 0.85 && progress < 0.92) {
          const squashT = (progress - 0.85) / 0.07;
          const squash = 1 + 0.06 * Math.sin(squashT * Math.PI);
          cube.scale.set(squash, 2 - squash, squash);
        } else {
          cube.scale.set(1, 1, 1);
        }

        if (progress >= 1) {
          state.rolling = false;
          cube.position.y = 0;
          cube.scale.set(1, 1, 1);
          cube.rotation.set(state.targetRotation.x, state.targetRotation.y, state.targetRotation.z);
        }
      } else {
        // Idle floating animation — gentle bobble
        state.idleTime += dt;
        const t = state.idleTime;
        const floatY = Math.sin(t * 1.2) * 0.06;
        const wobbleX = Math.sin(t * 0.8) * 0.03;
        const wobbleZ = Math.cos(t * 0.6) * 0.02;

        cube.position.y = floatY;
        cube.rotation.x = degToRad(state.currentOrientation.x) + wobbleX;
        cube.rotation.y = degToRad(state.currentOrientation.y) + Math.sin(t * 0.4) * 0.04;
        cube.rotation.z = degToRad(state.currentOrientation.z) + wobbleZ;
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(state.animId);
      renderer.dispose();
      geometry.dispose();
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      groundGeo.dispose();
      groundMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Mount/unmount ─── */
  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
  }, [initScene]);

  /* ─── Handle orientation changes (non-rolling) ─── */
  useEffect(() => {
    const state = sceneRef.current;
    if (!state || state.rolling) return;

    state.currentOrientation = { ...orientation };
    state.targetRotation.set(
      degToRad(orientation.x),
      degToRad(orientation.y),
      degToRad(orientation.z),
    );
  }, [orientation]);

  /* ─── Handle roll start ─── */
  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;

    if (rolling && rollProfile) {
      state.startRotation.copy(state.cube.rotation);

      const endX = degToRad(rollProfile.end.x);
      const endY = degToRad(rollProfile.end.y);
      const endZ = degToRad(rollProfile.end.z);

      // Add full-rotation spins for dramatic tumble
      const spinsX = Math.PI * 2 * (3 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? 1 : -1);
      const spinsY = Math.PI * 2 * (3 + Math.floor(Math.random() * 4)) * (Math.random() > 0.5 ? 1 : -1);
      const spinsZ = Math.PI * 2 * (2 + Math.floor(Math.random() * 2)) * (Math.random() > 0.5 ? 1 : -1);

      state.targetRotation.set(endX + spinsX, endY + spinsY, endZ + spinsZ);
      state.rollDuration = rollProfile.durationMs;
      state.launchHeight = rollProfile.launchHeightPx / 80;
      state.impactDepth = rollProfile.impactDepthPx / 100;
      state.rollStart = performance.now();
      state.rolling = true;
      state.currentOrientation = { ...rollProfile.end };
    } else if (!rolling && state.rolling) {
      state.rolling = false;
      state.cube.position.y = 0;
      state.cube.scale.set(1, 1, 1);
      state.currentOrientation = { ...orientation };
      state.cube.rotation.set(
        degToRad(orientation.x),
        degToRad(orientation.y),
        degToRad(orientation.z),
      );
    }
  }, [rolling, rollProfile, orientation]);

  /* ─── Update face textures when text changes ─── */
  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;

    const safeFaces = faces.slice(0, 6);
    while (safeFaces.length < 6) safeFaces.push('');

    const faceMap = [2, 3, 4, 5, 0, 1];
    const materials = state.cube.material as THREE.MeshPhysicalMaterial[];
    faceMap.forEach((ourIdx, threeIdx) => {
      const mat = materials[threeIdx];
      mat.map?.dispose();
      mat.map = createFaceTexture(safeFaces[ourIdx], FACE_COLORS[ourIdx]);
      mat.needsUpdate = true;
    });
  }, [faces]);

  /* ─── Resize handler ─── */
  useEffect(() => {
    const container = containerRef.current;
    const state = sceneRef.current;
    if (!container || !state) return;

    const onResize = () => {
      const sz = Math.min(container.clientWidth, container.clientHeight, 320);
      state.renderer.setSize(sz, sz);
      state.camera.aspect = 1;
      state.camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  /* ─── Keyboard handler ─── */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRoll();
    }
  };

  return (
    <div
      className={`${styles.scene} ${disabled ? styles.disabled : ''}`}
      ref={containerRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => { if (!disabled) onRoll(); }}
      onKeyDown={handleKeyDown}
    />
  );
}

export { DiceCube3D };
