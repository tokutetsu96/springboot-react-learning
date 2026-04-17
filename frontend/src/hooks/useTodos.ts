import { useCallback, useEffect, useState } from 'react'
import { todoApi } from '../api/todoApi'
import type { Todo } from '../types/todo'

interface UseTodosResult {
  todos: Todo[]
  loading: boolean
  error: string | null
  addTodo: (title: string) => Promise<void>
  toggleTodo: (todo: Todo) => Promise<void>
  updateTitle: (todo: Todo, title: string) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
}

export function useTodos(): UseTodosResult {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    todoApi
      .getAll()
      .then(setTodos)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : '読み込みに失敗しました'),
      )
      .finally(() => setLoading(false))
  }, [])

  const addTodo = useCallback(async (title: string) => {
    const created = await todoApi.create({ title })
    setTodos((prev) => [created, ...prev])
  }, [])

  const toggleTodo = useCallback(async (todo: Todo) => {
    const updated = await todoApi.update(todo.id, {
      title: todo.title,
      completed: !todo.completed,
    })
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }, [])

  const updateTitle = useCallback(async (todo: Todo, title: string) => {
    const updated = await todoApi.update(todo.id, { title, completed: todo.completed })
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }, [])

  const deleteTodo = useCallback(async (id: number) => {
    await todoApi.delete(id)
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { todos, loading, error, addTodo, toggleTodo, updateTitle, deleteTodo }
}
