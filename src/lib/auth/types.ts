export interface User {
  id: string;
  username: string;
  full_name: string;
  department: 'shipping' | 'transportation' | 'admin';
  is_admin: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
