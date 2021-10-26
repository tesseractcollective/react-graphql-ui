import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index'),
      name: 'react-graphql-ui',
      fileName: (format) => `react-graphql-ui.${format}.js`,
    },
    sourcemap: 'inline',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'urql', 'primereact', 'react-transition-group', 'wonka', '@fullcalendar/core', 'quill'],
      output: {
        globals: {
          react: 'React',
          urql: 'urql',
          'react-loading': 'ReactLoading',
          'react-dom': 'ReactDom',
          'react-transition-group': 'ReactTransitionGroup',
        },
      },
    },
  },
});
