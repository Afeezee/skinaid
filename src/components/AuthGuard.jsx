import { Navigate, useLocation } from 'react-router-dom'

import LoadingSpinner from '@/components/LoadingSpinner'
import { useAuth } from '@/lib/auth'

export function AuthGuard({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner fullScreen message="Checking your session..." />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default AuthGuard