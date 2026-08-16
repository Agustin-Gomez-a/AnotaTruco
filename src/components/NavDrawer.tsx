import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faTrophy,
  faBullhorn,
  faChartSimple,
  faClockRotateLeft,
  faScroll,
  faSliders,
  faArrowsRotate,
  faHandPointer,
  faVolumeHigh,
  faVolumeXmark,
  faVolumeLow,
  faMusic,
  faMobileScreenButton,
  faRotateLeft,
  faCrown,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { sound } from '../utils/sound';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoulette: () => void;
  onOpenTournament: () => void;
  onOpenSoundboard: () => void;
  onOpenStats: () => void;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onOpenSenas: () => void;
  onOpenTrucoGuide: () => void;
  faceToFaceEnabled: boolean;
  onToggleFaceToFace: () => void;
  directScoreTapEnabled: boolean;
  onToggleDirectScoreTap: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  musicEnabled: boolean;
  musicVolume: number;
  onToggleMusic: () => void;
  onChangeMusicVolume: (vol: number) => void;
  onResetGame: () => void;
  historyCount: number;
}

export default function NavDrawer({
  isOpen,
  onClose,
  onOpenRoulette,
  onOpenTournament,
  onOpenSoundboard,
  onOpenStats,
  onOpenHistory,
  onOpenGuide,
  onOpenSettings,
  onOpenSenas,
  onOpenTrucoGuide,
  faceToFaceEnabled,
  onToggleFaceToFace,
  directScoreTapEnabled,
  onToggleDirectScoreTap,
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  musicEnabled,
  musicVolume,
  onToggleMusic,
  onChangeMusicVolume,
  onResetGame,
  historyCount
}: NavDrawerProps) {
  if (!isOpen) return null;

  const handleAction = (cb: () => void) => {
    sound.playClick();
    cb();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-xs sm:max-w-sm h-full bg-[#0d130e] border-l border-amber-800/50 shadow-2xl flex flex-col justify-between text-amber-100 z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Drawer */}
        <div className="p-4 border-b border-amber-900/40 bg-stone-950/90 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600/30 to-yellow-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <FontAwesomeIcon icon={faCrown} className="text-sm" />
            </div>
            <div>
              <h2 className="font-truco font-bold text-base text-amber-200 leading-tight">
                Menú AnotaTruco
              </h2>
              <span className="text-[10px] text-amber-400/60 font-mono">
                Herramientas Criollas
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            title="Cerrar menú"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Contenido scrolleable de opciones */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
          {/* SECCIÓN 1: Herramientas de Juego */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 block mb-1.5 px-1">
              Herramientas de Juego
            </span>
            <div className="space-y-1">
              {/* Ruleta Criolla */}
              <button
                onClick={() => handleAction(onOpenRoulette)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-emerald-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🧉</span>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-amber-200">
                      Ruleta & Sorteo Criollo
                    </div>
                    <div className="text-[10px] text-stone-400">
                      ¿Quién ceba el mate? / ¿Quién paga el asado?
                    </div>
                  </div>
                </div>
              </button>

              {/* Fixture de Torneo */}
              <button
                onClick={() => handleAction(onOpenTournament)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-amber-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <FontAwesomeIcon icon={faTrophy} className="text-[11px]" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-amber-200">
                      Fixture de Torneo
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Llaves para 4 u 8 parejas
                    </div>
                  </div>
                </div>
              </button>

              {/* Soundboard Gauchesco */}
              <button
                onClick={() => handleAction(onOpenSoundboard)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-red-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400">
                    <FontAwesomeIcon icon={faBullhorn} className="text-[11px]" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-amber-200">
                      Soundboard & Coplas
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Voces argentinas y versos de Envido
                    </div>
                  </div>
                </div>
              </button>

              {/* Reglamento y Jerarquía */}
              <button
                onClick={() => handleAction(onOpenGuide)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-amber-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                    <FontAwesomeIcon icon={faScroll} className="text-[11px]" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-amber-200">
                      Reglamento & Jerarquía
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Valores oficiales de cartas y envido
                    </div>
                  </div>
                </div>
              </button>

              {/* Señas del Truco */}
              <button
                onClick={() => handleAction(onOpenSenas)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-emerald-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-lg">
                    👁️
                  </div>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-emerald-300">
                      Señas del Truco
                    </div>
                    <div className="text-[10px] text-stone-400">
                      El código secreto de la mesa criolla
                    </div>
                  </div>
                </div>
              </button>

              {/* Guía para Aprender */}
              <button
                onClick={() => handleAction(onOpenTrucoGuide)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-amber-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg">
                    📖
                  </div>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-amber-300">
                      Cómo Jugar al Truco
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Guía completa para principiantes
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* SECCIÓN 2: Métricas & Historial */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 block mb-1.5 px-1">
              Registro & Partidas
            </span>
            <div className="space-y-1">
              {/* Historial de la Partida */}
              <button
                onClick={() => handleAction(onOpenHistory)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-amber-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300">
                    <FontAwesomeIcon icon={faClockRotateLeft} className="text-[11px]" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-amber-200">
                      Historial de Jugadas
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Registro ronda por ronda
                    </div>
                  </div>
                </div>
                {historyCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] font-mono">
                    {historyCount}
                  </span>
                )}
              </button>

              {/* Estadísticas Head to Head */}
              <button
                onClick={() => handleAction(onOpenStats)}
                className="w-full p-2.5 bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-sky-700/60 rounded-xl text-left transition-all flex items-center justify-between group pop-btn"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                    <FontAwesomeIcon icon={faChartSimple} className="text-[11px]" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-100 group-hover:text-amber-200">
                      Estadísticas & Récords
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Partidos ganados y efectividad
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* SECCIÓN 3: Modos y Ajustes Rápidos */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 block mb-1.5 px-1">
              Modos de Mesa
            </span>
            <div className="bg-stone-950/80 rounded-xl border border-stone-800 p-2.5 space-y-2.5">
              {/* Modo Cara a Cara */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowsRotate} className="text-amber-400 text-xs w-4" />
                  <div>
                    <span className="font-semibold text-stone-200 block text-xs">Modo Cara a Cara (180°)</span>
                    <span className="text-[9px] text-stone-400">Rival invertido para mesa</span>
                  </div>
                </div>
                <button
                  onClick={onToggleFaceToFace}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    faceToFaceEnabled ? 'bg-amber-600' : 'bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      faceToFaceEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Toque Rápido */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faHandPointer} className="text-amber-400 text-xs w-4" />
                  <div>
                    <span className="font-semibold text-stone-200 block text-xs">Toque en Marcador</span>
                    <span className="text-[9px] text-stone-400">Tocar suma +1 punto</span>
                  </div>
                </div>
                <button
                  onClick={onToggleDirectScoreTap}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    directScoreTapEnabled ? 'bg-amber-600' : 'bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      directScoreTapEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Sonidos */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeXmark} className="text-amber-400 text-xs w-4" />
                  <span className="font-semibold text-stone-200 text-xs">Efectos & Voces</span>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    soundEnabled ? 'bg-amber-600' : 'bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Vibración */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMobileScreenButton} className="text-amber-400 text-xs w-4" />
                  <span className="font-semibold text-stone-200 text-xs">Vibración</span>
                </div>
                <button
                  onClick={onToggleVibration}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                    vibrationEnabled ? 'bg-amber-600' : 'bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      vibrationEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Música de Fondo */}
              <div className="border-t border-stone-800/60 pt-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faMusic}
                      className={`text-xs w-4 ${musicEnabled ? 'text-emerald-400' : 'text-stone-500'}`}
                    />
                    <div>
                      <span className="font-semibold text-stone-200 block text-xs">Música de Fondo</span>
                      <span className="text-[9px] text-stone-400">Quiero Retruco (en bucle)</span>
                    </div>
                  </div>
                  <button
                    id="drawer-music-toggle"
                    onClick={onToggleMusic}
                    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                      musicEnabled ? 'bg-emerald-600' : 'bg-stone-800'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        musicEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {/* Slider de volumen de música */}
                <div className={`flex items-center gap-2 transition-opacity duration-200 ${musicEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <FontAwesomeIcon
                    icon={musicVolume < 0.4 ? faVolumeLow : faVolumeHigh}
                    className="text-[10px] text-amber-400/70 w-3"
                  />
                  <input
                    id="drawer-music-volume"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={musicVolume}
                    onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 ${musicVolume * 100}%, #292524 ${musicVolume * 100}%)`
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faVolumeHigh}
                    className="text-[10px] text-amber-400/70 w-3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: Personalización Completa */}
          <div>
            <button
              onClick={() => handleAction(onOpenSettings)}
              className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 pop-btn"
            >
              <FontAwesomeIcon icon={faSliders} className="text-amber-400" />
              <span>Temas de Mesa & Estilos de Fichas</span>
            </button>
          </div>
        </div>

        {/* Footer del Drawer */}
        <div className="p-3 border-t border-amber-900/40 bg-stone-950 flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => {
              if (window.confirm('¿Reiniciar la partida actual a 0?')) {
                onResetGame();
                onClose();
              }
            }}
            className="w-full py-2 bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 pop-btn"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
            <span>Reiniciar Partida</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
            <span>AnotaTruco Criollo v1.2</span>
            <a href="/privacy.html" className="text-stone-400 hover:text-amber-300 underline">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
