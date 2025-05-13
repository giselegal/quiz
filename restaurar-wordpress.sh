#!/bin/bash

# Configurações FTP
FTP_USER="seu_usuario"
FTP_PASS="sua_senha"
FTP_HOST="giselegalvao.com.br"

# Listar arquivos na pasta de backup
curl -s -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/wordpress_backup/" --list-only

# Comando FTP para restaurar os arquivos
echo "Restaurando arquivos WordPress..."
curl -s -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" -Q "SITE EXEC find wordpress_backup -type f -exec mv {} ./ \;"
curl -s -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" -Q "SITE EXEC find wordpress_backup -type d -depth 1 -exec mv {} ./ \;"

echo "Restauração concluída!"
