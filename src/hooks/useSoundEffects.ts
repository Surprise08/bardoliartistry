import { useCallback, useRef, useEffect } from 'react';

// Simple audio context for generating sounds
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Silently fail if audio context is not available
    }
  }, [getAudioContext]);

  const playTypewriter = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(150 + Math.random() * 50, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.03);
    } catch (e) {
      // Silently fail if audio context is not available
    }
  }, [getAudioContext]);

  const playBackgroundMusic = useCallback(() => {
    try {
      if (bgMusicRef.current) {
        bgMusicRef.current.play();
        return;
      }
      
      const audio = new Audio('/bgmusic.mp3');
      audio.loop = true;
      audio.volume = 0.15;
      bgMusicRef.current = audio;
      audio.play().catch(() => {
        // Autoplay blocked, will try again on user interaction
      });
    } catch (e) {
      // Silently fail
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  }, []);

  return {
    playClick,
    playTypewriter,
    playBackgroundMusic,
    stopBackgroundMusic,
  };
};

export default useSoundEffects;