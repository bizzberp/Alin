import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Club, KitOption, PenaltyRound, Player } from '../types';
import { PlayerAvatar } from './PlayerAvatar';
import { audio } from '../services/audioService';
import { Trophy, RotateCcw, Home, Users, Shirt, Shield, Sparkles, Flame } from 'lucide-react';

interface WinnerCelebrationProps {
  winner: Player;
  loser: Player;
  winnerClub: Club;
  loserClub: Club;
  winnerKit: KitOption;
  loserKit: KitOption;
  rounds: PenaltyRound[];
  suddenDeath: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onChangePlayer: () => void;
  onChangeKit: () => void;
  onChangeClub: () => void;
}

export const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({
  winner,
  loser,
  winnerClub,
  loserClub,
  winnerKit,
  loserKit,
  rounds,
  suddenDeath,
  onPlayAgain,
  onMainMenu,
  onChangePlayer,
  onChangeKit,
  onChangeClub,
}) => {
  const winnerIsPlayer = true; // In the context of the user or winner
  const playerScore = rounds.reduce((acc, r) => acc + (r.playerScore === true ? 1 : 0), 0);
  const opponentScore = rounds.reduce((acc, r) => acc + (r.opponentScore === true ? 1 : 0), 0);

  useEffect(() => {
    // Play celebratory victory fanfare
    audio.playTrophyFanfare();
    audio.playGoal();

    // Fire continuous high-energy confetti blasts
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#FFFFFF'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#FFFFFF'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-900 text-white select-none overflow-x-hidden">
      {/* Stadium Celebration Lighting & Gold Halo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent border-t border-amber-500/30" />
      </div>

      {/* TOP HEADER: WINNER DECLARATION */}
      <header className="relative z-10 text-center animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
          <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
          🏆 WINNER!
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase font-display tracking-tight text-white drop-shadow-[0_4px_30px_rgba(251,191,36,0.6)] mt-2">
          {winner.name}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-1 text-sm sm:text-base font-bold text-neutral-300">
          <span>{winnerClub.name}</span>
          <span className="text-amber-400">•</span>
          <span className="font-mono text-emerald-400 font-black">
            {playerScore} — {opponentScore} {suddenDeath ? '(AET Sudden Death)' : ''}
          </span>
          <span className="text-amber-400">•</span>
          <span>{loserClub.name}</span>
        </div>
      </header>

      {/* MAIN STAGE: TROPHY LIFTING CEREMONY & RESPECTFUL LOSER */}
      <main className="relative z-10 my-auto py-4 flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto w-full">
        {/* Disappointed Opponent (Respectful Loser) */}
        <div className="order-2 md:order-1 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
          <div className="mb-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-400">
            Runner Up: {loser.name}
          </div>
          <PlayerAvatar player={loser} kit={loserKit} size="md" action="disappointed" />
          <span className="text-xs font-bold text-neutral-500 mt-2">Well Fought Match</span>
        </div>

        {/* CENTRAL CHAMPION WITH LIFTED TROPHY */}
        <div className="order-1 md:order-2 flex flex-col items-center relative">
          {/* Golden Trophy above player's head */}
          <div className="relative -mb-6 z-30 animate-bounce">
            <div className="w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center drop-shadow-[0_0_25px_rgba(251,191,36,0.9)]">
              <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="goldCup" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="40%" stopColor="#FACC15" />
                    <stop offset="80%" stopColor="#CA8A04" />
                    <stop offset="100%" stopColor="#854D0E" />
                  </linearGradient>
                </defs>
                {/* Trophy Cup Body */}
                <path d="M25 20 C25 65 75 65 75 20 Z" fill="url(#goldCup)" stroke="#FEF08A" strokeWidth="2" />
                {/* Handles */}
                <path d="M25 30 C8 30 8 50 25 55" stroke="url(#goldCup)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M75 30 C92 30 92 50 75 55" stroke="url(#goldCup)" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* Stem */}
                <rect x="44" y="65" width="12" height="24" fill="url(#goldCup)" />
                {/* Base Plinth */}
                <path d="M30 89 L70 89 L78 108 L22 108 Z" fill="#1E293B" stroke="#FACC15" strokeWidth="2" />
                <rect x="36" y="94" width="28" height="8" rx="2" fill="url(#goldCup)" />
                <circle cx="50" cy="40" r="10" fill="#FEF08A" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Winning Player Avatar in Celebrating Pose */}
          <div className="relative z-20 transform hover:scale-105 transition-transform duration-300">
            <PlayerAvatar player={winner} kit={winnerKit} size="xl" action="celebrate" />
          </div>

          {/* CEREMONY CALLOUTS */}
          <div className="mt-4 text-center">
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-widest text-amber-300 drop-shadow-[0_2px_15px_rgba(251,191,36,0.5)]">
              CHAMPIONS!
            </h2>
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              TROPHY LIFTING CEREMONY
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM AFTER-MATCH OPTIONS BUTTONS */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto pt-4 border-t border-neutral-800/80">
        <div className="text-center mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            After-Match Options
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {/* PLAY AGAIN */}
          <button
            id="btn-play-again"
            onClick={() => {
              audio.playClick();
              onPlayAgain();
            }}
            className="col-span-2 sm:col-span-1 py-3 px-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          {/* MAIN MENU */}
          <button
            id="btn-main-menu"
            onClick={() => {
              audio.playClick();
              onMainMenu();
            }}
            className="py-3 px-3 rounded-xl font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>MAIN MENU</span>
          </button>

          {/* CHANGE PLAYER */}
          <button
            id="btn-change-player"
            onClick={() => {
              audio.playClick();
              onChangePlayer();
            }}
            className="py-3 px-3 rounded-xl font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>CHANGE PLAYER</span>
          </button>

          {/* CHANGE KIT */}
          <button
            id="btn-change-kit"
            onClick={() => {
              audio.playClick();
              onChangeKit();
            }}
            className="py-3 px-3 rounded-xl font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shirt className="w-4 h-4 text-pink-400" />
            <span>CHANGE KIT</span>
          </button>

          {/* CHANGE CLUB */}
          <button
            id="btn-change-club"
            onClick={() => {
              audio.playClick();
              onChangeClub();
            }}
            className="col-span-2 sm:col-span-1 py-3 px-3 rounded-xl font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>CHANGE CLUB</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
