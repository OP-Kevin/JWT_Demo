export interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  exp: number;
}

export interface DashboardData {
  message: string;
  role: string;
  stats: Record<string, string | number>;
  permissions: string[];
}
