import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Chord, Note } from "tonal";
import { assignOctaves, isBlackKey, noteToPianoKeysName } from "../utils.js";
import { pianoExportParts } from "../mq-piano/mq-piano.js";

/**
 * Part list for a pressed-key marker: `key-pressed` plus the same parts
 * mq-piano puts on the key it covers (category + pitch-class + absolute pitch,
 * both enharmonic spellings for black keys). Lets consumers target pressed keys
 * by combining `key-pressed` with any key part, e.g. `::part(key-white
 * key-pressed)` or `::part(note-c key-pressed)`.
 */
function pressedParts(note: string, black: boolean): string {
  const parts = ["key-pressed", "key", black ? "key-black" : "key-white"];
  const spellings = black ? [note, Note.enharmonic(note)] : [note];
  for (const spelling of spellings) {
    const match = spelling.match(/^([A-G][#b]?)(\d+)$/);
    if (match == null) continue;
    const pc = match[1].replace("#", "s").toLowerCase();
    parts.push(`note-${pc}`, `note-${pc}${match[2]}`);
  }
  return parts.join(" ");
}

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

@customElement("mq-piano-chord")
export class MqPianoChord extends LitElement {
  @property() accessor name: string = "";
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;
  @property({ reflect: true }) accessor mode: "accurate" | "centered" = "centered";

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
              part=${pressedParts(note, black)}
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
      display: flex;
      flex-direction: column;
      /* Lets consumers size labels/markers in cqi units, proportional to the
         keyboard, without knowing the actual key size. */
      container-type: inline-size;
    }

    .name {
      text-align: center;
      font-weight: bold;
      font-size: 1.2em;
      margin-bottom: 0.4em;
      font-family: system-ui, sans-serif;
    }

    /* Extensions/alterations raised as superscript; line-height:0 keeps them
       from inflating the heading's line box. */
    .name sup {
      font-size: 0.65em;
      vertical-align: 0.35em;
      line-height: 0;
    }

    mq-piano {
      flex: 1;
      min-height: 0;
    }

    mq-piano::part(key-white),
    mq-piano::part(key-black) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .fill {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .label {
      font-family: system-ui, sans-serif;
      font-size: 0.55em;
      font-weight: bold;
      padding-bottom: 0.5em;
    }

    .error {
      font-family: system-ui, sans-serif;
      font-style: italic;
      padding: 1em;
    }
  `;
}
