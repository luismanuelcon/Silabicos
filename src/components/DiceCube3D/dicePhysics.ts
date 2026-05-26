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

const FACE_ORIENTATIONS: DiceOrientation[] = [
  { x: 0, y: 0, z: 0 },
  { x: 0, y: -180, z: 0 },
  { x: 0, y: -90, z: 0 },
  { x: 0, y: 90, z: 0 },
  { x: -90, y: 0, z: 0 },
  { x: 90, y: 0, z: 0 },
];

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

  const end = {
    x: target.x,
    y: target.y,
    z: target.z,
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
