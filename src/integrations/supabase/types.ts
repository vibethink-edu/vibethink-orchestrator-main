export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_id: string;
          email: string;
          full_name: string;
          role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id: string;
          email: string;
          full_name: string;
          role?: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_id?: string;
          email?: string;
          full_name?: string;
          role?: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'OWNER' | 'SUPER_ADMIN';
          created_at?: string;
          updated_at?: string;
        };
      };
      prompt_templates: {
        Row: {
          id: string;
          name: string;
          content: string;
          created_at: string;
          updated_at: string;
          // Add more fields as needed
        };
      };
      naming_conventions: {
        Row: {
          id: string;
          name: string;
          pattern: string;
          created_at: string;
          updated_at: string;
          // Add more fields as needed
        };
      };
      folder_structure_templates: {
        Row: {
          id: string;
          name: string;
          structure: any;
          created_at: string;
          updated_at: string;
          // Add more fields as needed
        };
      };
      operational_repositories: {
        Row: {
          id: string;
          name: string;
          url: string;
          created_at: string;
          updated_at: string;
          // Add more fields as needed
        };
      };
    };
  };
} 