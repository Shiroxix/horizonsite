import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Trophy, TrendingUp, Activity, Search, 
  Filter, RefreshCw, Shield, Crown, Zap, LogOut, Settings, ArrowLeft, AlertCircle
} from 'lucide-react';

import { fetchClubStats, getIconUrl, savePlayerMeta } from './services/api';
import { ClubData, Metas, ClubMember } from './types';
import { GlassCard } from './components/ui/GlassCard';
import { RoleBadge } from './components/ui/RoleBadge';
import { OverviewCharts } from './components/OverviewCharts';
import { PlayerModal } from './components/PlayerModal';
import { AuthScreen } from './components/AuthScreen';
import { AdminDashboard } from './components/AdminDashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'member'>('member');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [metas, setMetas] = useState<Metas>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  
  // Check for existing session
  useEffect(() => {
    const session = localStorage.getItem('brawl_session');
    const role = localStorage.getItem('brawl_role') as 'admin' | 'member';
    if (session) {
      setIsAuthenticated(true);
      if (role) setUserRole(role);
    }
  }, []);

  const handleLoginSuccess = (role: 'admin' | 'member') => {
    localStorage.setItem('brawl_session', 'active');
    localStorage.setItem('brawl_role', role);
    setIsAuthenticated(true);
    setUserRole(role);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('brawl_session');
    localStorage.removeItem('brawl_role');
    setIsAuthenticated(false);
    setUserRole('member');
    setShowAdminPanel(false);
    setClubData(null);
  };

  // Sound effect simulation
  const playSound = (type: 'hover' | 'click' | 'success') => {
    // In a real app, use new Audio('/sounds/click.mp3').play();
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClubStats();
      setClubData(data.club);
      setMetas(data.metas);
    } catch (err: any) {
      setError(err.message || "Failed to sync with Brawl Stars API. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger data load only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 120000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const filteredMembers = useMemo(() => {
    if (!clubData) return [];
    return clubData.members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            member.tag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      return matchesSearch && matchesRole;
    }).sort((a, b) => b.trophies - a.trophies);
  }, [clubData, searchTerm, roleFilter]);

  const stats = useMemo(() => {
    if (!clubData) return { totalTrophies: 0, avgTrophies: 0, memberCount: 0 };
    return {
      totalTrophies: clubData.trophies,
      memberCount: clubData.members.length,
      avgTrophies: Math.round(clubData.trophies / clubData.members.length)
    };
  }, [clubData]);

  // Render Auth Screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brawl-purple selection:text-white pb-20">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brawl-purple/10 blur-[120px] rounded-full animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brawl-blue/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brawl-purple to-brawl-blue rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Shield className="text-white" size={24} />
            </div>
            <div>
               <h1 className="text-xl font-display font-bold tracking-wider text-white flex items-center gap-2">
                 HORIZON<span className="text-brawl-purple">PRO</span>
                 {userRole === 'admin' && (
                   <span className="px-2 py-0.5 rounded text-[10px] bg-red-500 text-white font-mono uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                     Admin
                   </span>
                 )}
               </h1>
               <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span>LIVE SYNC</span>
               </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {userRole === 'admin' && (
              <button 
                className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-bold ${
                  showAdminPanel 
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
                onClick={() => { playSound('click'); setShowAdminPanel(!showAdminPanel); }}
              >
                {showAdminPanel ? <ArrowLeft size={16} /> : <Settings size={16} />}
                <span>{showAdminPanel ? 'Exit Admin' : 'Manage'}</span>
              </button>
            )}
            <button 
              onClick={() => { playSound('click'); loadData(); }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative group"
              title="Refresh Data"
            >
              <RefreshCw size={20} className={`text-gray-400 group-hover:text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {loading && !clubData ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="relative">
              <div className="w-20 h-20 border-t-4 border-b-4 border-brawl-purple rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-brawl-blue to-brawl-purple animate-pulse">
              ANALYZING CLUB DATA
            </h2>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
             <AlertCircle size={64} className="text-red-500 mb-4 opacity-80" />
             <h2 className="text-2xl font-bold mb-2">Connection Issue</h2>
             <p className="text-gray-400 max-w-md mb-6">{error}</p>
             {error.includes("Access Denied") && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-sm text-red-200 mb-6 max-w-lg text-left">
                  <strong>Tip:</strong> You need to add the Server IP to the Allowed List in the Brawl Stars Developer Portal.
                  Use the Admin Dashboard to check the current server IP.
                </div>
             )}
             <button onClick={loadData} className="px-6 py-2 bg-brawl-blue hover:bg-blue-600 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
               Retry Connection
             </button>
           </div>
        ) : clubData && (
          <AnimatePresence mode="wait">
            {showAdminPanel ? (
              <motion.div
                key="admin-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[calc(100vh-140px)]"
              >
                <AdminDashboard 
                  clubData={clubData} 
                  metas={metas}
                  onClose={() => setShowAdminPanel(false)}
                  onUpdate={loadData}
                />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <GlassCard delay={0.1}>
                    <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Club Trophies</p>
                          <h3 className="text-3xl font-display font-bold text-white mt-1 neon-text">{stats.totalTrophies.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                          <Trophy className="text-yellow-500" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" />
                    </div>
                  </GlassCard>

                  <GlassCard delay={0.2}>
                    <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Members</p>
                          <h3 className="text-3xl font-display font-bold text-white mt-1">{stats.memberCount}<span className="text-lg text-gray-500">/30</span></h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                          <Users className="text-blue-500" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex -space-x-2 overflow-hidden">
                        {clubData.members.slice(0, 5).map(m => (
                          <img key={m.tag} className="inline-block h-6 w-6 rounded-full ring-2 ring-[#131522]" src={getIconUrl(m.icon.id)} alt=""/>
                        ))}
                    </div>
                  </GlassCard>

                  <GlassCard delay={0.3}>
                    <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Avg Trophies</p>
                          <h3 className="text-3xl font-display font-bold text-white mt-1">{stats.avgTrophies.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                          <Activity className="text-purple-500" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-400 flex items-center">
                        <TrendingUp size={14} className="mr-1" /> Top 1% Global
                    </div>
                  </GlassCard>

                  <GlassCard delay={0.4} className="border-brawl-purple/30 bg-brawl-purple/5">
                    <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Required</p>
                          <h3 className="text-3xl font-display font-bold text-white mt-1">{clubData.requiredTrophies.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                          <Crown className="text-red-500" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-purple-300">
                        Elite Tier Requirements
                    </div>
                  </GlassCard>
                </div>

                {/* Visual Charts */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <OverviewCharts members={clubData.members} />
                </motion.div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search member by name or tag..." 
                        className="w-full bg-[#131522] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-brawl-purple focus:ring-1 focus:ring-brawl-purple transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {['all', 'president', 'senior', 'member'].map((role) => (
                        <button
                          key={role}
                          onClick={() => setRoleFilter(role)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
                            roleFilter === role 
                            ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                            : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Members List */}
                <div className="glass-panel rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-5 md:col-span-4">Player</div>
                      <div className="col-span-3 md:col-span-2 text-center">Role</div>
                      <div className="col-span-3 md:col-span-3 text-right pr-4">Trophies</div>
                      <div className="hidden md:block col-span-2 text-center">Status</div>
                  </div>
                  
                  <div className="divide-y divide-white/5">
                    {filteredMembers.map((member, index) => (
                      <motion.div
                        key={member.tag}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedPlayer(member.tag)}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                          <div className="col-span-1 text-center font-mono text-gray-500 group-hover:text-white">{index + 1}</div>
                          
                          <div className="col-span-5 md:col-span-4 flex items-center space-x-3">
                            <div className="relative">
                                <img src={getIconUrl(member.icon.id)} className="w-10 h-10 rounded-lg group-hover:scale-110 transition-transform duration-300 border border-white/10" alt="" />
                                {index < 3 && (
                                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-black">
                                    {index + 1}
                                  </div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-sm truncate" style={{ color: `#${member.nameColor.slice(2)}` }}>{member.name}</h4>
                                <p className="text-[10px] text-gray-500 font-mono">{member.tag}</p>
                            </div>
                          </div>

                          <div className="col-span-3 md:col-span-2 text-center">
                            <RoleBadge role={member.role} />
                          </div>

                          <div className="col-span-3 md:col-span-3 text-right pr-4">
                            <div className="flex items-center justify-end space-x-2 text-yellow-400 font-bold font-display">
                                <Trophy size={14} />
                                <span>{member.trophies.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="hidden md:block col-span-2 text-center">
                            {/* Mock Status Logic - Real API doesn't show online status */}
                            <div className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span>Active</span>
                            </div>
                          </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {filteredMembers.length === 0 && (
                      <div className="p-12 text-center text-gray-500">
                        <Filter className="mx-auto mb-4 opacity-50" size={32} />
                        <p>No members found matching your criteria.</p>
                      </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Detail Modal */}
      <PlayerModal tag={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
};

export default App;