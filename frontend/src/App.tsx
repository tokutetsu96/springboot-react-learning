import { useEffect, useState } from 'react'

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<User[]>
      })
      .then((data) => setUsers(data))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'エラーが発生しました'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Spring Boot + React + PostgreSQL</h1>
      <h2>ユーザー一覧</h2>
      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
      {!loading && !error && (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {(['ID', '名前', 'メール', '登録日時'] as const).map((h) => (
                <th key={h} style={{ border: '1px solid #ccc', padding: '8px', background: '#f5f5f5' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {new Date(user.createdAt).toLocaleString('ja-JP')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
