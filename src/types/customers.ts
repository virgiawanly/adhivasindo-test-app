import { Company } from './companies';
import { Outlet } from './outlets';

export interface Customer {
  id: number;
  company_id: number;
  outlet_id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  company?: Company;
  outlet?: Outlet;
}
