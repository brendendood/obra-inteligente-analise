import { createClient } from "@supabase/supabase-js";

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
 * Exporta dados do CRM do usuário logado
 */
export async function GET(request: Request) {
  try {
    // Obter token do usuário
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Criar cliente Supabase com token do usuário
    const supabase = createClient(
      "https://mozqijzvtbuwuzgemzsm.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1venFpanp2dGJ1d3V6Z2VtenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTI2NTcsImV4cCI6MjA2NjEyODY1N30.03WIeunsXuTENSrXfsFjCYy7jehJVYaWK2Nt00Fx8sA",
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    // Buscar dados do usuário
    const [{ data: clients }, { data: projects }] = await Promise.all([
      supabase.from("crm_clients").select("*").order("created_at", { ascending: false }),
      supabase.from("crm_projects").select("*").order("created_at", { ascending: false }),
    ]);

    const boundary = "----CRM-EXPORT-BOUNDARY";
    const body =
      `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="clients.csv"\r\n\r\n${toCSV(clients ?? [])}\r\n` +
      `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="projects.csv"\r\n\r\n${toCSV(projects ?? [])}\r\n` +
      `--${boundary}--`;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": `multipart/mixed; boundary=${boundary}`,
        "Content-Disposition": `attachment; filename="crm_export_${new Date().toISOString().slice(0,10)}.zip"`,
      },
    });
  } catch (error) {
    console.error('Erro na exportação:', error);
    return new Response('Erro interno do servidor', { status: 500 });
  }
}