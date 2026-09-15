import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Club, GameSettings, KitOption, PenaltyKickResult, PenaltyRound, Player, PlayerId, ShotAim, ShotOutcome } from '../types';
import { SHOT_AIMS } from '../data/gameData';
import { PlayerAvatar } from './PlayerAvatar';
import { GoalkeeperAvatar } from './GoalkeeperAvatar';
import { Football } from './Football';
import { audio } from '../services/audioService';
import { Target, Zap, Shield, Sparkles, Check, X, AlertCircle } from 'lucide-react';

interface PenaltyStadiumProps {
  player: Player;
  opponent: Player;
  playerClub: Club;
  opponentClub: Club;
  playerKit: KitOption;
  opponentKit: KitOption;
  settings: GameSettings;
  onMatchComplete: (winnerId: PlayerId, finalRounds: PenaltyRound[], suddenDeath: boolean) => void;
  onExitToMenu: () => void;
}

export const PenaltyStadium: React.FC<PenaltyStadiumProps> = ({
  player,
  opponent,
  playerClub,
  opponentClub,
  playerKit,
  opponentKit,
  settings,
  onMatchComplete,
  onExitToMenu,
}) => {
  // Shootout turns state
  const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player');
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [rounds, setRounds] = useState<PenaltyRound[]>(
    Array.from({ length: 5 }, () => ({ playerScore: null, opponentScore: null }))
  );
  const [isSuddenDeath, setIsSuddenDeath] = useState<boolean>(false);

  // Player controls
  const [selectedAim, setSelectedAim] = useState<ShotAim>('TR');
  const [power, setPower] = useState<number>(50);
  const [powerDirection, setPowerDirection] = useState<1 | -1>(1);
  const [isPowerLocked, setIsPowerLocked] = useState<boolean>(false);

  // Animation and physics state
  const [phase, setPhase] = useState<'aiming' | 'runup' | 'kick' | 'flight' | 'result' | 'turn-transition'>('aiming');
  const [ballPos, setBallPos] = useState<{ x: number; y: number; scale: number; rot: number }>({
    x: 50,
    y: 88,
    scale: 1,
    rot: 0,
  });
  const [gkDiveTarget, setGkDiveTarget] = useState<ShotAim | null>(null);
  const [lastResult, setLastResult] = useState<PenaltyKickResult | null>(null);
  const [playerAvatarAction, setPlayerAvatarAction] = useState<'idle' | 'ready' | 'kick' | 'celebrate' | 'disappointed'>('ready');

  // Goalkeeper defense choice by player during opponent's turn
  const [chosenPlayerGkDive, setChosenPlayerGkDive] = useState<ShotAim | null>(null);

  const powerAnimRef = useRef<number | null>(null);

  // Calculate scores
  const playerScoreCount = rounds.reduce((acc, r) => acc + (r.playerScore === true ? 1 : 0), 0);
  const opponentScoreCount = rounds.reduce((acc, r) => acc + (r.opponentScore === true ? 1 : 0), 0);

  // Continuous power bar oscillation
  useEffect(() => {
    if (phase === 'aiming' && currentTurn === 'player' && !isPowerLocked) {
      const stepPower = () => {
        setPower((prev) => {
          let next = prev + powerDirection * 2.2;
          if (next >= 100) {
            next = 100;
            setPowerDirection(-1);
          } else if (next <= 5) {
            next = 5;
            setPowerDirection(1);
          }
          return next;
        });
        powerAnimRef.current = requestAnimationFrame(stepPower);
      };

      powerAnimRef.current = requestAnimationFrame(stepPower);
      return () => {
        if (powerAnimRef.current) cancelAnimationFrame(powerAnimRef.current);
      };
    }
  }, [phase, currentTurn, isPowerLocked, powerDirection]);

  // Check victory / shootout progression
  const checkShootoutEnd = useCallback(
    (updatedRounds: PenaltyRound[], isSudden: boolean, nextRoundIdx: number) => {
      const pScore = updatedRounds.reduce((acc, r) => acc + (r.playerScore === true ? 1 : 0), 0);
      const oScore = updatedRounds.reduce((acc, r) => acc + (r.opponentScore === true ? 1 : 0), 0);

      // In regular 5 penalties:
      if (!isSudden && nextRoundIdx < 5) {
        const playerRemaining = 5 - (updatedRounds[nextRoundIdx].playerScore !== null ? nextRoundIdx + 1 : nextRoundIdx);
        const oppRemaining = 5 - (updatedRounds[nextRoundIdx].opponentScore !== null ? nextRoundIdx + 1 : nextRoundIdx);

        // Can opponent catch up?
        if (pScore > oScore + oppRemaining) {
          onMatchComplete(player.id, updatedRounds, false);
          return true;
        }
        // Can player catch up?
        if (oScore > pScore + playerRemaining) {
          onMatchComplete(opponent.id, updatedRounds, false);
          return true;
        }
      }

      // After 5 penalties completed
      if (nextRoundIdx >= 5) {
        if (pScore > oScore) {
          onMatchComplete(player.id, updatedRounds, isSudden);
          return true;
        } else if (oScore > pScore) {
          onMatchComplete(opponent.id, updatedRounds, isSudden);
          return true;
        } else {
          // Tied! Activate Sudden Death!
          setIsSuddenDeath(true);
          return false;
        }
      }

      return false;
    },
    [onMatchComplete, player.id, opponent.id]
  );

  // Execute a penalty shot calculation
  const executeShot = (
    shooterTurn: 'player' | 'opponent',
    aimSpot: ShotAim,
    shotPower: number,
    gkDiveSpot: ShotAim
  ) => {
    setPhase('runup');
    setPlayerAvatarAction('kick');
    audio.playWhistle();

    setTimeout(() => {
      // KICK MOMENT
      setPhase('kick');
      audio.playKick(shotPower);

      // Goalkeeper starts diving
      setGkDiveTarget(gkDiveSpot);

      // Ball Trajectory Coordinates
      const aimConfig = SHOT_AIMS.find((a) => a.id === aimSpot) || SHOT_AIMS[3];
      let targetX = aimConfig.xPercent;
      let targetY = aimConfig.yPercent;

      // Power calculation error & variance
      let outcome: ShotOutcome = 'goal';
      let outcomeText = 'GOAL!';

      // Overpower risk (>88%)
      if (shotPower > 88) {
        const failRoll = Math.random();
        if (failRoll < 0.45) {
          outcome = 'post';
          targetY = 10; // hits crossbar
          outcomeText = 'HIT THE CROSSBAR!';
        } else if (failRoll < 0.7) {
          outcome = 'missed';
          targetY = -8; // skies over bar
          outcomeText = 'BLASTED OVER!';
        }
      } else if (shotPower < 30) {
        // Underpowered: goalkeeper easily saves if in nearby zone
        const isNearby =
          gkDiveSpot === aimSpot ||
          (aimSpot.startsWith('T') && gkDiveSpot.startsWith('T')) ||
          (aimSpot.startsWith('B') && gkDiveSpot.startsWith('B'));
        if (isNearby) {
          outcome = 'saved';
          outcomeText = 'SAVED BY GOALKEEPER!';
        }
      }

      // Goalkeeper save calculation
      if (outcome === 'goal') {
        const isExactGuess = gkDiveSpot === aimSpot;
        const isSameSide =
          (aimSpot.includes('L') && gkDiveSpot.includes('L')) ||
          (aimSpot.includes('R') && gkDiveSpot.includes('R')) ||
          (aimSpot === 'C' && gkDiveSpot === 'C');

        const difficultyBonus = settings.difficulty === 'legendary' ? 0.15 : 0;
        const saveChance = isExactGuess ? 0.85 + difficultyBonus : isSameSide ? 0.45 + difficultyBonus : 0.05;

        if (Math.random() < saveChance) {
          outcome = 'saved';
          outcomeText = 'INCREDIBLE SAVE!';
        }
      }

      // Ball flight animation
      setPhase('flight');
      setBallPos({
        x: targetX,
        y: targetY,
        scale: 0.42,
        rot: 720,
      });

      // Impact moment (ball reaches net or keeper)
      setTimeout(() => {
        setPhase('result');
        if (outcome === 'goal') {
          audio.playGoal();
          setPlayerAvatarAction(shooterTurn === 'player' ? 'celebrate' : 'disappointed');
        } else if (outcome === 'saved') {
          audio.playSave();
          setPlayerAvatarAction(shooterTurn === 'player' ? 'disappointed' : 'celebrate');
        } else if (outcome === 'post') {
          audio.playPostHit();
          setPlayerAvatarAction('disappointed');
        } else {
          // Missed
          audio.playSave();
          setPlayerAvatarAction('disappointed');
        }

        const resultObj: PenaltyKickResult = {
          turn: shooterTurn,
          shooterId: shooterTurn === 'player' ? player.id : opponent.id,
          shooterName: shooterTurn === 'player' ? player.name : opponent.name,
          aim: aimSpot,
          power: shotPower,
          gkDive: gkDiveSpot,
          outcome,
          text: outcomeText,
        };
        setLastResult(resultObj);

        // Update score indicators
        setRounds((prevRounds) => {
          const nextRounds = [...prevRounds];
          let currentIdx = roundIndex;

          if (isSuddenDeath && currentIdx >= nextRounds.length) {
            nextRounds.push({ playerScore: null, opponentScore: null });
          }

          if (shooterTurn === 'player') {
            nextRounds[currentIdx].playerScore = outcome === 'goal';
          } else {
            nextRounds[currentIdx].opponentScore = outcome === 'goal';
          }
          return nextRounds;
        });

        // After displaying result, switch turn or conclude
        setTimeout(() => {
          handleNextTurn(shooterTurn, outcome === 'goal');
        }, 2200);
      }, 700);
    }, 450);
  };

  // Handle switching between player and AI opponent turns
  const handleNextTurn = (finishedTurn: 'player' | 'opponent', _scored: boolean) => {
    setPhase('turn-transition');

    // Reset ball position
    setBallPos({ x: 50, y: 88, scale: 1, rot: 0 });
    setGkDiveTarget(null);
    setLastResult(null);
    setChosenPlayerGkDive(null);

    if (finishedTurn === 'player') {
      // Opponent's turn to take penalty
      setCurrentTurn('opponent');
      setPlayerAvatarAction('ready');
      setPhase('aiming');

      // AI Opponent prepares shot
      setTimeout(() => {
        handleAiOpponentPenalty();
      }, 1500);
    } else {
      // Opponent finished, advance round!
      const nextRoundIdx = roundIndex + 1;
      setRoundIndex(nextRoundIdx);
      setCurrentTurn('player');
      setIsPowerLocked(false);
      setPlayerAvatarAction('ready');

      // Check if match resolved or sudden death
      const isGameOver = checkShootoutEnd(rounds, isSuddenDeath, nextRoundIdx);
      if (!isGameOver) {
        if (isSuddenDeath && nextRoundIdx >= rounds.length) {
          setRounds((prev) => [...prev, { playerScore: null, opponentScore: null }]);
        }
        setPhase('aiming');
      }
    }
  };

  // AI Opponent Penalty Logic
  const handleAiOpponentPenalty = () => {
    const aims: ShotAim[] = ['TL', 'ML', 'BL', 'C', 'TR', 'MR', 'BR'];
    const aiAim = aims[Math.floor(Math.random() * aims.length)];
    const aiPower = Math.floor(Math.random() * 35) + 55; // 55% - 90% power

    // Player Goalkeeper dive: either player chose before timer, or auto-reacts
    const playerGkDive = chosenPlayerGkDive || aims[Math.floor(Math.random() * aims.length)];

    executeShot('opponent', aiAim, aiPower, playerGkDive);
  };

  // Player clicks shoot button
  const handlePlayerShoot = () => {
    if (phase !== 'aiming' || currentTurn !== 'player' || isPowerLocked) return;
    setIsPowerLocked(true);
    audio.playClick();

    // Goalkeeper AI decides its dive
    const aims: ShotAim[] = ['TL', 'ML', 'BL', 'C', 'TR', 'MR', 'BR'];
    const randomGkDive = aims[Math.floor(Math.random() * aims.length)];

    executeShot('player', selectedAim, power, randomGkDive);
  };

  // Keyboard shortcut listener (Space to shoot, 1-7 for aim)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'aiming' && currentTurn === 'player' && !isPowerLocked) {
          handlePlayerShoot();
        }
      } else if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) {
        const spot = SHOT_AIMS[parseInt(e.key) - 1]?.id;
        if (spot) {
          audio.playClick();
          setSelectedAim(spot);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const activeShooter = currentTurn === 'player' ? player : opponent;
  const activeKit = currentTurn === 'player' ? playerKit : opponentKit;

  return (
    <div className="relative w-full h-screen min-h-[640px] flex flex-col justify-between p-2 sm:p-4 bg-neutral-950 text-white select-none overflow-hidden">
      {/* Dynamic Stadium Sky & Floodlights Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-neutral-950" />

        {/* Powerful Stadium Floodlight Rays */}
        <div className="absolute -top-32 left-1/6 w-[450px] h-[450px] bg-cyan-400/20 rounded-full blur-[100px] animate-floodlight" />
        <div className="absolute -top-32 right-1/6 w-[450px] h-[450px] bg-amber-400/20 rounded-full blur-[100px] animate-floodlight" />

        {/* Stadium Upper Stands Crowd Silhouette */}
        <div className="absolute top-16 inset-x-0 h-32 opacity-25 flex justify-between px-4">
          <div className="w-1/3 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-800 to-transparent" />
          <div className="w-1/3 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-800 to-transparent" />
          <div className="w-1/3 h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-800 to-transparent" />
        </div>

        {/* Lush Green Pitch Turf with Perspective Angle */}
        <div
          className="absolute bottom-0 inset-x-0 h-[62%] border-t-2 border-emerald-500/40"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, #064E3B 0%, #065F46 40%, #022C22 80%, #021C16 100%)',
          }}
        >
          {/* Turf Mowing Striped Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,#FFFFFF_0px,#FFFFFF_60px,transparent_60px,transparent_120px)]" />

          {/* Penalty Box Arc & Box Lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-full border-x-2 border-white/25 pointer-events-none">
            {/* 6-Yard Box */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-28 border-b-2 border-x-2 border-white/25" />
            {/* Penalty Spot */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#FFF]" />
            {/* Penalty Spot Ring */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-white/30" />
          </div>
        </div>
      </div>

      {/* TOP BROADCAST SCOREBOARD */}
      <header className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full bg-neutral-900/90 border-2 border-neutral-700/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md">
          {/* Sudden Death Banner if Active */}
          {isSuddenDeath && (
            <div className="mb-2 text-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-0.5 rounded-full bg-rose-600 text-white font-black text-[11px] uppercase tracking-widest animate-pulse shadow-lg">
                <AlertCircle className="w-3.5 h-3.5" /> SUDDEN DEATH SHOOTOUT
              </span>
            </div>
          )}

          <div className="grid grid-cols-11 items-center gap-2 text-center">
            {/* Player Side (Left) */}
            <div className="col-span-4 flex items-center justify-start gap-2 sm:gap-3 pl-1">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-md border border-white/10 shrink-0"
                style={{ background: `linear-gradient(135deg, ${playerClub.primaryColor}, ${playerClub.secondaryColor})` }}
              >
                {playerClub.badgeSymbol}
              </div>
              <div className="text-left truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-black text-white truncate">{player.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
                    YOU
                  </span>
                </div>
                {/* Penalty Dots Indicator */}
                <div className="flex items-center gap-1 mt-1">
                  {rounds.map((r, idx) => (
                    <span
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                        r.playerScore === true
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : r.playerScore === false
                          ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                          : idx === roundIndex && currentTurn === 'player'
                          ? 'bg-amber-400 border-amber-300 animate-ping'
                          : 'bg-neutral-800 border-neutral-700'
                      }`}
                    >
                      {r.playerScore === true ? '✓' : r.playerScore === false ? '✕' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Score Center Digit */}
            <div className="col-span-3 flex flex-col items-center justify-center bg-neutral-950/80 py-1.5 px-3 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-3 font-display font-black text-3xl sm:text-4xl leading-none text-white tracking-wider">
                <span className="text-cyan-400">{playerScoreCount}</span>
                <span className="text-neutral-500 text-2xl">—</span>
                <span className="text-amber-400">{opponentScoreCount}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-0.5">
                Penalty Round {roundIndex + 1}
              </span>
            </div>

            {/* Opponent Side (Right) */}
            <div className="col-span-4 flex items-center justify-end gap-2 sm:gap-3 pr-1 text-right">
              <div className="truncate">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800">
                    AI
                  </span>
                  <span className="text-sm sm:text-base font-black text-white truncate">{opponent.name}</span>
                </div>
                {/* Penalty Dots Indicator */}
                <div className="flex items-center justify-end gap-1 mt-1">
                  {rounds.map((r, idx) => (
                    <span
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                        r.opponentScore === true
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : r.opponentScore === false
                          ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                          : idx === roundIndex && currentTurn === 'opponent'
                          ? 'bg-amber-400 border-amber-300 animate-ping'
                          : 'bg-neutral-800 border-neutral-700'
                      }`}
                    >
                      {r.opponentScore === true ? '✓' : r.opponentScore === false ? '✕' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-md border border-white/10 shrink-0"
                style={{ background: `linear-gradient(135deg, ${opponentClub.primaryColor}, ${opponentClub.secondaryColor})` }}
              >
                {opponentClub.badgeSymbol}
              </div>
            </div>
          </div>
        </div>

        {/* Turn Status Message Banner */}
        <div className="mt-1.5 px-4 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs font-semibold flex items-center gap-2">
          {currentTurn === 'player' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                <strong>{player.name}</strong> stepping up to shoot! Choose Aim & lock Power.
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>
                <strong>{opponent.name}</strong> preparing penalty! Pick your goalkeeper dive.
              </span>
            </>
          )}
        </div>
      </header>

      {/* CENTER 3D FOOTBALL GOAL & PITCH STAGE */}
      <main className="relative z-10 my-auto flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[320px]">
        {/* FOOTBALL GOAL STRUCTURE */}
        <div className="relative w-full max-w-2xl h-60 sm:h-72 border-t-[8px] border-x-[8px] border-slate-100 rounded-t-sm shadow-[0_0_35px_rgba(255,255,255,0.25)] flex items-center justify-center overflow-hidden bg-slate-900/40">
          {/* Authentic Hexagonal Goal Net Pattern Texture */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(30deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%, #FFFFFF),
                linear-gradient(150deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%, #FFFFFF),
                linear-gradient(30deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%, #FFFFFF),
                linear-gradient(150deg, #FFFFFF 12%, transparent 12.5%, transparent 87%, #FFFFFF 87.5%, #FFFFFF),
                linear-gradient(60deg, #777777 25%, transparent 25.5%, transparent 75%, #777777 75%, #777777),
                linear-gradient(60deg, #777777 25%, transparent 25.5%, transparent 75%, #777777 75%, #777777)
              `,
              backgroundSize: '24px 42px',
              backgroundPosition: '0 0, 0 0, 12px 21px, 12px 21px, 0 0, 12px 21px',
            }}
          />

          {/* Goal Stanchion depth frame */}
          <div className="absolute inset-x-8 top-0 bottom-0 border-x border-t border-white/20 pointer-events-none" />

          {/* Goalkeeper Positioned in Net */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 transition-all duration-300">
            <GoalkeeperAvatar
              stance={
                phase === 'result'
                  ? lastResult?.outcome === 'goal'
                    ? 'beaten'
                    : 'celebrating'
                  : gkDiveTarget
                  ? 'saving'
                  : 'ready'
              }
              diveTarget={gkDiveTarget}
            />
          </div>

          {/* 7 Interactive Target Spots on Goal Face */}
          {SHOT_AIMS.map((aim) => {
            const isSelected = selectedAim === aim.id && currentTurn === 'player';
            const isGkSelected = chosenPlayerGkDive === aim.id && currentTurn === 'opponent';

            return (
              <button
                key={aim.id}
                id={`target-${aim.id}`}
                onClick={() => {
                  audio.playClick();
                  if (currentTurn === 'player' && phase === 'aiming') {
                    setSelectedAim(aim.id);
                  } else if (currentTurn === 'opponent' && phase === 'aiming') {
                    setChosenPlayerGkDive(aim.id);
                  }
                }}
                style={{
                  left: `${aim.xPercent}%`,
                  top: `${aim.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-cyan-300 bg-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.9)] scale-110'
                    : isGkSelected
                    ? 'border-2 border-emerald-300 bg-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.9)] scale-110'
                    : 'border border-white/30 bg-black/30 hover:border-white/80 hover:bg-white/10'
                }`}
                title={aim.label}
              >
                {isSelected ? (
                  <Target className="w-6 h-6 text-cyan-200 animate-spin" />
                ) : isGkSelected ? (
                  <Shield className="w-6 h-6 text-emerald-200 animate-bounce" />
                ) : (
                  <span className="text-[10px] font-bold text-white/80">{aim.id}</span>
                )}
              </button>
            );
          })}

          {/* RESULT OVERLAY BANNER (Goal / Saved / Hit Post / Missed) */}
          {phase === 'result' && lastResult && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/65 backdrop-blur-xs animate-fadeIn">
              <div
                className={`px-8 py-3 rounded-2xl border-2 text-center shadow-2xl transform scale-110 animate-bounce ${
                  lastResult.outcome === 'goal'
                    ? 'border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-emerald-500/50'
                    : lastResult.outcome === 'saved'
                    ? 'border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-cyan-500/50'
                    : 'border-rose-400 bg-rose-950/90 text-rose-300 shadow-rose-500/50'
                }`}
              >
                <h3 className="text-3xl sm:text-5xl font-black font-display tracking-wider">
                  {lastResult.text}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-white mt-1">
                  {lastResult.shooterName} • {lastResult.aim} @ {lastResult.power}% Power
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PENALTY SPOT & KICKER STAGE */}
        <div className="relative w-full max-w-md h-32 sm:h-36 mt-2 flex items-center justify-center">
          {/* Animated Football in flight */}
          <div
            className="absolute z-30 transition-all duration-700 ease-out"
            style={{
              left: `${ballPos.x}%`,
              top: `${ballPos.y}%`,
              transform: `translate(-50%, -50%) scale(${ballPos.scale})`,
            }}
          >
            <Football size={44} rotation={ballPos.rot} />
          </div>

          {/* Kicker Player Avatar */}
          <div
            className={`absolute bottom-0 z-20 transition-all duration-300 ${
              phase === 'runup' ? 'translate-x-12 -translate-y-4' : 'translate-x-0 translate-y-0'
            }`}
          >
            <PlayerAvatar
              player={activeShooter}
              kit={activeKit}
              action={playerAvatarAction}
              size="lg"
            />
          </div>
        </div>
      </main>

      {/* BOTTOM CONTROLS PANEL */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md">
        {currentTurn === 'player' ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* AIM DIRECTION SELECTOR BUTTONS */}
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Aim Corner
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {SHOT_AIMS.map((aim) => (
                  <button
                    key={aim.id}
                    onClick={() => {
                      audio.playClick();
                      setSelectedAim(aim.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedAim === aim.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {aim.label}
                  </button>
                ))}
              </div>
            </div>

            {/* POWER METER */}
            <div className="w-full sm:w-48 flex flex-col items-center">
              <div className="w-full flex justify-between text-[11px] font-bold text-neutral-300 mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Shot Power
                </span>
                <span className="font-mono text-emerald-400">{Math.round(power)}%</span>
              </div>
              <div className="w-full h-4 bg-neutral-950 rounded-full p-0.5 border border-neutral-700 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    power > 85
                      ? 'bg-rose-500 shadow-[0_0_10px_#F43F5E]'
                      : power >= 55 && power <= 85
                      ? 'bg-emerald-400 shadow-[0_0_10px_#34D399]'
                      : 'bg-yellow-400 shadow-[0_0_10px_#FACC15]'
                  }`}
                  style={{ width: `${power}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-500 mt-1">
                Sweet spot: 60-80% for top bins
              </span>
            </div>

            {/* LARGE PRIMARY SHOOT BUTTON */}
            <button
              id="btn-shoot"
              onClick={handlePlayerShoot}
              disabled={phase !== 'aiming' || isPowerLocked}
              className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-black text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                phase === 'aiming' && !isPowerLocked
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-slate-950 shadow-emerald-500/30 scale-105 active:scale-95 cursor-pointer'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>⚽ SHOOT</span>
            </button>
          </div>
        ) : (
          /* OPPONENT TURN DEFENSE CONTROLS */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h4 className="font-black text-white text-base">GOALKEEPER DIVE INTUITION</h4>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {opponent.name} is about to take his penalty! Guess his shot to dive & save!
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => {
                  audio.playClick();
                  setChosenPlayerGkDive('ML');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  chosenPlayerGkDive === 'ML'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                Dive Left ◀
              </button>
              <button
                onClick={() => {
                  audio.playClick();
                  setChosenPlayerGkDive('C');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  chosenPlayerGkDive === 'C'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                Stay Center ▲
              </button>
              <button
                onClick={() => {
                  audio.playClick();
                  setChosenPlayerGkDive('MR');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  chosenPlayerGkDive === 'MR'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                Dive Right ▶
              </button>
            </div>
          </div>
        )}

        {/* Exit match prompt option */}
        <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Keyboard shortcut: [SPACE] to Shoot • [1-7] for Target Aims</span>
          <button
            onClick={() => {
              audio.playClick();
              onExitToMenu();
            }}
            className="text-neutral-400 hover:text-white underline transition-colors"
          >
            Forfeit / Return to Menu
          </button>
        </div>
      </footer>
    </div>
  );
};
