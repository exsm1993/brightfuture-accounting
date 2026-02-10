import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dealId = url.searchParams.get("deal_id");
    const installer = url.searchParams.get("installer_id");
    const outcome = url.searchParams.get("outcome");
    const state = url.searchParams.get("state_id");
    const campaign = url.searchParams.get("campaign");
    const source = url.searchParams.get("source");
    const dateFrom = url.searchParams.get("date_from");
    const dateTo = url.searchParams.get("date_to");
    const dateField = url.searchParams.get("date_field") || "crc_date";
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "200");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const mysqlHost = Deno.env.get("MYSQL_HOST") || "";
    const mysqlUser = Deno.env.get("MYSQL_USER") || "";
    const mysqlDb = Deno.env.get("MYSQL_DATABASE") || "";
    console.log("Connecting to MySQL:", { host: mysqlHost, user: mysqlUser, db: mysqlDb });

    const client = await new Client().connect({
      hostname: mysqlHost,
      username: mysqlUser,
      password: Deno.env.get("MYSQL_PASSWORD") || "",
      db: mysqlDb,
    });

    const TENANT_ID = "initiatesolarOXfz5njtqGBi3PecEA40vQsN91CZrw";

    let whereClause = "WHERE a.tenant_id = ?";
    const params: unknown[] = [TENANT_ID];

    if (dealId) {
      whereClause += " AND a.appointment_id = ?";
      params.push(dealId);
    }

    if (installer) {
      whereClause += " AND a.installer_id = ?";
      params.push(installer);
    }

    if (outcome) {
      whereClause += " AND a.outcome_name = ?";
      params.push(outcome);
    }

    if (state) {
      whereClause += " AND a.state_id = ?";
      params.push(state);
    }

    if (campaign) {
      whereClause += " AND a.campaign_name_LFlowspot LIKE ?";
      params.push(`%${campaign}%`);
    }

    if (source) {
      whereClause += " AND a.source_LFlowspot = ?";
      params.push(source);
    }

    if (dateFrom) {
      const col = dateField === "date_created" ? "a.date_created" : "a.crc_date";
      whereClause += ` AND ${col} >= ?`;
      params.push(dateFrom);
    }

    if (dateTo) {
      const col = dateField === "date_created" ? "a.date_created" : "a.crc_date";
      whereClause += ` AND ${col} <= ?`;
      params.push(dateTo);
    }

    if (search) {
      whereClause +=
        " AND (a.customer_name_LFlowspot LIKE ? OR CAST(a.appointment_id AS CHAR) LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const query = `
      SELECT 
        a.appointment_id,
        a.external_project_id,
        a.lead_id,
        a.customer_name_LFlowspot,
        a.email_LFlowspot,
        a.phone_LFlowspot,
        a.source_LFlowspot,
        a.campaign_name_LFlowspot,
        a.date_created,
        a.crc_date,
        a.appointment_datetime,
        a.appointment_time,
        a.commission_true,
        a.installer_id,
        a.outcome_name,
        a.status,
        a.id_sales_rep,
        a.id_sales_rep_2,
        a.manager,
        a.created_by,
        a.state_id,
        a.financier,
        a.credit_score,
        a.bill_amount,
        a.roof_age,
        a.replace_roof
      FROM tbl_assign_appointment a
      ${whereClause}
      ORDER BY a.date_created DESC
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    const rows = await client.query(query, params);

    // Get distinct values for filters
    let filterOptions = null;
    if (!dealId) {
      const [outcomes, states, campaigns, sources, installers] =
        await Promise.all([
          client.query(
            "SELECT DISTINCT outcome_name FROM tbl_assign_appointment WHERE tenant_id = ? AND outcome_name IS NOT NULL AND outcome_name != '' ORDER BY outcome_name",
            [TENANT_ID]
          ),
          client.query(
            "SELECT DISTINCT state_id FROM tbl_assign_appointment WHERE tenant_id = ? AND state_id IS NOT NULL AND state_id != '' ORDER BY state_id",
            [TENANT_ID]
          ),
          client.query(
            "SELECT DISTINCT campaign_name_LFlowspot FROM tbl_assign_appointment WHERE tenant_id = ? AND campaign_name_LFlowspot IS NOT NULL AND campaign_name_LFlowspot != '' ORDER BY campaign_name_LFlowspot LIMIT 50",
            [TENANT_ID]
          ),
          client.query(
            "SELECT DISTINCT source_LFlowspot FROM tbl_assign_appointment WHERE tenant_id = ? AND source_LFlowspot IS NOT NULL AND source_LFlowspot != '' ORDER BY source_LFlowspot",
            [TENANT_ID]
          ),
          client.query(
            "SELECT DISTINCT installer_id FROM tbl_assign_appointment WHERE tenant_id = ? AND installer_id IS NOT NULL AND installer_id != '' ORDER BY installer_id",
            [TENANT_ID]
          ),
        ]);

      filterOptions = {
        outcomes: outcomes.map((r: Record<string, unknown>) => r.outcome_name),
        states: states.map((r: Record<string, unknown>) => r.state_id),
        campaigns: campaigns.map(
          (r: Record<string, unknown>) => r.campaign_name_LFlowspot
        ),
        sources: sources.map(
          (r: Record<string, unknown>) => r.source_LFlowspot
        ),
        installerIds: installers.map(
          (r: Record<string, unknown>) => r.installer_id
        ),
      };
    }

    await client.close();

    // Map rows to deal objects
    const deals = rows.map((row: Record<string, unknown>) => ({
      deal_id: String(row.appointment_id),
      external_project_id: row.external_project_id || null,
      lead_id: row.lead_id || null,
      customer_name: row.customer_name_LFlowspot || "",
      customer_email: row.email_LFlowspot || null,
      customer_phone: row.phone_LFlowspot || null,
      source_system: row.source_LFlowspot || null,
      campaign_name: row.campaign_name_LFlowspot || null,
      date_created: row.date_created || null,
      date_signed: row.crc_date || row.appointment_datetime || null,
      appointment_date: row.appointment_datetime || null,
      appointment_time: row.appointment_time || null,
      business_line: "Solar",
      deal_amount:
        row.commission_true && Number(row.commission_true) > 0
          ? Number(row.commission_true)
          : 0,
      installer_id: row.installer_id ? String(row.installer_id) : null,
      status: row.outcome_name || "",
      appointment_status: row.status || null,
      setter_id: row.id_sales_rep || null,
      secondary_setter_id: row.id_sales_rep_2 || null,
      manager_id: row.manager || null,
      created_by: row.created_by || null,
      state_id: row.state_id || null,
      financier: row.financier || null,
      credit_score: row.credit_score != null ? Number(row.credit_score) : null,
      bill_amount: row.bill_amount != null ? Number(row.bill_amount) : null,
      roof_age: row.roof_age != null ? Number(row.roof_age) : null,
      replace_roof: row.replace_roof || null,
    }));

    return new Response(
      JSON.stringify({ deals, filterOptions }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching deals:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
