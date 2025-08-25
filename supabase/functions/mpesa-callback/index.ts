import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const callbackData = await req.json();
    console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const { stkCallback } = Body;

    if (!stkCallback) {
      console.error('Invalid callback format');
      return new Response('Invalid callback format', { status: 400 });
    }

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;

    console.log(`Processing callback - ResultCode: ${ResultCode}, CheckoutRequestID: ${CheckoutRequestID}`);

    if (ResultCode === 0) {
      // Payment successful
      let mpesaReceiptNumber = '';
      let transactionDate = '';
      let phoneNumber = '';
      let amount = 0;

      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach((item: any) => {
          switch (item.Name) {
            case 'MpesaReceiptNumber':
              mpesaReceiptNumber = item.Value;
              break;
            case 'TransactionDate':
              transactionDate = item.Value;
              break;
            case 'PhoneNumber':
              phoneNumber = item.Value;
              break;
            case 'Amount':
              amount = item.Value;
              break;
          }
        });
      }

      console.log(`Payment successful - Receipt: ${mpesaReceiptNumber}, Amount: ${amount}`);

      // Find the payment record using the account reference or amount
      // Since we don't have a direct link to CheckoutRequestID in our payments table,
      // we'll update based on amount and status
      const { data: payments, error: findError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_status', 'pending')
        .eq('total', amount)
        .eq('payment_method', 'mpesa');

      if (findError) {
        console.error('Error finding payment:', findError);
        return new Response('Error finding payment', { status: 500 });
      }

      // Update the most recent matching payment
      if (payments && payments.length > 0) {
        const payment = payments[0]; // Take the most recent one
        
        const { error: updateError } = await supabase
          .from('payments')
          .update({
            payment_status: 'paid',
            // You might want to add additional fields to store M-Pesa details
          })
          .eq('id', payment.id);

        if (updateError) {
          console.error('Error updating payment status:', updateError);
          return new Response('Error updating payment', { status: 500 });
        }

        // Also update the corresponding order
        const { error: orderUpdateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid'
          })
          .eq('total_amount', amount)
          .eq('payment_method', 'mpesa')
          .eq('payment_status', 'pending');

        if (orderUpdateError) {
          console.error('Error updating order status:', orderUpdateError);
        }

        console.log(`Payment ${payment.id} marked as paid`);
      } else {
        console.log('No matching payment found for amount:', amount);
      }

    } else {
      // Payment failed or cancelled
      console.log(`Payment failed - ResultCode: ${ResultCode}, Description: ${ResultDesc}`);

      // Update payments that might be pending
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          payment_status: 'failed'
        })
        .eq('payment_status', 'pending')
        .eq('payment_method', 'mpesa');

      if (updateError) {
        console.error('Error updating failed payment status:', updateError);
      }
    }

    // Always return success to M-Pesa to acknowledge receipt
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Accepted"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('M-Pesa callback error:', error);
    
    // Still return success to M-Pesa to avoid retries
    return new Response(JSON.stringify({
      ResultCode: 0,
      ResultDesc: "Accepted"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});