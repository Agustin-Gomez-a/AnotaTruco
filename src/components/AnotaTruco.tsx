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

    // Efecto de sonido y háptico
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

      <div className="flex flex-col h-full flex-1 min-h-[100svh] max-w-5xl mx-auto p-2 sm:p-4 text-stone-100 select-none">
        {/* =========================================================
            BARRA SUPERIOR: BRANDING & ACCIONES RÁPIDAS
            ========================================================= */}
        <header className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-800/80">
          {/* Logo & Título (Click para volver al inicio) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowSplash(true);
              }}
              title="Volver a la portada de inicio"
              className="w-9 h-9 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner pop-btn transition-all"
            >
              <FontAwesomeIcon icon={faHouse} className="text-base" />
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black font-truco tracking-wide text-amber-200 drop-shadow">
                  ANOTA TRUCO
                </h1>
                <span className="text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-700/50 px-1.5 py-0.5 rounded">
                  CRIOLLO
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 tracking-wider font-medium">
                Anotador Oficial de Fósforos y Cartas
              </p>
            </div>
          </div>

          {/* Toolbar con FontAwesome */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mano Indicator Button */}
            <button
              onClick={rotateMano}
              title="Girar quién es Mano"
              className="px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 pop-btn"
            >
              <FontAwesomeIcon icon={faHandPointRight} className="text-amber-400" />
              <span className="hidden sm:inline">Mano:</span>
              <span className="text-yellow-300 underline font-black">
                {players.find((p) => p.id === manoPlayerId)?.name.substring(0, 8)}
              </span>
            </button>

            {/* Guía de Cartas */}
            <button
              onClick={() => {
                sound.playClick();
                setIsGuideOpen(true);
              }}
              title="Ver jerarquía de cartas y reglamento"
              className="w-9 h-9 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 rounded-xl flex items-center justify-center pop-btn transition-colors"
            >
              <FontAwesomeIcon icon={faScroll} />
            </button>

            {/* Historial */}
            <button
              onClick={() => {
                sound.playClick();
                setIsHistoryOpen(true);
              }}
              title="Historial de jugadas"
              className="w-9 h-9 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-xl flex items-center justify-center relative pop-btn transition-colors"
            >
              <FontAwesomeIcon icon={faClockRotateLeft} />
              {historyEntries.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px] flex items-center justify-center font-mono shadow">
                  {historyEntries.length > 99 ? '99+' : historyEntries.length}
                </span>
              )}
            </button>

            {/* Sonido Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              className="w-9 h-9 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-xl flex items-center justify-center pop-btn transition-colors"
            >
              <FontAwesomeIcon
                icon={soundEnabled ? faVolumeHigh : faVolumeXmark}
                className={soundEnabled ? 'text-amber-400' : 'text-stone-500'}
              />
            </button>

            {/* Pantalla Completa */}
            <button
              onClick={toggleFullscreen}
              title="Pantalla completa"
              className="w-9 h-9 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-xl flex items-center justify-center pop-btn transition-colors hidden sm:flex"
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </button>

            {/* Configuración / Temas */}
            <button
              onClick={() => {
                sound.playClick();
                setIsSettingsOpen(true);
              }}
              title="Personalizar mesa y anotador"
              className="w-9 h-9 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-xl flex items-center justify-center pop-btn transition-colors"
            >
              <FontAwesomeIcon icon={faSliders} />
            </button>
          </div>
        </header>

        {/* =========================================================
            BARRA DE AJUSTE RÁPIDO DE PARTIDA (Jugadores / Puntos)
            ========================================================= */}
        <div className="bg-stone-950/80 rounded-2xl p-2.5 my-2.5 border border-stone-800 shadow-md flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Selector de Modo */}
          <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => handlePlayerMode(2)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all pop-btn ${
                numPlayers === 2
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FontAwesomeIcon icon={faUsers} />
              <span>2 Equipos</span>
            </button>
            <button
              onClick={() => handlePlayerMode(3)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all pop-btn ${
                numPlayers === 3
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Trío (3)</span>
            </button>
          </div>

          {/* Selector de Puntos Objetivo */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-amber-400/90 font-bold uppercase tracking-wider text-[10px] hidden sm:inline">
              A jugar:
            </span>
            {[15, 18, 24, 30].map((pts) => (
              <button
                key={pts}
                onClick={() => setTargetPoints(pts)}
                className={`min-w-[34px] h-8 px-2 rounded-lg font-mono font-bold transition-all pop-btn border ${
                  target === pts
                    ? 'bg-amber-500 border-amber-300 text-stone-950 shadow scale-105'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-amber-700/60'
                }`}
              >
                {pts}
              </button>
            ))}
            {/* Custom points input */}
            <div className="flex items-center bg-stone-900 rounded-lg border border-stone-800 px-2 h-8">
              <input
                type="number"
                placeholder="Otro"
                value={customTarget}
                onChange={handleCustomTarget}
                className="w-11 bg-transparent text-center font-mono font-bold text-amber-200 outline-none placeholder:text-stone-600 text-xs"
              />
            </div>
          </div>

          {/* Acciones de Control: Deshacer y Reiniciar */}
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-stone-900 rounded-xl text-amber-200 border border-stone-700 flex items-center gap-1.5 pop-btn font-semibold"
            >
              <FontAwesomeIcon icon={faArrowRotateLeft} />
              <span>Deshacer</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Reiniciar la partida a 0 puntos?')) {
                  resetGame();
                }
              }}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 rounded-xl border border-red-800/60 pop-btn font-semibold flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            BANNER DE GANADOR (TRIUNFO CRIOLLO)
            ========================================================= */}
        {winner && (
          <div className="my-2.5 p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-yellow-200 shadow-2xl text-stone-950 text-center animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 text-yellow-400 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-stone-900 block">
                  ¡¡CANTA RETRUCO Y FESTEJA!!
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-truco uppercase tracking-tight">
                  {winner} HA GANADO EL PARTIDO
                </h2>
              </div>
            </div>
            <button
              onClick={() => resetGame()}
              className="px-6 py-2.5 bg-stone-950 hover:bg-stone-900 text-amber-300 font-bold rounded-xl border border-amber-400/40 shadow-lg text-xs uppercase tracking-widest pop-btn flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faRotate} />
              Revancha Criolla
            </button>
          </div>
        )}

        {/* =========================================================
            MESA DE JUEGO (PAÑO / MADERA / PIZARRA)
            ========================================================= */}
        <main
          className={`theme-${tableTheme} rounded-3xl p-2.5 sm:p-4 flex-1 flex gap-2.5 sm:gap-4 relative overflow-hidden transition-all`}
        >
          {players.map((player) => {
            const isMano = player.id === manoPlayerId;

            return (
              <div
                key={player.id}
                className={`player-card rounded-2xl p-2.5 sm:p-3 flex-1 flex flex-col justify-between relative ${
                  isMano ? 'is-mano' : ''
                }`}
              >
                {/* Header de la Tarjeta (Nombre + Badge de Mano) */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {/* Mano Badge */}
                    <button
                      onClick={() => {
                        setManoPlayerId(player.id);
                        sound.playClick();
                        triggerHaptic(20);
                      }}
                      title={isMano ? 'Este equipo es Mano' : 'Hacer Mano a este equipo'}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                        isMano
                          ? 'mano-coin text-stone-950 font-black'
                          : 'bg-black/40 text-stone-500 hover:text-stone-300 border border-white/5'
                      }`}
                    >
                      <FontAwesomeIcon icon={faHandPointRight} className="text-[9px]" />
                      <span>{isMano ? 'ES MANO' : 'Pie'}</span>
                    </button>

                    {/* Botón para editar nombre */}
                    <button
                      onClick={() =>
                        setEditingPlayerId(editingPlayerId === player.id ? null : player.id)
                      }
                      className="text-stone-400 hover:text-amber-300 text-xs p-1"
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
                      className="w-full bg-stone-900/90 text-center font-truco font-bold text-base sm:text-lg text-amber-200 border border-amber-500 rounded-lg py-1 px-2 mb-1 outline-none shadow-inner"
                    />
                  ) : (
                    <h2
                      onClick={() => setEditingPlayerId(player.id)}
                      className="text-center font-truco font-black text-base sm:text-xl text-amber-100 hover:text-yellow-300 cursor-pointer transition-colors truncate px-1"
                    >
                      {player.name}
                    </h2>
                  )}

                  {/* Contador Numérico Principal */}
                  <div className="text-center my-1">
                    <div className="font-mono-score font-black text-4xl sm:text-5xl text-amber-100 drop-shadow-md leading-none tracking-tight">
                      {player.score}
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono font-bold text-amber-300/60 mt-0.5">
                      {player.score >= target ? '¡GANÓ!' : `Faltan ${target - player.score} pts`}
                    </div>
                  </div>
                </div>

                {/* Tablero de Fósforos / Tiza / Porotos */}
                <div className="flex-1 my-2 flex flex-col min-h-[140px]">
                  <MatchBoard
                    score={player.score}
                    target={target}
                    counterStyle={counterStyle}
                  />
                </div>

                {/* Botonera Táctil (+1, -1, Cantos Rápidos) */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  {/* Botón de Cantos Rápidos (+2 Envido, +3 Truco, Falta Envido, etc.) */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCantoModalTargetPlayer(player);
                    }}
                    disabled={winner !== null}
                    className="w-full py-1.5 bg-stone-900/90 hover:bg-stone-800 border border-amber-700/50 hover:border-amber-500 text-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 pop-btn transition-colors disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faFire} className="text-amber-400 text-xs" />
                    <span>Cantos Rápidos</span>
                  </button>

                  {/* Botones rápidos -1 / +1 */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => modifyScore(player.id, -1)}
                      disabled={player.score <= 0 || winner !== null}
                      className="pop-btn flex-1 py-2.5 bg-red-950/70 hover:bg-red-900 active:bg-red-800 text-red-200 border border-red-800/60 font-mono font-black text-lg rounded-xl shadow-md disabled:opacity-25 flex items-center justify-center gap-1"
                      title="Restar 1 punto"
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-xs" />
                      <span>1</span>
                    </button>

                    <button
                      onClick={() => modifyScore(player.id, 1)}
                      disabled={player.score >= target || winner !== null}
                      className="pop-btn flex-[2] py-2.5 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-mono font-black text-xl rounded-xl shadow-lg border border-amber-300/60 disabled:opacity-25 flex items-center justify-center gap-1.5"
                      title="Sumar 1 punto"
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-xs" />
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
        {/* Guía de Cartas y Reglamento */}
        <CardsGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        {/* Historial de Partida */}
        <MatchHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          entries={historyEntries}
          onUndoLast={undo}
          onClearHistory={() => setHistoryEntries([])}
        />

        {/* Cantos Rápidos */}
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

        {/* Ajustes y Temas */}
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

        {/* Footer */}
        <footer className="text-center py-2 text-[10px] text-stone-500 font-medium tracking-wider">
          ANOTA TRUCO CRIOLLO • HECHO PARA COMPARTIR ENTRE AMIGOS Y FAMILIA
        </footer>
      </div>
    </>
  );
}
