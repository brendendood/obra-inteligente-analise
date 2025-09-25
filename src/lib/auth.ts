// /lib/auth.ts
// Helper para extrair userId do Supabase Auth em diferentes contextos

import { supabase } from '@/integrations/supabase/client';

/**
 * Extrai userId de uma requisição com token JWT no header Authorization
 * Para uso em Edge Functions do Supabase
 */
export async function getAuthenticatedUserIdFromRequest(authHeader: string | null): Promise<string> {
  if (!authHeader) {
    throw new Error('UNAUTHENTICATED: Missing Authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('INVALID_TOKEN: ' + (error?.message || 'User not found'));
  }

  return user.id;
}

/**
 * Obtém o usuário autenticado atual no cliente
 * Para uso em componentes React
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('UNAUTHENTICATED: ' + (error?.message || 'User not found'));
  }

  return user.id;
}

/**
 * Obtém a sessão atual do usuário
 * Para uso em componentes React
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error('SESSION_ERROR: ' + error.message);
  }

  return session;
}

/**
 * Verifica se o usuário está autenticado
 * Para uso em componentes React
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Utilitário para extrair token do header Authorization
 */
export function extractTokenFromAuthHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  return authHeader.replace('Bearer ', '');
}