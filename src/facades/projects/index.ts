/**
 * Projects Facades - Gestão de projetos e stores
 * Re-exports para facilitar importação e estabilizar API pública
 */

// Store unificado de projetos
export { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';

// Navegação específica de projetos
export { useProjectNavigation } from '@/hooks/useProjectNavigation';

// Tipos de projeto
export type { Project } from '@/types/project';