
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  History, 
  Scan, 
  Settings as SettingsIcon, 
  Plus,
  Bell,
  Sparkles,
  CalendarDays,
  Mic,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Award
} from 'lucide-react';
import { Expense, AppSettings, AppTab, UserProfile, Subscription, PendingPurchase, UserStats, ViceGoal, CountryConfig, Reward } from './types';
import { STORAGE_KEY, SETTINGS_KEY, USER_KEY, SUBS_KEY, PENDING_KEY, STATS_KEY, VICE_GOAL_KEY, CATEGORIES, SUPPORTED_COUNTRIES } from './constants';
import Dashboard from './components/Dashboard';
import BillScanner from './components/BillScanner';
import ImageEditor from './components/ImageEditor';
import RegistrationForm from './components/RegistrationForm';
import Planner from './components/Planner';
import VoiceLogger from './components/VoiceLogger';
import Rewards from './components/Rewards';
import { subMonths, isAfter, parseISO, format } from 'date-fns';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<PendingPurchase[]>([]);
  
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    level: 1,
    badges: []
  });

  const [viceGoal, setViceGoal] = useState<ViceGoal>({
    goalName: 'New Goal',
    targetAmount: 5000,
    currentSavings: 0,
    viceName: 'Morning Snack',
    vicePrice: 100
  });

  const [settings, setSettings] = useState<AppSettings>({
    weeklyLimit: 5000,
    phoneNumber: '',
    monthlyIncome: 30000,
    country: 'IN',
    currencySymbol: '₹',
    language: 'en'
  });

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showVoiceLogger, setShowVoiceLogger] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    amount: 0,
    category: 'Other',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [notifications, setNotifications] = useState<string[]>([]);

  // Localization Helper
  const countryConfig: CountryConfig = SUPPORTED_COUNTRIES[settings.country] || SUPPORTED_COUNTRIES.IN;
  const t = (key: string) => countryConfig.translations[key] || key;

  // Load data
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedExp = localStorage.getItem(STORAGE_KEY);
    const storedSubs = localStorage.getItem(SUBS_KEY);
    const storedPend = localStorage.getItem(PENDING_KEY);
    const storedSett = localStorage.getItem(SETTINGS_KEY);
    const storedStats = localStorage.getItem(STATS_KEY);
    const storedGoal = localStorage.getItem(VICE_GOAL_KEY);
    
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      const config = SUPPORTED_COUNTRIES[u.country] || SUPPORTED_COUNTRIES.IN;
      setSettings(prev => ({
        ...prev,
        country: u.country,
        currencySymbol: config.symbol,
        monthlyIncome: u.monthlyIncome
      }));
    }
    if (storedSubs) setSubscriptions(JSON.parse(storedSubs));
    if (storedPend) setPendingPurchases(JSON.parse(storedPend));
    if (storedSett) setSettings(JSON.parse(storedSett));
    if (storedStats) setStats(JSON.parse(storedStats));
    if (storedGoal) setViceGoal(JSON.parse(storedGoal));

    if (storedExp) {
      const parsed = JSON.parse(storedExp) as Expense[];
      const twoMonthsAgo = subMonths(new Date(), 2);
      const filtered = parsed.filter(e => isAfter(parseISO(e.date), twoMonthsAgo));
      setExpenses(filtered);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    localStorage.setItem(SUBS_KEY, JSON.stringify(subscriptions));
    localStorage.setItem(PENDING_KEY, JSON.stringify(pendingPurchases));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    localStorage.setItem(VICE_GOAL_KEY, JSON.stringify(viceGoal));
  }, [expenses, settings, user, subscriptions, pendingPurchases, stats, viceGoal]);

  const handleRegister = (profile: UserProfile) => {
    const config = SUPPORTED_COUNTRIES[profile.country] || SUPPORTED_COUNTRIES.IN;
    setUser(profile);
    setSettings(prev => ({ 
      ...prev, 
      phoneNumber: profile.mobile, 
      monthlyIncome: profile.monthlyIncome,
      country: profile.country,
      currencySymbol: config.symbol
    }));
    setViceGoal(prev => ({
      ...prev,
      targetAmount: profile.country === 'JP' ? 50000 : 5000,
      vicePrice: profile.country === 'JP' ? 500 : 100
    }));
  };

  const addPoints = (amount: number) => {
    setStats(prev => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 100) + 1;
      return { ...prev, points: newPoints, level: newLevel };
    });
  };

  const redeemReward = (reward: Reward) => {
    if (stats.points >= reward.cost) {
      setStats(prev => ({
        ...prev,
        points: prev.points - reward.cost,
        badges: [...prev.badges, reward.icon]
      }));
      setNotifications(prev => [`Unlocked ${reward.name}! 🎉`, ...prev]);
    }
  };

  const skipVice = () => {
    const newSavings = viceGoal.currentSavings + viceGoal.vicePrice;
    setViceGoal(prev => ({
      ...prev,
      currentSavings: newSavings
    }));
    addPoints(15);
    
    if (newSavings >= viceGoal.targetAmount && viceGoal.currentSavings < viceGoal.targetAmount) {
      setNotifications(prev => [`DREAM GOAL ACHIEVED! 🏆`, ...prev]);
    } else {
      setNotifications(prev => [`FHP Earned! +15 XP`, ...prev]);
    }
  };

  const addExpense = (exp: Partial<Expense>) => {
    const fullExpense: Expense = {
      id: crypto.randomUUID(),
      amount: exp.amount || 0,
      category: exp.category || 'Other',
      description: exp.description || '',
      date: exp.date || new Date().toISOString()
    };
    
    setExpenses(prev => [fullExpense, ...prev]);
    addPoints(10);
    setShowAddForm(false);
    setActiveTab(AppTab.DASHBOARD);
  };

  const addMultipleExpenses = (exps: Partial<Expense>[]) => {
    const fullExps = exps.map(exp => ({
      id: crypto.randomUUID(),
      amount: exp.amount || 0,
      category: exp.category || 'Other',
      description: exp.description || '',
      date: exp.date || new Date().toISOString()
    }));
    setExpenses(prev => [...fullExps, ...prev]);
    addPoints(30);
    setActiveTab(AppTab.DASHBOARD);
  };

  const NavButton = ({ tab, icon: Icon, labelKey }: { tab: AppTab, icon: any, labelKey: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center py-2 px-3 transition-all ${
        activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={22} className={activeTab === tab ? 'scale-110' : ''} />
      <span className="text-[10px] mt-1 font-black">{t(labelKey)}</span>
    </button>
  );

  if (!user) return <RegistrationForm onRegister={handleRegister} />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {showVoiceLogger && (
        <VoiceLogger 
          onProcessed={addExpense} 
          onClose={() => setShowVoiceLogger(false)} 
          currencySymbol={settings.currencySymbol}
        />
      )}

      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-black leading-tight">SpendWise AI</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('home')}, {user.name} {countryConfig.flag}</p>
          </div>
        </div>
        <button onClick={() => setNotifications([])} className="relative p-2 text-slate-400">
          <Bell size={24} />
          {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === AppTab.DASHBOARD && (
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            <button 
              onClick={() => setShowVoiceLogger(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
            >
              <Mic size={18} fill="white" />
              <span className="text-sm font-black whitespace-nowrap">{t('voiceLog')}</span>
            </button>
            <div className="flex gap-2">
              {[
                { label: 'Food', icon: Utensils, cat: 'Food' },
                { label: 'Cab', icon: Car, cat: 'Transport' },
                { label: 'Shopping', icon: ShoppingBag, cat: 'Shopping' },
                { label: 'Bill', icon: Zap, cat: 'Utilities' },
              ].map(action => (
                <button 
                  key={action.label}
                  onClick={() => {
                    setNewExpense({ ...newExpense, category: action.cat });
                    setShowAddForm(true);
                  }}
                  className="flex-shrink-0 flex items-center gap-2 bg-white border border-slate-100 px-4 py-3 rounded-2xl shadow-sm text-slate-600 hover:text-indigo-600 transition-all font-bold text-sm whitespace-nowrap"
                >
                  <action.icon size={16} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {notifications.map((note, idx) => (
          <div key={idx} className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-bounce-short">
            <span className="text-sm font-bold">{note}</span>
            <button onClick={() => setNotifications([])} className="text-emerald-400 text-xs font-black uppercase">Close</button>
          </div>
        ))}

        {activeTab === AppTab.DASHBOARD && (
          <Dashboard 
            expenses={expenses} 
            subscriptions={subscriptions} 
            settings={settings} 
            stats={stats}
            viceGoal={viceGoal}
            onSkipVice={skipVice}
            onClaimDailyBonus={() => addPoints(50)}
            onNavigateToPlanner={() => setActiveTab(AppTab.PLANNER)}
            t={t}
          />
        )}
        
        {activeTab === AppTab.PLANNER && (
          <Planner 
            subscriptions={subscriptions} 
            pendingPurchases={pendingPurchases}
            viceGoal={viceGoal}
            onUpdateViceGoal={setViceGoal}
            onAddSub={(s) => setSubscriptions([...subscriptions, s])}
            onDeleteSub={(id) => setSubscriptions(subscriptions.filter(s => s.id !== id))}
            onAddPending={(p) => setPendingPurchases([...pendingPurchases, p])}
            onApprovePending={(p) => addExpense({ amount: p.amount, description: p.name, category: 'Shopping' })}
            onDeletePending={(id) => setPendingPurchases(pendingPurchases.filter(p => p.id !== id))}
            currencySymbol={settings.currencySymbol}
            t={t}
          />
        )}
        {activeTab === AppTab.SCANNER && <BillScanner onExpensesExtracted={addMultipleExpenses} currencySymbol={settings.currencySymbol} />}
        {activeTab === AppTab.REWARDS && <Rewards stats={stats} onRedeem={redeemReward} t={t} />}
        {activeTab === AppTab.HISTORY && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-black uppercase tracking-widest text-xs">{t('ledger')}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {expenses.length === 0 ? <div className="p-12 text-center text-slate-400">No history found.</div> : expenses.map(exp => (
                <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black uppercase text-xs">{exp.category[0]}</div>
                    <div>
                      <p className="font-bold text-black">{exp.description || exp.category}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{format(parseISO(exp.date), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                  <p className="font-black text-black">-{settings.currencySymbol}{exp.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === AppTab.SETTINGS && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-lg mx-auto space-y-6">
            <h3 className="text-xl font-extrabold text-black">{t('prefs')}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Mobile</p>
                 <p className="text-black font-bold">{user.mobile}</p>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 text-black">{t('monthlyIncome')} ({settings.currencySymbol})</label>
                <input 
                  type="number" value={settings.monthlyIncome}
                  onChange={(e) => setSettings({...settings, monthlyIncome: Number(e.target.value)})}
                  className="w-full p-4 bg-slate-50 rounded-2xl text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="w-full py-4 text-red-500 font-bold border border-red-50 rounded-2xl hover:bg-red-50 mt-4"
              >
                Reset & Logout
              </button>
            </div>
          </div>
        )}
      </main>

      <button 
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-indigo-600 text-white rounded-3xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-4 border-white"
      >
        <Plus size={32} />
      </button>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavButton tab={AppTab.DASHBOARD} icon={LayoutDashboard} labelKey="home" />
        <NavButton tab={AppTab.REWARDS} icon={Award} labelKey="rewards" />
        <NavButton tab={AppTab.HISTORY} icon={History} labelKey="ledger" />
        <NavButton tab={AppTab.PLANNER} icon={CalendarDays} labelKey="plan" />
        <NavButton tab={AppTab.SCANNER} icon={Scan} labelKey="ocr" />
        <NavButton tab={AppTab.SETTINGS} icon={SettingsIcon} labelKey="prefs" />
      </nav>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-black">{t('logExpense')}</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 font-bold uppercase text-xs">Close</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); addExpense(newExpense); }} className="space-y-4">
              <input required type="number" placeholder={`${settings.currencySymbol} Amount`} value={newExpense.amount || ''} onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                className="w-full p-6 bg-slate-50 rounded-3xl border-none ring-1 ring-slate-100 focus:ring-4 focus:ring-indigo-500/20 text-3xl font-black text-black text-center"
              />
              <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-2xl text-black font-bold outline-none ring-1 ring-slate-100"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Note" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-2xl text-black font-bold outline-none ring-1 ring-slate-100"
              />
              <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 mt-4 active:scale-95 transition-transform">
                {t('logExpense')}
              </button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-short { animation: bounce-short 1s ease-in-out; }
        @keyframes pulse-short { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        .animate-pulse-short { animation: pulse-short 2s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default App;
