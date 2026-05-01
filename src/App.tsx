import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trophy, User, ArrowLeft, RefreshCcw, Sparkles, LayoutDashboard, ListTodo, Calendar, TrendingUp, Plus, Send, AlertTriangle, Lock } from 'lucide-react';
import { fetchTasks, updateTaskStatus, fetchMembers, assignTask, resetScores, fetchAdminSummary } from './services/gasService';
import { getMotivationalNudge } from './services/geminiService';
import { Task, Member } from './types';

export default function App() {
  const [user, setUser] = useState<string | null>(localStorage.getItem('team_member_name'));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [nudge, setNudge] = useState<string>('');
  const [view, setView] = useState<'landing' | 'dashboard' | 'scoreboard' | 'admin'>(user ? 'dashboard' : 'landing');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    } else {
      loadMembers();
    }
  }, [user]);

  const loadMembers = async () => {
    const data = await fetchMembers();
    setMembers(data);
  };

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fetchedTasks, availableMembers] = await Promise.all([
        fetchTasks(user),
        fetchMembers(),
      ]);
      setTasks(fetchedTasks);
      setMembers(availableMembers);
      
      const pending = fetchedTasks.filter(t => t.status === 'Pending').length;
      if (pending > 0) {
        const msg = await getMotivationalNudge(pending);
        setNudge(msg);
      } else {
        setNudge("You're all caught up! Great work.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (name: string) => {
    setUser(name);
    localStorage.setItem('team_member_name', name);
    setView('dashboard');
  };

  const handleMarkDone = async (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Done' } : t));
    const success = await updateTaskStatus(taskId, 'Done');
    if (!success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Pending' } : t));
    } else {
      loadDashboardData();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('team_member_name');
    setView('landing');
  };

  const handleAdminAuth = (password: string) => {
    if (password === '8130859152') {
      setView('admin');
      setShowAdminLogin(false);
    } else {
      alert("Incorrect Admin Password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 sm:p-6 md:p-12">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <LandingView 
            members={members} 
            onSelect={handleSelectUser} 
            onAdminRequest={() => setShowAdminLogin(true)} 
          />
        ) : view === 'dashboard' ? (
          <DashboardView 
            user={user!} 
            tasks={tasks} 
            members={members}
            nudge={nudge}
            loading={loading}
            onMarkDone={handleMarkDone}
            onRefresh={loadDashboardData}
            onLogout={logout}
            onSwitchView={(v: any) => setView(v)}
          />
        ) : view === 'scoreboard' ? (
          <ScoreboardView 
            members={members} 
            onBack={() => setView('dashboard')} 
          />
        ) : (
          <AdminView 
            members={members} 
            onBack={() => setView('landing')} 
            onTaskAssigned={loadMembers}
          />
        )}
      </AnimatePresence>

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminAuthModal 
            onClose={() => setShowAdminLogin(false)} 
            onAuth={handleAdminAuth} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingView({ members, onSelect, onAdminRequest }: any) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md glass-card rounded-[2.5rem] p-8 sm:p-10 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary to-secondary" />
      
      {/* Admin Access Button */}
      <button 
        onClick={onAdminRequest}
        className="absolute top-6 right-6 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
      >
        <Lock size={12} /> Admin
      </button>

      <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
        <Trophy size={40} strokeWidth={2.5} />
      </div>
      
      <h1 className="text-4xl font-display font-bold tracking-tight mb-3 text-slate-900">Task Tracker</h1>
      <p className="text-slate-500 mb-10 text-lg">Select your profile to start</p>
      
      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
        {members.map((member: any) => (
          <button
            key={member.name}
            onClick={() => onSelect(member.name)}
            className="w-full p-5 bg-white/50 hover:bg-white border border-slate-200 rounded-2xl flex items-center justify-between transition-all group hover:border-primary hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <User size={24} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-800 text-lg">{member.name}</span>
                <span className="text-xs text-slate-400">Team Member</span>
              </div>
            </div>
            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold">
              {member.weeklyScore} pts
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function AdminAuthModal({ onClose, onAuth }: any) {
  const [pass, setPass] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-8 w-full max-w-xs shadow-2xl"
      >
        <h3 className="text-xl font-bold mb-2">Admin Access</h3>
        <p className="text-sm text-slate-500 mb-6">Enter the management password</p>
        <input 
          type="password" 
          autoFocus
          placeholder="••••••••••"
          className="w-full p-4 bg-slate-100 border-none rounded-xl mb-4 text-center text-lg tracking-widest outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAuth(pass)}
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 p-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Cancel</button>
          <button onClick={() => onAuth(pass)} className="flex-1 p-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Verify</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdminView({ members, onBack, onTaskAssigned }: any) {
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Daily', assignedTo: members[0]?.name || '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    loadSummary();
  }, [members]);

  const loadSummary = async () => {
    const data = await fetchAdminSummary();
    setSummary(data);
  };

  const handleAssign = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const success = await assignTask({
      name: form.name,
      type: form.type as any,
      assignedTo: form.assignedTo,
      plannedDate: form.date,
      status: 'Pending'
    });
    if (success) {
      setForm({ ...form, name: '' });
      loadSummary();
      onTaskAssigned();
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (confirm("Reset all team scores to zero?")) {
      await resetScores();
      loadSummary();
      onTaskAssigned();
    }
  };

  return (
    <motion.div
      key="admin"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[420px] h-full sm:h-[840px] bg-slate-50 sm:rounded-[3rem] overflow-hidden flex flex-col relative sm:border-[12px] border-slate-900"
    >
      <header className="px-8 pt-10 pb-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900"><ArrowLeft size={24} /></button>
        <h2 className="font-display font-bold text-xl">Admin Control</h2>
        <button onClick={handleReset} className="p-2 text-red-400 hover:text-red-600"><TrendingUp size={24} /></button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Teams</span>
              <div className="text-2xl font-bold text-slate-900">{members.length}</div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Pending</span>
              <div className="text-2xl font-bold text-red-500">
                {Object.values(summary).reduce((acc: number, val: any) => acc + (val.pending || 0), 0)}
              </div>
           </div>
        </div>

        <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
           <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-primary" /> New Assignment</h3>
           <form onSubmit={handleAssign} className="space-y-4">
              <input 
                type="text" 
                placeholder="Task name..." 
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 ring-primary/20 outline-none"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
              <div className="flex gap-2">
                <select 
                  className="flex-1 p-4 bg-slate-50 border-none rounded-xl text-sm outline-none"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>One-time</option>
                </select>
                <select 
                  className="flex-1 p-4 bg-slate-50 border-none rounded-xl text-sm outline-none"
                  value={form.assignedTo}
                  onChange={e => setForm({...form, assignedTo: e.target.value})}
                >
                  {members.map((m: any) => <option key={m.name}>{m.name}</option>)}
                </select>
              </div>
              <input 
                type="date" 
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm outline-none"
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full p-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={18} /> Assign Now
              </button>
           </form>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Team Overview</h3>
          <div className="space-y-3">
             {members.map((member: any) => {
               const stats = summary[member.name] || { pending: 0, completed: 0 };
               return (
                 <div key={member.name} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                         <User size={18} />
                       </div>
                       <div>
                         <div className="font-bold text-sm">{member.name}</div>
                         <div className="text-[10px] text-slate-400">{stats.completed} done • {stats.pending} pending</div>
                       </div>
                    </div>
                    {stats.pending > 0 && <AlertTriangle size={16} className="text-amber-500" />}
                 </div>
               );
             })}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

function DashboardView({ user, tasks, members, nudge, loading, onMarkDone, onRefresh, onLogout, onSwitchView }: any) {
  const recurringTasks = tasks.filter((t: any) => t.type !== 'One-time');
  const individualTasks = tasks.filter((t: any) => t.type === 'One-time');
  const userScore = members.find((m: any) => m.name === user)?.weeklyScore || 0;

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[420px] h-full sm:h-[840px] bg-white sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative sm:border-[12px] border-slate-900"
    >
      <header className="px-8 pt-10 pb-6 bg-linear-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900">{user}</h2>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar size={14} /> Today's Focus
            </p>
          </div>
          <button 
            onClick={() => onSwitchView('scoreboard')}
            className="flex flex-col items-end group"
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Your Score</div>
            <div className="bg-primary text-white px-4 py-1.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              {userScore} pts
            </div>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50/30">
        <section className="mb-8 p-6 bg-linear-to-br from-primary to-indigo-600 text-white rounded-[2rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
            <Sparkles size={48} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-200" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100">AI Productivity Coach</span>
            </div>
            <p className="text-lg font-medium leading-tight">
              {nudge || "Analyzing your schedule..."}
            </p>
          </div>
        </section>

        <div className="space-y-10">
          <section>
            <div className="flex items-center justify-between px-2 mb-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-[0.15em] flex items-center gap-2">
                <RefreshCcw size={14} className="text-primary" /> Recurring Goals
              </h3>
              <span className="text-[10px] font-bold text-slate-300">{recurringTasks.length} total</span>
            </div>
            <div className="space-y-4">
              {recurringTasks.map((task: any) => (
                <TaskCard key={task.id} task={task} onMarkDone={onMarkDone} />
              ))}
              {recurringTasks.length === 0 && <EmptyState text="No recurring tasks" />}
            </div>
          </section>

          <section className="pb-10">
            <div className="flex items-center justify-between px-2 mb-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-[0.15em] flex items-center gap-2">
                <ListTodo size={14} className="text-secondary" /> One-time Tasks
              </h3>
              <span className="text-[10px] font-bold text-slate-300">{individualTasks.length} total</span>
            </div>
            <div className="space-y-4">
              {individualTasks.map((task: any) => (
                <TaskCard key={task.id} task={task} onMarkDone={onMarkDone} />
              ))}
              {individualTasks.length === 0 && <EmptyState text="No pending tasks" />}
            </div>
          </section>
        </div>
      </main>

      <nav className="h-20 border-t border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-around px-8">
        <button className="p-3 text-primary bg-primary/10 rounded-2xl"><LayoutDashboard size={24} /></button>
        <button onClick={onRefresh} disabled={loading} className={`p-3 text-slate-300 ${loading ? 'animate-spin text-primary' : ''}`}><RefreshCcw size={24} /></button>
        <button onClick={onLogout} className="p-3 text-slate-300 hover:text-red-500"><ArrowLeft size={24} /></button>
      </nav>
    </motion.div>
  );
}

function TaskCard({ task, onMarkDone }: { task: Task, onMarkDone: (id: string) => void }) {
  const isDone = task.status === 'Done';
  return (
    <motion.div layout className={`p-5 rounded-3xl border-2 transition-all ${isDone ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-white shadow-sm'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <span className={`w-2 h-2 rounded-full ${task.type === 'Daily' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.type}</span>
          </div>
          <h4 className={`text-base font-bold leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.name}</h4>
        </div>
        {!isDone && (
          <button onClick={() => onMarkDone(task.id)} className="shrink-0 bg-emerald-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"><CheckCircle2 size={24} /></button>
        )}
      </div>
    </motion.div>
  );
}

function ScoreboardView({ members, onBack }: any) {
  const sortedMembers = [...members].sort((a, b) => b.weeklyScore - a.weeklyScore);
  return (
    <motion.div key="scoreboard" className="w-full max-w-[420px] h-full sm:h-[840px] bg-slate-900 sm:rounded-[3rem] overflow-hidden flex flex-col sm:border-[12px] border-slate-800">
      <header className="px-8 pt-12 pb-8 bg-linear-to-b from-slate-800 to-slate-900">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400"><ArrowLeft size={20} /> <span className="text-sm font-bold">Back</span></button>
        <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Trophy className="text-amber-400" /> Leaderboard</h2>
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        <div className="space-y-4">
          {sortedMembers.map((member, index) => (
            <div key={member.name} className={`p-5 rounded-[2rem] flex items-center justify-between ${index === 0 ? 'bg-amber-400/10 border-2 border-amber-400/20' : 'bg-slate-800/50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>{index + 1}</div>
                <div className="text-white font-bold">{member.name}</div>
              </div>
              <div className="text-xl font-display font-bold text-white">{member.weeklyScore} <span className="text-[10px] text-slate-500 uppercase">pts</span></div>
            </div>
          ))}
        </div>
      </main>
    </motion.div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-8 text-center bg-white/20 rounded-3xl border border-dashed border-slate-200">
      <p className="text-sm text-slate-400 italic">{text}</p>
    </div>
  );
}
