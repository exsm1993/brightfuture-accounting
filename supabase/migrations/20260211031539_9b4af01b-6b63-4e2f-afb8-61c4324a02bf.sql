
-- Create call_centers table
CREATE TABLE public.call_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_center_name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'External' CHECK (type IN ('Internal', 'External')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.call_centers ENABLE ROW LEVEL SECURITY;

-- Allow full access (no auth in this app)
CREATE POLICY "Allow full access to call_centers"
ON public.call_centers
FOR ALL
USING (true)
WITH CHECK (true);

-- Timestamp trigger
CREATE TRIGGER update_call_centers_updated_at
BEFORE UPDATE ON public.call_centers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial records
INSERT INTO public.call_centers (call_center_name, type) VALUES
  ('Bright Future Call Center', 'Internal'),
  ('External Call Center', 'External');
