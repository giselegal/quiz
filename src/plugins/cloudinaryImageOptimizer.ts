
import { Plugin } from 'vite';

/**
 * Plugin Vite para otimizar imagens do Cloudinary durante o build
 * Processa URLs de imagens do Cloudinary em arquivos HTML, CSS e JS
 * para substituir parâmetros de baixa qualidade por alta qualidade
 */
export default function cloudinaryImageOptimizer(): Plugin {
  return {
    name: 'cloudinary-image-optimizer',
    
    // Aplicar transformações durante o build
    transform(code, id) {
      // Processar apenas arquivos relevantes
      if (/\.(jsx?|tsx?|vue|svelte|html|css)$/.test(id)) {
        // Regex para encontrar URLs do Cloudinary
        const cloudinaryUrlRegex = /https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/([^"']+)/g;
        
        // Função para otimizar URLs encontradas
        const optimizedCode = code.replace(cloudinaryUrlRegex, (match, params) => {
          // Verificar se já contém parâmetros de qualidade média-alta
          if (typeof params === 'string' && params.includes('q_70') && params.includes('e_sharpen:40')) {
            return match;
          }
          
          // Remover parâmetros de blur e baixa qualidade
          if (typeof params === 'string') {
            let optimizedParams = params
              .replace(/,e_blur:[0-9]+/g, '')
              .replace(/e_blur:[0-9]+,/g, '')
              .replace(/e_blur:[0-9]+/g, '')
              .replace(/q_[0-9]+/g, 'q_70')
              .replace(/w_20/g, 'w_auto');
            
            // Se não houver transformações, adicionar parâmetros padrão
            const baseUrl = match.split('/upload/')[0];
            return `${baseUrl}/upload/f_auto,q_70,dpr_1.0,e_sharpen:40/${optimizedParams}`;
          }
          
          return match;
        });
        
        return optimizedCode;
      }
      
      return null;
    },
    
    // Configurações para o servidor de desenvolvimento
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          // Capturar respostas para injetar script de correção em runtime
          const originalSetHeader = res.setHeader;
          
          res.setHeader = function(name, value) {
            if (name === 'Content-Type' && typeof value === 'string' && value.includes('text/html')) {
              // Vamos capturar a saída HTML para injetar nosso script
              const originalWrite = res.write;
              const originalEnd = res.end;
              const chunks: Buffer[] = [];
              
              // @ts-ignore - Isso é necessário pois estamos fazendo um monkey patch
              res.write = function(chunk: any) {
                chunks.push(Buffer.from(chunk));
                return true;
              };
              
              // @ts-ignore - Isso é necessário pois estamos fazendo um monkey patch
              res.end = function(chunk?: any) {
                if (chunk) {
                  chunks.push(Buffer.from(chunk));
                }
                
                let html = Buffer.concat(chunks).toString('utf8');
                
                // Injetar script que corrige imagens em runtime
                const injectScript = `
                  <script>
                    // Fix blurry images at runtime
                    (function() {
                      function fixCloudinaryImages() {
                        document.querySelectorAll('img[src*="cloudinary.com"]').forEach(img => {
                          const src = img.src;
                          if (src.includes('e_blur') || src.includes('q_70') || src.includes('q_70')) {
                            const urlParts = src.split('/upload/');
                            if (urlParts.length === 2) {
                              const baseUrl = urlParts[0];
                              const pathPart = urlParts[1]
                                .replace(/,e_blur:[0-9]+/g, '')
                                .replace(/e_blur:[0-9]+,/g, '')
                                .replace(/e_blur:[0-9]+/g, '')
                                .replace(/q_[0-9]+/g, 'q_70');
                              
                              img.src = \`\${baseUrl}/upload/f_auto,q_70,dpr_1.0,e_sharpen:40/\${pathPart}\`;
                              img.style.imageRendering = 'crisp-edges';
                            }
                          }
                        });
                      }
                      
                      // Executar no carregamento e após mudanças no DOM
                      if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', fixCloudinaryImages);
                      } else {
                        fixCloudinaryImages();
                      }
                      
                      // Observar mudanças no DOM
                      const observer = new MutationObserver(mutations => {
                        let needsFix = false;
                        mutations.forEach(mutation => {
                          if (mutation.type === 'childList' || 
                              (mutation.type === 'attributes' && mutation.attributeName === 'src')) {
                            needsFix = true;
                          }
                        });
                        
                        if (needsFix) fixCloudinaryImages();
                      });
                      
                      observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['src']
                      });
                    })();
                  </script>
                `;
                
                // Injetar antes do </body>
                html = html.replace('</body>', `${injectScript}</body>`);
                
                originalWrite.call(res, html);
                originalEnd.call(res);
              };
            }
            
            return originalSetHeader.call(res, name, value);
          };
          
          next();
        });
      };
    },
    
    // Processar HTML final no build
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'link',
            attrs: {
              rel: 'preconnect',
              href: 'https://res.cloudinary.com',
              crossorigin: 'anonymous'
            },
            injectTo: 'head'
          },
          {
            tag: 'style',
            attrs: { type: 'text/css' },
            children: `
              img {
                image-rendering: crisp-edges;
                filter: none;
              }
              .quiz-intro-image {
                image-rendering: crisp-edges !important;
                filter: none !important;
              }
            `,
            injectTo: 'head'
          }
        ]
      };
    }
  };
}
