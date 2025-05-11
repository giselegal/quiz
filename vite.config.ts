
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";
import imagemin from "vite-plugin-imagemin";
import { VitePWA } from "vite-plugin-pwa";
import lightningcss from 'lightningcss';

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
    // Otimização de imagens
    imagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      },
      webp: {
        quality: 80
      }
    }),
    // Configuração PWA para melhorar performance em visitas repetidas
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Quiz App',
        short_name: 'Quiz',
        theme_color: '#B89B7A',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          }
        ]
      }
    })
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
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Múltiplos passes para otimização mais agressiva
        ecma: 2020 // Usar sintaxe moderna para melhor compressão
      },
      mangle: {
        properties: {
          regex: /^_/  // Mangling de propriedades que começam com underscore
        }
      }
    },
    cssCodeSplit: true,
    cssMinify: 'lightningcss', // Usando lightningcss para melhor otimização CSS
    modulePreload: { polyfill: true },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'tailwindcss'],
          'vendor-utils': ['lodash', 'dayjs'],
          'ui-components': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            'clsx',
            'tailwind-merge'
          ],
          'quiz-intro': ['./src/components/QuizIntro.tsx'],
          'analytics': [
            './src/utils/analytics.ts',
            './src/utils/facebookPixel.ts'
          ]
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
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
    transformer: mode === 'production' ? 'lightningcss' : undefined,
    lightningcss: {
      targets: { chrome: 90, firefox: 90, safari: 14 },
      drafts: {
        nesting: true,
        customMedia: true,
      },
      minify: true,
    },
  }
}));
