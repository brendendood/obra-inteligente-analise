"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, type CRMClient, type CRMProject, type CRMClientStatsView } from "@/lib/supabase/client";

export function useCRM() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [projects, setProjects] = useState<CRMProject[]>([]);
  const [stats, setStats] = useState<CRMClientStatsView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data: sessionData, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      if (!sessionData.session?.user) {
        setClients([]);
        setProjects([]);
        setStats([]);
        return;
      }

      const [{ data: c, error: cErr }, { data: p, error: pErr }] =
        await Promise.all([
          supabase.from("crm_clients").select("*").order("created_at", { ascending: false }),
          supabase.from("crm_projects").select("*").order("created_at", { ascending: false }),
        ]);

      if (cErr) throw cErr;
      if (pErr) throw pErr;

      setClients((c ?? []) as CRMClient[]);
      setProjects((p ?? []) as CRMProject[]);
      
      // Calcular estatísticas dos clientes localmente
      const clientsData = (c ?? []) as CRMClient[];
      const projectsData = (p ?? []) as CRMProject[];
      
      const statsData = clientsData.map(client => {
        const clientProjects = projectsData.filter(project => project.client_id === client.id);
        return {
          client_id: client.id,
          client_name: client.name,
          projects_count: clientProjects.length,
          total_value: clientProjects.reduce((sum, project) => sum + (project.value || 0), 0),
          last_project_date: clientProjects.length > 0 
            ? clientProjects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
            : null,
          owner_id: client.owner_id // Adicionando o campo obrigatório
        };
      });
      
      setStats(statsData as CRMClientStatsView[]);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar CRM");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const clientById = useMemo(() => {
    const map = new Map<string, CRMClient>();
    for (const c of clients) map.set(c.id, c);
    return map;
  }, [clients]);

  const mergedClients = useMemo(() => {
    const enriched = clients.map((c) => {
      const st = stats.find((s) => s.client_id === c.id);
      return {
        ...c,
        projectsCount: st?.projects_count ?? 0,
        totalValue: Number(st?.total_value ?? 0),
      };
    });
    return enriched;
  }, [clients, stats]);

  // CRUD - Clients
  const createClient = async (payload: Partial<CRMClient>) => {
    try {
      const { data, error } = await supabase.rpc('insert_crm_client', {
        p_name: payload.name || '',
        p_email: payload.email || null,
        p_phone: payload.phone || null,
        p_company: payload.company || null,
        p_status: payload.status || 'prospect',
        p_avatar: payload.avatar || null
      });
      if (error) throw error;
      await fetchAll();
      return data as CRMClient;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  };

  const updateClient = async (id: string, payload: Partial<CRMClient>) => {
    const { error } = await supabase
      .from("crm_clients")
      .update({ 
        name: payload.name, 
        email: payload.email ?? null, 
        phone: payload.phone ?? null, 
        company: payload.company ?? null, 
        status: payload.status, 
        avatar: payload.avatar ?? null,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from("crm_clients").delete().eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  // CRUD - Projects
  const createProject = async (payload: Partial<CRMProject>) => {
    try {
      const { data, error } = await supabase.rpc('insert_crm_project', {
        p_name: payload.name || '',
        p_client_id: payload.client_id || '',
        p_value: payload.value ?? 0,
        p_status: payload.status || 'planning',
        p_start_date: payload.start_date || new Date().toISOString().slice(0,10),
        p_end_date: payload.end_date || null,
        p_description: payload.description || null
      });
      if (error) throw error;
      await fetchAll();
      return data as CRMProject;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, payload: Partial<CRMProject>) => {
    const { error } = await supabase
      .from("crm_projects")
      .update({
        name: payload.name,
        client_id: payload.client_id,
        value: payload.value,
        status: payload.status,
        start_date: payload.start_date,
        end_date: payload.end_date,
        description: payload.description,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("crm_projects").delete().eq("id", id);
    if (error) throw error;
    await fetchAll();
  };

  return {
    loading, error,
    clients: mergedClients, projects, stats, clientById,
    createClient, updateClient, deleteClient,
    createProject, updateProject, deleteProject,
    refresh: fetchAll,
  };
}