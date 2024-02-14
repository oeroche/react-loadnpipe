import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  publicDir: false,
  test: {
    include: ['**/*.test.ts?(x)', '**/*.spec.ts?(x)'],
    globals: true
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'react-loader-hooks',
      fileName: (format) => `react-loader-hooks.${format}.js`,
    },
    rollupOptions: {
      treeshake: true,
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
