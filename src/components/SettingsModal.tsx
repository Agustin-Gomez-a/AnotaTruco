import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faSliders,
  faPalette,
  faVolumeHigh,
  faVolumeXmark,
  faMobileScreenButton,
  faFire,
  faPencil,
  faCircleDot
} from '@fortawesome/free-solid-svg-icons';
import type { CounterStyle } from './MatchGroup';

export type TableTheme = 'pano' | 'madera' | 'pizarra';

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
  onToggleVibration
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-md bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
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

        {/* Contenido */}
        <div className="p-4 space-y-5 text-sm">
          {/* Estilo de Marcador */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Tipo de Anotador
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChangeCounterStyle('fosforos')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                  counterStyle === 'fosforos'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md scale-[1.02]'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <FontAwesomeIcon icon={faFire} className="text-amber-400 text-lg" />
                <span className="text-xs font-bold">Fósforos</span>
              </button>

              <button
                onClick={() => onChangeCounterStyle('tiza')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                  counterStyle === 'tiza'
                    ? 'bg-stone-800 border-stone-300 text-stone-100 shadow-md scale-[1.02]'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <FontAwesomeIcon icon={faPencil} className="text-stone-300 text-lg" />
                <span className="text-xs font-bold">Tiza</span>
              </button>

              <button
                onClick={() => onChangeCounterStyle('porotos')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                  counterStyle === 'porotos'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md scale-[1.02]'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <FontAwesomeIcon icon={faCircleDot} className="text-amber-300 text-lg" />
                <span className="text-xs font-bold">Porotos</span>
              </button>
            </div>
          </div>

          {/* Tema del Paño / Mesa */}
          <div>
            <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
              Mesa de Juego
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onChangeTableTheme('pano')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  tableTheme === 'pano'
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 border border-emerald-500 shadow-inner" />
                <span className="text-[11px] font-bold">Paño Verde</span>
              </button>

              <button
                onClick={() => onChangeTableTheme('madera')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  tableTheme === 'madera'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
                <span className="text-[11px] font-bold">Pulpería</span>
              </button>

              <button
                onClick={() => onChangeTableTheme('pizarra')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  tableTheme === 'pizarra'
                    ? 'bg-stone-800 border-stone-400 text-stone-100'
                    : 'bg-stone-950/50 border-stone-800 text-stone-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-stone-900 border border-stone-700 shadow-inner" />
                <span className="text-[11px] font-bold">Pizarra</span>
              </button>
            </div>
          </div>

          {/* Preferencias de Sonido y Vibración */}
          <div className="pt-2 border-t border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeXmark} className="text-amber-400 w-4" />
                <span className="text-xs font-semibold text-stone-200">Efectos de sonido táctiles</span>
              </div>
              <button
                onClick={onToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  soundEnabled ? 'bg-amber-600' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMobileScreenButton} className="text-amber-400 w-4" />
                <span className="text-xs font-semibold text-stone-200">Respuesta háptica (vibración)</span>
              </div>
              <button
                onClick={onToggleVibration}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  vibrationEnabled ? 'bg-amber-600' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    vibrationEnabled ? 'translate-x-7' : 'translate-x-1'
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
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
