export type AvatarId = 'mono' | 'loro' | 'rana';

export interface PlayerState {
  avatarId: AvatarId | null;
  name: string;
  wordsCompleted: string[];
  totalWordsCount: number;
}

export type PlayerAction =
  | { type: 'SET_AVATAR'; payload: AvatarId }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'ADD_COMPLETED_WORD'; payload: string }
  | { type: 'LOAD_PROFILE'; payload: { avatarId: AvatarId; name: string; wordsCompleted: string[]; totalWordsCount: number } }
  | { type: 'RESET_PLAYER' };
