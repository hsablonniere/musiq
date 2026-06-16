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
  @property() accessor name: string = "";
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
    const info = Scale.get(this.name);
    if (info.empty || info.notes.length === 0) {
      return html`<div class="error">Unknown scale: ${this.name}</div>`;
    }

    const scaleNotes = info.notes;
    const scaleChromas = scaleNotes.map((n) => Note.chroma(n)!);
    const rootChroma = scaleChromas[0];

    const tuningPCs = this.tuning.split(",").map((s) => s.trim());
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
      ${this.name ? html`<div class="name" part="name">${this.name}</div>` : nothing}
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
            <div
              slot="${slotName}"
              class="marker"
              part="${d.isRoot ? "marker marker-tonic" : "marker"}"
            >
              ${this.noteLabels
                ? html`<span class="label" part="label"
                    >${d.note.replace("#", "♯").replace("b", "♭")}</span
                  >`
                : nothing}
              ${this.degreeLabels
                ? html`<span class="degree" part="degree">${d.degree}</span>`
                : nothing}
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

    .name {
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

    /* Markers ship unstyled — size, shape and color come from ::part(marker)
       and ::part(marker-tonic). The tonic carries both parts, so ::part(marker)
       covers it too and ::part(marker-tonic) overrides (source order wins).
       Layout glue only: stack the optional note/degree labels. */
    .marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `;
}
