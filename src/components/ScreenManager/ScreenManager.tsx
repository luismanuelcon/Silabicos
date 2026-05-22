import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';
import type { Screen } from '../../types/navigation';
import { AvatarSelectScreen } from '../../screens/AvatarSelectScreen/AvatarSelectScreen';
import { NameInputScreen } from '../../screens/NameInputScreen/NameInputScreen';
import { WorldSelectScreen } from '../../screens/WorldSelectScreen/WorldSelectScreen';
import { GameplayScreen } from '../../screens/GameplayScreen/GameplayScreen';
import { SummaryScreen } from '../../screens/SummaryScreen/SummaryScreen';
import { WelcomeScreen } from '../../screens/WelcomeScreen/WelcomeScreen';
import styles from './ScreenManager.module.css';

const SCREEN_COMPONENTS: Record<Screen, React.ComponentType> = {
  'avatar-select': AvatarSelectScreen,
  'name-input': NameInputScreen,
  'world-select': WorldSelectScreen,
  gameplay: GameplayScreen,
  summary: SummaryScreen,
  welcome: WelcomeScreen,
};

const EASING_SMOOTH = [0.4, 0, 0.2, 1] as const;

function ScreenManager() {
  const { state } = useNavigation();
  const shouldReduceMotion = useReducedMotion();

  const { currentScreen, direction } = state;
  const ScreenComponent = SCREEN_COMPONENTS[currentScreen];

  const slideOffset = direction === 'forward' ? 40 : -40;
  const duration = shouldReduceMotion ? 0 : 0.4;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        className={styles.screenWrapper}
        initial={{ opacity: 0, x: slideOffset, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -slideOffset, scale: 0.96 }}
        transition={{ duration, ease: [...EASING_SMOOTH] }}
      >
        <ScreenComponent />
      </motion.div>
    </AnimatePresence>
  );
}

export { ScreenManager };
