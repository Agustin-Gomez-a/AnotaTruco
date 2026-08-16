import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faChartSimple,
  faTrophy,
  faFire,
  faShareNodes,
  faTrashCan,
  faCheck,
  faUsers,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';
import { sound } from '../utils/sound';

export interface MatchRecord {
  id: string;
  date: string;
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
  target: number;
}

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareResult?: (text: string) => void;
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('anotatruco_matches_record');
      if (saved) {
        setMatchHistory(JSON.parse(saved));
      }
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  // Cálculos estadísticos
  const totalMatches = matchHistory.length;
  const teamWins: { [team: string]: number } = {};
  let totalPointsScored = 0;

  matchHistory.forEach((m) => {
    teamWins[m.winner] = (teamWins[m.winner] || 0) + 1;
    totalPointsScored += m.winnerScore + m.loserScore;
  });

  const sortedTeams = Object.entries(teamWins).sort((a, b) => b[1] - a[1]);

  const handleClearStats = () => {
    if (window.confirm('¿Borrar todo el historial de partidos y récords?')) {
      sound.playRemove();
      setMatchHistory([]);
      localStorage.removeItem('anotatruco_matches_record');
    }
  };

  const handleShareSummary = () => {
    sound.playClick();
    const topTeam = sortedTeams[0] ? `${sortedTeams[0][0]} (${sortedTeams[0][1]} victorias)` : 'N/A';
    const text = `🧉 ANOTATRUCO CRIOLLO - ESTADÍSTICAS DE MESA 🧉\n` +
      `🏆 Total Partidos: ${totalMatches}\n` +
      `🔥 Líder de la Mesa: ${topTeam}\n` +
      `🎯 Total Puntos Anotados: ${totalPointsScored}\n` +
      `Anotado con AnotaTruco Criollo`;

    if (navigator.share) {
      navigator.share({
        title: 'Estadísticas AnotaTruco',
        text: text,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-lg max-h-[92vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <FontAwesomeIcon icon={faChartSimple} />
            </div>
            <div>
              <h2 className="font-truco font-bold text-base sm:text-lg text-amber-200">
                Estadísticas & Récords
              </h2>
              <p className="text-[11px] text-amber-400/60">
                Historial de enfrentamientos Head to Head
              </p>
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
          {/* Métricas Principales */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Partidos</span>
              <span className="font-mono font-black text-2xl text-amber-200">{totalMatches}</span>
            </div>

            <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Puntos Totales</span>
              <span className="font-mono font-black text-2xl text-sky-300">{totalPointsScored}</span>
            </div>

            <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Equipos</span>
              <span className="font-mono font-black text-2xl text-emerald-300">{sortedTeams.length}</span>
            </div>
          </div>

          {/* Tabla de Victorias por Pareja / Equipo */}
          <section className="bg-stone-950/60 border border-stone-800 rounded-xl p-3">
            <h3 className="font-truco font-bold text-xs uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
              <span>Tabla de Victorias (Head to Head)</span>
            </h3>

            {sortedTeams.length === 0 ? (
              <p className="text-xs text-stone-500 italic text-center py-2">
                Aún no hay partidos finalizados registrados.
              </p>
            ) : (
              <div className="space-y-1.5">
                {sortedTeams.map(([team, wins], idx) => {
                  const pct = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

                  return (
                    <div
                      key={team}
                      className="flex items-center justify-between p-2 bg-stone-900/80 rounded-lg border border-stone-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-600/40 text-amber-300 text-[10px] font-bold flex items-center justify-center font-mono">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-stone-200 text-xs truncate max-w-[150px]">
                          {team}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-400 font-mono">
                          {pct}% victorias
                        </span>
                        <span className="font-mono font-black text-amber-300 text-xs px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                          {wins} {wins === 1 ? 'PG' : 'PGs'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Últimos Partidos Jugados */}
          <section className="bg-stone-950/60 border border-stone-800 rounded-xl p-3">
            <h3 className="font-truco font-bold text-xs uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarDays} className="text-amber-400" />
              <span>Últimos Partidos Registrados</span>
            </h3>

            {matchHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic text-center py-2">
                Completá una partida para guardarla automáticamente en los récords.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {matchHistory
                  .slice()
                  .reverse()
                  .map((match) => (
                    <div
                      key={match.id}
                      className="p-2 bg-stone-900/60 rounded-lg border border-stone-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-stone-200">
                          <span className="text-amber-300">{match.winner}</span> ({match.winnerScore}) def. {match.loser} ({match.loserScore})
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          A {match.target} pts • {match.date}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Finalizado
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer con acciones */}
        <div className="p-3 border-t border-amber-900/40 bg-stone-950 flex items-center justify-between gap-2">
          <button
            onClick={handleShareSummary}
            disabled={totalMatches === 0}
            className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all pop-btn"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faShareNodes} />
            <span>{copied ? '¡Copiado!' : 'Compartir Récords'}</span>
          </button>
          <button
            onClick={handleClearStats}
            disabled={totalMatches === 0}
            className="py-2 px-3 bg-red-950/60 hover:bg-red-900/80 disabled:opacity-30 text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all pop-btn"
            title="Borrar récords"
          >
            <FontAwesomeIcon icon={faTrashCan} />
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
