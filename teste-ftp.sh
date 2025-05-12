#!/bin/bash
# Script para testar a conexão FTP e os diretórios disponíveis

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Credenciais FTP
FTP_HOST="giselegalvao.com.br"
FTP_USER="u116045488"
FTP_PASS="GiseleG@l0809"

echo -e "${GREEN}=== TESTE DE CONEXÃO FTP COM HOSTINGER ===${NC}"

# Criar um arquivo de teste
echo "Arquivo de teste para FTP" > test-connection.txt

# Testar diretórios diferentes
DIRECTORIES=("/" "/public_html/" "/www/" "/httpdocs/" "/htdocs/" "/home/u116045488/public_html/")

for DIR in "${DIRECTORIES[@]}"; do
    echo -e "${YELLOW}Testando upload para diretório: $DIR${NC}"
    curl -v -T test-connection.txt -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST$DIR"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Upload bem-sucedido para: $DIR${NC}"
        WORKING_DIR="$DIR"
    else
        echo -e "${RED}✗ Falha no upload para: $DIR${NC}"
    fi
    echo "------------------------------"
done

# Testar listagem de arquivos em diretórios que funcionaram
if [ ! -z "$WORKING_DIR" ]; then
    echo -e "${YELLOW}Diretório funcionando: $WORKING_DIR${NC}"
    echo -e "${YELLOW}Listando arquivos em: $WORKING_DIR${NC}"
    
    # Criar arquivo temporário para comandos FTP
    TMP_FILE=$(mktemp)
    cat > "$TMP_FILE" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
ls -la
bye
EOL
    
    ftp -n < "$TMP_FILE"
    rm "$TMP_FILE"
fi

# Limpar
rm test-connection.txt

echo -e "${GREEN}=== TESTE DE CONEXÃO FTP CONCLUÍDO ===${NC}"
