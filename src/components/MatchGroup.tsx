import React from 'react';

export type CounterStyle = 'fosforos' | 'tiza' | 'porotos';

interface MatchGroupProps {
  count: number;
  style?: CounterStyle;
}

export default function MatchGroup({ count, style = 'fosforos' }: MatchGroupProps) {
  if (count <= 0) return null;

  if (style === 'tiza') {
    return (
      <div className="chalk-box flex-shrink-0 relative w-12 h-12 m-1">
        {count >= 1 && <div className="chalk-line chalk-1" />}
        {count >= 2 && <div className="chalk-line chalk-2" />}
        {count >= 3 && <div className="chalk-line chalk-3" />}
        {count >= 4 && <div className="chalk-line chalk-4" />}
        {count >= 5 && <div className="chalk-line chalk-5" />}
      </div>
    );
  }

  if (style === 'porotos') {
    return (
      <div className="porotos-box flex-shrink-0 relative w-12 h-12 m-1 flex flex-wrap items-center justify-center p-1 gap-1">
        {Array.from({ length: Math.min(count, 5) }).map((_, idx) => (
          <div
            key={idx}
            className={`poroto-bean poroto-${idx + 1} ${idx === 4 ? 'col-span-2' : ''}`}
            title={`Punto ${idx + 1}`}
          />
        ))}
      </div>
    );
  }

  // Por defecto: Fósforos criollos con textura de madera 3D y cabeza de fósforo realista
  return (
    <div className="match-box flex-shrink-0 relative select-none">
      {count >= 1 && (
        <div className="matchstick match-vertical match-left" title="Punto 1">
          <span className="match-head match-head-top" />
        </div>
      )}
      {count >= 2 && (
        <div className="matchstick match-horizontal match-top" title="Punto 2">
          <span className="match-head match-head-right" />
        </div>
      )}
      {count >= 3 && (
        <div className="matchstick match-vertical match-right" title="Punto 3">
          <span className="match-head match-head-bottom" />
        </div>
      )}
      {count >= 4 && (
        <div className="matchstick match-horizontal match-bottom" title="Punto 4">
          <span className="match-head match-head-left" />
        </div>
      )}
      {count >= 5 && (
        <div className="matchstick match-diagonal" title="Punto 5 (Cierra grupo)">
          <span className="match-head match-head-diagonal" />
        </div>
      )}
    </div>
  );
}
