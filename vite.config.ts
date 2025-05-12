
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Wrapper function for cloudinaryImageOptimizer to make it compatible with Vite plugin API
  const cloudinaryImageOptimizerPlugin = (): Plugin => {
    return {
      name: 'cloudinary-image-optimizer',
      configureServer(server) {
        // Dynamically import the middleware to avoid TypeScript errors
        import('./src/plugins/cloudinaryImageOptimizer').then(module => {
          const cloudinaryImageOptimizer = module.default;
          server.middlewares.use(cloudinaryImageOptimizer({
            apiKey: process.env.CLOUDINARY_API_KEY || '',
            apiSecret: process.env.CLOUDINARY_API_SECRET || '',
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || ''
          }));
        }).catch(err => {
          console.error('Failed to load cloudinaryImageOptimizer:', err);
        });
      }
    };
  };

  return {
    root: '.',
    base: '/', // Garantir que o site seja servido na raiz do domínio
    
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
      cloudinaryImageOptimizerPlugin(),
      
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
          drop_console: process.env.NODE_ENV === 'production' ? true : false,
          drop_debugger: true,
          pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug'] : []
        }
      },
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
    }
  };
});
