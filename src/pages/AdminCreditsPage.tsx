// /src/pages/admin/credits.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, User, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditLedgerEntry {
  id: string;
  created_at: string;
  period_key: string;
  type: 'BASE' | 'BONUS_MONTHLY';
  user_id: string;
  project_id: string | null;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  company: string;
}

export default function AdminCreditsPage() {
  const [ledgerData, setLedgerData] = useState<CreditLedgerEntry[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Você precisa estar logado para acessar esta página.');
        setLoading(false);
        return;
      }

      // Check if user has admin permissions
      const { data: adminData, error: adminError } = await supabase
        .from('admin_permissions')
        .select('role')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (adminError || !adminData) {
        setError('Acesso negado. Você não tem permissões de administrador.');
        setLoading(false);
        return;
      }

      await loadCreditData();
    } catch (err) {
      console.error('Admin access check failed:', err);
      setError('Erro ao verificar permissões administrativas.');
      setLoading(false);
    }
  }

  async function loadCreditData() {
    try {
      setLoading(true);
      
      // Fetch credit ledger data
      const { data: ledger, error: ledgerError } = await supabase
        .from('credit_ledger')
        .select('id, created_at, period_key, type, user_id, project_id')
        .order('created_at', { ascending: false })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

      if (ledgerError) {
        throw new Error(`Erro ao carregar dados: ${ledgerError.message}`);
      }

      setLedgerData(prev => page === 0 ? (ledger as CreditLedgerEntry[] || []) : [...prev, ...(ledger as CreditLedgerEntry[] || [])]);
      setHasMore((ledger?.length || 0) === ITEMS_PER_PAGE);

      // Get unique user IDs
      const userIds = [...new Set((ledger || []).map(entry => entry.user_id))];
      
      // Fetch user profiles for display names
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('user_id, full_name, company')
          .in('user_id', userIds);

        if (!profilesError && profiles) {
          const profileMap = new Map(profiles.map(p => [p.user_id, p]));
          setUserProfiles(prev => new Map([...prev, ...profileMap]));
        }
      }

    } catch (err) {
      console.error('Failed to load credit data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      toast({
        title: "❌ Erro ao carregar dados",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const loadMore = () => {
    setPage(prev => prev + 1);
    loadCreditData();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BASE':
        return 'bg-primary text-primary-foreground';
      case 'BONUS_MONTHLY':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatUserDisplay = (userId: string) => {
    const profile = userProfiles.get(userId);
    if (profile) {
      return `${profile.full_name}${profile.company ? ` (${profile.company})` : ''}`;
    }
    return userId.substring(0, 8) + '...';
  };

  if (loading && page === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando auditoria de créditos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">Erro de acesso</span>
            </div>
            <p className="text-muted-foreground mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria de Créditos</h1>
        <p className="text-muted-foreground">
          Histórico completo de uso de créditos na plataforma
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Total de registros: {ledgerData.length}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Período atual: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid gap-3">
        {ledgerData.map((entry) => (
          <Card key={`${entry.id}-${entry.created_at}`} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge className={getTypeColor(entry.type)}>
                      {entry.type === 'BASE' ? 'Base' : 'Bônus Mensal'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Período: {entry.period_key}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatUserDisplay(entry.user_id)}
                    </span>
                    <span className="text-muted-foreground">
                      ({entry.user_id.substring(0, 8)}...)
                    </span>
                  </div>

                  {entry.project_id && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Projeto: {entry.project_id.substring(0, 8)}...</span>
                    </div>
                  )}
                </div>
                
                <div className="text-right text-sm text-muted-foreground">
                  <div>{new Date(entry.created_at).toLocaleDateString('pt-BR')}</div>
                  <div>{new Date(entry.created_at).toLocaleTimeString('pt-BR')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={loadMore} 
            variant="outline" 
            disabled={loading}
            className="min-w-[150px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              'Carregar mais'
            )}
          </Button>
        </div>
      )}

      {!hasMore && ledgerData.length > 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Todos os registros foram carregados
        </div>
      )}

      {ledgerData.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Nenhum registro encontrado</h3>
            <p className="text-muted-foreground">
              Não há registros de créditos no sistema ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}