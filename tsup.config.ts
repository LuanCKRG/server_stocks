import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/**/*.ts'],
    outDir: 'src',
    splitting: true,
    target: 'es2020',
    format: 'esm',
    minify: true,
    treeshake: true,
    bundle: false,
    tsconfig: './tsconfig.json'
  }
]);