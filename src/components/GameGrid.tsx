
import React from 'react';
import { checkGuess } from '../utils/gameUtils';

interface GameGridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
}

const GameGrid = ({ guesses, currentGuess, targetWord }: GameGridProps) => {
  const getTileClass = (letter: string, index: number, guess: string, isCurrentGuess: boolean) => {
    const baseClass = "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded-md transition-all duration-300";
    
    if (isCurrentGuess) {
      return letter 
        ? `${baseClass} border-slate-400 bg-white text-slate-800 scale-105` 
        : `${baseClass} border-slate-300 bg-white`;
    }
    
    if (!guess) {
      return `${baseClass} border-slate-300 bg-white`;
    }

    const result = checkGuess(guess, targetWord);
    const status = result[index];
    
    switch (status) {
      case 'correct':
        return `${baseClass} border-green-500 bg-green-500 text-white`;
      case 'present':
        return `${baseClass} border-yellow-500 bg-yellow-500 text-white`;
      case 'absent':
        return `${baseClass} border-slate-400 bg-slate-400 text-white`;
      default:
        return `${baseClass} border-slate-300 bg-white`;
    }
  };

  const renderRow = (guess: string, rowIndex: number, isCurrentGuess = false) => {
    const letters = guess.padEnd(5, ' ').split('');
    
    return (
      <div key={rowIndex} className="flex gap-2 justify-center">
        {letters.map((letter, colIndex) => (
          <div
            key={colIndex}
            className={getTileClass(letter.trim(), colIndex, guess, isCurrentGuess)}
          >
            {letter.trim()}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2 p-4 bg-white rounded-xl shadow-sm border">
      {/* Previous guesses */}
      {guesses.map((guess, index) => renderRow(guess, index))}
      
      {/* Current guess */}
      {guesses.length < 6 && renderRow(currentGuess, guesses.length, true)}
      
      {/* Empty rows */}
      {Array.from({ length: 6 - guesses.length - (guesses.length < 6 ? 1 : 0) }).map((_, index) => 
        renderRow('', guesses.length + index + (guesses.length < 6 ? 1 : 0))
      )}
    </div>
  );
};

export default GameGrid;
