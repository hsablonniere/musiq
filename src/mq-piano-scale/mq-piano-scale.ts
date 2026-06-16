import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Scale } from "tonal";
import { assignOctaves, isBlackKey, keyMarkerParts, noteToPianoKeysName } from "../utils.js";
import { pianoExportParts } from "../mq-piano/mq-piano.js";

/**
 * Piano keyboard with scale visualization. Pass a scale name, get its notes
 * highlighted across one octave, with the tonic repeated at the top. Supports
 * any tonal scale (major, minor, modes, pentatonic, blues, …) and optional
 * note-name or scale-degree labels.
 *
 * Ships **unstyled** like `mq-piano`: keys and scale markers carry no color of
 * their own. Theme via `::part()` — inactive keys with the parts exported from
 * the inner `mq-piano` (`key-white`, `key-black`, `note-c`, …), scale keys by
 * combining `key-in-scale` (and `key-tonic` for the root) with any of those.
 *
 * @csspart name - The scale name heading above the keyboard.
 * @csspart label - A note-name label on a scale key (only with `note-labels`).
 * @csspart degree - A scale-degree number on a scale key (only with `degree-labels`).
 * @csspart error - The fallback shown for an unknown scale.
 * @csspart key - Every key (exported from the inner `mq-piano`).
 * @csspart key-white - White keys (exported from the inner `mq-piano`).
 * @csspart key-black - Black keys (exported from the inner `mq-piano`).
 * @csspart note-{name} - Keys by pitch-class, octave-agnostic (exported from the inner `mq-piano`).
 * @csspart note-{name}{octave} - A single key by absolute pitch (exported from the inner `mq-piano`).
 * @csspart key-in-scale - The marker covering a key that belongs to the scale; combine it with any key part, e.g. `::part(key-white key-in-scale)`, `::part(note-c key-in-scale)`.
 * @csspart key-tonic - The marker covering the tonic; it also carries `key-in-scale`, so `::part(key-tonic)` singles out the root. Declare its rules after `key-in-scale` to win (::part adds no specificity, source order decides).
 *
 * @cssprop [--mq-piano-black-key-height=64%] - Black-key height as a percentage of the full key height (consumed by the inner `mq-piano`).
 * @cssprop [--mq-piano-border-color=transparent] - Base color for all borders (consumed by the inner `mq-piano`).
 * @cssprop [--mq-piano-border-width=1px] - Base width for all borders (consumed by the inner `mq-piano`).
 * @cssprop --mq-piano-border-color-outer - Color of the outer frame, falls back to `--mq-piano-border-color` (consumed by the inner `mq-piano`).
 * @cssprop --mq-piano-border-color-inner - Color of inter-key separators, falls back to `--mq-piano-border-color` (consumed by the inner `mq-piano`).
 * @cssprop --mq-piano-border-width-outer - Width of the outer frame, falls back to `--mq-piano-border-width` (consumed by the inner `mq-piano`).
 * @cssprop --mq-piano-border-width-inner - Width of inter-key separators, falls back to `--mq-piano-border-width` (consumed by the inner `mq-piano`).
 * @cssprop [--mq-piano-border-radius=0] - Corner radius of the outer frame (consumed by the inner `mq-piano`).
 */
@customElement("mq-piano-scale")
export class MqPianoScale extends LitElement {
  /** Scale name, e.g. `C major`, `A minor pentatonic`, `D dorian`. */
  @property() accessor name: string = "";
  /** Show English note names (A–G) on the scale keys. */
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;
  /** Show scale-degree numbers (1–7, the tonic repeats as 1) on the scale keys. */
  @property({ type: Boolean, attribute: "degree-labels" }) accessor degreeLabels: boolean = false;
  /** Forwarded to `mq-piano`; defaults to `accurate` for real piano geometry. */
  @property({ reflect: true }) accessor mode: "accurate" | "centered" = "accurate";

  render() {
    const info = Scale.get(this.name);
    if (info.empty || info.notes.length === 0) {
      return html`<div class="error" part="error">Unknown scale: ${this.name}</div>`;
    }

    const notesWithOctave = assignOctaves([...info.notes, info.notes[0]], 4);

    const rootOctave = 4;
    const startNoteForKeys = `C${rootOctave}`;
    const endNoteForKeys = `B${rootOctave + 1}`;

    return html`
      ${this.name ? html`<div class="name" part="name">${this.name}</div>` : nothing}
      <mq-piano
        start-note=${startNoteForKeys}
        end-note=${endNoteForKeys}
        mode=${this.mode}
        exportparts=${pianoExportParts(startNoteForKeys, endNoteForKeys)}
      >
        ${notesWithOctave.map((note, i) => {
          const isRoot = i === 0 || i === notesWithOctave.length - 1;
          const degree = i === notesWithOctave.length - 1 ? 1 : i + 1;
          const black = isBlackKey(note);
          const markers = isRoot ? "key-in-scale key-tonic" : "key-in-scale";
          return html`
            <div
              slot="note-${noteToPianoKeysName(note)}"
              part=${keyMarkerParts(markers, note, black)}
              class="fill"
            >
              ${this.noteLabels
                ? html`<span class="label" part="label"
                    >${note.replace(/\d+$/, "").replace("#", "♯").replace("b", "♭")}</span
                  >`
                : nothing}
              ${this.degreeLabels
                ? html`<span class="degree" part="degree">${degree}</span>`
                : nothing}
            </div>
          `;
        })}
      </mq-piano>
    `;
  }

  static styles = css`
    :host {
      display: block;
      /* Lets consumers size labels/markers in cqi units, proportional to the
         keyboard, without knowing the actual key size. */
      container-type: inline-size;
    }

    /* mq-piano fills the host width on its own (block-level) and derives its
       height from its locked aspect ratio — nothing to size here.
       Layout glue only (no theming): make each key a column so the slotted
       marker can stretch to fill it and bottom-align its labels. */
    mq-piano::part(key-white),
    mq-piano::part(key-black) {
      display: flex;
      flex-direction: column;
    }

    /* The marker ships unstyled — fill/size/color come from ::part(key-in-scale).
       Stack the optional note + degree labels at the bottom; font-size set on the
       marker (cqi via ::part) is inherited by both spans. */
    .fill {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .error {
      font-style: italic;
      padding: 1em;
    }
  `;
}
