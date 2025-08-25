/**
 * Integrations Facades - Integrações externas e APIs
 * Re-exports para facilitar importação e estabilizar API pública
 */

// Cliente Supabase
export { supabase } from '@/integrations/supabase/client';

// Tipos do Supabase
export type { Database } from '@/integrations/supabase/types';

// Serviço seguro N8N
export { SecureN8NService } from '@/utils/secureN8NService';