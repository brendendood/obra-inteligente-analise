
"use client";

import React, { useEffect, useMemo, useState } from "react";
import UserTable, { AdminUser } from "./UserTable";
import { Plan, normalizePlan } from "@/lib/plan";
import { motion } from "framer-motion";
import { supabase } from '@/integrations/supabase/client';

type UsersResponse = {
  users: AdminUser[];
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filterPlan, setFilterPlan] = useState<"ALL" | Plan>("ALL");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      console.log('📊 ADMIN DASHBOARD: Carregando usuários via RPC...');
      
      const { data: usersData, error: usersError } = await supabase.rpc('get_admin_users_with_quiz_data');
      
      if (usersError) {
        console.error('❌ ADMIN DASHBOARD: Erro ao buscar usuários:', usersError);
        throw usersError;
      }

      if (!usersData) {
        console.warn('⚠️ ADMIN DASHBOARD: Nenhum usuário retornado');
        setUsers([]);
        setLastSync(new Date());
        return;
      }

      // Mapear dados do RPC para formato AdminUser
      const mappedUsers: AdminUser[] = usersData.map((user: any) => ({
        id: user.user_id,
        email: user.email,
        name: user.full_name,
        plan: user.plan,
        createdAt: user.created_at,
        status: user.status?.toUpperCase() || 'INACTIVE'
      }));

      // Segurança contra nulidade e duplicidade
      const cleanUsers = mappedUsers
        .filter((u) => u && u.id)
        .reduce<AdminUser[]>((acc, curr) => {
          if (!acc.find((x) => x.id === curr.id)) acc.push(curr);
          return acc;
        }, []);

      console.log('✅ ADMIN DASHBOARD: Usuários carregados:', cleanUsers.length);
      setUsers(cleanUsers);
      setLastSync(new Date());
    } catch (e: any) {
      console.error('💥 ADMIN DASHBOARD: Erro ao carregar usuários:', e);
      setError(e?.message || "Erro inesperado ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    const iv = setInterval(fetchUsers, 30_000); // revalida a cada 30s
    return () => clearInterval(iv);
  }, []);

  const { total, perPlan } = useMemo(() => {
    const byPlan: Record<Plan, number> = { BASIC: 0, PRO: 0, ENTERPRISE: 0 };
    for (const u of users) {
      byPlan[normalizePlan(u.plan)]++;
    }
    return {
      total: users.length,
      perPlan: byPlan,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">
            Tudo sincronizado a partir da mesma fonte de dados (sem divergências).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Atualizar
          </button>
          {lastSync && (
            <span className="text-xs text-slate-500">
              Atualizado: {lastSync.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Cards de métricas (SEM "Status da API") */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Total de usuários" value={total} />
        <StatCard title="Basic" value={perPlan.BASIC} />
        <StatCard title="Pro" value={perPlan.PRO} />
        <StatCard title="Enterprise" value={perPlan.ENTERPRISE} />
      </div>

      {/* Tabela de usuários */}
      <UserTable
        users={users}
        filterPlan={filterPlan}
        onFilterPlanChange={setFilterPlan}
      />

      {/* Estados de erro / loading */}
      {loading && (
        <div className="text-sm text-slate-500">Carregando usuários...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">
          Erro ao carregar: {error}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </motion.div>
  );
}
