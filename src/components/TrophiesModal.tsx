import React from 'react';
import { TrophyStats } from '../types';
import { audio } from '../services/audioService';
import { X, Trophy, Award, Flame, Target, Shield, Sparkles } from 'lucide-react';

interface TrophiesModalProps {
  stats: TrophyStats;
  onClose: () => void;
}

export const TrophiesModal: React.FC<TrophiesModalProps> = ({ stats, onClose }) => {
  const trophies = [
    {
      id: 'super-cup',
      name: 'Showdown Champions Trophy',
      description: 'Awarded to the conqueror of the greatest penalty shootout clash',
      unlocked: stats.totalShootouts > 0,
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'from-amber-500/20 to-yellow-600/10',
    },
    {
      id: 'golden-boot',
      name: 'Golden Penalty Boot',
      description: 'Scored 5 or more career penalty goals',
      unlocked: stats.totalGoalsScored >= 5,
      icon: Award,
      color: 'text-yellow-300',
      bg: 'from-yellow-500/20 to-amber-600/10',
    },
    {
      id: 'iron-wall',
      name: 'The Iron Wall Glove',
      description: 'Made 3 or more crucial penalty saves',
      unlocked: stats.totalSavesMade >= 3,
      icon: Shield,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/20 to-blue-600/10',
    },
    {
      id: 'sudden-death',
      name: 'Clutch King Badge',
      description: 'Emerged victorious from a high-stakes sudden death shootout',
      unlocked: stats.suddenDeathWins > 0,
      icon: Flame,
      color: 'text-rose-400',
      bg: 'from-rose-500/20 to-red-600/10',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                TROPHY ROOM & STATS
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Track your rivalry records and tournament silverware
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 overflow-y-auto space-y-6">
          {/* Head to Head Rivalry Scoreboard Card */}
          <div className="bg-gradient-to-r from-cyan-950/60 via-neutral-900 to-amber-950/60 border border-neutral-800 rounded-2xl p-5 shadow-inner">
            <div className="text-center mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400">
                All-Time Head-To-Head Rivalry
              </span>
            </div>
            <div className="flex items-center justify-around">
              {/* Messi Side */}
              <div className="text-center">
                <span className="text-sm font-bold text-cyan-400">L. MESSI</span>
                <p className="text-4xl sm:text-5xl font-black font-display text-white mt-1">
                  {stats.messiWins}
                </p>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold">Victories</span>
              </div>

              {/* Clash Divider */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-neutral-500 tracking-wider">VS</span>
                <span className="text-xs text-neutral-400 mt-1">
                  {stats.totalShootouts} Matches
                </span>
              </div>

              {/* Ronaldo Side */}
              <div className="text-center">
                <span className="text-sm font-bold text-amber-400">C. RONALDO</span>
                <p className="text-4xl sm:text-5xl font-black font-display text-white mt-1">
                  {stats.ronaldoWins}
                </p>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold">Victories</span>
              </div>
            </div>

            {/* Quick stats mini row */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-neutral-800/80 text-center text-xs">
              <div className="bg-neutral-950/50 p-2 rounded-lg">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Goals Scored</span>
                <span className="text-emerald-400 font-bold text-base font-mono">{stats.totalGoalsScored}</span>
              </div>
              <div className="bg-neutral-950/50 p-2 rounded-lg">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Saves Made</span>
                <span className="text-cyan-400 font-bold text-base font-mono">{stats.totalSavesMade}</span>
              </div>
              <div className="bg-neutral-950/50 p-2 rounded-lg">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Sudden Death</span>
                <span className="text-rose-400 font-bold text-base font-mono">{stats.suddenDeathWins}</span>
              </div>
            </div>
          </div>

          {/* Trophy Cabinet Grid */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Tournament Silverware
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {trophies.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      t.unlocked
                        ? `bg-gradient-to-br ${t.bg} border-neutral-700 shadow-md`
                        : 'bg-neutral-950/40 border-neutral-800 opacity-50 grayscale'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl bg-neutral-900/90 border border-neutral-700/60 shadow-inner ${t.color}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{t.name}</h4>
                        {t.unlocked ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-semibold uppercase">
                            Locked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{t.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
