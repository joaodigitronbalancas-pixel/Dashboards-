/**
 * Types for the Enterprise BI & Analytics Platform
 */

export type UserRole = 'SUPER_ADMIN' | 'DIRETORIA' | 'GERENTE' | 'SUPERVISOR' | 'OPERADOR' | 'CLIENTE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  permissions: string[];
}

export interface Company {
  id: string;
  name: string;
  group: string;
  segment: string;
  units: string[];
}

export type ConnectorType = 
  | 'postgresql' | 'mysql' | 'sqlserver' | 'mongodb' | 'firebase' | 'supabase'
  | 'excel' | 'csv' | 'google_sheets'
  | 'rest_api' | 'graphql'
  | 'sap' | 'totvs' | 'omie' | 'bling'
  | 'salesforce' | 'hubspot' | 'pipedrive'
  | 'google_analytics' | 'google_ads' | 'meta_ads';

export interface DataConnector {
  id: string;
  name: string;
  type: ConnectorType;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  details: {
    host?: string;
    database?: string;
    url?: string;
    fileName?: string;
  };
}

export type SectorType = 'COMERCIAL' | 'FINANCEIRO' | 'RH' | 'MARKETING' | 'ATENDIMENTO' | 'LOGÍSTICA' | 'PRODUÇÃO';

export type WidgetType = 
  | 'kpi' | 'bar' | 'line' | 'area' | 'pie' | 'donut' 
  | 'heatmap' | 'treemap' | 'scatter' | 'radar' | 'funnel' 
  | 'gauge' | 'timeline' | 'table' | 'ranking' | 'forecast';

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  w: number; // width in grid (1 to 12)
  h: number; // height unit
  x?: number;
  y?: number;
  metric: string;
  color?: string;
  config?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  sector: SectorType;
  isPublic: boolean;
  isFavorite: boolean;
  userId: string;
  companyId: string;
  widgets: Widget[];
  createdAt: string;
  theme?: string;
}

export interface AdvancedFilter {
  period: 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'last_month' | 'custom';
  startDate?: string;
  endDate?: string;
  companyId: string;
  unit: string;
  region: string;
  category: string;
  product: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ip: string;
}

export interface ScheduledReport {
  id: string;
  dashboardId: string;
  dashboardTitle: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'PDF' | 'EXCEL' | 'PNG';
  time: string;
  active: boolean;
}

export interface Comment {
  id: string;
  dashboardId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  timestamp: string;
}
