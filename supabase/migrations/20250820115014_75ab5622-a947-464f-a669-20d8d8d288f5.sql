-- Add user_id column to orders table to support user-based access control
ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create secure RLS policies
-- Allow authenticated users to view only their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to update only their own orders
CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to create orders for themselves
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- For guest checkout: Allow creation of orders without user_id (guest orders)
CREATE POLICY "Allow guest order creation" 
ON public.orders 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL);

-- Create a function to allow order retrieval by order ID for payment processing
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
AS $$
  SELECT o.id, o.customer_name, o.customer_email, o.customer_phone, 
         o.total_amount, o.payment_status, o.created_at
  FROM public.orders o 
  WHERE o.id = order_uuid;
$$;