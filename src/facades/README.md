# Facades Layer - Camada de Fachadas

## Objetivo

A camada de facades tem como objetivo **estabilizar as superfícies públicas** da aplicação, fornecendo pontos de importação consistentes e organizados por domínio, sem alterar o código existente.

## Como Usar

Utilize o alias `@` que já aponta para `src` para importar via facades:

```typescript
// ❌ Import direto (ainda funciona, mas menos organizado)
import { useProjectNavigation } from '@/hooks/useProjectNavigation';
import { supabase } from '@/integrations/supabase/client';
import { sendMessageToAgent } from '@/utils/agents/unifiedAgentService';

// ✅ Import via facades (recomendado para novos códigos)
import { useProjectNavigation } from '@/facades/core';
import { supabase } from '@/facades/integrations';
import { sendMessageToAgent } from '@/facades/agents';
```

## Estrutura por Domínio

### `/facades/core`
- Hooks centrais e utilitários fundamentais
- Navegação e funcionalidades transversais

### `/facades/auth`
- Hooks e utilitários de autenticação
- Stores relacionados à autorização

### `/facades/projects`
- Gestão de projetos e stores relacionados
- Navegação específica de projetos

### `/facades/ui`
- Componentes de interface mais utilizados
- Hooks de UI (toast, etc.)

### `/facades/agents`
- Sistema de agentes de IA
- Tipos, schemas e configurações

### `/facades/integrations`
- Integrações externas (Supabase, N8N)
- Clientes de APIs

## Importante

- **Esta é apenas uma camada proxy** - não movemos arquivos existentes
- **Imports antigos continuam funcionando** - compatibilidade total
- **Re-exports** apontam para os módulos originais
- **API estável** para facilitar futuras refatorações

## Adoção Gradual

1. **Novos códigos**: Use facades preferencialmente
2. **Códigos existentes**: Mantenha imports atuais (não há pressa)
3. **Refatoração futura**: Migre gradualmente quando conveniente