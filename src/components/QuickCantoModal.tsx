import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faBolt,
  faFire,
  faCrown
} from '@fortawesome/free-solid-svg-icons';

interface QuickCantoModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  currentScore: number;
  rivalScore: number;
  target: number;
  onSelectCanto: (delta: number, reason: string) => void;
}

export default function QuickCantoModal({
  isOpen,
  onClose,
  playerName,
  currentScore,
  rivalScore,
  target,
  onSelectCanto
}: QuickCantoModalProps) {
  if (!isOpen) return null;

  // Cálculo reglamentario de Falta Envido:
  // Si están en malas (ambos por debajo de target/2): faltan los puntos que le faltan al que va ganando para llegar a target
  // Si alguno está en buenas (>= target/2): faltan los puntos que le faltan al que va ganando para completar el partido (es decir, quien va primero define la falta)
  const isOpponentInBuenas = rivalScore >= target / 2;
  const isSelfInBuenas = currentScore >= target / 2;
  const inBuenas = isOpponentInBuenas || isSelfInBuenas;

  let faltaPoints = 0;
  if (!inBuenas) {
    // En Malas: Los puntos para terminar el partido
    faltaPoints = target - Math.max(currentScore, rivalScore);
  } else {
    // En Buenas: Los puntos que le faltan al que va ganando para ganar
    const leaderScore = Math.max(currentScore, rivalScore);
    faltaPoints = target - leaderScore;
  }
  // Al menos 1 punto
  faltaPoints = Math.max(1, faltaPoints);

  const envidoOptions = [
    { label: 'Tanto / 1 pt', delta: 1, reason: 'Punto de Envido' },
    { label: 'Envido (+2)', delta: 2, reason: 'Envido' },
    { label: 'Real Envido (+3)', delta: 3, reason: 'Real Envido' },
    { label: 'Envido no querido (+1)', delta: 1, reason: 'Envido (No quiero)' },
    { label: 'Envido + Envido (+4)', delta: 4, reason: 'Envido + Envido' },
    { label: 'Envido + Real Envido (+5)', delta: 5, reason: 'Envido + Real Envido' },
    { label: `Falta Envido (+${faltaPoints})`, delta: faltaPoints, reason: 'Falta Envido' },
  ];

  const trucoOptions = [
    { label: 'Truco Ganado (+2)', delta: 2, reason: 'Truco' },
    { label: 'Retruco Ganado (+3)', delta: 3, reason: 'Retruco' },
    { label: 'Vale Cuatro (+4)', delta: 4, reason: 'Vale Cuatro' },
    { label: 'Truco No Querido (+1)', delta: 1, reason: 'Truco (No quiero)' },
    { label: 'Retruco No Querido (+2)', delta: 2, reason: 'Retruco (No quiero)' },
    { label: 'Vale 4 No Querido (+3)', delta: 3, reason: 'Vale Cuatro (No quiero)' },
  ];

  const florOptions = [
    { label: 'Flor (+3)', delta: 3, reason: 'Flor' },
    { label: 'Contraflor (+6)', delta: 6, reason: 'Contraflor' },
    { label: 'Flor no querida (+1)', delta: 1, reason: 'Flor (No quiero)' },
  ];

  const handleApply = (delta: number, reason: string) => {
    onSelectCanto(delta, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-lg max-h-[85vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Anotar Canto Criollo
            </span>
            <h2 className="font-truco font-bold text-lg text-amber-100">
              Puntos para <span className="text-yellow-400">{playerName}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Cuerpos de selección rápida */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Envido */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-sky-400 font-bold uppercase tracking-wide">
              <FontAwesomeIcon icon={faBolt} />
              <span>Cantos de Envido</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {envidoOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApply(opt.delta, opt.reason)}
                  className="p-2.5 bg-stone-950/60 hover:bg-sky-950/50 border border-stone-800 hover:border-sky-700/60 rounded-xl text-left transition-all flex items-center justify-between group"
                >
                  <span className="text-stone-200 group-hover:text-white font-medium">
                    {opt.label}
                  </span>
                  <span className="font-mono font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/40">
                    +{opt.delta}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Truco */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-amber-400 font-bold uppercase tracking-wide">
              <FontAwesomeIcon icon={faFire} />
              <span>Cantos de Truco</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {trucoOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApply(opt.delta, opt.reason)}
                  className="p-2.5 bg-stone-950/60 hover:bg-amber-950/50 border border-stone-800 hover:border-amber-700/60 rounded-xl text-left transition-all flex items-center justify-between group"
                >
                  <span className="text-stone-200 group-hover:text-white font-medium">
                    {opt.label}
                  </span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/40">
                    +{opt.delta}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Flor */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-emerald-400 font-bold uppercase tracking-wide">
              <FontAwesomeIcon icon={faCrown} />
              <span>Cantos de Flor</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {florOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApply(opt.delta, opt.reason)}
                  className="p-2.5 bg-stone-950/60 hover:bg-emerald-950/50 border border-stone-800 hover:border-emerald-700/60 rounded-xl text-left transition-all flex items-center justify-between group"
                >
                  <span className="text-stone-200 group-hover:text-white font-medium">
                    {opt.label}
                  </span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    +{opt.delta}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
