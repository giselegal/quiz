#!/bin/bash

# Script de otimização avançada para o componente QuizIntro
# Foco em melhorar LCP e evitar CLS

echo "Iniciando otimização profunda do componente QuizIntro..."

# Definir arquivo principal
FILE_PATH="/workspaces/quiz-sell-genius-66/src/components/QuizIntro.tsx"
BACKUP_PATH="${FILE_PATH}.advanced-backup"

# Criar backup
cp "$FILE_PATH" "$BACKUP_PATH"
echo "Backup criado em $BACKUP_PATH"

# 1. Aplicar otimizações de pré-renderização
echo "Aplicando otimizações de pré-renderização..."

# Gerar código otimizado para o hook usePreloadResources
cat > /tmp/preload-code.txt << 'EOF'
  // Hook personalizado para pré-carregamento de recursos críticos
  const usePreloadResources = () => {
    useEffect(() => {
      // Função para criar e adicionar link de preload
      const addPreloadLink = (href: string, as: string, type?: string, crossOrigin?: boolean) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        
        if (type) {
          link.type = type;
        }
        
        if (crossOrigin) {
          link.crossOrigin = '';
        }
        
        document.head.appendChild(link);
        return link;
      };
      
      // Prefetch do recurso principal logo no início
      const imgPreload = addPreloadLink(
        STATIC_INTRO_IMAGE_URLS.avif.large, 
        'image', 
        'image/avif'
      );
      imgPreload.setAttribute('fetchpriority', 'high');
      
      // Prefetch do recurso de logo
      const logoPreload = addPreloadLink(
        STATIC_LOGO_IMAGE_URLS.webp,
        'image',
        'image/webp'
      );
      
      // Preconnect com o domínio Cloudinary
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = 'https://res.cloudinary.com';
      preconnectLink.crossOrigin = '';
      document.head.appendChild(preconnectLink);
      
      // Limpeza ao desmontar
      return () => {
        [imgPreload, logoPreload, preconnectLink].forEach(el => {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
    }, []);
  };
EOF

# Localizar o local adequado para inserir o hook após as constantes
INSERT_POINT=$(grep -n "// --- Fim das otimizações de escopo do módulo ---" "$FILE_PATH" | cut -d':' -f1)
if [ -n "$INSERT_POINT" ]; then
  # Inserir o novo código após a linha encontrada
  sed -i "$((INSERT_POINT+1))r /tmp/preload-code.txt" "$FILE_PATH"
  echo "Hook de pré-carregamento inserido com sucesso."
else
  echo "Ponto de inserção não encontrado."
fi

# 2. Otimizar o imageLoaded flag para trabalhar com events
cat > /tmp/image-loaded-code.txt << 'EOF'
  // Função para controlar estados de carregamento e reportar métricas
  const handleMainImageLoad = () => {
    imageLoaded.current = true;
    
    // Registrar o tempo de carregamento como métrica de performance
    if (window.performance && window.performance.mark) {
      window.performance.mark('main-image-loaded');
      
      // Se tivermos uma marca de início, podemos medir o tempo de carregamento
      if (performance.getEntriesByName('quiz-intro-rendered').length > 0) {
        performance.measure(
          'main-image-load-time', 
          'quiz-intro-rendered', 
          'main-image-loaded'
        );
        
        const measureEntry = performance.getEntriesByName('main-image-load-time')[0];
        if (measureEntry && console) {
          console.log(`[Performance] Main image loaded in ${measureEntry.duration.toFixed(2)}ms`);
        }
      }
    }
  };
EOF

# Inserir após a definição de imageLoaded ref
REF_POINT=$(grep -n "imageLoaded = useRef<boolean>(false);" "$FILE_PATH" | cut -d':' -f1)
if [ -n "$REF_POINT" ]; then
  # Inserir o novo código após a linha encontrada
  sed -i "$((REF_POINT+1))r /tmp/image-loaded-code.txt" "$FILE_PATH"
  echo "Handler de carregamento de imagem otimizado inserido com sucesso."
else
  echo "Ponto de inserção para handler de imagem não encontrado."
fi

# 3. Adicionar marcação de performance no useEffect principal
cat > /tmp/perf-mark-code.txt << 'EOF'
      // Marcar o tempo de renderização para métricas
      if (window.performance && window.performance.mark) {
        window.performance.mark('quiz-intro-rendered');
      }
EOF

# Encontrar o primeiro useEffect
EFFECT_POINT=$(grep -n "useEffect(() => {" "$FILE_PATH" | head -1 | cut -d':' -f1)
if [ -n "$EFFECT_POINT" ]; then
  # Inserir dentro do useEffect, logo após a abertura
  sed -i "$((EFFECT_POINT+1))r /tmp/perf-mark-code.txt" "$FILE_PATH"
  echo "Marcação de performance inserida no useEffect principal."
else
  echo "Ponto de inserção para marcação de performance não encontrado."
fi

# 4. Otimizar os parâmetros da imagem principal para melhor qualidade/desempenho
echo "Ajustando parâmetros de qualidade para equilíbrio ideal..."

# Ajustar parâmetros AVIF
sed -i 's/tiny: buildTinyIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 200)/tiny: buildTinyIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 180)/' "$FILE_PATH"
sed -i 's/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 345, 75)/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 345, 70)/' "$FILE_PATH"
sed -i 's/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 400, 80)/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 400, 75)/' "$FILE_PATH"
sed -i 's/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 450, 85)/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 450, 80)/' "$FILE_PATH"

# 5. Otimizar o placeholder para carregamento mais rápido
echo "Otimizando o placeholder para carregamento mais rápido..."
sed -i 's/placeholder: `${INTRO_IMAGE_BASE_URL}f_webp,q_5,w_30,c_limit,e_blur:100\/${INTRO_IMAGE_ID}.webp`/placeholder: `${INTRO_IMAGE_BASE_URL}f_webp,q_10,w_20,c_limit,e_blur:80\/${INTRO_IMAGE_ID}.webp`/' "$FILE_PATH"

# 6. Chamar o hook de preload no componente
echo "Adicionando chamada para o hook de preload..."
COMPONENT_START=$(grep -n "export const QuizIntro: React.FC<QuizIntroProps> = ({" "$FILE_PATH" | cut -d':' -f1)
AFTER_CONST=$(grep -n "const \[nome, setNome\] = useState(''" "$FILE_PATH" | cut -d':' -f1)

if [ -n "$AFTER_CONST" ]; then
  # Adicionar chamada do hook após as declarações de estado
  echo "  // Pré-carregar recursos críticos para melhorar LCP" > /tmp/use-preload-call.txt
  echo "  usePreloadResources();" >> /tmp/use-preload-call.txt
  sed -i "$((AFTER_CONST+2))r /tmp/use-preload-call.txt" "$FILE_PATH"
  echo "Chamada do hook de preload adicionada com sucesso."
else
  echo "Ponto de inserção para chamada do hook não encontrado."
fi

# 7. Otimizar o atributo para img no JSX para melhorar desempenho
echo "Otimizando atributos de imagem..."

# Procurar pela tag de imagem principal e adicionar fetchpriority="high"
sed -i 's/<img\s\+src={isValidTinyBase64 ? tinyBase64 : STATIC_INTRO_IMAGE_URLS.placeholder}/<img fetchPriority="high" src={isValidTinyBase64 ? tinyBase64 : STATIC_INTRO_IMAGE_URLS.placeholder}/' "$FILE_PATH"

# Adicionar decoding="async" para otimização
sed -i 's/alt="Imagem Introdutória"/alt="Imagem Introdutória" decoding="async"/' "$FILE_PATH"

# 8. Otimizar o loading do logo
echo "Otimizando loading do logo..."
sed -i 's/<img\s\+src={STATIC_LOGO_IMAGE_URLS.webp}/<img loading="eager" fetchPriority="high" src={STATIC_LOGO_IMAGE_URLS.webp}/' "$FILE_PATH"

# Limpar arquivos temporários
rm -f /tmp/preload-code.txt /tmp/image-loaded-code.txt /tmp/perf-mark-code.txt /tmp/use-preload-call.txt

echo "Otimizações avançadas concluídas para o componente QuizIntro!"
echo "Estas otimizações devem melhorar significativamente LCP e prevenir CLS."
echo "Backup do arquivo original disponível em $BACKUP_PATH"
