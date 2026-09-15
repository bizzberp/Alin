import React, { useEffect, useState } from 'react';
import { Club, KitOption, Player } from '../types';
import { PlayerAvatar } from './PlayerAvatar';
import { Football } from './Football';
import { audio } from '../services/audioService';
import { Swords, Shield, Sparkles } from 'lucide-react';

interface MatchIntroProps {
  player: Player;
  opponent: Player;
  playerClub: Club;
  opponentClub: Club;
  playerKit: KitOption;
  opponentKit: KitOption;
  onEnterStadium: () => void;
}

export const MatchIntro: React.FC<MatchIntroProps> = ({
  player,
  opponent,
  playerClub,
  opponentClub,
  playerKit,
  opponentKit,
  onEnterStadium,
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    audio.playWhistle();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            onEnterStadium();
          }, 600);
          return 0;
        }
        audio.playClick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onEnterStadium]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-900 text-white select-none overflow-hidden">
      {/* Stadium Flash & Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-floodlight" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-floodlight" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-80 bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Top Banner */}
      <div className="relative z-10 text-center mt-4 animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-300 text-xs font-bold uppercase tracking-wider shadow-lg">
          <Swords className="w-4 h-4 text-amber-400" />
          Official Match Presentation
        </div>

        {/* CLUBS CLASH BANNER */}
        <div className="mt-4 flex flex-col items-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase font-display flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span style={{ color: playerClub.accentColor || '#FFFFFF' }}>{playerClub.name}</span>
            <span className="text-amber-400 text-2xl sm:text-4xl font-extrabold italic">VS</span>
            <span style={{ color: opponentClub.accentColor || '#FFFFFF' }}>{opponentClub.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 flex items-center gap-2">
            <span>{playerClub.stadium}</span> • <span>Atmosphere: Electrifying</span>
          </p>
        </div>
      </div>

      {/* Center Clash of Titans: Messi vs Ronaldo Cards */}
      <div className="relative z-10 w-full max-w-5xl my-auto grid grid-cols-1 md:grid-cols-11 gap-4 items-center justify-center py-4">
        {/* Player Card (Left) */}
        <div className="md:col-span-5 flex flex-col items-center bg-neutral-900/70 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md transform transition-all hover:scale-[1.02]">
          <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <div className="text-left">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Your Champion</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{player.name}</h3>
            </div>
            <span className="text-3xl font-display font-black text-cyan-400">#{player.number}</span>
          </div>

          <div className="my-2">
            <PlayerAvatar player={player} kit={playerKit} size="lg" action="ready" />
          </div>

          <div className="w-full mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Club: <strong className="text-white">{playerClub.shortName}</strong></span>
            <span className="text-neutral-400">Kit: <strong className="text-cyan-300">{playerKit.name}</strong></span>
          </div>
        </div>

        {/* Center VS Indicator & Countdown */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="font-display font-black text-xl text-amber-400">VS</span>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs font-mono font-bold text-emerald-400">
              {countdown > 0 ? `STARTING IN ${countdown}...` : 'KICKOFF!'}
            </span>
          </div>
        </div>

        {/* Opponent Card (Right) */}
        <div className="md:col-span-5 flex flex-col items-center bg-neutral-900/70 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md transform transition-all hover:scale-[1.02]">
          <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <div className="text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Opponent</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{opponent.name}</h3>
            </div>
            <span className="text-3xl font-display font-black text-amber-400">#{opponent.number}</span>
          </div>

          <div className="my-2">
            <PlayerAvatar player={opponent} kit={opponentKit} size="lg" action="ready" />
          </div>

          <div className="w-full mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Club: <strong className="text-white">{opponentClub.shortName}</strong></span>
            <span className="text-neutral-400">Kit: <strong className="text-amber-300">{opponentKit.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Bottom Dramatic Match Callout */}
      <div className="relative z-10 flex flex-col items-center mb-4">
        <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase font-display">
          PENALTY SHOOTOUT
        </h1>

        <button
          onClick={() => {
            audio.playClick();
            onEnterStadium();
          }}
          className="mt-4 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-wider uppercase text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          ENTER STADIUM NOW
        </button>
      </div>
    </div>
  );
};
