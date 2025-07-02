import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Trophy, Timer, Medal, Crown } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  username: string
  streak_level: number
  completion_time: number
  completed_at: string
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />
    default:
      return <div className="h-5 w-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</div>
  }
}

export default function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState<Record<number, LeaderboardEntry[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedStreak, setSelectedStreak] = useState(1)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    setLoading(true)
    try {
      // Get leaderboards for streaks 1-10
      const streakLevels = Array.from({ length: 10 }, (_, i) => i + 1)
      const leaderboardData: Record<number, LeaderboardEntry[]> = {}

      for (const level of streakLevels) {
        const { data, error } = await supabase
          .from('leaderboards')
          .select('*')
          .eq('streak_level', level)
          .order('completion_time', { ascending: true })
          .limit(10)

        if (error) {
          console.error(`Error fetching leaderboard for streak ${level}:`, error)
          continue
        }

        leaderboardData[level] = data || []
      }

      setLeaderboards(leaderboardData)
    } catch (error) {
      console.error('Error fetching leaderboards:', error)
    } finally {
      setLoading(false)
    }
  }

  const availableStreaks = Object.keys(leaderboards)
    .map(Number)
    .filter(level => leaderboards[level]?.length > 0)
    .sort((a, b) => a - b)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboards...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Leaderboards
          </h1>
          <p className="text-gray-600">
            See who's dominating each streak level
          </p>
        </div>

        {availableStreaks.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No records yet!</h3>
              <p className="text-gray-500">Be the first to complete a word and claim your spot on the leaderboard.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={selectedStreak.toString()} onValueChange={(value) => setSelectedStreak(Number(value))}>
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-6">
              {availableStreaks.slice(0, 10).map((level) => (
                <TabsTrigger key={level} value={level.toString()} className="text-xs">
                  Streak {level}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableStreaks.map((level) => (
              <TabsContent key={level} value={level.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Streak {level} Leaderboard
                      <Badge variant="secondary" className="ml-auto">
                        {leaderboards[level]?.length || 0} players
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboards[level]?.map((entry, index) => (
                        <div
                          key={entry.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            index === 0 ? 'bg-yellow-50 border-yellow-200' :
                            index === 1 ? 'bg-gray-50 border-gray-200' :
                            index === 2 ? 'bg-amber-50 border-amber-200' :
                            'bg-white border-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getRankIcon(index + 1)}
                            <div>
                              <div className="font-semibold text-gray-900">
                                {entry.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(entry.completed_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-blue-500" />
                            <span className="font-mono text-lg font-semibold">
                              {formatTime(entry.completion_time)}
                            </span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          No entries for this streak level yet.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}