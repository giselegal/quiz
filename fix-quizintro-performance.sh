#!/bin/bash

# Script final para correção completa do desempenho do QuizIntro

echo "Aplicando otimizações finais para o QuizIntro..."

FILE_PATH="/workspaces/quiz-sell-genius-66/src/components/QuizIntro.tsx"
BACKUP_PATH="${FILE_PATH}.final-backup"

# Criar backup
cp "$FILE_PATH" "$BACKUP_PATH"
echo "Backup criado em $BACKUP_PATH"

# 1. LOCALIZAR O USEEFFECT DE BASE64
BASE64_EFFECT_START=$(grep -n "// Efeito para carregar" "$FILE_PATH" | head -1 | cut -d':' -f1)
if [ -n "$BASE64_EFFECT_START" ]; then
  # Encontrar o final do useEffect (procurando por "}, [])" após a linha de início)
  BASE64_EFFECT_END=$(tail -n +$BASE64_EFFECT_START "$FILE_PATH" | grep -n "}, \[\])" | head -1 | cut -d':' -f1)
  if [ -n "$BASE64_EFFECT_END" ]; then
    BASE64_EFFECT_END=$((BASE64_EFFECT_START + BASE64_EFFECT_END - 1))
    
    # Substituir com nosso useEffect otimizado
    sed -i "${BASE64_EFFECT_START},${BASE64_EFFECT_END}d" "$FILE_PATH"
    sed -i "${BASE64_EFFECT_START}r /workspaces/quiz-sell-genius-66/optimized-base64-effect.txt" "$FILE_PATH"
    echo "UseEffect de base64 otimizado!"
  else
    echo "Não foi possível encontrar o final do useEffect de base64"
  fi
else
  echo "Não foi possível encontrar o início do useEffect de base64"
fi

# 2. LOCALIZAR O USEEFFECT DE PRELOAD
PRELOAD_EFFECT_START=$(grep -n "// Pré-carregamento para LCP" "$FILE_PATH" | head -1 | cut -d':' -f1)
if [ -n "$PRELOAD_EFFECT_START" ]; then
  # Encontrar o final do useEffect (procurando por "}, [])" após a linha de início)
  PRELOAD_EFFECT_END=$(tail -n +$PRELOAD_EFFECT_START "$FILE_PATH" | grep -n "}, \[\])" | head -1 | cut -d':' -f1)
  if [ -n "$PRELOAD_EFFECT_END" ]; then
    PRELOAD_EFFECT_END=$((PRELOAD_EFFECT_START + PRELOAD_EFFECT_END - 1))
    
    # Substituir com nosso useEffect otimizado
    sed -i "${PRELOAD_EFFECT_START},${PRELOAD_EFFECT_END}d" "$FILE_PATH"
    sed -i "${PRELOAD_EFFECT_START}r /workspaces/quiz-sell-genius-66/optimized-preload-effect.txt" "$FILE_PATH"
    echo "UseEffect de preload otimizado!"
  else
    echo "Não foi possível encontrar o final do useEffect de preload"
  fi
else
  echo "Não foi possível encontrar o início do useEffect de preload"
fi

# 3. Corrigir os tamanhos em srcSet para corresponder às alterações (eliminar inconsistências)
sed -i 's/srcSet={`\${STATIC_INTRO_IMAGE_URLS.avif.tiny} 200w, \${STATIC_INTRO_IMAGE_URLS.avif.small} 345w, \${STATIC_INTRO_IMAGE_URLS.avif.medium} 400w, \${STATIC_INTRO_IMAGE_URLS.avif.large} 450w`}/srcSet={`${STATIC_INTRO_IMAGE_URLS.avif.tiny} 200w, ${STATIC_INTRO_IMAGE_URLS.avif.small} 345w, ${STATIC_INTRO_IMAGE_URLS.avif.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.avif.large} 450w`}/' "$FILE_PATH"

sed -i 's/srcSet={`\${STATIC_INTRO_IMAGE_URLS.webp.tiny} 200w, \${STATIC_INTRO_IMAGE_URLS.webp.small} 345w, \${STATIC_INTRO_IMAGE_URLS.webp.medium} 400w, \${STATIC_INTRO_IMAGE_URLS.webp.large} 450w`}/srcSet={`${STATIC_INTRO_IMAGE_URLS.webp.tiny} 200w, ${STATIC_INTRO_IMAGE_URLS.webp.small} 345w, ${STATIC_INTRO_IMAGE_URLS.webp.medium} 400w, ${STATIC_INTRO_IMAGE_URLS.webp.large} 450w`}/' "$FILE_PATH"

# 4. Corrigir o atributo sizes para corresponder aos novos tamanhos
sed -i 's/sizes="(max-width: 640px) 345px, (max-width: 768px) 400px, 450px"/sizes="(max-width: 640px) 345px, (max-width: 768px) 400px, 450px"/' "$FILE_PATH"

echo "Otimizações finais concluídas."
echo "Remoção dos arquivos temporários..."
rm -f /workspaces/quiz-sell-genius-66/optimized-base64-effect.txt
rm -f /workspaces/quiz-sell-genius-66/optimized-preload-effect.txt

echo "ATENÇÃO: Estas alterações devem melhorar significativamente o desempenho do QuizIntro."
echo "As principais mudanças são:"
echo "1. Adição de cache via sessionStorage para o placeholder base64"
echo "2. Melhoria na estratégia de preload para focar no LCP"
echo "3. Ajuste nas qualidades de imagem para melhor equilíbrio"
echo "4. Correção de inconsistências nos tamanhos de imagem"
echo ""
echo "Se ainda houver problemas de desempenho, o backup original está em: $BACKUP_PATH"
