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
 * Exporta TODOS os dados (admin). Requer SUPABASE_SERVICE_ROLE_KEY no servidor.
 */
export async function GET() {
  const admin = createClient(
    "https://mozqijzvtbuwuzgemzsm.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: clients }, { data: projects }, { data: stats }] = await Promise.all([
    admin.from("crm_clients").select("*"),
    admin.from("crm_projects").select("*"),
    admin.from("v_crm_client_stats").select("*"),
  ]);

  const boundary = "----CRM-EXPORT-BOUNDARY";
  const body =
    `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="clients.csv"\r\n\r\n${toCSV(clients ?? [])}\r\n` +
    `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="projects.csv"\r\n\r\n${toCSV(projects ?? [])}\r\n` +
    `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="client_stats.csv"\r\n\r\n${toCSV(stats ?? [])}\r\n` +
    `--${boundary}--`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": `multipart/mixed; boundary=${boundary}`,
      "Content-Disposition": `attachment; filename="crm_export_admin_${new Date().toISOString().slice(0,10)}.zipless"`,
    },
  });
}