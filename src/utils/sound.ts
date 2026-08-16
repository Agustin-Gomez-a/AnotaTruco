// Web Audio API Synthesizer - Efectos de sonido realistas y táctiles sin dependencias externas

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    // Se inicializa en la primera interacción del usuario para cumplir con las políticas del navegador
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sonido de colocar un fósforo / ficha de madera
  playMatchDrop(theme: 'poker' | 'wood' | 'chalk' | 'coin' = 'poker') {
    if (this.isMuted) return;
    if (theme === 'coin') {
      this.playCoin();
      return;
    }
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    if (theme === 'chalk') {
      // Sonido de trazo de tiza en pizarra
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(3, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
      return;
    }

    // Sonido de fósforo / madera percusiva táctil
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    // Segundo armónico más agudo para el "clack" de madera
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, t);
    osc2.frequency.exponentialRampToValueAtTime(200, t + 0.03);

    gain2.gain.setValueAtTime(0.2, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.07);
    osc2.stop(t + 0.04);
  }

  // Sonido metálico de moneda antigua / patacón
  playCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1800, t);
    osc1.frequency.exponentialRampToValueAtTime(3200, t + 0.02);
    osc1.frequency.exponentialRampToValueAtTime(2400, t + 0.12);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3600, t);
    osc2.frequency.exponentialRampToValueAtTime(4800, t + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(3400, t + 0.15);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.16);
    osc2.stop(t + 0.16);
  }

  // Sonido de clic / tick de ruleta de sorteo
  playTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.02);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  // Detección y cache de voz argentina rioplatense
  private cachedArgVoice: SpeechSynthesisVoice | null = null;

  private getArgentineVoice(): SpeechSynthesisVoice | null {
    if (this.cachedArgVoice) return this.cachedArgVoice;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Prioridad 1: Voz explícitamente argentina (es-AR, es_AR o nombre con Argentina/Tomas/Diego/Isabela)
    const arVoice = voices.find(
      (v) =>
        v.lang === 'es-AR' ||
        v.lang === 'es_AR' ||
        v.name.toLowerCase().includes('argentin') ||
        v.name.toLowerCase().includes('tomas') ||
        v.name.toLowerCase().includes('diego')
    );
    if (arVoice) {
      this.cachedArgVoice = arVoice;
      return arVoice;
    }

    // Prioridad 2: Voces latinoamericanas (es-419, es-US, es-UY, es-CL, es-MX)
    const latamVoice = voices.find(
      (v) =>
        v.lang === 'es-419' ||
        v.lang === 'es-US' ||
        v.lang === 'es-UY' ||
        v.lang === 'es-CL' ||
        v.lang === 'es-MX'
    );
    if (latamVoice) {
      this.cachedArgVoice = latamVoice;
      return latamVoice;
    }

    // Prioridad 3: Cualquier voz en español
    const anyEs = voices.find((v) => v.lang.toLowerCase().startsWith('es'));
    if (anyEs) {
      this.cachedArgVoice = anyEs;
      return anyEs;
    }

    return null;
  }

  // Declamación o pronunciación de frase criolla con voz argentina y acorde criollo
  speakPhrase(phrase: string) {
    if (this.isMuted) return;

    // Tocar golpe/acorde criollo breve de fondo
    this.playGuitarStrum();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Cancelar locución anterior

      // Formatear texto con pausas naturales criollas
      const cleanPhrase = phrase.replace(/!/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'es-AR';
      utterance.rate = 0.98; // Cadencia pausada criolla
      utterance.pitch = 0.92; // Tono más grave / de gaucho
      utterance.volume = 1.0;

      const voice = this.getArgentineVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Evitar que el recolector de basura de Chrome corte el audio
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  // Acorde o rasguido criollo de guitarra sintetizado con Web Audio API
  playGuitarStrum() {
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Notas de rasguido criollo en Mi menor: E2, B2, E3, G3, B3, E4
    const stringFreqs = [82.41, 123.47, 164.81, 196.0, 246.94, 329.63];

    stringFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.015);

      gain.gain.setValueAtTime(0.001, t + idx * 0.015);
      gain.gain.linearRampToValueAtTime(0.12, t + idx * 0.015 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.015 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.015);
      osc.stop(t + idx * 0.015 + 0.38);
    });
  }

  // Sonido de clic / tick de ruleta de sorteo
  playTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.02);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  // Sonido al restar punto (madera que se desliza o borrado rápido)
  playRemove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Sonido de clic sutil de botón
  playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Fanfarria criolla / acorde triunfal al ganar el partido
  playWin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Acordes de guitarra / triunfo: C - E - G - C5
    const notes = [
      { freq: 261.63, delay: 0.0, dur: 0.8 }, // C4
      { freq: 329.63, delay: 0.1, dur: 0.8 }, // E4
      { freq: 392.00, delay: 0.2, dur: 0.8 }, // G4
      { freq: 523.25, delay: 0.35, dur: 1.4 }, // C5
      { freq: 659.25, delay: 0.45, dur: 1.6 }  // E5
    ];

    notes.forEach(({ freq, delay, dur }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.001, t + delay);
      gain.gain.linearRampToValueAtTime(0.25, t + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + dur + 0.05);
    });
  }
}

export const sound = new SoundEngine();

