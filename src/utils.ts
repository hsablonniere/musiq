import { Note } from "tonal";

export function noteToPianoKeysName(note: string): string {
  return note.replace("#", "s");
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
