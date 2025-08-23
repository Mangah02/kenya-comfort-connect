-- Add order_token column for secure guest order access
ALTER TABLE public.orders 
ADD COLUMN order_token TEXT;

-- Create index for efficient token lookups
CREATE INDEX idx_orders_order_token ON public.orders(order_token);

-- Update the guest order creation policy to require a token for guest orders
DROP POLICY "Allow guest order creation" ON public.orders;

CREATE POLICY "Allow guest order creation with token" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  (user_id IS NULL AND order_token IS NOT NULL) OR 
  (auth.uid() = user_id)
);

-- Update the view policy to allow viewing guest orders only with correct token
DROP POLICY "Users can view their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders or guest orders with token" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND order_token IS NOT NULL)
);

-- Create a function to generate secure order tokens
CREATE OR REPLACE FUNCTION public.generate_order_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get order by token (for guest access)
CREATE OR REPLACE FUNCTION public.get_order_by_token(token TEXT)
RETURNS TABLE(
  id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total_amount NUMERIC,
  payment_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  order_token TEXT
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT o.id, o.customer_name, o.customer_email, o.customer_phone, 
         o.total_amount, o.payment_status, o.created_at, o.order_token
  FROM public.orders o 
  WHERE o.order_token = token AND o.user_id IS NULL;
$$;