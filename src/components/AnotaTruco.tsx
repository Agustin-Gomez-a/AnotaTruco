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
  faExpand,
  faCompress,
  faUsers,
  faUser,
  faPlus,
  faMinus,
  faHandPointRight,
  faFire,
  faPenToSquare,
  faCheck,
  faRotate,
  faHouse
} from '@fortawesome/free-solid-svg-icons';

import MatchBoard from './MatchBoard';
import type { CounterStyle } from './MatchGroup';
import CardsGuideModal from './CardsGuideModal';
import MatchHistoryModal, { type HistoryEntry } from './MatchHistoryModal';
import QuickCantoModal from './QuickCantoModal';
import SettingsModal, { type TableTheme } from './SettingsModal';
import SplashScreen from './SplashScreen';
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

  // Modals & Options
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cantoModalTargetPlayer, setCantoModalTargetPlayer] = useState<Player | null>(null);

  // User Settings
  const [counterStyle, setCounterStyle] = useState<CounterStyle>('fosforos');
  const [tableTheme, setTableTheme] = useState<TableTheme>('pano');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Edición rápida de nombres
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);

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

  const handleCustomTarget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCustomTarget(e.target.value);
    if (!isNaN(val) && val > 0) {
      setTarget(val);
      resetGame(val);
    }
  };

  const modifyScore = (id: number, delta: number, reason?: string) => {
    if (winner) return;

    const targetPlayer = players.find((p) => p.id === id);
    if (!targetPlayer) return;

    const newScore = Math.max(0, Math.min(target, targetPlayer.score + delta));
    if (newScore === targetPlayer.score) return;

    if (delta > 0) {
      sound.playMatchDrop(counterStyle === 'tiza' ? 'chalk' : 'poker');
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
        }
        return { ...p, score: newScore };
      })
    );
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

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
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
            BARRA SUPERIOR: BRANDING & ACCIONES RÁPIDAS
            ========================================================= */}
        <header className="flex items-center justify-between gap-1.5 pb-1 border-b border-stone-800/80 flex-shrink-0">
          {/* Logo & Título (Click para volver al inicio) */}
          <div className="flex items-center gap-1.5">
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
                <h1 className="text-base sm:text-xl font-black font-truco tracking-wide text-amber-200 drop-shadow leading-tight">
                  ANOTA TRUCO
                </h1>
                <span className="text-[8px] sm:text-[9px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-700/50 px-1 rounded">
                  CRIOLLO
                </span>
              </div>
            </div>
          </div>

          {/* Toolbar con FontAwesome */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Mano Indicator Button */}
            <button
              onClick={rotateMano}
              title="Girar quién es Mano"
              className="px-2 py-1 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-lg text-[11px] font-bold flex items-center gap-1 pop-btn"
            >
              <FontAwesomeIcon icon={faHandPointRight} className="text-amber-400 text-[10px]" />
              <span className="hidden xs:inline sm:inline">Mano:</span>
              <span className="text-yellow-300 underline font-black max-w-[60px] truncate">
                {players.find((p) => p.id === manoPlayerId)?.name}
              </span>
            </button>

            {/* Guía de Cartas */}
            <button
              onClick={() => {
                sound.playClick();
                setIsGuideOpen(true);
              }}
              title="Ver reglamento y jerarquía"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 rounded-lg flex items-center justify-center pop-btn transition-colors"
            >
              <FontAwesomeIcon icon={faScroll} className="text-xs" />
            </button>

            {/* Historial */}
            <button
              onClick={() => {
                sound.playClick();
                setIsHistoryOpen(true);
              }}
              title="Historial de jugadas"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-lg flex items-center justify-center relative pop-btn transition-colors"
            >
              <FontAwesomeIcon icon={faClockRotateLeft} className="text-xs" />
              {historyEntries.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[8px] flex items-center justify-center font-mono shadow">
                  {historyEntries.length > 99 ? '99+' : historyEntries.length}
                </span>
              )}
            </button>

            {/* Sonido Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar' : 'Activar sonidos'}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-lg flex items-center justify-center pop-btn transition-colors"
            >
              <FontAwesomeIcon
                icon={soundEnabled ? faVolumeHigh : faVolumeXmark}
                className={soundEnabled ? 'text-amber-400 text-xs' : 'text-stone-500 text-xs'}
              />
            </button>

            {/* Configuración / Temas */}
            <button
              onClick={() => {
                sound.playClick();
                setIsSettingsOpen(true);
              }}
              title="Ajustes"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-lg flex items-center justify-center pop-btn transition-colors"
            >
              <FontAwesomeIcon icon={faSliders} className="text-xs" />
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
            BANNER DE GANADOR (TRIUNFO CRIOLLO)
            ========================================================= */}
        {winner && (
          <div className="my-1 p-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-yellow-200 shadow-xl text-stone-950 text-center animate-fade-in flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-left">
              <FontAwesomeIcon icon={faTrophy} className="text-xl text-stone-950" />
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider block leading-none">
                  ¡¡GANÓ EL PARTIDO!!
                </span>
                <h2 className="text-sm sm:text-base font-black font-truco uppercase leading-tight truncate">
                  {winner}
                </h2>
              </div>
            </div>
            <button
              onClick={() => resetGame()}
              className="px-3 py-1.5 bg-stone-950 hover:bg-stone-900 text-amber-300 font-bold rounded-lg text-[11px] uppercase tracking-wider pop-btn flex items-center gap-1 flex-shrink-0"
            >
              <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
              Revancha
            </button>
          </div>
        )}

        {/* =========================================================
            MESA DE JUEGO (PAÑO / MADERA / PIZARRA) - FLEX-1 RESPONSIVE
            ========================================================= */}
        <main
          className={`theme-${tableTheme} rounded-2xl p-1.5 sm:p-2.5 flex-1 min-h-0 flex gap-1.5 sm:gap-2.5 relative overflow-hidden transition-all`}
        >
          {players.map((player) => {
            const isMano = player.id === manoPlayerId;

            return (
              <div
                key={player.id}
                className={`player-card rounded-xl p-1.5 sm:p-2 flex-1 min-h-0 flex flex-col justify-between relative overflow-hidden ${
                  isMano ? 'is-mano' : ''
                }`}
              >
                {/* Header de la Tarjeta (Nombre + Badge de Mano) */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    {/* Mano Badge */}
                    <button
                      onClick={() => {
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
                      onClick={() =>
                        setEditingPlayerId(editingPlayerId === player.id ? null : player.id)
                      }
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
                      onClick={() => setEditingPlayerId(player.id)}
                      className="text-center font-truco font-black text-xs sm:text-base text-amber-100 hover:text-yellow-300 cursor-pointer transition-colors truncate px-0.5"
                    >
                      {player.name}
                    </h2>
                  )}

                  {/* Contador Numérico Principal */}
                  <div className="text-center my-0.5">
                    <div className="font-mono-score font-black text-3xl sm:text-4xl text-amber-100 drop-shadow leading-none tracking-tight">
                      {player.score}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-300/60 mt-0.5">
                      {player.score >= target ? '¡GANÓ!' : `Faltan ${target - player.score}`}
                    </div>
                  </div>
                </div>

                {/* Tablero de Fósforos / Tiza / Porotos */}
                <div className="flex-1 min-h-0 my-1 flex flex-col overflow-hidden">
                  <MatchBoard
                    score={player.score}
                    target={target}
                    counterStyle={counterStyle}
                  />
                </div>

                {/* Botonera Táctil (+1, -1, Cantos Rápidos) */}
                <div className="space-y-1 pt-1 border-t border-white/10 flex-shrink-0">
                  {/* Botón de Cantos Rápidos */}
                  <button
                    onClick={() => {
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
                      onClick={() => modifyScore(player.id, -1)}
                      disabled={player.score <= 0 || winner !== null}
                      className="pop-btn flex-1 py-1.5 sm:py-2 bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-800/60 font-mono font-black text-base sm:text-lg rounded-lg shadow-md disabled:opacity-25 flex items-center justify-center gap-1"
                      title="Restar 1 punto"
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                      <span>1</span>
                    </button>

                    <button
                      onClick={() => modifyScore(player.id, 1)}
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
            MODALES AUXILIARES
            ========================================================= */}
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
        />

        {/* Footer Ultra Compacto */}
        <footer className="text-center text-[9px] text-stone-500 font-medium tracking-wider flex-shrink-0 pt-0.5">
          ANOTA TRUCO CRIOLLO • CELULAR
        </footer>
      </div>
    </>
  );
}
