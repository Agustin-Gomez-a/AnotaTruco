import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faPlay,
  faRotate,
  faPlus,
  faTrashCan,
  faCrown,
  faFire,
  faBeerMugEmpty
} from '@fortawesome/free-solid-svg-icons';
import { sound } from '../utils/sound';

interface CriolloRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultParticipants?: string[];
}

const PRESET_MODES = [
  { id: 'mate', label: '🧉 ¿Quién ceba el mate?', desc: 'Sortea al cebador oficial de la ronda' },
  { id: 'asado', label: '🥩 ¿Quién paga el asado?', desc: 'El que pierde la suerte compra la carne o picada' },
  { id: 'bebidas', label: '🍺 ¿Quién compra las bebidas?', desc: 'Elige quién va al almacén / súper' },
  { id: 'barajar', label: '🃏 ¿Quién baraja primero?', desc: 'Para definir quién reparte las cartas de arranque' },
];

const WHEEL_COLORS = [
  '#b45309', // Amber dark
  '#047857', // Emerald
  '#1d4ed8', // Blue
  '#b91c1c', // Red
  '#7c3aed', // Purple
  '#d97706', // Gold
  '#0f766e', // Teal
  '#c2410c', // Orange
];

export default function CriolloRouletteModal({
  isOpen,
  onClose,
  defaultParticipants = ['Nosotros', 'Ellos']
}: CriolloRouletteModalProps) {
  const [selectedPreset, setSelectedPreset] = useState('mate');
  const [participants, setParticipants] = useState<string[]>(
    defaultParticipants.length >= 2 ? defaultParticipants : ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4']
  );
  const [newParticipant, setNewParticipant] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTickSegmentRef = useRef<number>(-1);

  // Inicializar participantes cuando se abre
  useEffect(() => {
    if (defaultParticipants.length >= 2) {
      setParticipants(defaultParticipants);
    }
  }, [defaultParticipants]);

  // Dibujar la ruleta en el Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const numSegments = Math.max(1, participants.length);
    const arcSize = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    // Guardar contexto para rotación
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationAngle * Math.PI) / 180);

    for (let i = 0; i < numSegments; i++) {
      const angle = i * arcSize;
      ctx.beginPath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arcSize);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Borde del gajo
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto del participante
      ctx.save();
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      
      const name = participants[i] || `Opción ${i + 1}`;
      const truncated = name.length > 12 ? name.substring(0, 10) + '..' : name;
      ctx.fillText(truncated, radius - 18, 5);
      ctx.restore();
    }

    // Borde exterior dorado
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.restore();

    // Centro decorativo (Centro de ruleta de madera / cuero)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1917';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [isOpen, participants, rotationAngle]);

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return;
    sound.playClick();
    setParticipants([...participants, newParticipant.trim()]);
    setNewParticipant('');
  };

  const handleRemoveParticipant = (idx: number) => {
    if (participants.length <= 2) return;
    sound.playRemove();
    setParticipants(participants.filter((_, i) => i !== idx));
  };

  const spinWheel = () => {
    if (isSpinning || participants.length < 2) return;
    sound.playClick();
    setIsSpinning(true);
    setWinner(null);

    const numSegments = participants.length;
    const arcDeg = 360 / numSegments;

    // Número de vueltas aleatorias (entre 5 y 8 vueltas completas)
    const extraTurns = Math.floor(Math.random() * 4) + 5;
    const randomOffset = Math.random() * 360;
    const targetAngle = rotationAngle + extraTurns * 360 + randomOffset;
    const startAngle = rotationAngle;
    const duration = 4000; // 4 segundos
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out cubic / quartic
      const easeOut = 1 - Math.pow(1 - progress, 3.5);
      const currentDeg = startAngle + (targetAngle - startAngle) * easeOut;
      setRotationAngle(currentDeg);

      // Reproducir sonido de tick en cada segmento que cruza la aguja superior (270 grados / arriba)
      const normalizedDeg = (currentDeg + 90) % 360;
      const currentSegment = Math.floor(normalizedDeg / arcDeg);
      if (currentSegment !== lastTickSegmentRef.current) {
        sound.playTick();
        lastTickSegmentRef.current = currentSegment;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calcular ganador: La aguja está en la parte superior
        const finalDeg = (targetAngle % 360 + 360) % 360;
        const pointerAngle = (360 - (finalDeg % 360) + 270) % 360;
        const winningIndex = Math.floor(pointerAngle / arcDeg) % numSegments;
        const chosen = participants[winningIndex] || participants[0];
        setWinner(chosen);
        sound.playWin();
        sound.speakPhrase(`¡Le tocó a ${chosen}!`);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  if (!isOpen) return null;

  const currentPresetInfo = PRESET_MODES.find((p) => p.id === selectedPreset);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-lg max-h-[92vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FontAwesomeIcon icon={faRotate} />
            </div>
            <div>
              <h2 className="font-truco font-bold text-base sm:text-lg text-amber-200">
                Ruleta & Sorteo Criollo
              </h2>
              <p className="text-[11px] text-amber-400/60">
                ¿A quién le toca?
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

        {/* Presets Rápidos */}
        <div className="flex gap-1.5 p-2 bg-stone-950/60 overflow-x-auto border-b border-stone-800/80 flex-shrink-0">
          {PRESET_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                sound.playClick();
                setSelectedPreset(mode.id);
                setWinner(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedPreset === mode.id
                  ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold shadow'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 flex flex-col items-center">
          {/* Título de la consigna actual */}
          <div className="text-center">
            <h3 className="font-truco font-bold text-sm sm:text-base text-amber-200">
              {currentPresetInfo?.label}
            </h3>
            <p className="text-[11px] text-stone-400">
              {currentPresetInfo?.desc}
            </p>
          </div>

          {/* Ruleta Visual con Aguja Fija */}
          <div className="relative w-[230px] h-[230px] flex items-center justify-center my-1">
            {/* Aguja Superior Indicadora */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 z-20 flex flex-col items-center">
              <div className="w-4 h-5 bg-amber-400 border border-amber-100 shadow-[0_2px_8px_rgba(0,0,0,0.8)] [clip-path:polygon(50%_100%,0%_0%,100%_0%)]" />
            </div>

            <canvas
              ref={canvasRef}
              width={230}
              height={230}
              className="rounded-full shadow-2xl border-2 border-stone-800/80"
            />
          </div>

          {/* Banner de Ganador */}
          {winner && (
            <div className="w-full p-2.5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500/60 rounded-xl text-center animate-fade-in shadow-lg">
              <span className="text-[9px] uppercase tracking-widest text-emerald-300 font-black block">
                ¡RESULTADO DE LA SUERTE!
              </span>
              <div className="font-truco font-black text-lg text-emerald-100 flex items-center justify-center gap-1.5 mt-0.5">
                <FontAwesomeIcon icon={faCrown} className="text-yellow-400 text-sm" />
                <span>{winner}</span>
              </div>
            </div>
          )}

          {/* Botón de Giro Principal */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || participants.length < 2}
            className="w-full max-w-xs py-2.5 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-stone-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 pop-btn disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faPlay} className="text-xs" />
            <span>{isSpinning ? 'GIRANDO LA SUERTE...' : '¡GIRAR RULETA!'}</span>
          </button>

          {/* Lista y Gestión de Participantes */}
          <div className="w-full pt-2 border-t border-stone-800">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1.5">
              Participantes ({participants.length})
            </label>

            {/* Input para agregar participante */}
            <div className="flex gap-1.5 mb-2">
              <input
                type="text"
                placeholder="Nombre de participante..."
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
                className="flex-1 bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-amber-100 outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAddParticipant}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1 pop-btn"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Agregar</span>
              </button>
            </div>

            {/* Tags de participantes */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {participants.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 text-[11px] flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: WHEEL_COLORS[idx % WHEEL_COLORS.length] }} />
                  <span>{p}</span>
                  {participants.length > 2 && (
                    <button
                      onClick={() => handleRemoveParticipant(idx)}
                      className="text-stone-500 hover:text-red-400 ml-0.5"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-[9px]" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
