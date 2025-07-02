export type GuessResult = 'correct' | 'present' | 'absent'

export function checkGuess(guess: string, target: string): GuessResult[] {
  const result: GuessResult[] = new Array(5).fill('absent')
  const targetChars = target.toLowerCase().split('')
  const guessChars = guess.toLowerCase().split('')
  
  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct'
      targetChars[i] = '*' // Mark as used
      guessChars[i] = '*' // Mark as used
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] !== '*') {
      const targetIndex = targetChars.indexOf(guessChars[i])
      if (targetIndex !== -1) {
        result[i] = 'present'
        targetChars[targetIndex] = '*' // Mark as used
      }
    }
  }
  
  return result
}