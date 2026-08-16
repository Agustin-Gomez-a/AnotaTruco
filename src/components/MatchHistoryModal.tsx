import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faClockRotateLeft,
  faArrowRotateLeft,
  faTrashCan,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  playerName: string;
  delta: number;
  reason?: string;
  prevScore: number;
  newScore: number;
}

interface MatchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: HistoryEntry[];
  onUndoLast: () => void;
  onClearHistory: () => void;
}

export default function MatchHistoryModal({
  isOpen,
  onClose,
  entries,
  onUndoLast,
  onClearHistory
}: MatchHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-lg max-h-[85vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FontAwesomeIcon icon={faClockRotateLeft} />
            </div>
            <div>
              <h2 className="font-truco font-bold text-lg text-amber-200">
                Historial de la Partida
              </h2>
              <p className="text-xs text-amber-400/60">
                {entries.length} {entries.length === 1 ? 'jugada registrada' : 'jugadas registradas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            title="Cerrar"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Lista de entradas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
          {entries.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-stone-500">
              <FontAwesomeIcon icon={faCalendarDays} className="text-3xl mb-2 opacity-40" />
              <p className="font-semibold text-xs uppercase tracking-wider">Aún no hay puntos anotados</p>
              <p className="text-[11px] text-stone-600 mt-1">
                A medida que sumes o restes puntos, aparecerán aquí.
              </p>
            </div>
          ) : (
            entries
              .slice()
              .reverse()
              .map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-amber-950/30 border-amber-600/40'
                      : 'bg-stone-950/40 border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                        item.delta > 0
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-red-950 text-red-300 border border-red-800/60'
                      }`}
                    >
                      {item.delta > 0 ? `+${item.delta}` : item.delta}
                    </span>
                    <div>
                      <div className="font-bold text-stone-200 text-xs sm:text-sm">
                        {item.playerName}
                        {item.reason && (
                          <span className="text-amber-400 font-normal text-xs ml-1.5 opacity-90">
                            • {item.reason}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {item.prevScore} → {item.newScore} pts • {item.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer con acciones */}
        <div className="p-3 border-t border-amber-900/40 bg-stone-950 flex items-center justify-between gap-2">
          <button
            onClick={onUndoLast}
            disabled={entries.length === 0}
            className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} />
            Deshacer Última
          </button>
          <button
            onClick={onClearHistory}
            disabled={entries.length === 0}
            className="py-2 px-3 bg-red-950/60 hover:bg-red-900/80 disabled:opacity-30 text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            title="Borrar historial"
          >
            <FontAwesomeIcon icon={faTrashCan} />
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
