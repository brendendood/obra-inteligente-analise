export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
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
        ]
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
          template_version?: string | null
          user_id?: string | null
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
        ]
      }
      projects: {
        Row: {
          analysis_data: Json | null
          city: string | null
          country: string | null
          created_at: string
          estimated_budget: number | null
          extracted_text: string | null
          file_path: string
          file_size: number | null
          id: string
          name: string
          project_status: string | null
          project_type: string | null
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
          estimated_budget?: number | null
          extracted_text?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          name: string
          project_status?: string | null
          project_type?: string | null
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
          estimated_budget?: number | null
          extracted_text?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          name?: string
          project_status?: string | null
          project_type?: string | null
          state?: string | null
          total_area?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          empresa: string | null
          full_name: string | null
          gender: string | null
          has_created_first_project: boolean | null
          id: string
          last_login: string | null
          phone: string | null
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
          empresa?: string | null
          full_name?: string | null
          gender?: string | null
          has_created_first_project?: boolean | null
          id?: string
          last_login?: string | null
          phone?: string | null
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
          empresa?: string | null
          full_name?: string | null
          gender?: string | null
          has_created_first_project?: boolean | null
          id?: string
          last_login?: string | null
          phone?: string | null
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
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          target_user_id: string
          points: number
          action_type: string
          details?: Json
        }
        Returns: undefined
      }
      calculate_level_from_points: {
        Args: { points: number }
        Returns: number
      }
      calculate_user_engagement: {
        Args: Record<PropertyKey, never> | { target_user_id: string }
        Returns: number
      }
      cleanup_expired_impersonation_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      end_impersonation_session: {
        Args: { session_id: string }
        Returns: undefined
      }
      example_function: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: number
          username: string
          created_at: string
        }[]
      }
      fix_existing_referrals: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      force_user_geolocation_update: {
        Args: { user_email: string }
        Returns: Json
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          total_projects: number
          active_subscriptions: number
          monthly_revenue: number
          new_users_this_month: number
          ai_usage_this_month: number
        }[]
      }
      get_admin_users_with_auth_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          profile_id: string
          user_id: string
          email: string
          email_confirmed_at: string
          full_name: string
          company: string
          phone: string
          city: string
          state: string
          country: string
          cargo: string
          avatar_url: string
          gender: string
          tags: string[]
          created_at: string
          last_sign_in_at: string
          subscription_plan: string
          subscription_status: string
        }[]
      }
      get_admin_users_with_real_location: {
        Args: Record<PropertyKey, never>
        Returns: {
          profile_id: string
          user_id: string
          email: string
          email_confirmed_at: string
          full_name: string
          company: string
          phone: string
          city: string
          state: string
          country: string
          cargo: string
          avatar_url: string
          gender: string
          tags: string[]
          created_at: string
          last_sign_in_at: string
          subscription_plan: string
          subscription_status: string
          real_location: string
          last_login_ip: string
        }[]
      }
      get_advanced_admin_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          active_users_week: number
          active_users_month: number
          avg_session_duration: number
          total_ai_calls: number
          ai_cost_month: number
          conversion_rate: number
          top_features: Json
        }[]
      }
      get_level_info: {
        Args: { level_num: number }
        Returns: Json
      }
      get_total_users_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_engagement: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          engagement_score: number
        }[]
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_superuser: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_security_action: {
        Args: {
          p_admin_id: string
          p_action_type: string
          p_target_user_id?: string
          p_details?: Json
          p_success?: boolean
        }
        Returns: undefined
      }
      manual_login_insert: {
        Args: { p_user_id: string; p_ip_address?: string }
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
      update_login_location_by_ip: {
        Args: {
          login_id: string
          ip_address: string
          city_name: string
          region_name: string
          country_name: string
          lat?: number
          lng?: number
        }
        Returns: undefined
      }
      update_user_segments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_referral_code: {
        Args: { ref_code: string }
        Returns: Json
      }
    }
    Enums: {
      admin_role: "super_admin" | "marketing" | "financial" | "support"
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
