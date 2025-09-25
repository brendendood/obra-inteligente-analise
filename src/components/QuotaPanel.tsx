// /components/QuotaPanel.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Limits = {
  planCode: 'BASIC'|'PRO'|'ENTERPRISE';
  periodKey: string;
  baseQuota: number|null;
  baseUsed: number;
  baseRemaining: number|null;
  bonusGrantedThisMonth: number;
  bonusUsedThisMonth: number;
  bonusRemainingThisMonth: number;
};

export default function QuotaPanel() {
  const [limits, setLimits] = useState<Limits | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Usuário não autenticado');
        }

        // Call the Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('user-limits', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          throw new Error(error.message || 'Falha ao carregar limites');
        }

        setLimits(data);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-5 rounded-2xl shadow bg-card border border-border flex flex-col gap-3">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-4 rounded-2xl shadow bg-destructive/10 border border-destructive/20">
        <div className="text-destructive font-medium">Erro</div>
        <div className="text-destructive/80 text-sm">{err}</div>
      </div>
    );
  }

  if (!limits) {
    return (
      <div className="p-4 rounded-2xl shadow bg-muted/50 border border-border">
        <div className="text-muted-foreground">Nenhum dado disponível</div>
      </div>
    );
  }

  const baseLabel = limits.baseQuota === null
    ? 'Ilimitado'
    : `${limits.baseUsed}/${limits.baseQuota}`;

  const getPlanColor = (planCode: string) => {
    switch (planCode) {
      case 'ENTERPRISE':
        return 'text-primary font-bold';
      case 'PRO':
        return 'text-blue-600 font-semibold';
      case 'BASIC':
        return 'text-green-600 font-medium';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="p-5 rounded-2xl shadow-sm bg-card border border-border flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-foreground">
          Seu plano: <span className={getPlanColor(limits.planCode)}>{limits.planCode}</span>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Período: {limits.periodKey}
      </div>

      <div className="mt-2 space-y-3">
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="font-medium text-foreground">Cota Base</div>
          <div className="text-foreground text-lg font-semibold">{baseLabel}</div>
          {limits.baseQuota !== null && limits.baseRemaining !== null && (
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${Math.min((limits.baseUsed / limits.baseQuota) * 100, 100)}%` 
                }}
              ></div>
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg bg-muted/30">
          <div className="font-medium text-foreground">Bônus do Mês</div>
          <div className="text-foreground text-lg font-semibold">
            {limits.bonusUsedThisMonth}/{limits.bonusGrantedThisMonth}
          </div>
          {limits.bonusGrantedThisMonth > 0 && (
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${Math.min((limits.bonusUsedThisMonth / limits.bonusGrantedThisMonth) * 100, 100)}%` 
                }}
              ></div>
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-1" title="Bônus expiram no fim do mês e não acumulam.">
            (não acumulam)
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/20 rounded-lg">
        <strong>Importante:</strong> Deletar projeto <strong>não</strong> devolve crédito nem libera espaço.
      </div>
    </div>
  );
}