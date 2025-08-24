import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  owner_id: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  client_id: string;
  value: number;
  status: string;
  start_date: string;
  end_date: string | null;
  owner_id: string;
  created_at: string;
}

export default function AdminCRMPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: clientsData, error: clientsError }, { data: projectsData, error: projectsError }] = await Promise.all([
          supabase.from("crm_clients").select("*").order("created_at", { ascending: false }),
          supabase.from("crm_projects").select("*").order("created_at", { ascending: false }),
        ]);

        if (clientsError) throw clientsError;
        if (projectsError) throw projectsError;

        setClients(clientsData || []);
        setProjects(projectsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = () => {
    window.open("/api/admin/crm/export", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-muted-foreground">Carregando dados do CRM...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-destructive">Erro: {error}</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin • CRM</h1>
        <Button onClick={handleExport} variant="outline">
          Exportar (Excel/CSV)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Todos os clientes (todas as contas)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.company ?? "—"}</TableCell>
                    <TableCell>{c.email ?? "—"}</TableCell>
                    <TableCell>{c.phone ?? "—"}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell className="text-xs">{c.owner_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projetos</CardTitle>
          <CardDescription>Todas as entradas de projetos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Cliente (ID)</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-xs">{p.client_id}</TableCell>
                    <TableCell>R$ {Number(p.value ?? 0).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{p.status}</TableCell>
                    <TableCell>{p.start_date}</TableCell>
                    <TableCell>{p.end_date ?? "—"}</TableCell>
                    <TableCell className="text-xs">{p.owner_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}