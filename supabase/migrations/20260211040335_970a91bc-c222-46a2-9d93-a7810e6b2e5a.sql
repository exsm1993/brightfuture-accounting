
-- Add business line assignment fields to people table
ALTER TABLE public.people 
ADD COLUMN business_line_assignment text NOT NULL DEFAULT 'Solar',
ADD COLUMN solar_percentage numeric(5,2) NOT NULL DEFAULT 100,
ADD COLUMN home_improvement_percentage numeric(5,2) NOT NULL DEFAULT 0;

-- Add validation trigger to ensure percentages sum to 100
CREATE OR REPLACE FUNCTION public.validate_people_percentages()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-set percentages for single business lines
  IF NEW.business_line_assignment = 'Solar' THEN
    NEW.solar_percentage := 100;
    NEW.home_improvement_percentage := 0;
  ELSIF NEW.business_line_assignment = 'Home Improvement' THEN
    NEW.solar_percentage := 0;
    NEW.home_improvement_percentage := 100;
  ELSIF NEW.business_line_assignment = 'Both' THEN
    -- Default 50/50 if both are 0 or not set sensibly
    IF NEW.solar_percentage = 0 AND NEW.home_improvement_percentage = 0 THEN
      NEW.solar_percentage := 50;
      NEW.home_improvement_percentage := 50;
    END IF;
    -- Validate sum = 100
    IF NEW.solar_percentage + NEW.home_improvement_percentage != 100 THEN
      RAISE EXCEPTION 'Solar and Home Improvement percentages must sum to 100';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_people_percentages_trigger
BEFORE INSERT OR UPDATE ON public.people
FOR EACH ROW
EXECUTE FUNCTION public.validate_people_percentages();
