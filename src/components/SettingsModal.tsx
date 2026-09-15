import React from 'react';
import { GameSettings } from '../types';
import { audio } from '../services/audioService';
import { storageService } from '../services/storageService';
import { X, Settings, Volume2, VolumeX, Music, HelpCircle, Heart, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleToggleSound = () => {
    audio.playClick();
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    audio.setSoundEnabled(updated.soundEnabled);
    storageService.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleMusic = () => {
    audio.playClick();
    const updated = { ...settings, musicEnabled: !settings.musicEnabled };
    audio.setMusicEnabled(updated.musicEnabled);
    storageService.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    const updated = { ...settings, soundVolume: vol };
    audio.setVolume(vol);
    storageService.saveSettings(updated);
    onUpdateSettings(updated);
  };

  const handleDifficultyChange = (diff: 'normal' | 'legendary') => {
    audio.playClick();
    const updated = { ...settings, difficulty: diff };
    storageService.saveSettings(updated);
    onUpdateSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-neutral-700">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                SETTINGS & CONTROLS
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Audio options, difficulty calibration & how to play
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

        <div className="my-5 overflow-y-auto space-y-5 pr-1">
          {/* Audio Controls */}
          <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Audio Settings
            </h3>

            <div className="space-y-4">
              {/* Sound FX Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white block">Stadium Sound FX</span>
                  <span className="text-xs text-neutral-400">Kicks, saves, whistle, post hits, crowd cheering</span>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    settings.soundEnabled ? 'bg-emerald-500' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Music / Crowd Atmosphere */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white block">Stadium Crowd Murmur & Chants</span>
                  <span className="text-xs text-neutral-400">Continuous authentic football stadium roar</span>
                </div>
                <button
                  onClick={handleToggleMusic}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    settings.musicEnabled ? 'bg-emerald-500' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-neutral-800/80">
                <div className="flex justify-between text-xs font-semibold mb-1 text-neutral-300">
                  <span>Master Volume</span>
                  <span className="font-mono">{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* AI Difficulty */}
          <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Goalkeeper AI Difficulty
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDifficultyChange('normal')}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs border transition-all ${
                  settings.difficulty === 'normal'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-md'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                PRO (Normal AI)
              </button>
              <button
                onClick={() => handleDifficultyChange('legendary')}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs border transition-all ${
                  settings.difficulty === 'legendary'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                WORLD CLASS (Legendary AI)
              </button>
            </div>
          </div>

          {/* How to Play Guide */}
          <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              How to Play
            </h3>
            <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
              <p>
                • <strong>Aim:</strong> Tap any of the 7 target spots on the goal (corners, mid, bottom, center).
              </p>
              <p>
                • <strong>Power:</strong> The power meter oscillates continuously. Press or tap <strong>⚽ SHOOT</strong> when the meter is in the optimal green zone for pinpoint accuracy!
              </p>
              <p>
                • <strong>Caution:</strong> Maxing out in the red zone risks blasting the ball over the crossbar or into the woodwork!
              </p>
              <p>
                • <strong>Opponent Turn:</strong> When Ronaldo/Messi shoots against you, select which corner your goalkeeper dives to make a miraculous save!
              </p>
            </div>
          </div>

          {/* Creator Credit (Mandatory requirement in settings) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-cyan-500/10 border border-neutral-700/60 text-center">
            <p className="text-xs uppercase font-extrabold tracking-widest text-neutral-400">
              Game Credits
            </p>
            <p className="text-base font-bold text-white mt-1">
              Created by <span className="text-amber-400">Mr. Alin Adhikari</span>
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Built with passionate craftsmanship for football fans worldwide.
            </p>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
