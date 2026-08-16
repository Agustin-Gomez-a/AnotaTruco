import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faCrown,
  faRotateLeft,
  faArrowRotateLeft,
  faClockRotateLeft,
  faScroll,
  faSliders,
  faVolumeHigh,
  faVolumeXmark,
  faUsers,
  faUser,
  faPlus,
  faMinus,
  faHandPointRight,
  faFire,
  faPenToSquare,
  faCheck,
  faRotate,
  faHouse,
  faBullhorn,
  faChartSimple,
  faArrowsRotate,
  faShareNodes,
  faBars
} from '@fortawesome/free-solid-svg-icons';

import MatchBoard from './MatchBoard';
import type { CounterStyle } from './MatchGroup';
import CardsGuideModal from './CardsGuideModal';
import MatchHistoryModal, { type HistoryEntry } from './MatchHistoryModal';
import QuickCantoModal from './QuickCantoModal';
import SettingsModal, { type TableTheme } from './SettingsModal';
import SplashScreen from './SplashScreen';
import CriolloRouletteModal from './CriolloRouletteModal';
import TournamentModal from './TournamentModal';
import SoundboardModal from './SoundboardModal';
import StatsModal, { type MatchRecord } from './StatsModal';
import NavDrawer from './NavDrawer';
import { sound } from '../utils/sound';

interface Player {
  id: number;
  name: string;
  score: number;
}

export default function AnotaTruco() {
  const [showSplash, setShowSplash] = useState(true);
  const [numPlayers, setNumPlayers] = useState<2 | 3>(2);
  const [target, setTarget] = useState(30);
  const [customTarget, setCustomTarget] = useState('');
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Nosotros', score: 0 },
    { id: 2, name: 'Ellos', score: 0 },
  ]);
  const [manoPlayerId, setManoPlayerId] = useState<number>(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<Player[][]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  // Modales & Menú Hamburguesa
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isTournamentOpen, setIsTournamentOpen] = useState(false);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [cantoModalTargetPlayer, setCantoModalTargetPlayer] = useState<Player | null>(null);

  // User Settings
  const [counterStyle, setCounterStyle] = useState<CounterStyle>('fosforos');
  const [tableTheme, setTableTheme] = useState<TableTheme>('pano');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [faceToFaceEnabled, setFaceToFaceEnabled] = useState(false);
  const [directScoreTapEnabled, setDirectScoreTapEnabled] = useState(true);

  // Edición rápida de nombres & Animación de Score
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [lastTappedPlayerId, setLastTappedPlayerId] = useState<number | null>(null);

  // Inicialización desde localStorage (solo en cliente)
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('anotatruco_theme') as TableTheme;
      if (savedTheme) setTableTheme(savedTheme);

      const savedStyle = localStorage.getItem('anotatruco_style') as CounterStyle;
      if (savedStyle) setCounterStyle(savedStyle);

      const savedSound = localStorage.getItem('anotatruco_sound');
      if (savedSound !== null) {
        const val = savedSound === 'true';
        setSoundEnabled(val);
        sound.isMuted = !val;
      }

      const savedVib = localStorage.getItem('anotatruco_vib');
      if (savedVib !== null) {
        setVibrationEnabled(savedVib === 'true');
      }

      const savedF2F = localStorage.getItem('anotatruco_f2f');
      if (savedF2F !== null) {
        setFaceToFaceEnabled(savedF2F === 'true');
      }

      const savedTap = localStorage.getItem('anotatruco_direct_tap');
      if (savedTap !== null) {
        setDirectScoreTapEnabled(savedTap === 'true');
      }

      // Cargar partida guardada si existe
      const savedState = localStorage.getItem('anotatruco_gamestate');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.players && Array.isArray(parsed.players)) {
          setPlayers(parsed.players);
          setNumPlayers(parsed.numPlayers || parsed.players.length);
          setTarget(parsed.target || 30);
          if (parsed.manoPlayerId) setManoPlayerId(parsed.manoPlayerId);
          if (parsed.historyEntries) setHistoryEntries(parsed.historyEntries);
        }
      }
    } catch {
      // Ignorar errores de storage
    }
  }, []);

  // Guardar partida automáticamente ante cambios
  useEffect(() => {
    try {
      const stateToSave = {
        players,
        numPlayers,
        target,
        manoPlayerId,
        historyEntries,
      };
      localStorage.setItem('anotatruco_gamestate', JSON.stringify(stateToSave));
    } catch {}
  }, [players, numPlayers, target, manoPlayerId, historyEntries]);

  // Mantener pantalla encendida (Wake Lock API) para partidas largas
  useEffect(() => {
    let wakeLock: any = null;
    if ('wakeLock' in navigator) {
      try {
        navigator.wakeLock.request('screen').then((wl) => {
          wakeLock = wl;
        }).catch(() => {});
      } catch {}
    }
    return () => {
      if (wakeLock) {
        try { wakeLock.release(); } catch {}
      }
    };
  }, []);

  // Manejar vibración háptica
  const triggerHaptic = (ms: number = 15) => {
    if (vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch {}
    }
  };

  const handlePlayerMode = (num: 2 | 3) => {
    sound.playClick();
    triggerHaptic();
    setNumPlayers(num);
    if (num === 2) {
      setPlayers([
        { id: 1, name: 'Nosotros', score: 0 },
        { id: 2, name: 'Ellos', score: 0 },
      ]);
    } else {
      setPlayers([
        { id: 1, name: 'Jugador 1', score: 0 },
        { id: 2, name: 'Jugador 2', score: 0 },
        { id: 3, name: 'Jugador 3', score: 0 },
      ]);
    }
    setManoPlayerId(1);
    setWinner(null);
    setHistory([]);
    setHistoryEntries([]);
  };

  const setTargetPoints = (pts: number) => {
    sound.playClick();
    triggerHaptic();
    setTarget(pts);
    resetGame(pts);
  };

  const modifyScore = (id: number, delta: number, reason?: string) => {
    if (winner) return;

    const targetPlayer = players.find((p) => p.id === id);
    if (!targetPlayer) return;

    const newScore = Math.max(0, Math.min(target, targetPlayer.score + delta));
    if (newScore === targetPlayer.score) return;

    if (delta > 0) {
      const soundTheme =
        counterStyle === 'tiza' ? 'chalk' : counterStyle === 'patacones' ? 'coin' : 'poker';
      sound.playMatchDrop(soundTheme);
      triggerHaptic(20);
    } else {
      sound.playRemove();
      triggerHaptic(30);
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      playerName: targetPlayer.name,
      delta,
      reason: reason || (delta > 0 ? `+${delta} pts` : `${delta} pts`),
      prevScore: targetPlayer.score,
      newScore,
    };

    setHistory((h) => [...h, players]);
    setHistoryEntries((prev) => [...prev, newEntry]);

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (newScore >= target) {
          setWinner(p.name);
          sound.playWin();
          triggerHaptic(100);

          // Guardar en estadísticas históricas
          try {
            const loser = prev.find((o) => o.id !== id);
            const record: MatchRecord = {
              id: Math.random().toString(36).substring(2, 9),
              date: new Date().toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }),
              winner: p.name,
              loser: loser ? loser.name : 'Rival',
              winnerScore: newScore,
              loserScore: loser ? loser.score : 0,
              target,
            };
            const prevRecords = JSON.parse(
              localStorage.getItem('anotatruco_matches_record') || '[]'
            );
            localStorage.setItem(
              'anotatruco_matches_record',
              JSON.stringify([...prevRecords, record])
            );
          } catch {}
        }
        return { ...p, score: newScore };
      })
    );
  };

  const handleCardDirectTap = (playerId: number) => {
    if (!directScoreTapEnabled || winner !== null || editingPlayerId === playerId) return;
    setLastTappedPlayerId(playerId);
    modifyScore(playerId, 1);
    setTimeout(() => setLastTappedPlayerId(null), 200);
  };

  const rotateMano = () => {
    sound.playClick();
    triggerHaptic(25);
    setManoPlayerId((prev) => {
      const idx = players.findIndex((p) => p.id === prev);
      const nextIdx = (idx + 1) % players.length;
      return players[nextIdx].id;
    });
  };

  const undo = () => {
    if (history.length === 0) return;
    sound.playRemove();
    triggerHaptic(25);

    const previousState = history[history.length - 1];
    setPlayers(previousState);
    setHistory((h) => h.slice(0, -1));
    setHistoryEntries((entries) => entries.slice(0, -1));
    setWinner(null);
  };

  const resetGame = (newTarget?: number) => {
    sound.playClick();
    triggerHaptic(30);
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
    setWinner(null);
    setHistory([]);
    setHistoryEntries([]);
    if (newTarget) {
      setTarget(newTarget);
    }
  };

  const updateName = (id: number, newName: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName || `Equipo ${id}` } : p))
    );
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.isMuted = !nextVal;
    if (nextVal) sound.playClick();
    try {
      localStorage.setItem('anotatruco_sound', String(nextVal));
    } catch {}
  };

  const toggleVibration = () => {
    const nextVal = !vibrationEnabled;
    setVibrationEnabled(nextVal);
    if (nextVal) triggerHaptic(25);
    try {
      localStorage.setItem('anotatruco_vib', String(nextVal));
    } catch {}
  };

  const toggleFaceToFace = () => {
    const nextVal = !faceToFaceEnabled;
    setFaceToFaceEnabled(nextVal);
    sound.playClick();
    try {
      localStorage.setItem('anotatruco_f2f', String(nextVal));
    } catch {}
  };

  const toggleDirectScoreTap = () => {
    const nextVal = !directScoreTapEnabled;
    setDirectScoreTapEnabled(nextVal);
    sound.playClick();
    try {
      localStorage.setItem('anotatruco_direct_tap', String(nextVal));
    } catch {}
  };

  const handleSetCounterStyle = (style: CounterStyle) => {
    setCounterStyle(style);
    sound.playClick();
    try {
      localStorage.setItem('anotatruco_style', style);
    } catch {}
  };

  const handleSetTableTheme = (theme: TableTheme) => {
    setTableTheme(theme);
    sound.playClick();
    try {
      localStorage.setItem('anotatruco_theme', theme);
    } catch {}
  };

  const shareMatchResult = () => {
    sound.playClick();
    const winnerPlayer = players.find((p) => p.name === winner) || players[0];
    const rivals = players.filter((p) => p.name !== winner);
    const scoreDetails = rivals.map((r) => `${r.name}: ${r.score} pts`).join(' | ');

    const text =
      `🧉 ¡PARTIDO DE TRUCO TERMINADO! 🧉\n` +
      `🏆 Ganador: ${winnerPlayer.name} (${winnerPlayer.score}/${target} pts)\n` +
      `🥈 ${scoreDetails}\n` +
      `🔥 Anotado con AnotaTruco Criollo`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Resultado AnotaTruco',
          text,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('¡Resultado copiado al portapapeles para enviar por WhatsApp!');
    }
  };

  const handleLoadTournamentTeams = (teamA: string, teamB: string) => {
    setPlayers([
      { id: 1, name: teamA, score: 0 },
      { id: 2, name: teamB, score: 0 },
    ]);
    setNumPlayers(2);
    setManoPlayerId(1);
    setWinner(null);
    setHistory([]);
    setHistoryEntries([]);
    sound.playClick();
  };

  const hasProgress = players.some((p) => p.score > 0);

  return (
    <>
      {/* =========================================================
          PANTALLA DE BIENVENIDA / CARGA (SPLASH SCREEN)
          ========================================================= */}
      {showSplash && (
        <SplashScreen
          onStart={(reset) => {
            if (reset) {
              resetGame();
            }
            setShowSplash(false);
          }}
          savedMatchInfo={{
            players,
            target,
            hasProgress,
          }}
        />
      )}

      {/* CONTENEDOR PRINCIPAL: 100dvh exacto sin scroll exterior */}
      <div className="flex flex-col h-[100dvh] max-h-[100dvh] w-full max-w-5xl mx-auto p-1.5 sm:p-3 text-stone-100 select-none overflow-hidden justify-between">
        {/* =========================================================
            BARRA SUPERIOR LIMPIA CON MENÚ DE HAMBURGUESA
            ========================================================= */}
        <header className="flex items-center justify-between gap-1.5 pb-1 border-b border-stone-800/80 flex-shrink-0">
          {/* Logo & Título (Click para volver al inicio) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowSplash(true);
              }}
              title="Volver a la portada de inicio"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner pop-btn transition-all flex-shrink-0"
            >
              <FontAwesomeIcon icon={faHouse} className="text-xs sm:text-sm" />
            </button>

            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-sm sm:text-lg font-black font-truco tracking-wide text-amber-200 drop-shadow leading-tight">
                  ANOTA TRUCO
                </h1>
                <span className="hidden xs:inline text-[8px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-700/50 px-1 rounded">
                  CRIOLLO
                </span>
              </div>
            </div>
          </div>

          {/* Acciones principales limpias (Mano + Sonido + Menú Hamburguesa) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mano Indicator Button */}
            <button
              onClick={rotateMano}
              title="Girar quién es Mano"
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 pop-btn"
            >
              <FontAwesomeIcon icon={faHandPointRight} className="text-amber-400 text-xs" />
              <span className="hidden xs:inline">Mano:</span>
              <span className="text-yellow-300 underline font-black max-w-[65px] sm:max-w-[85px] truncate">
                {players.find((p) => p.id === manoPlayerId)?.name}
              </span>
            </button>

            {/* Toggle Rápido de Sonido */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar' : 'Activar sonidos'}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-xl flex items-center justify-center pop-btn transition-colors text-stone-300"
            >
              <FontAwesomeIcon
                icon={soundEnabled ? faVolumeHigh : faVolumeXmark}
                className={soundEnabled ? 'text-amber-400 text-xs' : 'text-stone-500 text-xs'}
              />
            </button>

            {/* BOTÓN MENÚ DE HAMBURGUESA */}
            <button
              onClick={() => {
                sound.playClick();
                setIsNavDrawerOpen(true);
              }}
              title="Abrir Menú y Herramientas Criollas"
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 text-stone-950 rounded-xl font-bold flex items-center gap-1.5 shadow-md border border-amber-300/60 pop-btn"
            >
              <FontAwesomeIcon icon={faBars} className="text-xs" />
              <span className="text-xs font-black uppercase tracking-wider hidden xs:inline">Menú</span>
              {historyEntries.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-stone-950 text-amber-300 text-[9px] font-mono font-black flex items-center justify-center">
                  {historyEntries.length > 9 ? '9+' : historyEntries.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* =========================================================
            BARRA DE AJUSTE RÁPIDO DE PARTIDA (Jugadores / Puntos)
            ========================================================= */}
        <div className="bg-stone-950/80 rounded-xl p-1.5 my-1 sm:my-1.5 border border-stone-800/90 shadow-sm flex items-center justify-between gap-1 text-[11px] sm:text-xs flex-shrink-0">
          {/* Selector de Modo */}
          <div className="flex items-center bg-stone-900 p-0.5 rounded-lg border border-stone-800">
            <button
              onClick={() => handlePlayerMode(2)}
              className={`px-2 py-1 rounded font-bold flex items-center gap-1 transition-all pop-btn ${
                numPlayers === 2
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
              <span>2 Eq</span>
            </button>
            <button
              onClick={() => handlePlayerMode(3)}
              className={`px-2 py-1 rounded font-bold flex items-center gap-1 transition-all pop-btn ${
                numPlayers === 3
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="text-[10px]" />
              <span>Trío</span>
            </button>
          </div>

          {/* Selector de Puntos Objetivo */}
          <div className="flex items-center gap-1">
            {[15, 18, 24, 30].map((pts) => (
              <button
                key={pts}
                onClick={() => setTargetPoints(pts)}
                className={`min-w-[28px] h-7 px-1 rounded-lg font-mono font-bold transition-all pop-btn border text-[11px] ${
                  target === pts
                    ? 'bg-amber-500 border-amber-300 text-stone-950 shadow'
                    : 'bg-stone-900 border-stone-800 text-stone-300'
                }`}
              >
                {pts}
              </button>
            ))}
          </div>

          {/* Acciones de Control: Deshacer y Reiniciar */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={history.length === 0}
              title="Deshacer jugada"
              className="px-2 py-1 bg-stone-900 hover:bg-stone-800 disabled:opacity-30 rounded-lg text-amber-200 border border-stone-700 flex items-center gap-1 pop-btn font-semibold text-[11px]"
            >
              <FontAwesomeIcon icon={faArrowRotateLeft} className="text-[10px]" />
              <span className="hidden xs:inline">Deshacer</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Reiniciar a 0 pts?')) {
                  resetGame();
                }
              }}
              title="Reiniciar partida"
              className="px-2 py-1 bg-red-950/60 hover:bg-red-900 text-red-200 rounded-lg border border-red-800/60 pop-btn font-semibold text-[11px]"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* =========================================================
            BANNER DE GANADOR CON BOTÓN COMPARTIR
            ========================================================= */}
        {winner && (
          <div className="my-1 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-yellow-200 shadow-xl text-stone-950 text-center animate-fade-in flex items-center justify-between gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-2 text-left truncate">
              <FontAwesomeIcon icon={faTrophy} className="text-xl text-stone-950 flex-shrink-0" />
              <div className="truncate">
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block leading-none">
                  ¡¡GANÓ EL PARTIDO!!
                </span>
                <h2 className="text-xs sm:text-base font-black font-truco uppercase leading-tight truncate">
                  {winner}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={shareMatchResult}
                className="px-2 sm:px-3 py-1.5 bg-yellow-950 hover:bg-stone-950 text-amber-300 font-bold rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider pop-btn flex items-center gap-1 border border-yellow-700/50"
              >
                <FontAwesomeIcon icon={faShareNodes} className="text-[10px]" />
                <span className="hidden xs:inline">Compartir</span>
              </button>
              <button
                onClick={() => resetGame()}
                className="px-2.5 sm:px-3 py-1.5 bg-stone-950 hover:bg-stone-900 text-amber-300 font-bold rounded-lg text-[10px] sm:text-[11px] uppercase tracking-wider pop-btn flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
                <span>Revancha</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            MESA DE JUEGO RESPONSIVE (6 TEMAS + TÁCTIL DIRECTO)
            ========================================================= */}
        <main
          className={`theme-${tableTheme} rounded-2xl p-1.5 sm:p-2.5 flex-1 min-h-0 flex gap-1.5 sm:gap-2.5 relative overflow-hidden transition-all`}
        >
          {players.map((player, pIdx) => {
            const isMano = player.id === manoPlayerId;
            const isInverted = faceToFaceEnabled && numPlayers === 2 && pIdx === 1;
            const isTapped = lastTappedPlayerId === player.id;

            return (
              <div
                key={player.id}
                onClick={() => handleCardDirectTap(player.id)}
                className={`player-card score-tap-area rounded-xl p-1.5 sm:p-2 flex-1 min-h-0 flex flex-col justify-between relative overflow-hidden transition-all ${
                  isMano ? 'is-mano' : ''
                } ${isInverted ? 'face-to-face-inverted' : ''}`}
              >
                {/* Header de la Tarjeta (Nombre + Badge de Mano) */}
                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    {/* Mano Badge */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setManoPlayerId(player.id);
                        sound.playClick();
                        triggerHaptic(20);
                      }}
                      title={isMano ? 'Es Mano' : 'Hacer Mano'}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                        isMano
                          ? 'mano-coin text-stone-950 font-black'
                          : 'bg-black/40 text-stone-500 border border-white/5'
                      }`}
                    >
                      <FontAwesomeIcon icon={faHandPointRight} className="text-[8px]" />
                      <span>{isMano ? 'MANO' : 'Pie'}</span>
                    </button>

                    {/* Botón para editar nombre */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlayerId(editingPlayerId === player.id ? null : player.id);
                      }}
                      className="text-stone-400 hover:text-amber-300 text-[11px] p-0.5"
                      title="Editar nombre"
                    >
                      <FontAwesomeIcon
                        icon={editingPlayerId === player.id ? faCheck : faPenToSquare}
                      />
                    </button>
                  </div>

                  {/* Input / Nombre de Equipo */}
                  {editingPlayerId === player.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={player.name}
                      onChange={(e) => updateName(player.id, e.target.value)}
                      onBlur={() => setEditingPlayerId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingPlayerId(null)}
                      className="w-full bg-stone-900/90 text-center font-truco font-bold text-xs sm:text-sm text-amber-200 border border-amber-500 rounded py-0.5 px-1 mb-0.5 outline-none"
                    />
                  ) : (
                    <h2
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlayerId(player.id);
                      }}
                      className="text-center font-truco font-black text-xs sm:text-base text-amber-100 hover:text-yellow-300 cursor-pointer transition-colors truncate px-0.5"
                    >
                      {player.name}
                    </h2>
                  )}

                  {/* Contador Numérico Principal (Táctil) */}
                  <div
                    className={`text-center my-0.5 cursor-pointer select-none transition-transform ${
                      isTapped ? 'score-pulse' : ''
                    }`}
                  >
                    <div className="font-mono-score font-black text-3xl sm:text-4xl text-amber-100 drop-shadow leading-none tracking-tight">
                      {player.score}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-300/60 mt-0.5">
                      {player.score >= target ? '¡GANÓ!' : `Faltan ${target - player.score}`}
                    </div>
                  </div>
                </div>

                {/* Tablero de Fósforos / Tiza / Porotos / Patacones */}
                <div className="flex-1 min-h-0 my-1 flex flex-col overflow-hidden">
                  <MatchBoard
                    score={player.score}
                    target={target}
                    counterStyle={counterStyle}
                  />
                </div>

                {/* Botonera Táctil (+1, -1, Cantos Rápidos) */}
                <div
                  className="space-y-1 pt-1 border-t border-white/10 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Botón de Cantos Rápidos */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      setCantoModalTargetPlayer(player);
                    }}
                    disabled={winner !== null}
                    className="w-full py-1 bg-stone-900/90 hover:bg-stone-800 border border-amber-700/50 text-amber-200 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 pop-btn disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faFire} className="text-amber-400 text-[10px]" />
                    <span>Cantos</span>
                  </button>

                  {/* Botones rápidos -1 / +1 */}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        modifyScore(player.id, -1);
                      }}
                      disabled={player.score <= 0 || winner !== null}
                      className="pop-btn flex-1 py-1.5 sm:py-2 bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-800/60 font-mono font-black text-base sm:text-lg rounded-lg shadow-md disabled:opacity-25 flex items-center justify-center gap-1"
                      title="Restar 1 punto"
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                      <span>1</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        modifyScore(player.id, 1);
                      }}
                      disabled={player.score >= target || winner !== null}
                      className="pop-btn flex-[2] py-1.5 sm:py-2 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-mono font-black text-lg sm:text-xl rounded-lg shadow-md border border-amber-300/60 disabled:opacity-25 flex items-center justify-center gap-1"
                      title="Sumar 1 punto"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                      <span>1</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </main>

        {/* =========================================================
            DRAWER MENÚ DE HAMBURGUESA & MODALES AUXILIARES
            ========================================================= */}
        <NavDrawer
          isOpen={isNavDrawerOpen}
          onClose={() => setIsNavDrawerOpen(false)}
          onOpenRoulette={() => setIsRouletteOpen(true)}
          onOpenTournament={() => setIsTournamentOpen(true)}
          onOpenSoundboard={() => setIsSoundboardOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          faceToFaceEnabled={faceToFaceEnabled}
          onToggleFaceToFace={toggleFaceToFace}
          directScoreTapEnabled={directScoreTapEnabled}
          onToggleDirectScoreTap={toggleDirectScoreTap}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          vibrationEnabled={vibrationEnabled}
          onToggleVibration={toggleVibration}
          onResetGame={resetGame}
          historyCount={historyEntries.length}
        />

        <CardsGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        <MatchHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          entries={historyEntries}
          onUndoLast={undo}
          onClearHistory={() => setHistoryEntries([])}
        />

        <CriolloRouletteModal
          isOpen={isRouletteOpen}
          onClose={() => setIsRouletteOpen(false)}
          defaultParticipants={players.map((p) => p.name)}
        />

        <TournamentModal
          isOpen={isTournamentOpen}
          onClose={() => setIsTournamentOpen(false)}
          onSendToBoard={handleLoadTournamentTeams}
        />

        <SoundboardModal
          isOpen={isSoundboardOpen}
          onClose={() => setIsSoundboardOpen(false)}
        />

        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
        />

        {cantoModalTargetPlayer && (
          <QuickCantoModal
            isOpen={true}
            onClose={() => setCantoModalTargetPlayer(null)}
            playerName={cantoModalTargetPlayer.name}
            currentScore={cantoModalTargetPlayer.score}
            rivalScore={
              players.find((p) => p.id !== cantoModalTargetPlayer.id)?.score || 0
            }
            target={target}
            onSelectCanto={(delta, reason) => {
              modifyScore(cantoModalTargetPlayer.id, delta, reason);
            }}
          />
        )}

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          counterStyle={counterStyle}
          onChangeCounterStyle={handleSetCounterStyle}
          tableTheme={tableTheme}
          onChangeTableTheme={handleSetTableTheme}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          vibrationEnabled={vibrationEnabled}
          onToggleVibration={toggleVibration}
          faceToFaceEnabled={faceToFaceEnabled}
          onToggleFaceToFace={toggleFaceToFace}
          directScoreTapEnabled={directScoreTapEnabled}
          onToggleDirectScoreTap={toggleDirectScoreTap}
        />

        {/* Footer */}
        <footer className="text-center text-[9px] text-stone-500 font-medium tracking-wider flex-shrink-0 pt-0.5">
          ANOTA TRUCO CRIOLLO • CELULAR
        </footer>
      </div>
    </>
  );
}
