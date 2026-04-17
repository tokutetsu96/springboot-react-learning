import type { CreateTodoRequest, Todo, UpdateTodoRequest } from '../types/todo'

const BASE_URL = '/api/todos'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const todoApi = {
  getAll: () => request<Todo[]>(BASE_URL),

  create: (data: CreateTodoRequest) =>
    request<Todo>(BASE_URL, { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: UpdateTodoRequest) =>
    request<Todo>(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
}
