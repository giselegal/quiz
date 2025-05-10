#!/bin/bash

# Script para otimizar as imagens do QuizIntro.tsx
# Este script modifica os tamanhos e qualidade das imagens

echo "Executando script para diminuir o tamanho e qualidade da imagem no QuizIntro..."

# Arquivo a ser modificado
FILE_PATH="/workspaces/quiz-sell-genius-66/src/components/QuizIntro.tsx"

# Backup do arquivo original
cp "$FILE_PATH" "${FILE_PATH}.backup"

echo "Backup criado em ${FILE_PATH}.backup"

# Reduzir qualidade e tamanho nas URLs AVIF
sed -i 's/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 345, 80)/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 300, 60)/' "$FILE_PATH"
sed -i 's/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 400, 85)/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 350, 65)/' "$FILE_PATH"
sed -i 's/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 450, 90)/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''avif'\'', 400, 70)/' "$FILE_PATH"

# Reduzir qualidade e tamanho nas URLs WEBP
sed -i 's/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''webp'\'', 345, 75)/small: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''webp'\'', 300, 55)/' "$FILE_PATH"
sed -i 's/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''webp'\'', 400, 80)/medium: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''webp'\'', 350, 60)/' "$FILE_PATH"
sed -i 's/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''webp'\'', 450, 85)/large: buildOptimizedIntroImageUrl(INTRO_IMAGE_BASE_URL, INTRO_IMAGE_ID, '\''webp'\'', 400, 65)/' "$FILE_PATH"

# Reduzir a URL de PNG
sed -i 's/png: `${INTRO_IMAGE_BASE_URL}f_png,q_70,w_345,c_limit,fl_progressive/${INTRO_IMAGE_ID}.png`/png: `${INTRO_IMAGE_BASE_URL}f_png,q_60,w_300,c_limit,fl_progressive/${INTRO_IMAGE_ID}.png`/' "$FILE_PATH"

# Reduzir o tamanho do container da imagem no CSS
sed -i 's/max-w-\[300px\] sm:max-w-\[345px\] md:max-w-sm/max-w-\[250px\] sm:max-w-\[300px\] md:max-w-xs/' "$FILE_PATH"

# Reduzir o tamanho definido no atributo width da imagem fallback
sed -i 's/width={345}/width={300}/' "$FILE_PATH"

echo "Modificações concluídas. Verifique o arquivo $FILE_PATH"
