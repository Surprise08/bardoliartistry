import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const TypewriterText = ({ text, speed = 30, onComplete, className = '' }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

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
