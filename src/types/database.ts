export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string | null;
          icon: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... outras tabelas existentes
    };
  };
} 