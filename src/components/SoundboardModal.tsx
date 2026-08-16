import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faBullhorn,
  faVolumeHigh,
  faScroll,
  faRotate,
  faCopy,
  faCheck,
  faFire,
  faBolt,
  faSpinner,
  faMicrophone
} from '@fortawesome/free-solid-svg-icons';
import { sound } from '../utils/sound';

interface SoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRUCO_PHRASES = [
  { text: '¡Quiero Retruco!', category: 'truco', icon: faFire },
  { text: '¡Vale Cuatro carajo!', category: 'truco', icon: faFire },
  { text: '¡Envido!', category: 'envido', icon: faBolt },
  { text: '¡Real Envido!', category: 'envido', icon: faBolt },
  { text: '¡Falta Envido y truco!', category: 'envido', icon: faBolt },
  { text: '¡Las tuyas con vinagre!', category: 'picante', icon: faBullhorn },
  { text: '¡Son buenas!', category: 'respuesta', icon: faBullhorn },
  { text: '¡No quiero!', category: 'respuesta', icon: faBullhorn },
  { text: '¡Al mazo!', category: 'respuesta', icon: faBullhorn },
  { text: '¡A cara de perro!', category: 'picante', icon: faBullhorn },
  { text: '¡Hacete el sordo!', category: 'picante', icon: faBullhorn },
  { text: '¡Esta mano define el asado!', category: 'picante', icon: faBullhorn },
  { text: '¡Treinta y tres de mano son mejores!', category: 'envido', icon: faBolt },
  { text: '¡Paso por ahora!', category: 'respuesta', icon: faBullhorn },
  { text: '¡Contraflor al resto!', category: 'envido', icon: faBolt },
  { text: '¡No te achiques gaucho!', category: 'picante', icon: faBullhorn },
];

const COPLAS_CRIOLLAS = [
  {
    title: 'El Envido del Gaucho',
    verso: 'En la estancia de Don Pedro\nvi una china en el sendero,\ncuando me acerqué a mirarla...\n¡treinta y tres de mano tengo!',
    tanto: '33 de Tanto'
  },
  {
    title: 'El Retruco Bravo',
    verso: 'El truco nació en la pampa\ny en el monte se crió,\nel que no sabe jugarlo\n¡al mazo ya se tiró!',
    tanto: 'Retruco'
  },
  {
    title: 'El Ancho de Espada',
    verso: 'Tengo un zaino parejero\nque no afloja en la parada,\npa\' mandar en esta mesa\n¡tengo el As de Espada!',
    tanto: 'Macho Bravo'
  },
  {
    title: 'La Flor Escondida',
    verso: 'De las aves que vuelan\nla calandria es la mejor,\ny en mi mano compañera\n¡se me apareció una Flor!',
    tanto: 'Flor'
  },
  {
    title: 'Falta Envido en Malas',
    verso: 'A la orilla de un arroyo\nme puse a tomar un mate,\ny a estos guapos fanfarrones\n¡falta envido en el remate!',
    tanto: 'Falta Envido'
  },
  {
    title: 'El Siete Bravo',
    verso: 'Siete días tiene la semana\ny siete notas el cantor,\ncon mi siete de espadita\n¡hago temblar al mejor!',
    tanto: '7 de Espada'
  }
];

// ============================================================
// Motor de voz Web Speech API - sin logins ni servicios externos
// Selecciona la mejor voz española disponible con prioridad AR
// ============================================================

let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined; // undefined = no buscado todavía

function getBestSpanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedVoice !== undefined) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prioridad decreciente de selección de voz
  const result =
    voices.find((v) => v.lang === 'es-AR' && v.localService) ||
    voices.find((v) => v.lang === 'es-AR') ||
    voices.find((v) => v.lang === 'es_AR') ||
    voices.find((v) => /diego|tomas|tomás|pedro|miguel/i.test(v.name)) ||
    voices.find((v) => v.lang === 'es-US' && v.localService) ||
    voices.find((v) => v.lang === 'es-US') ||
    voices.find((v) => v.lang.startsWith('es-') && !v.lang.includes('ES') && v.localService) ||
    voices.find((v) => v.lang.startsWith('es-') && !v.lang.includes('ES')) ||
    voices.find((v) => v.lang.startsWith('es-')) ||
    voices.find((v) => v.lang.startsWith('es')) ||
    null;

  cachedVoice = result;
  return result;
}

function speakArgentine(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-AR';
  utterance.rate = 1.02;   // Levemente más rápido para imitar la cadencia porteña
  utterance.pitch = 0.88;  // Tono más grave, masculino
  utterance.volume = 1.0;

  const doSpeak = () => {
    const voice = getBestSpanishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    doSpeak();
  } else {
    // Las voces pueden tardar en cargarse en algunos navegadores
    const handler = () => {
      cachedVoice = undefined; // reset cache para re-buscar
      window.speechSynthesis.onvoiceschanged = null;
      doSpeak();
    };
    window.speechSynthesis.onvoiceschanged = handler;
    // Fallback por si onvoiceschanged no dispara
    setTimeout(() => {
      if (!utterance.voice) {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      }
    }, 500);
  }
}

// ============================================================
// Componente SoundboardModal
// ============================================================

export default function SoundboardModal({ isOpen, onClose }: SoundboardModalProps) {
  // ⚠️ TODOS los hooks ANTES del early return (Rules of Hooks)
  const [currentCoplaIdx, setCurrentCoplaIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activePhrase, setActivePhrase] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceName, setVoiceName] = useState<string>('');
  const voicesLoadedRef = useRef(false);

  // Cargar nombre de la voz disponible cuando el modal se abre
  useEffect(() => {
    if (!isOpen || voicesLoadedRef.current) return;

    const load = () => {
      const v = getBestSpanishVoice();
      if (v) {
        setVoiceName(v.name.split(' ').slice(0, 2).join(' '));
        voicesLoadedRef.current = true;
      }
    };

    load();
    if (!voicesLoadedRef.current && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoice = undefined;
        load();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [isOpen]);

  const handlePlayPhrase = useCallback((phrase: string) => {
    if (isSpeaking) return;
    setActivePhrase(phrase);
    setIsSpeaking(true);
    sound.playClick();
    speakArgentine(phrase, () => {
      setIsSpeaking(false);
      setActivePhrase(null);
    });
  }, [isSpeaking]);

  const handleNextCopla = useCallback(() => {
    sound.playClick();
    setCurrentCoplaIdx((prev) => (prev + 1) % COPLAS_CRIOLLAS.length);
    setCopied(false);
  }, []);

  const handleSpeakCopla = useCallback(() => {
    if (isSpeaking) return;
    sound.playClick();
    setIsSpeaking(true);
    const copla = COPLAS_CRIOLLAS[currentCoplaIdx];
    speakArgentine(copla.verso.replace(/\n/g, ' '), () => setIsSpeaking(false));
  }, [isSpeaking, currentCoplaIdx]);

  const handleCopyCopla = useCallback(() => {
    const copla = COPLAS_CRIOLLAS[currentCoplaIdx];
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${copla.title}\n\n${copla.verso}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [currentCoplaIdx]);

  // Early return DESPUÉS de todos los hooks
  if (!isOpen) return null;

  const currentCopla = COPLAS_CRIOLLAS[currentCoplaIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="modal-container w-full max-w-xl max-h-[92vh] bg-stone-900 border border-amber-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-amber-900/40 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 transition-all ${isSpeaking ? 'animate-pulse scale-110' : ''}`}>
              <FontAwesomeIcon
                icon={isSpeaking ? faSpinner : faBullhorn}
                className={isSpeaking ? 'animate-spin' : ''}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-truco font-bold text-base sm:text-lg text-amber-200">
                  Soundboard & Coplas
                </h2>
                {isSpeaking ? (
                  <span className="text-[9px] font-mono font-bold bg-amber-900/60 text-amber-200 border border-amber-600/50 px-1.5 rounded-full flex items-center gap-1 animate-pulse">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[8px]" />
                    Hablando...
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold bg-sky-950/80 text-sky-300 border border-sky-700/50 px-1.5 rounded-full flex items-center gap-1">
                    <FontAwesomeIcon icon={faMicrophone} className="text-[8px]" />
                    🇦🇷 {voiceName || 'Voz ES-AR'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-400/60">
                Frases gauchescas, cantos y versos de Truco
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
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          {/* SECCIÓN 1: Coplas Criollas */}
          <section className="bg-stone-950/70 border border-amber-800/40 rounded-2xl p-3.5 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-amber-400">
                <FontAwesomeIcon icon={faScroll} />
                <span className="font-truco font-bold text-xs uppercase tracking-wider">
                  Coplas de Truco & Envido
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/40">
                {currentCopla.tanto}
              </span>
            </div>

            {/* Verso Card */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3 text-center my-2">
              <h4 className="font-truco font-bold text-xs text-amber-300 mb-1.5">
                "{currentCopla.title}"
              </h4>
              <p className="font-fileteado italic text-sm sm:text-base text-amber-100 whitespace-pre-line leading-relaxed">
                {currentCopla.verso}
              </p>
            </div>

            {/* Acciones de Copla */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <button
                onClick={handleNextCopla}
                className="flex-1 py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-amber-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 pop-btn"
              >
                <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
                <span>Otra Copla</span>
              </button>

              <button
                onClick={handleSpeakCopla}
                disabled={isSpeaking}
                className="flex-1 py-1.5 px-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 pop-btn"
              >
                <FontAwesomeIcon
                  icon={isSpeaking ? faSpinner : faVolumeHigh}
                  className={`text-[10px] ${isSpeaking ? 'animate-spin' : ''}`}
                />
                <span>{isSpeaking ? 'Hablando...' : 'Declarar'}</span>
              </button>

              <button
                onClick={handleCopyCopla}
                className="py-1.5 px-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold pop-btn"
                title="Copiar verso"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-emerald-400' : ''} />
              </button>
            </div>
          </section>

          {/* SECCIÓN 2: Botonera de Dichos y Cantos */}
          <section>
            <div className="flex items-center gap-1.5 mb-2.5">
              <FontAwesomeIcon icon={faBullhorn} className="text-amber-400 text-xs" />
              <h3 className="font-truco font-bold text-xs uppercase tracking-wider text-amber-300">
                Botonera de Dichos & Cantos Populares
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRUCO_PHRASES.map((phrase, idx) => {
                const isActive = activePhrase === phrase.text;

                return (
                  <button
                    key={idx}
                    onClick={() => handlePlayPhrase(phrase.text)}
                    disabled={isSpeaking && !isActive}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 pop-btn ${
                      isActive
                        ? 'bg-amber-500 border-yellow-300 text-stone-950 scale-105 shadow-lg font-black'
                        : isSpeaking
                        ? 'opacity-50 cursor-not-allowed bg-stone-950/70 border-stone-800 text-stone-400'
                        : phrase.category === 'truco'
                        ? 'bg-stone-950/70 border-amber-800/40 hover:border-amber-500 text-amber-100'
                        : phrase.category === 'envido'
                        ? 'bg-stone-950/70 border-sky-800/40 hover:border-sky-500 text-sky-100'
                        : 'bg-stone-950/70 border-stone-800 hover:border-stone-600 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <FontAwesomeIcon
                        icon={isActive ? faSpinner : phrase.icon}
                        className={`text-[10px] ${
                          isActive
                            ? 'text-stone-950 animate-spin'
                            : phrase.category === 'truco'
                            ? 'text-amber-400'
                            : phrase.category === 'envido'
                            ? 'text-sky-400'
                            : 'text-red-400'
                        }`}
                      />
                      <FontAwesomeIcon icon={faVolumeHigh} className="text-[9px] opacity-60" />
                    </div>
                    <span className="font-bold text-xs leading-tight">
                      {phrase.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
