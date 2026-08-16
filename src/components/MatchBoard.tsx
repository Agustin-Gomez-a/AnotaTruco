import React from 'react';
import MatchGroup, { type CounterStyle } from './MatchGroup';

interface MatchBoardProps {
  score: number;
  target: number;
  counterStyle?: CounterStyle;
}

export default function MatchBoard({ score, target, counterStyle = 'fosforos' }: MatchBoardProps) {
  const hasHalves = target === 30 || target === 18 || target === 24;
  const halfTarget = target / 2;
  const scoreInMalas = hasHalves ? Math.min(score, halfTarget) : score;
  const scoreInBuenas = hasHalves ? Math.max(0, score - halfTarget) : 0;

  const renderGroupList = (pts: number, maxPts: number) => {
    const full = Math.floor(pts / 5);
    const rem = pts % 5;
    const list: number[] = [];
    for (let i = 0; i < full; i++) list.push(5);
    if (rem > 0) list.push(rem);

    // Calculamos cuántos grupos vacíos / capacidad total se necesitan para dar una cuadrícula consistente
    const totalSlots = Math.ceil(maxPts / 5);

    if (list.length === 0) {
      return (
        <div className="h-16 flex items-center justify-center text-xs tracking-wider font-semibold text-emerald-300/40 uppercase">
          <span className="border-b border-dashed border-emerald-500/20 pb-0.5">0 / {maxPts} pts</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center content-start gap-1 sm:gap-2 min-h-[64px] p-1.5 transition-all">
        {list.map((cnt, idx) => (
          <MatchGroup key={idx} count={cnt} style={counterStyle} />
        ))}
      </div>
    );
  };

  if (!hasHalves) {
    return (
      <div className="flex-1 board-inset rounded-xl p-2 sm:p-3 overflow-y-auto flex flex-col justify-between">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-[11px] font-bold tracking-widest text-amber-200/70 uppercase">
            Puntos
          </span>
          <span className="text-xs font-mono font-bold text-amber-300">
            {score} / {target}
          </span>
        </div>
        {renderGroupList(score, target)}
        {/* Barra de progreso sutil */}
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-2 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, (score / target) * 100)}%` }}
          />
        </div>
      </div>
    );
  }

  const malasPct = (scoreInMalas / halfTarget) * 100;
  const buenasPct = (scoreInBuenas / halfTarget) * 100;

  return (
    <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto">
      {/* Sección MALAS */}
      <div
        className={`board-section rounded-xl p-2 transition-all ${
          scoreInMalas === halfTarget
            ? 'border-amber-500/40 bg-amber-950/20 shadow-inner'
            : 'border-emerald-950/60 bg-black/30'
        }`}
      >
        <div className="flex items-center justify-between px-1.5 mb-1">
          <span className="section-badge badge-malas">
            Malas
          </span>
          <span className="text-[11px] font-mono font-bold text-amber-200/90">
            {scoreInMalas} / {halfTarget}
          </span>
        </div>
        {renderGroupList(scoreInMalas, halfTarget)}
        <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden mt-1.5">
          <div
            className="h-full bg-gradient-to-r from-amber-700 to-amber-500 transition-all duration-300"
            style={{ width: `${malasPct}%` }}
          />
        </div>
      </div>

      {/* Sección BUENAS */}
      <div
        className={`board-section rounded-xl p-2 transition-all ${
          scoreInBuenas > 0
            ? 'border-sky-500/40 bg-sky-950/20'
            : 'border-emerald-950/60 bg-black/20 opacity-75'
        }`}
      >
        <div className="flex items-center justify-between px-1.5 mb-1">
          <span className="section-badge badge-buenas">
            Buenas
          </span>
          <span className="text-[11px] font-mono font-bold text-sky-200/90">
            {scoreInBuenas} / {halfTarget}
          </span>
        </div>
        {renderGroupList(scoreInBuenas, halfTarget)}
        <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden mt-1.5">
          <div
            className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${buenasPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
