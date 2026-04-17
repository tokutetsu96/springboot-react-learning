import { useMemo, useState } from 'react'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { useTodos } from './hooks/useTodos'
import './App.css'

type Filter = 'all' | 'active' | 'completed'

function App() {
  const { todos, loading, error, addTodo, toggleTodo, updateTitle, deleteTodo } = useTodos()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <main className="app-main">
        <TodoForm onAdd={addTodo} />

        {error && <p className="error-message">エラー: {error}</p>}

        <div className="filter-bar">
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-filter ${filter === f ? 'active' : ''}`}
            >
              {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了済み'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="status-message">読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p className="status-message">タスクがありません</p>
        ) : (
          <ul className="todo-list">
            {filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onUpdateTitle={updateTitle}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}

        {!loading && todos.length > 0 && (
          <p className="todo-count">{remaining} 件の未完了タスク</p>
        )}
      </main>
    </div>
  )
}

export default App
