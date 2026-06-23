import { Note } from "tonal";

export function noteToPianoKeysName(note: string): string {
  return note.replace("#", "s");
}

export function isBlackKey(note: string): boolean {
  const pc = note.replace(/\d+$/, "");
  return pc.includes("#") || (pc.length > 1 && pc.includes("b"));
}

export function assignOctaves(pitchClasses: string[], startOctave: number): string[] {
  const notes: string[] = [];
  let octave = startOctave;
  let prevChroma = -1;

  for (const pc of pitchClasses) {
    const chroma = Note.chroma(pc);
    if (chroma == null) continue;
    if (prevChroma >= 0 && chroma <= prevChroma) {
      octave++;
    }
    notes.push(pc + octave);
    prevChroma = chroma;
  }

  return notes;
}

/**
 * Part list for a key-marker overlay slotted onto `mq-piano`: the given marker
 * idents plus the same parts mq-piano puts on the key it covers (`key`,
 * `key-white`/`key-black`, pitch-class + absolute pitch, both enharmonic
 * spellings for black keys). Lets consumers target marked keys by combining the
 * marker with any key part, e.g. `::part(key-white key-pressed)` or
 * `::part(note-c key-in-scale)`.
 *
 * `markers` is concatenated as-is, so pass one (`"key-pressed"`) or several
 * (`"key-in-scale key-tonic"`) idents. `note` must be a tonal note with octave
 * (sharps/flats only, never `s`).
 */
export function keyMarkerParts(markers: string, note: string, black: boolean): string {
  const parts = [markers, "key", black ? "key-black" : "key-white"];
  const spellings = black ? [note, Note.enharmonic(note)] : [note];
  for (const spelling of spellings) {
    const match = spelling.match(/^([A-G][#b]?)(\d+)$/);
    if (match == null) continue;
    const pc = match[1].replace("#", "s").toLowerCase();
    parts.push(`note-${pc}`, `note-${pc}${match[2]}`);
  }
  return parts.join(" ");
}
