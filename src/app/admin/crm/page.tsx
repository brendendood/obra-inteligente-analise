import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCRMPage() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: clients }, { data: projects }, { data: stats }] = await Promise.all([
    admin.from("crm_clients").select("*").order("created_at", { ascending: false }),
    admin.from("crm_projects").select("*").order("created_at", { ascending: false }),
    admin.from("v_crm_client_stats").select("*"),
  ]);

  return (
    <main className="container mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin • CRM</h1>
        <Button
          onClick={async () => {
            "use server"; // apenas decorativo, botão é renderizado no client pelo runtime
          }}
          asChild
        >
          <a href="/api/admin/crm/export" target="_blank" rel="noreferrer">Exportar (Excel/CSV)</a>
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
                {(clients ?? []).map((c: any) => (
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
          <CardTitle>Estatísticas dos Clientes</CardTitle>
          <CardDescription>Resumo consolidado dos clientes com projetos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Total de Projetos</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Último Projeto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(stats ?? []).map((s: any) => (
                  <TableRow key={s.client_id}>
                    <TableCell className="font-medium">{s.client_name}</TableCell>
                    <TableCell>{s.client_company ?? "—"}</TableCell>
                    <TableCell>{s.projects_count}</TableCell>
                    <TableCell>R$ {Number(s.total_value ?? 0).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>
                      {s.last_project_date 
                        ? new Date(s.last_project_date).toLocaleDateString("pt-BR")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        s.client_status === 'active' ? 'bg-green-100 text-green-800' :
                        s.client_status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {s.client_status}
                      </span>
                    </TableCell>
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
                {(projects ?? []).map((p: any) => (
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