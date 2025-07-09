import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedDigitProps {
  digit: number;
  index: number;
}

const digitColors = [
  { bg: 'bg-blue-500', text: 'text-white' },
  { bg: 'bg-green-500', text: 'text-white' },
  { bg: 'bg-yellow-500', text: 'text-gray-900' },
  { bg: 'bg-red-500', text: 'text-white' },
  { bg: 'bg-purple-500', text: 'text-white' },
  { bg: 'bg-pink-500', text: 'text-white' },
  { bg: 'bg-indigo-500', text: 'text-white' },
  { bg: 'bg-teal-500', text: 'text-white' },
  { bg: 'bg-orange-500', text: 'text-white' },
  { bg: 'bg-cyan-500', text: 'text-white' },
];

export const AnimatedDigit: React.FC<AnimatedDigitProps> = ({ digit, index }) => {
  // Use modulo to cycle through colors if there are more digits than colors
  const colorIndex = index % digitColors.length;
  const { bg, text } = digitColors[colorIndex];

  return (
    <motion.span
      key={`${digit}-${index}`}
      initial={{ y: -20, opacity: 0, rotate: -10 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        rotate: 0,
        transition: { 
          type: 'spring',
          stiffness: 100,
          damping: 10
        }
      }}
      exit={{ y: 20, opacity: 0, rotate: 10 }}
      transition={{ duration: 0.3 }}
      className={`inline-block ${bg} ${text} px-2 mx-0.5 font-mono  shadow-lg`}
      style={{
        minWidth: '1.5rem',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      {digit}
    </motion.span>
  );
};