# Guia Visual para Integração com o Lovable

Este documento apresenta o fluxo visual de como a integração com o Lovable deve funcionar.

## 1. Estrutura de Arquivos

```
projeto/
├── src/
│   └── components/
│       └── lovable/
│           ├── QuizCover.lovable.tsx     # Deve conter: // @lovable
│           ├── QuizQuestion.lovable.tsx  # Deve conter: // @lovable
│           ├── QuizLogic.lovable.tsx     # Deve conter: // @lovable
│           └── ResultPageEditor.lovable.tsx # Deve conter: // @lovable
├── public/
│   └── lovable-uploads/                  # Pasta para uploads
├── lovable.ts                            # Define a interface
└── lovable.config.js                     # Configuração
```

## 2. Formato dos Componentes Lovable

Cada arquivo de componente deve seguir este formato:

```tsx
// @lovable
import React from 'react';
import { defineLovable } from "../../../lovable";

export default defineLovable({
  name: "NomeDoComponente",
  displayName: "Nome Exibido",
  description: "Descrição do componente",
  category: "Categoria",
  
  defaultProps: {
    // Propriedades padrão
  },
  
  propsSchema: {
    // Esquema de propriedades
  },
  
  render: (props) => {
    // Renderização do componente
    return (
      <div>
        {/* Conteúdo do componente */}
      </div>
    );
  }
});
```

## 3. Fluxo de Conexão

```
┌───────────────┐        ┌──────────────┐        ┌───────────────┐
│               │        │              │        │               │
│  Seu Projeto  │◄─────►│  Navegador   │◄─────►│ Lovable Studio │
│  (porta 8080) │        │              │        │               │
└───────────────┘        └──────────────┘        └───────────────┘
```

## 4. Configuração CORS

No seu arquivo `vite.config.ts`:

```ts
server: {
  host: "::",
  port: 8080,
  headers: {
    'Access-Control-Allow-Origin': '*',  // Permite qualquer origem
  },
  allowedHosts: [
    "a10d1b34-b5d4-426b-8c97-45f125d03ec1.lovableproject.com"  // Host do Lovable
  ]
}
```

## 5. Comandos Importantes

```bash
# Iniciar o servidor com todas as flags necessárias
npm run dev -- --host --port 8080

# Verificar a integração
bash verify-lovable.sh

# Corrigir problemas de integração
bash fix-lovable-integration.sh
```

## 6. URLs de Acesso

- **Desenvolvimento Local**: `http://localhost:8080`
- **GitHub Codespace**: URL fornecida pelo Codespace (na aba PORTS)

## 7. Resolução de Problemas

Se houver problemas na conexão, verifique:

1. Se o servidor está rodando com `--host --port 8080`
2. Se os componentes têm a tag `// @lovable`
3. Se a configuração CORS está correta no `vite.config.ts`
4. Se você está usando a URL correta no Lovable Studio
