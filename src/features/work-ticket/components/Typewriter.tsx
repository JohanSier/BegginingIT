import { useEffect, useState, useRef } from 'react';

interface TypewriterProps {
  text: string;
  onComplete: () => void;
  speed?: number;
}

export function Typewriter({ text, onComplete, speed = 20 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsComplete(true);
        onComplete();
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>}
    </span>
  );
}