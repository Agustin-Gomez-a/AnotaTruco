import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faCrown,
  faFire,
  faHandPointRight,
  faVolumeHigh,
  faVolumeXmark,
  faVolumeLow,
  faRotateLeft,
  faMusic
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
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.45);
  const [musicStarted, setMusicStarted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inicializar el audio al montar
  useEffect(() => {
    const audio = new Audio('/Quiero Retruco.mp3');
    audio.loop = true;
    audio.volume = musicMuted ? 0 : musicVolume;
    audioRef.current = audio;

    // Intentar reproducir (puede necesitar interacción del usuario en algunos navegadores)
    const tryPlay = () => {
      audio.play().then(() => {
        setMusicStarted(true);
      }).catch(() => {
        // Silencioso - el navegador bloqueó la reproducción automática
      });
    };
    tryPlay();

    // Si no arrancó solo, arrancar con la primera interacción
    const onInteraction = () => {
      if (!musicStarted && audio.paused) {
        audio.play().then(() => setMusicStarted(true)).catch(() => {});
      }
      window.removeEventListener('pointerdown', onInteraction);
    };
    window.addEventListener('pointerdown', onInteraction);

    return () => {
      window.removeEventListener('pointerdown', onInteraction);
      audio.pause();
      audio.src = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicMuted ? 0 : musicVolume;
    }
  }, [musicMuted, musicVolume]);

  // Fade-out y detener música al iniciar partida
  const stopMusicFadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    const step = audio.volume / 12;
    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return;
      if (audioRef.current.volume > step) {
        audioRef.current.volume = Math.max(0, audioRef.current.volume - step);
      } else {
        audioRef.current.volume = 0;
        audioRef.current.pause();
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, 20);
  }, []);

  const handleStart = (reset: boolean = false) => {
    sound.playClick();
    stopMusicFadeOut();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }
    setIsExiting(true);
    setTimeout(() => {
      onStart(reset);
    }, 240);
  };

  const toggleMute = () => {
    setMusicMuted(prev => !prev);
    // Si estaba pausado por autoplay bloqueado, intentar arrancar al silenciar
    if (audioRef.current && audioRef.current.paused && musicStarted === false) {
      audioRef.current.play().then(() => setMusicStarted(true)).catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setMusicVolume(vol);
    if (vol > 0 && musicMuted) setMusicMuted(false);
    if (vol === 0) setMusicMuted(true);
    // Si la música estaba pausada, arrancar
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => setMusicStarted(true)).catch(() => {});
    }
  };

  const volumeIcon = musicMuted || musicVolume === 0
    ? faVolumeXmark
    : musicVolume < 0.4
    ? faVolumeLow
    : faVolumeHigh;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center p-3 sm:p-6 bg-[#070b08] select-none transition-all duration-300 overflow-y-auto ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 20%, rgba(27, 77, 46, 0.5) 0%, rgba(10, 20, 13, 0.95) 75%, #050806 100%),
          radial-gradient(circle at 50% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)
        `
      }}
    >
      {/* Header Superior del Splash */}
      <div className="w-full max-w-xs flex items-center justify-between text-amber-400/60 text-[10px] sm:text-xs font-mono tracking-widest pt-1">
        <span>🇦🇷 TRUCO CRIOLLO</span>
        <span>V 1.0</span>
      </div>

      {/* Contenedor Central Compacto */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xs sm:max-w-sm w-full py-2 my-auto text-center">
        {/* Emblema con corona */}
        <div className="relative mb-3 group">
          <div className="absolute -inset-3 bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 rounded-full blur-lg animate-pulse" />

          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-[#1b4d2e] via-[#0d2817] to-[#08150d] border-2 border-amber-400/60 shadow-[0_8px_25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col items-center justify-center p-2">
            <FontAwesomeIcon icon={faCrown} className="text-amber-400 text-lg sm:text-xl drop-shadow mb-1" />

            {/* Representación Fósforos */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10">
              <div className="absolute left-0.5 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-amber-200 to-amber-600 rounded-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 -top-0.5 -left-0.5 absolute" />
              </div>
              <div className="absolute top-0.5 left-0.5 right-0.5 h-1 bg-gradient-to-r from-amber-200 to-amber-600 rounded-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 -right-0.5 -top-0.5 absolute" />
              </div>
              <div className="absolute right-0.5 top-0.5 bottom-0.5 w-1 bg-gradient-to-b from-amber-200 to-amber-600 rounded-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 -bottom-0.5 -left-0.5 absolute" />
              </div>
              <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-gradient-to-r from-amber-200 to-amber-600 rounded-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 -left-0.5 -top-0.5 absolute" />
              </div>
              <div className="absolute top-0.5 left-0.5 w-11 h-1 bg-gradient-to-r from-amber-100 to-amber-500 rounded-sm shadow rotate-45 origin-top-left z-10 border border-amber-300/40">
                <div className="w-2 h-2 rounded-full bg-sky-400 -right-0.5 -top-0.5 absolute" />
              </div>
            </div>
          </div>
        </div>

        {/* Título de la App */}
        <h1 className="text-2xl sm:text-3xl font-black font-truco tracking-wider text-amber-200 drop-shadow">
          ANOTA TRUCO
        </h1>

        {/* Fileteado y Subtítulo */}
        <div className="flex items-center justify-center gap-1.5 my-0.5">
          <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Anotador Criollo
          </span>
          <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        <p className="text-[11px] sm:text-xs text-stone-400 max-w-[260px] mt-0.5 leading-tight">
          El anotador oficial del Truco Argentino para llevar en el celular.
        </p>

        {/* Badges de características */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 my-3">
          <span className="px-2 py-0.5 rounded-full bg-stone-900/90 border border-stone-800 text-[10px] text-stone-300 font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faFire} className="text-amber-400 text-[9px]" />
            Fósforos
          </span>
          <span className="px-2 py-0.5 rounded-full bg-stone-900/90 border border-stone-800 text-[10px] text-stone-300 font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faHandPointRight} className="text-yellow-400 text-[9px]" />
            Mano
          </span>
          <span className="px-2 py-0.5 rounded-full bg-stone-900/90 border border-stone-800 text-[10px] text-stone-300 font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faVolumeHigh} className="text-emerald-400 text-[9px]" />
            Audio Táctil
          </span>
        </div>

        {/* =========================================================
            BOTÓN PRINCIPAL O TARJETA DE PARTIDA EN CURSO
            ========================================================= */}
        <div className="w-full max-w-[280px] mx-auto mt-2">
          {savedMatchInfo && savedMatchInfo.hasProgress ? (
            <div className="bg-stone-900/90 border border-amber-600/40 rounded-2xl p-2.5 sm:p-3 shadow-lg text-left">
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1.5">
                <span>Partida en curso</span>
                <span className="font-mono text-stone-400">A {savedMatchInfo.target} pts</span>
              </div>

              <div className="flex items-center justify-around py-1.5 px-2 bg-stone-950/70 rounded-xl border border-stone-800/80 mb-2.5">
                {savedMatchInfo.players.map((p, idx) => (
                  <div key={idx} className="text-center">
                    <span className="text-[11px] text-stone-300 block font-semibold truncate max-w-[80px]">
                      {p.name}
                    </span>
                    <span className="text-xl font-mono font-black text-amber-100">{p.score}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => handleStart(false)}
                  className="flex-[2] py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 pop-btn active:scale-95 transition-all"
                >
                  <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                  Continuar
                </button>
                <button
                  onClick={() => handleStart(true)}
                  className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-[11px] uppercase tracking-wider border border-stone-700 flex items-center justify-center gap-1 pop-btn active:scale-95 transition-all"
                  title="Empezar de 0"
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                  Nueva
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleStart(false)}
              className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-[0_4px_18px_rgba(212,175,55,0.4)] border border-yellow-200 flex items-center justify-center gap-2 pop-btn active:scale-95 transition-all"
            >
              <FontAwesomeIcon icon={faPlay} className="text-xs" />
              <span>COMENZAR</span>
            </button>
          )}
        </div>

        {/* =========================================================
            CONTROL DE MÚSICA DE INTRO
            ========================================================= */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {/* Botón mute / unmute */}
          <button
            id="splash-music-toggle"
            onClick={toggleMute}
            title={musicMuted ? 'Activar música' : 'Silenciar música'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-semibold transition-all duration-200 active:scale-95 ${
              musicMuted
                ? 'bg-stone-900 border-stone-700 text-stone-500'
                : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400'
            }`}
          >
            <FontAwesomeIcon icon={musicMuted ? faVolumeXmark : faMusic} className="text-[10px]" />
            <span>{musicMuted ? 'Música off' : 'Quiero Retruco'}</span>
          </button>

          {/* Slider de volumen */}
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={volumeIcon}
              className={`text-[10px] ${musicMuted ? 'text-stone-600' : 'text-amber-400'}`}
            />
            <input
              id="splash-music-volume"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={musicMuted ? 0 : musicVolume}
              onChange={handleVolumeChange}
              title="Volumen de la música"
              className="w-20 h-1 rounded-full appearance-none cursor-pointer accent-amber-400 bg-stone-700"
              style={{
                background: `linear-gradient(to right, #f59e0b ${(musicMuted ? 0 : musicVolume) * 100}%, #44403c ${(musicMuted ? 0 : musicVolume) * 100}%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer del Splash */}
      <footer className="w-full max-w-xs text-center py-1 text-[10px] text-stone-500 flex items-center justify-between">
        <span>Diseñado para celular</span>
        <a href="/privacy.html" className="text-stone-400 hover:text-amber-300 underline transition-colors">
          Privacidad
        </a>
      </footer>
    </div>
  );
}
