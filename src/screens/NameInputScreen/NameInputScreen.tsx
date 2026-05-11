import { useState, useCallback } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { usePlayer } from '../../contexts/PlayerContext';
import type { AvatarId } from '../../types/player';
import avatarMono from '../../assets/avatars/avatar-mono.svg';
import avatarLoro from '../../assets/avatars/avatar-loro.svg';
import avatarRana from '../../assets/avatars/avatar-rana.svg';
import styles from './NameInputScreen.module.css';

const AVATAR_IMAGES: Record<AvatarId, string> = {
  mono: avatarMono,
  loro: avatarLoro,
  rana: avatarRana,
};

const MAX_NAME_LENGTH = 12;

function NameInputScreen() {
  const { dispatch: navDispatch } = useNavigation();
  const { state: playerState, dispatch: playerDispatch } = usePlayer();
  const [name, setName] = useState('');

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      playerDispatch({ type: 'SET_NAME', payload: trimmed });
    }
    navDispatch({ type: 'NAVIGATE_TO', payload: 'world-select' });
  }, [name, playerDispatch, navDispatch]);

  const handleSkip = useCallback(() => {
    navDispatch({ type: 'NAVIGATE_TO', payload: 'world-select' });
  }, [navDispatch]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (name.trim().length > 0) {
          handleConfirm();
        } else {
          handleSkip();
        }
      }
    },
    [name, handleConfirm, handleSkip],
  );

  const avatarSrc =
    playerState.avatarId ? AVATAR_IMAGES[playerState.avatarId] : null;

  return (
    <div className={styles.screen}>
      {avatarSrc && (
        <img
          src={avatarSrc}
          alt={playerState.avatarId ?? ''}
          className={styles.avatarPreview}
          aria-hidden="true"
        />
      )}
      <h1 className={styles.title}>¿Cómo te llamas?</h1>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.inputField}
          value={name}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Tu nombre..."
          aria-label="Escribe tu nombre"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <div className={styles.actions}>
          {name.trim().length > 0 && (
            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleConfirm}
              aria-label="Confirmar nombre"
            >
              ✓ Listo
            </button>
          )}
          <button
            type="button"
            className={styles.skipButton}
            onClick={handleSkip}
            aria-label="Saltar sin nombre"
          >
            Saltar →
          </button>
        </div>
      </div>
    </div>
  );
}

export { NameInputScreen };
