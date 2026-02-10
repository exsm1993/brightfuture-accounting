// Deal type mapped from MySQL tbl_assign_appointment
export interface MysqlDeal {
  deal_id: string; // appointment_id
  external_project_id: string | null;
  lead_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  source_system: string | null; // source_LFlowspot
  campaign_name: string | null;
  date_created: string | null;
  date_signed: string | null; // crc_date or appointment_datetime
  appointment_date: string | null;
  appointment_time: string | null;
  business_line: string; // default Solar
  deal_amount: number;
  installer_id: string | null;
  status: string; // outcome_name
  appointment_status: string | null; // status field
  setter_id: string | null;
  secondary_setter_id: string | null;
  manager_id: string | null;
  created_by: string | null;
  state_id: string | null;
  financier: string | null;
  credit_score: number | null;
  bill_amount: number | null;
  roof_age: number | null;
  replace_roof: string | null;
}

export interface DealFilterOptions {
  outcomes: string[];
  states: string[];
  campaigns: string[];
  sources: string[];
  installerIds: string[];
}

export interface FetchDealsResponse {
  deals: MysqlDeal[];
  filterOptions: DealFilterOptions | null;
}
