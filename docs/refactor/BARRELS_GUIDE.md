# Guia de Barrels (index.ts)

## O que são Barrels?

Barrels são arquivos `index.ts` que re-exportam módulos de uma pasta, permitindo importações mais simples e organizadas.

## Padrões de Naming e Re-export

### ✅ **Padrão de Re-export Básico**
```typescript
// Para funções e classes nomeadas
export { NomeFuncao } from './arquivo';

// Para exports com múltiplas entidades
export { Entidade1, Entidade2, Entidade3 } from './arquivo';

// Para re-exportar tudo de um módulo
export * from './arquivo';

// Para default exports
export { default as NomeComponente } from './Componente';
```

### ✅ **Padrão de Documentação**
```typescript
/**
 * [Nome] Barrel - Re-exports dos [tipo] mais utilizados
 * Facilita importação com @/[pasta] ao invés de caminhos específicos
 */

// Comentários explicando o uso/frequência baseado em docs/inventory
export { ComponentePrincipal } from './component'; // 100+ componentes
export { ComponenteSecundario } from './secondary'; // 50+ componentes
```

### ✅ **Organização por Frequência**
Listar primeiro os módulos mais utilizados (baseado em docs/inventory/FILES_WITH_USAGE.md):
1. **100+ importações** - Top priority
2. **50-99 importações** - High priority  
3. **20-49 importações** - Medium priority
4. **10-19 importações** - Low priority

## Como Adicionar Novos Arquivos aos Barrels

### 📝 **Processo para Novos Módulos**

1. **Criar o arquivo normalmente** na pasta apropriada
2. **Avaliar frequência de uso esperada**
3. **Adicionar ao barrel correspondente** se for usado por 10+ arquivos
4. **Documentar no barrel** com comentário sobre uso esperado

### 📝 **Exemplo de Adição**
```typescript
// Novo hook criado em src/hooks/useNovoHook.ts
// Adicionar ao src/hooks/index.ts:

// Hooks utilitários
export { useExistente } from '@/hooks/useExistente';
export { useNovoHook } from '@/hooks/useNovoHook'; // Novo - uso estimado 15+ componentes
```

## Quando NÃO usar Barrels

❌ **Não criar barrel se:**
- Pasta tem menos de 3 arquivos
- Arquivos são usados por menos de 10 componentes
- Arquivos são muito específicos/internos
- Pasta contém apenas arquivos de configuração

## Estrutura de Barrels Criados

```
src/
├── utils/index.ts           # Utilitários principais + agentes
├── hooks/index.ts           # Hooks de auth, projeto e utilitários
├── lib/index.ts             # Bibliotecas core (utils, auth, validations)
├── components/
│   ├── ui/index.ts          # Componentes shadcn/ui mais usados
│   ├── layout/index.ts      # Componentes de layout (Sidebar, Header)
│   └── auth/index.ts        # Componentes de autenticação
└── integrations/index.ts    # Cliente Supabase e tipos
```

## Benefícios dos Barrels

### ✅ **Importações Mais Simples**
```typescript
// ❌ Antes - múltiplas linhas e caminhos longos
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';

// ✅ Depois - importação unificada
import { Button, Card, Dialog } from '@/components/ui';
```

### ✅ **Facilita Refatoração**
- Mover arquivos sem quebrar imports externos
- Centralizar pontos de entrada
- Melhor tree-shaking do bundler

### ✅ **Melhor Descoberta**
- Desenvolvedores sabem onde encontrar o que precisam
- IntelliSense mostra todas opções disponíveis
- Documentação concentrada no barrel

## Manutenção dos Barrels

### 🔄 **Revisão Periódica**
1. **Mensal:** Verificar se novos arquivos muito usados precisam ser adicionados
2. **Trimestral:** Remover re-exports de arquivos pouco utilizados
3. **Semestral:** Reorganizar por frequência de uso atualizada

### 📊 **Métricas para Avaliação**
- Número de importações via barrel vs. diretas
- Arquivos com 10+ importações que não estão no barrel
- Tempo de build e tree-shaking efficiency