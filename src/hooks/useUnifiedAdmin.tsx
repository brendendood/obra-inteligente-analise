
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

import { AdminStats } from '@/types/admin';

// Lista de emails admin para fallback de emergência
const ADMIN_EMAILS = [
  'brendendood2014@gmail.com',
  'seu_email@exemplo.com'
];

// Tipos para controle de Promise.race
type VerificationResult = 
  | { type: 'direct'; result: any }
  | { type: 'rpc'; result: any }
  | { type: 'timeout' };

export function useUnifiedAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cache e controle de timeout
  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastVerificationRef = useRef<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated || !user) {
        console.log('🔒 UNIFIED ADMIN: Usuário não autenticado');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Cache para evitar verificações repetitivas
      const cacheKey = `${user.id}-${user.email}`;
      if (lastVerificationRef.current === cacheKey) {
        console.log('📋 UNIFIED ADMIN: Usando resultado em cache');
        return;
      }

      console.log('🔍 UNIFIED ADMIN: Iniciando verificação otimizada para:', user.email);
      setError(null);

      // TIMEOUT DE SEGURANÇA - 8 segundos máximo
      verificationTimeoutRef.current = setTimeout(() => {
        console.log('⏰ UNIFIED ADMIN: TIMEOUT - Aplicando fallback por email');
        const isFallbackAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
        setIsAdmin(isFallbackAdmin);
        setLoading(false);
        if (!isFallbackAdmin) {
          setError('Timeout na verificação - usando verificação offline');
        }
      }, 8000);

      try {
        // FALLBACK IMEDIATO: Verificação por email para usuários conhecidos
        if (ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) {
          console.log('⚡ UNIFIED ADMIN: FALLBACK IMEDIATO - Email encontrado na lista admin');
          clearTimeout(verificationTimeoutRef.current);
          setIsAdmin(true);
          setLoading(false);
          lastVerificationRef.current = cacheKey;
          return;
        }

        // VERIFICAÇÃO 1: Query direta otimizada
        console.log('📊 UNIFIED ADMIN: Tentativa 1 - Query direta...');
        const directCheckPromise = supabase
          .from('admin_permissions')
          .select('role, active')
          .eq('user_id', user.id)
          .eq('active', true)
          .in('role', ['super_admin', 'marketing', 'financial', 'support'])
          .limit(1);

        // VERIFICAÇÃO 2: RPC function
        console.log('🔧 UNIFIED ADMIN: Tentativa 2 - RPC...');
        const rpcCheckPromise = supabase.rpc('is_superuser');

        // Executar ambas em paralelo com Promise.race para primeira resposta
        const raceResult = await Promise.race([
          directCheckPromise.then(result => ({ type: 'direct' as const, result })),
          rpcCheckPromise.then(result => ({ type: 'rpc' as const, result })),
          new Promise<{ type: 'timeout' }>(resolve => setTimeout(() => resolve({ type: 'timeout' }), 5000))
        ]) as VerificationResult;

        clearTimeout(verificationTimeoutRef.current);

        if (raceResult.type === 'timeout') {
          console.log('⏰ UNIFIED ADMIN: Timeout nas queries - aplicando fallback');
          const isFallbackAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
          setIsAdmin(isFallbackAdmin);
          if (!isFallbackAdmin) {
            setError('Verificação demorou muito - usando cache offline');
          }
        } else if (raceResult.type === 'direct') {
          const { data, error } = raceResult.result;
          if (!error && data && data.length > 0) {
            console.log('✅ UNIFIED ADMIN: Query direta bem-sucedida:', data);
            setIsAdmin(true);
          } else {
            console.log('⚠️ UNIFIED ADMIN: Query direta sem resultados');
            setIsAdmin(false);
          }
        } else if (raceResult.type === 'rpc') {
          const { data, error } = raceResult.result;
          if (!error && data) {
            console.log('✅ UNIFIED ADMIN: RPC bem-sucedido:', data);
            setIsAdmin(true);
          } else {
            console.log('⚠️ UNIFIED ADMIN: RPC falhou ou retornou false');
            setIsAdmin(false);
          }
        }

        lastVerificationRef.current = cacheKey;

      } catch (error) {
        console.error('💥 UNIFIED ADMIN: Erro durante verificação:', error);
        clearTimeout(verificationTimeoutRef.current);
        
        // FALLBACK FINAL: Verificar por email em caso de erro
        const isFallbackAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '');
        setIsAdmin(isFallbackAdmin);
        
        if (!isFallbackAdmin) {
          setError(`Erro na verificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    // Cleanup timeout ao desmontar
    return () => {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
    };
  }, [isAuthenticated, user]);

  const loadAdminStats = async () => {
    if (!isAdmin) {
      console.log('🚫 UNIFIED ADMIN: Não é admin, não carregando stats');
      return;
    }

    try {
      console.log('📊 UNIFIED ADMIN: Carregando estatísticas...');
      
      const { data: stats, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('❌ UNIFIED ADMIN: Erro ao carregar stats:', error);
        setError(`Erro ao carregar estatísticas: ${error.message}`);
      } else if (stats && stats.length > 0) {
        console.log('✅ UNIFIED ADMIN: Stats carregadas:', stats[0]);
        setAdminStats(stats[0] as AdminStats);
      }
    } catch (error) {
      console.error('💥 UNIFIED ADMIN: Erro crítico ao carregar stats:', error);
      setError(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Função para forçar nova verificação (debug)
  const forceRefresh = () => {
    setLoading(true);
    setError(null);
    // Recarregar componente
    window.location.reload();
  };

  return {
    isAdmin,
    adminStats,
    loading,
    error,
    user,
    loadAdminStats,
    forceRefresh,
  };
}
