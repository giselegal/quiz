const fs = require('fs');
const path = require('path');

// Lista de componentes para marcar
const componentsToMark = [
  'src/components/quiz-builder/QuizCover.tsx',
  'src/components/quiz-builder/QuizQuestion.tsx',
  'src/components/quiz-logic/QuizLogic.tsx',
  'src/components/result-editor/ResultPageEditor.tsx'
];

// Verificar se os arquivos existem e marcá-los
componentsToMark.forEach(componentPath => {
  if (fs.existsSync(componentPath)) {
    console.log(`Marcando componente: ${componentPath}`);
    
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Verificar se o componente já está marcado
    if (!content.includes('// @lovable')) {
      const newContent = `// @lovable\n${content}`;
      fs.writeFileSync(componentPath, newContent);
      console.log(`✅ Componente marcado com sucesso: ${componentPath}`);
    } else {
      console.log(`ℹ️ Componente já está marcado: ${componentPath}`);
    }
  } else {
    console.log(`⚠️ Componente não encontrado: ${componentPath}`);
    // Tente buscar o arquivo em outras pastas
    console.log(`��� Procurando por arquivos semelhantes...`);
  }
});

console.log('✅ Marcação de componentes concluída!');
