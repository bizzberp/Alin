import React from 'react';
import { ShotAim } from '../types';

interface GoalkeeperAvatarProps {
  stance: 'ready' | 'saving' | 'beaten' | 'celebrating';
  diveTarget?: ShotAim | null;
  className?: string;
}

export const GoalkeeperAvatar: React.FC<GoalkeeperAvatarProps> = ({
  stance,
  diveTarget = null,
  className = '',
}) => {
  // Determine goalkeeper position offset based on dive
  let transformStyle = 'translate-x-0 translate-y-0 rotate-0';

  if (diveTarget) {
    switch (diveTarget) {
      case 'TL':
        transformStyle = '-translate-x-24 -translate-y-12 -rotate-45';
        break;
      case 'ML':
        transformStyle = '-translate-x-24 translate-y-2 -rotate-30';
        break;
      case 'BL':
        transformStyle = '-translate-x-24 translate-y-12 -rotate-15';
        break;
      case 'TR':
        transformStyle = 'translate-x-24 -translate-y-12 rotate-45';
        break;
      case 'MR':
        transformStyle = 'translate-x-24 translate-y-2 rotate-30';
        break;
      case 'BR':
        transformStyle = 'translate-x-24 translate-y-12 rotate-15';
        break;
      case 'C':
        transformStyle = 'translate-x-0 -translate-y-6 rotate-0';
        break;
    }
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-all duration-300 ease-out select-none ${transformStyle} ${className}`}
      style={{ width: 140, height: 180 }}
    >
      <svg
        viewBox="0 0 160 200"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Goalkeeper Shadow */}
        <ellipse cx="80" cy="195" rx="36" ry="6" fill="#000000" opacity="0.4" />

        {/* Goalkeeper legs */}
        <path d="M58 115 L52 165 L40 190 L60 190 L68 165 L66 115 Z" fill="#1E293B" />
        <path d="M102 115 L108 165 L120 190 L100 190 L92 165 L94 115 Z" fill="#1E293B" />

        {/* Boots */}
        <polygon points="36,190 62,190 58,184 38,184" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
        <polygon points="98,190 124,190 120,184 100,184" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />

        {/* Goalkeeper Shorts */}
        <path d="M50 95 L110 95 L116 122 L86 126 L80 114 L74 126 L44 122 Z" fill="#0F172A" />

        {/* Goalkeeper Jersey (Fluorescent Neon Green with Geometric Pattern) */}
        <path d="M46 50 L114 50 L110 100 L50 100 Z" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
        <path d="M46 50 L80 100 L114 50" fill="#047857" opacity="0.35" />

        {/* GK Number 1 */}
        <text
          x="80"
          y="82"
          textAnchor="middle"
          fontSize="22"
          fontFamily="Teko, sans-serif"
          fontWeight="700"
          fill="#FFFFFF"
          stroke="#064E3B"
          strokeWidth="0.8"
        >
          1
        </text>

        {/* Goalkeeper Arms & Giant Padded Latex Gloves */}
        {diveTarget ? (
          // Extended reaching arms during dive
          <g>
            <path d="M46 54 L18 16 L28 10 L56 46 Z" fill="#10B981" />
            {/* Left Glove */}
            <circle cx="20" cy="12" r="13" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <path d="M14 8 L26 16 M14 16 L26 8" stroke="#FFFFFF" strokeWidth="1.5" />

            <path d="M114 54 L142 16 L132 10 L104 46 Z" fill="#10B981" />
            {/* Right Glove */}
            <circle cx="140" cy="12" r="13" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <path d="M134 8 L146 16 M134 16 L146 8" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        ) : (
          // Ready crouching keeper arms
          <g>
            <path d="M46 54 L20 74 L26 84 L54 62 Z" fill="#10B981" />
            {/* Left Glove */}
            <circle cx="20" cy="80" r="12" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <rect x="12" y="74" width="16" height="12" rx="3" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />

            <path d="M114 54 L140 74 L134 84 L106 62 Z" fill="#10B981" />
            {/* Right Glove */}
            <circle cx="140" cy="80" r="12" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <rect x="132" y="74" width="16" height="12" rx="3" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}

        {/* Head and Face */}
        <rect x="73" y="38" width="14" height="14" rx="3" fill="#D19A66" />
        <ellipse cx="80" cy="28" rx="14" ry="17" fill="#D19A66" />

        {/* Goalkeeper Headband/Hair */}
        <path d="M66 22 C66 10 94 10 94 22 C94 15 88 14 80 14 C72 14 66 15 66 22 Z" fill="#1E293B" />
        <rect x="66" y="20" width="28" height="5" fill="#EF4444" rx="1" />

        {/* Eyes alert */}
        <circle cx="75" cy="28" r="1.8" fill="#0F172A" />
        <circle cx="85" cy="28" r="1.8" fill="#0F172A" />

        {/* Mouth */}
        {stance === 'beaten' ? (
          <ellipse cx="80" cy="38" rx="3" ry="4" fill="#451A03" />
        ) : (
          <line x1="77" y1="36" x2="83" y2="36" stroke="#451A03" strokeWidth="1.5" />
        )}
      </svg>
    </div>
  );
};
