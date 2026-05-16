import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { token, role, login } = useAuth()
  const navigate = useNavigate()
  const [userId, setUserId] = useState('SA-ADMIN')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (token && role === 'SUPER_ADMIN') {
    return <Navigate to="/" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(userId.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş alınmadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/95 p-8 shadow-soft backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint-600">FreshGuard</p>
          <h1 className="mt-2 text-2xl font-semibold text-fg-950">Super Admin girişi</h1>
          <p className="mt-2 text-sm text-fg-500">
            Demo: <span className="font-mono text-fg-700">SA-ADMIN</span> /{' '}
            <span className="font-mono text-fg-700">SuperAdmin!2026</span>
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-fg-700">User ID</span>
            <input
              className="rounded-xl border border-fg-300/50 bg-surface px-3 py-2.5 outline-none ring-mint-400/40 transition focus:ring-2"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-fg-700">Şifrə</span>
            <input
              type="password"
              className="rounded-xl border border-fg-300/50 bg-surface px-3 py-2.5 outline-none ring-mint-400/40 transition focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? (
            <div className="rounded-xl border border-coral-400/40 bg-coral-400/10 px-3 py-2 text-sm text-coral-500">
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-mint-600 px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-mint-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Gözləyin…' : 'Daxil ol'}
          </button>
        </form>
      </div>
    </div>
  )
}
