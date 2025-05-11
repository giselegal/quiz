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
    console.log();
    
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Verificar se o componente já está marcado
      const newContent = ;
      fs.writeFileSync(componentPath, newContent);
      console.log();
    } else {
      console.log();
    }
  } else {
    console.log();
  }
});

console.log('✅ Marcação de componentes concluída!');
