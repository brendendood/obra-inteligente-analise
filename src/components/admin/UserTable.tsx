"use client";

import React, { useMemo, useState } from "react";
import { Plan, normalizePlan } from "@/lib/plan";
import { PlanBadge } from "./PlanBadge";
import { motion } from "framer-motion";
import { UserDetailsModal } from "./UserDetailsModal";
import { AdminUser as AdminUserInterface } from "@/hooks/useAdminUsers";

export type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  plan?: string | null;          // valor cru vindo do backend (pode estar errado)
  createdAt?: string | null;
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | string | null;
};

type Props = {
  users: AdminUser[];
  filterPlan: "ALL" | Plan;
  onFilterPlanChange: (value: "ALL" | Plan) => void;
  onUpdatePlan?: (userId: string, newPlan: string, resetMessages?: boolean) => Promise<boolean>;
  onResetMessages?: (userId: string) => Promise<boolean>;
  onAddCredit?: (userId: string, credits?: number) => Promise<boolean>;
  onDeleteUser?: (userId: string) => Promise<boolean>;
};

export default function UserTable({ 
  users, 
  filterPlan, 
  onFilterPlanChange, 
  onUpdatePlan = () => Promise.resolve(false),
  onResetMessages = () => Promise.resolve(false),
  onAddCredit = () => Promise.resolve(false),
  onDeleteUser = () => Promise.resolve(false)
}: Props) {
  const [selectedUser, setSelectedUser] = useState<AdminUserInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewUser = (user: AdminUser) => {
    // Converter AdminUser para AdminUserInterface
    const userForModal: AdminUserInterface = {
      id: user.id,
      user_id: user.id, // Assumindo que id é o mesmo que user_id
      email: user.email,
      email_confirmed_at: null,
      full_name: user.name,
      company: null,
      phone: null,
      city: null,
      state: null,
      country: null,
      cargo: null,
      avatar_url: null,
      gender: null,
      tags: null,
      created_at: user.createdAt || new Date().toISOString(),
      last_sign_in_at: null,
      plan: user.plan || 'BASIC',
      status: user.status || 'ACTIVE',
      real_location: '',
      last_login_ip: null,
      quiz_context: null,
      quiz_role: null,
      quiz_challenges: null,
      quiz_completed_at: null,
    };
    
    setSelectedUser(userForModal);
    setIsModalOpen(true);
  };
  const rows = useMemo(() => {
    const normalized = users.map((u) => ({
      ...u,
      _normalizedPlan: normalizePlan(u.plan),
    }));

    return filterPlan === "ALL"
      ? normalized
      : normalized.filter((u) => u._normalizedPlan === filterPlan);
  }, [users, filterPlan]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "ALL", label: "Todos" },
          { key: "BASIC", label: "Basic" },
          { key: "PRO", label: "Pro" },
          { key: "ENTERPRISE", label: "Enterprise" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterPlanChange(key as any)}
            className={`rounded-2xl px-3 py-1.5 text-sm border transition ${
              filterPlan === key
                ? "bg-black text-white border-black"
                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full table-fixed">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-4 py-3 w-[28%]">Usuário</th>
              <th className="px-4 py-3 w-[20%]">Plano</th>
              <th className="px-4 py-3 w-[18%]">Status</th>
              <th className="px-4 py-3 w-[18%]">Criado em</th>
              <th className="px-4 py-3 w-[16%]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  Nenhum usuário encontrado para o filtro atual.
                </td>
              </tr>
            ) : (
              rows.map((u, idx) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.01 }}
                  className="border-t border-slate-100 text-sm"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {u.name || u.email?.split("@")[0] || "Usuário"}
                      </span>
                      <span className="text-slate-500">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PlanBadge plan={normalizePlan(u.plan)} />
                      {u.plan &&
                        normalizePlan(u.plan) !== normalizePlan(u.plan) && (
                          <span className="text-xs text-amber-600">
                            corrigido
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-2xl border px-2 py-0.5 text-xs ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : u.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {u.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleViewUser(u)}
                      className="text-indigo-700 hover:underline font-medium"
                    >
                      Ver
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdatePlan={onUpdatePlan}
        onResetMessages={onResetMessages}
        onAddCredit={onAddCredit}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
}