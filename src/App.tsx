import React, { useState, useEffect } from 'react';
import { Club, GameScreen, GameSettings, KitOption, KitType, PenaltyRound, Player, PlayerId, TrophyStats } from './types';
import { CLUBS, KITS, PLAYERS } from './data/gameData';
import { storageService } from './services/storageService';
import { audio } from './services/audioService';

import { LoadingScreen } from './components/LoadingScreen';
import { HomeScreen } from './components/HomeScreen';
import { PlayerSelectModal } from './components/PlayerSelectModal';
import { KitSelectModal } from './components/KitSelectModal';
import { ClubSelectModal } from './components/ClubSelectModal';
import { TrophiesModal } from './components/TrophiesModal';
import { SettingsModal } from './components/SettingsModal';
import { MatchIntro } from './components/MatchIntro';
import { PenaltyStadium } from './components/PenaltyStadium';
import { WinnerCelebration } from './components/WinnerCelebration';

export default function App() {
  // Screen state
  const [screen, setScreen] = useState<GameScreen>('loading');

  // Modals state
  const [showPlayerSelect, setShowPlayerSelect] = useState<boolean>(false);
  const [showKitSelect, setShowKitSelect] = useState<boolean>(false);
  const [showClubSelect, setShowClubSelect] = useState<boolean>(false);
  const [showTrophies, setShowTrophies] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Game selections
  const [playerId, setPlayerId] = useState<PlayerId>(storageService.getSelectedPlayer());
  const [kitId, setKitId] = useState<KitType>(storageService.getSelectedKit());
  const [clubId, setClubId] = useState<string>(storageService.getSelectedClubId());

  // Settings & Trophies
  const [settings, setSettings] = useState<GameSettings>(storageService.getSettings());
  const [trophyStats, setTrophyStats] = useState<TrophyStats>(storageService.getTrophyStats());

  // Match outcome state
  const [matchWinnerId, setMatchWinnerId] = useState<PlayerId>('messi');
  const [lastMatchRounds, setLastMatchRounds] = useState<PenaltyRound[]>([]);
  const [lastMatchSuddenDeath, setLastMatchSuddenDeath] = useState<boolean>(false);

  // Sync settings with audio service on boot
  useEffect(() => {
    audio.setSoundEnabled(settings.soundEnabled);
    audio.setMusicEnabled(settings.musicEnabled);
    audio.setVolume(settings.soundVolume);
  }, [settings]);

  // Derived active player and opponent
  const player: Player = PLAYERS[playerId];
  const opponentId: PlayerId = playerId === 'messi' ? 'ronaldo' : 'messi';
  const opponent: Player = PLAYERS[opponentId];

  // Derived kits
  const playerKit: KitOption = KITS.find((k) => k.id === kitId) || KITS[0];
  const opponentKit: KitOption =
    kitId === 'home'
      ? KITS.find((k) => k.id === 'away') || KITS[1]
      : KITS.find((k) => k.id === 'home') || KITS[0];

  // Derived clubs
  const playerClub: Club = CLUBS.find((c) => c.id === clubId) || CLUBS[1]; // default Barcelona
  // Opponent gets legendary rival club
  const opponentClub: Club =
    playerClub.id === 'barcelona'
      ? CLUBS.find((c) => c.id === 'real-madrid') || CLUBS[0]
      : playerClub.id === 'real-madrid'
      ? CLUBS.find((c) => c.id === 'barcelona') || CLUBS[1]
      : playerClub.id === 'man-united'
      ? CLUBS.find((c) => c.id === 'man-city') || CLUBS[3]
      : CLUBS.find((c) => c.id !== playerClub.id) || CLUBS[0];

  // Handlers
  const handleSelectPlayer = (id: PlayerId) => {
    setPlayerId(id);
    storageService.saveSelectedPlayer(id);
  };

  const handleSelectKit = (newKit: KitType) => {
    setKitId(newKit);
    storageService.saveSelectedKit(newKit);
  };

  const handleSelectClub = (club: Club) => {
    setClubId(club.id);
    storageService.saveSelectedClubId(club.id);
  };

  const handlePlayClicked = () => {
    setScreen('match-intro');
  };

  const handleEnterStadium = () => {
    setScreen('gameplay');
  };

  const handleMatchComplete = (
    winnerId: PlayerId,
    finalRounds: PenaltyRound[],
    suddenDeath: boolean
  ) => {
    setMatchWinnerId(winnerId);
    setLastMatchRounds(finalRounds);
    setLastMatchSuddenDeath(suddenDeath);

    // Calculate goals and saves
    const goalsScored = finalRounds.reduce((acc, r) => acc + (r.playerScore === true ? 1 : 0), 0);
    const savesMade = finalRounds.reduce((acc, r) => acc + (r.opponentScore === false ? 1 : 0), 0);

    // Persist stats
    const updatedStats = storageService.recordShootoutResult(
      winnerId,
      suddenDeath,
      goalsScored,
      savesMade
    );
    setTrophyStats(updatedStats);

    setScreen('celebration');
  };

  const handlePlayAgain = () => {
    setScreen('match-intro');
  };

  const handleMainMenu = () => {
    setScreen('home');
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white font-sans overflow-x-hidden selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. LOADING SCREEN */}
      {screen === 'loading' && (
        <LoadingScreen onComplete={() => setScreen('home')} />
      )}

      {/* 2. MAIN HOME SCREEN */}
      {screen === 'home' && (
        <>
          <HomeScreen
            player={player}
            opponent={opponent}
            kit={playerKit}
            club={playerClub}
            onPlay={handlePlayClicked}
            onOpenPlayerSelect={() => setShowPlayerSelect(true)}
            onOpenKitSelect={() => setShowKitSelect(true)}
            onOpenClubSelect={() => setShowClubSelect(true)}
            onOpenTrophies={() => setShowTrophies(true)}
            onOpenSettings={() => setShowSettings(true)}
          />

          {/* Modals on Home Screen */}
          {showPlayerSelect && (
            <PlayerSelectModal
              selectedPlayerId={playerId}
              currentKit={playerKit}
              onSelectPlayer={handleSelectPlayer}
              onClose={() => setShowPlayerSelect(false)}
            />
          )}

          {showKitSelect && (
            <KitSelectModal
              player={player}
              currentKitId={kitId}
              onSelectKit={handleSelectKit}
              onClose={() => setShowKitSelect(false)}
            />
          )}

          {showClubSelect && (
            <ClubSelectModal
              selectedClubId={clubId}
              onSelectClub={handleSelectClub}
              onClose={() => setShowClubSelect(false)}
            />
          )}

          {showTrophies && (
            <TrophiesModal
              stats={trophyStats}
              onClose={() => setShowTrophies(false)}
            />
          )}

          {showSettings && (
            <SettingsModal
              settings={settings}
              onUpdateSettings={setSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        </>
      )}

      {/* 3. MATCH SETUP / INTRO */}
      {screen === 'match-intro' && (
        <MatchIntro
          player={player}
          opponent={opponent}
          playerClub={playerClub}
          opponentClub={opponentClub}
          playerKit={playerKit}
          opponentKit={opponentKit}
          onEnterStadium={handleEnterStadium}
        />
      )}

      {/* 4. PENALTY SHOOTOUT GAMEPLAY */}
      {screen === 'gameplay' && (
        <PenaltyStadium
          player={player}
          opponent={opponent}
          playerClub={playerClub}
          opponentClub={opponentClub}
          playerKit={playerKit}
          opponentKit={opponentKit}
          settings={settings}
          onMatchComplete={handleMatchComplete}
          onExitToMenu={() => setScreen('home')}
        />
      )}

      {/* 5. WINNER CELEBRATION & TROPHY LIFTING CEREMONY */}
      {screen === 'celebration' && (
        <WinnerCelebration
          winner={PLAYERS[matchWinnerId]}
          loser={PLAYERS[matchWinnerId === 'messi' ? 'ronaldo' : 'messi']}
          winnerClub={matchWinnerId === playerId ? playerClub : opponentClub}
          loserClub={matchWinnerId === playerId ? opponentClub : playerClub}
          winnerKit={matchWinnerId === playerId ? playerKit : opponentKit}
          loserKit={matchWinnerId === playerId ? opponentKit : playerKit}
          rounds={lastMatchRounds}
          suddenDeath={lastMatchSuddenDeath}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
          onChangePlayer={() => {
            setScreen('home');
            setShowPlayerSelect(true);
          }}
          onChangeKit={() => {
            setScreen('home');
            setShowKitSelect(true);
          }}
          onChangeClub={() => {
            setScreen('home');
            setShowClubSelect(true);
          }}
        />
      )}
    </div>
  );
}
