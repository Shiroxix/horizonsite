import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Swords, Skull, Target, Zap } from 'lucide-react';
import { PlayerDetail } from '../types';
import { fetchPlayerDetail, getIconUrl, getBrawlerUrl } from '../services/api';

interface PlayerModalProps {
  tag: string | null;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ tag, onClose }) => {
  const [data, setData] = useState<PlayerDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tag) {
      setLoading(true);
      fetchPlayerDetail(tag)
        .then(setData)
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [tag]);

  if (!tag) return null;

  return (
    <AnimatePresence>
      {tag && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0F111A] border border-white/10 rounded-2xl shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="w-12 h-12 border-4 border-brawl-purple border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 animate-pulse font-display">SYNCING BRAWL DATA...</p>
              </div>
            ) : data ? (
              <div className="p-0">
                {/* Header Banner */}
                <div className="relative h-48 bg-gradient-to-r from-gray-900 via-purple-900/40 to-gray-900 overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://cdn.brawlify.com/assets/pattern.png')] opacity-10"></div>
                   <div className="absolute -bottom-10 left-8 flex items-end space-x-4">
                      <div className="relative w-24 h-24 rounded-2xl border-4 border-[#0F111A] overflow-hidden bg-black shadow-lg">
                        <img src={getIconUrl(data.icon.id)} alt="Icon" className="w-full h-full object-cover" />
                      </div>
                      <div className="mb-12">
                        <h2 className="text-3xl font-display font-bold text-white shadow-black drop-shadow-lg" style={{ color: `#${data.nameColor.slice(2)}` }}>
                          {data.name}
                        </h2>
                        <span className="text-sm font-mono text-gray-400 bg-black/50 px-2 py-0.5 rounded">{data.tag}</span>
                      </div>
                   </div>
                </div>

                <div className="p-8 pt-12">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatBox icon={<Trophy className="text-yellow-400" />} label="Current Trophies" value={data.trophies.toLocaleString()} />
                    <StatBox icon={<Target className="text-red-400" />} label="Highest Trophies" value={data.highestTrophies.toLocaleString()} />
                    <StatBox icon={<Swords className="text-purple-400" />} label="3v3 Victories" value={data['3vs3Victories'].toLocaleString()} />
                    <StatBox icon={<Skull className="text-green-400" />} label="Solo Victories" value={data.soloVictories.toLocaleString()} />
                  </div>

                  {/* Top Brawlers */}
                  <h3 className="text-xl font-display font-bold mb-4 flex items-center">
                    <Zap className="mr-2 text-yellow-400" /> Power Brawlers
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {data.brawlers.sort((a,b) => b.trophies - a.trophies).slice(0, 10).map((brawler) => (
                      <div key={brawler.id} className="bg-white/5 rounded-lg p-2 flex flex-col items-center hover:bg-white/10 transition-colors border border-white/5">
                        <img src={getBrawlerUrl(brawler.id)} alt={brawler.name} className="w-12 h-12 mb-2" />
                        <span className="text-sm font-bold truncate w-full text-center">{brawler.name}</span>
                        <div className="flex items-center space-x-1 mt-1 text-xs text-yellow-400">
                          <Trophy size={12} />
                          <span>{brawler.trophies}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-red-400">Failed to load data.</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StatBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center hover:border-white/10 transition-colors">
    <div className="mb-2 p-2 bg-white/5 rounded-full">{icon}</div>
    <div className="text-xl font-bold font-display">{value}</div>
    <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
  </div>
);
