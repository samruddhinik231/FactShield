import React, { useEffect, useState } from 'react';

const TypingEffect = ({ text, delay = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index += 1;
      if (index === text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete(); // Trigger the onComplete callback
      }
    }, delay);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [text, delay, onComplete]);

  return (
    <div>
      {isTyping ? <span>{displayedText}|</span> : <span>{displayedText}</span>}
    </div>
  );
};

export default TypingEffect;
