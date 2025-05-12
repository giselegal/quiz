#!/bin/bash
# Script simples para upload via FTP diretamente para o diretório raiz

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Informações de FTP para Hostinger
FTP_HOST="giselegalvao.com.br"
FTP_USER="u116045488"
FTP_PASS="GiseleG@l0809"

echo -e "${GREEN}=== UPLOAD FTP DIRETO ===${NC}"
echo -e "Servidor: $FTP_HOST"
echo -e "Usuário: $FTP_USER"

# Verificar se a pasta dist existe
if [ ! -d "./dist" ]; then
    echo -e "${RED}Erro: Pasta 'dist' não encontrada. Execute 'npm run build' primeiro.${NC}"
    exit 1
fi

# Método simplificado de upload - tenta enviar diretamente para a raiz
echo -e "${YELLOW}Tentando upload diretamente para o servidor...${NC}"

# Criar arquivo de teste para verificar conexão
echo "Teste de conexão FTP" > test-connection.txt

# Testar conexão básica
echo -e "${YELLOW}Testando conexão FTP...${NC}"
curl -T test-connection.txt -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/"
TEST_RESULT=$?

# Remover arquivo de teste
rm test-connection.txt

if [ $TEST_RESULT -ne 0 ]; then
    echo -e "${RED}✗ Não foi possível conectar ao servidor FTP. Verifique as credenciais e o endereço.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Conexão FTP estabelecida com sucesso!${NC}"
echo -e "${YELLOW}Enviando arquivos diretamente para o diretório raiz...${NC}"

# Enviar cada arquivo para a pasta public_html
cd dist
for FILE in $(find . -type f); do
    DIR=$(dirname "$FILE")
    if [ "$DIR" != "." ]; then
        # Cria o diretório remoto se for um subdiretório
        echo -e "   ${YELLOW}Criando diretório: $DIR${NC}"
        curl --ftp-create-dirs -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/public_html/$DIR/" -Q "MKD $DIR"
    fi
    
    echo -e "   ${YELLOW}Enviando: $FILE${NC}"
    curl -T "$FILE" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/public_html/$FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✓ Arquivo enviado com sucesso: $FILE${NC}"
    else
        echo -e "   ${RED}✗ Erro ao enviar o arquivo: $FILE${NC}"
    fi
    sleep 0.2
done
cd ..

echo -e "${GREEN}=== UPLOAD CONCLUÍDO ===${NC}"
echo -e "Acesse o site em: https://giselegalvao.com.br/"
