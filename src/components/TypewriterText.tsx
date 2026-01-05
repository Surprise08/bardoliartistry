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
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(120 + Math.random() * 80, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.025);
    } catch (e) {
      // Silently fail
    }
  }, [enableSound]);

  useEffect(() => {
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
        onComplete?.();
      }
    }, speed);

    return () => {
      clearInterval(interval);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [text, speed, onComplete, playTypeSound]);

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
