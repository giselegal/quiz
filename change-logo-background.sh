#!/bin/bash

# Script para alterar o fundo da logo de transparente para uma cor

echo "Alterando o fundo da logo de transparente para branco..."

FILE_PATH="/workspaces/quiz-sell-genius-66/src/components/QuizIntro.tsx"
NEW_FILE_PATH="${FILE_PATH}.new"

# Fazer backup do arquivo original se ainda não existir
if [ ! -f "${FILE_PATH}.backup" ]; then
  cp "$FILE_PATH" "${FILE_PATH}.backup"
  echo "Backup criado em ${FILE_PATH}.backup"
fi

# Copiar o arquivo atual para edição
cp "$FILE_PATH" "$NEW_FILE_PATH"

# Alterar o fundo de transparente (b_transparent) para branco (b_white) em todos os formatos
perl -i -pe "s/b_transparent/b_white/g" "$NEW_FILE_PATH"

# Verificar as alterações
echo "Alterações feitas (mostrando as linhas contendo 'b_white'):"
grep "b_white" "$NEW_FILE_PATH"

echo "Para aplicar as alterações, execute:"
echo "mv $NEW_FILE_PATH $FILE_PATH"
