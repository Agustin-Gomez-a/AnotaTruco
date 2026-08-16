import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faCrown,
  faFire,
  faScroll,
  faBolt
} from '@fortawesome/free-solid-svg-icons';

interface CardsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CARD_RANKS = [
  { rank: 1, name: '1 de Espada', alias: 'El Macho / El As de Espada', badge: 'Invencible', color: 'border-amber-400/80 text-amber-300' },
  { rank: 2, name: '1 de Basto', alias: 'La Hembra / El As de Basto', badge: 'Alta', color: 'border-amber-400/60 text-amber-200' },
  { rank: 3, name: '7 de Espada', alias: 'El 7 Bravo / Manilla', badge: 'Alta', color: 'border-amber-400/60 text-amber-200' },
  { rank: 4, name: '7 de Oro', alias: 'El 7 Velo / Pichana', badge: 'Alta', color: 'border-amber-400/60 text-amber-200' },
  { rank: 5, name: 'Todos los 3', alias: 'Espada, Basto, Oro, Copa', badge: 'Media Alta', color: 'border-stone-600 text-stone-200' },
  { rank: 6, name: 'Todos los 2', alias: 'Espada, Basto, Oro, Copa', badge: 'Media', color: 'border-stone-600 text-stone-200' },
  { rank: 7, name: '1 de Oro y 1 de Copa', alias: 'Anchos Falsos', badge: 'Media', color: 'border-stone-600 text-stone-200' },
  { rank: 8, name: 'Todos los 12 (Rey)', alias: 'Copa, Espada, Oro, Basto', badge: 'Baja', color: 'border-stone-700 text-stone-300' },
  { rank: 9, name: 'Todos los 11 (Caballo)', alias: 'Copa, Espada, Oro, Basto', badge: 'Baja', color: 'border-stone-700 text-stone-300' },
  { rank: 10, name: 'Todos los 10 (Sota)', alias: 'Copa, Espada, Oro, Basto', badge: 'Baja', color: 'border-stone-700 text-stone-300' },
  { rank: 11, name: '7 de Copa y 7 de Basto', alias: 'Sietes Falsos / Comunes', badge: 'Baja', color: 'border-stone-700 text-stone-300' },
  { rank: 12, name: 'Todos los 6', alias: 'Espada, Basto, Oro, Copa', badge: 'Muy Baja', color: 'border-stone-800 text-stone-400' },
  { rank: 13, name: 'Todos los 5', alias: 'Espada, Basto, Oro, Copa', badge: 'Muy Baja', color: 'border-stone-800 text-stone-400' },
  { rank: 14, name: 'Todos los 4', alias: 'Las más bajas de la baraja', badge: 'Base', color: 'border-stone-800 text-stone-400' },
];

const ENVIDO_VALS = [
  { canto: 'Envido', pts: '2 pts', desc: 'Si no se acepta: 1 pt' },
  { canto: 'Real Envido', pts: '3 pts', desc: 'Si no se acepta: 1 pt' },
  { canto: 'Envido + Envido', pts: '4 pts', desc: 'Si no se acepta: 2 pts' },
  { canto: 'Envido + Real Envido', pts: '5 pts', desc: 'Si no se acepta: 2 pts' },
  { canto: 'Falta Envido (en Malas)', pts: 'Puntos que le faltan al que va ganando para ganar el partido', desc: 'Si no se acepta: 1 pt' },
  { canto: 'Falta Envido (en Buenas)', pts: 'Puntos que le faltan al rival para ganar el partido', desc: 'Si no se acepta: 1 pt' },
];

const TRUCO_VALS = [
  { canto: 'Truco', pts: '2 pts', noQuiero: '1 pt' },
  { canto: 'Retruco', pts: '3 pts', noQuiero: '2 pts' },
  { canto: 'Vale Cuatro', pts: '4 pts', noQuiero: '3 pts' },
];

export default function CardsGuideModal({ isOpen, onClose }: CardsGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FontAwesomeIcon icon={faScroll} />
            </div>
            <div>
              <h2 className="font-truco font-bold text-lg text-amber-200">
                Reglamento y Jerarquía Criolla
              </h2>
              <p className="text-xs text-amber-400/60">
                Valores oficiales del Truco Argentino
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

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
          {/* Jerarquía de Cartas */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faCrown} className="text-amber-400" />
              <h3 className="font-truco font-bold text-amber-300 text-sm tracking-wide uppercase">
                Jerarquía de Cartas (De Mayor a Menor)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CARD_RANKS.map((card) => (
                <div
                  key={card.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl bg-stone-950/60 border ${card.color} transition-all`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-stone-800 text-amber-300 text-xs font-mono font-bold flex items-center justify-center">
                      #{card.rank}
                    </span>
                    <div>
                      <div className="font-bold text-stone-100 text-xs sm:text-sm">
                        {card.name}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {card.alias}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-800/80 text-amber-400 border border-amber-900/40">
                    {card.badge}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Cantos de Envido */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faBolt} className="text-sky-400" />
              <h3 className="font-truco font-bold text-sky-300 text-sm tracking-wide uppercase">
                Tabla de Envido y Puntos
              </h3>
            </div>
            <div className="space-y-1.5">
              {ENVIDO_VALS.map((e, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-stone-950/50 rounded-xl border border-stone-800"
                >
                  <div>
                    <span className="font-bold text-amber-200 text-xs sm:text-sm">{e.canto}</span>
                    <span className="text-[11px] text-stone-400 block sm:inline sm:ml-2">({e.desc})</span>
                  </div>
                  <span className="font-mono font-bold text-sky-300 text-xs bg-sky-950/60 px-2 py-1 rounded border border-sky-800/40">
                    {e.pts}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-2 bg-stone-950/40 p-2 rounded-lg border border-stone-800/60">
              💡 <strong>Cálculo de Envido:</strong> 2 cartas del mismo palo suman sus valores + 20 (figuras 10, 11 y 12 valen 0). Si no hay dos del mismo palo, se toma la carta de mayor valor.
            </p>
          </section>

          {/* Cantos de Truco */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faFire} className="text-red-400" />
              <h3 className="font-truco font-bold text-red-300 text-sm tracking-wide uppercase">
                Truco, Retruco y Vale Cuatro
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TRUCO_VALS.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-950/50 rounded-xl border border-stone-800 text-center"
                >
                  <div className="font-truco font-bold text-amber-300 text-sm mb-1">{t.canto}</div>
                  <div className="text-xl font-mono font-black text-amber-100">{t.pts}</div>
                  <div className="text-[11px] text-stone-400 mt-1">No Quiero: {t.noQuiero}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-amber-900/40 bg-stone-950 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Entendido, ¡A Jugar!
          </button>
        </div>
      </div>
    </div>
  );
}
