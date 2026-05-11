import { useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';
import { usePlayer } from '../../contexts/PlayerContext';
import { AvatarCard } from '../../components/AvatarCard/AvatarCard';
import type { AvatarId } from '../../types/player';
import styles from './AvatarSelectScreen.module.css';

const AVATARS: AvatarId[] = ['mono', 'loro', 'rana'];
const CELEBRATION_DURATION = 1500;

function AvatarSelectScreen() {
  const { dispatch: navDispatch } = useNavigation();
  const { state: playerState, dispatch: playerDispatch } = usePlayer();
  const shouldReduceMotion = useReducedMotion();

  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId | null>(
    playerState.avatarId,
  );
  const [celebrating, setCelebrating] = useState(false);

  const handleAvatarSelect = useCallback(
    (avatarId: AvatarId) => {
      if (celebrating) return;

      setSelectedAvatar(avatarId);
      setCelebrating(true);

      playerDispatch({ type: 'SET_AVATAR', payload: avatarId });

      const delay = shouldReduceMotion ? 0 : CELEBRATION_DURATION;

      setTimeout(() => {
        navDispatch({ type: 'NAVIGATE_TO', payload: 'name-input' });
      }, delay);
    },
    [celebrating, playerDispatch, navDispatch, shouldReduceMotion],
  );

  useEffect(() => {
    return () => setCelebrating(false);
  }, []);

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>¡Elige tu compañero!</h1>
      <div className={styles.avatarGrid} role="group" aria-label="Avatares disponibles">
        {AVATARS.map((avatarId) => (
          <AvatarCard
            key={avatarId}
            avatarId={avatarId}
            selected={selectedAvatar === avatarId}
            onSelect={handleAvatarSelect}
            celebrating={celebrating}
          />
        ))}
      </div>
    </div>
  );
}

export { AvatarSelectScreen };
