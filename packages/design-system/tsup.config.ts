import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'tokens/index': 'src/tokens/index.ts',
        'primitives/index': 'src/primitives/index.ts',
        'animations/index': 'src/animations/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'framer-motion'],
    outDir: 'dist',
});
