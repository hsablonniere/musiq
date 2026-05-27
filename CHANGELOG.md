# Changelog

## 0.0.4

### Bug Fixes

- `<mq-fretboard-scale>` — fix notes appearing on wrong strings after horizontal string order fix

## 0.0.3

### Bug Fixes

- `<mq-fretboard>` — reverse string order in horizontal orientation

## 0.0.2

### Bug Fixes

- `<mq-piano-chord>` — add border on active black keys

## 0.0.1

### Features

- `<mq-piano>` — piano keyboard with realistic key geometry, configurable range, `accurate`/`centered` modes, `preserve-ratio`, `::part()` styling, CSS custom properties, and named slots for per-key annotations
- `<mq-piano-chord>` — piano chord visualization with `note-labels`, slash chord inversions, and customizable active color
- `<mq-piano-scale>` — piano scale visualization supporting major, minor, pentatonic, blues, modes (dorian, phrygian, lydian…), and more. `note-labels`, `degree-labels`, and distinct root color
- `<mq-fretboard>` — guitar/bass fretboard with slot-based content placement, horizontal/vertical orientation, configurable strings and fret range, `fret-numbers`, `inlays`, `full-neck`, `left-handed`, and `extra-slots` for multi-string spans
- `<mq-fretboard-chord>` — fretboard chord diagrams for guitar and ukulele, multiple voicings via `position`, `finger-labels`, barre support, and `left-handed`
- `<mq-fretboard-scale>` — fretboard scale visualization with custom tunings, `note-labels`, `degree-labels`, `inlays`, and `left-handed`

### Infrastructure

- Vite 6 build (lib mode, ESM only)
- TypeScript with `tsgo` for typechecking
- oxlint / oxfmt for linting and formatting
- Custom Elements Manifest generation
- GitHub Pages demo deployment via CI
