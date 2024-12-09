export interface DashboardMetrics {
  totalUsers: Metric;
  activeOrders: Metric;
  revenue: Metric;
  pendingApprovals: Metric;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: string;
}

export interface ChartData {
  name: string;
  value: number;
}