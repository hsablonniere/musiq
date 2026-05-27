import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

const STANDARD_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
const DOUBLE_MARKERS = new Set([12, 24]);

@customElement("mq-fretboard")
export class MqFretboard extends LitElement {
  @property({ type: Number }) accessor strings: number = 6;
  @property({ type: Number, attribute: "start-fret" }) accessor startFret: number = 1;
  @property({ type: Number, attribute: "end-fret" }) accessor endFret: number = 12;
  @property({ reflect: true }) accessor orientation: "horizontal" | "vertical" = "horizontal";
  @property({ attribute: "fret-numbers" }) accessor fretNumbers: string = "";
  @property({
    attribute: "inlays",
    converter: {
      fromAttribute: (value: string | null) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : null),
    },
  })
  accessor inlays: boolean = false;
  @property({ type: Boolean, attribute: "full-neck" }) accessor fullNeck: boolean = false;
  @property({ type: Boolean, reflect: true, attribute: "left-handed" })
  accessor leftHanded: boolean = false;
  @property({ attribute: "extra-slots" }) accessor extraSlots: string = "";

  private _place(neckPos: string, stringPos: string): string {
    return this.orientation === "vertical"
      ? `grid-column: ${stringPos}; grid-row: ${neckPos}`
      : `grid-column: ${neckPos}; grid-row: ${stringPos}`;
  }

  render() {
    const fretCount = this.endFret - this.startFret + 1;
    const showNut = this.startFret === 1;
    const isV = this.orientation === "vertical";

    const neckTracks = ["auto", "var(--mq-fretboard-nut-width, 3px)"];
    for (let i = 0; i < fretCount; i++) neckTracks.push("minmax(1em, 1fr)", "auto");

    const so = isV ? 1 : 0;
    const stringTracks: string[] = [];
    if (isV) stringTracks.push("auto");
    for (let i = 0; i < this.strings; i++)
      stringTracks.push("minmax(0.5em, 1fr)", "auto", "minmax(0.5em, 1fr)");
    if (!isV) stringTracks.push("auto");

    const sc = (s: number) => so + (s - 1) * 3 + 2;
    const ss = (s: number) => `${so + (s - 1) * 3 + 1} / ${so + (s - 1) * 3 + 4}`;
    const fretWire = (f: number) => 2 + (f - this.startFret) * 2 + 2;
    const fretSpace = (f: number) => 2 + (f - this.startFret) * 2 + 1;
    const neckEnd = 3 + fretCount * 2;

    const fretSpan = this.fullNeck
      ? `${so + 1} / ${so + this.strings * 3 + 1}`
      : `${sc(1)} / ${sc(this.strings) + 1}`;

    const fnumPos = isV ? "1" : `${this.strings * 3 + 1}`;

    let numFrets: number[] = [];
    if (this.fretNumbers === "all") {
      for (let f = this.startFret; f <= this.endFret; f++) numFrets.push(f);
    } else if (this.fretNumbers) {
      numFrets = this.fretNumbers
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n >= this.startFret && n <= this.endFret);
    }

    const markers = this.inlays
      ? STANDARD_MARKERS.filter((f) => f >= this.startFret && f <= this.endFret)
      : [];

    const neckSpan = `${so + 1} / ${so + this.strings * 3 + 1}`;

    return html`
      <mq-fretboard-grid
        style="grid-template-columns: ${(isV ? stringTracks : neckTracks).join(
          " ",
        )}; grid-template-rows: ${(isV ? neckTracks : stringTracks).join(" ")};"
      >
        <mq-fretboard-neck
          style="${this._place(`2 / ${neckEnd}`, this.fullNeck ? neckSpan : fretSpan)}"
        ></mq-fretboard-neck>
        ${showNut
          ? html`<mq-fretboard-nut style="${this._place("2 / 3", fretSpan)}"></mq-fretboard-nut>`
          : html`<mq-fretboard-fret class="first-fret" style="${this._place("2 / 3", fretSpan)}"></mq-fretboard-fret>`}
        ${Array.from({ length: fretCount }, (_, i) => {
          const p = fretWire(this.startFret + i);
          return html`<mq-fretboard-fret style="${this._place(`${p} / ${p + 1}`, fretSpan)}"></mq-fretboard-fret>`;
        })}
        ${Array.from({ length: this.strings }, (_, i) => {
          const c = sc(i + 1);
          return html`<mq-fretboard-string
            style="${this._place(`3 / ${neckEnd}`, `${c} / ${c + 1}`)}"
          ></mq-fretboard-string>`;
        })}
        ${markers.map((f) => {
          const space = fretSpace(f);
          const np = `${space} / ${space + 1}`;
          if (DOUBLE_MARKERS.has(f)) {
            const half = Math.ceil(this.strings / 2);
            return html` <mq-fretboard-inlay
                style="${this._place(np, `${sc(1) - 1} / ${sc(half) + 2}`)}"
              ></mq-fretboard-inlay>
              <mq-fretboard-inlay
                style="${this._place(np, `${sc(half + 1) - 1} / ${sc(this.strings) + 2}`)}"
              ></mq-fretboard-inlay>`;
          }
          return html`<mq-fretboard-inlay
            style="${this._place(np, `${sc(1) - 1} / ${sc(this.strings) + 2}`)}"
          ></mq-fretboard-inlay>`;
        })}
        ${numFrets.map((f) => {
          const space = fretSpace(f);
          return html`<mq-fretboard-fret-number
            part="fret-number"
            style="${this._place(`${space} / ${space + 1}`, fnumPos)}"
          >
            ${f}
          </mq-fretboard-fret-number>`;
        })}
        ${Array.from({ length: this.strings }, (_, i) => {
          const s = i + 1;
          const span = ss(s);
          return html` <slot
              name="s${s}-marker"
              style="${this._place("1 / 2", span)}; place-self: center;"
            ></slot>
            ${Array.from({ length: fretCount }, (_, fi) => {
              const f = this.startFret + fi;
              const space = fretSpace(f);
              return html`<slot
                name="s${s}-f${f}"
                style="${this._place(`${space} / ${space + 1}`, span)}; place-self: center;"
              ></slot>`;
            })}`;
        })}
        ${this.extraSlots
          ? this.extraSlots.split(",").map((name) => {
              const trimmed = name.trim();
              const match = trimmed.match(/^s(\d+)-s(\d+)-f(\d+)$/);
              if (!match) return nothing;
              const from = parseInt(match[1], 10);
              const to = parseInt(match[2], 10);
              const fret = parseInt(match[3], 10);
              if (fret < this.startFret || fret > this.endFret) return nothing;
              const space = fretSpace(fret);
              const spanStart = so + (from - 1) * 3 + 1;
              const spanEnd = so + (to - 1) * 3 + 4;
              const stretch = isV
                ? "align-self: center; justify-self: stretch;"
                : "align-self: stretch; justify-self: center;";
              return html`<slot
                name="${trimmed}"
                style="${this._place(
                  `${space} / ${space + 1}`,
                  `${spanStart} / ${spanEnd}`,
                )}; display: grid; ${stretch}"
              ></slot>`;
            })
          : nothing}
      </mq-fretboard-grid>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    :host([orientation="vertical"]) {
      display: inline-block;
    }

    mq-fretboard-grid {
      display: grid;
    }

    :host([orientation="vertical"]) mq-fretboard-grid {
      display: inline-grid;
    }

    slot {
      display: block;
    }

    mq-fretboard-neck {
      background: var(--mq-fretboard-neck-color);
    }

    mq-fretboard-nut {
      background-color: var(--mq-fretboard-nut-color, #000);
      border-radius: var(--mq-fretboard-nut-radius, 0);
    }

    :host(:not([orientation="vertical"])) mq-fretboard-nut {
      width: var(--mq-fretboard-nut-width, 3px);
    }

    :host([orientation="vertical"]) mq-fretboard-nut {
      height: var(--mq-fretboard-nut-width, 3px);
    }

    mq-fretboard-fret {
      background-color: var(--mq-fretboard-fret-color, #000);
    }

    :host(:not([orientation="vertical"])) mq-fretboard-fret {
      width: var(--mq-fretboard-fret-width, 1px);
    }

    :host([orientation="vertical"]) mq-fretboard-fret {
      height: var(--mq-fretboard-fret-width, 1px);
    }

    :host(:not([orientation="vertical"])) .first-fret {
      justify-self: end;
      margin-left: calc(var(--mq-fretboard-nut-width, 3px) - var(--mq-fretboard-fret-width, 1px));
    }

    :host([orientation="vertical"]) .first-fret {
      align-self: end;
      margin-top: calc(var(--mq-fretboard-nut-width, 3px) - var(--mq-fretboard-fret-width, 1px));
    }

    mq-fretboard-string {
      background-color: var(--mq-fretboard-string-color, #000);
    }

    :host(:not([orientation="vertical"])) mq-fretboard-string {
      height: var(--mq-fretboard-string-width, 1px);
    }

    :host([orientation="vertical"]) mq-fretboard-string {
      width: var(--mq-fretboard-string-width, 1px);
    }

    mq-fretboard-inlay {
      background-color: var(--mq-fretboard-inlay-color, #000);
      width: var(--mq-fretboard-inlay-size, 6px);
      height: var(--mq-fretboard-inlay-size, 6px);
      border-radius: 50%;
      place-self: center;
    }

    mq-fretboard-fret-number {
      color: inherit;
      font-size: 0.75em;
      line-height: 1;
      place-self: center;
    }

    :host(:not([orientation="vertical"])) mq-fretboard-fret-number {
      margin-top: 0.3em;
    }

    :host([orientation="vertical"]) mq-fretboard-fret-number {
      margin-right: 0.3em;
    }

    :host([left-handed]) mq-fretboard-grid {
      transform: scaleX(-1);
    }

    :host(:not([orientation="vertical"])) slot[name$="-marker"] {
      margin-right: 0.3em;
    }

    :host(:not([orientation="vertical"])[left-handed]) slot[name$="-marker"] {
      margin-right: 0;
      margin-left: 0.3em;
    }

    :host([orientation="vertical"]) slot[name$="-marker"] {
      margin-bottom: 0.3em;
    }

    :host([left-handed]) slot,
    :host([left-handed]) .fret-number {
      transform: scaleX(-1);
    }
  `;
}
