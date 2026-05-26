import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    target: 'es2022',
  },
  build: {
    target: 'esnext',
    lib: {
      entry: {
        'index': 'src/index.ts',
        'mq-piano/mq-piano': 'src/mq-piano/mq-piano.ts',
        'mq-piano-chord/mq-piano-chord': 'src/mq-piano-chord/mq-piano-chord.ts',
        'mq-piano-scale/mq-piano-scale': 'src/mq-piano-scale/mq-piano-scale.ts',
        'mq-fretboard/mq-fretboard': 'src/mq-fretboard/mq-fretboard.ts',
        'mq-fretboard-chord/mq-fretboard-chord': 'src/mq-fretboard-chord/mq-fretboard-chord.ts',
        'mq-fretboard-scale/mq-fretboard-scale': 'src/mq-fretboard-scale/mq-fretboard-scale.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^lit/, "tonal", /^@tombatossals/],
    },
  },
});
