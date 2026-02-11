
-- Create tools_subscriptions table
CREATE TABLE public.tools_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL,
  vendor_name TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  status TEXT NOT NULL DEFAULT 'Active',
  billing_frequency TEXT NOT NULL DEFAULT 'Monthly',
  billing_amount NUMERIC NOT NULL DEFAULT 0,
  next_billing_date DATE,
  business_line_allocation TEXT NOT NULL DEFAULT 'Solar',
  solar_percentage NUMERIC NOT NULL DEFAULT 100,
  home_improvement_percentage NUMERIC NOT NULL DEFAULT 0,
  call_center_id UUID REFERENCES public.call_centers(id),
  used_by TEXT,
  payment_account_id TEXT,
  auto_generate_expense BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to tools_subscriptions"
ON public.tools_subscriptions
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_tools_subscriptions_updated_at
BEFORE UPDATE ON public.tools_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Validate percentages trigger (reuse logic)
CREATE OR REPLACE FUNCTION public.validate_tools_subscriptions_percentages()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.business_line_allocation = 'Solar' THEN
    NEW.solar_percentage := 100;
    NEW.home_improvement_percentage := 0;
  ELSIF NEW.business_line_allocation = 'Home Improvement' THEN
    NEW.solar_percentage := 0;
    NEW.home_improvement_percentage := 100;
  ELSIF NEW.business_line_allocation = 'Both' THEN
    IF NEW.solar_percentage = 0 AND NEW.home_improvement_percentage = 0 THEN
      NEW.solar_percentage := 50;
      NEW.home_improvement_percentage := 50;
    END IF;
    IF NEW.solar_percentage + NEW.home_improvement_percentage != 100 THEN
      RAISE EXCEPTION 'Solar and Home Improvement percentages must sum to 100';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_tools_subscriptions_percentages_trigger
BEFORE INSERT OR UPDATE ON public.tools_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.validate_tools_subscriptions_percentages();
