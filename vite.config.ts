import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      exclude: ['src/modules/questions/**', 'src/modules/installers/index.ts'],
    },
  },
});
