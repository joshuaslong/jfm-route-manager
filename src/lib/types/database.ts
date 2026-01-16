export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      drivers: {
        Row: {
          id: string;
          name: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: string;
          created_at?: string;
        };
      };
      trucks: {
        Row: {
          id: string;
          number: string;
          type: string;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          type?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          type?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      trailers: {
        Row: {
          id: string;
          number: string;
          type: string;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          number: string;
          type?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          type?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      loaders: {
        Row: {
          id: string;
          name: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: string;
          created_at?: string;
        };
      };
      routes: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      weekly_templates: {
        Row: {
          id: string;
          day_of_week: number;
          route_id: string | null;
          driver_id: string | null;
          truck_id: string | null;
          trailer_id: string | null;
          dispatch_time: string | null;
          backhaul: string | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          route_id?: string | null;
          driver_id?: string | null;
          truck_id?: string | null;
          trailer_id?: string | null;
          dispatch_time?: string | null;
          backhaul?: string | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          route_id?: string | null;
          driver_id?: string | null;
          truck_id?: string | null;
          trailer_id?: string | null;
          dispatch_time?: string | null;
          backhaul?: string | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_assignments: {
        Row: {
          id: string;
          date: string;
          route_id: string | null;
          display_name: string | null;
          type: string;
          parent_assignment_id: string | null;
          driver_id: string | null;
          truck_id: string | null;
          trailer_id: string | null;
          dispatch_time: string | null;
          backhaul: string | null;
          notes: string | null;
          planning_status: string;
          loading_status: string;
          trip_number: number;
          is_modified_from_template: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          route_id?: string | null;
          display_name?: string | null;
          type?: string;
          parent_assignment_id?: string | null;
          driver_id?: string | null;
          truck_id?: string | null;
          trailer_id?: string | null;
          dispatch_time?: string | null;
          backhaul?: string | null;
          notes?: string | null;
          planning_status?: string;
          loading_status?: string;
          trip_number?: number;
          is_modified_from_template?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          route_id?: string | null;
          display_name?: string | null;
          type?: string;
          parent_assignment_id?: string | null;
          driver_id?: string | null;
          truck_id?: string | null;
          trailer_id?: string | null;
          dispatch_time?: string | null;
          backhaul?: string | null;
          notes?: string | null;
          planning_status?: string;
          loading_status?: string;
          trip_number?: number;
          is_modified_from_template?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignment_loaders: {
        Row: {
          id: string;
          daily_assignment_id: string;
          loader_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          daily_assignment_id: string;
          loader_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          daily_assignment_id?: string;
          loader_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Convenience types
export type Driver = Database['public']['Tables']['drivers']['Row'];
export type Truck = Database['public']['Tables']['trucks']['Row'];
export type Trailer = Database['public']['Tables']['trailers']['Row'];
export type Loader = Database['public']['Tables']['loaders']['Row'];
export type Route = Database['public']['Tables']['routes']['Row'];
export type WeeklyTemplate = Database['public']['Tables']['weekly_templates']['Row'];
export type DailyAssignment = Database['public']['Tables']['daily_assignments']['Row'];
export type AssignmentLoader = Database['public']['Tables']['assignment_loaders']['Row'];

// Extended types with relations
export type WeeklyTemplateWithRelations = WeeklyTemplate & {
  route: Route | null;
  driver: Driver | null;
  truck: Truck | null;
  trailer: Trailer | null;
};

export type DailyAssignmentWithRelations = DailyAssignment & {
  route: Route | null;
  driver: Driver | null;
  truck: Truck | null;
  trailer: Trailer | null;
  loaders: { loader: Loader }[];
};

// Status types
export type PlanningStatus = 'draft' | 'finalized';
export type LoadingStatus = 'not_started' | 'in_progress' | 'loaded';
export type AssignmentType = 'standard' | 'help' | 'dock' | 'van';
export type TruckType = 'tractor' | 'box_truck';
export type TrailerType = 'standard' | 'transfer';
export type EntityStatus = 'active' | 'inactive' | 'maintenance' | 'retired';
