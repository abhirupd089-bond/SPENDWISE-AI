
export interface UserProfile {
  name: string;
  mobile: string;
  monthlyIncome: number;
  country: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO format
  description: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  lastUsedDate: string;
  category: string;
  isEssential: boolean;
}

export interface PendingPurchase {
  id: string;
  name: string;
  amount: number;
  createdAt: string; // ISO
  description: string;
}

export interface ViceGoal {
  goalName: string;
  targetAmount: number;
  currentSavings: number;
  viceName: string;
  vicePrice: number;
}

export interface UserStats {
  points: number;
  level: number;
  badges: string[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'badge' | 'perk' | 'theme';
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  PLANNER = 'planner',
  SCANNER = 'scanner',
  EDITOR = 'editor',
  SETTINGS = 'settings',
  REWARDS = 'rewards'
}

export interface AppSettings {
  weeklyLimit: number;
  phoneNumber: string;
  monthlyIncome: number;
  country: string;
  currencySymbol: string;
  language: string;
}

export interface CountryConfig {
  name: string;
  code: string;
  flag: string;
  currency: string;
  symbol: string;
  callingCode: string;
  locale: string;
  translations: Record<string, string>;
}
