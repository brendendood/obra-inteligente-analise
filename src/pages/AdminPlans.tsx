import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPlansTable } from "@/components/admin/AdminPlansTable";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

type AdminUser = { id: string; email: string | null };
type UserPlanRow = {
  user_id: string;
  plan_tier: "SOLO" | "STUDIO" | "ENTERPRISE";
  billing_cycle: "mensal" | "anual";
  seats: number;
  messages_quota: number;
};

export default function AdminPlansPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [plans, setPlans] = useState<UserPlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Verificar se é admin
        const { data: adminCheck } = await supabase.rpc('is_admin_user');
        
        if (!adminCheck) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // Carregar usuários
        const { data: profilesData } = await supabase
          .from('user_profiles')
          .select('user_id, full_name')
          .order('created_at', { ascending: false });

        // Buscar emails dos usuários do auth
        const userIds = profilesData?.map(p => p.user_id) || [];
        const usersWithEmails: AdminUser[] = [];

        if (userIds.length > 0) {
          // Como não podemos acessar auth.users diretamente, vamos usar o que temos
          for (const profile of profilesData || []) {
            usersWithEmails.push({
              id: profile.user_id,
              email: profile.full_name || profile.user_id
            });
          }
        }

        setUsers(usersWithEmails);

        // Carregar planos
        const { data: plansData } = await supabase
          .from('user_plans')
          .select('user_id, plan_tier, billing_cycle, seats, messages_quota');

        setPlans(plansData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="container mx-auto max-w-7xl space-y-6 px-4 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Admin • Planos de Usuário</h1>
        <p className="text-sm text-muted-foreground">
          Altere o plano, ciclo, assentos e cota de mensagens dos usuários.
          As mudanças são gravadas diretamente no banco (Supabase).
        </p>
      </div>

      <AdminPlansTable users={users} plans={plans} />
    </main>
  );
}