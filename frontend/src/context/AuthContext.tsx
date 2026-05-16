import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { login as apiLogin } from '../api/client'

const TOKEN_KEY = 'fg_admin_token'
const DISPLAY_KEY = 'fg_admin_display'

export interface AuthState {
  token: string | null
  displayName: string | null
  role: string | null
}

interface AuthContextValue extends AuthState {
  login: (userId: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [displayName, setDisplayName] = useState<string | null>(() =>
    localStorage.getItem(DISPLAY_KEY),
  )
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('fg_admin_role'))

  const login = useCallback(async (userId: string, password: string) => {
    const res = await apiLogin(userId, password)
    // Removed the restriction to only allow SUPER_ADMIN
    localStorage.setItem(TOKEN_KEY, res.accessToken)
    localStorage.setItem(DISPLAY_KEY, res.displayName)
    localStorage.setItem('fg_admin_role', res.role)
    setToken(res.accessToken)
    setDisplayName(res.displayName)
    setRole(res.role)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(DISPLAY_KEY)
    localStorage.removeItem('fg_admin_role')
    setToken(null)
    setDisplayName(null)
    setRole(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      displayName,
      role,
      login,
      logout,
    }),
    [token, displayName, role, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
