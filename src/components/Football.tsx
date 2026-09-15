import React from 'react';

interface FootballProps {
  size?: number;
  rotation?: number;
  className?: string;
}

export const Football: React.FC<FootballProps> = ({
  size = 40,
  rotation = 0,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ballShade" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </radialGradient>
        </defs>

        {/* Ball Base Sphere */}
        <circle cx="50" cy="50" r="48" fill="url(#ballShade)" stroke="#1E293B" strokeWidth="2.5" />

        {/* Center Pentagon */}
        <polygon
          points="50,34 63,44 58,59 42,59 37,44"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* Radiating lines & Outer Pentagons */}
        <line x1="50" y1="34" x2="50" y2="12" stroke="#1E293B" strokeWidth="2" />
        <line x1="63" y1="44" x2="84" y2="38" stroke="#1E293B" strokeWidth="2" />
        <line x1="58" y1="59" x2="72" y2="82" stroke="#1E293B" strokeWidth="2" />
        <line x1="42" y1="59" x2="28" y2="82" stroke="#1E293B" strokeWidth="2" />
        <line x1="37" y1="44" x2="16" y2="38" stroke="#1E293B" strokeWidth="2" />

        {/* Top patch */}
        <polygon points="40,8 60,8 64,16 36,16" fill="#1E293B" />
        {/* Right top patch */}
        <polygon points="86,30 96,44 88,52 80,40" fill="#1E293B" />
        {/* Right bottom patch */}
        <polygon points="76,86 86,76 74,68 64,78" fill="#1E293B" />
        {/* Left bottom patch */}
        <polygon points="24,86 14,76 26,68 36,78" fill="#1E293B" />
        {/* Left top patch */}
        <polygon points="14,30 4,44 12,52 20,40" fill="#1E293B" />

        {/* Surface gloss highlight */}
        <ellipse cx="38" cy="26" rx="14" ry="7" transform="rotate(-30 38 26)" fill="#FFFFFF" opacity="0.45" />
      </svg>
    </div>
  );
};
