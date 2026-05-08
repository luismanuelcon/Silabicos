---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation-skipped
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments: []
releaseMode: phased
workflowType: 'prd'
projectName: 'SILABC'
classification:
  projectType: web_app
  domain: edtech
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document — SILABC

**Autor:** LuisAgent
**Fecha:** 8 de mayo de 2026
**Versión:** 0.1 — MVP

---

## Executive Summary

SILABC es un juego web educativo gratuito para niños hispanohablantes de 4 a 6 años que enseña construcción de palabras mediante dados silábicos animados. El niño lanza un dado que genera una sílaba, y debe formar una palabra real en español que la contenga, completándola con letras del alfabeto. El juego progresa por mundos temáticos (Selva, Granja, Océano) con dificultad silábica creciente, en un entorno visual pastel con refuerzo emocional positivo constante a través de avatares animales.

El producto opera sin login, sin backend y sin recolección de datos. Toda la persistencia es local (LocalStorage), almacenando las últimas 20 palabras y el progreso. La arquitectura es frontend-first, optimizada para bajo costo de infraestructura en Azure y acceso instantáneo desde cualquier navegador en orientación horizontal.

### Qué Hace Especial a SILABC

- **Respeta la lingüística del español.** La mayoría de herramientas de lectoescritura digital replican modelos fonéticos del inglés (letra por letra). El español se aprende por sílabas. SILABC convierte la sílaba en el objeto de juego central — el dado silábico — alineándose con cómo realmente se enseña a leer en español.
- **La sílaba obligatoria como ancla cognitiva.** El niño no arrastra letras al azar: debe formar una palabra que contenga la sílaba del dado. Esto fuerza pensamiento silábico activo ("¿qué palabra tiene MA?") en lugar de copia mecánica.
- **Refuerzo positivo incondicional.** No hay error, no hay vidas, no hay game over. Solo descubrimiento y celebración. Los avatares animales nunca muestran emociones negativas.
- **Zero friction total.** Sin cuenta, sin suscripción, sin configuración parental. El niño toca y juega desde el navegador.

## Project Classification

| Atributo | Valor |
|---|---|
| **Tipo de proyecto** | Web App (SPA responsiva) |
| **Dominio** | EdTech — Lectoescritura infantil en español |
| **Complejidad** | Media — Requiere diseño adaptado a capacidades cognitivas y motoras infantiles, privacidad de menores, accesibilidad |
| **Contexto** | Greenfield — Producto nuevo desde cero |

## Visión del Producto

SILABC es un juego web educativo diseñado para niños de 4 a 6 años que transforma el aprendizaje de la lectoescritura en español en una experiencia lúdica, positiva y autónoma. A través de dados silábicos animados, los niños construyen palabras reales arrastrando sílabas y letras, progresando por mundos temáticos de naturaleza mientras reciben refuerzo emocional positivo de avatares animales.

**Declaración de visión:**
> Que cada niño hispanohablante de 4 a 6 años pueda descubrir el placer de formar palabras por sí mismo, en un entorno seguro, colorido y sin fricción, desde cualquier dispositivo.

**Principios rectores:**

- **El niño primero:** Toda decisión de diseño parte de las capacidades cognitivas y motoras de un niño de 4-6 años.
- **Jugar es aprender:** El juego no interrumpe el aprendizaje; el juego *es* el aprendizaje.
- **Cero fricción:** Sin login, sin configuración compleja, sin esperas. El niño toca y juega.
- **Refuerzo positivo siempre:** No hay castigos, no hay "game over". Solo celebración y progreso.

## Declaración del Problema

Los niños hispanohablantes de 4 a 6 años en etapa preescolar necesitan herramientas digitales accesibles para practicar la construcción de palabras a partir de sílabas — la unidad fundamental de la lectoescritura en español. Las soluciones existentes presentan uno o más de estos problemas:

- **Complejidad excesiva:** Requieren cuentas, suscripciones o configuración parental extensa.
- **Diseño no adaptado:** Interfaces pensadas para adultos con botones pequeños, texto denso y navegación compleja.
- **Retroalimentación punitiva:** Sistemas de vidas, penalizaciones o pantallas de "perdiste" que generan frustración y abandono.
- **Desconexión pedagógica:** Actividades mecánicas (arrastrar letra por letra) que no reflejan cómo se construyen las palabras en español: por sílabas.
- **Costo de acceso:** Apps de pago o freemium con contenido bloqueado.

**Impacto esperado:** Una herramienta gratuita, accesible desde el navegador, que permita a los niños practicar la formación de palabras por sílabas de forma autónoma, con refuerzo emocional positivo, reduciendo la dependencia del acompañamiento adulto constante durante la práctica.

## Audiencia Objetivo

### Usuarios primarios: Niños de 4 a 6 años

| Atributo | Detalle |
|---|---|
| **Edad** | 4 a 6 años (preescolar y transición) |
| **Idioma** | Español nativo o en aprendizaje |
| **Habilidades motoras** | Motricidad fina en desarrollo; requiere áreas de toque grandes (mínimo 48px) y gestos simples (arrastrar y soltar) |
| **Habilidades cognitivas** | Reconocimiento de sílabas y letras; vocabulario en expansión; atención sostenida de 5-10 minutos |
| **Habilidades de lectura** | Pre-lectores a lectores emergentes; conocen algunas letras y sílabas básicas |
| **Contexto de uso** | Tabletas y teléfonos móviles en orientación horizontal; en casa o en el aula |

### Usuarios secundarios: Padres y educadores

- No necesitan crear cuenta ni configurar nada.
- Se benefician de que el niño pueda jugar de forma autónoma.
- Pueden consultar el progreso guardado localmente (últimas 20 palabras).

### Restricciones de la audiencia

- **Sin lectura requerida:** Toda navegación debe ser comprensible por íconos, colores y animaciones.
- **Sin entrada de texto obligatoria:** El nombre del niño es opcional y se ingresa con teclado simplificado o asistencia del adulto.
- **Seguridad infantil:** Sin conexión a internet para gameplay, sin recolección de datos, sin publicidad, sin enlaces externos.

## Principios de UX Emocional

Estos principios guían todas las decisiones de diseño de interacción y visual del producto, fundamentados en psicología infantil y refuerzo positivo.

### Refuerzo positivo incondicional

- **Nunca hay error, hay descubrimiento.** Si la combinación no forma una palabra, el juego guía suavemente en lugar de señalar el fallo.
- **Cada acción válida se celebra.** Arrastrar una sílaba, completar una palabra, descubrir una nueva — todo genera microanimaciones de alegría.
- **Los avatares animales reaccionan emocionalmente** al progreso: saltan, bailan, aplauden. Nunca muestran tristeza, enojo o decepción.

### Autonomía y agencia

- **El niño decide.** Elige su avatar, su nombre (opcional), y el dado lo "lanza" él.
- **Sin caminos obligatorios.** Puede explorar libremente dentro de cada mundo antes de avanzar al siguiente.
- **Ritmo propio.** El temporizador es suave y visual (ej. un sol que se mueve), no es punitivo — al agotarse, simplemente se celebra lo logrado.

### Estética segura y cálida

- **Paleta pastel:** Colores suaves, saturación baja, contraste suficiente para accesibilidad.
- **Bordes redondeados** en todos los elementos interactivos.
- **Tipografía grande y redondeada** (estilo infantil, altamente legible).
- **Animaciones fluidas y lentas** — nunca movimientos bruscos o parpadeos rápidos.
- **Sonidos suaves** opcionales: melodías calmantes, efectos de celebración gentiles.

### Reducción de carga cognitiva

- **Un concepto por pantalla.** Selección de avatar → nombre → mundo → juego. Sin pantallas multimodales.
- **Máximo 2-3 acciones posibles** en cualquier momento.
- **Iconografía universal:** Flechas para avanzar, casa para inicio, dado para lanzar.
- **Retroalimentación inmediata** en cada interacción (< 200ms de respuesta visual).

### Inclusividad

- **Sin dependencia del color** para transmitir información (formas + color).
- **Áreas de toque generosas** para motricidad fina en desarrollo.
- **Sin presión de tiempo real** — el temporizador es orientativo, no eliminatorio.

## Loop de Gameplay Central

### Flujo principal (sesión de juego)

```
┌─────────────────────────────────────────────────────┐
│  1. INICIO                                          │
│     Seleccionar avatar animal                       │
│     Nombre opcional                                 │
│     Seleccionar mundo (Selva → Granja → Océano)     │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  2. LANZAR DADO                                     │
│     El niño toca el dado grande animado              │
│     El dado gira y muestra una sílaba               │
│     (dificultad según mundo/progreso)               │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  3. CONSTRUIR PALABRA                               │
│     La sílaba del dado va a la zona de              │
│     construcción (obligatoria)                      │
│     El niño arrastra letras del alfabeto            │
│     disponible para completar la palabra            │
│     Sugerencias aparecen al acercarse a una         │
│     palabra válida                                  │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  4. VALIDACIÓN AUTOMÁTICA                           │
│     ¿Es una palabra real en español?                │
│     ├─ SÍ → Celebración animal + puntos            │
│     │       Palabra se guarda en progreso           │
│     └─ CASI → Sugerencia suave                     │
│               "¡Casi! ¿Y si pruebas con...?"       │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│  5. CICLO                                           │
│     ¿Tiempo restante en el temporizador suave?      │
│     ├─ SÍ → Volver a paso 2 (nuevo dado)           │
│     └─ NO → Celebración de cierre                  │
│              Resumen visual de palabras logradas    │
│              Progreso guardado en LocalStorage      │
└─────────────────────────────────────────────────────┘
```

### Mecánicas clave del loop

| Mecánica | Descripción |
|---|---|
| **Dado silábico** | Genera sílabas según nivel de dificultad. Es el objeto central y más grande en pantalla. |
| **Sílaba obligatoria** | La sílaba generada DEBE estar en la palabra construida. Esto ancla el aprendizaje silábico. |
| **Letras ilimitadas** | El alfabeto completo está disponible sin restricción. Reduce frustración. |
| **Sugerencias progresivas** | Al tener 2+ letras correctas de una palabra válida, aparece una sugerencia visual sutil. |
| **Validación sin castigo** | No hay "incorrecto". Solo guía suave o celebración. |
| **Temporizador suave** | Visual (sol moviéndose, río fluyendo), no numérico. No penaliza, solo marca ritmo. |

### Progresión por mundos

| Mundo | Temática | Dificultad silábica | Ejemplos de sílabas |
|---|---|---|---|
| **Selva** | Animales de la selva | Sílabas directas simples (CV): ma, pa, lo, te | ma → "mama", "mapa" |
| **Granja** | Animales de granja | Sílabas directas + trabadas: bra, cre, pla, tri | pla → "plato", "plaza" |
| **Océano** | Animales marinos | Sílabas mixtas + inversas: al, en, mar, ción | mar → "marco", "martes" |

## Success Criteria

### User Success

- Un niño de 5 años completa una sesión de juego completa **sin asistencia adulta**.
- El niño comprende la mecánica (lanzar dado → arrastrar sílaba → completar palabra) **en los primeros 2 intentos**, sin instrucciones textuales.
- El niño forma **≥ 3 palabras válidas** por sesión.
- Duración de sesión promedio entre **5 y 10 minutos** (alineada con capacidad de atención de la edad).
- Tasa de abandono antes de completar la primera palabra: **< 30%**.
- El niño **quiere volver a jugar** (observación cualitativa en pruebas con usuarios reales).

### Business Success

- **MVP funcional desplegado en Azure** con costo mensual **< $5 USD** (Static Web App o equivalente).
- **0 dependencias de backend** en MVP — toda la lógica en cliente.
- Tiempo de carga inicial **< 3 segundos** en conexión 3G.
- El producto es demostrable y usable para validar la mecánica silábica **en 4-6 semanas de desarrollo**.

### Technical Success

- **Lighthouse score ≥ 90** en Performance, Accessibility y Best Practices.
- Funciona correctamente en **Chrome, Safari y Edge** (últimas 2 versiones).
- Responsive horizontal en pantallas desde **320px hasta 1920px de ancho**.
- **LocalStorage** persiste correctamente las últimas 20 palabras y progreso entre sesiones.
- Diccionario silábico embebido con **0 llamadas a API externa** durante el gameplay.

### Measurable Outcomes

| Métrica | Objetivo MVP | Método de medición |
|---|---|---|
| Autonomía del niño | Sesión completa sin ayuda | Prueba observacional con 3-5 niños |
| Palabras por sesión | ≥ 3 | Datos en LocalStorage |
| Tiempo de sesión | 5-10 min | Datos en LocalStorage |
| Abandono pre-primera palabra | < 30% | Prueba observacional |
| Costo mensual Azure | < $5 USD | Facturación Azure |
| Tiempo de carga | < 3s en 3G | Lighthouse / WebPageTest |

## User Journeys

### Journey 1: Valentina (5 años) — Primera sesión

**Quién es:** Valentina tiene 5 años, está en preescolar y reconoce algunas letras y sílabas. Le encantan los animales. Su mamá le pasa la tableta con el juego abierto.

**Opening Scene:** Valentina ve una pantalla colorida con animales simpáticos. No hay texto que leer. Un tucán, un mono y una rana la miran con ojos grandes y amigables. Toca el mono porque le gustan los monos. El mono salta de alegría.

**Rising Action:** Aparece un teclado grande con pocas letras. Su mamá le ayuda a escribir "VALE". Luego aparece una selva con un dado enorme. Valentina toca el dado — el dado gira y muestra "MA". La sílaba "MA" baja a una zona con casillas vacías. Valentina ve letras grandes del alfabeto abajo. No entiende qué hacer. La sílaba "MA" pulsa suavemente y las letras cercanas brillan un poco.

**Climax:** Valentina arrastra la "P" y la "A" antes de "MA". Aparece "PAMA" — no es palabra, pero está cerca. El juego muestra sutilmente una sugerencia: la imagen de un árbol con frutos. Valentina quita la "P" y pone "MA" al inicio. Arrastra "M", "A" al final: "MAMA". ¡El mono salta, lanza confeti, baila! Valentina se ríe.

**Resolution:** Valentina forma 2 palabras más en 8 minutos. El sol en la esquina llega al horizonte suavemente. Aparece una pantalla con sus 3 palabras y su mono aplaudiendo. Valentina le dice a su mamá: "¡Mami, otra vez!"

**Requisitos revelados:**
- Onboarding 100% visual, sin texto
- Feedback de guía cuando el niño no interactúa en X segundos
- Sugerencias visuales (imágenes) no textuales
- Celebración multisensorial al completar palabra
- Pantalla de resumen al final de sesión

---

### Journey 2: Mateo (6 años) — Sesión recurrente

**Quién es:** Mateo tiene 6 años, ya sabe leer sílabas directas y está empezando con trabadas. Ha jugado SILABC 4 veces esta semana. Le gusta la rana.

**Opening Scene:** Mateo abre el navegador en la tableta de su papá. El juego lo reconoce (LocalStorage) — aparece su rana con su nombre "MATEO" y un resumen: "¡Llevas 12 palabras!" La rana lo saluda con una animación.

**Rising Action:** Mateo entra a la Selva. Lanza el dado: sale "LO". Ya sabe cómo funciona. Rápidamente arrastra "LO" al centro. Piensa. Arrastra "B" y "O" antes: "BOLO". ¡Válida! La rana celebra. Lanza de nuevo: "PA". Forma "PAPA" en 5 segundos. Otra vez: "TE". Piensa más... arrastra "TE" y luego "LA": "TELA". ¡Tres palabras en 3 minutos!

**Climax:** Sale "RO". Mateo intenta "ROPA" — arrastra "RO", "P", "A". ¡Palabra nueva! No la había formado antes. La rana hace una animación especial para palabra nueva.

**Resolution:** Al final de la sesión, Mateo ve que ya tiene 16 palabras totales. Cierra el juego satisfecho. Al día siguiente, sus 16 palabras siguen ahí.

**Requisitos revelados:**
- Reconocimiento de jugador recurrente vía LocalStorage
- Pantalla de bienvenida con progreso acumulado
- Diferenciación visual entre palabra repetida y palabra nueva
- Velocidad de interacción para niños experimentados (sin tutoriales forzados)
- Persistencia confiable entre sesiones

---

### Journey 3: Carmen (mamá de Valentina) — Supervisión pasiva

**Quién es:** Carmen es la mamá de Valentina. Trabaja desde casa y busca actividades digitales seguras para que Valentina se entretenga 10 minutos mientras ella termina un correo.

**Opening Scene:** Carmen busca "juego sílabas niños español" en Google. Encuentra SILABC. Abre el link en la tableta. No hay registro, no hay "prueba gratuita", no hay formulario. El juego carga directamente.

**Rising Action:** Carmen ve la pantalla de avatares. Entiende que es seguro: no hay publicidad, no hay enlaces externos, no hay chat. Le pasa la tableta a Valentina. Desde lejos, ve colores pastel y escucha (si hay sonido) melodías suaves.

**Climax:** Carmen mira por encima del hombro. Ve que Valentina está formando la palabra "MESA". Sonríe. No tuvo que intervenir.

**Resolution:** 10 minutos después, Valentina le muestra la pantalla de resumen: "¡Mami, hice 4 palabras!" Carmen ve las palabras en la pantalla. No necesita crear cuenta para ver el progreso. Decide que Valentina puede jugar mañana también.

**Requisitos revelados:**
- Tiempo de descubrimiento a juego: < 30 segundos
- Confianza parental inmediata: sin formularios, sin datos, sin publicidad
- Progreso visible sin login parental (pantalla de resumen)
- Contenido seguro y curado (diccionario sin palabras inapropiadas)

---

### Journey Requirements Summary

| Capacidad | Journeys | Prioridad MVP |
|---|---|---|
| Onboarding visual sin texto | J1, J3 | Must |
| Selección de avatar con feedback animado | J1, J2 | Must |
| Nombre opcional con entrada simplificada | J1, J2 | Must |
| Reconocimiento de jugador recurrente (LocalStorage) | J2 | Must |
| Dado silábico con animación de lanzamiento | J1, J2 | Must |
| Drag & drop de sílabas y letras | J1, J2 | Must |
| Sugerencias visuales (imágenes, no texto) | J1 | Should |
| Validación automática con celebración | J1, J2 | Must |
| Diferenciación palabra nueva vs. repetida | J2 | Should |
| Temporizador visual suave | J1, J2 | Should |
| Pantalla de resumen de sesión | J1, J2, J3 | Must |
| Persistencia LocalStorage (20 palabras + progreso) | J2, J3 | Must |
| Carga instantánea sin formularios | J3 | Must |
| Diccionario curado (sin palabras inapropiadas) | J3 | Must |
| Guía por inactividad (pulsación, brillo) | J1 | Should |

## Product Scope

### MVP Feature Set (Phase 1 — Selva)

**Core User Journeys Supported:**
- J1: Valentina (primera sesión) — onboarding visual completo
- J2: Mateo (sesión recurrente) — persistencia y reconocimiento
- J3: Carmen (supervisión pasiva) — confianza y zero friction

**Must-Have Capabilities:**

| # | Capacidad | Justificación |
|---|---|---|
| 1 | Selección de avatar (3-5 animales) | Agencia mínima, entrada al juego |
| 2 | Nombre opcional | Personalización emocional |
| 3 | Mundo Selva con escenario visual | Contexto temático |
| 4 | Dado silábico animado (sílabas directas CV) | Mecánica central |
| 5 | Zona de construcción drag & drop | Interacción principal |
| 6 | Alfabeto con letras arrastrables ilimitadas | Complemento a sílabas |
| 7 | Diccionario embebido curado | Validación + seguridad de contenido |
| 8 | Validación automática con celebración | Loop de refuerzo positivo |
| 9 | Sugerencias al acercarse a palabra válida | Reduce frustración |
| 10 | Temporizador visual suave (sol moviéndose) | Ritmo de sesión |
| 11 | Pantalla de resumen de sesión | Cierre emocional + progreso visible |
| 12 | LocalStorage (últimas 20 palabras + progreso) | Persistencia entre sesiones |
| 13 | Responsive horizontal | Tabletas y móviles |
| 14 | Paleta pastel + tipografía infantil | UX emocional core |
| 15 | Indicador de rotación (si dispositivo en vertical) | Usabilidad |

### Excluido del MVP

| Funcionalidad | Razón de exclusión |
|---|---|
| Mundos Granja y Océano | Se activan tras validar el loop con Selva |
| Sonido y música | Complejidad de producción; se agrega post-validación |
| Sistema de logros / coleccionables | Complejidad innecesaria para validar la mecánica core |
| Dashboard parental | No hay login; progreso es local y simple |
| Multijugador / competencia | Contradice los principios de ritmo propio |
| Soporte multiidioma | Foco es español; expansión posterior |
| Backend / API | Frontend-first; diccionario embebido en cliente |
| Login / autenticación | Complejidad innecesaria; zero-friction para niños |
| Analítica de uso | Sin recolección de datos en MVP |

### Growth Features (Phase 2)

- Mundo Granja con sílabas trabadas (CCV): bra, cre, pla
- Mundo Océano con sílabas inversas y mixtas: al, en, mar
- Desbloqueo progresivo de mundos basado en palabras completadas
- Sonido y música ambiental con efectos de celebración
- Diferenciación visual palabra nueva vs. repetida
- Guía por inactividad (animaciones de ayuda)

### Vision Features (Phase 3)

- Sistema de logros y coleccionables de animales
- Dashboard parental (lectura de progreso local)
- PWA con soporte offline completo
- Soporte multiidioma (portugués, catalán)
- Modo colaborativo (turnos entre hermanos)
- Integración con estándares curriculares por país
- Analítica anónima agregada para educadores

## Project Scoping & Strategy

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP — validar que la experiencia del dado silábico genera aprendizaje y engagement en niños reales, con la mínima superficie funcional posible.

**Filosofía:** Construir lo mínimo necesario para poner un dado silábico animado frente a un niño de 5 años y observar si forma palabras de forma autónoma y quiere repetir.

**Resource Requirements:** 1 desarrollador frontend con experiencia en animaciones web y drag & drop táctil. No se requiere backend, QA automatizado, ni DevOps complejo.

### Risk Mitigation Strategy

**Riesgos técnicos:**

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Drag & drop no fluido en touch | Media | Prototipo de interacción táctil como primera tarea de desarrollo |
| Bundle size excede 500KB | Baja | Diccionario optimizado; lazy loading de assets por mundo |
| Animaciones no fluidas en dispositivos económicos | Media | Usar CSS transforms (GPU-accelerated); fallback estático |

**Riesgos de mercado:**

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Los niños no entienden la mecánica sin instrucciones | Media | Prueba con 3-5 niños antes de lanzar; iterar onboarding |
| Padres no confían sin marca conocida | Alta | Landing page profesional; screenshots; sin solicitud de datos |
| Diccionario demasiado limitado para ser divertido | Baja | Mínimo 50 palabras para MVP; expandible sin redeploy |

**Riesgos de recursos:**

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Desarrollador único no disponible | Media | Arquitectura simple que otro dev pueda continuar |
| Scope creep durante desarrollo | Alta | PRD cerrado; no agregar mundos ni sonido hasta validar MVP |

## Domain-Specific Requirements

### Privacidad y Protección Infantil

- **Sin recolección de datos personales.** El nombre del niño se almacena exclusivamente en LocalStorage del dispositivo. Nunca se transmite a ningún servidor.
- **Sin cookies de terceros, sin analytics, sin publicidad.** Cumplimiento implícito de COPPA y regulaciones equivalentes al no recopilar, almacenar ni transmitir datos de menores.
- **Sin enlaces externos.** El juego no contiene links que lleven al niño fuera de la aplicación.
- **Sin comunicación en red durante gameplay.** Una vez cargada la app, todo el procesamiento es local.

### Moderación de Contenido

- **Diccionario curado y cerrado.** Solo palabras apropiadas para niños de 4-6 años. El diccionario se revisa manualmente antes de cada release.
- **Sin entrada libre publicable.** El nombre del niño es privado (local) y las palabras construidas se validan contra el diccionario cerrado — no es posible generar contenido inapropiado.
- **Sin contenido generado por usuarios.** No hay interacción social, chat, ni compartir contenido.

### Accesibilidad Adaptada a la Edad

- **Áreas de toque mínimas de 48x48px** (WCAG 2.1 AA adaptado a motricidad infantil).
- **Contraste suficiente** dentro de la paleta pastel (ratio ≥ 3:1 para elementos interactivos).
- **Sin dependencia del color** para transmitir información (formas + color siempre).
- **Sin texto como único medio de instrucción.** Toda navegación es por iconografía y animación.
- **Sin parpadeos rápidos ni movimientos bruscos** (cumplimiento de criterios de convulsiones WCAG).

### Alineación Curricular

- **Método silábico español.** Las sílabas generadas siguen la progresión pedagógica estándar del español: sílabas directas (CV) → trabadas (CCV) → inversas (VC) → mixtas.
- **Vocabulario apropiado.** Palabras seleccionadas del vocabulario funcional de niños de 4-6 años hispanohablantes.
- **Sin alineación formal a un currículo específico en MVP.** El producto es complementario, no curricular.

### Riesgos de Dominio y Mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Palabra inapropiada en diccionario | Alto — confianza parental | Revisión manual del diccionario; lista de exclusión explícita |
| Frustración del niño por no encontrar palabras | Medio — abandono | Sugerencias progresivas; sílabas generadas con ≥ 5 palabras posibles |
| Sílaba sin palabras formables por el niño | Alto — bloqueo de gameplay | Cada sílaba del dado tiene mínimo 3 palabras del vocabulario objetivo |
| Pérdida de progreso (LocalStorage borrado) | Bajo — no hay datos sensibles | Aceptable para MVP; mitiga con mensaje amigable de bienvenida |

## Web App Specific Requirements

### Project-Type Overview

SILABC es una **Single Page Application (SPA)** estática desplegada como Azure Static Web App. No requiere servidor, API ni base de datos. Toda la lógica de juego, validación y persistencia se ejecuta en el navegador del cliente.

### Browser Support Matrix

| Navegador | Versiones soportadas | Prioridad |
|---|---|---|
| **Chrome (Android/Desktop)** | Últimas 2 versiones | Primary — dispositivo más común en LATAM |
| **Safari (iOS/iPadOS)** | Últimas 2 versiones | Primary — tabletas Apple en hogares |
| **Edge** | Últimas 2 versiones | Secondary |
| **Firefox** | Últimas 2 versiones | Best-effort, sin pruebas activas |

**No soportado:** Internet Explorer, navegadores embebidos de apps de redes sociales.

### Responsive Design

- **Orientación:** Solo horizontal (landscape). Si el dispositivo está en vertical, mostrar indicador visual amigable para rotar.
- **Breakpoints:**
  - Móvil landscape: 568px - 812px
  - Tableta landscape: 1024px - 1366px
  - Desktop: 1440px - 1920px
- **Estrategia:** Mobile-first con escalado hacia desktop.
- **Touch targets:** Mínimo 48x48px en todos los breakpoints.
- **Drag & drop:** Debe funcionar con touch (táctil) y mouse.

### Performance Targets

| Métrica | Objetivo | Justificación |
|---|---|---|
| First Contentful Paint | < 1.5s | Atención infantil: si no carga rápido, se pierde |
| Largest Contentful Paint | < 2.5s | Límite para percepción de "carga instantánea" |
| Time to Interactive | < 3.0s | El niño debe poder interactuar rápidamente |
| Total Bundle Size | < 500KB gzipped | Conexiones lentas en LATAM |
| Lighthouse Performance | ≥ 90 | Estándar de calidad web |
| Animaciones | 60fps constantes | Fluidez visual para experiencia infantil |

### SEO Strategy

- **Mínima.** SILABC no es un sitio de contenido.
- Una **landing page estática** con meta tags básicos para que padres encuentren el juego buscando "juego sílabas niños español".
- `<title>`, `<meta description>`, Open Graph tags para compartir en redes sociales.
- La SPA del juego no necesita indexación — es una aplicación, no contenido web.

### Accessibility Level

- **Estándar objetivo:** WCAG 2.1 AA adaptado al contexto infantil (4-6 años).
- **Navegación por teclado:** No requerida en MVP (público objetivo usa touch).
- **Screen readers:** No aplicable para MVP (público pre-lector; interfaz 100% visual).
- **Foco visible:** Sí, para cualquier elemento interactivo (útil para uso con mouse en desktop).
- **Reducción de movimiento:** Respetar `prefers-reduced-motion` para animaciones no esenciales.

### Implementation Considerations

- **Framework:** SPA ligero (React, Preact, o vanilla JS con Web Components). La decisión se toma en arquitectura técnica.
- **Diccionario:** JSON embebido en el bundle. Estructura: sílaba → lista de palabras válidas con metadata (dificultad, frecuencia de uso).
- **Animaciones:** CSS animations + requestAnimationFrame. Sin dependencias pesadas de animación.
- **Drag & drop:** Implementación con Pointer Events API (unifica touch y mouse).
- **Estado de juego:** En memoria durante sesión, persistido a LocalStorage al final de cada palabra completada y al cierre de sesión.
- **Despliegue:** Azure Static Web Apps (tier gratuito o mínimo). CDN incluido.

## Functional Requirements

### Onboarding y Personalización

- **FR1:** El niño puede seleccionar un avatar animal de entre 3-5 opciones disponibles.
- **FR2:** El avatar seleccionado reacciona con una animación de celebración al ser elegido.
- **FR3:** El niño puede ingresar opcionalmente un nombre mediante entrada simplificada.
- **FR4:** El sistema reconoce a un jugador recurrente y muestra su avatar, nombre y progreso acumulado.
- **FR5:** Un jugador nuevo accede directamente al flujo de selección de avatar sin pasos previos.

### Navegación y Mundos

- **FR6:** El niño puede acceder al mundo Selva desde la pantalla principal.
- **FR7:** El sistema muestra un indicador visual amigable para rotar el dispositivo si está en orientación vertical.
- **FR8:** El niño puede volver a la pantalla de inicio desde cualquier punto del juego.

### Dado Silábico

- **FR9:** El niño puede lanzar el dado silábico tocándolo.
- **FR10:** El dado muestra una animación de giro al ser lanzado.
- **FR11:** El dado genera una sílaba directa (consonante + vocal) acorde al mundo Selva.
- **FR12:** La sílaba generada se coloca automáticamente en la zona de construcción como pieza obligatoria.

### Construcción de Palabras

- **FR13:** El niño puede arrastrar letras del alfabeto disponible a la zona de construcción.
- **FR14:** El niño puede posicionar letras antes o después de la sílaba obligatoria.
- **FR15:** El niño puede remover letras ya colocadas de la zona de construcción.
- **FR16:** El alfabeto completo está disponible sin restricción de cantidad de letras.
- **FR17:** La sílaba del dado permanece fija como parte obligatoria de la palabra en construcción.

### Validación y Feedback

- **FR18:** El sistema valida automáticamente la combinación contra el diccionario embebido.
- **FR19:** Cuando la combinación forma una palabra válida, el sistema muestra una celebración animada con el avatar del niño.
- **FR20:** Cuando la combinación se acerca a una palabra válida, el sistema muestra una sugerencia visual sutil.
- **FR21:** El sistema nunca muestra mensajes de error, fallo o penalización.
- **FR22:** Cada sílaba generada por el dado tiene al menos 3 palabras formables del vocabulario objetivo.

### Temporizador y Sesión

- **FR23:** El sistema muestra un temporizador visual suave (metáfora visual, no numérico) durante la sesión de juego.
- **FR24:** Al agotarse el temporizador, el sistema celebra lo logrado en lugar de penalizar.
- **FR25:** Al finalizar la sesión, el sistema muestra una pantalla de resumen con las palabras completadas y el avatar celebrando.

### Persistencia y Progreso

- **FR26:** El sistema guarda el progreso del jugador en LocalStorage del dispositivo.
- **FR27:** El sistema persiste las últimas 20 palabras completadas.
- **FR28:** El sistema persiste el avatar seleccionado, nombre y progreso acumulado entre sesiones.
- **FR29:** Al completar una palabra nueva (no repetida), el sistema la marca como nueva en el resumen.

### Seguridad de Contenido

- **FR30:** El diccionario contiene exclusivamente palabras apropiadas para niños de 4-6 años.
- **FR31:** El sistema no contiene enlaces externos, publicidad ni formularios de recolección de datos.
- **FR32:** El sistema no realiza comunicación de red durante el gameplay una vez cargado.

## Non-Functional Requirements

### Performance

- **NFR1:** First Contentful Paint < 1.5 segundos en conexión 3G.
- **NFR2:** Time to Interactive < 3.0 segundos en conexión 3G.
- **NFR3:** Total bundle size < 500KB gzipped (incluido diccionario).
- **NFR4:** Animaciones de juego a 60fps constantes en dispositivos con ≥ 2GB RAM.
- **NFR5:** Respuesta visual a interacciones de drag & drop < 16ms (un frame).
- **NFR6:** Validación de palabra contra diccionario < 50ms.
- **NFR7:** Lighthouse Performance score ≥ 90.

### Security y Privacidad

- **NFR8:** La aplicación no transmite datos a ningún servidor durante o después del gameplay.
- **NFR9:** No se incluyen scripts de terceros (analytics, ads, tracking).
- **NFR10:** El diccionario embebido es revisado manualmente y no contiene palabras inapropiadas para menores.
- **NFR11:** No existen enlaces que dirijan al usuario fuera de la aplicación.
- **NFR12:** Content Security Policy (CSP) configurada para bloquear recursos externos.

### Accessibility

- **NFR13:** Todas las áreas interactivas tienen un tamaño mínimo de 48x48px.
- **NFR14:** Contraste de color ≥ 3:1 para elementos interactivos sobre fondo pastel.
- **NFR15:** La información nunca se transmite únicamente por color (formas + color siempre).
- **NFR16:** Sin parpadeos > 3 por segundo ni flashes de contenido (criterio de convulsiones WCAG 2.1).
- **NFR17:** La aplicación respeta `prefers-reduced-motion` desactivando animaciones no esenciales.
- **NFR18:** Foco visible en todos los elementos interactivos cuando se usa mouse/teclado.

### Compatibility

- **NFR19:** Funciona correctamente en Chrome, Safari y Edge (últimas 2 versiones).
- **NFR20:** Responsive horizontal en viewports de 568px a 1920px de ancho.
- **NFR21:** Drag & drop funciona con touch (Pointer Events API) y mouse.
- **NFR22:** Persistencia LocalStorage funciona correctamente en navegación privada (degradación graceful si no disponible).

### Reliability

- **NFR23:** La aplicación funciona completamente offline una vez cargada (no depende de red para gameplay).
- **NFR24:** Si LocalStorage no está disponible, el juego funciona normalmente sin persistencia (sesión única sin error).
- **NFR25:** El diccionario embebido siempre está disponible (no hay estado de "datos no cargados").
