import { css, html, LitElement } from "lit";
import type { PropertyValues, TemplateResult } from "lit";
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

/**
 * Parse a scientific-pitch note name into an absolute semitone index
 * (`C0` = 0, each octave = 12 semitones).
 *
 * Expected format: pitch class `A`–`G` (uppercase only), optional accidental `s` (sharp ♯) or
 * `b` (flat ♭), then a non-negative octave. No `#` (use `s`), no double
 * accidentals, no negative octaves.
 *
 * @example
 * parseSemitone("C0")      // => 0
 * parseSemitone("C3")      // => 36
 * parseSemitone("Fs4")     // => 54  (F♯, same as "Gb4")
 * parseSemitone("Eb3")     // => 39
 * parseSemitone("H3")      // => null (invalid pitch class)
 * parseSemitone("C#3")     // => null (use "Cs3")
 * parseSemitone(undefined) // => null
 *
 * @returns the semitone index, or `null` if `note` is nullish or malformed.
 */
function parseSemitone(note: string | undefined): number | null {
  if (note == null) return null;
  const groups = note.match(/^(?<note>[A-G][sb]?)(?<octave>\d+)$/)?.groups;
  if (groups == null) return null;
  const base = SEMITONE_BY_NOTES[groups.note];
  if (base == null) return null;
  return parseInt(groups.octave, 10) * 12 + base;
}

function isBlack(semitone: number): boolean {
  return NOTES_BY_SEMITONE[semitone % 12].type === "black";
}

const DEFAULT_START_NOTE = "C3";
const DEFAULT_END_NOTE = "E4";
const DEFAULT_START_SEMITONE = parseSemitone(DEFAULT_START_NOTE)!;
const DEFAULT_END_SEMITONE = parseSemitone(DEFAULT_END_NOTE)!;
const DEFAULT_RANGE = DEFAULT_END_SEMITONE - DEFAULT_START_SEMITONE;

// Hard cap on the keyboard span (10 octaves). Beyond this, rendering that many
// keys is almost certainly a mistake (a real piano spans ~7.25 octaves).
const MAX_RANGE = 120;

// Real piano proportions in millimeters, used to lock the element's aspect
// ratio: one white key is 23.5mm wide, the keyboard is 150mm deep.
const WHITE_KEY_WIDTH_MM = 23.5;
const KEYBOARD_DEPTH_MM = 150;

/**
 * Piano keyboard with realistic key geometry. Configurable range, `accurate`
 * or `centered` black key positioning, always locked to real piano
 * proportions. Ships **unstyled** — fully themeable via `::part()` and CSS
 * custom properties. Named slots for per-key annotations.
 *
 * Keys are correctly positioned but have no color by default. Apply appearance
 * via `::part()` and CSS custom properties.
 *
 * The component is a block whose aspect ratio always matches real piano
 * proportions. Set `width` and/or `height` on the element to size it; if only
 * one dimension is constrained, the other follows the ratio.
 *
 * @slot note-{name}{octave} - Per-note content, e.g. `note-C3`, `note-Fs4`, `note-Db3`. Black keys expose both enharmonic names; use `s` for sharp (♯).
 *
 * @csspart key - Every key (white and black).
 * @csspart key-white - White keys only.
 * @csspart key-black - Black keys only.
 * @csspart note-{name} - All keys of a pitch-class (octave-agnostic), e.g. `note-c`, `note-fs`. Black keys expose both enharmonics: `note-cs`/`note-db`, `note-ds`/`note-eb`, `note-fs`/`note-gb`, `note-gs`/`note-ab`, `note-as`/`note-bb`. Use `s` for sharp (♯).
 * @csspart note-{name}{octave} - A single key by absolute pitch, e.g. `note-c3`, `note-fs4`, `note-db3`.
 *
 * @cssprop [--mq-piano-black-key-height=64%] - Black-key height as a percentage of the full key height: `100%` spans the whole keyboard, `0%` hides them. Defaults to real piano proportions.
 * @cssprop [--mq-piano-border-color=transparent] - Base color for all borders (outer frame + inner separators).
 * @cssprop [--mq-piano-border-width=1px] - Base width for all borders.
 * @cssprop --mq-piano-border-color-outer - Color of the outer frame (falls back to `--mq-piano-border-color`).
 * @cssprop --mq-piano-border-color-inner - Color of inter-key separators (falls back to `--mq-piano-border-color`).
 * @cssprop --mq-piano-border-width-outer - Width of the outer frame (falls back to `--mq-piano-border-width`).
 * @cssprop --mq-piano-border-width-inner - Width of inter-key separators (falls back to `--mq-piano-border-width`).
 * @cssprop [--mq-piano-border-radius=0] - Corner radius of the outer frame; the keyboard is always clipped to it (`overflow: clip`), so the corner keys follow the rounding.
 */
@customElement("mq-piano")
export class MqPiano extends LitElement {
  @property({ attribute: "start-note" }) accessor startNote: string | undefined;
  @property({ attribute: "end-note" }) accessor endNote: string | undefined;
  @property({ reflect: true }) accessor mode: "accurate" | "centered" = "accurate";

  private _startSemitone = DEFAULT_START_SEMITONE;
  private _endSemitone = DEFAULT_END_SEMITONE;

  willUpdate(changed: PropertyValues) {
    if (changed.has("mode") && this.mode !== "accurate" && this.mode !== "centered") {
      console.warn(`mq-piano: invalid mode "${this.mode}", falling back to "accurate"`);
      this.mode = "accurate";
    }

    // Only the note range drives the geometry; skip the recompute on unrelated
    // updates (e.g. a `mode` change), but always run on the first update.
    if (this.hasUpdated && !changed.has("startNote") && !changed.has("endNote")) return;

    const parsedStart = parseSemitone(this.startNote);
    const parsedEnd = parseSemitone(this.endNote);

    if (this.startNote != null && parsedStart == null) {
      console.warn(`mq-piano: invalid start-note "${this.startNote}", ignored`);
    }
    if (this.endNote != null && parsedEnd == null) {
      console.warn(`mq-piano: invalid end-note "${this.endNote}", ignored`);
    }

    // Resolve both ends, deriving the missing one from the other (or defaults).
    let start =
      parsedStart ?? (parsedEnd != null ? parsedEnd - DEFAULT_RANGE : DEFAULT_START_SEMITONE);
    let end = parsedEnd ?? start + DEFAULT_RANGE;

    if (end < start) {
      console.warn(`mq-piano: end-note before start-note, falling back to defaults`);
      start = DEFAULT_START_SEMITONE;
      end = DEFAULT_END_SEMITONE;
    }

    start = Math.max(0, start);
    if (isBlack(start)) start--;
    if (isBlack(end)) end++;

    // Cap after the white-key adjustments above, so the rendered span never
    // exceeds MAX_RANGE. Clamp `end` back to a white key without re-widening.
    if (end - start > MAX_RANGE) {
      console.warn(`mq-piano: range exceeds ${MAX_RANGE / 12} octaves, clamping end-note`);
      end = start + MAX_RANGE;
      if (isBlack(end)) end--;
    }

    this._startSemitone = start;
    this._endSemitone = end;

    let whiteCount = 0;
    for (let s = start; s <= end; s++) {
      if (NOTES_BY_SEMITONE[s % 12].type === "white") whiteCount++;
    }
    this.style.aspectRatio = `${whiteCount * WHITE_KEY_WIDTH_MM} / ${KEYBOARD_DEPTH_MM}`;
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
    const notesClassParts = note.names
      .flatMap((noteName) => {
        const name = noteName.toLowerCase();
        return [`note-${name}`, `note-${name}${octave}`];
      })
      .join(" ");
    return html`
      <div
        part="key key-${note.type} ${notesClassParts}"
        data-type="${note.type}"
        style=${styleMap(style)}
      >
        ${note.names.map((alias) => html`<slot name="note-${alias}${octave}"></slot>`)}
      </div>
    `;
  }

  private _borderTpl = html`<div class="border"></div>`;

  static styles = css`
    :host {
      --border-color: var(--mq-piano-border-color, transparent);
      --border-width: var(--mq-piano-border-width, 1px);
      border-color: var(--mq-piano-border-color-outer, var(--border-color));
      border-style: solid;
      border-width: var(--mq-piano-border-width-outer, var(--border-width));
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: var(--mq-piano-black-key-height, 64%) 1fr;
      border-radius: var(--mq-piano-border-radius, 0);
      /* Clip the keys to the (optionally rounded) frame. Neutral at radius 0
         since the keys already fill the host; only visible once rounded. */
      overflow: clip;
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
      flex: var(--front-width);
    }

    .white-spacer {
      flex: var(--back-width);
    }

    [data-type="black"] {
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
