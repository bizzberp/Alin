import React, { useEffect, useState } from 'react';
import { Football } from './Football';
import { audio } from '../services/audioService';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing Stadium Floodlights...');
  const [ballRotation, setBallRotation] = useState(0);

  useEffect(() => {
    const messages = [
      { at: 15, text: 'Preparing Pitch & Goal Netting...' },
      { at: 40, text: 'Tuning Goalkeeper AI Reflexes...' },
      { at: 65, text: 'Polishing Official Match Balls...' },
      { at: 85, text: 'Messi & Ronaldo Stepping Onto The Turf...' },
      { at: 98, text: 'Stadium Ready! Welcome To The Rivalry...' },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 4) + 2;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        const currentMsg = messages.find((m) => next >= m.at && prev < m.at);
        if (currentMsg) {
          setStatusMessage(currentMsg.text);
        }
        return next;
      });

      setBallRotation((r) => (r + 14) % 360);
    }, 45);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  const handleStartWithSound = () => {
    audio.playClick();
    audio.startCrowdAtmosphere();
  };

  return (
    <div
      onClick={handleStartWithSound}
      className="relative w-full h-screen min-h-[640px] flex flex-col items-center justify-between p-6 overflow-hidden bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-900 text-white select-none"
    >
      {/* Stadium Floodlights and Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Stadium Floodlight Cones */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-floodlight" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-floodlight" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/15 rounded-full blur-[100px]" />

        {/* Stadium Silhouette in Distance */}
        <div className="absolute bottom-28 inset-x-0 h-40 opacity-25 flex items-end justify-around px-8">
          <div className="w-24 h-28 bg-slate-800 rounded-t-lg" />
          <div className="w-32 h-36 bg-slate-700 rounded-t-xl" />
          <div className="w-48 h-40 bg-slate-600 rounded-t-2xl" />
          <div className="w-32 h-36 bg-slate-700 rounded-t-xl" />
          <div className="w-24 h-28 bg-slate-800 rounded-t-lg" />
        </div>

        {/* Pitch Green Base Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent border-t border-emerald-600/30" />
      </div>

      {/* Top Header Badge */}
      <div className="relative z-10 text-center mt-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Official Matchday Broadcast
        </span>
      </div>

      {/* Main Center Content: Title, Silhouettes & Creator Credit */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full my-auto text-center px-4">
        {/* Glowing Rivalry Clash Title */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 drop-shadow-[0_4px_24px_rgba(56,189,248,0.4)]">
          MESSI VS RONALDO
        </h2>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.5)] -mt-1 sm:-mt-2">
          PENALTY SHOWDOWN
        </h1>

        {/* Mandatory Creator Credit */}
        <div className="mt-3 px-4 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-700/60 shadow-lg backdrop-blur-sm">
          <p className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide">
            Game Created by <span className="text-amber-300 font-bold">Mr. Alin Adhikari</span>
          </p>
        </div>

        {/* Messi & Ronaldo Face-off Silhouette Visuals */}
        <div className="relative w-full max-w-md h-48 sm:h-56 mt-6 flex items-center justify-between px-6">
          {/* Messi Stylized Silhouette Graphic (Left) */}
          <div className="flex flex-col items-center transform transition-transform duration-700 hover:scale-105">
            <div className="relative w-24 h-36 sm:w-28 sm:h-44">
              <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                {/* Silhouette body */}
                <ellipse cx="50" cy="135" rx="30" ry="5" fill="#000" opacity="0.4" />
                <path d="M35 55 L65 55 L70 95 L50 90 L30 95 Z" fill="#0284C7" />
                <path d="M38 95 L32 135 L45 135 L50 100 Z" fill="#0369A1" />
                <path d="M62 95 L68 135 L55 135 L50 100 Z" fill="#0369A1" />
                <circle cx="50" cy="35" r="16" fill="#0284C7" />
                <path d="M35 32 C35 18 65 18 65 32 C65 24 55 20 50 20 C45 20 35 24 35 32 Z" fill="#082F49" />
                <text x="50" y="78" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#FFF" fontFamily="Teko">10</text>
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-extrabold tracking-widest text-cyan-400 mt-1 uppercase">
              L. MESSI
            </span>
          </div>

          {/* Central Animated Football */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="animate-bounce">
              <Football size={52} rotation={ballRotation} />
            </div>
            <div className="w-12 h-2.5 bg-black/50 rounded-full blur-xs mt-1" />
            <span className="text-xl sm:text-2xl font-black italic text-neutral-400 mt-2 tracking-widest">
              VS
            </span>
          </div>

          {/* Ronaldo Stylized Silhouette Graphic (Right) */}
          <div className="flex flex-col items-center transform transition-transform duration-700 hover:scale-105">
            <div className="relative w-24 h-36 sm:w-28 sm:h-44">
              <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                {/* Silhouette body */}
                <ellipse cx="50" cy="135" rx="30" ry="5" fill="#000" opacity="0.4" />
                <path d="M32 55 L68 55 L72 95 L50 90 L28 95 Z" fill="#D97706" />
                <path d="M36 95 L30 135 L43 135 L50 100 Z" fill="#B45309" />
                <path d="M64 95 L70 135 L57 135 L50 100 Z" fill="#B45309" />
                <circle cx="50" cy="35" r="16" fill="#D97706" />
                <path d="M34 30 C34 16 66 16 66 30 C66 22 55 18 50 18 C45 18 34 22 34 30 Z" fill="#451A03" />
                <text x="50" y="78" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#FFF" fontFamily="Teko">7</text>
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-400 mt-1 uppercase">
              C. RONALDO
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Loading Progress Bar and Interactive Prompt */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center mb-6">
        <div className="w-full flex items-center justify-between text-xs text-slate-400 font-medium mb-2 px-1">
          <span className="truncate max-w-[70%]">{statusMessage}</span>
          <span className="text-emerald-400 font-bold font-mono">{progress}%</span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-3 bg-neutral-900/90 rounded-full overflow-hidden p-0.5 border border-neutral-700/60 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(52,211,153,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] text-neutral-500 mt-3 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Click or tap anywhere for authentic stadium audio experience
        </p>
      </div>
    </div>
  );
};
