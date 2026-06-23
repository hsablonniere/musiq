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

/**
 * Fretboard with scale visualization. Pass a scale name and a tuning and every
 * scale note is mapped across the neck, with the tonic distinguished and
 * optional note-name or scale-degree labels. Supports any tonal scale (major,
 * minor, modes, pentatonic, blues, …) and custom tunings.
 *
 * Ships **unstyled** like `mq-fretboard`: neither the neck nor the scale markers
 * carry color of their own. Theme the neck through the inner `mq-fretboard`'s
 * `--mq-fretboard-*` custom properties, and the markers via `::part(marker)`
 * (every scale note) and `::part(marker-tonic)` (the tonic — it also carries
 * `marker`, so declare its rules after to win, source order decides).
 *
 * @csspart name - The scale name heading above the fretboard.
 * @csspart marker - A scale note.
 * @csspart marker-tonic - The tonic; it also carries `marker`, so `::part(marker-tonic)` singles out the root (declare after `marker` to win).
 * @csspart label - A note-name label on a marker (only with `note-labels`).
 * @csspart degree - A scale-degree number on a marker (only with `degree-labels`).
 * @csspart error - The fallback shown for an unknown scale.
 * @csspart fret-number - A fret-number label (exported from the inner `mq-fretboard`).
 *
 * @cssprop --mq-fretboard-neck-color - Fill of the neck background (consumed by the inner `mq-fretboard`).
 * @cssprop --mq-fretboard-nut-color - Color of the nut (consumed by the inner `mq-fretboard`).
 * @cssprop [--mq-fretboard-nut-width=3px] - Thickness of the nut (consumed by the inner `mq-fretboard`).
 * @cssprop [--mq-fretboard-nut-radius=0] - Corner radius of the nut (consumed by the inner `mq-fretboard`).
 * @cssprop --mq-fretboard-fret-color - Color of the fret wires (consumed by the inner `mq-fretboard`).
 * @cssprop --mq-fretboard-string-color - Color of the strings (consumed by the inner `mq-fretboard`).
 * @cssprop --mq-fretboard-inlay-color - Color of the inlay markers (consumed by the inner `mq-fretboard`).
 * @cssprop [--mq-fretboard-fret-width=1px] - Thickness of the fret wires (consumed by the inner `mq-fretboard`).
 * @cssprop [--mq-fretboard-string-width=1px] - Thickness of the strings (consumed by the inner `mq-fretboard`).
 */
@customElement("mq-fretboard-scale")
export class MqFretboardScale extends LitElement {
  /** Scale name, e.g. `C major`, `A minor pentatonic`, `D dorian`. */
  @property() accessor name: string = "";
  /** Open-string tuning, low to high, comma-separated (e.g. `E,A,D,G,B,E`). */
  @property() accessor tuning: string = "E,A,D,G,B,E";
  /** First fret shown; `0` or less includes the open strings. */
  @property({ type: Number, attribute: "start-fret" }) accessor startFret: number = 0;
  /** Last fret shown. */
  @property({ type: Number, attribute: "end-fret" }) accessor endFret: number = 12;
  /** Show English note names (A–G) on the markers. */
  @property({ type: Boolean, attribute: "note-labels" }) accessor noteLabels: boolean = false;
  /** Show scale-degree numbers (1–7) on the markers. */
  @property({ type: Boolean, attribute: "degree-labels" }) accessor degreeLabels: boolean = false;
  /** Mirror the diagram for left-handed players. */
  @property({ type: Boolean, reflect: true, attribute: "left-handed" })
  accessor leftHanded: boolean = false;
  /** Show inlay position markers on the neck (forwarded to `mq-fretboard`). */
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
      return html`<div class="error" part="error">Unknown scale: ${this.name}</div>`;
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
      font-style: italic;
      padding: 1em;
    }
  `;
}
