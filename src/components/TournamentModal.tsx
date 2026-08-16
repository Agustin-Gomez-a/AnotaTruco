import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faTrophy,
  faCrown,
  faRotateLeft,
  faCheck,
  faPlay,
  faUsers,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { sound } from '../utils/sound';

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  winner: string | null;
}

interface Round {
  name: string;
  matches: Match[];
}

interface TournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToBoard?: (teamA: string, teamB: string) => void;
}

type BracketSize = 4 | 8;

export default function TournamentModal({
  isOpen,
  onClose,
  onSendToBoard
}: TournamentModalProps) {
  const [size, setSize] = useState<BracketSize>(4);
  const [teamNames, setTeamNames] = useState<string[]>([
    'Pareja 1',
    'Pareja 2',
    'Pareja 3',
    'Pareja 4',
  ]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [champion, setChampion] = useState<string | null>(null);
  const [isEditingTeams, setIsEditingTeams] = useState(false);

  // Inicializar torneo
  useEffect(() => {
    try {
      const saved = localStorage.getItem('anotatruco_tournament');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rounds && parsed.rounds.length > 0) {
          setSize(parsed.size || 4);
          setTeamNames(parsed.teamNames || []);
          setRounds(parsed.rounds);
          setChampion(parsed.champion || null);
          return;
        }
      }
    } catch {}

    initTournament(size, teamNames);
  }, []);

  const initTournament = (numTeams: BracketSize, names?: string[]) => {
    let currentNames = names || [];
    if (currentNames.length !== numTeams) {
      currentNames = Array.from({ length: numTeams }).map((_, i) => `Pareja ${i + 1}`);
    }
    setTeamNames(currentNames);

    const newRounds: Round[] = [];
    if (numTeams === 4) {
      newRounds.push({
        name: 'Semifinales',
        matches: [
          { id: 'semi-1', teamA: currentNames[0], teamB: currentNames[1], winner: null },
          { id: 'semi-2', teamA: currentNames[2], teamB: currentNames[3], winner: null },
        ],
      });
      newRounds.push({
        name: 'Gran Final',
        matches: [{ id: 'final', teamA: 'Ganador Semi 1', teamB: 'Ganador Semi 2', winner: null }],
      });
    } else if (numTeams === 8) {
      newRounds.push({
        name: 'Cuartos de Final',
        matches: [
          { id: 'q-1', teamA: currentNames[0], teamB: currentNames[1], winner: null },
          { id: 'q-2', teamA: currentNames[2], teamB: currentNames[3], winner: null },
          { id: 'q-3', teamA: currentNames[4], teamB: currentNames[5], winner: null },
          { id: 'q-4', teamA: currentNames[6], teamB: currentNames[7], winner: null },
        ],
      });
      newRounds.push({
        name: 'Semifinales',
        matches: [
          { id: 'semi-1', teamA: 'Ganador Q1', teamB: 'Ganador Q2', winner: null },
          { id: 'semi-2', teamA: 'Ganador Q3', teamB: 'Ganador Q4', winner: null },
        ],
      });
      newRounds.push({
        name: 'Gran Final',
        matches: [{ id: 'final', teamA: 'Ganador Semi 1', teamB: 'Ganador Semi 2', winner: null }],
      });
    }

    setRounds(newRounds);
    setChampion(null);
    saveTournament(numTeams, currentNames, newRounds, null);
  };

  const saveTournament = (
    s: BracketSize,
    names: string[],
    r: Round[],
    champ: string | null
  ) => {
    try {
      localStorage.setItem(
        'anotatruco_tournament',
        JSON.stringify({ size: s, teamNames: names, rounds: r, champion: champ })
      );
    } catch {}
  };

  const handleSelectWinner = (roundIdx: number, matchIdx: number, winningTeam: string) => {
    if (!winningTeam || winningTeam.startsWith('Ganador')) return;
    sound.playClick();

    const updatedRounds = [...rounds];
    const currentMatch = updatedRounds[roundIdx].matches[matchIdx];
    currentMatch.winner = winningTeam;

    // Si es la ronda final, coronar campeón
    if (roundIdx === rounds.length - 1) {
      setChampion(winningTeam);
      sound.playWin();
      sound.speakPhrase(`¡Salud Campeón del torneo de Truco! Felicitaciones ${winningTeam}`);
      saveTournament(size, teamNames, updatedRounds, winningTeam);
      return;
    }

    // Avanzar a la siguiente ronda
    const nextRound = updatedRounds[roundIdx + 1];
    const nextMatchIdx = Math.floor(matchIdx / 2);
    const isTeamA = matchIdx % 2 === 0;

    if (isTeamA) {
      nextRound.matches[nextMatchIdx].teamA = winningTeam;
    } else {
      nextRound.matches[nextMatchIdx].teamB = winningTeam;
    }

    setRounds(updatedRounds);
    saveTournament(size, teamNames, updatedRounds, champion);
  };

  const handleSizeChange = (newSize: BracketSize) => {
    sound.playClick();
    setSize(newSize);
    initTournament(newSize);
  };

  const handlePlayOnBoard = (teamA: string, teamB: string) => {
    if (onSendToBoard && teamA && teamB && !teamA.startsWith('Ganador') && !teamB.startsWith('Ganador')) {
      sound.playClick();
      onSendToBoard(teamA, teamB);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-2xl max-h-[92vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <div>
              <h2 className="font-truco font-bold text-base sm:text-lg text-amber-200">
                Fixture de Torneo Criollo
              </h2>
              <p className="text-[11px] text-amber-400/60">
                Llaves de eliminación directa
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

        {/* Toolbar de Torneo */}
        <div className="flex items-center justify-between p-2 bg-stone-950/60 border-b border-stone-800/80 gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1">
            <span className="text-stone-400 text-[11px] mr-1">Parejas:</span>
            {[4, 8].map((s) => (
              <button
                key={s}
                onClick={() => handleSizeChange(s as BracketSize)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all border ${
                  size === s
                    ? 'bg-amber-600 text-stone-950 border-amber-400 shadow'
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
              >
                {s} Parejas
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditingTeams(!isEditingTeams)}
              className="px-2 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-lg flex items-center gap-1 pop-btn"
            >
              <FontAwesomeIcon icon={isEditingTeams ? faCheck : faPenToSquare} className="text-amber-400 text-[10px]" />
              <span>{isEditingTeams ? 'Listo' : 'Editar Nombres'}</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Reiniciar todo el torneo?')) {
                  initTournament(size, teamNames);
                }
              }}
              title="Reiniciar torneo"
              className="px-2 py-1 bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/60 rounded-lg flex items-center gap-1 pop-btn"
            >
              <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* Banner de Campeón */}
          {champion && (
            <div className="p-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-yellow-200 rounded-xl text-stone-950 text-center animate-fade-in shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-widest block">
                ¡¡CAMPEÓN DEL TORNEO!!
              </span>
              <div className="font-truco font-black text-xl flex items-center justify-center gap-2 mt-0.5">
                <FontAwesomeIcon icon={faCrown} />
                <span>{champion}</span>
                <FontAwesomeIcon icon={faTrophy} />
              </div>
            </div>
          )}

          {/* Formulario de edición rápida de nombres */}
          {isEditingTeams && (
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-2 animate-fade-in">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Nombres de las Parejas ({size})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {teamNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-stone-500 w-4">#{idx + 1}</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        const updated = [...teamNames];
                        updated[idx] = e.target.value;
                        setTeamNames(updated);
                      }}
                      className="flex-1 bg-stone-900 border border-stone-700 rounded px-2 py-0.5 text-xs text-amber-100 outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  initTournament(size, teamNames);
                  setIsEditingTeams(false);
                }}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs uppercase tracking-wider pop-btn"
              >
                Actualizar Cuadro
              </button>
            </div>
          )}

          {/* Cuadro de Llaves (Bracket) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rounds.map((round, rIdx) => (
              <div key={rIdx} className="space-y-2">
                <div className="text-center py-1 px-2 bg-stone-950 rounded-lg border border-amber-900/40">
                  <span className="font-truco font-bold text-xs uppercase tracking-wider text-amber-300">
                    {round.name}
                  </span>
                </div>

                <div className="space-y-2">
                  {round.matches.map((match, mIdx) => {
                    const isPlayable =
                      match.teamA &&
                      match.teamB &&
                      !match.teamA.startsWith('Ganador') &&
                      !match.teamB.startsWith('Ganador');

                    return (
                      <div
                        key={match.id}
                        className="p-2 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1.5 shadow-sm"
                      >
                        {/* Equipo A */}
                        <button
                          onClick={() => handleSelectWinner(rIdx, mIdx, match.teamA)}
                          disabled={!match.teamA || match.teamA.startsWith('Ganador')}
                          className={`w-full p-2 rounded-lg text-left flex items-center justify-between text-xs transition-all border ${
                            match.winner === match.teamA
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                              : 'bg-stone-900 border-stone-800/80 text-stone-200 hover:border-amber-600/60'
                          }`}
                        >
                          <span className="truncate">{match.teamA}</span>
                          {match.winner === match.teamA && (
                            <FontAwesomeIcon icon={faCrown} className="text-yellow-400 text-xs ml-1" />
                          )}
                        </button>

                        <div className="text-center text-[9px] font-mono text-stone-500 font-bold uppercase">
                          VS
                        </div>

                        {/* Equipo B */}
                        <button
                          onClick={() => handleSelectWinner(rIdx, mIdx, match.teamB)}
                          disabled={!match.teamB || match.teamB.startsWith('Ganador')}
                          className={`w-full p-2 rounded-lg text-left flex items-center justify-between text-xs transition-all border ${
                            match.winner === match.teamB
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                              : 'bg-stone-900 border-stone-800/80 text-stone-200 hover:border-amber-600/60'
                          }`}
                        >
                          <span className="truncate">{match.teamB}</span>
                          {match.winner === match.teamB && (
                            <FontAwesomeIcon icon={faCrown} className="text-yellow-400 text-xs ml-1" />
                          )}
                        </button>

                        {/* Botón para enviar al anotador */}
                        {isPlayable && !match.winner && onSendToBoard && (
                          <button
                            onClick={() => handlePlayOnBoard(match.teamA, match.teamB)}
                            className="w-full py-1 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/40 text-amber-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 pop-btn mt-1"
                          >
                            <FontAwesomeIcon icon={faPlay} className="text-[8px]" />
                            <span>Anotar este partido</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
