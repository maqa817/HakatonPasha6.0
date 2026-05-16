import type {
  LoginResponse,
  OverviewSummary,
  StoreRow,
  UserRow,
} from '../types'

const API_BASE = ''

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      if (body?.error) {
        msg = typeof body.error === 'string' ? body.error : msg
      }
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

export function login(userId: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userId, password }),
  })
}

export function fetchOverview(token: string): Promise<OverviewSummary> {
  return apiFetch<OverviewSummary>('/api/admin/overview/summary', { token })
}

export function fetchUsers(token: string, activeOnly = false): Promise<UserRow[]> {
  const q = activeOnly ? 'activeOnly=true' : 'activeOnly=false'
  return apiFetch<UserRow[]>(`/api/admin/users?${q}`, { token })
}

export function createUser(
  token: string,
  payload: { firstName: string; lastName: string; filial: string; email: string; password: string; role: string },
): Promise<UserRow> {
  return apiFetch<UserRow>('/api/admin/users', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}

export function updateUser(
  token: string,
  userId: string,
  payload: { firstName: string; lastName: string; filial: string; email: string; newPassword?: string; role: string },
): Promise<UserRow> {
  return apiFetch<UserRow>(`/api/admin/users/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  })
}

export function deactivateUser(token: string, userId: string): Promise<void> {
  return apiFetch<void>(`/api/admin/users/${encodeURIComponent(userId)}/deactivate`, {
    method: 'PATCH',
    token,
  })
}

export function fetchStores(token: string): Promise<StoreRow[]> {
  return apiFetch<StoreRow[]>('/api/admin/stores', { token })
}

export function createStore(
  token: string,
  payload: { name: string; city: string; regionCode: string },
): Promise<StoreRow> {
  return apiFetch<StoreRow>('/api/admin/stores', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}

export function updateStore(
  token: string,
  storeId: string,
  payload: { name: string; city: string; regionCode: string },
): Promise<StoreRow> {
  return apiFetch<StoreRow>(`/api/admin/stores/${encodeURIComponent(storeId)}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  })
}

export function createDepartment(
  token: string,
  storeId: string,
  payload: { name: string; headName: string; categories: string[] },
): Promise<unknown> {
  return apiFetch(`/api/admin/stores/${encodeURIComponent(storeId)}/departments`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}

export function updateDepartment(
  token: string,
  departmentId: string,
  payload: { name: string; headName: string; categories: string[] },
): Promise<unknown> {
  return apiFetch(`/api/admin/stores/departments/${encodeURIComponent(departmentId)}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  })
}
