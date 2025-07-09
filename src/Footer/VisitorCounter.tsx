import { useState, useEffect } from 'react';
import { AnimatedDigit } from './AnimatedDigit';

interface VisitorCounterProps {
  initialCount?: number;
  targetCount: number;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({ 
  initialCount = 0, 
  targetCount 
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        const diff = targetCount - prev;
        if (diff <= 0) return targetCount;
        return prev + Math.ceil(diff / 10);
      });
    }, 50);

    return () => clearInterval(timer);
  }, [targetCount]);

  const digits = count.toString().split('').map(Number);

  return (
    <div className="flex items-center justify-center space-x-2">
      <span className="text-sm text font-medium text-gray-600">Visitors:</span>
      <div className="flex">
        {digits.map((digit, index) => (
          <AnimatedDigit key={index} digit={digit} index={index} />
        ))}
      </div>
    </div>
  );
};