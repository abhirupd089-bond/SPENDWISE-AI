
import { CountryConfig, Reward } from './types';

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const CATEGORIES = [
  'Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Subscription', 'Other'
];

export const STORAGE_KEY = 'spendwise_data_v2';
export const SUBS_KEY = 'spendwise_subs_v1';
export const PENDING_KEY = 'spendwise_pending_v1';
export const SETTINGS_KEY = 'spendwise_settings_v2';
export const USER_KEY = 'spendwise_user_v1';
export const STATS_KEY = 'spendwise_stats_v1';
export const VICE_GOAL_KEY = 'spendwise_vice_goal_v1';

export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
export const COOLING_OFF_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const SUPPORTED_COUNTRIES: Record<string, CountryConfig> = {
  IN: {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    currency: 'INR',
    symbol: '₹',
    callingCode: '+91',
    locale: 'en-IN',
    translations: {
      home: 'Home',
      ledger: 'Ledger',
      plan: 'Plan',
      ocr: 'Scan',
      lab: 'Lab',
      prefs: 'Prefs',
      rewards: 'FHP',
      safeToSpend: 'Safe-to-Spend',
      monthlyIncome: 'Monthly Income',
      weeklyActivity: 'Weekly Activity',
      logExpense: 'Log Expense',
      confirmPurchase: 'Confirm Purchase',
      dreamGoal: 'Dream Goal',
      skipped: 'I skipped my',
      voiceLog: 'Voice Log'
    }
  },
  US: {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    callingCode: '+1',
    locale: 'en-US',
    translations: {
      home: 'Home',
      ledger: 'History',
      plan: 'Planner',
      ocr: 'Scan',
      lab: 'Studio',
      prefs: 'Settings',
      rewards: 'Rewards',
      safeToSpend: 'Safe-to-Spend',
      monthlyIncome: 'Monthly Income',
      weeklyActivity: 'Weekly Spending',
      logExpense: 'Add Expense',
      confirmPurchase: 'Confirm Purchase',
      dreamGoal: 'Dream Goal',
      skipped: 'I skipped my',
      voiceLog: 'Voice Log'
    }
  },
  JP: {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    currency: 'JPY',
    symbol: '¥',
    callingCode: '+81',
    locale: 'ja-JP',
    translations: {
      home: 'ホーム',
      ledger: '履歴',
      plan: '計画',
      ocr: 'スキャン',
      lab: 'ラボ',
      prefs: '設定',
      rewards: 'リワード',
      safeToSpend: '利用可能残高',
      monthlyIncome: '月収',
      weeklyActivity: '週間の活動',
      logExpense: '支出を記録',
      confirmPurchase: '購入を確定',
      dreamGoal: '夢の目標',
      skipped: 'を我慢しました',
      voiceLog: '音声入力'
    }
  },
  FR: {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    currency: 'EUR',
    symbol: '€',
    callingCode: '+33',
    locale: 'fr-FR',
    translations: {
      home: 'Accueil',
      ledger: 'Historique',
      plan: 'Planning',
      ocr: 'Scanner',
      lab: 'Atelier',
      prefs: 'Réglages',
      rewards: 'Prix',
      safeToSpend: 'Solde disponible',
      monthlyIncome: 'Revenu mensuel',
      weeklyActivity: 'Activité hebdo',
      logExpense: 'Nouvelle dépense',
      confirmPurchase: 'Confirmer l\'achat',
      dreamGoal: 'Objectif de rêve',
      skipped: 'J\'ai évité mon',
      voiceLog: 'Dictée'
    }
  }
};

export const REWARDS: Reward[] = [
  { id: 'badge_1', name: 'Budget Sensei', description: '7 days under budget streak', cost: 150, icon: '🏆', category: 'badge' },
  { id: 'badge_2', name: 'AI Pioneer', description: 'Used AI features 10 times', cost: 300, icon: '🤖', category: 'badge' },
  { id: 'perk_1', name: 'Gold Icon', description: 'Unlock a golden app interface', cost: 500, icon: '✨', category: 'perk' },
  { id: 'badge_3', name: 'Willpower Pro', description: 'Skipped 20 vices', cost: 400, icon: '💎', category: 'badge' },
  { id: 'theme_1', name: 'Cyberpunk Mode', description: 'Neon UI palette', cost: 1000, icon: '🌃', category: 'theme' },
];

export const BADGES = [
  { id: 'streak_7', name: 'Budget Sensei', desc: '7 days under budget', icon: '🏆' },
  { id: 'scan_5', name: 'AI Pioneer', desc: 'Used OCR 5 times', icon: '🤖' },
  { id: 'vice_master', name: 'Willpower Pro', desc: 'Skipped 10 vices', icon: '💎' },
];
