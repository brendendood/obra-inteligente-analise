"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import {
  Users, DollarSign, TrendingUp, Plus, Search, Edit, Trash2,
  Building2, Mail, Phone, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import { useCRM } from "@/hooks/use-crm";
import type { CRMClient, CRMProject, CRMClientStatus, CRMProjectStatus } from "@/lib/supabase/client";

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    prospect: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    planning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "on-hold": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return <Badge variant="secondary" className={cn("capitalize", variants[status] || "")}>{status.replace("-", " ")}</Badge>;
};

function ClientForm({ client, onSave, onCancel }: {
  client?: CRMClient;
  onSave: (payload: Partial<CRMClient>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: client?.name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    company: client?.company ?? "",
    status: (client?.status ?? "prospect") as CRMClientStatus,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Input id="company" value={formData.company ?? ""} onChange={(e) => setFormData((s) => ({ ...s, company: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email ?? ""} onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" value={formData.phone ?? ""} onChange={(e) => setFormData((s) => ({ ...s, phone: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData((s) => ({ ...s, status: value as CRMClientStatus }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{client ? "Atualizar" : "Criar"} Cliente</Button>
      </DialogFooter>
    </form>
  );
}

function ProjectForm({ project, clients, onSave, onCancel }: {
  project?: CRMProject;
  clients: (CRMClient & { projectsCount?: number; totalValue?: number })[];
  onSave: (payload: Partial<CRMProject>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: project?.name ?? "",
    client_id: project?.client_id ?? "",
    value: project?.value ?? 0,
    status: (project?.status ?? "planning") as CRMProjectStatus,
    start_date: project?.start_date ?? "",
    end_date: project?.end_date ?? "",
    description: project?.description ?? "",
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pname">Nome do Projeto</Label>
          <Input id="pname" value={formData.name} onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Select value={formData.client_id} onValueChange={(value) => setFormData((s) => ({ ...s, client_id: value }))}>
            <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} — {c.company ?? "—"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Valor (R$)</Label>
          <Input id="value" type="number" value={formData.value} onChange={(e) => setFormData((s) => ({ ...s, value: Number(e.target.value) }))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(v) => setFormData((s) => ({ ...s, status: v as CRMProjectStatus }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planejamento</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="on-hold">Pausado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">Data de Início</Label>
          <Input id="start" type="date" value={formData.start_date} onChange={(e) => setFormData((s) => ({ ...s, start_date: e.target.value }))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end">Data de Término</Label>
          <Input id="end" type="date" value={formData.end_date ?? ""} onChange={(e) => setFormData((s) => ({ ...s, end_date: e.target.value }))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">Descrição</Label>
        <Input id="desc" value={formData.description ?? ""} onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))} placeholder="Descrição do projeto..." />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{project ? "Atualizar" : "Criar"} Projeto</Button>
      </DialogFooter>
    </form>
  );
}

export default function CRMDashboardPage() {
  const { loading, error, clients, projects, clientById,
    createClient, updateClient, deleteClient,
    createProject, updateProject, deleteProject } = useCRM();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<CRMClient | undefined>();
  const [editingProject, setEditingProject] = useState<CRMProject | undefined>();

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = (client.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        || (client.company ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        || (client.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "active").length;
  const totalValue = projects.reduce((sum, p) => sum + Number(p.value ?? 0), 0);
  const totalProjects = projects.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-muted-foreground">Carregando CRM...</div>
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CRM</h1>
            <p className="text-muted-foreground">Gerencie seus clientes e projetos — dados sincronizados ao Supabase.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={async () => {
              // export CSV do usuário
              const res = await fetch("/api/crm/export");
              const blob = await res.blob();
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `crm_export_${new Date().toISOString().slice(0,10)}.zipless`;
              a.click();
              URL.revokeObjectURL(a.href);
            }}>
              Exportar (Excel/CSV)
            </Button>

            <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingClient(undefined); }}>
                  <Plus className="h-4 w-4 mr-2" /> Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                  <DialogDescription>Preencha os dados do cliente.</DialogDescription>
                </DialogHeader>
                <ClientForm
                  client={editingClient}
                  onSave={async (payload) => {
                    if (editingClient) await updateClient(editingClient.id, payload);
                    else await createClient(payload);
                    setIsClientDialogOpen(false);
                    setEditingClient(undefined);
                  }}
                  onCancel={() => { setIsClientDialogOpen(false); setEditingClient(undefined); }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">{activeClients} ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalValue.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">Em projetos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground">Total de projetos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Prospects → Clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
          </TabsList>

          {/* Clientes */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Clientes</CardTitle>
                    <CardDescription>Gerencie seus clientes e suas informações</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center space-x-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Buscar clientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Projetos</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={client.avatar ?? undefined} />
                                <AvatarFallback>{client.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Cliente desde {new Date(client.created_at).toLocaleDateString("pt-BR")}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>{client.company ?? "—"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{client.email ?? "—"}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{client.phone ?? "—"}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><StatusBadge status={client.status} /></TableCell>
                          <TableCell>{(client as any).projectsCount ?? 0}</TableCell>
                          <TableCell>R$ {Number((client as any).totalValue ?? 0).toLocaleString("pt-BR")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => { setEditingClient(client); setIsClientDialogOpen(true); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={async () => { await deleteClient(client.id); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projetos */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projetos</CardTitle>
                    <CardDescription>Gerencie os projetos e associe-os a clientes</CardDescription>
                  </div>
                  <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingProject(undefined)}>
                        <Plus className="h-4 w-4 mr-2" /> Novo Projeto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingProject ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
                        <DialogDescription>Preencha os dados do projeto e atribua um cliente.</DialogDescription>
                      </DialogHeader>
                      <ProjectForm
                        project={editingProject}
                        clients={clients}
                        onSave={async (payload) => {
                          if (editingProject) await updateProject(editingProject.id, payload);
                          else await createProject(payload);
                          setIsProjectDialogOpen(false);
                          setEditingProject(undefined);
                        }}
                        onCancel={() => { setIsProjectDialogOpen(false); setEditingProject(undefined); }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Projeto</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Término</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((p) => {
                        const c = clientById.get(p.client_id);
                        return (
                          <TableRow key={p.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{p.name}</div>
                                <div className="text-sm text-muted-foreground">{p.description ?? ""}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {c && (
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {c.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-sm font-medium">{c.name}</div>
                                    <div className="text-xs text-muted-foreground">{c.company ?? "—"}</div>
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell><div className="font-medium">R$ {Number(p.value ?? 0).toLocaleString("pt-BR")}</div></TableCell>
                            <TableCell><StatusBadge status={p.status} /></TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{new Date(p.start_date).toLocaleDateString("pt-BR")}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {p.end_date ? (
                                <div className="flex items-center space-x-2 text-sm">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span>{new Date(p.end_date).toLocaleDateString("pt-BR")}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">Em andamento</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => { setEditingProject(p); setIsProjectDialogOpen(true); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={async () => { await deleteProject(p.id); }}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}