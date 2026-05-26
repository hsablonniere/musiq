import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Scale } from "tonal";
import { assignOctaves, noteToPianoKeysName } from "../utils.js";
import "../mq-piano/mq-piano.js";

function isBlackKey(note: string): boolean {
  const pc = note.replace(/\d+$/, "");
  return pc.includes("#") || (pc.length > 1 && pc.includes("b"));
}

@customElement("mq-piano-scale")
export class MqPianoScale extends LitElement {
  @property() accessor scale: string = "";
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;
  @property({ type: Boolean, attribute: "degree-labels" }) accessor degreeLabels: boolean = false;

  render() {
    const info = Scale.get(this.scale);
    if (info.empty || info.notes.length === 0) {
      return html`<div class="error">Unknown scale: ${this.scale}</div>`;
    }

    const notesWithOctave = assignOctaves([...info.notes, info.notes[0]], 4);

    const rootOctave = 4;
    const startNoteForKeys = `C${rootOctave}`;
    const endNoteForKeys = `B${rootOctave + 1}`;

    return html`
      ${this.scale ? html`<div class="title" part="title">${this.scale}</div>` : nothing}
      <mq-piano
        start-note=${startNoteForKeys}
        end-note=${endNoteForKeys}
        mode="centered"
        exportparts="key, key-white, key-black"
      >
        ${notesWithOctave.map((note, i) => {
          const isRoot = i === 0 || i === notesWithOctave.length - 1;
          const degree = i === notesWithOctave.length - 1 ? 1 : i + 1;
          const black = isBlackKey(note);
          return html`
            <div
              slot="note-${noteToPianoKeysName(note)}"
              class="active-fill${isRoot ? " root" : ""}${black ? " black" : ""}"
            >
              ${this.noteLabels
                ? html`<span class="label"
                    >${note.replace(/\d+$/, "").replace("#", "♯").replace("b", "♭")}</span
                  >`
                : nothing}
              ${this.degreeLabels ? html`<span class="degree">${degree}</span>` : nothing}
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
    }

    .title {
      text-align: center;
      font-weight: bold;
      font-size: 1.2em;
      margin-bottom: 0.4em;
      font-family: system-ui, sans-serif;
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

    .active-fill {
      width: 100%;
      height: 100%;
      background: var(--mq-piano-scale-active-color, #27ae60);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .active-fill.root {
      background: var(--mq-piano-scale-root-color, var(--mq-piano-scale-active-color, #1e8449));
    }

    .active-fill.black {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      box-sizing: border-box;
    }

    .label {
      font-family: system-ui, sans-serif;
      font-size: 0.55em;
      font-weight: bold;
      padding-bottom: 0.2em;
      color: #fff;
    }

    .degree {
      font-family: system-ui, sans-serif;
      font-size: 0.45em;
      padding-bottom: 0.4em;
      color: rgba(255, 255, 255, 0.8);
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `;
}
