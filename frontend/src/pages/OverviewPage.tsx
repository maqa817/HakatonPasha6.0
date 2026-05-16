import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function OverviewPage() {
  const { displayName } = useAuth()
  
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-full bg-mint-100 p-4">
        <svg
          className="h-12 w-12 text-mint-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-fg-950">Xoş gəlmisiniz, {displayName || 'Super Admin'}!</h2>
      <p className="max-w-md text-fg-600">
        Bu paneldən yeni Admin və Şöbə müdirləri yarada, onlara müvafiq regionlar
        və giriş məlumatları təyin edə bilərsiniz.
      </p>
      <div className="pt-4">
        <Link
          to="/users"
          className="inline-flex items-center rounded-xl bg-mint-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-mint-500"
        >
          İstifadəçiləri idarə et
        </Link>
      </div>
    </div>
  )
}
