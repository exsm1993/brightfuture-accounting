
-- Create expense_transactions table
CREATE TABLE public.expense_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  business_line_id TEXT NOT NULL,
  category TEXT NOT NULL,
  incentive_type_id TEXT,
  call_center_id UUID REFERENCES public.call_centers(id),
  person_id UUID REFERENCES public.people(id),
  deal_id TEXT,
  account_id TEXT NOT NULL,
  recurring BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Completed',
  payout_id TEXT,
  allocation_source TEXT,
  allocation_solar_percentage NUMERIC,
  allocation_home_improvement_percentage NUMERIC,
  allocation_timestamp TIMESTAMPTZ,
  original_total_amount NUMERIC,
  shared_group_id TEXT,
  auto_generated_from_shared_cost BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expense_transactions ENABLE ROW LEVEL SECURITY;

-- Allow full access (no auth in this app)
CREATE POLICY "Allow full access to expense_transactions"
  ON public.expense_transactions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger
CREATE TRIGGER update_expense_transactions_updated_at
  BEFORE UPDATE ON public.expense_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
