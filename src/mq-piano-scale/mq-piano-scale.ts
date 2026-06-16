import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Scale } from "tonal";
import { assignOctaves, isBlackKey, keyMarkerParts, noteToPianoKeysName } from "../utils.js";
import { pianoExportParts } from "../mq-piano/mq-piano.js";

@customElement("mq-piano-scale")
export class MqPianoScale extends LitElement {
  @property() accessor name: string = "";
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;
  @property({ type: Boolean, attribute: "degree-labels" }) accessor degreeLabels: boolean = false;
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
