import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Users, Settings, Terminal, AlertTriangle, 
  Trash2, ChevronUp, ChevronDown, Activity, X, Target, Edit3, Check, Globe, Copy
} from 'lucide-react';
import { ClubData, Metas } from '../types';
import { Input } from './ui/Input';
import { GlassCard } from './ui/GlassCard';
import { savePlayerMeta, fetchServerIP } from '../services/api';

interface AdminDashboardProps {
  clubData: ClubData;
  metas: Metas;
  onClose: () => void;
  onUpdate: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ clubData, metas, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview');
  const [serverIP, setServerIP] = useState<string>('Loading...');
  
  // Settings State
  const [minTrophies, setMinTrophies] = useState(clubData.requiredTrophies.toString());
  const [description, setDescription] = useState(clubData.description);
  
  // Goal Editing State
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [tempGoal, setTempGoal] = useState<string>('');
  const [savingGoal, setSavingGoal] = useState(false);

  const [logs, setLogs] = useState([
    { time: '10:42:01', type: 'INFO', msg: 'System synchronization complete' },
    { time: '10:45:23', type: 'WARN', msg: 'Player #9VG82 detected trophy drop (-50)' },
    { time: '11:01:12', type: 'LOGIN', msg: 'Admin session started' },
  ]);

  useEffect(() => {
    fetchServerIP().then(setServerIP);
  }, []);

  // Actions
  const handleKick = (tag: string) => {
    if (confirm(`Are you sure you want to kick ${tag}? (Visual Simulation - API Read Only)`)) {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: 'CRITICAL', msg: `Member ${tag} kicked` }]);
    }
  };

  const startEditGoal = (tag: string, currentVal: number) => {
    setEditingGoal(tag);
    setTempGoal(currentVal ? currentVal.toString() : '0');
  };

  const handleSaveGoal = async (tag: string) => {
    setSavingGoal(true);
    try {
      await savePlayerMeta(tag, parseInt(tempGoal));
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: 'SUCCESS', msg: `Updated goal for ${tag}` }]);
      setEditingGoal(null);
      onUpdate(); // Refresh data from backend
    } catch (error) {
      alert("Failed to save meta to backend");
    } finally {
      setSavingGoal(false);
    }
  };

  const handleSaveSettings = () => {
    // Note: Official Brawl Stars API is read-only for settings. This simulates the UI.
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: 'SUCCESS', msg: 'Club settings updated locally' }]);
    alert("Settings saved! (Note: Official API is read-only, this is a simulation)");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-display font-bold text-white flex items-center">
            <span className="text-red-500 mr-2">ADMIN</span> CONSOLE
          </h2>
          <p className="text-gray-400 text-sm font-mono flex items-center gap-2">
            Server IP: <span className="text-blue-400">{serverIP}</span>
            <button onClick={() => copyToClipboard(serverIP)} className="hover:text-white"><Copy size={12}/></button>
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-white/10 pb-1 shrink-0">
        {[
          { id: 'overview', icon: Activity, label: 'Overview' },
          { id: 'members', icon: Users, label: 'Member Management' },
          { id: 'settings', icon: Settings, label: 'Club Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all relative ${
              activeTab === tab.id 
              ? 'text-white bg-white/5 border-t border-x border-white/10' 
              : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Globe size={48} className="text-green-500" />
                  </div>
                  <h4 className="text-green-400 font-bold mb-1">API Status</h4>
                  <p className="text-2xl font-display text-white">ONLINE</p>
                  <p className="text-xs text-gray-400 mt-2">Server: {serverIP}</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Users size={48} className="text-purple-500" />
                  </div>
                  <h4 className="text-purple-400 font-bold mb-1">Total Members</h4>
                  <p className="text-2xl font-display text-white">{clubData.members.length}</p>
                  <p className="text-xs text-gray-400 mt-2">/ 30 Capacity</p>
                </div>
              </div>

              <GlassCard className="bg-black/40">
                <div className="flex items-center space-x-2 mb-4 text-gray-400 font-mono text-xs uppercase tracking-widest border-b border-white/5 pb-2">
                  <Terminal size={14} />
                  <span>System Logs</span>
                </div>
                <div className="font-mono text-sm space-y-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className="flex space-x-3">
                      <span className="text-gray-600">[{log.time}]</span>
                      <span className={`${
                        log.type === 'CRITICAL' ? 'text-red-500' : 
                        log.type === 'WARN' ? 'text-yellow-500' : 
                        log.type === 'SUCCESS' ? 'text-green-500' : 
                        'text-blue-400'
                      }`}>{log.type}</span>
                      <span className="text-gray-300">{log.msg}</span>
                    </div>
                  ))}
                  <div className="animate-pulse text-gray-600">_</div>
                </div>
              </GlassCard>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quick Actions</h3>
              <button onClick={() => fetchServerIP().then(setServerIP)} className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left group transition-all">
                <div className="flex items-center justify-between text-yellow-400 mb-2">
                  <AlertTriangle size={24} />
                  <span className="text-xs border border-yellow-500/30 px-2 py-0.5 rounded bg-yellow-500/10">DIAGNOSTIC</span>
                </div>
                <h4 className="font-bold text-white">Check Connectivity</h4>
                <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-300">Ping backend IP: {serverIP}</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl overflow-hidden">
             <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Player Management & Goals</p>
                <div className="flex items-center text-xs text-yellow-500">
                   <Target size={14} className="mr-1" />
                   <span>Goals save to server.js/metas.json</span>
                </div>
             </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs text-gray-400 uppercase">
                  <th className="p-4 font-bold">Member</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold text-center">Trophies</th>
                  <th className="p-4 font-bold text-center">Goal (Meta)</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {clubData.members.map((member) => {
                  const goal = metas[member.tag] || 0;
                  const progress = goal > 0 ? Math.min((member.trophies / goal) * 100, 100) : 0;
                  
                  return (
                    <tr key={member.tag} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center font-bold text-xs border border-white/10">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.tag}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          member.role === 'president' ? 'bg-red-500/20 text-red-400' :
                          member.role === 'senior' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-yellow-500">
                        {member.trophies.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        {editingGoal === member.tag ? (
                          <div className="flex items-center justify-center space-x-2">
                             <input 
                               type="number" 
                               value={tempGoal}
                               onChange={(e) => setTempGoal(e.target.value)}
                               className="w-20 bg-black border border-blue-500 text-white px-2 py-1 rounded text-center text-xs focus:outline-none"
                               autoFocus
                             />
                             <button 
                               onClick={() => handleSaveGoal(member.tag)}
                               disabled={savingGoal}
                               className="p-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40"
                             >
                               <Check size={14} />
                             </button>
                             <button 
                               onClick={() => setEditingGoal(null)}
                               className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"
                             >
                               <X size={14} />
                             </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center group cursor-pointer" onClick={() => startEditGoal(member.tag, goal)}>
                             <div className="flex items-center space-x-1">
                                <span className={`font-mono font-bold ${member.trophies >= goal && goal > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                  {goal > 0 ? goal.toLocaleString() : '-'}
                                </span>
                                <Edit3 size={10} className="text-gray-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </div>
                             {goal > 0 && (
                               <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                  <div 
                                    className={`h-full ${member.trophies >= goal ? 'bg-green-500' : 'bg-blue-500'}`} 
                                    style={{ width: `${progress}%` }} 
                                  />
                               </div>
                             )}
                          </div>
                        )}
                      </td>
                      <td className="p-4 flex justify-end space-x-2">
                        <button title="Promote" className="p-2 hover:bg-green-500/20 text-gray-400 hover:text-green-400 rounded-lg transition-colors">
                          <ChevronUp size={16} />
                        </button>
                        <button title="Demote" className="p-2 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 rounded-lg transition-colors">
                          <ChevronDown size={16} />
                        </button>
                        <button 
                          onClick={() => handleKick(member.name)}
                          title="Kick Member" 
                          className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto glass-panel p-8 rounded-xl">
             <div className="space-y-6">
                <Input 
                  label="Club Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-black/30 border-white/10"
                />
                
                <div className="grid grid-cols-2 gap-6">
                   <Input 
                      label="Required Trophies"
                      type="number"
                      value={minTrophies}
                      onChange={(e) => setMinTrophies(e.target.value)}
                      className="bg-black/30 border-white/10"
                   />
                   <Input 
                      label="Region Code"
                      defaultValue="US"
                      disabled
                      className="bg-black/30 border-white/5 opacity-50"
                   />
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                   <button 
                     onClick={handleSaveSettings}
                     className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-900/30 transition-all hover:scale-105"
                   >
                     <Save size={18} />
                     <span>Save Configuration</span>
                   </button>
                </div>
             </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};