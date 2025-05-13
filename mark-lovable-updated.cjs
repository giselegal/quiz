const fs = require('fs');
const path = require('path');

// Lista de componentes para marcar
const componentsToMark = [
  'src/components/lovable/QuizCover.lovable.tsx',
  'src/components/lovable/QuizQuestion.lovable.tsx',
  'src/components/lovable/QuizLogic.lovable.tsx',
  'src/components/lovable/ResultPageEditor.lovable.tsx'
];

// Verificar se os arquivos existem e marcá-los
componentsToMark.forEach(componentPath => {
  if (fs.existsSync(componentPath)) {
    console.log(`📝 Verificando o componente: ${componentPath}`);
    
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Verificar se o componente já está marcado
    if (!content.includes('// @lovable')) {
      const newContent = `// @lovable\n${content}`;
      fs.writeFileSync(componentPath, newContent);
      console.log(`✅ Componente ${path.basename(componentPath)} marcado com sucesso!`);
    } else {
      console.log(`ℹ️ Componente ${path.basename(componentPath)} já está marcado.`);
    }
  } else {
    console.log(`⚠️ Componente não encontrado: ${componentPath}`);
  }
});

console.log('✅ Marcação de componentes concluída!');
