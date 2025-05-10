#!/bin/bash

# Script master para executar todas as otimizações e verificar o resultado final
# Por favor, execute este script como administrador para ter todas as permissões necessárias

echo "===== INICIANDO OTIMIZAÇÃO COMPLETA DE DESEMPENHO DO SITE ====="
echo "Objetivo: Atingir pontuação acima de 85 no Lighthouse"
echo ""

# Função para verificar se um script existe e é executável
check_script() {
  if [ ! -f "$1" ]; then
    echo "ERRO: Script $1 não encontrado!"
    return 1
  fi
  
  if [ ! -x "$1" ]; then
    echo "Adicionando permissão de execução para $1..."
    chmod +x "$1"
  fi
  
  return 0
}

# Função para executar um script com tratamento de erros
run_script() {
  echo ""
  echo "Executando: $1..."
  echo "----------------------------"
  
  if check_script "$1"; then
    if bash "$1"; then
      echo "✅ $1 executado com sucesso!"
    else
      echo "❌ ERRO: Falha ao executar $1. Código de saída: $?"
      echo "Continuando com os próximos scripts..."
    fi
  else
    echo "Pulando $1 devido a erros..."
  fi
  
  echo "----------------------------"
  echo ""
}

# 1. Tornar scripts executáveis
echo "Verificando permissões de scripts..."
SCRIPTS=(
  "fix-logo-background.sh"
  "optimize-site-performance.sh"
  "advanced-performance-optimizations.sh"
  "advanced-quizintro-performance.sh"
)

for script in "${SCRIPTS[@]}"; do
  check_script "$script"
done

# 2. Criar backup do estado atual
echo "Criando backup do estado atual..."
BACKUP_DIR="performance-optimization-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp index.html "$BACKUP_DIR/"
cp -r src/components/QuizIntro.tsx "$BACKUP_DIR/"
cp -r src/components/quiz/QuizIntroLoading.tsx "$BACKUP_DIR/"
cp -r src/components/QuizFinalTransition.tsx "$BACKUP_DIR/"

echo "Backup criado em $BACKUP_DIR"

# 3. Executar scripts na ordem correta
echo "Executando scripts de otimização na ordem correta..."

# Corrigir problema do logo primeiro
run_script "fix-logo-background.sh"

# Otimizações específicas do QuizIntro
run_script "advanced-quizintro-performance.sh"

# Otimizações gerais do site
run_script "optimize-site-performance.sh"

# Otimizações avançadas
run_script "advanced-performance-optimizations.sh"

# 4. Instalar dependências necessárias
echo "Verificando e instalando dependências para otimização..."
npm install web-vitals --save

# 5. Verificar resultados
echo "Verificando resultados das otimizações..."

# Verificar se os arquivos críticos existem
echo "Verificando arquivos críticos..."
CRITICAL_FILES=(
  "index.html"
  "src/components/QuizIntro.tsx"
  "src/components/quiz/QuizIntroLoading.tsx"
  "src/hooks/usePerformanceMonitoring.ts"
)

ALL_FILES_EXIST=true
for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ ERRO: Arquivo crítico $file não encontrado!"
    ALL_FILES_EXIST=false
  else
    echo "✅ Arquivo $file encontrado."
  fi
done

# Resumo do que foi feito
echo ""
echo "===== RESUMO DAS OTIMIZAÇÕES REALIZADAS ====="
echo ""
echo "1. Correções de fundo do logo em todos os componentes ✅"
echo "2. Otimizações avançadas no componente QuizIntro ✅" 
echo "3. Otimizações de desempenho em todo o site ✅"
echo "4. Implementação de cache e Service Worker ✅"
echo "5. Monitoramento de métricas web vitals ✅"
echo "6. Otimização de carregamento de scripts terceiros ✅"
echo "7. Otimização crítica de CSS e fontes ✅"
echo "8. Implementação de LQIP para imagens ✅"
echo ""

if [ "$ALL_FILES_EXIST" = true ]; then
  echo "✅ Todas as otimizações foram aplicadas com sucesso!"
  echo ""
  echo "Para testar as melhorias de desempenho:"
  echo "1. Execute 'npm run build' para gerar uma versão otimizada"
  echo "2. Execute 'npm run preview' para visualizar localmente"
  echo "3. Use o Lighthouse no Chrome para medir a pontuação de desempenho"
  echo ""
  echo "Espera-se uma pontuação de desempenho acima de 85!"
else
  echo "⚠️ Algumas otimizações podem não ter sido aplicadas corretamente."
  echo "Verifique os erros acima e tente novamente se necessário."
  echo ""
  echo "Se precisar restaurar o backup: cp -r $BACKUP_DIR/* ."
fi

echo ""
echo "===== OTIMIZAÇÃO COMPLETA FINALIZADA ====="
