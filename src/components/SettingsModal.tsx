import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faSliders,
  faVolumeHigh,
  faVolumeXmark,
  faMobileScreenButton,
  faFire,
  faPencil,
  faCircleDot,
  faCoins,
  faArrowsRotate,
  faHandPointer,
  faMoon,
  faFlag,
  faFireBurner
} from '@fortawesome/free-solid-svg-icons';
import type { CounterStyle } from './MatchGroup';

export type TableTheme = 'pano' | 'madera' | 'pizarra' | 'albiceleste' | 'asado' | 'amoled';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterStyle: CounterStyle;
  onChangeCounterStyle: (style: CounterStyle) => void;
  tableTheme: TableTheme;
  onChangeTableTheme: (theme: TableTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  faceToFaceEnabled: boolean;
  onToggleFaceToFace: () => void;
  directScoreTapEnabled: boolean;
  onToggleDirectScoreTap: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  counterStyle,
  onChangeCounterStyle,
  tableTheme,
  onChangeTableTheme,
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  faceToFaceEnabled,
  onToggleFaceToFace,
  directScoreTapEnabled,
  onToggleDirectScoreTap,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-md max-h-[90vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FontAwesomeIcon icon={faSliders} />
            </div>
            <div>
              <h2 className="font-truco font-bold text-lg text-amber-200">
                Ajustes del Anotador
              </h2>
              <p className="text-xs text-amber-400/60">Personalizá tu mesa de truco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {/* Estilo de Marcador (4 opciones) */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Tipo de Anotador
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onChangeCounterStyle('fosforos')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                  counterStyle === 'fosforos'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md scale-[1.02]'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <FontAwesomeIcon icon={faFire} className="text-amber-400 text-base" />
                <span className="text-xs font-bold">Fósforos</span>
              </button>

              <button
                onClick={() => onChangeCounterStyle('tiza')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                  counterStyle === 'tiza'
                    ? 'bg-stone-800 border-stone-300 text-stone-100 shadow-md scale-[1.02]'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <FontAwesomeIcon icon={faPencil} className="text-stone-300 text-base" />
                <span className="text-xs font-bold">Tiza</span>
              </button>

              <button
                onClick={() => onChangeCounterStyle('porotos')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                  counterStyle === 'porotos'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md scale-[1.02]'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <FontAwesomeIcon icon={faCircleDot} className="text-amber-300 text-base" />
                <span className="text-xs font-bold">Porotos</span>
              </button>

              <button
                onClick={() => onChangeCounterStyle('patacones')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                  counterStyle === 'patacones'
                    ? 'bg-yellow-950/70 border-yellow-400 text-yellow-200 shadow-md scale-[1.02]'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-base" />
                <span className="text-xs font-bold">Patacones</span>
              </button>
            </div>
          </div>

          {/* Tema del Paño / Mesa (6 opciones) */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Mesa de Juego
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChangeTableTheme('pano')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  tableTheme === 'pano'
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 border border-emerald-500 shadow-inner" />
                <span className="text-[10px] font-bold">Paño Verde</span>
              </button>

              <button
                onClick={() => onChangeTableTheme('madera')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  tableTheme === 'madera'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
                <span className="text-[10px] font-bold">Pulpería</span>
              </button>

              <button
                onClick={() => onChangeTableTheme('pizarra')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  tableTheme === 'pizarra'
                    ? 'bg-stone-800 border-stone-400 text-stone-100 shadow'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-stone-900 border border-stone-700 shadow-inner" />
                <span className="text-[10px] font-bold">Pizarra</span>
              </button>

              <button
                onClick={() => onChangeTableTheme('albiceleste')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  tableTheme === 'albiceleste'
                    ? 'bg-sky-950/70 border-sky-400 text-sky-200 shadow'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-sky-400 via-white to-sky-400 border border-yellow-400 shadow-inner" />
                <span className="text-[10px] font-bold">Albiceleste</span>
              </button>

              <button
                onClick={() => onChangeTableTheme('asado')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  tableTheme === 'asado'
                    ? 'bg-red-950/70 border-red-500 text-red-200 shadow'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-700 to-stone-900 border border-orange-500 shadow-inner" />
                <span className="text-[10px] font-bold">Asado/Brasas</span>
              </button>

              <button
                onClick={() => onChangeTableTheme('amoled')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  tableTheme === 'amoled'
                    ? 'bg-black border-stone-400 text-stone-100 shadow'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-black border border-stone-700 shadow-inner" />
                <span className="text-[10px] font-bold">AMOLED Puro</span>
              </button>
            </div>
          </div>

          {/* Opciones de Mesa e Interacción */}
          <div className="pt-2 border-t border-stone-800 space-y-3">
            {/* Modo Cara a Cara */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faArrowsRotate} className="text-amber-400 w-4" />
                <div>
                  <span className="text-xs font-semibold text-stone-200 block">Modo Cara a Cara (180°)</span>
                  <span className="text-[10px] text-stone-400 block leading-tight">
                    Invierte el lado rival para jugar con el celular en la mesa
                  </span>
                </div>
              </div>
              <button
                onClick={onToggleFaceToFace}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  faceToFaceEnabled ? 'bg-amber-600' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    faceToFaceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toque táctil directo en Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHandPointer} className="text-amber-400 w-4" />
                <div>
                  <span className="text-xs font-semibold text-stone-200 block">Toque rápido en Marcador</span>
                  <span className="text-[10px] text-stone-400 block leading-tight">
                    Tocar el score o la tarjeta suma +1 punto directo
                  </span>
                </div>
              </div>
              <button
                onClick={onToggleDirectScoreTap}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  directScoreTapEnabled ? 'bg-amber-600' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    directScoreTapEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sonidos */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeXmark} className="text-amber-400 w-4" />
                <span className="text-xs font-semibold text-stone-200">Efectos de sonido táctiles</span>
              </div>
              <button
                onClick={onToggleSound}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  soundEnabled ? 'bg-amber-600' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Vibración */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMobileScreenButton} className="text-amber-400 w-4" />
                <span className="text-xs font-semibold text-stone-200">Respuesta háptica (vibración)</span>
              </div>
              <button
                onClick={onToggleVibration}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  vibrationEnabled ? 'bg-amber-600' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-amber-900/40 bg-stone-950 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
