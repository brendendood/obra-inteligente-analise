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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          action_count_required: number | null
          action_type: string | null
          code: string
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          name: string
          points_required: number | null
        }
        Insert: {
          action_count_required?: number | null
          action_type?: string | null
          code: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          points_required?: number | null
        }
        Update: {
          action_count_required?: number | null
          action_type?: string | null
          code?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          points_required?: number | null
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_user_id: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_impersonation_logs: {
        Row: {
          admin_id: string
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          id: string
          ip_address: unknown | null
          reason: string | null
          started_at: string
          user_agent: string | null
          user_impersonated_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          reason?: string | null
          started_at?: string
          user_agent?: string | null
          user_impersonated_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          reason?: string | null
          started_at?: string
          user_agent?: string | null
          user_impersonated_id?: string
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          active: boolean | null
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      admin_security_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          success: boolean | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          assistant_id: string | null
          created_at: string
          id: string
          project_id: string | null
          status: string
          thread_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          status?: string
          thread_id?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assistant_id?: string | null
          created_at?: string
          id?: string
          project_id?: string | null
          status?: string
          thread_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_message_usage: {
        Row: {
          count: number
          created_at: string
          id: number
          period_ym: string
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: number
          period_ym: string
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: number
          period_ym?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          feedback: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          rating: number | null
          role: string
          run_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          rating?: number | null
          role: string
          run_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          rating?: number | null
          role?: string
          run_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_metrics: {
        Row: {
          cost_usd: number | null
          created_at: string
          feature_type: string
          feedback_text: string | null
          id: string
          project_id: string | null
          response_rating: number | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          feature_type: string
          feedback_text?: string | null
          id?: string
          project_id?: string | null
          response_rating?: number | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          feature_type?: string
          feedback_text?: string | null
          id?: string
          project_id?: string | null
          response_rating?: number | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
        ]
      }
      alert_configurations: {
        Row: {
          actions: Json | null
          alert_type: string
          conditions: Json | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          alert_type: string
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          alert_type?: string
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      alert_logs: {
        Row: {
          alert_type: string
          id: string
          message: string
          metadata: Json | null
          project_id: string | null
          resolved: boolean | null
          severity: string
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          id?: string
          message: string
          metadata?: Json | null
          project_id?: string | null
          resolved?: boolean | null
          severity: string
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          id?: string
          message?: string
          metadata?: Json | null
          project_id?: string | null
          resolved?: boolean | null
          severity?: string
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
        ]
      }
      chat_access_logs: {
        Row: {
          access_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          current_uses: number | null
          discount_type: string | null
          discount_value: number
          id: string
          max_uses: number | null
          user_id: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          current_uses?: number | null
          discount_type?: string | null
          discount_value: number
          id?: string
          max_uses?: number | null
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          current_uses?: number | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          max_uses?: number | null
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      credit_ledger: {
        Row: {
          created_at: string
          id: string
          period_key: string
          project_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_key: string
          project_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_key?: string
          project_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_ledger_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_ledger_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "credit_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          avatar: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          owner_id: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          owner_id: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          owner_id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_projects: {
        Row: {
          client_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string
          start_date: string
          status: string
          updated_at: string
          value: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id: string
          start_date: string
          status?: string
          updated_at?: string
          value?: number
        }
        Update: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string
          start_date?: string
          status?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_crm_client_stats"
            referencedColumns: ["client_id"]
          },
        ]
      }
      email_logs: {
        Row: {
          created_at: string | null
          email_type: string
          id: string
          metadata: Json | null
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string
          template_key: string | null
          template_version: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_type: string
          id?: string
          metadata?: Json | null
          recipient_email: string
          sent_at?: string | null
          status?: string
          subject: string
          template_key?: string | null
          template_version?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_type?: string
          id?: string
          metadata?: Json | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_key?: string | null
          template_version?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          last_attempt_at: string | null
          max_retries: number
          next_retry_at: string | null
          payload: Json
          recipient_email: string
          resend_id: string | null
          retries: number
          status: string
          template_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_retries?: number
          next_retry_at?: string | null
          payload?: Json
          recipient_email: string
          resend_id?: string | null
          retries?: number
          status?: string
          template_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_attempt_at?: string | null
          max_retries?: number
          next_retry_at?: string | null
          payload?: Json
          recipient_email?: string
          resend_id?: string | null
          retries?: number
          status?: string
          template_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          enabled: boolean | null
          from_email: string | null
          from_name: string | null
          html: string
          id: string
          locale: string | null
          reply_to: string | null
          subject: string
          template_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          from_email?: string | null
          from_name?: string | null
          html: string
          id?: string
          locale?: string | null
          reply_to?: string | null
          subject?: string
          template_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          from_email?: string | null
          from_name?: string | null
          html?: string
          id?: string
          locale?: string | null
          reply_to?: string | null
          subject?: string
          template_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      gamification_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          id: string
          points_awarded: number | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          points_awarded?: number | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          points_awarded?: number | null
          user_id?: string
        }
        Relationships: []
      }
      kv_store_40b370d9: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
          user_id: string | null
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
          user_id?: string | null
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          invoice_url: string | null
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_method?: string | null
          status: string
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          base_quota: number | null
          code: string
          created_at: string
          id: string
        }
        Insert: {
          base_quota?: number | null
          code: string
          created_at?: string
          id?: string
        }
        Update: {
          base_quota?: number | null
          code?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      project_analyses: {
        Row: {
          analysis_type: string
          created_at: string
          id: string
          project_id: string
          results: Json
        }
        Insert: {
          analysis_type: string
          created_at?: string
          id?: string
          project_id: string
          results: Json
        }
        Update: {
          analysis_type?: string
          created_at?: string
          id?: string
          project_id?: string
          results?: Json
        }
        Relationships: [
          {
            foreignKeyName: "project_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_budget_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          environment: string | null
          id: string
          project_id: string
          quantity: number
          sinapi_code: string | null
          sort_order: number | null
          source: string | null
          subtotal: number | null
          topic: string | null
          unit: string | null
          unit_value: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          environment?: string | null
          id?: string
          project_id: string
          quantity?: number
          sinapi_code?: string | null
          sort_order?: number | null
          source?: string | null
          subtotal?: number | null
          topic?: string | null
          unit?: string | null
          unit_value?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          environment?: string | null
          id?: string
          project_id?: string
          quantity?: number
          sinapi_code?: string | null
          sort_order?: number | null
          source?: string | null
          subtotal?: number | null
          topic?: string | null
          unit?: string | null
          unit_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_budget_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_budget_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_conversations: {
        Row: {
          id: string
          message: string
          project_id: string
          sender: string
          timestamp: string
        }
        Insert: {
          id?: string
          message: string
          project_id: string
          sender: string
          timestamp?: string
        }
        Update: {
          id?: string
          message?: string
          project_id?: string
          sender?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_documents: {
        Row: {
          category: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          mime_type: string
          project_id: string
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          mime_type: string
          project_id: string
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          category?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          mime_type?: string
          project_id?: string
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_schedule_tasks: {
        Row: {
          category: string | null
          created_at: string
          dependency_id: string | null
          duration_days: number | null
          end_date: string | null
          id: string
          project_id: string
          source: string | null
          stage_name: string
          stage_number: number | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          dependency_id?: string | null
          duration_days?: number | null
          end_date?: string | null
          id?: string
          project_id: string
          source?: string | null
          stage_name: string
          stage_number?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          dependency_id?: string | null
          duration_days?: number | null
          end_date?: string | null
          id?: string
          project_id?: string
          source?: string | null
          stage_name?: string
          stage_number?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_schedule_tasks_dependency_id_fkey"
            columns: ["dependency_id"]
            isOneToOne: false
            referencedRelation: "project_schedule_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_schedule_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_schedule_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_summary"
            referencedColumns: ["project_id"]
          },
        ]
      }
      projects: {
        Row: {
          analysis_data: Json | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          end_date: string | null
          estimated_budget: number | null
          extracted_text: string | null
          file_path: string
          file_size: number | null
          id: string
          name: string
          notes: string | null
          pdf_checksum: string | null
          pdf_url: string | null
          project_status: string | null
          project_type: string | null
          start_date: string | null
          state: string | null
          total_area: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          extracted_text?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          name: string
          notes?: string | null
          pdf_checksum?: string | null
          pdf_url?: string | null
          project_status?: string | null
          project_type?: string | null
          start_date?: string | null
          state?: string | null
          total_area?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          estimated_budget?: number | null
          extracted_text?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          name?: string
          notes?: string | null
          pdf_checksum?: string | null
          pdf_url?: string | null
          project_status?: string | null
          project_type?: string | null
          start_date?: string | null
          state?: string | null
          total_area?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          period_key: string
          qualified_at: string | null
          referred_user_id: string | null
          referrer_user_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_key: string
          qualified_at?: string | null
          referred_user_id?: string | null
          referrer_user_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          period_key?: string
          qualified_at?: string | null
          referred_user_id?: string | null
          referrer_user_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_user_id_fkey"
            columns: ["referrer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: Database["public"]["Enums"]["user_event_type"]
          events: Json | null
          id: string
          ip_address: unknown | null
          last_active: string | null
          page_url: string | null
          session_duration: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: Database["public"]["Enums"]["user_event_type"]
          events?: Json | null
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          page_url?: string | null
          session_duration?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: Database["public"]["Enums"]["user_event_type"]
          events?: Json | null
          id?: string
          ip_address?: unknown | null
          last_active?: string | null
          page_url?: string | null
          session_duration?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_analytics_enhanced: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      user_gamification: {
        Row: {
          achievements: Json | null
          created_at: string | null
          current_level: number | null
          current_level_points: number | null
          daily_streak: number | null
          id: string
          last_action_date: string | null
          last_login_date: string | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          created_at?: string | null
          current_level?: number | null
          current_level_points?: number | null
          daily_streak?: number | null
          id?: string
          last_action_date?: string | null
          last_login_date?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          created_at?: string | null
          current_level?: number | null
          current_level_points?: number | null
          daily_streak?: number | null
          id?: string
          last_action_date?: string | null
          last_login_date?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_login_history: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          ip_address: unknown | null
          latitude: number | null
          login_at: string | null
          longitude: number | null
          os: string | null
          region: string | null
          session_duration: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          login_at?: string | null
          longitude?: number | null
          os?: string | null
          region?: string | null
          session_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          login_at?: string | null
          longitude?: number | null
          os?: string | null
          region?: string | null
          session_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_payments: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string
          invoice_url: string | null
          next_payment_date: string | null
          payment_method: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          next_payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          next_payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          created_at: string
          messages_quota: number
          plan_tier: Database["public"]["Enums"]["plan_tier_v2"]
          seats: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          messages_quota?: number
          plan_tier?: Database["public"]["Enums"]["plan_tier_v2"]
          seats?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          created_at?: string
          messages_quota?: number
          plan_tier?: Database["public"]["Enums"]["plan_tier_v2"]
          seats?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_type: string | null
          avatar_url: string | null
          bio: string | null
          cargo: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          credits: number | null
          date_of_birth: string | null
          deactivated_at: string | null
          empresa: string | null
          full_name: string | null
          gender: string | null
          has_created_first_project: boolean | null
          id: string
          is_active: boolean
          last_login: string | null
          phone: string | null
          plan_selected: boolean
          quiz_completed: boolean
          ref_code: string | null
          referred_by: string | null
          referrer: string | null
          sector: string | null
          state: string | null
          tags: string[] | null
          timezone: string | null
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          avatar_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          cargo?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          credits?: number | null
          date_of_birth?: string | null
          deactivated_at?: string | null
          empresa?: string | null
          full_name?: string | null
          gender?: string | null
          has_created_first_project?: boolean | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          phone?: string | null
          plan_selected?: boolean
          quiz_completed?: boolean
          ref_code?: string | null
          referred_by?: string | null
          referrer?: string | null
          sector?: string | null
          state?: string | null
          tags?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          avatar_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          cargo?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          credits?: number | null
          date_of_birth?: string | null
          deactivated_at?: string | null
          empresa?: string | null
          full_name?: string | null
          gender?: string | null
          has_created_first_project?: boolean | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          phone?: string | null
          plan_selected?: boolean
          quiz_completed?: boolean
          ref_code?: string | null
          referred_by?: string | null
          referrer?: string | null
          sector?: string | null
          state?: string | null
          tags?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      user_quiz_responses: {
        Row: {
          created_at: string
          id: string
          step1_context: string
          step2_role: string
          step3_challenge: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          step1_context: string
          step2_role: string
          step3_challenge: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          step1_context?: string
          step2_role?: string
          step3_challenge?: string
          user_id?: string
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          created_at: string | null
          credits_awarded: boolean | null
          id: string
          referral_code: string
          referred_user_first_project: boolean | null
          referred_user_id: string
          referrer_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credits_awarded?: boolean | null
          id?: string
          referral_code: string
          referred_user_first_project?: boolean | null
          referred_user_id: string
          referrer_user_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credits_awarded?: boolean | null
          id?: string
          referral_code?: string
          referred_user_first_project?: boolean | null
          referred_user_id?: string
          referrer_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_segments: {
        Row: {
          auto_generated: boolean | null
          created_at: string | null
          id: string
          segment_data: Json | null
          segment_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          created_at?: string | null
          id?: string
          segment_data?: Json | null
          segment_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          created_at?: string | null
          id?: string
          segment_data?: Json | null
          segment_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: string
          lifetime_base_consumed: number
          plan_code: string
        }
        Insert: {
          created_at?: string
          id: string
          lifetime_base_consumed?: number
          plan_code?: string
        }
        Update: {
          created_at?: string
          id?: string
          lifetime_base_consumed?: number
          plan_code?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          status_code: number | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          status_code?: number | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          status_code?: number | null
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      safe_admin_users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          last_login: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          last_login?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          last_login?: string | null
        }
        Relationships: []
      }
      v_crm_client_stats: {
        Row: {
          client_company: string | null
          client_created_at: string | null
          client_email: string | null
          client_id: string | null
          client_name: string | null
          client_phone: string | null
          client_status: string | null
          last_project_date: string | null
          owner_id: string | null
          projects_count: number | null
          total_value: number | null
        }
        Relationships: []
      }
      v_project_summary: {
        Row: {
          overall_end: string | null
          overall_start: string | null
          progress_percent: number | null
          project_id: string | null
          stages_completed: number | null
          total_budget: number | null
          total_items: number | null
          total_stages: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_update_user_complete: {
        Args: {
          admin_user_id: string
          profile_data?: Json
          subscription_data?: Json
          target_user_id: string
        }
        Returns: Json
      }
      award_points: {
        Args: {
          action_type: string
          details?: Json
          points: number
          target_user_id: string
        }
        Returns: undefined
      }
      calculate_level_from_points: {
        Args: { points: number }
        Returns: number
      }
      calculate_next_retry_time: {
        Args: { retry_count: number }
        Returns: string
      }
      calculate_user_engagement: {
        Args: Record<PropertyKey, never> | { target_user_id: string }
        Returns: {
          avg_session_duration: number
          engagement_score: number
          last_activity: string
          total_events: number
          total_sessions: number
          user_id: string
        }[]
      }
      cleanup_expired_impersonation_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      end_impersonation_session: {
        Args: { session_id: string }
        Returns: undefined
      }
      enqueue_email: {
        Args: {
          p_payload?: Json
          p_recipient_email: string
          p_template_type: string
          p_user_id: string
        }
        Returns: string
      }
      example_function: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          user_id: number
          username: string
        }[]
      }
      fix_existing_referrals: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      force_all_geolocations_update: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      force_geolocation_refresh: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      force_update_all_active_users_geolocation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      force_update_user_location: {
        Args: { target_user_id: string }
        Returns: Json
      }
      force_user_geolocation_update: {
        Args: { user_email: string }
        Returns: Json
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_subscriptions: number
          ai_usage_this_month: number
          monthly_revenue: number
          new_users_this_month: number
          total_projects: number
          total_users: number
        }[]
      }
      get_admin_users_with_auth_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          cargo: string
          city: string
          company: string
          country: string
          created_at: string
          email: string
          email_confirmed_at: string
          full_name: string
          gender: string
          last_sign_in_at: string
          phone: string
          profile_id: string
          state: string
          subscription_plan: string
          subscription_status: string
          tags: string[]
          user_id: string
        }[]
      }
      get_admin_users_with_real_location: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          cargo: string
          city: string
          company: string
          country: string
          created_at: string
          email: string
          email_confirmed_at: string
          full_name: string
          gender: string
          last_login_ip: string
          last_sign_in_at: string
          phone: string
          profile_id: string
          real_location: string
          state: string
          subscription_plan: string
          subscription_status: string
          tags: string[]
          user_id: string
        }[]
      }
      get_advanced_admin_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_users_month: number
          active_users_week: number
          ai_cost_month: number
          avg_session_duration: number
          conversion_rate: number
          top_features: Json
          total_ai_calls: number
          total_users: number
        }[]
      }
      get_bulk_email_users: {
        Args: { limit_count?: number }
        Returns: {
          email: string
          full_name: string
          user_id: string
        }[]
      }
      get_client_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          client_id: string
          client_name: string
          last_project_date: string
          projects_count: number
          total_value: number
        }[]
      }
      get_geolocation_quality_report: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
          metric: string
          percentage: number
        }[]
      }
      get_level_info: {
        Args: { level_num: number }
        Returns: Json
      }
      get_pending_emails_for_retry: {
        Args: { batch_size?: number }
        Returns: {
          payload: Json
          queue_id: string
          recipient_email: string
          retries: number
          template_type: string
          user_id: string
        }[]
      }
      get_total_users_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_engagement: {
        Args: Record<PropertyKey, never>
        Returns: {
          engagement_score: number
          user_id: string
        }[]
      }
      get_user_plan_limits: {
        Args: { user_id: string }
        Returns: {
          base_quota: number
          consumed: number
          plan_code: string
          remaining: number
          total_available: number
        }[]
      }
      increment_ai_usage: {
        Args: { p_period: string; p_user: string }
        Returns: {
          count: number
        }[]
      }
      insert_crm_client: {
        Args: {
          p_avatar?: string
          p_company?: string
          p_email?: string
          p_name: string
          p_phone?: string
          p_status?: string
        }
        Returns: string
      }
      insert_crm_project: {
        Args: {
          p_client_id: string
          p_description?: string
          p_end_date?: string
          p_name: string
          p_start_date?: string
          p_status?: string
          p_value?: number
        }
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_project_owner: {
        Args: { check_project_id: number }
        Returns: boolean
      }
      is_superuser: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_security_action: {
        Args: {
          p_action_type: string
          p_admin_id: string
          p_details?: Json
          p_success?: boolean
          p_target_user_id?: string
        }
        Returns: undefined
      }
      manual_login_insert: {
        Args: { p_ip_address?: string; p_user_id: string }
        Returns: string
      }
      mark_email_failed: {
        Args: { p_error_message: string; p_queue_id: string }
        Returns: boolean
      }
      mark_email_sent: {
        Args: { p_queue_id: string; p_resend_id?: string }
        Returns: boolean
      }
      process_pending_welcome_emails: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      recover_historical_logins: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      reset_all_geolocation_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      test_complete_referral_system: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_complete_signup_system: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      test_login_system: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      test_manual_login_tracking: {
        Args: { user_email: string }
        Returns: string
      }
      trigger_welcome_email_for_user: {
        Args: { target_user_id: string }
        Returns: Json
      }
      update_login_location_by_ip: {
        Args: {
          city_name: string
          country_name: string
          ip_address: string
          lat?: number
          lng?: number
          login_id: string
          region_name: string
        }
        Returns: undefined
      }
      update_user_segments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_geolocation_quality: {
        Args: {
          p_city: string
          p_country: string
          p_latitude: number
          p_longitude: number
          p_region: string
        }
        Returns: boolean
      }
      validate_referral_code: {
        Args: { p_ref_code: string }
        Returns: Json
      }
    }
    Enums: {
      admin_role: "super_admin" | "marketing" | "financial" | "support"
      billing_cycle: "mensal" | "anual"
      plan_tier: "SOLO" | "STUDIO" | "ENTERPRISE"
      plan_tier_v2: "FREE" | "BASIC" | "PRO" | "ENTERPRISE"
      subscription_plan: "free" | "basic" | "pro" | "enterprise"
      subscription_status: "active" | "canceled" | "past_due" | "trialing"
      user_event_type:
        | "signup"
        | "login"
        | "logout"
        | "project_created"
        | "file_uploaded"
        | "ai_used"
        | "plan_upgraded"
        | "plan_downgraded"
        | "payment_success"
        | "payment_failed"
        | "budget_generated"
        | "schedule_created"
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
    Enums: {
      admin_role: ["super_admin", "marketing", "financial", "support"],
      billing_cycle: ["mensal", "anual"],
      plan_tier: ["SOLO", "STUDIO", "ENTERPRISE"],
      plan_tier_v2: ["FREE", "BASIC", "PRO", "ENTERPRISE"],
      subscription_plan: ["free", "basic", "pro", "enterprise"],
      subscription_status: ["active", "canceled", "past_due", "trialing"],
      user_event_type: [
        "signup",
        "login",
        "logout",
        "project_created",
        "file_uploaded",
        "ai_used",
        "plan_upgraded",
        "plan_downgraded",
        "payment_success",
        "payment_failed",
        "budget_generated",
        "schedule_created",
      ],
    },
  },
} as const
