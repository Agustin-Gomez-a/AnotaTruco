import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faCrown,
  faFire,
  faHandPointRight,
  faVolumeHigh,
  faMobileScreenButton,
  faRotateLeft,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { sound } from '../utils/sound';

interface SplashScreenProps {
  onStart: (reset?: boolean) => void;
  savedMatchInfo?: {
    players: { name: string; score: number }[];
    target: number;
    hasProgress: boolean;
  } | null;
}

export default function SplashScreen({ onStart, savedMatchInfo }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = (reset: boolean = false) => {
    sound.playClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }
    setIsExiting(true);
    setTimeout(() => {
      onStart(reset);
    }, 280);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center p-4 sm:p-6 bg-[#070b08] select-none transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 20%, rgba(27, 77, 46, 0.45) 0%, rgba(10, 20, 13, 0.95) 75%, #050806 100%),
          radial-gradient(circle at 50% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)
        `
      }}
    >
      {/* Elemento Decorativo Superior */}
      <div className="w-full max-w-sm flex items-center justify-between text-amber-400/50 text-[11px] font-mono tracking-widest pt-2">
        <span>🇦🇷 EDICIÓN CRIOLLA</span>
        <span>V 1.0</span>
      </div>

      {/* Contenido Central: Logo y Marca */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full my-auto text-center">
        {/* Emblema con corona dorada y resplandor */}
        <div className="relative mb-5 group">
          {/* Resplandor ambiental */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse" />

          {/* Caja del Logo */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-[#1b4d2e] via-[#0d2817] to-[#08150d] border-2 border-amber-400/60 shadow-[0_10px_35px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col items-center justify-center p-3">
            {/* Corona */}
            <FontAwesomeIcon icon={faCrown} className="text-amber-400 text-2xl drop-shadow mb-1" />

            {/* Representación de los 5 Fósforos */}
            <div className="relative w-12 h-12">
              <div className="absolute left-1 top-1 bottom-1 w-1.5 bg-gradient-to-b from-amber-200 to-amber-600 rounded-sm shadow">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 -top-1 -left-0.5 absolute" />
              </div>
              <div className="absolute top-1 left-1 right-1 h-1.5 bg-gradient-to-r from-amber-200 to-amber-600 rounded-sm shadow">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 -right-1 -top-0.5 absolute" />
              </div>
              <div className="absolute right-1 top-1 bottom-1 w-1.5 bg-gradient-to-b from-amber-200 to-amber-600 rounded-sm shadow">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 -bottom-1 -left-0.5 absolute" />
              </div>
              <div className="absolute bottom-1 left-1 right-1 h-1.5 bg-gradient-to-r from-amber-200 to-amber-600 rounded-sm shadow">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 -left-1 -top-0.5 absolute" />
              </div>
              <div className="absolute top-1 left-1 w-14 h-1.5 bg-gradient-to-r from-amber-100 to-amber-500 rounded-sm shadow rotate-45 origin-top-left z-10 border border-amber-300/40">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400 -right-1 -top-0.5 absolute" />
              </div>
            </div>
          </div>
        </div>

        {/* Título de la App */}
        <h1 className="text-3xl sm:text-4xl font-black font-truco tracking-wider text-amber-200 drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
          ANOTA TRUCO
        </h1>

        {/* Subtítulo y Fileteado */}
        <div className="flex items-center justify-center gap-2 my-1">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Anotador Criollo
          </span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        <p className="text-xs text-stone-400 max-w-xs mt-1 leading-relaxed">
          El anotador oficial de Truco Argentino para jugar en la mesa entre amigos.
        </p>

        {/* Badges de características */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
          <span className="px-2.5 py-1 rounded-full bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300 font-medium flex items-center gap-1.5 shadow-sm">
            <FontAwesomeIcon icon={faFire} className="text-amber-400 text-[10px]" />
            Fósforos 3D
          </span>
          <span className="px-2.5 py-1 rounded-full bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300 font-medium flex items-center gap-1.5 shadow-sm">
            <FontAwesomeIcon icon={faHandPointRight} className="text-yellow-400 text-[10px]" />
            Control de Mano
          </span>
          <span className="px-2.5 py-1 rounded-full bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300 font-medium flex items-center gap-1.5 shadow-sm">
            <FontAwesomeIcon icon={faVolumeHigh} className="text-emerald-400 text-[10px]" />
            Audio Táctil
          </span>
        </div>

        {/* =========================================================
            TARJETA DE PARTIDA EN CURSO O BOTÓN PRINCIPAL
            ========================================================= */}
        <div className="w-full mt-6 space-y-2.5">
          {savedMatchInfo && savedMatchInfo.hasProgress ? (
            <div className="bg-stone-900/90 border border-amber-600/40 rounded-2xl p-3.5 shadow-xl text-left">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider mb-2">
                <span>Partida en curso</span>
                <span className="font-mono text-stone-400">A {savedMatchInfo.target} pts</span>
              </div>
              
              <div className="flex items-center justify-around py-2 px-3 bg-stone-950/70 rounded-xl border border-stone-800/80 mb-3">
                {savedMatchInfo.players.map((p, idx) => (
                  <div key={idx} className="text-center">
                    <span className="text-xs text-stone-300 block font-semibold truncate max-w-[90px]">{p.name}</span>
                    <span className="text-2xl font-mono font-black text-amber-100">{p.score}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStart(false)}
                  className="flex-[2] py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 pop-btn active:scale-95 transition-all"
                >
                  <FontAwesomeIcon icon={faPlay} className="text-xs" />
                  Continuar
                </button>
                <button
                  onClick={() => handleStart(true)}
                  className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-xs uppercase tracking-wider border border-stone-700 flex items-center justify-center gap-1.5 pop-btn active:scale-95 transition-all"
                  title="Empezar partida desde 0"
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                  Nueva
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleStart(false)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black rounded-2xl text-base uppercase tracking-widest shadow-[0_4px_25px_rgba(212,175,55,0.45)] border-2 border-yellow-200 flex items-center justify-center gap-3 pop-btn active:scale-95 transition-all"
            >
              <FontAwesomeIcon icon={faPlay} className="text-sm animate-bounce" />
              COMENZAR PARTIDA
            </button>
          )}
        </div>
      </div>

      {/* Footer del Splash */}
      <footer className="w-full max-w-sm text-center py-2 text-[11px] text-stone-500 flex items-center justify-between">
        <span>Listo para celular & APK</span>
        <a href="/privacy.html" className="text-stone-400 hover:text-amber-300 underline transition-colors">
          Privacidad
        </a>
      </footer>
    </div>
  );
}
