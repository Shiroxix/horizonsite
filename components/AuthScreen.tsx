import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, User, ArrowRight, Shield, Zap } from 'lucide-react';
import { Input } from './ui/Input';

interface AuthScreenProps {
  onLogin: (role: 'admin' | 'member') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      
      if (!username || !password) {
        setError("Please fill in all fields.");
        return;
      }

      if (!isLogin) {
        // Registration Logic with Keys
        if (accessKey === 'LOGONTOP') {
          onLogin('member');
        } else if (accessKey === 'ADMINLOGX') {
          onLogin('admin');
        } else {
          setError("Invalid Access Key. Ask your Club President.");
        }
      } else {
        // Mock Login Logic
        // In a real app, verify credentials against DB.
        // For this demo: 'admin' in username grants admin access for testing existing logins
        if (username.toLowerCase().includes('admin')) {
          onLogin('admin');
        } else {
          onLogin('member');
        }
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setAccessKey('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brawl-purple/20 blur-[150px] rounded-full animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brawl-blue/20 blur-[150px] rounded-full animate-pulse-slow"></div>
         <div className="absolute inset-0 bg-[url('https://cdn.brawlify.com/assets/pattern.png')] opacity-[0.03]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="w-16 h-16 bg-gradient-to-br from-brawl-purple to-brawl-blue rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4"
          >
            <Shield className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-white tracking-wider">
            HORIZON<span className="text-brawl-purple">PRO</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Elite Club Analytics Platform</p>
        </div>

        <div className="glass-panel rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-white/10 relative overflow-hidden">
          {/* Top colored line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brawl-blue via-brawl-purple to-brawl-yellow" />

          <h2 className="text-2xl font-bold text-white mb-6 font-display">
            {isLogin ? 'Member Login' : 'Club Registration'}
          </h2>

          <form onSubmit={handleSubmit}>
            <Input 
              label="Username" 
              icon={User} 
              placeholder="Enter your tag or name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input 
              label="Password" 
              type="password" 
              icon={Lock} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input 
                    label="Access Key" 
                    icon={Key} 
                    type="text"
                    placeholder="Enter club key (e.g. LOGONTOP)"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="border-yellow-500/30 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                  <p className="text-[10px] text-gray-500 mb-4 -mt-2 ml-1">
                    * Required for account creation
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center"
              >
                <Zap size={14} className="mr-2" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brawl-blue to-brawl-purple hover:brightness-110 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center group disabled:opacity-70 disabled:cursor-wait mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="mr-2">{isLogin ? 'Access Dashboard' : 'Create Account'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? "Need an account?" : "Have an account?"}
              <button 
                onClick={toggleMode}
                className="ml-2 text-brawl-blue hover:text-brawl-purple font-bold transition-colors focus:outline-none"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};