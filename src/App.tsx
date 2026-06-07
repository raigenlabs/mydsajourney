import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Lock,
  Unlock,
  ExternalLink,
  Search,
  Award,
  BookOpen,
  Sparkles,
  TrendingUp,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  LogIn,
  LogOut,
  Info,
  Filter
} from 'lucide-react';

import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LEETCODE_PLAN, WeekPlan, Problem, DayPlan } from './data';
import { ProgressState, Stats, WeekStats } from './types';

// Admin details
const ADMIN_EMAIL = 'officialraghav674@gmail.com';

export default function App() {
  // Session states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Real-time Database status
  const [dbState, setDbState] = useState<ProgressState>({
    completed: {},
    updatedAt: '',
    updatedBy: ''
  });
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [authError, setAuthError] = useState<string | null>(null);
  const [initRequired, setInitRequired] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [levelFilter, setLevelFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    0: true // Keep first week open of start
  });

  // Calculate slugified LeetCode search url of fallback
  function getLeetCodeUrl(name: string): string {
    const cleanName = name
      .toLowerCase()
      .replace(/\s*\(.*\)\s*/g, '') // Remove info inside parentheses
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with dashes
    return `https://leetcode.com/problems/${cleanName}/`;
  }

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Monitor Firestore progress realtime updates
  useEffect(() => {
    setLoadingData(true);
    const progressDocRef = doc(db, 'progress', 'master');
    
    const unsubscribe = onSnapshot(
      progressDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setDbState({
            completed: data.completed || {},
            updatedAt: data.updatedAt ? data.updatedAt.toDate().toLocaleString() : '',
            updatedBy: data.updatedBy || ''
          });
          setInitRequired(false);
        } else {
          // No document found, we want to flag that initialization could be done by admin
          setDbState({
            completed: {},
            updatedAt: '',
            updatedBy: ''
          });
          setInitRequired(true);
        }
        setLoadingData(false);
        setSyncStatus('synced');
      },
      (error) => {
        setSyncStatus('error');
        setLoadingData(false);
        try {
          handleFirestoreError(error, OperationType.GET, 'progress/master');
        } catch (e) {
          console.error("Firebase realtime sync error gracefully handled.");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Google Login popup
  const loginWithGoogle = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Auth login failed:", error);
      setAuthError(error.message || 'Login failed. Please verify popup permissions.');
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const isAdmin = currentUser && currentUser.email === ADMIN_EMAIL && currentUser.emailVerified;

  // Auto initialize database document if Admin is logged in and document is missing
  useEffect(() => {
    if (isAdmin && initRequired && !saving) {
      initializeDatabase();
    }
  }, [isAdmin, initRequired]);

  // Handle DB instantiation
  const initializeDatabase = async () => {
    setSaving(true);
    setSyncStatus('saving');
    try {
      const progressDocRef = doc(db, 'progress', 'master');
      await setDoc(progressDocRef, {
        completed: {},
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || 'System Setup'
      });
      setInitRequired(false);
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      try {
        handleFirestoreError(error, OperationType.WRITE, 'progress/master');
      } catch (e) {
        console.error("Handled initialization permission error.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Toggle problem completion
  const handleToggleProblem = async (weekIdx: number, dayIdx: number, probIdx: number) => {
    if (!isAdmin) {
      // Show admin locked warning
      alert(`Access Restricted! Only Raghav (${ADMIN_EMAIL}) can update data.`);
      return;
    }

    const key = `${weekIdx}-${dayIdx}-${probIdx}`;
    const newCompleted = { ...dbState.completed };
    
    if (newCompleted[key]) {
      delete newCompleted[key];
    } else {
      newCompleted[key] = true;
    }

    setSaving(true);
    setSyncStatus('saving');

    try {
      const progressDocRef = doc(db, 'progress', 'master');
      await setDoc(progressDocRef, {
        completed: newCompleted,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || ADMIN_EMAIL
      });
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      try {
        handleFirestoreError(error, OperationType.WRITE, 'progress/master');
      } catch (e) {
        alert("Save failed! Please verify authorization.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Global counts calculation
  const totalStats = useMemo<Stats>(() => {
    let total = 0;
    let completedCount = 0;

    LEETCODE_PLAN.forEach((week, wIdx) => {
      week.days.forEach((day, dIdx) => {
        day.problems.forEach((_, pIdx) => {
          total++;
          const key = `${wIdx}-${dIdx}-${pIdx}`;
          if (dbState.completed[key]) {
            completedCount++;
          }
        });
      });
    });

    return {
      total,
      completedCount,
      remainingCount: total - completedCount,
      percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0
    };
  }, [dbState.completed]);

  // Week-wise stats calculation
  const weekStats = useMemo<WeekStats[]>(() => {
    return LEETCODE_PLAN.map((week, wIdx) => {
      let total = 0;
      let completedCount = 0;

      week.days.forEach((day, dIdx) => {
        day.problems.forEach((_, pIdx) => {
          total++;
          const key = `${wIdx}-${dIdx}-${pIdx}`;
          if (dbState.completed[key]) {
            completedCount++;
          }
        });
      });

      return {
        weekIndex: wIdx,
        weekName: week.week,
        total,
        completedCount,
        percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0
      };
    });
  }, [dbState.completed]);

  // Toggle week collapse state
  const toggleWeek = (index: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Filter problems correctly and keep structure
  const filteredPlan = useMemo(() => {
    return LEETCODE_PLAN.map((week, wIdx) => {
      // Level Filter check
      if (levelFilter !== 'All' && week.level !== levelFilter) {
        return { ...week, days: [], match: false };
      }

      const filteredDays = week.days.map((day, dIdx) => {
        const filteredProbs = day.problems.map((prob, pIdx) => {
          const key = `${wIdx}-${dIdx}-${pIdx}`;
          const isCompleted = !!dbState.completed[key];

          // Difficulty filter check
          const matchesDifficulty = difficultyFilter === 'All' || prob.difficulty === difficultyFilter;
          // Status filter check
          const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Completed' && isCompleted) ||
            (statusFilter === 'Pending' && !isCompleted);
          // Text search filter check
          const matchesSearch =
            searchQuery.trim() === '' ||
            prob.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            day.topic.toLowerCase().includes(searchQuery.toLowerCase());

          return {
            ...prob,
            originalIndex: pIdx,
            matches: matchesDifficulty && matchesStatus && matchesSearch
          };
        }).filter(p => p.matches);

        return {
          ...day,
          originalIndex: dIdx,
          problems: filteredProbs
        };
      }).filter(d => d.problems.length > 0);

      return {
        ...week,
        originalIndex: wIdx,
        days: filteredDays,
        match: filteredDays.length > 0
      };
    }).filter(w => w.match);
  }, [searchQuery, difficultyFilter, statusFilter, levelFilter, dbState.completed]);

  // Quick action: Collapse all / Expand all
  const expandAllWeeks = () => {
    const allExpanded: Record<number, boolean> = {};
    LEETCODE_PLAN.forEach((_, idx) => {
      allExpanded[idx] = true;
    });
    setExpandedWeeks(allExpanded);
  };

  const collapseAllWeeks = () => {
    setExpandedWeeks({});
  };

  return (
    <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-50">
      
      {/* Dynamic Sync Status bar */}
      <div className="bg-slate-900 text-xs text-slate-300 py-2 px-4 shadow-sm border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-mono text-[10px] tracking-wide uppercase">
              {syncStatus === 'synced' ? 'Live Synced' : syncStatus === 'saving' ? 'Syncing...' : 'Sync Interrupted'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {dbState.updatedAt && (
              <span className="text-slate-400 text-[10px]">
                Last updated:{' '}
                <span className="font-mono font-medium">{dbState.updatedAt}</span>
              </span>
            )}
            
            <div className="flex items-center gap-2">
              {loadingAuth ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
              ) : currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-xs text-slate-400">
                    Logged in as: <span className="text-slate-200 font-semibold">{currentUser.email}</span>
                  </span>
                  {isAdmin ? (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      <Unlock className="w-2.5 h-2.5" /> Admin Mode
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> View Only
                    </span>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1 hover:text-slate-100 text-[11px] font-medium transition cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center gap-1.5 hover:text-slate-100 text-[11px] font-medium transition cursor-pointer"
                  title="Admin Log In"
                >
                  <LogIn className="w-3.5 h-3.5" /> Admin Portal
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Header Block */}
        <div className="mb-10 text-center sm:text-left sm:flex sm:justify-between sm:items-end border-b border-slate-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium mb-3 border border-emerald-100">
              <Sparkles className="w-3.5 h-3.5" />
              Raghav's Personal Roadmap
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900">
              My DSA Journey
            </h1>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">
              Public tracking dashboard based on a highly structured 2-month LeetCode Mastery Plan. 
              Roz 3-4 problems to dominate coding interviews.
            </p>
          </div>

          <div className="mt-6 sm:mt-0 flex justify-center sm:justify-end gap-3">
            <a
              href="https://neetcode.io"
              target="_blank"
              rel="noreferrer referrer"
              className="inline-flex items-center gap-1 text-xs text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 py-2 px-3.5 rounded-lg font-medium shadow-xs transition"
            >
              NeetCode Probs <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Global Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Main Progress Ring / Score Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between gap-6 md:col-span-2">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2.5">
                <span>Total Completion Course</span>
                <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                  {totalStats.percentage}%
                </span>
              </div>
              
              {/* Massive Progression Bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalStats.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Progress Labels */}
              <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</div>
                  <div className="text-xl font-display font-extrabold text-slate-800 mt-0.5">{totalStats.total}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</div>
                  <div className="text-xl font-display font-extrabold text-slate-800 mt-0.5 flex justify-center items-center gap-1">
                    <span className="text-emerald-600">{totalStats.completedCount}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Remaining</div>
                  <div className="text-xl font-display font-extrabold text-slate-800 mt-0.5">{totalStats.remainingCount}</div>
                </div>
              </div>
            </div>

            {/* Micro Badge widget */}
            <div className="hidden sm:flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl p-4 w-28 text-center shrink-0">
              <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-full mb-1">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wide">LEVEL</span>
              <span className="text-xs font-bold text-slate-700 mt-0.5">LeetCoder</span>
            </div>
          </div>

          {/* Quick Week-by-Week Map Grid */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-slate-500" /> Week Overview
            </h3>

            <div className="grid grid-cols-4 gap-2.5 my-3.5">
              {weekStats.map((w, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Open the clicked week
                    setExpandedWeeks(prev => ({ ...prev, [index]: true }));
                    // Scroll to it nicely
                    const element = document.getElementById(`week-block-${index}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`text-left p-1.5 rounded-lg border transition group cursor-pointer ${
                    w.percentage === 100
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : w.percentage > 0
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-slate-500">W {index + 1}</div>
                  <div className="text-xs font-mono font-extrabold mt-0.5">{w.percentage}%</div>
                </button>
              ))}
            </div>

            <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1 bg-slate-50 py-1.5 rounded-lg border border-slate-100">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Click box to focus week section
            </div>
          </div>

        </div>

        {/* Filters and Control Area */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col gap-4">
            
            {/* Row 1: Search and Week Expand controls */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search problem name or daily topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              <div className="flex border border-slate-200 rounded-xl overflow-hidden shrink-0 self-center md:self-auto">
                <button
                  onClick={expandAllWeeks}
                  className="bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-bold px-3 py-2 border-r border-slate-200 transition cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllWeeks}
                  className="bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-bold px-3 py-2 transition cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Row 2: Select Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Difficulty Level
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`text-xs px-2.5 py-1 rounded-md transition font-medium border ${
                        difficultyFilter === diff
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Problem Status
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {(['All', 'Completed', 'Pending'] as const).map((stat) => (
                    <button
                      key={stat}
                      onClick={() => setStatusFilter(stat)}
                      className={`text-xs px-2.5 py-1 rounded-md transition font-medium border ${
                        statusFilter === stat
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Mastery Tier
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setLevelFilter(tier)}
                      className={`text-xs px-2.5 py-1 rounded-md transition font-medium border ${
                        levelFilter === tier
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Helper */}
              <div className="flex items-end justify-start sm:justify-end">
                {(searchQuery || difficultyFilter !== 'All' || statusFilter !== 'All' || levelFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setDifficultyFilter('All');
                      setStatusFilter('All');
                      setLevelFilter('All');
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 hover:underline font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    Reset Active Filters
                  </button>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* Problem Checklist View Panel */}
        {loadingData ? (
          <div className="bg-white rounded-2xl p-16 border border-slate-200 shadow-xs text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500 mb-4" />
            <p className="text-slate-500 text-sm font-medium">Fetching sync status from Firebase...</p>
          </div>
        ) : filteredPlan.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 border border-slate-200 shadow-xs text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-700 font-bold text-base mb-1">No problems fit these filter options</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Please adjust your search terms or filters to show LeetCode roadmap problems.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {filteredPlan.map((week) => {
              const staticWeekStats = weekStats.find(w => w.weekIndex === week.originalIndex);
              const isExpanded = !!expandedWeeks[week.originalIndex];

              return (
                <div
                  key={week.week}
                  id={`week-block-${week.originalIndex}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  
                  {/* Week Header Banner Accordion Toggle */}
                  <div
                    onClick={() => toggleWeek(week.originalIndex)}
                    className="bg-slate-50 hover:bg-slate-100/70 p-5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4 cursor-pointer selection:bg-transparent transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-slate-400 uppercase tracking-widest">
                            {week.week}
                          </span>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                            week.level === 'Beginner'
                              ? 'bg-teal-50 border-teal-100 text-teal-700'
                              : week.level === 'Intermediate'
                                ? 'bg-amber-50 border-amber-100 text-amber-700'
                                : 'bg-rose-50 border-rose-100 text-rose-700'
                          }`}>
                            {week.level}
                          </span>
                        </div>
                        <h2 className="text-base font-display font-semibold text-slate-900 mt-0.5">
                          {week.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                      {/* Week progress pill */}
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Week Progress</div>
                        <div className="text-sm font-mono font-bold text-slate-700 mt-0.5">
                          {staticWeekStats?.completedCount} / {staticWeekStats?.total} ({staticWeekStats?.percentage}%)
                        </div>
                      </div>

                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0 hidden sm:block">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${staticWeekStats?.percentage || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Week days view and list blocks */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6">
                      
                      {week.days.map((day) => (
                        <div
                          key={day.day}
                          className="relative border-l-2 border-slate-100 pl-4 py-1"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                              {day.day}
                            </h3>
                            <span className="text-xs font-medium text-slate-500">
                              {day.topic}
                            </span>
                          </div>

                          {/* Problems List Layout */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {day.problems.map((prob) => {
                              const key = `${week.originalIndex}-${day.originalIndex}-${prob.originalIndex}`;
                              const isCompleted = !!dbState.completed[key];

                              return (
                                <div
                                  key={prob.name}
                                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition ${
                                    isCompleted
                                      ? 'bg-emerald-50/10 border-emerald-200/60 shadow-[0_0_8px_rgba(16,185,129,0.02)]'
                                      : 'bg-white border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Action Checkbox wrapper with labels */}
                                    <label
                                      className={`relative flex items-center justify-center w-5 h-5 rounded-md border text-white transition-all select-none shrink-0 ${
                                        isCompleted
                                          ? 'bg-emerald-500 border-emerald-600 cursor-pointer'
                                          : isAdmin
                                            ? 'bg-slate-50 border-slate-300 hover:border-emerald-500 cursor-pointer'
                                            : 'bg-slate-100 border-slate-300 cursor-not-allowed'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        disabled={!isAdmin && currentUser !== null}
                                        onChange={() => handleToggleProblem(week.originalIndex, day.originalIndex, prob.originalIndex)}
                                        onClick={(e) => {
                                          if (!isAdmin) {
                                            e.preventDefault();
                                            handleToggleProblem(week.originalIndex, day.originalIndex, prob.originalIndex);
                                          }
                                        }}
                                        className="sr-only"
                                      />
                                      {isCompleted && <Check className="w-3.5 h-3.5" />}
                                    </label>

                                    <div className="leading-tight">
                                      <span
                                        className={`text-[13px] font-medium leading-tight ${
                                          isCompleted ? 'text-slate-400 line-through decoration-emerald-500/30' : 'text-slate-800'
                                        }`}
                                      >
                                        {prob.name}
                                      </span>
                                      
                                      <div className="flex items-center gap-2 mt-1">
                                        {/* Difficulty badge */}
                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                          prob.difficulty === 'Easy'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : prob.difficulty === 'Medium'
                                              ? 'bg-amber-50 text-amber-600'
                                              : 'bg-rose-50 text-rose-600'
                                        }`}>
                                          {prob.difficulty}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Link to LeetCode practice search */}
                                  <a
                                    href={getLeetCodeUrl(prob.name)}
                                    target="_blank"
                                    rel="noreferrer referrer"
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                                    title={`Solve "${prob.name}" on LeetCode`}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      ))}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

        {/* Informative tips card */}
        <section className="mt-12 bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-sm leading-relaxed text-emerald-800">
          <div className="flex gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-emerald-700" />
            <div>
              <p className="font-semibold text-emerald-900 mb-1">
                📅 Raghav's Daily Study Discipline
              </p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-emerald-800/90 text-xs">
                <li><strong>5-10 min</strong>: Problem description padho aur simple solution visual approach socho.</li>
                <li><strong>20-25 min</strong>: Khud se optimized implementation likhne ki koshish karo, bina external hints ke.</li>
                <li><strong>Editorial Section</strong>: Best approach ko samjho, space aur time complexities document karo.</li>
                <li><strong>Revision Sundays</strong>: Hafte bhar ke weak problems wapas repeat karo revision strong karne ke liye.</li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* Aesthetic modest Footer */}
      <footer className="mt-16 pb-12 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 pt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Raghav's LeetCode Progess Dashboard. Designed to show real-time progress globally.</p>
        </div>
      </footer>

    </div>
  );
}
