import { useState, useEffect } from 'react'

export interface MatchData {
  id: string
  packageId: string
  tripId: string
  senderId: string
  travelerId: string
  status: string
  agreedReward: number
  trackingCode?: string
  createdAt: string
  updatedAt: string
}

export interface UseMatchingReturn {
  matches: MatchData[]
  loading: boolean
  error: string | null
  acceptMatch: (matchId: string) => Promise<void>
  declineMatch: (matchId: string) => Promise<void>
  refreshMatches: () => Promise<void>
}

export function useMatching(): UseMatchingReturn {
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/matches', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch matches')
      }

      const data = await response.json()
      setMatches(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  const acceptMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to accept match')
      }

      // Refresh matches after accepting
      await refreshMatches()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const declineMatch = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to decline match')
      }

      // Refresh matches after declining
      await refreshMatches()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const refreshMatches = async () => {
    await fetchMatches()
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  return {
    matches,
    loading,
    error,
    acceptMatch,
    declineMatch,
    refreshMatches
  }
}