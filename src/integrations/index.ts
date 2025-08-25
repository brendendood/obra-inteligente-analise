/**
 * Integrations Barrel - Re-exports das integrações externas
 * Facilita importação dos clientes e serviços externos
 */

// Cliente Supabase principal
export { supabase } from '@/integrations/supabase/client';

// Tipos do Supabase
export type { Database } from '@/integrations/supabase/types';