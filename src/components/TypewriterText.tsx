import { useEffect, useState, useRef, useCallback } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  enableSound?: boolean;
}

const TypewriterText = ({ text, speed = 30, onComplete, className = '', enableSound = true }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasCompletedRef = useRef(false);
  const textRef = useRef(text);

  // Reset when text changes
  useEffect(() => {
    if (textRef.current !== text) {
      textRef.current = text;
      hasCompletedRef.current = false;
      setDisplayedText('');
      setIsComplete(false);
    }
  }, [text]);

  const playTypeSound = useCallback(() => {
    if (!enableSound) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3000, ctx.currentTime);
      
      // Authentic typewriter sound - mechanical click with metal strike
      oscillator.type = 'square';
      const baseFreq = 80 + Math.random() * 40;
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.02);
      
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.04);
      
      // Add a secondary clack sound
      const clack = ctx.createOscillator();
      const clackGain = ctx.createGain();
      clack.connect(clackGain);
      clackGain.connect(ctx.destination);
      
      clack.type = 'sawtooth';
      clack.frequency.setValueAtTime(200 + Math.random() * 100, ctx.currentTime);
      clackGain.gain.setValueAtTime(0.02, ctx.currentTime);
      clackGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
      
      clack.start(ctx.currentTime + 0.005);
      clack.stop(ctx.currentTime + 0.025);
    } catch (e) {
      // Silently fail
    }
  }, [enableSound]);

  useEffect(() => {
    if (hasCompletedRef.current) return;
    
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        // Play sound for non-space characters
        if (text[index] !== ' ' && text[index] !== '\n') {
          playTypeSound();
        }
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete?.();
        }
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [text, speed, onComplete, playTypeSound]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`font-mono ${className}`}>
      <span className="whitespace-pre-wrap text-foreground/90">{displayedText}</span>
      {!isComplete && (
        <span className="inline-block w-2 h-5 bg-foreground/80 ml-1 animate-blink" />
      )}
    </div>
  );
};

export default TypewriterText;
