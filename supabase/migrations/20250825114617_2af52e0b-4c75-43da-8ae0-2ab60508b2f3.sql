-- Create payments table with the specified schema
CREATE TABLE public.payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     uuid,   -- optional, reference your customers table later
  subtotal        numeric,
  service_charge  numeric,
  vat             numeric,
  delivery_fee    numeric,
  total           numeric,
  payment_method  text CHECK (payment_method IN ('mpesa', 'paypal', 'card')),
  payment_status  text CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at      timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments access
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own payments" 
ON public.payments 
FOR UPDATE 
USING (auth.uid() = customer_id);