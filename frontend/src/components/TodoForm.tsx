import { type FormEvent, useRef, useState } from 'react'

interface TodoFormProps {
  onAdd: (title: string) => Promise<void>
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const title = inputRef.current?.value.trim() ?? ''
    if (!title) return
    setSubmitting(true)
    try {
      await onAdd(title)
      if (inputRef.current) inputRef.current.value = ''
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        ref={inputRef}
        type="text"
        placeholder="新しいタスクを入力..."
        maxLength={255}
        disabled={submitting}
        className="todo-input"
      />
      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? '追加中...' : '追加'}
      </button>
    </form>
  )
}
