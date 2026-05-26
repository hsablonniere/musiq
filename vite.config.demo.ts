import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const componentDirs = readdirSync('src', { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith('mq-'));

const input: Record<string, string> = {
  main: resolve(__dirname, 'index.html'),
};

for (const dir of componentDirs) {
  input[dir.name] = resolve(__dirname, 'src', dir.name, `${dir.name}.html`);
}

export default defineConfig({
  base: '/musiq/',
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input,
    },
  },
});
