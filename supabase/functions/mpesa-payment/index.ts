import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MpesaRequestBody {
  phone: string;
  amount: number;
  orderId: string;
  paymentId: string;
  accountReference: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
     const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { phone, amount, orderId, paymentId, accountReference }: MpesaRequestBody = await req.json();

    // Get M-Pesa credentials from environment
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
    const shortcode = Deno.env.get('MPESA_SHORTCODE');
    const passkey = Deno.env.get('MPESA_PASSKEY');

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      throw new Error('Missing M-Pesa configuration');
    }

    // Step 1: Get OAuth token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get M-Pesa access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    // Format phone number (ensure it starts with 254)
    const formattedPhone = phone.startsWith('254') ? phone : 
                          phone.startsWith('0') ? `254${phone.slice(1)}` : 
                          `254${phone}`;

    // Step 3: STK Push request
    const stkPushData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${supabaseUrl}/functions/v1/mpesa-callback`,
      AccountReference: accountReference,
      TransactionDesc: `Payment for Order ${accountReference}`
    };

    console.log('Sending STK Push request:', JSON.stringify(stkPushData, null, 2));

    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushData),
    });

    const stkData = await stkResponse.json();
    console.log('M-Pesa STK response:', JSON.stringify(stkData, null, 2));

    if (stkData.ResponseCode === '0') {
      // STK push sent successfully
      console.log(`STK push sent successfully. CheckoutRequestID: ${stkData.CheckoutRequestID}`);
      
      // Store the CheckoutRequestID for callback processing
      const { error: updateError } = await supabase
        .from('payments')
        .update({ 
          payment_status: 'pending',
          // Store M-Pesa transaction details in a metadata field if available
        })
        .eq('id', paymentId);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'STK push sent successfully',
        checkoutRequestId: stkData.CheckoutRequestID
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error(`M-Pesa STK push failed: ${stkData.errorMessage || stkData.ResponseDescription}`);
    }

  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});