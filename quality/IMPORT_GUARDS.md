# Import Guards - Sistema de Avisos para Melhores Práticas

## 🎯 Objetivo

O sistema de Import Guards tem como objetivo **guiar gentilmente** novos códigos a usar facades e barrels, promovendo:

- ✅ **Imports mais organizados** via barrels (`@/components/ui`, `@/hooks`)
- ✅ **APIs estáveis** via facades (`@/facades/agents`, `@/facades/integrations`)
- ✅ **Melhor descoberta** de componentes e utilitários
- ✅ **Preparação para refatoração** futura

## ⚠️ Modo WARN-ONLY

**IMPORTANTE:** Este sistema **NUNCA bloqueia builds** nem quebra código existente:

- 🟡 **Warnings apenas** - nunca errors
- 🟡 **Não afeta produção** - config separada
- 🟡 **Não altera eslintrc raiz** - arquivo independente
- 🟡 **Adoção opcional** - para guiar melhorias graduais

## 🚀 Como Usar

### 📋 **Comando Local (Desenvolvimento)**
```bash
# Verificar arquivos específicos
npx eslint -c quality/eslint-import-guards.cjs "src/**/*.{ts,tsx}"

# Verificar apenas novos arquivos
npx eslint -c quality/eslint-import-guards.cjs "src/components/NewComponent.tsx"

# Com auto-fix para ordering (quando possível)
npx eslint -c quality/eslint-import-guards.cjs "src/**/*.{ts,tsx}" --fix
```

### 🔍 **Verificação por Pasta**
```bash
# Apenas components
npx eslint -c quality/eslint-import-guards.cjs "src/components/**/*.{ts,tsx}"

# Apenas hooks
npx eslint -c quality/eslint-import-guards.cjs "src/hooks/**/*.{ts,tsx}"

# Apenas utils
npx eslint -c quality/eslint-import-guards.cjs "src/utils/**/*.{ts,tsx}"
```

## 📊 Tipos de Avisos

### 🟡 **Deep Import Warnings**
```typescript
// 🟡 Warning: Considera usar barrel
import { Button } from '@/components/ui/button';
// 💡 Sugestão: import { Button } from '@/components/ui';

// 🟡 Warning: Considera usar facade
import { supabase } from '@/integrations/supabase/client';
// 💡 Sugestão: import { supabase } from '@/facades/integrations';
```

### 🟡 **Import Organization Warnings**
```typescript
// 🟡 Warning: Imports desordenados
import { useToast } from '@/hooks/use-toast';
import React from 'react';

// 💡 Sugestão: React primeiro, depois imports internos ordenados
import React from 'react';
import { useToast } from '@/hooks/use-toast';
```

### 🟡 **Duplicate Import Warnings**
```typescript
// 🟡 Warning: Imports duplicados
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 💡 Sugestão: Unificar quando possível
import { Button, Card } from '@/components/ui';
```

## 🎨 Exemplos de Melhorias

### ✅ **Antes → Depois**

```typescript
// ❌ Deep imports (gera warnings)
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// ✅ Imports organizados (sem warnings)
import React from 'react';

import { Button, Card, CardContent } from '@/components/ui';
import { useToast } from '@/hooks';
import { cn } from '@/lib';
import { supabase } from '@/facades/integrations';
```

## 🔧 Configuração para CI (Opcional)

### 📋 **GitHub Actions (Exemplo)**
```yaml
# .github/workflows/quality-checks.yml
name: Quality Checks (Non-blocking)

on: [pull_request]

jobs:
  import-guards:
    runs-on: ubuntu-latest
    continue-on-error: true  # Não falha o CI
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Import Guards (Warnings Only)
        run: |
          echo "🔍 Checking import patterns..."
          npx eslint -c quality/eslint-import-guards.cjs "src/**/*.{ts,tsx}" || true
          echo "✅ Import guards completed (warnings only)"
```

### 📋 **Package.json Script (Opcional)**
```json
{
  "scripts": {
    "lint:imports": "eslint -c quality/eslint-import-guards.cjs 'src/**/*.{ts,tsx}'",
    "lint:imports:fix": "eslint -c quality/eslint-import-guards.cjs 'src/**/*.{ts,tsx}' --fix"
  }
}
```

## 📈 Benefícios Graduais

### 🎯 **Para Novos Códigos**
- Sugestões automáticas para melhores patterns
- Descoberta mais fácil de APIs disponíveis
- Preparação para futuras refatorações

### 🔄 **Para Códigos Existentes**
- **Nenhuma pressão** para mudar imediatamente
- **Avisos contextuais** quando tocar em arquivos
- **Migração opcional** e gradual

### 🚀 **Para o Projeto**
- **Qualidade incremental** sem quebras
- **Padrões consistentes** para novos desenvolvedores
- **Base sólida** para futuras melhorias

## 🛡️ Garantias de Segurança

### ✅ **O que NÃO faz**
- ❌ Não altera arquivos existentes
- ❌ Não quebra builds de produção
- ❌ Não força mudanças imediatas
- ❌ Não interfere com eslintrc principal

### ✅ **O que faz**
- ✅ Sugere melhorias gentilmente
- ✅ Educa sobre patterns disponíveis
- ✅ Prepara para adoção gradual
- ✅ Mantém compatibilidade total

## 📚 Próximos Passos

1. **Testar localmente** com arquivos específicos
2. **Revisar sugestões** e adotar gradualmente
3. **Educar equipe** sobre benefits dos barrels/facades
4. **Monitorar adoção** e expandir regras conforme necessário