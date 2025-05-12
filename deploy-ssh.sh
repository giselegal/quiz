#!/bin/bash
# Script para deploy via SSH na Hostinger
# Uso: bash deploy-ssh.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Configurações SSH
SSH_HOST="147.93.39.155"
SSH_USER="u116045488"
SSH_PASSWORD="GiseleG@l0809"  # Recomendado usar chaves SSH em vez de senha
SSH_PORT="22"
REMOTE_DIR="/domains/giselegalvao.com.br/public_html"

# Mensagem inicial
echo -e "${GREEN}=== DEPLOY VIA SSH PARA HOSTINGER ===${NC}"
echo -e "Este script irá fazer o build e deploy do aplicativo para ${YELLOW}https://giselegalvao.com.br/${NC}"

# Verificar se o pacote sshpass está instalado (necessário para autenticação via senha)
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}Instalando sshpass para autenticação SSH com senha...${NC}"
    sudo apt-get update && sudo apt-get install -y sshpass || {
        echo -e "${RED}✗ Erro: Não foi possível instalar sshpass. Verifique suas permissões.${NC}"
        exit 1
    }
fi

# Verificar vite.config.ts
echo -e "\n${YELLOW}1. Verificando configuração base no vite.config.ts${NC}"
if grep -q "base: '/quiz-de-estilo/" "./vite.config.ts"; then
    sed -i 's|base: .*|base: "/",|g' "./vite.config.ts"
    echo -e "   ${GREEN}✓ Configuração base atualizada para '/'${NC}"
else
    echo -e "   ${GREEN}✓ Configuração base já está correta ('/')${NC}"
fi

# Atualizar .htaccess
echo -e "\n${YELLOW}2. Verificando .htaccess${NC}"
cat > "./public/.htaccess" <<EOL
# Configuração SPA - Redireciona todas as solicitações para index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Não redirecionar para arquivos existentes ou diretórios
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Redirecionar todo o restante para index.html
  RewriteRule ^(.*)$ index.html [L,QSA]
</IfModule>

# Cache para recursos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json image/svg+xml
</IfModule>
EOL

echo -e "   ${GREEN}✓ Regras de redirecionamento adicionadas ao .htaccess${NC}"

# Construir o projeto
echo -e "\n${YELLOW}3. Construindo o projeto${NC}"
npm run build

# Validar se a build foi bem-sucedida
if [ ! -d "./dist" ]; then
    echo -e "${RED}✗ Erro: Diretório de build 'dist' não foi criado. Verifique os erros acima.${NC}"
    exit 1
fi

# Copiar .htaccess para a pasta dist
echo -e "\n${YELLOW}4. Copiando .htaccess para pasta dist${NC}"
cp "./public/.htaccess" "./dist/.htaccess"
echo -e "   ${GREEN}✓ .htaccess copiado com sucesso${NC}"

# Criar arquivo de deploy temporário
echo -e "\n${YELLOW}5. Preparando arquivos para deploy...${NC}"
TEMP_DIR="./temp_deploy"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
cp -r ./dist/* "$TEMP_DIR"/
echo -e "   ${GREEN}✓ Arquivos preparados para deploy${NC}"

# Compactar arquivos para transferência mais rápida
echo -e "\n${YELLOW}6. Compactando arquivos para transferência...${NC}"
ARCHIVE_NAME="deploy_package.tar.gz"
tar -czf "$ARCHIVE_NAME" -C "$TEMP_DIR" .
echo -e "   ${GREEN}✓ Arquivos compactados em $ARCHIVE_NAME${NC}"

# Deploy via SSH
echo -e "\n${YELLOW}7. Fazendo upload e implantando via SSH...${NC}"

# Criar um script para executar no servidor remoto
cat > deploy_remote.sh <<EOL
#!/bin/bash
# Criar diretório de backup
BACKUP_DIR="/home/$SSH_USER/site_backup_\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$BACKUP_DIR"

# Backup dos arquivos atuais
if [ -d "$REMOTE_DIR" ] && [ "\$(ls -A $REMOTE_DIR)" ]; then
    cp -r $REMOTE_DIR/* "\$BACKUP_DIR"/ 2>/dev/null || true
    echo "Backup realizado em \$BACKUP_DIR"
    
    # Limpar diretório de destino
    rm -rf $REMOTE_DIR/* 2>/dev/null || true
fi

# Descompactar arquivo de deploy
mkdir -p $REMOTE_DIR
tar -xzf /home/$SSH_USER/$ARCHIVE_NAME -C $REMOTE_DIR

# Verificar permissões e corrigir se necessário
find $REMOTE_DIR -type d -exec chmod 755 {} \;
find $REMOTE_DIR -type f -exec chmod 644 {} \;

# Remover arquivo de deploy
rm /home/$SSH_USER/$ARCHIVE_NAME

echo "Deploy concluído com sucesso!"
EOL

# Transferir arquivos e executar script remoto
sshpass -p "$SSH_PASSWORD" scp -P "$SSH_PORT" -o StrictHostKeyChecking=no "$ARCHIVE_NAME" "$SSH_USER@$SSH_HOST:/home/$SSH_USER/"
sshpass -p "$SSH_PASSWORD" scp -P "$SSH_PORT" -o StrictHostKeyChecking=no deploy_remote.sh "$SSH_USER@$SSH_HOST:/home/$SSH_USER/"
sshpass -p "$SSH_PASSWORD" ssh -p "$SSH_PORT" -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "chmod +x /home/$SSH_USER/deploy_remote.sh && /home/$SSH_USER/deploy_remote.sh"

# Limpar arquivos temporários
echo -e "\n${YELLOW}8. Limpando arquivos temporários...${NC}"
rm -rf "$TEMP_DIR" "$ARCHIVE_NAME" deploy_remote.sh
echo -e "   ${GREEN}✓ Arquivos temporários removidos${NC}"

# Finalização
echo -e "\n${GREEN}=== DEPLOY CONCLUÍDO ===${NC}"
echo -e "O projeto foi implantado com sucesso em:"
echo -e "${YELLOW}https://giselegalvao.com.br/${NC}"
echo -e "Uma cópia de backup dos arquivos anteriores foi criada no servidor."
exit 0
