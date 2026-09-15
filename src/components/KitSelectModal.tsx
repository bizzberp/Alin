import React, { useState } from 'react';
import { KitOption, KitType, Player } from '../types';
import { KITS } from '../data/gameData';
import { PlayerAvatar } from './PlayerAvatar';
import { audio } from '../services/audioService';
import { X, Check, Shirt, Sparkles } from 'lucide-react';

interface KitSelectModalProps {
  player: Player;
  currentKitId: KitType;
  onSelectKit: (kit: KitType) => void;
  onClose: () => void;
}

export const KitSelectModal: React.FC<KitSelectModalProps> = ({
  player,
  currentKitId,
  onSelectKit,
  onClose,
}) => {
  const [previewKitId, setPreviewKitId] = useState<KitType>(currentKitId);
  const activeKit = KITS.find((k) => k.id === previewKitId) || KITS[0];

  const handleSelect = (kitId: KitType) => {
    audio.playClick();
    setPreviewKitId(kitId);
  };

  const handleConfirm = () => {
    audio.playClick();
    onSelectKit(previewKitId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                SELECT MATCH KIT
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Customizing match strip for {player.name}
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

        {/* Content Body: Live Preview Left + Kit Options Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 overflow-y-auto">
          {/* Live 3D Avatar Preview Box */}
          <div className="md:col-span-5 bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-950 border border-neutral-800/80 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-neutral-800/80 text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> Live Preview
            </div>

            {/* Stadium light glow behind avatar */}
            <div
              className="absolute w-44 h-44 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: activeKit.primaryColor }}
            />

            <div className="relative z-10 my-2">
              <PlayerAvatar player={player} kit={activeKit} size="xl" action="ready" />
            </div>

            <div className="relative z-10 text-center mt-2">
              <span className="text-xs uppercase font-bold text-neutral-400">Selected Kit</span>
              <h4 className="text-xl font-black text-white">{activeKit.name}</h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">{activeKit.description}</p>
            </div>
          </div>

          {/* Kit Cards Grid */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {KITS.map((kit) => {
              const isSelected = previewKitId === kit.id;
              return (
                <div
                  key={kit.id}
                  onClick={() => handleSelect(kit.id)}
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-neutral-800/90 shadow-lg shadow-emerald-500/10'
                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{kit.name}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{kit.description}</p>
                    </div>
                    {isSelected ? (
                      <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-neutral-700" />
                    )}
                  </div>

                  {/* Color Swatch Preview */}
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-neutral-800">
                    <span className="text-[11px] text-neutral-400 font-medium">Palette</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: kit.primaryColor }}
                        title="Primary Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: kit.secondaryColor }}
                        title="Secondary Color"
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: kit.accentColor }}
                        title="Accent Color"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl font-semibold text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-8 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            APPLY KIT
          </button>
        </div>
      </div>
    </div>
  );
};
