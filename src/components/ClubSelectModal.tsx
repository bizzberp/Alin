import React from 'react';
import { Club } from '../types';
import { CLUBS } from '../data/gameData';
import { audio } from '../services/audioService';
import { X, Check, Shield, MapPin, Building2 } from 'lucide-react';

interface ClubSelectModalProps {
  selectedClubId: string;
  onSelectClub: (club: Club) => void;
  onClose: () => void;
}

export const ClubSelectModal: React.FC<ClubSelectModalProps> = ({
  selectedClubId,
  onSelectClub,
  onClose,
}) => {
  const handleSelect = (club: Club) => {
    audio.playClick();
    onSelectClub(club);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                SELECT MATCH CLUB
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Choose the football club you want to represent in the shootout
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

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 overflow-y-auto pr-1">
          {CLUBS.map((club) => {
            const isSelected = selectedClubId === club.id;
            return (
              <div
                key={club.id}
                onClick={() => handleSelect(club)}
                className={`group relative p-5 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 bg-neutral-800/90 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                    : 'border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 hover:bg-neutral-800/50'
                }`}
              >
                {/* Background ambient gradient using club primary color */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: club.primaryColor }}
                />

                <div>
                  <div className="flex items-start justify-between">
                    {/* Badge Emoji / Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md border border-white/10"
                      style={{
                        background: `linear-gradient(135deg, ${club.primaryColor}, ${club.secondaryColor})`,
                      }}
                    >
                      <span>{club.badgeSymbol}</span>
                    </div>

                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-lg mt-3 group-hover:text-amber-300 transition-colors">
                    {club.name}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-neutral-400">
                    <p className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{club.stadium}</span>
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{club.city}</span>
                    </p>
                  </div>
                </div>

                {/* Club Colors strip */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                    Club Colors
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: club.primaryColor }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: club.secondaryColor }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: club.accentColor }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
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
