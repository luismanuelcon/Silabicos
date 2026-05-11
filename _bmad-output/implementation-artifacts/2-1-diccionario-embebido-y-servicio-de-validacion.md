# Story 2.1: Diccionario Embebido y Servicio de Validación

Status: done

## Story

As a **niño**,
I want **que el juego conozca palabras reales en español y sepa cuándo formo una correcta**,
so that **pueda descubrir palabras válidas y recibir celebración inmediata**.

## Acceptance Criteria

1. **Diccionario JSON embebido** en `src/data/dictionary.json` con ≥50 palabras curadas para niños 4-6 años (FR30, NFR10)
2. **Cada sílaba disponible tiene ≥3 palabras formables** (FR22)
3. **dictionaryService** con funciones puras: `isValidWord()`, `getWordsForSyllable()`, `getClosestMatch()`, `getRandomSyllable()` (NFR25)
4. **`isValidWord(word)` retorna boolean** en <50ms — O(1) con Set lookup (NFR6)
5. **`getWordsForSyllable(syllable)` retorna DictionaryEntry[]** — todas las palabras que contienen esa sílaba
6. **`getClosestMatch(partial, syllable)` retorna DictionaryEntry | null** — la palabra más cercana que contiene la sílaba obligatoria (FR20)
7. **`getRandomSyllable(world)` retorna string** — sílaba directa CV del mundo especificado (FR11)
8. **Types definidos** en `src/types/dictionary.ts`: `DictionaryEntry`, `SyllableData`, `DictionaryService` interface
9. **DictionaryContext** expone diccionario parseado via `useDictionary()` hook — cargado una vez al inicio
10. **Diccionario NO contiene palabras inapropiadas** para menores (FR30, NFR10)
11. **Tests unitarios** cubren: isValidWord, getWordsForSyllable, getClosestMatch, getRandomSyllable, diccionario tiene ≥50 palabras, cada sílaba ≥3 palabras

## Tasks / Subtasks

- [x] Task 1: Crear types de diccionario (AC: #8)
  - [ ] Crear `src/types/dictionary.ts`
  - [ ] Definir `DictionaryEntry`: `{ word: string; syllables: string[]; difficulty: 'easy' | 'medium' | 'hard'; imageHint?: string }`
  - [ ] Definir `SyllableData`: `{ syllable: string; words: DictionaryEntry[]; world: 'selva' | 'granja' | 'oceano' }`
  - [ ] Definir `WorldId = 'selva' | 'granja' | 'oceano'`

- [x] Task 2: Crear diccionario JSON (AC: #1, #2, #10)
  - [ ] Crear `src/data/dictionary.json`
  - [ ] Estructura: array de `SyllableData` agrupados por sílaba
  - [ ] Incluir sílabas CV para mundo Selva: MA, PA, SA, LA, CA, TA, NA, RA, LO, TO, NO, SO, CO, RO (mínimo 10 sílabas)
  - [ ] Cada sílaba con ≥3 palabras formables, curadas para niños 4-6
  - [ ] Total ≥50 palabras únicas
  - [ ] Verificar: CERO palabras inapropiadas
  - [ ] Incluir campo `difficulty` (easy/medium/hard)

- [x] Task 3: Crear dictionaryService (AC: #3, #4, #5, #6, #7)
  - [ ] Crear `src/services/dictionaryService.ts`
  - [ ] Función `createDictionaryService(data: SyllableData[])` que retorna objeto con los 4 métodos
  - [ ] Parsear data a `Map<string, DictionaryEntry[]>` (sílaba → palabras) y `Set<string>` (todas las palabras)
  - [ ] `isValidWord(word: string): boolean` — Set.has(word.toLowerCase()), O(1)
  - [ ] `getWordsForSyllable(syllable: string): DictionaryEntry[]` — Map.get(syllable) ?? []
  - [ ] `getClosestMatch(partial: string, syllable: string): DictionaryEntry | null` — filtrar palabras que contienen `syllable`, buscar la que `partial` es prefijo/substring más cercano
  - [ ] `getRandomSyllable(world: WorldId): string` — filtrar SyllableData por world, elegir sílaba aleatoria
  - [ ] Named export: `export { createDictionaryService }`

- [x] Task 4: Crear DictionaryContext (AC: #9)
  - [ ] Crear `src/contexts/DictionaryContext.tsx`
  - [ ] Importar dictionary.json y parsear con `createDictionaryService`
  - [ ] Exponer via `useDictionary()` hook — retorna el service object
  - [ ] Nunca `useContext()` directo — siempre el hook wrapper
  - [ ] Named export: `export { DictionaryProvider, useDictionary }`

- [x] Task 5: Integrar DictionaryProvider en App.tsx (AC: #9)
  - [ ] Agregar `<DictionaryProvider>` en App.tsx (puede ir fuera de PlayerProvider o al mismo nivel)
  - [ ] Verificar que la app sigue funcionando correctamente

- [x] Task 6: Tests unitarios (AC: #11)
  - [ ] Crear `src/services/dictionaryService.test.ts`
  - [ ] Test: isValidWord retorna true para palabra existente
  - [ ] Test: isValidWord retorna false para palabra inexistente
  - [ ] Test: isValidWord es case-insensitive
  - [ ] Test: getWordsForSyllable retorna array no vacío para sílaba existente
  - [ ] Test: getWordsForSyllable retorna array vacío para sílaba inexistente
  - [ ] Test: getClosestMatch retorna match cuando partial es prefijo de palabra válida
  - [ ] Test: getClosestMatch retorna null cuando no hay match
  - [ ] Test: getRandomSyllable retorna sílaba CV para mundo 'selva'
  - [ ] Test: diccionario contiene ≥50 palabras
  - [ ] Test: cada sílaba tiene ≥3 palabras
  - [ ] Crear `src/contexts/DictionaryContext.test.tsx`
  - [ ] Test: useDictionary() fuera de provider lanza error
  - [ ] Test: useDictionary() retorna service con los 4 métodos

## Dev Notes

### Architecture Compliance — OBLIGATORIO

- **Services:** Lógica de negocio pura, sin React — `dictionaryService.ts` en `src/services/`
- **Context pattern:** `useDictionary()` hook, nunca `useContext()` directo
- **Types:** En `src/types/dictionary.ts`
- **Data:** JSON en `src/data/dictionary.json` — embebido en bundle, no fetched
- **No `any`**, no `export default`, tests co-locados
- **Componente interno (orden):** Imports → Types → Component → Hooks → Derived → Handlers → Render

### Data Structure — EXACTO

**De [architecture.md]:**
```typescript
// Runtime: Map + Set para O(1) lookup
Map<string, DictionaryEntry[]>  // sílaba → palabras
Set<string>                      // todas las palabras (lowercase) para validación rápida
```

**dictionary.json format:**
```json
[
  {
    "syllable": "ma",
    "world": "selva",
    "words": [
      { "word": "mama", "difficulty": "easy" },
      { "word": "mapa", "difficulty": "easy" },
      { "word": "masa", "difficulty": "easy" },
      { "word": "mano", "difficulty": "medium" }
    ]
  }
]
```

### Sílabas CV para Mundo Selva

Sílabas directas (consonante + vocal) apropiadas para niños 4-6 años. Incluir al menos estas:
- **MA** → mamá, mapa, masa, mano, malo, mago, mazo...
- **PA** → papá, pala, pato, pasa, pago...
- **SA** → sapo, sala, sano, saco...
- **LA** → lago, lana, lata, lava...
- **CA** → casa, cama, cana, capa...
- **TA** → tapa, taza, taco...
- **NA** → nada, nata, nave...
- **LO** → loco, lobo, lomo...
- **TO** → topo, toro, toma...
- **SO** → sopa, solo, soma...

### Performance Requirements

- `isValidWord()` < 50ms (NFR6) — garantizado con Set.has() O(1)
- Diccionario < 50KB para mantenerse dentro del budget de 500KB total
- Parseo al inicio (no lazy load) — NFR25: diccionario siempre disponible

### Naming Patterns — OBLIGATORIO

- Service: `dictionaryService.ts` (camelCase)
- Types: `dictionary.ts` (PascalCase types dentro)
- Context: `DictionaryContext.tsx`, hook `useDictionary()`
- Data: `dictionary.json`
- Tests: co-locados `dictionaryService.test.ts`, `DictionaryContext.test.tsx`

### Previous Story Intelligence (Stories 1.1-1.4)

**Learnings:**
- Framer Motion ease type: usar `[0.42, 0, 0.58, 1] as const` en vez de string
- ScreenManager tests necesitan todos los providers (PlayerProvider + NavigationProvider)
- App.tsx providers: `<PlayerProvider>` → `<NavigationProvider>` → children
- Unused imports causan tsc error (no-unused-locals)
- 42 tests passing actualmente
- Build: 337KB JS (107KB gzip)

**Archivos NUEVOS:**
- `src/types/dictionary.ts`
- `src/data/dictionary.json`
- `src/services/dictionaryService.ts`
- `src/services/dictionaryService.test.ts`
- `src/contexts/DictionaryContext.tsx`
- `src/contexts/DictionaryContext.test.tsx`

**Archivos MODIFICADOS:**
- `src/App.tsx` — agregar DictionaryProvider

### Security — CRÍTICO

- Diccionario embebido en bundle — NO fetch de red
- Revisión manual: CERO palabras inapropiadas para menores
- No hay endpoints, no hay API calls

### Forward Context (Stories 2.2-2.6)

- **Story 2.2:** GameContext usará `getRandomSyllable('selva')` al iniciar ronda
- **Story 2.3:** DiceRoller llamará `getRandomSyllable()` al lanzar
- **Story 2.5:** WordBuilder usará `getWordsForSyllable()` para validación
- **Story 2.6:** `isValidWord()` para celebración, `getClosestMatch()` para sugerencias

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#DictionaryService interface]
- [Source: _bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure]
- [Source: _bmad-output/planning-artifacts/prd.md#FR11, FR20, FR22, FR30, NFR6, NFR10, NFR25]

## Dev Agent Record

### Agent Model Used



### Debug Log References



### Completion Notes List



### File List

