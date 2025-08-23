-- Fix search path for the generate_order_token function
CREATE OR REPLACE FUNCTION public.generate_order_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path TO 'public';