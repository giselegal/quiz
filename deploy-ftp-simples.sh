#!/bin/bash
# Script simplificado para upload via FTP

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Informações de FTP
FTP_HOST="giselegalvao.com.br"
FTP_USER="u116045488"
FTP_PASS="GiseleG@l0809"

echo -e "${GREEN}=== UPLOAD FTP SIMPLIFICADO ===${NC}"
echo -e "Servidor: $FTP_HOST"
echo -e "Usuário: $FTP_USER"
echo -e "Diretório: public_html"

# Verificar se a pasta dist existe
if [ ! -d "./dist" ]; then
    echo -e "${RED}Erro: Pasta 'dist' não encontrada. Execute 'npm run build' primeiro.${NC}"
    exit 1
fi

# Criar um arquivo de comandos FTP
echo -e "${YELLOW}Preparando comandos FTP...${NC}"
FTP_COMMANDS=$(mktemp)

cat > "$FTP_COMMANDS" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
cd public_html
prompt
binary
EOL

# Adicionar cada arquivo ao comando FTP
find ./dist -type f | while read FILE; do
    RELATIVE_PATH="${FILE#./dist/}"
    echo "put \"$FILE\" \"$RELATIVE_PATH\"" >> "$FTP_COMMANDS"
done

# Finalizar o arquivo de comandos
echo "bye" >> "$FTP_COMMANDS"

# Executar o upload
echo -e "${YELLOW}Enviando arquivos para o servidor...${NC}"
echo -e "${YELLOW}Isso pode levar alguns minutos, dependendo da quantidade de arquivos...${NC}"

ftp -n < "$FTP_COMMANDS"
FTP_RESULT=$?

# Limpar o arquivo temporário
rm -f "$FTP_COMMANDS"

# Verificar o resultado
if [ $FTP_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Upload concluído com sucesso!${NC}"
    echo -e "Acesse https://giselegalvao.com.br/ para verificar o resultado."
else
    echo -e "${RED}✗ Erro durante o upload. Código: $FTP_RESULT${NC}"
    
    # Alternativa com curl
    echo -e "${YELLOW}Tentando método alternativo usando curl...${NC}"
    
    # Enviar cada arquivo individualmente
    cd dist
    for FILE in $(find . -type f); do
        echo -e "   ${YELLOW}Enviando: $FILE${NC}"
        curl -T "$FILE" --ftp-create-dirs -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/public_html/${FILE#./}"
        if [ $? -eq 0 ]; then
            echo -e "   ${GREEN}✓ Arquivo enviado com sucesso: $FILE${NC}"
        else
            echo -e "   ${RED}✗ Erro ao enviar: $FILE${NC}"
        fi
        sleep 0.2
    done
    cd ..
fi

echo -e "${GREEN}Processo de upload concluído!${NC}"
