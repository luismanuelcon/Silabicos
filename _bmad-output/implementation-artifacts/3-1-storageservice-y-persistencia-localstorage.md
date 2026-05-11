# Story 3.1: StorageService y Persistencia LocalStorage

Status: done

## Story

As a **niño**,
I want **que mis palabras y mi avatar se recuerden cuando vuelva a jugar mañana**,
so that **no tenga que empezar de cero cada vez**.

## Acceptance Criteria

1. **Palabra completada** → storageService guarda en LocalStorage automáticamente (FR26)
2. **Últimas 20 palabras** persistidas, descarta más antigua si excede (FR27)
3. **Perfil del jugador** → persiste avatar, nombre y progreso acumulado (FR28)
4. **Serialización** con JSON.stringify
5. **LocalStorage no disponible** → funciona sin persistencia, sin error (NFR24, NFR22)
6. **console.warn** solo en desarrollo cuando LS no disponible
7. **Privacidad** → datos exclusivamente en LocalStorage del dispositivo (NFR8, FR32)

## Tasks / Subtasks

- [x] Task 1: Crear storageService (pure service, no React)
- [x] Task 2: Agregar LOAD_PROFILE y ADD_COMPLETED_WORD a PlayerContext
- [x] Task 3: Integrar auto-save en PlayerContext y GameContext
- [x] Task 4: Tests
- [x] Task 5: Verificar build y bundle size

## Dev Notes

### Architecture
- `src/services/storageService.ts` — pure functions, no React
- Keys: `silabc_player_profile`, `silabc_completed_words`
- PlayerState gets `LOAD_PROFILE` action to hydrate from storage
- PlayerState gets `ADD_COMPLETED_WORD` action to track words
- GameContext dispatches to PlayerContext on COMPLETE_WORD via integration in GameplayScreen
- Storage writes happen in effects, reads happen on mount

### Storage Schema
```json
// silabc_player_profile
{ "avatarId": "mono", "name": "Luis", "totalWordsCount": 5 }

// silabc_completed_words
["mama", "papa", "casa", "sapo", "pato"]
```

## Dev Agent Record
### Agent Model Used
### Completion Notes List
### File List
