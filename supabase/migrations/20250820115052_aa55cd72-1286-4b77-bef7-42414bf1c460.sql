-- Fix security warnings by updating functions with proper search_path

-- Update existing function to have secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the order retrieval function with secure search_path
CREATE OR REPLACE FUNCTION public.get_order_by_id(order_uuid UUID)
RETURNS TABLE (
  id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total_amount NUMERIC,
  payment_status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.customer_name, o.customer_email, o.customer_phone, 
         o.total_amount, o.payment_status, o.created_at
  FROM public.orders o 
  WHERE o.id = order_uuid;
$$;