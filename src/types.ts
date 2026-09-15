export type PlayerId = 'messi' | 'ronaldo';

export interface Player {
  id: PlayerId;
  name: string;
  fullName: string;
  number: number;
  country: string;
  dominantFoot: 'Left' | 'Right';
  stats: {
    shooting: number;
    curve: number;
    power: number;
    penalty: number;
    composure: number;
  };
  signature: string;
  celebrationName: string;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  facialHair?: boolean;
}

export type KitType = 'home' | 'away' | 'classic' | 'special';

export interface KitOption {
  id: KitType;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: 'stripes' | 'solid' | 'sash' | 'split';
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  stadium: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  badgeSymbol: string;
}

export type ShotAim = 'TL' | 'ML' | 'BL' | 'C' | 'TR' | 'MR' | 'BR';

export interface ShotAimConfig {
  id: ShotAim;
  label: string;
  xPercent: number; // 0 to 100 on goal face
  yPercent: number; // 0 to 100 on goal face (0 is top, 100 is bottom)
}

export type ShotOutcome = 'goal' | 'saved' | 'post' | 'missed';

export interface PenaltyKickResult {
  turn: 'player' | 'opponent';
  shooterId: PlayerId;
  shooterName: string;
  aim: ShotAim;
  power: number; // 0 to 100
  gkDive: ShotAim;
  outcome: ShotOutcome;
  text: string;
}

export interface PenaltyRound {
  playerScore: boolean | null;
  opponentScore: boolean | null;
}

export type GameScreen = 
  | 'loading'
  | 'home'
  | 'match-intro'
  | 'gameplay'
  | 'celebration';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  difficulty: 'normal' | 'legendary';
}

export interface TrophyStats {
  messiWins: number;
  ronaldoWins: number;
  totalShootouts: number;
  totalGoalsScored: number;
  totalSavesMade: number;
  suddenDeathWins: number;
}
