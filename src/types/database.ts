export interface Database {
  public: {
    Tables: {
      access_keys: {
        Row: {
          id: string;
          key_value: string;
          username: string;
          display_name: string;
          avatar_url: string;
          is_admin: boolean;
          created_at: string;
          last_used_at: string | null;
          is_active: boolean;
          is_one_time: boolean;
          expires_at: string | null;
          used_at: string | null;
          permissions: string[];
          notes: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          key_value: string;
          username?: string;
          display_name?: string;
          avatar_url?: string;
          is_admin?: boolean;
          created_at?: string;
          last_used_at?: string | null;
          is_active?: boolean;
          is_one_time?: boolean;
          expires_at?: string | null;
          used_at?: string | null;
          permissions?: string[];
          notes?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          key_value?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string;
          is_admin?: boolean;
          created_at?: string;
          last_used_at?: string | null;
          is_active?: boolean;
          is_one_time?: boolean;
          expires_at?: string | null;
          used_at?: string | null;
          permissions?: string[];
          notes?: string;
          user_id?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          tags: string[];
          is_published: boolean;
          created_at: string;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string;
          tags?: string[];
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          tags?: string[];
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          url?: string | null;
        };
      };
      tools: {
        Row: {
          id: string;
          codename: string;
          slug: string;
          description: string;
          status: string;
          access_level: string;
          category: string;
          sort_order: number;
          is_visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          codename: string;
          slug: string;
          description?: string;
          status?: string;
          access_level?: string;
          category?: string;
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          codename?: string;
          slug?: string;
          description?: string;
          status?: string;
          access_level?: string;
          category?: string;
          sort_order?: number;
          is_visible?: boolean;
          created_at?: string;
        };
      };
      exploits: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          severity: string;
          status: string;
          cve_id: string;
          tags: string[];
          created_at: string;
          updated_at: string;
          is_visible: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          category?: string;
          severity?: string;
          status?: string;
          cve_id?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          is_visible?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          severity?: string;
          status?: string;
          cve_id?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          is_visible?: boolean;
          sort_order?: number;
        };
      };
      stealers: {
        Row: {
          id: string;
          name: string;
          description: string;
          target_type: string;
          platforms: string[];
          status: string;
          detection_rate: string;
          tags: string[];
          created_at: string;
          updated_at: string;
          is_visible: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          target_type?: string;
          platforms?: string[];
          status?: string;
          detection_rate?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          is_visible?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          target_type?: string;
          platforms?: string[];
          status?: string;
          detection_rate?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          is_visible?: boolean;
          sort_order?: number;
        };
      };
      combos: {
        Row: {
          id: string;
          name: string;
          description: string;
          combo_type: string;
          line_count: string;
          source: string;
          tags: string[];
          is_visible: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          download_url: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          combo_type?: string;
          line_count?: string;
          source?: string;
          tags?: string[];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          download_url?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          combo_type?: string;
          line_count?: string;
          source?: string;
          tags?: string[];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          download_url?: string;
        };
      };
      cracking_tools: {
        Row: {
          id: string;
          name: string;
          description: string;
          tool_type: string;
          platforms: string[];
          version: string;
          status: string;
          tags: string[];
          is_visible: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          download_url: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          tool_type?: string;
          platforms?: string[];
          version?: string;
          status?: string;
          tags?: string[];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          download_url?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          tool_type?: string;
          platforms?: string[];
          version?: string;
          status?: string;
          tags?: string[];
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          download_url?: string;
        };
      };
      security_methods: {
        Row: {
          id: string;
          title: string;
          category: string;
          description: string;
          difficulty: string;
          effectiveness: string;
          requirements: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          description: string;
          difficulty: string;
          effectiveness: string;
          requirements?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          description?: string;
          difficulty?: string;
          effectiveness?: string;
          requirements?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      security_tools: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          use_case: string;
          price: string;
          download_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description: string;
          use_case?: string;
          price?: string;
          download_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string;
          use_case?: string;
          price?: string;
          download_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      security_guides: {
        Row: {
          id: string;
          title: string;
          category: string;
          content: string;
          difficulty: string;
          read_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          content: string;
          difficulty: string;
          read_time?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          content?: string;
          difficulty?: string;
          read_time?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type AccessKey = Database['public']['Tables']['access_keys']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Tool = Database['public']['Tables']['tools']['Row'];
export type Exploit = Database['public']['Tables']['exploits']['Row'];
export type Stealer = Database['public']['Tables']['stealers']['Row'];
export type Combo = Database['public']['Tables']['combos']['Row'];
export type CrackingTool = Database['public']['Tables']['cracking_tools']['Row'];
export type SecurityMethod = Database['public']['Tables']['security_methods']['Row'];
export type SecurityTool = Database['public']['Tables']['security_tools']['Row'];
export type SecurityGuide = Database['public']['Tables']['security_guides']['Row'];

export interface DatabaseEntry {
  id: string;
  name: string;
  description: string;
  country: string;
  size: string;
  record_count: string;
  download_url: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  year_of_breach: number | null;
}
