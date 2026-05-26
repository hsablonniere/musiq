# musiq

A collection of web components for rendering musical instruments, chords, and scales. Built with [Lit](https://lit.dev/).

**[Live demo](https://hsablonniere.github.io/musiq/)**

## Components

| Component | Description |
|---|---|
| `<mq-piano>` | Piano keyboard with realistic key geometry |
| `<mq-piano-chord>` | Piano keyboard with chord visualization |
| `<mq-piano-scale>` | Piano keyboard with scale visualization |
| `<mq-fretboard>` | Guitar/bass fretboard |
| `<mq-fretboard-chord>` | Fretboard with chord diagram |
| `<mq-fretboard-scale>` | Fretboard with scale visualization |

## Install

```bash
npm install @hsablonniere/musiq
```

## Usage

```js
import '@hsablonniere/musiq';
```

```html
<mq-piano-chord chord="C"></mq-piano-chord>
<mq-piano-scale scale="C major"></mq-piano-scale>
<mq-fretboard-chord chord="Am"></mq-fretboard-chord>
<mq-fretboard-scale scale="A minor pentatonic"></mq-fretboard-scale>
```

You can also import individual components:

```js
import '@hsablonniere/musiq/mq-piano';
import '@hsablonniere/musiq/mq-fretboard-chord';
```

## Components API

### `<mq-piano>`

| Attribute | Type | Default | Description |
|---|---|---|---|
| `start-note` | `string` | `"C3"` | First note displayed (e.g. `"C3"`, `"A2"`) |
| `end-note` | `string` | `"E4"` | Last note displayed |
| `mode` | `"accurate" \| "centered"` | `"accurate"` | Key width mode |
| `preserve-ratio` | `boolean` | `false` | Maintain realistic aspect ratio |

### `<mq-piano-chord>`

| Attribute | Type | Default | Description |
|---|---|---|---|
| `chord` | `string` | `""` | Chord name (e.g. `"C major"`, `"F#m7"`) |
| `note-labels` | `boolean` | `false` | Show note names on keys |

### `<mq-piano-scale>`

| Attribute | Type | Default | Description |
|---|---|---|---|
| `scale` | `string` | `""` | Scale name (e.g. `"C major"`, `"A minor pentatonic"`) |
| `note-labels` | `boolean` | `false` | Show note names on keys |
| `degree-labels` | `boolean` | `false` | Show scale degrees |

### `<mq-fretboard>`

| Attribute | Type | Default | Description |
|---|---|---|---|
| `strings` | `number` | `6` | Number of strings |
| `start-fret` | `number` | `1` | First fret displayed |
| `end-fret` | `number` | `12` | Last fret displayed |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `fret-numbers` | `string` | `""` | Fret numbers to display (`"all"` or comma-separated) |
| `inlays` | `boolean` | `false` | Show fret inlay markers |
| `full-neck` | `boolean` | `false` | Extend neck background to edges |
| `left-handed` | `boolean` | `false` | Mirror for left-handed players |

### `<mq-fretboard-chord>`

| Attribute | Type | Default | Description |
|---|---|---|---|
| `chord` | `string` | `""` | Chord name (e.g. `"C"`, `"Am"`, `"F#m7"`) |
| `instrument` | `"guitar" \| "ukulele"` | `"guitar"` | Target instrument |
| `position` | `number` | `0` | Voicing index |
| `left-handed` | `boolean` | `false` | Mirror for left-handed players |
| `finger-labels` | `boolean` | `false` | Show finger numbers |

### `<mq-fretboard-scale>`

| Attribute | Type | Default | Description |
|---|---|---|---|
| `scale` | `string` | `""` | Scale name (e.g. `"A minor pentatonic"`) |
| `tuning` | `string` | `"E,A,D,G,B,E"` | String tuning (low to high) |
| `start-fret` | `number` | `0` | First fret (0 = open strings) |
| `end-fret` | `number` | `12` | Last fret |
| `note-labels` | `boolean` | `false` | Show note names |
| `degree-labels` | `boolean` | `false` | Show scale degrees |
| `left-handed` | `boolean` | `false` | Mirror for left-handed players |
| `inlays` | `boolean` | `false` | Show fret inlay markers |

## License

[MIT](./LICENSE)
