import React from 'react';
import { KitOption, Player, PlayerId } from '../types';
import { PLAYERS } from '../data/gameData';
import { PlayerAvatar } from './PlayerAvatar';
import { audio } from '../services/audioService';
import { X, Check, Award, Flame, Target, Shield, Zap } from 'lucide-react';

interface PlayerSelectModalProps {
  selectedPlayerId: PlayerId;
  currentKit: KitOption;
  onSelectPlayer: (id: PlayerId) => void;
  onClose: () => void;
}

export const PlayerSelectModal: React.FC<PlayerSelectModalProps> = ({
  selectedPlayerId,
  currentKit,
  onSelectPlayer,
  onClose,
}) => {
  const handleSelect = (id: PlayerId) => {
    audio.playClick();
    onSelectPlayer(id);
  };

  const renderCard = (player: Player) => {
    const isSelected = selectedPlayerId === player.id;
    const isMessi = player.id === 'messi';

    return (
      <div
        key={player.id}
        onClick={() => handleSelect(player.id)}
        className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 border-2 flex flex-col items-center text-center ${
          isSelected
            ? isMessi
              ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/80 via-slate-900 to-neutral-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] scale-[1.02]'
              : 'border-amber-400 bg-gradient-to-b from-amber-950/80 via-neutral-900 to-neutral-950 shadow-[0_0_30px_rgba(251,191,36,0.35)] scale-[1.02]'
            : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900/90'
        }`}
      >
        {/* Selected badge */}
        {isSelected && (
          <div
            className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg ${
              isMessi ? 'bg-cyan-500 text-slate-950' : 'bg-amber-400 text-neutral-950'
            }`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Choice
          </div>
        )}

        {/* Header Name and Number */}
        <div className="w-full flex items-center justify-between border-b border-neutral-800/80 pb-2 mb-3">
          <div className="text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {player.country}
            </span>
            <h3 className="text-2xl font-black tracking-tight leading-none text-white">
              {player.name}
            </h3>
          </div>
          <span
            className={`text-4xl font-extrabold font-display leading-none ${
              isMessi ? 'text-cyan-400' : 'text-amber-400'
            }`}
          >
            #{player.number}
          </span>
        </div>

        {/* Player Avatar */}
        <div className="my-2 p-2 rounded-xl bg-neutral-950/50 border border-neutral-800/50 flex items-center justify-center">
          <PlayerAvatar player={player} kit={currentKit} size="md" action="ready" />
        </div>

        {/* Nickname & Signature */}
        <div className="mt-1 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
              isMessi
                ? 'bg-cyan-950/50 border-cyan-800/40 text-cyan-300'
                : 'bg-amber-950/50 border-amber-800/40 text-amber-300'
            }`}
          >
            {player.signature} • {player.dominantFoot}-Footed
          </span>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 text-xs text-left mt-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" /> Shooting
            </span>
            <span className="font-bold text-white font-mono">{player.stats.shooting}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Power
            </span>
            <span className="font-bold text-white font-mono">{player.stats.power}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-cyan-400" /> Penalty
            </span>
            <span className="font-bold text-white font-mono">{player.stats.penalty}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Composure
            </span>
            <span className="font-bold text-white font-mono">{player.stats.composure}</span>
          </div>
        </div>

        {/* Opponent notice */}
        <div className="mt-3 text-[11px] text-neutral-400">
          Opponent:{' '}
          <strong className="text-slate-200">
            {isMessi ? 'Cristiano Ronaldo' : 'Lionel Messi'}
          </strong>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              CHOOSE YOUR LEGEND
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              The other superstar will step up as your penalty opponent
            </p>
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

        {/* 2 Cards side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {renderCard(PLAYERS.messi)}
          {renderCard(PLAYERS.ronaldo)}
        </div>

        {/* Confirm button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            CONFIRM SELECTION
          </button>
        </div>
      </div>
    </div>
  );
};
