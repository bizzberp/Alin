import React from 'react';
import { KitOption, Player } from '../types';

interface PlayerAvatarProps {
  player: Player;
  kit: KitOption;
  action?: 'idle' | 'ready' | 'kick' | 'celebrate' | 'disappointed';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  kit,
  action = 'idle',
  size = 'md',
  className = '',
}) => {
  const isMessi = player.id === 'messi';

  // Dimension scaling
  const dimensions = {
    sm: { w: 100, h: 140 },
    md: { w: 140, h: 190 },
    lg: { w: 180, h: 250 },
    xl: { w: 240, h: 330 },
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dimensions.w, height: dimensions.h }}
    >
      <svg
        viewBox="0 0 200 280"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Kit Pattern Gradients and Definitions */}
          <linearGradient id={`kit-grad-${player.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={kit.primaryColor} />
            <stop offset="100%" stopColor={kit.secondaryColor} />
          </linearGradient>

          <pattern
            id={`stripes-${player.id}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="20" fill={kit.primaryColor} />
            <rect x="10" width="10" height="20" fill={kit.secondaryColor} />
          </pattern>

          {/* Gold aura filter */}
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shadow under feet */}
        <ellipse cx="100" cy="270" rx="45" ry="8" fill="#000000" opacity="0.45" />

        {/* LEGS & SHORTS */}
        {action === 'kick' ? (
          // Dynamic kicking legs
          <g>
            {/* Standing plant leg */}
            <path
              d="M75 160 L70 230 L55 265 L78 265 L88 230 L85 160 Z"
              fill={kit.secondaryColor}
            />
            {/* Kicking leg extended */}
            <path
              d="M115 160 L145 205 L175 235 L190 230 L160 190 L125 160 Z"
              fill={kit.secondaryColor}
            />
            {/* Cleats */}
            <polygon points="50,265 78,265 72,258 52,258" fill="#111827" stroke={kit.accentColor} strokeWidth="1.5" />
            <polygon points="172,238 194,228 190,220 168,230" fill="#111827" stroke={kit.accentColor} strokeWidth="1.5" />
          </g>
        ) : action === 'celebrate' ? (
          // Standing proud celebration
          <g>
            <path d="M72 160 L68 235 L58 266 L82 266 L88 235 L88 160 Z" fill={kit.secondaryColor} />
            <path d="M128 160 L132 235 L142 266 L118 266 L112 235 L112 160 Z" fill={kit.secondaryColor} />
            <polygon points="52,266 82,266 78,258 54,258" fill="#111827" stroke={kit.accentColor} strokeWidth="1.5" />
            <polygon points="118,266 148,266 144,258 120,258" fill="#111827" stroke={kit.accentColor} strokeWidth="1.5" />
          </g>
        ) : (
          // Ready / Athletic Stance
          <g>
            <path d="M75 160 L70 235 L58 266 L82 266 L88 235 L86 160 Z" fill={kit.secondaryColor} />
            <path d="M125 160 L130 235 L142 266 L118 266 L112 235 L114 160 Z" fill={kit.secondaryColor} />
            {/* Cleats */}
            <polygon points="54,266 84,266 78,258 56,258" fill="#111827" stroke={kit.accentColor} strokeWidth="1.5" />
            <polygon points="116,266 146,266 142,258 120,258" fill="#111827" stroke={kit.accentColor} strokeWidth="1.5" />
          </g>
        )}

        {/* SHORTS */}
        <path
          d="M65 130 L135 130 L145 165 L108 168 L100 152 L92 168 L55 165 Z"
          fill={kit.primaryColor}
          stroke={kit.accentColor}
          strokeWidth="1"
        />

        {/* TORSO / JERSEY */}
        <path
          d="M60 70 L140 70 L136 135 L64 135 Z"
          fill={kit.pattern === 'stripes' ? `url(#stripes-${player.id})` : `url(#kit-grad-${player.id})`}
          stroke={kit.accentColor}
          strokeWidth="1.5"
        />

        {/* Kit decorative accents */}
        {kit.pattern === 'sash' && (
          <polygon points="65,70 85,70 135,135 115,135" fill={kit.accentColor} opacity="0.8" />
        )}
        {kit.pattern === 'split' && (
          <rect x="100" y="70" width="36" height="65" fill={kit.accentColor} opacity="0.3" />
        )}

        {/* Jersey Number */}
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fontSize="24"
          fontFamily="Teko, sans-serif"
          fontWeight="700"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="0.8"
        >
          {player.number}
        </text>

        {/* Player Name on back or chest accent */}
        <text
          x="100"
          y="85"
          textAnchor="middle"
          fontSize="8"
          fontFamily="Montserrat, sans-serif"
          fontWeight="800"
          letterSpacing="1.5"
          fill="#FFFFFF"
          opacity="0.9"
        >
          {isMessi ? 'MESSI' : 'RONALDO'}
        </text>

        {/* ARMS */}
        {action === 'celebrate' ? (
          // Celebrating: Arms raised high
          <g>
            {/* Left Arm Raised */}
            <path
              d="M60 72 L32 20 L48 16 L74 68 Z"
              fill={kit.primaryColor}
              stroke={kit.accentColor}
              strokeWidth="1"
            />
            {/* Left Hand */}
            <circle cx="34" cy="18" r="8" fill={player.skinTone} />

            {/* Right Arm Raised */}
            <path
              d="M140 72 L168 20 L152 16 L126 68 Z"
              fill={kit.primaryColor}
              stroke={kit.accentColor}
              strokeWidth="1"
            />
            {/* Right Hand */}
            <circle cx="166" cy="18" r="8" fill={player.skinTone} />
          </g>
        ) : action === 'kick' ? (
          // Kicking arm balance
          <g>
            <path d="M60 75 L30 100 L38 108 L72 82 Z" fill={kit.primaryColor} />
            <circle cx="28" cy="104" r="7" fill={player.skinTone} />

            <path d="M138 75 L170 95 L164 105 L130 84 Z" fill={kit.primaryColor} />
            <circle cx="172" cy="98" r="7" fill={player.skinTone} />
          </g>
        ) : action === 'disappointed' ? (
          // Head in hands / arms folded
          <g>
            <path d="M60 75 L75 110 L88 105 L72 75 Z" fill={kit.primaryColor} />
            <path d="M140 75 L125 110 L112 105 L128 75 Z" fill={kit.primaryColor} />
            <circle cx="82" cy="112" r="7" fill={player.skinTone} />
            <circle cx="118" cy="112" r="7" fill={player.skinTone} />
          </g>
        ) : (
          // Athletic idle stance
          <g>
            <path d="M60 72 L45 115 L55 120 L72 78 Z" fill={kit.primaryColor} />
            <circle cx="48" cy="122" r="7" fill={player.skinTone} />

            <path d="M140 72 L155 115 L145 120 L128 78 Z" fill={kit.primaryColor} />
            <circle cx="152" cy="122" r="7" fill={player.skinTone} />
          </g>
        )}

        {/* NECK */}
        <rect x="91" y="55" width="18" height="18" rx="4" fill={player.skinTone} />

        {/* HEAD */}
        <ellipse cx="100" cy="42" rx="19" ry="22" fill={player.skinTone} />

        {/* EARS */}
        <ellipse cx="80" cy="42" rx="4" ry="7" fill={player.skinTone} />
        <ellipse cx="120" cy="42" rx="4" ry="7" fill={player.skinTone} />

        {/* FACIAL FEATURES */}
        {/* Eyebrows */}
        <path d="M88 35 Q93 33 97 36" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M103 36 Q107 33 112 35" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />

        {/* Eyes */}
        <circle cx="92" cy="40" r="2" fill="#1F2937" />
        <circle cx="108" cy="40" r="2" fill="#1F2937" />

        {/* Nose */}
        <path d="M100 40 L98 47 L102 47" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth */}
        {action === 'celebrate' ? (
          <path d="M94 52 Q100 60 106 52" fill="#7F1D1D" stroke="#991B1B" strokeWidth="1.2" />
        ) : action === 'disappointed' ? (
          <path d="M95 54 Q100 49 105 54" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M95 52 Q100 55 105 52" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
        )}

        {/* MESSI SPECIFICS: Beard and Hair */}
        {isMessi && (
          <>
            {/* Messi Beard */}
            <path
              d="M86 46 Q88 62 100 63 Q112 62 114 46 Q108 55 100 56 Q92 55 86 46 Z"
              fill="#5C381E"
              opacity="0.85"
            />
            {/* Messi Hair Style (Soft bangs and brown texture) */}
            <path
              d="M80 34 C80 18 120 18 120 34 C120 23 110 20 100 20 C90 20 80 23 80 34 Z"
              fill="#3D2314"
            />
            <path
              d="M80 34 Q90 24 100 24 Q112 24 120 34 Q116 28 106 28 Q96 28 80 34 Z"
              fill="#54331C"
            />
          </>
        )}

        {/* RONALDO SPECIFICS: Modern Fade, Razor Sharp Hair */}
        {!isMessi && (
          <>
            {/* Ronaldo Slick Hair with clean sharp fade */}
            <path
              d="M80 32 C80 14 120 14 120 32 C122 22 112 16 100 16 C88 16 78 22 80 32 Z"
              fill="#111827"
            />
            {/* Crest highlight on top */}
            <path
              d="M90 18 Q100 12 110 18 Q105 14 95 14 Z"
              fill="#374151"
            />
            {/* Side fade line */}
            <line x1="82" y1="33" x2="86" y2="28" stroke="#4B5563" strokeWidth="1" />
          </>
        )}

        {/* CAPTAIN'S ARMBAND */}
        <rect x="52" y="90" width="16" height="8" rx="2" fill="#EAB308" />
        <text x="60" y="97" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#000">C</text>
      </svg>
    </div>
  );
};
