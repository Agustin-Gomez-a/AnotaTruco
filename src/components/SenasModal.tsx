import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface SenasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SENAS = [
  {
    card: '1 de Espada',
    alias: 'Ancho de Espada · El Macho',
    rank: 1,
    sena: 'Levantar ambas cejas',
    emoji: '🤨',
    desc: 'Subí las dos cejas bien marcado, como si te sorprendieras.',
    color: 'from-amber-500/20 to-yellow-600/10',
    border: 'border-amber-500/60',
    badge: 'bg-amber-500',
    badgeText: '#1 · Invencible',
  },
  {
    card: '1 de Basto',
    alias: 'Ancho de Basto · La Hembra',
    rank: 2,
    sena: 'Guiñar el ojo derecho',
    emoji: '😉',
    desc: 'Cerrá solo el ojo derecho, rápido y sutil.',
    color: 'from-lime-500/20 to-green-700/10',
    border: 'border-lime-500/60',
    badge: 'bg-lime-600',
    badgeText: '#2 · Altísima',
  },
  {
    card: '7 de Espada',
    alias: 'El 7 Bravo · Manilla',
    rank: 3,
    sena: 'Levantar el labio hacia la derecha',
    emoji: '😏',
    desc: 'Hacé una mueca levantando el labio derecho, tipo sonrisa torcida.',
    color: 'from-sky-500/20 to-blue-700/10',
    border: 'border-sky-500/60',
    badge: 'bg-sky-600',
    badgeText: '#3 · Muy Alta',
  },
  {
    card: '7 de Oro',
    alias: 'El 7 Velo · Pichana',
    rank: 4,
    sena: 'Mover el labio hacia la izquierda',
    emoji: '😏',
    flipEmoji: true,
    desc: 'Igual que el anterior pero para el lado izquierdo.',
    color: 'from-yellow-400/20 to-orange-600/10',
    border: 'border-yellow-400/60',
    badge: 'bg-yellow-500',
    badgeText: '#4 · Muy Alta',
  },
  {
    card: 'Cualquier 3',
    alias: 'Espada, Basto, Oro o Copa',
    rank: 5,
    sena: 'Morderse el labio inferior',
    emoji: '😬',
    desc: 'Apretá suavemente el labio de abajo con los dientes.',
    color: 'from-emerald-500/20 to-teal-700/10',
    border: 'border-emerald-500/60',
    badge: 'bg-emerald-600',
    badgeText: '#5 · Alta',
  },
  {
    card: 'Cualquier 2',
    alias: 'Espada, Basto, Oro o Copa',
    rank: 6,
    sena: 'Tirar un besito',
    emoji: '😗',
    desc: 'Fruncí los labios como si tirarías un beso. Rápido y sutil.',
    color: 'from-pink-500/20 to-rose-700/10',
    border: 'border-pink-500/60',
    badge: 'bg-pink-600',
    badgeText: '#6 · Media',
  },
  {
    card: 'Anchos Falsos',
    alias: '1 de Copa o 1 de Oro',
    rank: 7,
    sena: 'Abrir un poco la boca (como un pez)',
    emoji: '😮',
    desc: 'Abrí apenas la boca, como bostezando sin sonido. Como pez.',
    color: 'from-violet-500/20 to-purple-700/10',
    border: 'border-violet-500/60',
    badge: 'bg-violet-600',
    badgeText: '#7 · Media',
  },
  {
    card: 'Mano Mala',
    alias: 'No tenés nada / Basura',
    rank: 8,
    sena: 'Cerrar los ojos',
    emoji: '😑',
    desc: 'Cerrá los dos ojos un segundo. Señal de rendición criolla.',
    color: 'from-stone-600/20 to-stone-800/10',
    border: 'border-stone-500/50',
    badge: 'bg-stone-600',
    badgeText: 'Mala mano',
  },
];

export default function SenasModal({ isOpen, onClose }: SenasModalProps) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleReveal = (rank: number) => {
    setRevealed((prev) => ({ ...prev, [rank]: !prev[rank] }));
  };

  const allRevealed = SENAS.every((s) => revealed[s.rank]);
  const toggleAll = () => {
    if (allRevealed) {
      setRevealed({});
    } else {
      const all: Record<number, boolean> = {};
      SENAS.forEach((s) => { all[s.rank] = true; });
      setRevealed(all);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-lg max-h-[92vh] bg-[#0d130e] border border-emerald-700/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-emerald-900/50 flex items-center justify-between bg-stone-950/90 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl">
              👁️
            </div>
            <div>
              <h2 className="font-truco font-bold text-base text-amber-200 leading-tight">
                Señas del Truco
              </h2>
              <p className="text-[10px] text-emerald-400/70 font-mono">
                El código secreto de la mesa criolla
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAll}
              title={allRevealed ? 'Ocultar todas' : 'Revelar todas'}
              className="flex items-center gap-1 px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[10px] font-semibold border border-stone-700 transition-colors"
            >
              <FontAwesomeIcon icon={allRevealed ? faEyeSlash : faEye} className="text-[9px]" />
              {allRevealed ? 'Ocultar' : 'Ver todo'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              title="Cerrar"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>

        {/* Intro */}
        <div className="px-4 py-2.5 bg-emerald-950/30 border-b border-emerald-900/30 flex-shrink-0">
          <p className="text-[11px] text-stone-300 leading-snug">
            🤫 <strong className="text-emerald-300">Estas señas son secretas</strong> — se hacen
            disimuladamente al compañero sin que los rivales vean. Tocá cada carta para revelar la seña.
          </p>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {SENAS.map((s) => {
            const isRevealed = revealed[s.rank];
            return (
              <button
                key={s.rank}
                onClick={() => toggleReveal(s.rank)}
                className={`w-full text-left rounded-xl border bg-gradient-to-r ${s.color} ${s.border} p-3 transition-all duration-200 active:scale-[0.98] group`}
              >
                <div className="flex items-center gap-3">
                  {/* Emoji seña */}
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl border ${s.border} bg-black/30 transition-all duration-300 ${isRevealed ? 'scale-105' : 'grayscale opacity-40'}`}>
                    {isRevealed
                      ? <span style={s.flipEmoji ? { display: 'inline-block', transform: 'scaleX(-1)' } : undefined}>{s.emoji}</span>
                      : '🂠'
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-truco font-bold text-sm text-amber-100">{s.card}</span>
                      <span className={`${s.badge} text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0`}>
                        {s.badgeText}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 block">{s.alias}</span>

                    {/* Seña revelada */}
                    <div className={`mt-1.5 overflow-hidden transition-all duration-300 ${isRevealed ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="flex items-start gap-2 bg-black/30 rounded-lg p-2 border border-white/10">
                        <span className="text-emerald-400 text-xs font-bold flex-shrink-0 mt-0.5">Seña:</span>
                        <div>
                          <span className="text-white text-xs font-semibold block">{s.sena}</span>
                          <span className="text-stone-400 text-[10px] leading-tight">{s.desc}</span>
                        </div>
                      </div>
                    </div>

                    {!isRevealed && (
                      <span className="text-[10px] text-stone-500 italic mt-0.5 block group-hover:text-stone-400 transition-colors">
                        Tocá para ver la seña →
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-emerald-900/40 bg-stone-950 flex items-center justify-between flex-shrink-0">
          <p className="text-[10px] text-stone-500 italic">
            ⚠️ No hagas las señas si te están mirando los rivales
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
