import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: true,
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  clean: true,
  // target: 'es2015',
  platform: 'node',
  external: ['axios'],
  bundle: true,
  outDir: 'dist',
  keepNames: true,
});
