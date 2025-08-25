/**
 * Utils Barrel - Re-exports dos utilitários mais utilizados
 * Facilita importação com @/utils ao invés de caminhos específicos
 */

// Utilitários principais (baseado em docs/inventory - 100+ componentes)
export { cn } from '@/lib/utils';

// Validação e segurança
export { validateUserInput, sanitizeFileName } from '@/utils/securityValidation';

// PDF e exportação (quando disponíveis)
// export * from '@/utils/pdf';
// export * from '@/utils/adminExportUtils';

// Upload (quando disponíveis)
// export * from '@/utils/upload/fileValidation';
// export * from '@/utils/upload/uploadUtils';

// Agentes (sistema muito usado)
export { sendMessageToAgent } from '@/utils/agents/unifiedAgentService';
export { SecureN8NService } from '@/utils/secureN8NService';