export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          id: number
          name: string
        }
        Insert: {
          color?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          created_at: string
          id: number
          location: string | null
          logoUrl: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          location?: string | null
          logoUrl?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          location?: string | null
          logoUrl?: string | null
          name?: string
        }
        Relationships: []
      }
      event_tag: {
        Row: {
          event: number
          id: number
          tag: number
        }
        Insert: {
          event: number
          id?: number
          tag: number
        }
        Update: {
          event?: number
          id?: number
          tag?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_tag_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tag_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cfpClosingDate: string | null
          city: string | null
          country: string | null
          cpfUrl: string | null
          date: string | null
          dateEnd: string | null
          eventUrl: string | null
          id: number
          mode: Database["public"]["Enums"]["eventMode"] | null
          name: string
        }
        Insert: {
          cfpClosingDate?: string | null
          city?: string | null
          country?: string | null
          cpfUrl?: string | null
          date?: string | null
          dateEnd?: string | null
          eventUrl?: string | null
          id?: number
          mode?: Database["public"]["Enums"]["eventMode"] | null
          name: string
        }
        Update: {
          cfpClosingDate?: string | null
          city?: string | null
          country?: string | null
          cpfUrl?: string | null
          date?: string | null
          dateEnd?: string | null
          eventUrl?: string | null
          id?: number
          mode?: Database["public"]["Enums"]["eventMode"] | null
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          category: number
          id: number
          name: string
        }
        Insert: {
          category: number
          id?: number
          name: string
        }
        Update: {
          category?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_community: {
        Row: {
          communityId: number
          created_at: string
          id: number
          userId: string
        }
        Insert: {
          communityId: number
          created_at?: string
          id?: number
          userId: string
        }
        Update: {
          communityId?: number
          created_at?: string
          id?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_community_communityId_fkey"
            columns: ["communityId"]
            isOneToOne: false
            referencedRelation: "communities"
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
      eventMode: "In person" | "Hybrid" | "Remote"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
