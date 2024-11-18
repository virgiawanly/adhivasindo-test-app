import { Company } from './companies';

export interface Outlet {
  id: number;
  company_id: number;
  name: string;
  address: string | null;
  phone: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  company?: Company;
}
