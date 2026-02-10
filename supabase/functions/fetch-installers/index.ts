import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TENANT_ID = "initiatesolarOXfz5njtqGBi3PecEA40vQsN91CZrw";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const client = await new Client().connect({
      hostname: Deno.env.get("MYSQL_HOST") || "",
      username: Deno.env.get("MYSQL_USER") || "",
      password: Deno.env.get("MYSQL_PASSWORD") || "",
      db: Deno.env.get("MYSQL_DATABASE") || "",
    });

    const rows = await client.query(
      `SELECT installer_id, epc_name, contact_email, installers_phone, status, default_redline
       FROM tbl_installers
       WHERE tenant_id = ?
       ORDER BY epc_name ASC`,
      [TENANT_ID]
    );

    await client.close();

    const installers = rows.map((row: Record<string, unknown>) => ({
      installer_id: String(row.installer_id),
      installer_name: row.epc_name || "",
      contact_email: row.contact_email || "",
      installer_phone: row.installers_phone || "",
      active: row.status === 1,
      default_redline: row.default_redline != null ? Number(row.default_redline) : 0,
    }));

    return new Response(
      JSON.stringify({ installers }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching installers:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
