
export const checkGuess = (guess: string, target: string): ('correct' | 'present' | 'absent')[] => {
  const result: ('correct' | 'present' | 'absent')[] = new Array(5).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  
  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = '#'; // Mark as used
      guessLetters[i] = '#'; // Mark as processed
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] !== '#') {
      const targetIndex = targetLetters.indexOf(guessLetters[i]);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetLetters[targetIndex] = '#'; // Mark as used
      }
    }
  }
  
  return result;
};

export const formatTime = (milliseconds: number): string => {
  if (milliseconds === 0) return '0:00.00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};
