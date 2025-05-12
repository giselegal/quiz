#!/bin/bash
# Script para limpeza e organização do projeto
# Uso: bash limpeza-projeto.sh

# Cores para mensagens
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}=== LIMPEZA E ORGANIZAÇÃO DO PROJETO ===${NC}"

# Criar diretório para arquivos de backup
echo -e "\n${YELLOW}1. Criando diretório para arquivos de backup${NC}"
mkdir -p ./backups/scripts
mkdir -p ./backups/html
mkdir -p ./backups/workflows
mkdir -p ./backups/docs
echo -e "   ${GREEN}✓ Diretórios de backup criados${NC}"

# Consolidar scripts de deploy
echo -e "\n${YELLOW}2. Consolidando scripts de deploy${NC}"

# Manter apenas os principais scripts de deploy
MAIN_SCRIPTS=("deploy-raiz-dominio.sh" "deploy-com-ip.sh" "deploy-ssh.sh" "deploy-github.sh")

# Mover scripts duplicados para o diretório de backup
for script in *.sh; do
    if [[ "$script" == *deploy* ]] && [[ ! " ${MAIN_SCRIPTS[@]} " =~ " ${script} " ]]; then
        echo -e "   Movendo script duplicado: $script"
        mv "$script" ./backups/scripts/
    fi
done

echo -e "   ${GREEN}✓ Scripts consolidados${NC}"

# Limpar arquivos HTML duplicados
echo -e "\n${YELLOW}3. Organizando arquivos HTML duplicados${NC}"
for html in *.html; do
    if [[ "$html" != "index.html" ]]; then
        echo -e "   Movendo HTML duplicado: $html"
        mv "$html" ./backups/html/
    fi
done
echo -e "   ${GREEN}✓ Arquivos HTML organizados${NC}"

# Consolidar workflows do GitHub Actions
echo -e "\n${YELLOW}4. Consolidando workflows do GitHub Actions${NC}"

# Manter apenas o workflow principal
MAIN_WORKFLOW="deploy-to-hostinger-auto.yml"

# Criar backup dos workflows adicionais
for workflow in .github/workflows/*.yml; do
    basename=$(basename "$workflow")
    if [[ "$basename" != "$MAIN_WORKFLOW" ]]; then
        echo -e "   Fazendo backup do workflow: $basename"
        cp "$workflow" ./backups/workflows/
    fi
done
echo -e "   ${GREEN}✓ Workflows consolidados${NC}"

# Organizar documentação
echo -e "\n${YELLOW}5. Organizando documentação redundante${NC}"
for doc in *.md; do
    if [[ "$doc" != "README.md" ]] && [[ "$doc" =~ (DEPLOY|HOSTINGER|deploy|hostinger) ]]; then
        echo -e "   Movendo documentação redundante: $doc"
        cp "$doc" ./backups/docs/
    fi
done
echo -e "   ${GREEN}✓ Documentação organizada${NC}"

# Atualizar arquivo README.md para centralizar informações
echo -e "\n${YELLOW}6. Atualizando README.md com informações centralizadas${NC}"
cat > README.md.new << EOL
# Quiz de Estilo - Gisele Galvão

Aplicação de quiz para identificação de estilo pessoal para o site giselegalvao.com.br.

## Métodos de Deploy

Este projeto possui três métodos principais de deploy:

1. **Deploy automatizado via GitHub Actions**:
   - Configurado no workflow \`.github/workflows/${MAIN_WORKFLOW}\`
   - Executa automaticamente quando há push na branch main
   - Usa FTP para enviar os arquivos para a Hostinger

2. **Deploy manual via SSH**:
   - Use o script \`deploy-ssh.sh\` para deploy via SSH
   - Mais seguro e eficiente que FTP
   - Requer acesso SSH ativado na Hostinger

3. **Deploy manual via FTP**:
   - Use o script \`deploy-com-ip.sh\` para deploy usando IP direto
   - Utiliza o script \`deploy-raiz-dominio.sh\` para construir e preparar o site

## Configuração

- O site está configurado para ser hospedado na raiz do domínio: https://giselegalvao.com.br/
- As configurações de FTP estão nos scripts de deploy

## Desenvolvedores

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Envie um pull request

## Contato

Para questões relacionadas a este projeto, entre em contato com a equipe de desenvolvimento.
EOL

# Finalizar atualização do README se tudo estiver ok
if [ -f "README.md.new" ]; then
    mv README.md ./backups/docs/README.md.original
    mv README.md.new README.md
    echo -e "   ${GREEN}✓ README.md atualizado${NC}"
fi

# Finalizar com resumo
echo -e "\n${GREEN}=== LIMPEZA CONCLUÍDA ===${NC}"
echo -e "Foram organizados:"
echo -e "- Scripts de deploy duplicados"
echo -e "- Arquivos HTML duplicados"
echo -e "- Workflows de GitHub Actions duplicados"
echo -e "- Documentação redundante"
echo -e "\nTodos os arquivos originais foram preservados em ./backups/"
echo -e "Os principais scripts e documentação foram mantidos."
exit 0
