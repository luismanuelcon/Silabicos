import type { CSSProperties, KeyboardEvent } from 'react';
import styles from './DiceCube3D.module.css';
import type { DiceOrientation, DiceRollProfile } from './dicePhysics';

interface DiceCube3DProps {
  faces: string[];
  orientation: DiceOrientation;
  rolling: boolean;
  disabled?: boolean;
  label: string;
  onRoll: () => void;
  rollProfile?: DiceRollProfile | null;
}

type DiceStyleVars = CSSProperties & Record<string, string | number>;

const DEFAULT_PROFILE: DiceRollProfile = {
  durationMs: 920,
  axisX: 0.62,
  axisY: 0.71,
  axisZ: 0.34,
  launchHeightPx: 60,
  impactDepthPx: 10,
  maxBlurPx: 1.8,
  prep: { x: 0, y: 0, z: 0 },
  launch: { x: 720, y: 840, z: 420 },
  fall: { x: 1040, y: 1160, z: 610 },
  impact: { x: 4, y: -6, z: 3 },
  end: { x: 0, y: 0, z: 0 },
  shadowLiftScale: 0.62,
  shadowLiftOpacity: 0.22,
  shadowImpactScale: 1.22,
  shadowImpactOpacity: 0.4,
};

function buildMotionVars(
  orientation: DiceOrientation,
  rolling: boolean,
  profile?: DiceRollProfile | null,
): DiceStyleVars {
  const activeProfile = rolling ? profile ?? DEFAULT_PROFILE : DEFAULT_PROFILE;

  return {
    '--rest-rx': orientation.x,
    '--rest-ry': orientation.y,
    '--rest-rz': orientation.z,
    '--roll-duration': `${activeProfile.durationMs}ms`,
    '--axis-x': activeProfile.axisX,
    '--axis-y': activeProfile.axisY,
    '--axis-z': activeProfile.axisZ,
    '--launch-height': `${activeProfile.launchHeightPx}px`,
    '--impact-depth': `${activeProfile.impactDepthPx}px`,
    '--max-blur': `${activeProfile.maxBlurPx}px`,
    '--prep-rx': activeProfile.prep.x,
    '--prep-ry': activeProfile.prep.y,
    '--prep-rz': activeProfile.prep.z,
    '--launch-rx': activeProfile.launch.x,
    '--launch-ry': activeProfile.launch.y,
    '--launch-rz': activeProfile.launch.z,
    '--fall-rx': activeProfile.fall.x,
    '--fall-ry': activeProfile.fall.y,
    '--fall-rz': activeProfile.fall.z,
    '--impact-rx': activeProfile.impact.x,
    '--impact-ry': activeProfile.impact.y,
    '--impact-rz': activeProfile.impact.z,
    '--end-rx': activeProfile.end.x,
    '--end-ry': activeProfile.end.y,
    '--end-rz': activeProfile.end.z,
    '--shadow-lift-scale': activeProfile.shadowLiftScale,
    '--shadow-lift-opacity': activeProfile.shadowLiftOpacity,
    '--shadow-impact-scale': activeProfile.shadowImpactScale,
    '--shadow-impact-opacity': activeProfile.shadowImpactOpacity,
  };
}

function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, onRoll: () => void, disabled: boolean) {
  if (disabled) {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onRoll();
  }
}

function DiceCube3D({
  faces,
  orientation,
  rolling,
  disabled = false,
  label,
  onRoll,
  rollProfile,
}: DiceCube3DProps) {
  const safeFaces = faces.slice(0, 6);
  while (safeFaces.length < 6) {
    safeFaces.push('');
  }

  const styleVars = buildMotionVars(orientation, rolling, rollProfile);

  return (
    <div className={styles.scene}>
      <div className={styles.groundGlow} aria-hidden="true" />
      <div className={styles.rig} style={styleVars}>
        <div
          className={[
            styles.dice,
            rolling ? styles.rolling : styles.idle,
            disabled ? styles.disabled : '',
          ].filter(Boolean).join(' ')}
          style={styleVars}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-disabled={disabled}
          onClick={() => {
            if (!disabled) {
              onRoll();
            }
          }}
          onKeyDown={(event) => handleKeyDown(event, onRoll, disabled)}
        >
          <div className={styles.faceLight} aria-hidden="true" />
          <div className={`${styles.face} ${styles.faceFront}`}>{safeFaces[0]}</div>
          <div className={`${styles.face} ${styles.faceBack}`}>{safeFaces[1]}</div>
          <div className={`${styles.face} ${styles.faceRight}`}>{safeFaces[2]}</div>
          <div className={`${styles.face} ${styles.faceLeft}`}>{safeFaces[3]}</div>
          <div className={`${styles.face} ${styles.faceTop}`}>{safeFaces[4]}</div>
          <div className={`${styles.face} ${styles.faceBottom}`}>{safeFaces[5]}</div>
        </div>
      </div>
      <div
        className={`${styles.shadow} ${rolling ? styles.shadowRolling : ''}`}
        style={styleVars}
        aria-hidden="true"
      />
    </div>
  );
}

export { DiceCube3D };
