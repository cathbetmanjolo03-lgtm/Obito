/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  name: string;
  email: string;
  role: string;
  warning?: string;
}

export interface Project {
  id: string;
  title: string;
  status: "Planning" | "Designing" | "In Progress" | "Active" | "Completed";
  owner: string;
  budget: number;
  completion: number;
  timeline: string;
  description: string;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  category: "Physical Asset" | "Agricultural Asset" | "Real Estate" | "Equipment";
  monitor: string;
  health: string;
}

export interface AccountEntry {
  id: string;
  date: string;
  description: string;
  category: "Revenue" | "Expense" | "Reserve Transfer";
  amount: number;
  ref: string;
}

export interface RiskEntry {
  id: string;
  category: string;
  severity: "Low" | "Medium" | "High";
  probability: "Low" | "Medium" | "High";
  mitigation: string;
  director: string;
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  category: "Corporate" | "Farming" | "Forestry" | "General";
}

export interface CompanyValuation {
  id: string;
  company: string;
  bookValue: number;
  discountedCashFlow: number;
  valuationDate: string;
  valuer: string;
}

export interface CodeFile {
  filepath: string;
  content?: string;
}

export interface GMHDatabase {
  projects: Project[];
  assets: Asset[];
  accounts: AccountEntry[];
  risks: RiskEntry[];
  announcements: Announcement[];
  valuations: CompanyValuation[];
}
