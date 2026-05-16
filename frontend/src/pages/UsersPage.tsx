import { FormEvent, useEffect, useState } from 'react'
import {
  createUser,
  deactivateUser,
  fetchUsers,
  updateUser,
} from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { UserRow } from '../types'
import { FILIAL_LIST } from '../types'

export function UsersPage() {
  const { token } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [activeOnly, setActiveOnly] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [creating, setCreating] = useState(false)
  const [fn, setFn] = useState('')
  const [ln, setLn] = useState('')
  const [filial, setFilial] = useState(FILIAL_LIST[0])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleSelect, setRoleSelect] = useState('MANAGER')

  const [edit, setEdit] = useState<UserRow | null>(null)
  const [editFn, setEditFn] = useState('')
  const [editLn, setEditLn] = useState('')
  const [editFilial, setEditFilial] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPw, setEditPw] = useState('')
  const [editRole, setEditRole] = useState('')

  async function reload() {
    if (!token) {
      return
    }
    setLoading(true)
    setError(null)
    try {
      const list = await fetchUsers(token, activeOnly)
      setUsers(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xəta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeOnly])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!token) {
      return
    }
    setCreating(true)
    setError(null)
    try {
      await createUser(token, {
        firstName: fn.trim(),
        lastName: ln.trim(),
        filial: filial,
        email: email.trim(),
        password,
        role: roleSelect,
      })
      setFn('')
      setLn('')
      setFilial(FILIAL_LIST[0])
      setEmail('')
      setPassword('')
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    } finally {
      setCreating(false)
    }
  }

  function openEdit(u: UserRow) {
    setEdit(u)
    setEditFn(u.firstName)
    setEditLn(u.lastName)
    setEditFilial(u.filial)
    setEditEmail(u.email || '')
    setEditRole(u.role)
    setEditPw('')
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault()
    if (!token || !edit) {
      return
    }
    setError(null)
    try {
      await updateUser(token, edit.userId, {
        firstName: editFn.trim(),
        lastName: editLn.trim(),
        filial: editFilial,
        email: editEmail.trim(),
        role: editRole,
        ...(editPw.length >= 8 ? { newPassword: editPw } : {}),
      })
      setEdit(null)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    }
  }

  async function onDeactivate(u: UserRow) {
    if (!token) {
      return
    }
    const ok = window.confirm(`${u.userId} istifadəçisini deaktiv edək?`)
    if (!ok) {
      return
    }
    setError(null)
    try {
      await deactivateUser(token, u.userId)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-fg-950">Reyon yetkililəri</h2>
          <p className="mt-1 text-sm text-fg-500">
            Yaradın, redaktə edin, deaktiv edin. User ID avtomatik generasiya olunur.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-fg-700">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Yalnız aktivlər
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-coral-400/40 bg-coral-400/10 px-3 py-2 text-sm text-coral-500">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-2xl border border-fg-300/15 bg-surface/80 p-5 shadow-card sm:grid-cols-2 lg:grid-cols-4"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">Ad</span>
          <input
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={fn}
            onChange={(e) => setFn(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">Soyad</span>
          <input
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={ln}
            onChange={(e) => setLn(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">Filial</span>
          <select
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={filial}
            onChange={(e) => setFilial(e.target.value)}
            required
          >
            {FILIAL_LIST.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">E-mail</span>
          <input
            type="email"
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">Vəzifə</span>
          <select
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={roleSelect}
            onChange={(e) => setRoleSelect(e.target.value)}
            required
          >
            <option value="MANAGER">Müdir</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">Şifrə (min. 8)</span>
          <input
            type="password"
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        <div className="flex items-end lg:col-span-2">
          <button
            type="submit"
            disabled={creating || loading}
            className="w-full rounded-lg bg-mint-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-mint-500 disabled:opacity-50"
          >
            + Yeni istifadəçi yarat
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-fg-300/15 bg-white shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-fg-950/[0.03] text-xs uppercase tracking-wide text-fg-500">
              <tr>
                <th className="px-5 py-3">Ad, soyad</th>
                <th className="px-5 py-3">E-mail</th>
                <th className="px-5 py-3">Filial</th>
                <th className="px-5 py-3">Vəzifə</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fg-300/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-fg-400">
                    Yüklənir…
                  </td>
                </tr>
              ) : null}
              {!loading &&
                users.map((u) => (
                  <tr key={u.userId} className="border-b border-fg-300/10 transition hover:bg-fg-300/5">
                    <td className="px-5 py-4 text-sm font-medium text-fg-950">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-5 py-4 text-sm text-fg-600">{u.email}</td>
                    <td className="px-5 py-4 text-sm text-fg-600">{u.filial}</td>
                    <td className="px-5 py-4 text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-mint-100 text-mint-700'
                        }`}
                      >
                        {u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role === 'ADMIN' ? 'Admin' : 'Müdir'}
                      </span>
                    </td>
                  <td className="px-5 py-4 text-sm text-fg-600">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        u.active ? 'bg-mint-500' : 'bg-fg-300'
                      }`}
                    />{' '}
                    {u.active ? 'Aktiv' : 'Deaktiv'}
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-mint-600 hover:text-mint-500"
                    >
                      Düzəliş et
                    </button>
                    {!u.active || u.role === 'SUPER_ADMIN' ? null : (
                      <button
                        onClick={() => onDeactivate(u)}
                        className="ml-4 text-coral-500 hover:text-coral-400"
                      >
                        Deaktiv et
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg-950/20 p-4 backdrop-blur-sm">
          <form
            onSubmit={onSaveEdit}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-soft"
          >
            <h3 className="text-xl font-semibold text-fg-950">İstifadəçi məlumatlarını yenilə</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-fg-600">Ad</span>
                <input
                  className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={editFn}
                  onChange={(e) => setEditFn(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-fg-600">Soyad</span>
                <input
                  className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={editLn}
                  onChange={(e) => setEditLn(e.target.value)}
                  required
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-fg-600">E-mail</span>
              <input
                type="email"
                className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-fg-600">Filial</span>
                <select
                  className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={editFilial}
                  onChange={(e) => setEditFilial(e.target.value)}
                  required
                >
                  {FILIAL_LIST.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-fg-600">Vəzifə</span>
                <select
                  className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  required
                >
                  <option value="MANAGER">Müdir</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-fg-600">Yeni şifrə (dəyişmək istəmirsinizsə boş saxlayın)</span>
              <input
                type="password"
                className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                value={editPw}
                onChange={(e) => setEditPw(e.target.value)}
                minLength={8}
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="flex-1 rounded-lg border border-fg-300/50 bg-white px-4 py-2 text-sm font-semibold text-fg-700 hover:bg-fg-50"
              >
                Ləğv et
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-mint-600 px-4 py-2 text-sm font-semibold text-white hover:bg-mint-500"
              >
                Yadda saxla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
