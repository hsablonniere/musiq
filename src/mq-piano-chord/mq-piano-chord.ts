import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Chord } from "tonal";
import { assignOctaves, isBlackKey, keyMarkerParts, noteToPianoKeysName } from "../utils.js";
import { pianoExportParts } from "../mq-piano/mq-piano.js";

/**
 * Render a chord name with proper musical typography: real accidental glyphs
 * (`♯`/`♭`) and extensions/alterations raised as superscript. Uses tonal's
 * tokenizer to split root / quality / slash bass, so the slash of a slash chord
 * (`C/E`) stays inline while the `/` inside `6/9` rides up with the extension.
 */
function renderChordName(name: string) {
  const glyphs = (s: string) => s.replaceAll("#", "♯").replaceAll("b", "♭");
  const [tonic, quality, bass] = Chord.tokenize(name);
  // Split quality into alternating runs: extension chars (digits, accidentals,
  // `+`, `/`) vs quality text (`maj`, `m`, `sus`, `dim`, `aug`, `add`). No
  // accidental is ever a letter here, so every b/# inside quality is an
  // alteration to raise alongside its number.
  const segments = quality.match(/[\d#b/+]+|[^\d#b/+]+/g) ?? [];
  return html`${glyphs(tonic)}${segments.map((seg) =>
    /[\d#b/+]/.test(seg[0]) ? html`<sup>${glyphs(seg)}</sup>` : seg,
  )}${bass ? html`/${glyphs(bass)}` : nothing}`;
}

/**
 * Piano keyboard with chord visualization. Pass a chord name, get its notes
 * highlighted as pressed keys. Supports inversions via slash chords
 * (`C/E`, `C/G`) and optional note labels.
 *
 * Ships **unstyled** like `mq-piano`: keys and pressed markers carry no color of
 * their own. Theme via `::part()` — inactive keys with the parts exported from
 * the inner `mq-piano` (`key-white`, `key-black`, `note-c`, …), pressed keys by
 * combining `key-pressed` with any of those.
 *
 * @csspart name - The chord name heading above the keyboard.
 * @csspart label - A note-name label on a pressed key (only with `note-labels`).
 * @csspart error - The fallback shown for an unknown chord.
 * @csspart key - Every key (exported from the inner `mq-piano`).
 * @csspart key-white - White keys (exported from the inner `mq-piano`).
 * @csspart key-black - Black keys (exported from the inner `mq-piano`).
 * @csspart note-{name} - Keys by pitch-class, octave-agnostic (exported from the inner `mq-piano`).
 * @csspart note-{name}{octave} - A single key by absolute pitch (exported from the inner `mq-piano`).
 * @csspart key-pressed - The marker covering a key held by the chord; combine it with any key part, e.g. `::part(key-white key-pressed)`, `::part(note-c key-pressed)`.
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
@customElement("mq-piano-chord")
export class MqPianoChord extends LitElement {
  /** Chord name, e.g. `C`, `Ebm`, `F#maj7`, or a slash chord like `C/E`. */
  @property() accessor name: string = "";
  /** Show English note names (A–G) on the pressed keys. */
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;
  /** Forwarded to `mq-piano`; defaults to `accurate` for real piano geometry. */
  @property({ reflect: true }) accessor mode: "accurate" | "centered" = "accurate";

  render() {
    const info = Chord.get(this.name);
    if (info.empty || info.notes.length === 0) {
      return html`<div class="error" part="error">Unknown chord: ${this.name}</div>`;
    }

    const notes = assignOctaves(info.notes, 4);

    const rootOctave = 4;
    const startNoteForKeys = `C${rootOctave}`;
    const endNoteForKeys = `B${rootOctave + 1}`;

    return html`
      ${this.name
        ? html`<div class="name" part="name">${renderChordName(this.name)}</div>`
        : nothing}
      <mq-piano
        start-note=${startNoteForKeys}
        end-note=${endNoteForKeys}
        mode=${this.mode}
        exportparts=${pianoExportParts(startNoteForKeys, endNoteForKeys)}
      >
        ${notes.map((note) => {
          const black = isBlackKey(note);
          return html`
            <div
              slot="note-${noteToPianoKeysName(note)}"
              part=${keyMarkerParts("key-pressed", note, black)}
              class="fill"
            >
              ${this.noteLabels
                ? html`<span class="label" part="label"
                    >${note.replace(/\d+$/, "").replace("#", "♯").replace("b", "♭")}</span
                  >`
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

    /* Extensions/alterations raised as superscript; line-height:0 keeps them
       from inflating the heading's line box. This is structural to the musical
       typography, not theming — the heading's look is set via ::part(name). */
    .name sup {
      font-size: 0.65em;
      vertical-align: 0.35em;
      line-height: 0;
    }

    /* mq-piano fills the host width on its own (block-level) and derives its
       height from its locked aspect ratio — nothing to size here.
       Layout glue only (no theming): make each key a column so the slotted
       marker can stretch to fill it and bottom-align its label. */
    mq-piano::part(key-white),
    mq-piano::part(key-black) {
      display: flex;
      flex-direction: column;
    }

    /* The label ships unstyled — size/weight/color come from ::part(label),
       font-size inherited from the pressed marker (cqi). */
    .fill {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .error {
      font-style: italic;
      padding: 1em;
    }
  `;
}
