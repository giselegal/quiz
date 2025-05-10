#!/bin/bash

# Script para atualizar as fontes nos componentes de loading e spinners

# Atualiza o CSS no arquivo index.html
sed -i 's/\.loading-fallback {/\.loading-fallback {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n        min-height: 100vh;\n        background-color: #f9fafb;/g' index.html
sed -i 's/<div class="loading-fallback">\n        <div class="loading-spinner"><\/div>/<div class="loading-fallback">\n        <div class="loading-spinner"><\/div>\n        <div class="loading-message">Carregando...<\/div>/g' index.html

# Adiciona a classe font-inter no index.css
if ! grep -q "font-inter" src/index.css; then
    sed -i 's/\.font-playfair {/\.font-playfair {\n    font-family: '\''Playfair Display'\'', serif;\n  }\n  \n  .font-inter {/g' src/index.css
    sed -i 's/font-family: '\''Playfair Display'\'', serif;/font-family: '\''Playfair Display'\'', serif;\n  }\n  \n  .font-inter {\n    font-family: '\''Inter'\'', sans-serif;/g' src/index.css
fi

# Atualiza os componentes de loading
sed -i 's/className="text-\[#432818\] font-medium"/className="text-\[#432818\] font-medium font-inter"/g' src/components/quiz/QuizIntroLoading.tsx
sed -i 's/className="text-\[#432818\] font-medium"/className="text-\[#432818\] font-medium font-inter"/g' src/components/ui/loading-state.tsx
sed -i 's/{showText && <p className="mt-2 text-sm text-gray-600"/{showText && <p className="mt-2 text-sm text-gray-600 font-inter"/g' src/components/ui/loading-spinner.tsx

# Atualiza o componente QuizFinalTransition
sed -i 's/className="text-center text-\[#3a3a3a\] font-medium"/className="text-center text-\[#3a3a3a\] font-medium font-inter"/g' src/components/QuizFinalTransition.tsx
sed -i 's/<p className="text-\[#3a3a3a\]">/<p className="text-\[#3a3a3a\] font-inter">/g' src/components/QuizFinalTransition.tsx

echo "Fontes atualizadas com sucesso nos componentes de loading e spinners!"
