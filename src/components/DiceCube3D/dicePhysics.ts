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
 * Base orientations to bring each face forward.
 * These are the "mathematical" orientations before cartoon rest tilt is applied.
 */
const FACE_BASE: DiceOrientation[] = [
  { x: 0, y: 0, z: 0 }, // front
  { x: 0, y: -180, z: 0 }, // back
  { x: 0, y: -90, z: 0 }, // right
  { x: 0, y: 90, z: 0 }, // left
  { x: -90, y: 0, z: 0 }, // top
  { x: 90, y: 0, z: 0 }, // bottom
];

/**
 * Asymmetric "cartoon rest tilt" per face — ensures the cube never looks
 * perfectly perpendicular to the camera. The winning face stays dominant
 * and legible but adjacent faces are always visible for volume perception.
 * Values are intentionally large (14-20°) to guarantee 3D perception at rest.
 */
const REST_TILT: DiceOrientation[] = [
  { x: 14, y: -18, z: -4 }, // front: tilt back + turn left → shows top + right
  { x: -12, y: 16, z: 5 }, // back: shows top + left
  { x: 15, y: -14, z: -3 }, // right: shows top + front
  { x: -13, y: 17, z: 4 }, // left: shows top + front
  { x: 12, y: -16, z: -5 }, // top: shows front + right
  { x: -14, y: 18, z: 3 }, // bottom: shows front + right
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
  return Math.round(Math.max(760, Math.min(1280, durationMs)));
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

  const spinX = createSpinAmount(2, 2);
  const spinY = createSpinAmount(2, 3);
  const spinZ = createSpinAmount(1, 2) * 0.65;

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
    launchHeightPx: randomBetween(62, 110),
    impactDepthPx: randomBetween(10, 20),
    maxBlurPx: randomBetween(1.4, 2.8),
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
