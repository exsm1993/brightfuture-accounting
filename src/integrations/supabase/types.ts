export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      call_centers: {
        Row: {
          active: boolean
          call_center_name: string
          created_at: string
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          call_center_name: string
          created_at?: string
          id?: string
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          call_center_name?: string
          created_at?: string
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      expense_transactions: {
        Row: {
          account_id: string
          allocation_home_improvement_percentage: number | null
          allocation_solar_percentage: number | null
          allocation_source: string | null
          allocation_timestamp: string | null
          amount: number
          auto_generated_from_shared_cost: boolean
          business_line_id: string
          call_center_id: string | null
          category: string
          created_at: string
          date: string
          deal_id: string | null
          id: string
          incentive_type_id: string | null
          notes: string | null
          original_total_amount: number | null
          payout_id: string | null
          person_id: string | null
          recurring: boolean
          shared_group_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          allocation_home_improvement_percentage?: number | null
          allocation_solar_percentage?: number | null
          allocation_source?: string | null
          allocation_timestamp?: string | null
          amount?: number
          auto_generated_from_shared_cost?: boolean
          business_line_id: string
          call_center_id?: string | null
          category: string
          created_at?: string
          date: string
          deal_id?: string | null
          id?: string
          incentive_type_id?: string | null
          notes?: string | null
          original_total_amount?: number | null
          payout_id?: string | null
          person_id?: string | null
          recurring?: boolean
          shared_group_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          allocation_home_improvement_percentage?: number | null
          allocation_solar_percentage?: number | null
          allocation_source?: string | null
          allocation_timestamp?: string | null
          amount?: number
          auto_generated_from_shared_cost?: boolean
          business_line_id?: string
          call_center_id?: string | null
          category?: string
          created_at?: string
          date?: string
          deal_id?: string | null
          id?: string
          incentive_type_id?: string | null
          notes?: string | null
          original_total_amount?: number | null
          payout_id?: string | null
          person_id?: string | null
          recurring?: boolean
          shared_group_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_transactions_call_center_id_fkey"
            columns: ["call_center_id"]
            isOneToOne: false
            referencedRelation: "call_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_transactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          active: boolean
          business_line_assignment: string
          call_center_id: string | null
          created_at: string
          home_improvement_percentage: number
          id: string
          name: string
          notes: string | null
          pay_frequency: string
          receives_bonus: boolean
          receives_commission: boolean
          receives_salary: boolean
          role: string
          solar_percentage: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_line_assignment?: string
          call_center_id?: string | null
          created_at?: string
          home_improvement_percentage?: number
          id?: string
          name: string
          notes?: string | null
          pay_frequency?: string
          receives_bonus?: boolean
          receives_commission?: boolean
          receives_salary?: boolean
          role?: string
          solar_percentage?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_line_assignment?: string
          call_center_id?: string | null
          created_at?: string
          home_improvement_percentage?: number
          id?: string
          name?: string
          notes?: string | null
          pay_frequency?: string
          receives_bonus?: boolean
          receives_commission?: boolean
          receives_salary?: boolean
          role?: string
          solar_percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_call_center_id_fkey"
            columns: ["call_center_id"]
            isOneToOne: false
            referencedRelation: "call_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      tools_subscriptions: {
        Row: {
          auto_generate_expense: boolean
          billing_amount: number
          billing_frequency: string
          business_line_allocation: string
          call_center_id: string | null
          category: string
          created_at: string
          home_improvement_percentage: number
          id: string
          next_billing_date: string | null
          notes: string | null
          payment_account_id: string | null
          solar_percentage: number
          status: string
          tool_name: string
          updated_at: string
          used_by: string | null
          vendor_name: string | null
        }
        Insert: {
          auto_generate_expense?: boolean
          billing_amount?: number
          billing_frequency?: string
          business_line_allocation?: string
          call_center_id?: string | null
          category?: string
          created_at?: string
          home_improvement_percentage?: number
          id?: string
          next_billing_date?: string | null
          notes?: string | null
          payment_account_id?: string | null
          solar_percentage?: number
          status?: string
          tool_name: string
          updated_at?: string
          used_by?: string | null
          vendor_name?: string | null
        }
        Update: {
          auto_generate_expense?: boolean
          billing_amount?: number
          billing_frequency?: string
          business_line_allocation?: string
          call_center_id?: string | null
          category?: string
          created_at?: string
          home_improvement_percentage?: number
          id?: string
          next_billing_date?: string | null
          notes?: string | null
          payment_account_id?: string | null
          solar_percentage?: number
          status?: string
          tool_name?: string
          updated_at?: string
          used_by?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tools_subscriptions_call_center_id_fkey"
            columns: ["call_center_id"]
            isOneToOne: false
            referencedRelation: "call_centers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
