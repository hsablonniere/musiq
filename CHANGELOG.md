# Changelog

## Unreleased

### Breaking Changes

- `<mq-piano>` — ships unstyled: dropped the color defaults so the keyboard renders bare (theme via `::part()` and the `--mq-piano-*` custom properties); removed `preserve-ratio` — the keyboard is now always locked to real piano proportions. Also added full JSDoc
- `<mq-piano-chord>` — reworked to match `<mq-piano>`: ships unstyled; renamed the `chord` attribute/property to `name` and the `title` part to `name`; replaced the `--mq-piano-chord-active-color` custom property with the `key-pressed` part; dropped the hardcoded marker borders; defaulted the `mode` property to `accurate`
- `<mq-piano-scale>` — reworked to match `<mq-piano>`/`<mq-piano-chord>`: ships unstyled (theme via `::part()`); renamed the `scale` attribute/property to `name` and the `title` part to `name`; replaced the `--mq-piano-scale-active-color`/`--mq-piano-scale-root-color` custom properties with the `key-in-scale`/`key-tonic` parts; added a reflected `mode` property defaulting to `accurate`
- `<mq-fretboard>` — ships unstyled: dropped the `#000` color defaults on the nut/fret/string/inlay custom properties (set `--mq-fretboard-{nut,fret,string,inlay}-color` to make the structure visible). Also added input validation and full JSDoc
- `<mq-fretboard-chord>` — reworked to match `<mq-piano-chord>`: ships unstyled; renamed the `chord` attribute/property to `name` and the `title` part to `name`; replaced the `dot`/`barre`/`marker` parts with `marker`/`marker-barre`/`marker-open`/`marker-muted` (no default color or shape); exposed the `finger` and `error` parts
- `<mq-fretboard-scale>` — reworked to match `<mq-piano-scale>`: ships unstyled; renamed the `scale` attribute/property to `name` and the `title` part to `name`; replaced the `--mq-fretboard-scale-active-color`/`--mq-fretboard-scale-root-color` custom properties and the `dot` part with the `marker`/`marker-tonic` parts; exposed the `label`, `degree` and `error` parts

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
