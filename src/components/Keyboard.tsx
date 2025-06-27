
import React from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters: Record<string, 'correct' | 'present' | 'absent'>;
  disabled: boolean;
}

const Keyboard = ({ onKeyPress, usedLetters, disabled }: KeyboardProps) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyClass = (key: string) => {
    const baseClass = "h-12 rounded-md font-semibold transition-all duration-200 active:scale-95";
    
    if (disabled) {
      return `${baseClass} bg-slate-200 text-slate-400 cursor-not-allowed`;
    }

    if (key === 'ENTER' || key === 'BACKSPACE') {
      return `${baseClass} px-2 bg-slate-600 hover:bg-slate-700 text-white text-xs`;
    }

    const status = usedLetters[key];
    switch (status) {
      case 'correct':
        return `${baseClass} w-10 bg-green-500 hover:bg-green-600 text-white`;
      case 'present':
        return `${baseClass} w-10 bg-yellow-500 hover:bg-yellow-600 text-white`;
      case 'absent':
        return `${baseClass} w-10 bg-slate-400 hover:bg-slate-500 text-white`;
      default:
        return `${baseClass} w-10 bg-slate-200 hover:bg-slate-300 text-slate-800`;
    }
  };

  const getKeyText = (key: string) => {
    if (key === 'BACKSPACE') return '⌫';
    return key;
  };

  return (
    <div className="space-y-2 p-4 bg-white rounded-xl shadow-sm border">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => !disabled && onKeyPress(key)}
              className={getKeyClass(key)}
              disabled={disabled}
            >
              {getKeyText(key)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
