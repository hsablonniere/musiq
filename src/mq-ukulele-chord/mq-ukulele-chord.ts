import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../mq-fretboard-chord/mq-fretboard-chord.js";

@customElement("mq-ukulele-chord")
export class MqUkuleleChord extends LitElement {
  @property() accessor chord: string = "";
  @property({ type: Number }) accessor position: number = 0;
  @property({ type: Boolean, reflect: true, attribute: "left-handed" })
  accessor leftHanded: boolean = false;
  @property({ type: Boolean, attribute: "finger-labels" }) accessor fingerLabels: boolean = false;

  render() {
    return html`
      <mq-fretboard-chord
        instrument="ukulele"
        chord=${this.chord}
        position=${this.position}
        ?left-handed=${this.leftHanded}
        ?finger-labels=${this.fingerLabels}
        exportparts="title,marker,dot,barre,fret-number"
      ></mq-fretboard-chord>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    mq-fretboard-chord {
      flex: 1;
    }
  `;
}
