import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

const linkBase =
  'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-2'

export function AppLayout({ children }: { children: ReactNode }) {
  const { displayName, logout } = useAuth()

  return (
    <div className="min-h-screen text-fg-900">
      <div className="mx-auto flex min-h-screen max-w-[1400px] gap-6 px-4 py-8 lg:px-8">
        <aside className="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-fg-500">
              FreshGuard
            </div>
            <h1 className="mt-1 font-semibold text-fg-950">Admin Panel</h1>
            <p className="mt-2 text-sm text-fg-500">Bravo əməliyyat izləmə</p>
          </div>
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-mint-100 text-fg-950 shadow-card' : 'text-fg-700 hover:bg-white/70'}`
              }
            >
              <span className="text-lg leading-none">◆</span> Ümumi görünüş
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-mint-100 text-fg-950 shadow-card' : 'text-fg-700 hover:bg-white/70'}`
              }
            >
              <span className="text-lg leading-none">◎</span> İstifadəçilər
            </NavLink>
          </nav>
          <div className="mt-auto rounded-2xl border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur">
            <div className="text-xs text-fg-500">Daxil olub</div>
            <div className="mt-1 font-medium text-fg-950">{displayName}</div>
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-lg border border-fg-300/40 px-3 py-2 text-sm font-medium text-fg-700 transition hover:border-coral-400 hover:text-coral-500"
            >
              Çıxış
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-fg-500">
                  FreshGuard Admin
                </div>
                <h1 className="text-lg font-semibold text-fg-950">{displayName}</h1>
              </div>
              <button
                type="button"
                onClick={logout}
                className="shrink-0 rounded-lg border border-fg-300/40 px-3 py-2 text-xs font-medium"
              >
                Çıxış
              </button>
            </div>
            <nav className="mt-4 flex flex-wrap gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-fg-300/25 ${
                    isActive ? 'bg-mint-100 text-fg-950' : 'bg-white/70 text-fg-700'
                  }`
                }
              >
                Ümumi
              </NavLink>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-fg-300/25 ${
                    isActive ? 'bg-mint-100 text-fg-950' : 'bg-white/70 text-fg-700'
                  }`
                }
              >
                İstifadəçilər
              </NavLink>
            </nav>
          </header>
          <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-soft backdrop-blur sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
