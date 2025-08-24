-- Fix order_type constraint to allow correct order types
ALTER TABLE public.orders 
DROP CONSTRAINT orders_order_type_check;

-- Add proper check constraint for order_type with correct values
ALTER TABLE public.orders 
ADD CONSTRAINT orders_order_type_check 
CHECK (order_type IN ('hotel_booking', 'restaurant_order', 'room_service', 'event_booking', 'food', 'room'));