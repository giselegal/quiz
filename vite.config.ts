import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: '.',
  base: './',
  
  server: {
    host: "::",
    port: 8080,
    // Configurações CORS e mime-types para desenvolvimento
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
    },
    fs: {
      allow: ['../']
    },
    allowedHosts: [
      "a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com"
    ]
  },
  
  plugins: [
    react(),
    componentTagger(),
    // Compressão GZIP
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Compressão Brotli
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    // Configurações para otimizar chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            'clsx',
            'tailwind-merge'
          ],
          'quiz-intro': [
            './src/components/QuizIntro.tsx'
          ],
          'analytics': [
            './src/utils/analytics.ts',
            './src/utils/facebookPixel.ts'
          ]
        },
        // Garantir que os assets sejam carregados corretamente para as rotas específicas
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Otimização: Coloca fontes e imagens em pastas separadas
          const fileName = assetInfo.name || '';
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(fileName)) {
            return 'assets/fonts/[name]-[hash].[ext]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(fileName)) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  
  css: {
    devSourcemap: mode === 'development',
  }
}));
