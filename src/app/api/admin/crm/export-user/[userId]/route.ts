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
 * Exporta dados do CRM de um usuário específico (admin).
 */
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const admin = createClient(
      "https://mozqijzvtbuwuzgemzsm.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Buscar dados do usuário
    const { data: userProfile, error: userError } = await admin
      .from("user_profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Buscar dados do CRM do usuário
    const [{ data: clients }, { data: projects }, { data: stats }] = await Promise.all([
      admin.from("crm_clients").select("*").eq("owner_id", userId),
      admin.from("crm_projects").select("*").eq("owner_id", userId),
      admin.from("v_crm_client_stats").select("*").eq("owner_id", userId),
    ]);

    const boundary = "----USER-CRM-EXPORT-BOUNDARY";
    const userInfo = `User: ${userProfile.full_name || 'N/A'} (${userProfile.email || 'N/A'})\nExported: ${new Date().toISOString()}\n\n`;
    
    const body =
      `--${boundary}\r\nContent-Type: text/plain\r\nContent-Disposition: attachment; filename="user_info.txt"\r\n\r\n${userInfo}\r\n` +
      `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="clients.csv"\r\n\r\n${toCSV(clients ?? [])}\r\n` +
      `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="projects.csv"\r\n\r\n${toCSV(projects ?? [])}\r\n` +
      `--${boundary}\r\nContent-Type: text/csv\r\nContent-Disposition: attachment; filename="client_stats.csv"\r\n\r\n${toCSV(stats ?? [])}\r\n` +
      `--${boundary}--`;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": `multipart/mixed; boundary=${boundary}`,
        "Content-Disposition": `attachment; filename="crm_user_${userId}_${new Date().toISOString().slice(0,10)}.zipless"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user CRM:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}