import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { WORD_LIST } from '@/utils/wordList'

interface GameSession {
  id: string
  currentStreak: number
  totalTime: number
  currentWord: string
  isActive: boolean
  startedAt: string
}

interface GameContextType {
  gameSession: GameSession | null
  isGameActive: boolean
  currentStreak: number
  totalTime: number
  currentWord: string
  elapsedTime: number
  startGame: () => Promise<void>
  completeWord: () => Promise<void>
  failWord: () => Promise<void>
  endGame: () => Promise<void>
  loading: boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (gameSession?.isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameSession?.isActive, startTime])

  // Load active game session on user login
  useEffect(() => {
    if (user) {
      loadActiveSession()
    } else {
      setGameSession(null)
      setElapsedTime(0)
      setStartTime(null)
    }
  }, [user])

  const loadActiveSession = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading game session:', error)
        return
      }

      if (data) {
        const session: GameSession = {
          id: data.id,
          currentStreak: data.current_streak,
          totalTime: data.total_time,
          currentWord: data.current_word,
          isActive: data.is_active,
          startedAt: data.started_at,
        }
        setGameSession(session)
        setStartTime(new Date(data.started_at))
        setElapsedTime(data.total_time)
      }
    } catch (error) {
      console.error('Error loading active session:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRandomWord = useCallback(() => {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  }, [])

  const startGame = async () => {
    if (!user) return

    setLoading(true)
    try {
      // End any existing active sessions
      await supabase
        .from('game_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true)

      const currentWord = getRandomWord()
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from('game_sessions')
        .insert([
          {
            user_id: user.id,
            current_streak: 1,
            total_time: 0,
            current_word: currentWord,
            is_active: true,
            started_at: now,
            updated_at: now,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error starting game:', error)
        return
      }

      const session: GameSession = {
        id: data.id,
        currentStreak: data.current_streak,
        totalTime: data.total_time,
        currentWord: data.current_word,
        isActive: data.is_active,
        startedAt: data.started_at,
      }

      setGameSession(session)
      setStartTime(new Date())
      setElapsedTime(0)
    } catch (error) {
      console.error('Error starting game:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeWord = async () => {
    if (!gameSession || !user) return

    setLoading(true)
    try {
      const currentTime = elapsedTime
      const newStreak = gameSession.currentStreak + 1
      const nextWord = getRandomWord()

      // Save to leaderboard
      const { error: leaderboardError } = await supabase
        .from('leaderboards')
        .insert([
          {
            user_id: user.id,
            username: user.user_metadata?.username || user.email || 'Anonymous',
            streak_level: gameSession.currentStreak,
            completion_time: currentTime,
            completed_at: new Date().toISOString(),
          },
        ])

      if (leaderboardError) {
        console.error('Error saving to leaderboard:', leaderboardError)
      }

      // Update game session for next word
      const { data, error } = await supabase
        .from('game_sessions')
        .update({
          current_streak: newStreak,
          total_time: currentTime,
          current_word: nextWord,
          updated_at: new Date().toISOString(),
        })
        .eq('id', gameSession.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating game session:', error)
        return
      }

      const updatedSession: GameSession = {
        id: data.id,
        currentStreak: data.current_streak,
        totalTime: data.total_time,
        currentWord: data.current_word,
        isActive: data.is_active,
        startedAt: data.started_at,
      }

      setGameSession(updatedSession)
      // Don't reset timer - it continues for the next word
    } catch (error) {
      console.error('Error completing word:', error)
    } finally {
      setLoading(false)
    }
  }

  const failWord = async () => {
    if (!gameSession || !user) return

    setLoading(true)
    try {
      // End current session
      await supabase
        .from('game_sessions')
        .update({ is_active: false })
        .eq('id', gameSession.id)

      setGameSession(null)
      setElapsedTime(0)
      setStartTime(null)
    } catch (error) {
      console.error('Error failing word:', error)
    } finally {
      setLoading(false)
    }
  }

  const endGame = async () => {
    if (!gameSession) return

    setLoading(true)
    try {
      await supabase
        .from('game_sessions')
        .update({ is_active: false })
        .eq('id', gameSession.id)

      setGameSession(null)
      setElapsedTime(0)
      setStartTime(null)
    } catch (error) {
      console.error('Error ending game:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    gameSession,
    isGameActive: gameSession?.isActive || false,
    currentStreak: gameSession?.currentStreak || 0,
    totalTime: gameSession?.totalTime || 0,
    currentWord: gameSession?.currentWord || '',
    elapsedTime,
    startGame,
    completeWord,
    failWord,
    endGame,
    loading,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}