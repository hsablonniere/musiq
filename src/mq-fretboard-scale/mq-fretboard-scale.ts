import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Note, Scale } from "tonal";
import "../mq-fretboard/mq-fretboard.js";

interface ScaleDot {
  string: number;
  fret: number;
  note: string;
  degree: number;
  isRoot: boolean;
}

@customElement("mq-fretboard-scale")
export class MqFretboardScale extends LitElement {
  @property() accessor scale: string = "";
  @property() accessor tuning: string = "E,A,D,G,B,E";
  @property({ type: Number, attribute: "start-fret" }) accessor startFret: number = 0;
  @property({ type: Number, attribute: "end-fret" }) accessor endFret: number = 12;
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;
  @property({ type: Boolean, attribute: "degree-labels" }) accessor degreeLabels: boolean = false;
  @property({ type: Boolean, reflect: true, attribute: "left-handed" })
  accessor leftHanded: boolean = false;
  @property({
    attribute: "inlays",
    converter: {
      fromAttribute: (value: string | null) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : null),
    },
  })
  accessor inlays: boolean = false;

  render() {
    const info = Scale.get(this.scale);
    if (info.empty || info.notes.length === 0) {
      return html`<div class="error">Unknown scale: ${this.scale}</div>`;
    }

    const scaleNotes = info.notes;
    const scaleChromas = scaleNotes.map((n) => Note.chroma(n)!);
    const rootChroma = scaleChromas[0];

    const tuningPCs = this.tuning
      .split(",")
      .map((s) => s.trim());
    const stringCount = tuningPCs.length;

    const fbStartFret = Math.max(1, this.startFret);
    const showOpen = this.startFret <= 0;

    const dots: ScaleDot[] = [];

    for (let s = 0; s < stringCount; s++) {
      const openChroma = Note.chroma(tuningPCs[s]);
      if (openChroma == null) continue;

      const fromFret = showOpen ? 0 : fbStartFret;
      for (let f = fromFret; f <= this.endFret; f++) {
        const noteChroma = (openChroma + f) % 12;
        const scaleIndex = scaleChromas.indexOf(noteChroma);
        if (scaleIndex >= 0) {
          dots.push({
            string: s + 1,
            fret: f,
            note: scaleNotes[scaleIndex],
            degree: scaleIndex + 1,
            isRoot: noteChroma === rootChroma,
          });
        }
      }
    }

    return html`
      ${this.scale ? html`<div class="title" part="title">${this.scale}</div>` : nothing}
      <mq-fretboard
        .strings=${stringCount}
        start-fret=${fbStartFret}
        end-fret=${this.endFret}
        ?left-handed=${this.leftHanded}
        fret-numbers="all"
        ?inlays=${this.inlays}
        exportparts="fret-number"
      >
        ${dots.map((d) => {
          const slotName = d.fret === 0 ? `s${d.string}-marker` : `s${d.string}-f${d.fret}`;
          return html`
            <div slot="${slotName}" class="dot${d.isRoot ? " root" : ""}" part="dot">
              ${this.noteLabels
                ? html`<span class="label">${d.note.replace("#", "♯").replace("b", "♭")}</span>`
                : nothing}
              ${this.degreeLabels ? html`<span class="degree">${d.degree}</span>` : nothing}
            </div>
          `;
        })}
      </mq-fretboard>
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

    mq-fretboard {
      flex: 1;
      min-height: 0;
    }

    .dot {
      width: 1.4em;
      height: 1.4em;
      border-radius: 50%;
      background: var(--mq-fretboard-scale-active-color, #2980b9);
      margin: 0.2em 0.4em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .dot.root {
      background: var(--mq-fretboard-scale-root-color, #c0392b);
    }

    .label {
      font-family: system-ui, sans-serif;
      font-size: 0.5em;
      font-weight: bold;
      color: #fff;
      line-height: 1;
    }

    .degree {
      font-family: system-ui, sans-serif;
      font-size: 0.4em;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1;
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `;
}
