import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './LetterTile.module.css';

interface LetterTileProps {
  letter: string;
  onDragStart?: (letter: string) => void;
  onDragEnd?: (letter: string, x: number, y: number) => void;
}

const RETURN_SPRING = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

function LetterTile({ letter, onDragStart, onDragEnd }: LetterTileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const tileRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const randomRotate = useRef(0);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = tileRef.current;
      if (!el) return;

      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      startPos.current = {
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      };
      randomRotate.current = (Math.random() - 0.5) * 4;
      setIsDragging(true);
      setOffset({ x: 0, y: 0 });
      onDragStart?.(letter);
    },
    [letter, onDragStart],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !tileRef.current) return;
      const rect = tileRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const el = tileRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - el.left - el.width / 2 - startPos.current.x,
        y: e.clientY - el.top - el.height / 2 - startPos.current.y,
      });
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      onDragEnd?.(letter, e.clientX, e.clientY);
      setOffset({ x: 0, y: 0 });
    },
    [isDragging, letter, onDragEnd],
  );

  const tileClass = [styles.tile, isDragging ? styles.dragging : '']
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      ref={tileRef}
      className={tileClass}
      role="button"
      tabIndex={0}
      aria-label={`Letra ${letter}`}
      aria-grabbed={isDragging}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      animate={
        isDragging
          ? {
              x: offset.x,
              y: offset.y,
              scale: 1.15,
              rotate: randomRotate.current,
            }
          : { x: 0, y: 0, scale: 1, rotate: 0 }
      }
      transition={
        isDragging
          ? { duration: 0 }
          : RETURN_SPRING
      }
      style={isDragging ? { zIndex: 100 } : undefined}
    >
      {letter}
    </motion.div>
  );
}

export { LetterTile };
export type { LetterTileProps };
