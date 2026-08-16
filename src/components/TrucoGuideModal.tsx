import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faBook,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

interface TrucoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Section {
  id: string;
  title: string;
  emoji: string;
  color: string;
  border: string;
  content: React.ReactNode;
}

const GUIDE_SECTIONS: Section[] = [
  {
    id: 'objetivo',
    title: '¿Qué es el Truco?',
    emoji: '🧉',
    color: 'from-amber-500/10 to-yellow-700/5',
    border: 'border-amber-600/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <p>
          El Truco es el juego de cartas más popular de Argentina. Se juega con la{' '}
          <strong className="text-amber-300">baraja española de 40 cartas</strong> (sin 8s ni 9s).
        </p>
        <p>
          El objetivo es llegar primero a los <strong className="text-amber-300">30 puntos</strong>{' '}
          (o la cantidad acordada). Se gana puntos ganando las rondas de <strong className="text-amber-300">Truco</strong>{' '}
          y de <strong className="text-amber-300">Envido</strong>.
        </p>
        <div className="bg-stone-900/60 rounded-xl p-3 border border-stone-800">
          <p className="text-amber-300 font-semibold mb-1">👥 ¿Cuántos juegan?</p>
          <ul className="space-y-1">
            <li>• <strong className="text-stone-200">2 jugadores</strong>: Mano a mano</li>
            <li>• <strong className="text-stone-200">4 jugadores</strong>: 2 parejas enfrentadas (lo más común)</li>
            <li>• <strong className="text-stone-200">6 jugadores</strong>: 2 equipos de 3</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'cartas',
    title: 'Las Cartas y el Reparto',
    emoji: '🃏',
    color: 'from-sky-500/10 to-blue-700/5',
    border: 'border-sky-600/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <p>
          Se reparten <strong className="text-amber-300">3 cartas</strong> a cada jugador. El resto del mazo queda boca abajo.
        </p>
        <p>
          Los palos son: <strong className="text-amber-300">Espada ⚔️ · Basto 🪵 · Oro 🔆 · Copa 🏆</strong>
        </p>
        <div className="bg-stone-900/60 rounded-xl p-3 border border-stone-800">
          <p className="text-amber-300 font-semibold mb-1.5">♟️ Valores para el Envido</p>
          <ul className="space-y-1">
            <li>• Cartas del <strong>1 al 7</strong>: valen su número</li>
            <li>• <strong>10, 11 y 12</strong> (Sota, Caballo, Rey): valen <strong className="text-amber-200">0</strong></li>
            <li>• Dos cartas del mismo palo: se suma su valor <strong>+ 20</strong></li>
            <li>• Sin dos del mismo palo: solo la carta más alta</li>
          </ul>
        </div>
        <p className="text-[11px] text-stone-400 italic bg-stone-900/40 p-2 rounded-lg border border-stone-800">
          💡 Ejemplo: Tenés 5 de espada y 6 de espada → 5 + 6 + 20 = <strong className="text-amber-300">31 de envido</strong>
        </p>
      </div>
    ),
  },
  {
    id: 'mano',
    title: 'La Mano y el Turno',
    emoji: '✋',
    color: 'from-emerald-500/10 to-green-700/5',
    border: 'border-emerald-600/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <p>
          El jugador que tiene la <strong className="text-amber-300">Mano</strong> es el primero en cantar
          (hablar) y el último en tirar carta en cada ronda. Ser mano es una ligera ventaja.
        </p>
        <p>
          La mano rota al jugador siguiente después de cada partida completa.
        </p>
        <div className="bg-stone-900/60 rounded-xl p-3 border border-stone-800">
          <p className="text-amber-300 font-semibold mb-1.5">🔄 Orden de una ronda</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>El que <strong>no es mano</strong> empieza tirando una carta (o cantando)</li>
            <li>Los demás jugadores responden en orden</li>
            <li>Quien gana la vuelta tira primero en la siguiente</li>
            <li>Se juegan hasta 3 vueltas por mano</li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    id: 'envido',
    title: 'El Envido',
    emoji: '⚡',
    color: 'from-blue-500/10 to-indigo-700/5',
    border: 'border-blue-600/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <p>
          El Envido se canta <strong className="text-amber-300">antes de tirar la primera carta</strong>.
          Gana quien tiene el puntaje de envido más alto.
        </p>
        <div className="bg-stone-900/60 rounded-xl p-3 border border-stone-800 space-y-1">
          <p className="text-blue-300 font-semibold mb-1">📢 Escalada de cantos</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { canto: 'Envido', pts: '2 pts', noQ: '1 pt' },
              { canto: 'Real Envido', pts: '3 pts', noQ: '1 pt' },
              { canto: 'Env + Env', pts: '4 pts', noQ: '2 pts' },
              { canto: 'Falta Envido', pts: 'Faltan al líder', noQ: '1 pt' },
            ].map((e) => (
              <div key={e.canto} className="bg-stone-950/60 rounded-lg p-2 border border-stone-800">
                <div className="font-bold text-amber-200 text-[11px]">{e.canto}</div>
                <div className="text-blue-300 text-[10px]">✓ {e.pts}</div>
                <div className="text-stone-500 text-[10px]">✗ {e.noQ}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-stone-400 italic bg-stone-900/40 p-2 rounded-lg border border-stone-800">
          💡 <strong className="text-amber-300">Son buenas</strong>: cuando ambos equipos tienen 15+ puntos. Ahí el Falta Envido vale lo que le falta al que va ganando.
        </p>
      </div>
    ),
  },
  {
    id: 'truco',
    title: 'El Truco',
    emoji: '🔥',
    color: 'from-red-500/10 to-rose-700/5',
    border: 'border-red-600/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <p>
          El Truco se canta en cualquier momento. Se van tirando cartas y el que gana 2 de las 3 vueltas gana la mano.
        </p>
        <div className="bg-stone-900/60 rounded-xl p-3 border border-stone-800">
          <p className="text-red-300 font-semibold mb-1.5">🎯 Cómo se gana cada vuelta</p>
          <ul className="space-y-1">
            <li>• Quien tira la carta de mayor jerarquía <strong>gana</strong> esa vuelta</li>
            <li>• Si hay empate, la vuelta es "<strong>parda</strong>" — no gana nadie</li>
            <li>• Con empate en 1ra vuelta, gana quien gane la 2da</li>
            <li>• Empate en 1ra y 2da: gana quien sea <strong>mano</strong></li>
          </ul>
        </div>
        <div className="bg-stone-900/60 rounded-xl p-3 border border-stone-800">
          <p className="text-red-300 font-semibold mb-1.5">📢 Escalada de cantos</p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { canto: 'Truco', pts: '2', noQ: '1' },
              { canto: 'Retruco', pts: '3', noQ: '2' },
              { canto: 'Vale 4', pts: '4', noQ: '3' },
            ].map((t) => (
              <div key={t.canto} className="bg-stone-950/60 rounded-lg p-2 border border-stone-800 text-center">
                <div className="font-truco font-bold text-amber-200 text-[11px]">{t.canto}</div>
                <div className="text-red-300 text-xs font-bold">{t.pts} pts</div>
                <div className="text-stone-500 text-[10px]">No: {t.noQ} pt</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-stone-400 italic bg-stone-900/40 p-2 rounded-lg border border-stone-800">
          💡 Si te cantan Truco, podés aceptar, rechazar <em>(No quiero)</em> o subir la apuesta cantando <strong className="text-amber-300">Retruco</strong>.
        </p>
      </div>
    ),
  },
  {
    id: 'malas-buenas',
    title: 'Malas y Buenas',
    emoji: '📊',
    color: 'from-violet-500/10 to-purple-700/5',
    border: 'border-violet-600/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <p>
          La partida se divide en dos mitades que cambian la estrategia:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-stone-900/60 rounded-xl p-3 border border-red-800/40">
            <p className="text-red-400 font-bold mb-1">😈 Malas</p>
            <p>Del punto 0 al <strong>14</strong>. Se llama "estar en malas".</p>
            <p className="text-stone-400 text-[10px] mt-1">Falta Envido vale lo que le falta al que va ganando.</p>
          </div>
          <div className="bg-stone-900/60 rounded-xl p-3 border border-green-800/40">
            <p className="text-green-400 font-bold mb-1">😇 Buenas</p>
            <p>Del punto 15 en adelante. Se llama "estar en buenas".</p>
            <p className="text-stone-400 text-[10px] mt-1">Falta Envido vale lo que le falta al rival para ganar.</p>
          </div>
        </div>
        <p className="text-[11px] text-stone-400 italic bg-stone-900/40 p-2 rounded-lg border border-stone-800">
          💡 Cuando ambos equipos están en buenas, el Falta Envido puede terminar la partida de un solo canto.
        </p>
      </div>
    ),
  },
  {
    id: 'consejos',
    title: 'Consejos Criollos',
    emoji: '🤠',
    color: 'from-stone-500/10 to-stone-700/5',
    border: 'border-stone-500/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <div className="space-y-2">
          {[
            { tip: 'Bluff con todo', desc: 'Podés cantar Truco aunque tengas malas cartas. El bluff (mentira) es parte del juego.' },
            { tip: 'Guardá tus cartas buenas', desc: 'No siempre conviene ganar la primera vuelta. A veces es mejor guardar el 1 de espada para la vuelta decisiva.' },
            { tip: 'Usá las señas con el compañero', desc: 'Coordinarse en silencio es clave en pareja. ¡Las señas son tu herramienta secreta!' },
            { tip: 'El No Quiero también suma', desc: 'Si te cantaron Retruco y no tenés cartas, decir "No quiero" te da 2 puntos. No te dejes llevar al Vale Cuatro.' },
            { tip: 'Flor en el Mazo', desc: 'En algunas regiones regionales, tener 3 cartas del mismo palo es "flor" — y gana automáticamente el envido.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 bg-stone-900/60 rounded-xl p-2.5 border border-stone-800">
              <span className="text-amber-400 font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}.</span>
              <div>
                <span className="font-semibold text-amber-200 block text-[11px]">{item.tip}</span>
                <span className="text-stone-400 text-[10px]">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'pata-gallo',
    title: 'Pata y Gallo (de a 3)',
    emoji: '🐓',
    color: 'from-orange-500/10 to-red-700/5',
    border: 'border-orange-600/40',
    content: (
      <div className="space-y-2 text-[12px] text-stone-300 leading-relaxed">
        <p>
          <strong className="text-orange-300">Pata y Gallo</strong> es la variante del Truco para{' '}
          <strong className="text-amber-300">3 jugadores</strong>. Cada mano, uno de los tres es el{' '}
          <strong className="text-red-300">Gallo</strong> (solo) y los otros dos son la{' '}
          <strong className="text-emerald-300">Pata</strong> (alianza).
        </p>

        <div className="bg-stone-900/60 rounded-xl p-3 border border-orange-800/40 space-y-1.5">
          <p className="text-orange-300 font-semibold mb-1">🃏 Las 4 cartas del Gallo</p>
          <p>
            El jugador que reparte (el <strong className="text-red-300">Gallo</strong> de esa mano) recibe{' '}
            <strong className="text-amber-300">4 cartas</strong> en lugar de 3.
          </p>
          <p>
            Antes de cantar o tirar la primera carta, el Gallo debe <strong>mirar sus cuatro cartas</strong>,
            elegir una y <strong className="text-amber-300">descartarla boca abajo</strong> sin que los demás la vean.
          </p>
          <div className="flex items-center gap-2 bg-orange-950/40 rounded-lg p-2 border border-orange-800/30 mt-1">
            <span className="text-2xl">🤫</span>
            <p className="text-[11px] text-stone-300 italic">
              El descarte es secreto — nadie puede ver qué carta tiró el Gallo.
            </p>
          </div>
        </div>

        <div className="bg-stone-900/60 rounded-xl p-3 border border-emerald-800/40 space-y-1">
          <p className="text-emerald-300 font-semibold mb-1">⚔️ La Dinámica 1 vs 2</p>
          <ul className="space-y-1">
            <li>• El Gallo <strong>juega solo</strong> contra los dos jugadores aliados</li>
            <li>• Los dos aliados (<strong className="text-emerald-300">la Pata</strong>) se pueden comunicar con señas entre ellos</li>
            <li>• Una vez descartada, se juega truco tradicional con 3 cartas por jugador</li>
          </ul>
        </div>

        <div className="bg-stone-900/60 rounded-xl p-3 border border-sky-800/40 space-y-1.5">
          <p className="text-sky-300 font-semibold mb-1">📊 Puntuación Individual</p>
          <ul className="space-y-1">
            <li>• Cada jugador lleva <strong>su propio puntaje</strong> — no hay parejas fijas</li>
            <li>
              • Si gana <strong className="text-emerald-300">la Pata</strong>: ambos aliados suman los puntos
            </li>
            <li>
              • Si gana <strong className="text-red-300">el Gallo</strong>: solo él suma los puntos (doble recompensa)
            </li>
          </ul>
        </div>

        <div className="bg-stone-900/60 rounded-xl p-3 border border-amber-800/40">
          <p className="text-amber-300 font-semibold mb-1">🏁 Fin de la Partida</p>
          <p>
            Gana el <strong>primer jugador</strong> en llegar al puntaje pactado (generalmente{' '}
            <strong className="text-amber-300">30 puntos</strong>). El rol de Gallo rota a cada mano.
          </p>
        </div>

        <p className="text-[11px] text-stone-400 italic bg-stone-900/40 p-2 rounded-lg border border-stone-800">
          💡 <strong className="text-orange-300">Estrategia Gallo:</strong> El Gallo tiene la ventaja de elegir su mejor mano descartando una carta. ¡Aprovechá bien el descarte!
        </p>
      </div>
    ),
  },
];

export default function TrucoGuideModal({ isOpen, onClose }: TrucoGuideModalProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ objetivo: true });

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-lg max-h-[92vh] bg-[#0d130e] border border-amber-700/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-amber-900/50 flex items-center justify-between bg-stone-950/90 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600/30 to-yellow-500/20 border border-amber-400/40 flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-truco font-bold text-base text-amber-200 leading-tight">
                Cómo Jugar al Truco
              </h2>
              <p className="text-[10px] text-amber-400/70 font-mono">
                Guía criolla para principiantes y expertos
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

        {/* Intro strip */}
        <div className="px-4 py-2 bg-amber-950/20 border-b border-amber-900/30 flex-shrink-0">
          <p className="text-[11px] text-stone-300">
            🇦🇷 El <strong className="text-amber-300">Truco Argentino</strong> es tradición pura.
            Tocá cada sección para aprender de a poco.
          </p>
        </div>

        {/* Accordion sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {GUIDE_SECTIONS.map((section) => {
            const isOpen = openSections[section.id];
            return (
              <div
                key={section.id}
                className={`rounded-xl border bg-gradient-to-r ${section.color} ${section.border} overflow-hidden`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl flex-shrink-0">{section.emoji}</span>
                    <span className="font-truco font-bold text-sm text-amber-100 group-hover:text-amber-300 transition-colors">
                      {section.title}
                    </span>
                  </div>
                  <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className={`text-[11px] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'text-amber-400' : 'text-stone-500'}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-3 pb-3 border-t border-white/5 pt-2">
                    {section.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-amber-900/40 bg-stone-950 flex items-center justify-between flex-shrink-0">
          <p className="text-[10px] text-stone-500 italic">
            🧉 La mejor forma de aprender es jugando
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            ¡A jugar!
          </button>
        </div>
      </div>
    </div>
  );
}
