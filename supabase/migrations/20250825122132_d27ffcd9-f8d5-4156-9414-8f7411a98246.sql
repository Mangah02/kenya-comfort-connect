-- Fix the item_type constraint in order_items to allow 'room' and 'dining'
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_item_type_check;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_item_type_check 
  CHECK (item_type IN ('room', 'dining'));