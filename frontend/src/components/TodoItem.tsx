import { type ChangeEvent, type KeyboardEvent, useState } from 'react'
import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => Promise<void>
  onUpdateTitle: (todo: Todo, title: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function TodoItem({ todo, onToggle, onUpdateTitle, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const [busy, setBusy] = useState(false)

  const handleToggle = async () => {
    setBusy(true)
    try {
      await onToggle(todo)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    setBusy(true)
    try {
      await onDelete(todo.id)
    } finally {
      setBusy(false)
    }
  }

  const commitEdit = async () => {
    const trimmed = editValue.trim()
    if (!trimmed) {
      setEditValue(todo.title)
      setEditing(false)
      return
    }
    if (trimmed !== todo.title) {
      setBusy(true)
      try {
        await onUpdateTitle(todo, trimmed)
      } finally {
        setBusy(false)
      }
    }
    setEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') {
      setEditValue(todo.title)
      setEditing(false)
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={busy}
        className="todo-checkbox"
      />

      {editing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          maxLength={255}
          autoFocus
          className="todo-edit-input"
        />
      ) : (
        <span
          className="todo-title"
          onDoubleClick={() => {
            setEditValue(todo.title)
            setEditing(true)
          }}
        >
          {todo.title}
        </span>
      )}

      <button
        onClick={handleDelete}
        disabled={busy}
        className="btn btn-danger"
        aria-label={`${todo.title}を削除`}
      >
        削除
      </button>
    </li>
  )
}
