#!/bin/bash

# Configurações de FTP
FTP_USER="seu_usuario"
FTP_PASS="sua_senha"
FTP_HOST="giselegalvao.com.br"

# Diretório onde os arquivos foram extraídos
SRC_DIR="./solucao-extraida/solucao-raiz-dominio"

# Função para enviar arquivo ou pasta recursivamente
upload_files() {
  local src="$1"
  local dest="$2"
  
  # Para cada arquivo/pasta no diretório
  for item in "$src"/*; do
    # Obter apenas o nome do arquivo/pasta
    filename=$(basename "$item")
    
    if [ -d "$item" ]; then
      # Criar diretório remoto
      curl -s -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$dest/" -Q "MKD $filename"
      # Upload recursivo
      upload_files "$item" "$dest/$filename"
    else
      # Upload de arquivo
      echo "Enviando $item para $dest/$filename"
      curl -T "$item" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$dest/$filename"
    fi
  done
}

# Iniciar o upload
upload_files "$SRC_DIR" ""

echo "Upload concluído!"
