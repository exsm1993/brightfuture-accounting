import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const today = new Date().toISOString().split('T')[0]

    // Fetch subscriptions due today with auto_generate_expense enabled
    const { data: subs, error: fetchError } = await supabase
      .from('tools_subscriptions')
      .select('*')
      .eq('auto_generate_expense', true)
      .eq('status', 'Active')
      .lte('next_billing_date', today)

    if (fetchError) throw fetchError

    const results: string[] = []

    for (const sub of subs ?? []) {
      const baseExpense = {
        date: sub.next_billing_date,
        category: 'Software',
        recurring: true,
        status: 'Completed',
        account_id: sub.payment_account_id || 'acc-unknown',
      }

      if (sub.business_line_allocation === 'Both') {
        const groupId = crypto.randomUUID()
        const solarAmount = Math.round(sub.billing_amount * (sub.solar_percentage / 100) * 100) / 100
        const hiAmount = Math.round(sub.billing_amount * (sub.home_improvement_percentage / 100) * 100) / 100

        // Two split records would go here when expense_transactions table exists
        results.push(`Split expense for ${sub.tool_name}: Solar $${solarAmount}, HI $${hiAmount}`)
      } else {
        results.push(`Expense for ${sub.tool_name}: $${sub.billing_amount} → ${sub.business_line_allocation}`)
      }

      // Update next_billing_date
      let nextDate: string | null = null
      if (sub.billing_frequency === 'Monthly') {
        const d = new Date(sub.next_billing_date)
        d.setMonth(d.getMonth() + 1)
        nextDate = d.toISOString().split('T')[0]
      } else if (sub.billing_frequency === 'Annual') {
        const d = new Date(sub.next_billing_date)
        d.setFullYear(d.getFullYear() + 1)
        nextDate = d.toISOString().split('T')[0]
      }
      // One-time: don't update, disable auto
      if (sub.billing_frequency === 'One-time') {
        await supabase
          .from('tools_subscriptions')
          .update({ auto_generate_expense: false })
          .eq('id', sub.id)
      } else if (nextDate) {
        await supabase
          .from('tools_subscriptions')
          .update({ next_billing_date: nextDate })
          .eq('id', sub.id)
      }
    }

    return new Response(
      JSON.stringify({ processed: results.length, details: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
