#!/bin/bash

# Script para remover fundos brancos das logos em todo o projeto

echo "Corrigindo imagens de logo no projeto..."

# 1. Corrige QuizIntro.tsx
perl -i -pe 's/c_fit,dpr_auto,e_sharpen:100,b_transparent/c_fit,dpr_auto,e_sharpen:100/g' src/components/QuizIntro.tsx
perl -i -pe 's/height: '\''60px'\''/height: '\''60px'\'', background: '\''none'\''/g' src/components/QuizIntro.tsx

# 2. Corrige QuizIntroLoading.tsx
perl -i -pe 's/c_fit,dpr_auto,b_transparent/c_fit,dpr_auto/g' src/components/quiz/QuizIntroLoading.tsx
perl -i -pe 's/background: '\''transparent'\''/background: '\''none'\''/g' src/components/quiz/QuizIntroLoading.tsx

# 3. Corrige LoadingState.tsx, se tiver background
perl -i -pe 's/c_fit,dpr_auto,b_transparent/c_fit,dpr_auto/g' src/components/ui/loading-state.tsx
# Adicionar background: none no estilo, mesmo se não tiver fundo atualmente
sed -i '/imageRendering: '\''crisp-edges/ s/}/, background: '\''none'\''}/' src/components/ui/loading-state.tsx

# 4. Corrige QuizFinalTransition.tsx
perl -i -pe 's/style={{objectFit: '\''contain'\''}}/style={{objectFit: '\''contain'\'', background: '\''none'\''}}/g' src/components/QuizFinalTransition.tsx

# 5. Corrige outras instâncias potenciais
find src -type f -name "*.tsx" -exec perl -i -pe 's/LOGO_DA_MARCA_GISELE_r14oz2.webp" style={/LOGO_DA_MARCA_GISELE_r14oz2.webp" style={{...style, background: "none"} || {background: "none"} || /g' {} \;

echo "Correções de fundo de logo concluídas!"
