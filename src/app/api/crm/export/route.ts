import { supabase } from "@/integrations/supabase/client";

function toCSV(rows: any[]): string {
  if (!rows || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => {
        const val = r[h];
        if (val === null || val === undefined) return "";
        const s = String(val).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      }).join(",")
    ),
  ];
  return csvRows.join("\n");
}

/**
 * Exporta dados do CRM do usuário autenticado (cliente + projetos + stats) em CSV.
 * Admin pode exportar de todos passando ?scope=admin (requer service role, ver rota abaixo).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") ?? "user"; // "user"

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "not_authenticated" }), { status: 401 });

  // Clientes do usuário
  const { data: clients } = await supabase.from("crm_clients").select("*");
  const { data: projects } = await supabase.from("crm_projects").select("*");
  const { data: stats } = await supabase.from("v_crm_client_stats").select("*");

  const clientsCsv = toCSV(clients ?? []);
  const projectsCsv = toCSV(projects ?? []);
  const statsCsv = toCSV(stats ?? []);

  const boundary = "----CRM-EXPORT-BOUNDARY";
  const body =
    `--${boundary}\r\nContent-Type: text/csv; charset=utf-8\r\nContent-Disposition: attachment; filename="clients.csv"\r\n\r\n` +
    clientsCsv + `\r\n--${boundary}\r\nContent-Type: text/csv; charset=utf-8\r\nContent-Disposition: attachment; filename="projects.csv"\r\n\r\n` +
    projectsCsv + `\r\n--${boundary}\r\nContent-Type: text/csv; charset=utf-8\r\nContent-Disposition: attachment; filename="client_stats.csv"\r\n\r\n` +
    statsCsv + `\r\n--${boundary}--`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": `multipart/mixed; boundary=${boundary}`,
      "Content-Disposition": `attachment; filename="crm_export_${new Date().toISOString().slice(0,10)}.zipless"`,
    },
  });
}