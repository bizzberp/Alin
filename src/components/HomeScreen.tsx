import React from 'react';
import { Club, KitOption, Player } from '../types';
import { PlayerAvatar } from './PlayerAvatar';
import { Football } from './Football';
import { audio } from '../services/audioService';
import { Play, Users, Shirt, Shield, Trophy, Settings, Sparkles, Flame } from 'lucide-react';

interface HomeScreenProps {
  player: Player;
  opponent: Player;
  kit: KitOption;
  club: Club;
  onPlay: () => void;
  onOpenPlayerSelect: () => void;
  onOpenKitSelect: () => void;
  onOpenClubSelect: () => void;
  onOpenTrophies: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  opponent,
  kit,
  club,
  onPlay,
  onOpenPlayerSelect,
  onOpenKitSelect,
  onOpenClubSelect,
  onOpenTrophies,
  onOpenSettings,
}) => {
  const isMessi = player.id === 'messi';

  const handleAction = (cb: () => void) => {
    audio.playClick();
    cb();
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-neutral-950 text-white select-none overflow-hidden">
      {/* Stadium Environment Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Stadium Floodlights */}
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-floodlight" />
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[120px] animate-floodlight" />

        {/* Subtle Pitch Lines Texture */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-emerald-950/80 via-emerald-950/30 to-transparent border-t border-emerald-500/20" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-96 h-48 border border-white/10 rounded-t-full opacity-40 pointer-events-none" />
      </div>

      {/* Top Bar: Title & Quick Header Badges */}
      <header className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        {/* Brand Title */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live Stadium Arena
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white font-display uppercase">
            MESSI <span className="text-neutral-500">VS</span> RONALDO
          </h1>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-400">
            PENALTY SHOWDOWN
          </p>
        </div>

        {/* Selected Club & Matchup preview banner */}
        <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-sm">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/10"
            style={{ background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})` }}
          >
            {club.badgeSymbol}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">{club.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">
                {club.shortName}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 truncate max-w-[150px]">{club.stadium}</p>
          </div>
        </div>
      </header>

      {/* Middle Center: Stage with Featured Player in Kit + Opponent Face-Off */}
      <main className="relative z-10 my-auto py-6 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto w-full">
        {/* Left: Player Showcase Stage */}
        <div className="relative flex flex-col items-center">
          {/* Glowing pedestal */}
          <div
            className="absolute -bottom-6 w-56 sm:w-72 h-16 rounded-full blur-xl opacity-40"
            style={{ backgroundColor: isMessi ? '#06B6D4' : '#F59E0B' }}
          />

          {/* Active Player Card Badge */}
          <div className="mb-2 flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/70 shadow-md">
            <span
              className={`w-2 h-2 rounded-full ${
                isMessi ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Selected Star: <strong className="text-white">{player.name}</strong>
            </span>
          </div>

          {/* Player Graphic in chosen kit */}
          <div className="relative transform hover:scale-105 transition-transform duration-300">
            <PlayerAvatar player={player} kit={kit} size="xl" action="ready" />
          </div>

          {/* Kit & Number Pill */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
              Jersey #{player.number}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
              {kit.name}
            </span>
          </div>
        </div>

        {/* Center: Major VS Clash and Big Play Call-To-Action */}
        <div className="flex flex-col items-center justify-center text-center max-w-md w-full px-4">
          <div className="relative mb-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900/90 border border-neutral-700 flex items-center justify-center shadow-xl">
              <Football size={44} />
            </div>
          </div>

          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            The Ultimate Rivalry Shootout
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Ready For Glory?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xs">
            Step up to the 12-yard penalty spot. Outsmart the goalkeeper and claim the trophy.
          </p>

          {/* PRIMARY PLAY BUTTON (Large, Clearly Visible, Glowing) */}
          <button
            id="btn-play-game"
            onClick={() => handleAction(onPlay)}
            className="group relative w-full mt-6 py-4 sm:py-5 px-8 rounded-2xl font-black text-xl sm:text-2xl uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-[0_0_40px_rgba(52,211,153,0.5)] transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-7 h-7 fill-slate-950 stroke-none" />
            <span>⚽ PLAY SHOOTOUT</span>
            <Sparkles className="w-5 h-5 text-slate-900 animate-spin" />
          </button>

          {/* Opponent Info Strip */}
          <div className="mt-4 text-xs text-neutral-400 flex items-center gap-2">
            <span>Opponent:</span>
            <span className="font-bold text-slate-200">{opponent.name} (#{opponent.number})</span>
          </div>
        </div>
      </main>

      {/* Bottom Main Navigation Menu Buttons */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto pt-4 border-t border-neutral-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {/* SELECT PLAYER */}
          <button
            id="btn-select-player"
            onClick={() => handleAction(onOpenPlayerSelect)}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-cyan-500/50 text-white transition-all shadow-md group cursor-pointer"
          >
            <Users className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Player</span>
          </button>

          {/* SELECT KIT */}
          <button
            id="btn-select-kit"
            onClick={() => handleAction(onOpenKitSelect)}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-white transition-all shadow-md group cursor-pointer"
          >
            <Shirt className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Kit</span>
          </button>

          {/* SELECT CLUB */}
          <button
            id="btn-select-club"
            onClick={() => handleAction(onOpenClubSelect)}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 text-white transition-all shadow-md group cursor-pointer"
          >
            <Shield className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Club</span>
          </button>

          {/* TROPHIES */}
          <button
            id="btn-trophies"
            onClick={() => handleAction(onOpenTrophies)}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-yellow-500/50 text-white transition-all shadow-md group cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Trophies</span>
          </button>

          {/* SETTINGS */}
          <button
            id="btn-settings"
            onClick={() => handleAction(onOpenSettings)}
            className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-slate-400 text-white transition-all shadow-md group cursor-pointer"
          >
            <Settings className="w-5 h-5 text-slate-300 group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
          </button>
        </div>

        {/* Creator small footer attribution */}
        <div className="text-center mt-3">
          <span className="text-[11px] text-neutral-500 font-medium">
            Game Created by <strong className="text-neutral-400">Mr. Alin Adhikari</strong>
          </span>
        </div>
      </footer>
    </div>
  );
};
