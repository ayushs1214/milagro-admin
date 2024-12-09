import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, event } = await req.json()

    switch (type) {
      case 'order':
        await handleOrderWebhook(supabase, event)
        break
      case 'payment':
        await handlePaymentWebhook(supabase, event)
        break
      default:
        throw new Error(`Unknown webhook type: ${type}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function handleOrderWebhook(supabase: any, event: any) {
  const { type, order } = event

  switch (type) {
    case 'order.created':
      await supabase.from('orders').insert(order)
      break
    case 'order.updated':
      await supabase.from('orders').update(order).eq('id', order.id)
      break
    case 'order.deleted':
      await supabase.from('orders').delete().eq('id', order.id)
      break
  }
}

async function handlePaymentWebhook(supabase: any, event: any) {
  const { type, payment } = event

  switch (type) {
    case 'payment.succeeded':
      await supabase.from('payments').insert(payment)
      await supabase.from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', payment.order_id)
      break
    case 'payment.failed':
      await supabase.from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', payment.order_id)
      break
  }
}