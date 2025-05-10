#!/bin/bash

# Script para otimizar o desempenho do QuizIntro de forma eficaz

echo "Otimizando o desempenho do QuizIntro com estratégia baseada em dados..."

FILE_PATH="/workspaces/quiz-sell-genius-66/src/components/QuizIntro.tsx"
BACKUP_PATH="${FILE_PATH}.performance-backup"

# Criar backup
cp "$FILE_PATH" "$BACKUP_PATH"
echo "Backup criado em $BACKUP_PATH"

# 1. Ajustar configurações de imagem usando qualidades mais balanceadas
# Avif - Melhor equilíbrio entre tamanho e qualidade
perl -i -pe "s/small: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 300, 60\)/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 345, 75)/" "$FILE_PATH"
perl -i -pe "s/medium: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 350, 65\)/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 400, 80)/" "$FILE_PATH"
perl -i -pe "s/large: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 400, 70\)/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 450, 85)/" "$FILE_PATH"

# WebP - Melhorar qualidade para evitar recarregamentos
perl -i -pe "s/small: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 300, 55\)/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 345, 70)/" "$FILE_PATH"
perl -i -pe "s/medium: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 350, 60\)/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 400, 75)/" "$FILE_PATH"
perl -i -pe "s/large: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 400, 65\)/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 450, 80)/" "$FILE_PATH"

# PNG - Melhorar a qualidade do fallback para evitar swap
perl -i -pe 's/png: `\${INTRO_IMAGE_BASE_URL}f_png,q_60,w_300,c_limit,fl_progressive\/\${INTRO_IMAGE_ID}.png`/png: `${INTRO_IMAGE_BASE_URL}f_png,q_75,w_345,c_limit,fl_progressive\/${INTRO_IMAGE_ID}.png`/' "$FILE_PATH"

# 2. Ajustar a função buildTinyIntroImageUrl para melhor qualidade nos placeholders
perl -i -pe "s/return `\${baseUrl}f_\${format},q_50,w_\${width},c_limit,dpr_1.0\/\${imageId}.\${format}`;/return `\${baseUrl}f_\${format},q_60,w_\${width},c_limit,dpr_1.0\/\${imageId}.\${format}`;/" "$FILE_PATH"

# 3. Otimizar o placeholder para ser menor mas mais nítido
perl -i -pe 's/placeholder: `\${INTRO_IMAGE_BASE_URL}f_webp,q_1,w_20,c_limit,e_blur:200\/\${INTRO_IMAGE_ID}.webp`/placeholder: `${INTRO_IMAGE_BASE_URL}f_webp,q_5,w_30,c_limit,e_blur:100\/${INTRO_IMAGE_ID}.webp`/' "$FILE_PATH"

# 4. Restaurar tamanhos de contêiner adequados para evitar layout shifts
perl -i -pe 's/className="w-full max-w-\[250px\] sm:max-w-\[300px\] md:max-w-xs/className="w-full max-w-\[300px\] sm:max-w-\[345px\] md:max-w-sm/' "$FILE_PATH"

# 5. Ajustar tamanho da imagem fallback
perl -i -pe 's/width=\{300\}/width={345}/' "$FILE_PATH"

# 6. Otimizar o useEffect para carregar base64 - MAIS IMPORTANTE
cat > temp_effect.txt << 'EOF'
  // Efeito para carregar imagem base64 - OTIMIZADO
  useEffect(() => {
    // Carrega a versão mais leve possível da imagem como base64 para exibição instantânea
    const loadTinyBase64 = async () => {
      try {
        // Evita recarregamentos e usa cache quando possível
        if (!tinyBase64 && !imageLoaded.current) {
          // Verifica se já existe no sessionStorage para evitar refetch
          const cachedImage = sessionStorage.getItem('quiz_intro_tiny_base64');
          if (cachedImage) {
            setTinyBase64(cachedImage);
          } else {
            const base64Data = await loadTinyImageAsBase64(STATIC_INTRO_IMAGE_URLS.placeholder);
            if (base64Data) {
              setTinyBase64(base64Data);
              // Cache para evitar refetches na mesma sessão
              try {
                sessionStorage.setItem('quiz_intro_tiny_base64', base64Data);
              } catch (e) {
                // Ignora erros de storage (limite excedido, etc)
              }
            }
          }
        }
      } catch (error) {
        console.error('[QuizIntro] Erro ao carregar imagem tiny:', error);
      }
    };
    
    loadTinyBase64();
  }, []); // Dependências vazias para executar apenas na montagem
EOF

# Substituir o useEffect do base64
# Encontra o início do useEffect
START_LINE=$(grep -n "useEffect(() => {" "$FILE_PATH" | grep -A1 "loadTinyBase64" | head -1 | cut -d':' -f1)
if [ -n "$START_LINE" ]; then
  # Encontra o final (linha com "}); // Alterado para")
  END_LINE=$(tail -n +$START_LINE "$FILE_PATH" | grep -n "}); // Alterado para" | head -1 | cut -d':' -f1)
  if [ -n "$END_LINE" ]; then
    END_LINE=$((START_LINE + END_LINE - 1))
    # Remove as linhas do useEffect original
    sed -i "${START_LINE},${END_LINE}d" "$FILE_PATH"
    # Insere o novo useEffect otimizado
    sed -i "${START_LINE}r temp_effect.txt" "$FILE_PATH"
    echo "useEffect para base64 otimizado com sucesso!"
  fi
fi

rm temp_effect.txt

# 7. Otimizar o useEffect para preload de recursos - para não bloquear LCP
cat > temp_preload_effect.txt << 'EOF'
  // Pré-carregamento para LCP com estratégia otimizada - MELHORADO
  useEffect(() => {
    // Preconnect para o domínio Cloudinary para acelerar conexões futuras
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://res.cloudinary.com';
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);

    // DNS Prefetch para melhorar resolução de nome
    const dnsPrefetchLink = document.createElement('link');
    dnsPrefetchLink.rel = 'dns-prefetch';
    dnsPrefetchLink.href = 'https://res.cloudinary.com';
    document.head.appendChild(dnsPrefetchLink);

    // Preload APENAS a imagem principal - LCP crítico
    const lcpCandidatePreload = document.createElement('link');
    lcpCandidatePreload.rel = 'preload';
    lcpCandidatePreload.as = 'image';
    lcpCandidatePreload.href = STATIC_INTRO_IMAGE_URLS.avif.large;
    lcpCandidatePreload.type = 'image/avif';
    lcpCandidatePreload.setAttribute('fetchpriority', 'high');
    document.head.appendChild(lcpCandidatePreload);
    
    // Limpeza ao desmontar
    return () => {
      if (preconnectLink.parentNode) preconnectLink.parentNode.removeChild(preconnectLink);
      if (dnsPrefetchLink.parentNode) dnsPrefetchLink.parentNode.removeChild(dnsPrefetchLink);
      if (lcpCandidatePreload.parentNode) lcpCandidatePreload.parentNode.removeChild(lcpCandidatePreload);
    };
  }, []); // Dependências vazias = executa uma vez na montagem
EOF

# Substituir o useEffect do preload
START_LINE=$(grep -n "// Pré-carregamento para LCP" "$FILE_PATH" | head -1 | cut -d':' -f1)
if [ -n "$START_LINE" ]; then
  END_LINE=$(tail -n +$START_LINE "$FILE_PATH" | grep -n "}, \[\]); // As dependências foram removidas" | head -1 | cut -d':' -f1)
  if [ -n "$END_LINE" ]; then
    END_LINE=$((START_LINE + END_LINE - 1))
    sed -i "${START_LINE},${END_LINE}d" "$FILE_PATH"
    sed -i "${START_LINE}r temp_preload_effect.txt" "$FILE_PATH"
    echo "useEffect para preload otimizado com sucesso!"
  fi
fi

rm temp_preload_effect.txt

echo "Otimizações de desempenho concluídas!"
echo "Teste a nova versão e compare com o backup em $BACKUP_PATH se necessário."
