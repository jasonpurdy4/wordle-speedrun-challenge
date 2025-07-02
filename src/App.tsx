import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { GameProvider } from '@/contexts/GameContext'
import Auth from '@/pages/Auth'
import SpeedrunWordle from '@/components/SpeedrunWordle'
import Leaderboard from '@/components/Leaderboard'
import { Button } from '@/components/ui/button'
import { Trophy, Target, LogOut } from 'lucide-react'
import './App.css'

const queryClient = new QueryClient()

function Navigation() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        onClick={() => window.location.href = '/'}
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm"
      >
        <Target className="h-4 w-4 mr-2" />
        Play
      </Button>
      <Button
        onClick={() => window.location.href = '/leaderboard'}
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm"
      >
        <Trophy className="h-4 w-4 mr-2" />
        Leaderboard
      </Button>
      <Button
        onClick={signOut}
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/" replace /> : <Auth />} 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SpeedrunWordle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GameProvider>
          <AppRoutes />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
                color: '#374151',
              },
            }}
          />
        </GameProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
