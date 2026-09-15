import { Club, GameSettings, KitType, PlayerId, TrophyStats } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'mvr_settings',
  SELECTED_PLAYER: 'mvr_selected_player',
  SELECTED_KIT: 'mvr_selected_kit',
  SELECTED_CLUB: 'mvr_selected_club',
  TROPHIES: 'mvr_trophies',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.8,
  difficulty: 'normal',
};

const DEFAULT_TROPHIES: TrophyStats = {
  messiWins: 0,
  ronaldoWins: 0,
  totalShootouts: 0,
  totalGoalsScored: 0,
  totalSavesMade: 0,
  suddenDeathWins: 0,
};

export const storageService = {
  getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  getSelectedPlayer(): PlayerId {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.SELECTED_PLAYER);
      if (p === 'messi' || p === 'ronaldo') return p;
    } catch {
      // ignore
    }
    return 'messi';
  },

  saveSelectedPlayer(id: PlayerId) {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PLAYER, id);
    } catch {
      // ignore
    }
  },

  getSelectedKit(): KitType {
    try {
      const k = localStorage.getItem(STORAGE_KEYS.SELECTED_KIT);
      if (k === 'home' || k === 'away' || k === 'classic' || k === 'special') return k;
    } catch {
      // ignore
    }
    return 'home';
  },

  saveSelectedKit(kit: KitType) {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_KIT, kit);
    } catch {
      // ignore
    }
  },

  getSelectedClubId(): string {
    try {
      const c = localStorage.getItem(STORAGE_KEYS.SELECTED_CLUB);
      if (c) return c;
    } catch {
      // ignore
    }
    return 'barcelona';
  },

  saveSelectedClubId(clubId: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CLUB, clubId);
    } catch {
      // ignore
    }
  },

  getTrophyStats(): TrophyStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TROPHIES);
      return data ? { ...DEFAULT_TROPHIES, ...JSON.parse(data) } : DEFAULT_TROPHIES;
    } catch {
      return DEFAULT_TROPHIES;
    }
  },

  recordShootoutResult(winnerId: PlayerId, suddenDeath: boolean, goalsScored: number, savesMade: number) {
    const stats = this.getTrophyStats();
    stats.totalShootouts += 1;
    if (winnerId === 'messi') {
      stats.messiWins += 1;
    } else {
      stats.ronaldoWins += 1;
    }
    if (suddenDeath) {
      stats.suddenDeathWins += 1;
    }
    stats.totalGoalsScored += goalsScored;
    stats.totalSavesMade += savesMade;

    try {
      localStorage.setItem(STORAGE_KEYS.TROPHIES, JSON.stringify(stats));
    } catch {
      // ignore
    }
    return stats;
  },
};
