import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

import { AdminStats } from '@/types/admin';

// Secure admin verification without hardcoded emails

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
        console.log('⏰ UNIFIED ADMIN: TIMEOUT - Verificação falhou');
        setIsAdmin(false);
        setLoading(false);
        setError('Timeout na verificação - acesso negado por segurança');
      }, 8000);

      try {
        // Secure verification - removed hardcoded email fallback
        // Admin access must be verified through proper database permissions only

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
          console.log('⏰ UNIFIED ADMIN: Timeout nas queries - acesso negado');
          setIsAdmin(false);
          setError('Verificação demorou muito - acesso negado por segurança');
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
        
        // Secure failure: deny access on any error
        setIsAdmin(false);
        setError(`Erro na verificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
      console.log('📊 UNIFIED ADMIN: Carregando estatísticas via RPC corrigida...');
      
      const { data: stats, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('❌ UNIFIED ADMIN: Erro ao carregar stats:', error);
        setError(`Erro ao carregar estatísticas: ${error.message}`);
        // Valores padrão em caso de erro
        setAdminStats({
          total_users: 0,
          total_projects: 0,
          active_subscriptions: 0,
          monthly_revenue: 0,
          new_users_this_month: 0,
          ai_usage_this_month: 0
        });
      } else if (stats && stats.length > 0) {
        console.log('✅ UNIFIED ADMIN: Stats carregadas:', stats[0]);
        setAdminStats(stats[0] as AdminStats);
      } else {
        console.warn('⚠️ UNIFIED ADMIN: RPC retornou dados vazios');
        // Valores padrão quando não há dados
        setAdminStats({
          total_users: 0,
          total_projects: 0,
          active_subscriptions: 0,
          monthly_revenue: 0,
          new_users_this_month: 0,
          ai_usage_this_month: 0
        });
      }
    } catch (error) {
      console.error('💥 UNIFIED ADMIN: Erro crítico ao carregar stats:', error);
      setError(`Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      // Valores padrão em caso de erro crítico
      setAdminStats({
        total_users: 0,
        total_projects: 0,
        active_subscriptions: 0,
        monthly_revenue: 0,
        new_users_this_month: 0,
        ai_usage_this_month: 0
      });
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