export interface DiceOrientation {
  x: number;
  y: number;
  z: number;
}

export interface DiceRollProfile {
  durationMs: number;
  axisX: number;
  axisY: number;
  axisZ: number;
  launchHeightPx: number;
  impactDepthPx: number;
  maxBlurPx: number;
  prep: DiceOrientation;
  launch: DiceOrientation;
  fall: DiceOrientation;
  impact: DiceOrientation;
  end: DiceOrientation;
  shadowLiftScale: number;
  shadowLiftOpacity: number;
  shadowImpactScale: number;
  shadowImpactOpacity: number;
}

/**
 * Base orientations that rotate the cube so face N ends up on TOP.
 * Like a real dice on a table — the upper face is the result.
 *
 * Face normals in cube local space:
 *   face0 (front): +Z  → needs Rx(90°) to point -Y (up)
 *   face1 (back):  -Z  → needs Rx(-90°)
 *   face2 (right): +X  → needs Rz(-90°)
 *   face3 (left):  -X  → needs Rz(90°)
 *   face4 (top):   -Y  → already up (identity)
 *   face5 (bottom):+Y  → needs Rx(180°)
 */
const FACE_BASE: DiceOrientation[] = [
  { x: 90, y: 0, z: 0 }, // face0 (front) → top
  { x: -90, y: 0, z: 0 }, // face1 (back) → top
  { x: 0, y: 0, z: -90 }, // face2 (right) → top
  { x: 0, y: 0, z: 90 }, // face3 (left) → top
  { x: 0, y: 0, z: 0 }, // face4 (top) → already top
  { x: 180, y: 0, z: 0 }, // face5 (bottom) → top
];

/**
 * Asymmetric "cartoon rest tilt" — keeps the top face clearly visible
 * from the camera above, but adds imperfection for 3D perception.
 * Values are moderate (8-14°) since the steep camera already guarantees depth.
 */
const REST_TILT: DiceOrientation[] = [
  { x: 8, y: -12, z: -3 },
  { x: -6, y: 10, z: 4 },
  { x: 7, y: -14, z: -2 },
  { x: -8, y: 11, z: 3 },
  { x: 10, y: -10, z: -4 },
  { x: -7, y: 13, z: 2 },
];

const FACE_ORIENTATIONS: DiceOrientation[] = FACE_BASE.map((base, i) => ({
  x: base.x + REST_TILT[i].x,
  y: base.y + REST_TILT[i].y,
  z: base.z + REST_TILT[i].z,
}));

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomSign(): number {
  return Math.random() > 0.5 ? 1 : -1;
}

function jitter(angle: number): number {
  return angle + randomBetween(-8, 8);
}

function cloneOrientation(orientation: DiceOrientation): DiceOrientation {
  return {
    x: orientation.x,
    y: orientation.y,
    z: orientation.z,
  };
}

function normalizeAxis(x: number, y: number, z: number): [number, number, number] {
  const magnitude = Math.hypot(x, y, z) || 1;
  return [x / magnitude, y / magnitude, z / magnitude];
}

function clampDuration(durationMs: number): number {
  return Math.round(Math.max(2000, Math.min(3200, durationMs)));
}

function createSpinAmount(baseTurns: number, extraTurns: number): number {
  const turns = baseTurns + Math.floor(randomBetween(0, extraTurns + 1));
  return turns * 360 * randomSign();
}

function createDuration(baseDurationMs: number): number {
  const jitterRatio = randomBetween(0.9, 1.08);
  return clampDuration(baseDurationMs * jitterRatio);
}

export function getFaceOrientation(faceIndex: number): DiceOrientation {
  const normalizedIndex = Math.max(0, Math.min(FACE_ORIENTATIONS.length - 1, faceIndex));
  return cloneOrientation(FACE_ORIENTATIONS[normalizedIndex]);
}

export function createDiceRollProfile(
  start: DiceOrientation,
  target: DiceOrientation,
  baseDurationMs: number,
): DiceRollProfile {
  const durationMs = createDuration(baseDurationMs);

  const [axisX, axisY, axisZ] = normalizeAxis(
    randomBetween(0.2, 1.1),
    randomBetween(0.3, 1.2),
    randomBetween(0.1, 0.9),
  );

  const spinX = createSpinAmount(3, 3);
  const spinY = createSpinAmount(3, 4);
  const spinZ = createSpinAmount(2, 2) * 0.65;

  const prep = {
    x: jitter(start.x + randomBetween(-4, 4)),
    y: jitter(start.y + randomBetween(-4, 4)),
    z: jitter(start.z + randomBetween(-2, 2)),
  };

  const launch = {
    x: jitter(start.x + spinX * 0.65),
    y: jitter(start.y + spinY * 0.65),
    z: jitter(start.z + spinZ * 0.65),
  };

  const fall = {
    x: jitter(start.x + spinX * 0.9),
    y: jitter(start.y + spinY * 0.9),
    z: jitter(start.z + spinZ * 0.9),
  };

  const impact = {
    x: jitter(target.x + randomBetween(-14, 14)),
    y: jitter(target.y + randomBetween(-14, 14)),
    z: jitter(target.z + randomBetween(-10, 10)),
  };

  // Randomized micro-offsets so the cube never lands identically twice.
  // Keeps the winning face dominant but adds organic imperfection.
  const end = {
    x: target.x + randomBetween(-4, 4),
    y: target.y + randomBetween(-4, 4),
    z: target.z + randomBetween(-2.5, 2.5),
  };

  return {
    durationMs,
    axisX,
    axisY,
    axisZ,
    launchHeightPx: randomBetween(80, 140),
    impactDepthPx: randomBetween(12, 24),
    maxBlurPx: randomBetween(1.8, 3.2),
    prep,
    launch,
    fall,
    impact,
    end,
    shadowLiftScale: randomBetween(0.48, 0.64),
    shadowLiftOpacity: randomBetween(0.14, 0.22),
    shadowImpactScale: randomBetween(1.2, 1.42),
    shadowImpactOpacity: randomBetween(0.38, 0.52),
  };
}
