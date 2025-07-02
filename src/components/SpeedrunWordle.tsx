import { useState, useEffect, useCallback } from 'react'
import { useGame } from '@/contexts/GameContext'
import { useAuth } from '@/contexts/AuthContext'
import { WORD_LIST } from '@/utils/wordList'
import { checkGuess } from '@/utils/wordleLogic'
import GameGrid from './GameGrid'
import Keyboard from './Keyboard'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Timer, Trophy, Target, Zap, LogOut } from 'lucide-react'
import { toast } from 'sonner'

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function SpeedrunWordle() {
  const { user, signOut } = useAuth()
  const {
    gameSession,
    isGameActive,
    currentStreak,
    currentWord,
    elapsedTime,
    startGame,
    completeWord,
    failWord,
    loading,
  } = useGame()

  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [usedLetters, setUsedLetters] = useState<Record<string, 'correct' | 'present' | 'absent'>>({})

  // Reset game state when new word starts
  useEffect(() => {
    if (currentWord && gameSession) {
      setGuesses([])
      setCurrentGuess('')
      setGameState('playing')
      setUsedLetters({})
    }
  }, [currentWord, gameSession?.id])

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing' || !isGameActive) return

    if (key === 'ENTER') {
      handleSubmitGuess()
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (key.length === 1 && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key.toUpperCase())
    }
  }, [gameState, isGameActive, currentGuess])

  const handleSubmitGuess = async () => {
    if (currentGuess.length !== 5) {
      toast.error('Word must be 5 letters long')
      return
    }

    if (!WORD_LIST.includes(currentGuess.toLowerCase())) {
      toast.error('Word not in dictionary')
      return
    }

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    // Check if guess is correct
    if (currentGuess.toLowerCase() === currentWord.toLowerCase()) {
      setGameState('won')
      toast.success(`Correct! Moving to word ${currentStreak + 1}`)
      
      // Complete the word and move to next
      setTimeout(async () => {
        await completeWord()
      }, 1500)
    } else if (newGuesses.length >= 6) {
      setGameState('lost')
      toast.error(`Game over! The word was ${currentWord.toUpperCase()}`)
      
      // Fail the word and reset streak
      setTimeout(async () => {
        await failWord()
      }, 2000)
    }

    // Update used letters
    const guessResult = checkGuess(currentGuess, currentWord)
    const newUsedLetters = { ...usedLetters }
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i]
      const result = guessResult[i]
      // Only update if this is a better result or letter hasn't been used
      if (!newUsedLetters[letter] || 
          (result === 'correct') ||
          (result === 'present' && newUsedLetters[letter] === 'absent')) {
        newUsedLetters[letter] = result
      }
    }
    setUsedLetters(newUsedLetters)
    setCurrentGuess('')
  }

  const handleStartGame = async () => {
    await startGame()
    toast.success('Game started! Good luck!')
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
  }

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase()
      if (key === 'ENTER' || key === 'BACKSPACE') {
        handleKeyPress(key)
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  if (!isGameActive && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Wordle Speedrun Challenge
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Welcome, {user?.user_metadata?.username || user?.email}!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">How it works:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>🎯 Solve words in sequence to build your streak</p>
                <p>⏱️ Timer runs continuously across all words</p>
                <p>💥 Miss a word? Start over from streak 1</p>
                <p>🏆 Compete on leaderboards for each streak level</p>
              </div>
            </div>
            
            <Button 
              onClick={handleStartGame} 
              className="w-full"
              disabled={loading}
              size="lg"
            >
              <Target className="mr-2 h-5 w-5" />
              Start Challenge
            </Button>

            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full"
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with game info */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Speedrun Challenge
            </h1>
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <div>
                  <div className="text-xs text-gray-500">Streak</div>
                  <div className="font-bold text-lg">{currentStreak}</div>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="font-bold text-lg">{formatTime(elapsedTime)}</div>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-xs text-gray-500">Word</div>
                  <div className="font-bold text-lg">{currentStreak}</div>
                </div>
              </div>
            </Card>
          </div>

          {gameState === 'won' && (
            <Badge variant="default" className="w-full justify-center py-2 bg-green-500">
              ✓ Correct! Moving to next word...
            </Badge>
          )}

          {gameState === 'lost' && (
            <Badge variant="destructive" className="w-full justify-center py-2">
              ✗ Wrong! Resetting streak...
            </Badge>
          )}
        </div>

        {/* Game Grid */}
        <div className="mb-6">
          <GameGrid
            guesses={guesses}
            currentGuess={currentGuess}
            targetWord={currentWord}
          />
        </div>

        {/* Keyboard */}
        <Keyboard
          onKeyPress={handleKeyPress}
          usedLetters={usedLetters}
          disabled={gameState !== 'playing'}
        />
      </div>
    </div>
  )
}