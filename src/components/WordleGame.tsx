import React, { useState, useEffect, useCallback } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import GameGrid from './GameGrid';
import Keyboard from './Keyboard';
import ShareButton from './ShareButton';
import { WORD_LIST } from '../utils/wordList';
import { checkGuess, formatTime } from '../utils/gameUtils';

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [usedLetters, setUsedLetters] = useState<Record<string, 'correct' | 'present' | 'absent'>>({});

  // Initialize game
  useEffect(() => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord.toUpperCase());
    console.log('Target word:', randomWord.toUpperCase()); // For debugging
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && gameState === 'playing') {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [startTime, gameState]);

  const startTimer = useCallback(() => {
    if (!startTime) {
      setStartTime(Date.now());
    }
  }, [startTime]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      toast({
        title: "Invalid guess",
        description: "Word must be 5 letters long",
        variant: "destructive"
      });
      return;
    }

    if (!WORD_LIST.includes(currentGuess.toLowerCase())) {
      toast({
        title: "Invalid word",
        description: "Word not in dictionary",
        variant: "destructive"
      });
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Update used letters
    const guessResult = checkGuess(currentGuess, targetWord);
    const newUsedLetters = { ...usedLetters };
    
    currentGuess.split('').forEach((letter, index) => {
      const status = guessResult[index];
      if (!newUsedLetters[letter] || 
          (newUsedLetters[letter] === 'absent' && status !== 'absent') ||
          (newUsedLetters[letter] === 'present' && status === 'correct')) {
        newUsedLetters[letter] = status;
      }
    });
    
    setUsedLetters(newUsedLetters);
    setCurrentGuess('');

    // Check win condition
    if (currentGuess === targetWord) {
      setGameState('won');
      toast({
        title: "Congratulations! 🎉",
        description: `You solved it in ${formatTime(elapsedTime)}!`,
      });
    } else if (newGuesses.length >= 6) {
      setGameState('lost');
      toast({
        title: "Game Over",
        description: `The word was ${targetWord}`,
        variant: "destructive"
      });
    }
  }, [currentGuess, guesses, targetWord, usedLetters, elapsedTime]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return;

    startTimer();

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key.length === 1 && /[A-Z]/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [gameState, currentGuess.length, startTimer, submitGuess]);

  const resetGame = () => {
    const randomWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setTargetWord(randomWord.toUpperCase());
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setStartTime(null);
    setElapsedTime(0);
    setUsedLetters({});
    console.log('New target word:', randomWord.toUpperCase()); // For debugging
  };

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Wordle Timer</h1>
          <div className="flex items-center justify-center gap-2 text-2xl font-mono text-slate-600">
            <Timer className="w-6 h-6" />
            <span className="bg-white px-3 py-1 rounded-lg shadow-sm border">
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>

        {/* Game Grid */}
        <GameGrid 
          guesses={guesses}
          currentGuess={currentGuess}
          targetWord={targetWord}
        />

        {/* Keyboard */}
        <Keyboard 
          onKeyPress={handleKeyPress}
          usedLetters={usedLetters}
          disabled={gameState !== 'playing'}
        />

        {/* Game Over Actions */}
        {gameState !== 'playing' && (
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-2">
                {gameState === 'won' ? '🎉 You Won!' : '😔 Game Over'}
              </h2>
              <p className="text-slate-600 mb-2">
                {gameState === 'won' 
                  ? `Solved in ${formatTime(elapsedTime)}!` 
                  : `The word was: ${targetWord}`
                }
              </p>
              <p className="text-sm text-slate-500">
                Guesses: {guesses.length}/6
              </p>
            </div>
            <div className="space-y-2">
              <ShareButton 
                gameState={gameState}
                elapsedTime={elapsedTime}
                guesses={guesses}
                targetWord={targetWord}
              />
              <Button onClick={resetGame} className="w-full">
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordleGame;
