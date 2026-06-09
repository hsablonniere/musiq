import { css, html, LitElement } from "lit";
import type { TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

/** Horizontal geometry of a white key, in proportional flex units. */
type WhiteKeyGeometry = {
  /** Width of the back edge — the strip visible between the neighbouring black keys. */
  backWidth: number;
  /** Width of the front edge (full key width); equals `startGap + backWidth + endGap`. */
  frontWidth: number;
  /** Back-edge span taken by the black key on the left (`0` when there is none). */
  startGap: number;
  /** Back-edge span taken by the black key on the right (`0` when there is none). */
  endGap: number;
};

/**
 * One semitone slot of the keyboard model: a white key (two geometry variants)
 * or a black key (note names only).
 */
type Note =
  | {
      type: "white";
      names: readonly [string];
      accurate: WhiteKeyGeometry;
      centered: WhiteKeyGeometry;
    }
  | { type: "black"; names: readonly [string, string] };

// One octave of semitones; white keys carry the geometry that positions the
// black keys between them (see `WhiteKeyGeometry`). `accurate` mirrors real
// piano measurements; `centered` evenly spaces the black keys. Proportions
// derived from http://quadibloc.com/other/cnv05.htm
const NOTES_BY_SEMITONE: readonly Note[] = [
  {
    type: "white",
    names: ["C"],
    accurate: { backWidth: 14, frontWidth: 23, startGap: 0, endGap: 9 },
    centered: { backWidth: 17, frontWidth: 24, startGap: 0, endGap: 7 },
  },
  { type: "black", names: ["Cs", "Db"] },
  {
    type: "white",
    names: ["D"],
    accurate: { backWidth: 14, frontWidth: 24, startGap: 5, endGap: 5 },
    centered: { backWidth: 10, frontWidth: 24, startGap: 7, endGap: 7 },
  },
  { type: "black", names: ["Ds", "Eb"] },
  {
    type: "white",
    names: ["E"],
    accurate: { backWidth: 14, frontWidth: 23, startGap: 9, endGap: 0 },
    centered: { backWidth: 17, frontWidth: 24, startGap: 7, endGap: 0 },
  },
  {
    type: "white",
    names: ["F"],
    accurate: { backWidth: 13, frontWidth: 24, startGap: 0, endGap: 11 },
    centered: { backWidth: 17, frontWidth: 24, startGap: 0, endGap: 7 },
  },
  { type: "black", names: ["Fs", "Gb"] },
  {
    type: "white",
    names: ["G"],
    accurate: { backWidth: 13, frontWidth: 23, startGap: 3, endGap: 7 },
    centered: { backWidth: 10, frontWidth: 24, startGap: 7, endGap: 7 },
  },
  { type: "black", names: ["Gs", "Ab"] },
  {
    type: "white",
    names: ["A"],
    accurate: { backWidth: 13, frontWidth: 23, startGap: 7, endGap: 3 },
    centered: { backWidth: 10, frontWidth: 24, startGap: 7, endGap: 7 },
  },
  { type: "black", names: ["As", "Bb"] },
  {
    type: "white",
    names: ["B"],
    accurate: { backWidth: 13, frontWidth: 24, startGap: 11, endGap: 0 },
    centered: { backWidth: 17, frontWidth: 24, startGap: 7, endGap: 0 },
  },
];

const SEMITONE_BY_NOTES: Record<string, number> = {};
NOTES_BY_SEMITONE.forEach((n, semitone) => {
  for (const name of n.names) SEMITONE_BY_NOTES[name] = semitone;
});

function parseSemitone(note: string | undefined): number | null {
  if (note == null) return null;
  const groups = note.match(/^(?<note>[A-G][sb]?)(?<octave>\d+)$/)?.groups;
  if (groups == null) return null;
  const base = SEMITONE_BY_NOTES[groups.note];
  if (base == null) return null;
  return parseInt(groups.octave) * 12 + base;
}

function isBlack(semitone: number): boolean {
  return NOTES_BY_SEMITONE[semitone % 12].type === "black";
}

const DEFAULT_START_NOTE = "C3";
const DEFAULT_END_NOTE = "E4";
const DEFAULT_START_SEMITONE = parseSemitone(DEFAULT_START_NOTE)!;
const DEFAULT_END_SEMITONE = parseSemitone(DEFAULT_END_NOTE)!;
const DEFAULT_RANGE = DEFAULT_END_SEMITONE - DEFAULT_START_SEMITONE;

@customElement("mq-piano")
export class MqPiano extends LitElement {
  @property({ attribute: "start-note" }) accessor startNote: string | undefined;
  @property({ attribute: "end-note" }) accessor endNote: string | undefined;
  @property() accessor mode: "accurate" | "centered" = "accurate";
  @property({ type: Boolean, attribute: "preserve-ratio" }) accessor preserveRatio: boolean = false;

  private _startSemitone = DEFAULT_START_SEMITONE;
  private _endSemitone = DEFAULT_END_SEMITONE;

  willUpdate() {
    let startSemitone = parseSemitone(this.startNote);
    let endSemitone = parseSemitone(this.endNote);

    if (this.startNote != null && startSemitone == null) {
      console.warn(`mq-piano: invalid start-note "${this.startNote}", ignored`);
    }
    if (this.endNote != null && endSemitone == null) {
      console.warn(`mq-piano: invalid end-note "${this.endNote}", ignored`);
    }

    if (startSemitone == null && endSemitone == null) {
      startSemitone = DEFAULT_START_SEMITONE;
      endSemitone = DEFAULT_END_SEMITONE;
    } else if (startSemitone == null) {
      startSemitone = endSemitone! - DEFAULT_RANGE;
    } else if (endSemitone == null) {
      endSemitone = startSemitone + DEFAULT_RANGE;
    }

    if (endSemitone! < startSemitone) {
      console.warn(`mq-piano: end-note before start-note, falling back to defaults`);
      startSemitone = DEFAULT_START_SEMITONE;
      endSemitone = DEFAULT_END_SEMITONE;
    }

    startSemitone = Math.max(0, startSemitone);
    if (isBlack(startSemitone)) startSemitone--;
    if (isBlack(endSemitone!)) endSemitone = endSemitone! + 1;

    this._startSemitone = startSemitone;
    this._endSemitone = endSemitone!;

    let whiteCount = 0;
    for (let s = startSemitone; s <= endSemitone!; s++) {
      if (NOTES_BY_SEMITONE[s % 12].type === "white") whiteCount++;
    }
    this.style.aspectRatio = this.preserveRatio ? `${whiteCount * 23.5} / 150` : "";
  }

  render() {
    const whiteLayer: TemplateResult[] = [];
    const blackLayer: TemplateResult[] = [];
    let prevWasWhite = false;

    // `_startSemitone` always lands on a white key (willUpdate adjusts it); the
    // `type === "white"` test is kept to narrow the union for the geometry access below.
    const startNote = NOTES_BY_SEMITONE[this._startSemitone % 12];
    if (startNote.type === "white" && this._startSemitone > 0 && isBlack(this._startSemitone - 1)) {
      const keyGeometry = this.mode === "centered" ? startNote.centered : startNote.accurate;
      blackLayer.push(html`<div style=${styleMap({ flex: keyGeometry.startGap })}></div>`);
    }

    for (let semitone = this._startSemitone; semitone <= this._endSemitone; semitone++) {
      const note = NOTES_BY_SEMITONE[semitone % 12];
      const octave = Math.floor(semitone / 12);

      if (note.type === "white") {
        if (prevWasWhite) {
          whiteLayer.push(this._borderTpl);
          blackLayer.push(this._borderTpl);
        }

        const keyGeometry = this.mode === "centered" ? note.centered : note.accurate;
        whiteLayer.push(this._renderKey(note, octave, keyGeometry));
        blackLayer.push(html`<div
          class="white-spacer"
          style=${styleMap({ "--back-width": keyGeometry.backWidth })}
        ></div>`);
        prevWasWhite = true;
      } else {
        whiteLayer.push(this._borderTpl);
        blackLayer.push(this._renderKey(note, octave));
        prevWasWhite = false;
      }
    }

    // Always a white key (see willUpdate); the `type === "white"` test narrows the union.
    const endNote = NOTES_BY_SEMITONE[this._endSemitone % 12];
    if (endNote.type === "white" && isBlack(this._endSemitone + 1)) {
      const keyGeometry = this.mode === "centered" ? endNote.centered : endNote.accurate;
      blackLayer.push(html`<div style=${styleMap({ flex: keyGeometry.endGap })}></div>`);
    }

    return html`
      <div class="layer layer-white">${whiteLayer}</div>
      <div class="layer layer-black">${blackLayer}</div>
    `;
  }

  private _renderKey(note: Note, octave: number, geometry?: WhiteKeyGeometry) {
    const style = geometry ? { "--front-width": geometry.frontWidth } : {};
    return html`
      <div
        part="key key-${note.type}"
        data-type="${note.type}"
        data-key="${note.names.join("-")}"
        style=${styleMap(style)}
      >
        ${note.names.map((alias) => html`<slot name="note-${alias}${octave}"></slot>`)}
      </div>
    `;
  }

  private _borderTpl = html`<div class="border"></div>`;

  static styles = css`
    :host {
      --border-color: var(--mq-piano-border-color, #000);
      --border-width: var(--mq-piano-border-width, 1px);
      border-color: var(--mq-piano-border-color-outer, var(--border-color));
      border-style: solid;
      border-width: var(--mq-piano-border-width-outer, var(--border-width));
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 2fr 1fr;
    }

    .layer {
      display: flex;
      grid-column: 1 / 2;
    }

    .layer-white {
      grid-row: 1 / 3;
    }

    .layer-black {
      grid-row: 1 / 2;
    }

    [data-type="white"] {
      background-color: #fff;
      flex: var(--front-width);
    }

    .white-spacer {
      flex: var(--back-width);
    }

    [data-type="black"] {
      background-color: #000;
      flex: 14;
    }

    .border {
      flex: 0 0 var(--mq-piano-border-width-inner, var(--border-width));
      background-color: var(--mq-piano-border-color-inner, var(--border-color));
    }

    .layer-black .border {
      visibility: hidden;
    }
  `;
}
