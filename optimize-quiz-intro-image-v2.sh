#!/bin/bash

# Script para diminuir o tamanho e qualidade da imagem no QuizIntro

echo "Criando arquivo QuizIntro.tsx.new com imagens reduzidas..."

FILE_PATH="/workspaces/quiz-sell-genius-66/src/components/QuizIntro.tsx"
NEW_FILE_PATH="${FILE_PATH}.new"

# Leia o arquivo original
if [ -f "$FILE_PATH" ]; then
  # Copie o arquivo para o novo
  cp "$FILE_PATH" "$NEW_FILE_PATH"
  
  # Faça as substituições uma por uma, evitando problemas com aspas
  perl -i -pe "s/small: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 345, 80\)/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 300, 60)/g" "$NEW_FILE_PATH"
  perl -i -pe "s/medium: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 400, 85\)/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 350, 65)/g" "$NEW_FILE_PATH"
  perl -i -pe "s/large: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 450, 90\)/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'avif', 400, 70)/g" "$NEW_FILE_PATH"
  
  perl -i -pe "s/small: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 345, 75\)/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 300, 55)/g" "$NEW_FILE_PATH"
  perl -i -pe "s/medium: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 400, 80\)/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 350, 60)/g" "$NEW_FILE_PATH"
  perl -i -pe "s/large: buildOptimizedIntroImageUrl\(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 450, 85\)/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, 'webp', 400, 65)/g" "$NEW_FILE_PATH"
  
  # Reduzir a qualidade do PNG
  perl -i -pe 's/png: `\${INTRO_IMAGE_BASE_URL}f_png,q_70,w_345,c_limit,fl_progressive\/\${INTRO_IMAGE_ID}.png`/png: `${INTRO_IMAGE_BASE_URL}f_png,q_60,w_300,c_limit,fl_progressive\/${INTRO_IMAGE_ID}.png`/g' "$NEW_FILE_PATH"
  
  # Reduzir o tamanho do contêiner da imagem
  perl -i -pe 's/className="w-full max-w-\[300px\] sm:max-w-\[345px\] md:max-w-sm/className="w-full max-w-\[250px\] sm:max-w-\[300px\] md:max-w-xs/g' "$NEW_FILE_PATH"
  
  # Reduzir o tamanho definido da imagem fallback
  perl -i -pe 's/width=\{345\}/width={300}/g' "$NEW_FILE_PATH"
  
  echo "Modificações concluídas. Arquivo gerado: $NEW_FILE_PATH"
  echo "Para aplicar as alterações, execute:"
  echo "mv $NEW_FILE_PATH $FILE_PATH"
else
  echo "Erro: O arquivo $FILE_PATH não foi encontrado."
  exit 1
fi
