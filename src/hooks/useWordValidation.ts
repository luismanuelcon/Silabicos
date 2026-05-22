import { useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { useDictionary } from '../contexts/DictionaryContext';
import type { DictionaryEntry } from '../types/dictionary';

interface WordValidationResult {
  currentWord: string;
  isValid: boolean;
  closestMatch: DictionaryEntry | null;
}

function useWordValidation(): WordValidationResult {
  const { state: gameState } = useGame();
  const dictionary = useDictionary();

  const { currentSyllable, placedLetters, syllablePosition } = gameState;

  return useMemo(() => {
    if (!currentSyllable || placedLetters.length === 0) {
      return { currentWord: currentSyllable ?? '', isValid: false, closestMatch: null };
    }

    const before = placedLetters
      .filter((l) => l.position < 0)
      .sort((a, b) => a.position - b.position)
      .map((l) => l.letter)
      .join('');
    const after = placedLetters
      .filter((l) => l.position >= 0)
      .sort((a, b) => a.position - b.position)
      .map((l) => l.letter)
      .join('');

    const currentWord = `${before}${currentSyllable}${after}`.toLowerCase();

    const isValid = currentWord.length >= 3 && dictionary.isValidWord(currentWord);

    const closestMatch =
      !isValid && currentWord.length >= 3
        ? dictionary.getClosestMatch(currentWord, currentSyllable, syllablePosition)
        : null;

    return { currentWord, isValid, closestMatch };
  }, [currentSyllable, placedLetters, syllablePosition, dictionary]);
}

export { useWordValidation };
