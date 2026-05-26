import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Chord } from "tonal";
import { assignOctaves, noteToPianoKeysName } from "../utils.js";
import "../mq-piano/mq-piano.js";

@customElement("mq-piano-chord")
export class MqPianoChord extends LitElement {
  @property() accessor chord: string = "";
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;

  render() {
    const info = Chord.get(this.chord);
    if (info.empty || info.notes.length === 0) {
      return html`<div class="error">Unknown chord: ${this.chord}</div>`;
    }

    const notes = assignOctaves(info.notes, 4);

    const rootOctave = 4;
    const startNoteForKeys = `C${rootOctave}`;
    const endNoteForKeys = `B${rootOctave + 1}`;

    return html`
      ${this.chord ? html`<div class="title" part="title">${this.chord}</div>` : nothing}
      <mq-piano
        start-note=${startNoteForKeys}
        end-note=${endNoteForKeys}
        mode="centered"
        exportparts="key, key-white, key-black"
      >
        ${notes.map(
          (note) => html`
            <div slot="note-${noteToPianoKeysName(note)}" class="active-fill">
              ${this.noteLabels
                ? html`<span class="label"
                    >${note.replace(/\d+$/, "").replace("#", "♯").replace("b", "♭")}</span
                  >`
                : nothing}
            </div>
          `,
        )}
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
      background: var(--mq-piano-chord-active-color, #4a90d9);
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .label {
      font-family: system-ui, sans-serif;
      font-size: 0.55em;
      font-weight: bold;
      padding-bottom: 0.5em;
      color: #fff;
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `;
}
