import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  createDepartment,
  createStore,
  fetchStores,
  updateDepartment,
  updateStore,
} from '../api/client'
import { useAuth } from '../context/AuthContext'
import { FOOD_CATEGORY_LABELS, type DepartmentResponse, type FoodCategory, type StoreRow } from '../types'

const ALL_CATEGORIES = Object.keys(FOOD_CATEGORY_LABELS) as FoodCategory[]

export function StoresPage() {
  const { token } = useAuth()
  const [stores, setStores] = useState<StoreRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const [newName, setNewName] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newRegion, setNewRegion] = useState('')

  const [editStore, setEditStore] = useState<StoreRow | null>(null)
  const [esName, setEsName] = useState('')
  const [esCity, setEsCity] = useState('')
  const [esRegion, setEsRegion] = useState('')

  const [deptStoreId, setDeptStoreId] = useState<string | null>(null)
  const [dName, setDName] = useState('')
  const [dHead, setDHead] = useState('')
  const [dCats, setDCats] = useState<FoodCategory[]>([])

  const [editDept, setEditDept] = useState<DepartmentResponse | null>(null)
  const [edName, setEdName] = useState('')
  const [edHead, setEdHead] = useState('')
  const [edCats, setEdCats] = useState<FoodCategory[]>([])

  const orderedStores = useMemo(
    () => [...stores].sort((a, b) => a.name.localeCompare(b.name, 'az')),
    [stores],
  )

  async function reload() {
    if (!token) {
      return
    }
    setLoading(true)
    setError(null)
    try {
      const list = await fetchStores(token)
      setStores(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xəta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function onCreateStore(e: FormEvent) {
    e.preventDefault()
    if (!token) {
      return
    }
    try {
      await createStore(token, {
        name: newName.trim(),
        city: newCity.trim(),
        regionCode: newRegion.trim(),
      })
      setNewName('')
      setNewCity('')
      setNewRegion('')
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    }
  }

  function openEditStore(s: StoreRow) {
    setEditStore(s)
    setEsName(s.name)
    setEsCity(s.city)
    setEsRegion(s.regionCode)
  }

  async function onSaveStore(e: FormEvent) {
    e.preventDefault()
    if (!token || !editStore) {
      return
    }
    try {
      await updateStore(token, editStore.id, {
        name: esName.trim(),
        city: esCity.trim(),
        regionCode: esRegion.trim(),
      })
      setEditStore(null)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    }
  }

  function openNewDept(storeId: string) {
    setDeptStoreId(storeId)
    setDName('')
    setDHead('')
    setDCats([])
  }

  async function onCreateDept(e: FormEvent) {
    e.preventDefault()
    if (!token || !deptStoreId) {
      return
    }
    if (dCats.length === 0) {
      setError('Ən azı bir kateqoriya seçin.')
      return
    }
    try {
      await createDepartment(token, deptStoreId, {
        name: dName.trim(),
        headName: dHead.trim(),
        categories: dCats,
      })
      setDeptStoreId(null)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    }
  }

  function openEditDept(d: DepartmentResponse) {
    setEditDept(d)
    setEdName(d.name)
    setEdHead(d.headName)
    setEdCats(d.categories as FoodCategory[])
  }

  async function onSaveDept(e: FormEvent) {
    e.preventDefault()
    if (!token || !editDept) {
      return
    }
    if (edCats.length === 0) {
      setError('Ən azı bir kateqoriya seçin.')
      return
    }
    try {
      await updateDepartment(token, editDept.id, {
        name: edName.trim(),
        headName: edHead.trim(),
        categories: edCats,
      })
      setEditDept(null)
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta')
    }
  }

  function toggleCat(list: FoodCategory[], setList: (v: FoodCategory[]) => void, c: FoodCategory) {
    if (list.includes(c)) {
      setList(list.filter((x) => x !== c))
    } else {
      setList([...list, c])
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-fg-950">Mağaza və şöbə strukturu</h2>
        <p className="mt-1 text-sm text-fg-500">
          Mağazalar, şöbə rəhbərləri və qida kateqoriyaları (brief üzrə 9 kateqoriya dəsti).
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-coral-400/40 bg-coral-400/10 px-3 py-2 text-sm text-coral-500">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={onCreateStore}
        className="grid gap-3 rounded-2xl border border-fg-300/15 bg-surface/80 p-5 shadow-card sm:grid-cols-2 lg:grid-cols-5"
      >
        <label className="flex flex-col gap-1 text-sm lg:col-span-2">
          <span className="text-fg-600">Mağaza adı</span>
          <input
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">Şəhər</span>
          <input
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-fg-600">Region kodu</span>
          <input
            className="rounded-lg border border-fg-300/40 bg-white px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
            value={newRegion}
            onChange={(e) => setNewRegion(e.target.value)}
            required
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-mint-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-mint-500"
          >
            + Mağaza əlavə et
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? <div className="text-sm text-fg-500">Yüklənir…</div> : null}
        {orderedStores.map((s) => {
          const open = expanded[s.id]
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-fg-300/15 bg-white/80 p-5 shadow-card"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-fg-950">{s.name}</h3>
                  <p className="text-sm text-fg-500">
                    {s.city} · {s.regionCode}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-fg-300/40 px-3 py-1.5 text-xs font-semibold text-fg-700 hover:bg-white"
                    onClick={() => setExpanded((m) => ({ ...m, [s.id]: !open }))}
                  >
                    {open ? 'Şöbələri gizlət' : 'Şöbələri göstər'}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-fg-300/40 px-3 py-1.5 text-xs font-semibold text-fg-700 hover:bg-white"
                    onClick={() => openEditStore(s)}
                  >
                    Mağazan redaktə et
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-mint-600/10 px-3 py-1.5 text-xs font-semibold text-mint-800 ring-1 ring-mint-400/30"
                    onClick={() => openNewDept(s.id)}
                  >
                    + Şöbə
                  </button>
                </div>
              </div>

              {open ? (
                <div className="mt-4 overflow-x-auto rounded-xl border border-fg-300/10">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-fg-950/[0.03] text-xs uppercase tracking-wide text-fg-500">
                      <tr>
                        <th className="px-4 py-3">Şöbə</th>
                        <th className="px-4 py-3">Rəhbər</th>
                        <th className="px-4 py-3">Kateqoriyalar</th>
                        <th className="px-4 py-3 text-right">Əməl.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-fg-300/15">
                      {s.departments.map((d) => (
                        <tr key={d.id}>
                          <td className="px-4 py-3 font-medium text-fg-900">{d.name}</td>
                          <td className="px-4 py-3 text-fg-600">{d.headName}</td>
                          <td className="px-4 py-3 text-xs text-fg-700">
                            {d.categories.map((c) => FOOD_CATEGORY_LABELS[c as FoodCategory] ?? c).join(' · ')}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              className="rounded-lg border border-fg-300/40 px-3 py-1 text-xs font-semibold"
                              onClick={() => openEditDept(d)}
                            >
                              Redaktə
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {editStore ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/80 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-fg-950">Mağaza redaktəsi</h3>
            <form className="mt-4 space-y-3" onSubmit={onSaveStore}>
              <label className="flex flex-col gap-1 text-sm">
                <span>Ad</span>
                <input
                  className="rounded-lg border border-fg-300/40 px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={esName}
                  onChange={(e) => setEsName(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>Şəhər</span>
                <input
                  className="rounded-lg border border-fg-300/40 px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={esCity}
                  onChange={(e) => setEsCity(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>Region kodu</span>
                <input
                  className="rounded-lg border border-fg-300/40 px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={esRegion}
                  onChange={(e) => setEsRegion(e.target.value)}
                  required
                />
              </label>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm text-fg-600"
                  onClick={() => setEditStore(null)}
                >
                  Ləğv
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-mint-600 px-4 py-2 text-sm font-semibold text-white hover:bg-mint-500"
                >
                  Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deptStoreId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/80 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-fg-950">Yeni şöbə</h3>
            <form className="mt-4 space-y-3" onSubmit={onCreateDept}>
              <label className="flex flex-col gap-1 text-sm">
                <span>Şöbə adı</span>
                <input
                  className="rounded-lg border border-fg-300/40 px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={dName}
                  onChange={(e) => setDName(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>Şöbə rəhbəri</span>
                <input
                  className="rounded-lg border border-fg-300/40 px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={dHead}
                  onChange={(e) => setDHead(e.target.value)}
                  required
                />
              </label>
              <div>
                <div className="text-sm font-medium text-fg-800">Kateqoriyalar</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {ALL_CATEGORIES.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm text-fg-700">
                      <input
                        type="checkbox"
                        checked={dCats.includes(c)}
                        onChange={() => toggleCat(dCats, setDCats, c)}
                      />
                      {FOOD_CATEGORY_LABELS[c]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm text-fg-600"
                  onClick={() => setDeptStoreId(null)}
                >
                  Ləğv
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-mint-600 px-4 py-2 text-sm font-semibold text-white hover:bg-mint-500"
                >
                  Əlavə et
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editDept ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/80 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-fg-950">Şöbə redaktəsi</h3>
            <form className="mt-4 space-y-3" onSubmit={onSaveDept}>
              <label className="flex flex-col gap-1 text-sm">
                <span>Şöbə adı</span>
                <input
                  className="rounded-lg border border-fg-300/40 px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={edName}
                  onChange={(e) => setEdName(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>Şöbə rəhbəri</span>
                <input
                  className="rounded-lg border border-fg-300/40 px-3 py-2 outline-none ring-mint-400/30 focus:ring-2"
                  value={edHead}
                  onChange={(e) => setEdHead(e.target.value)}
                  required
                />
              </label>
              <div>
                <div className="text-sm font-medium text-fg-800">Kateqoriyalar</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {ALL_CATEGORIES.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm text-fg-700">
                      <input
                        type="checkbox"
                        checked={edCats.includes(c)}
                        onChange={() => toggleCat(edCats, setEdCats, c)}
                      />
                      {FOOD_CATEGORY_LABELS[c]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm text-fg-600"
                  onClick={() => setEditDept(null)}
                >
                  Ləğv
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-mint-600 px-4 py-2 text-sm font-semibold text-white hover:bg-mint-500"
                >
                  Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
