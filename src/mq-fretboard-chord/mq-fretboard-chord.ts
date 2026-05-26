import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import guitarData from "@tombatossals/chords-db/lib/guitar.json";
import ukuleleData from "@tombatossals/chords-db/lib/ukulele.json";
import "../mq-fretboard/mq-fretboard.js";

type Instrument = "guitar" | "ukulele";

interface InstrumentData {
  chords: Record<string, ChordEntry[]>;
}

const INSTRUMENT_DATA: Record<Instrument, InstrumentData> = {
  guitar: guitarData as InstrumentData,
  ukulele: ukuleleData as InstrumentData,
};

const KEY_TO_PROP: Record<string, string> = {
  C: "C",
  "C#": "Csharp",
  Db: "Csharp",
  D: "D",
  "D#": "Eb",
  Eb: "Eb",
  E: "E",
  F: "F",
  "F#": "Fsharp",
  Gb: "Fsharp",
  G: "G",
  "G#": "Ab",
  Ab: "Ab",
  A: "A",
  "A#": "Bb",
  Bb: "Bb",
  B: "B",
};

const SUFFIX_ALIASES: Record<string, string> = {
  "": "major",
  m: "minor",
};

interface ChordPosition {
  frets: number[];
  fingers: number[];
  baseFret: number;
  barres: number[];
  capo?: boolean;
}

interface ChordEntry {
  key: string;
  suffix: string;
  positions: ChordPosition[];
}

function parseChordName(name: string): { key: string; suffix: string } | null {
  const match = name.match(/^([A-G][#b]?)(.*)/);
  if (!match) return null;
  const [, root, rawSuffix] = match;
  const prop = KEY_TO_PROP[root];
  if (!prop) return null;
  const suffix = SUFFIX_ALIASES[rawSuffix] ?? rawSuffix;
  return { key: prop, suffix };
}

function lookupChord(data: InstrumentData, key: string, suffix: string): ChordEntry | null {
  const chords = data.chords[key];
  if (!chords) return null;
  return chords.find((c) => c.suffix === suffix) ?? null;
}

@customElement("mq-fretboard-chord")
export class MqFretboardChord extends LitElement {
  @property() accessor chord: string = "";
  @property() accessor instrument: Instrument = "guitar";
  @property({ type: Number }) accessor position: number = 0;
  @property({ type: Boolean, reflect: true, attribute: "left-handed" })
  accessor leftHanded: boolean = false;
  @property({ type: Boolean, attribute: "finger-labels" }) accessor fingerLabels: boolean = false;

  render() {
    const parsed = parseChordName(this.chord);
    if (!parsed) return html`<div class="error">Unknown chord: ${this.chord}</div>`;

    const data = INSTRUMENT_DATA[this.instrument] ?? INSTRUMENT_DATA.guitar;
    const entry = lookupChord(data, parsed.key, parsed.suffix);
    if (!entry) return html`<div class="error">Unknown chord: ${this.chord}</div>`;

    const pos = entry.positions[this.position] ?? entry.positions[0];
    if (!pos) return nothing;

    const { frets, fingers, baseFret } = pos;
    const stringCount = frets.length;

    const barreInfos = (pos.barres ?? [])
      .map((barreFret) => {
        const indices = frets.reduce<number[]>(
          (acc, f, i) => (f === barreFret ? [...acc, i] : acc),
          [],
        );
        if (indices.length < 2) return null;
        return {
          fromString: Math.min(...indices) + 1,
          toString: Math.max(...indices) + 1,
          actualFret: baseFret + barreFret - 1,
          finger: fingers[indices[0]],
          stringIndices: new Set(indices),
        };
      })
      .filter((b): b is NonNullable<typeof b> => b != null);

    const barreStringIndices = new Set(barreInfos.flatMap((b) => [...b.stringIndices]));
    const extraSlots = barreInfos
      .map((b) => `s${b.fromString}-s${b.toString}-f${b.actualFret}`)
      .join(", ");

    const actualFrets = frets.map((f) => (f > 0 ? baseFret + f - 1 : f));
    const frettedFrets = actualFrets.filter((f) => f > 0);

    let startFret: number;
    let endFret: number;

    if (frettedFrets.length === 0) {
      startFret = 1;
      endFret = 4;
    } else {
      const maxFret = Math.max(...frettedFrets);
      if (maxFret <= 4) {
        startFret = 1;
      } else {
        startFret = Math.min(...frettedFrets);
      }
      endFret = Math.max(startFret + 3, maxFret);
    }

    const fretNumbers = startFret > 1 ? String(startFret) : "";

    return html`
      ${this.chord ? html`<div class="title" part="title">${this.chord}</div>` : nothing}
      <mq-fretboard
        .strings=${stringCount}
        start-fret=${startFret}
        end-fret=${endFret}
        orientation="vertical"
        ?left-handed=${this.leftHanded}
        fret-numbers=${fretNumbers}
        extra-slots=${extraSlots || nothing}
        exportparts="fret-number"
      >
        ${frets.map((fret, i) => {
          const s = i + 1;
          if (fret === -1) {
            return html`<div slot="s${s}-marker" class="marker muted" part="marker">✕</div>`;
          }
          if (fret === 0) {
            return html`<div slot="s${s}-marker" class="marker open" part="marker">○</div>`;
          }
          if (barreStringIndices.has(i)) return nothing;
          const actualFret = baseFret + fret - 1;
          const finger = fingers[i];
          return html`<div slot="s${s}-f${actualFret}" class="dot" part="dot">
            ${this.fingerLabels && finger > 0
              ? html`<span class="finger">${finger}</span>`
              : nothing}
          </div>`;
        })}
        ${barreInfos.map(
          (barre) => html`
            <div
              slot="s${barre.fromString}-s${barre.toString}-f${barre.actualFret}"
              class="barre"
              part="barre"
            >
              ${this.fingerLabels && barre.finger > 0
                ? html`<span class="finger">${barre.finger}</span>`
                : nothing}
            </div>
          `,
        )}
      </mq-fretboard>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
    }

    .title {
      text-align: center;
      font-weight: bold;
      font-size: 1.2em;
    }

    mq-fretboard {
      flex: 1;
      min-height: 0;
    }

    .marker {
      text-align: center;
      line-height: 1;
      margin-bottom: 0.25em;
    }

    .dot {
      width: 1.2em;
      height: 1.2em;
      border-radius: 50%;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.4em 0.2em;
    }

    .barre {
      height: 1.2em;
      border-radius: 0.6em;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.2em;
    }

    .finger {
      font-size: 0.6em;
      font-weight: bold;
      line-height: 1;
      font-family: system-ui, sans-serif;
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `;
}
