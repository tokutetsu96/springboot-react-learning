import { useEffect, useState } from 'react';
import { deleteTransaction, fetchTransactions } from '../api/transactions';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Transaction } from '../types';

const FIXED_USER_ID = 1;

export function TransactionListPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTransactions(FIXED_USER_ID, year, month)
      .then(setTransactions)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [year, month]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('削除しますか？')) return;
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>収支一覧</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={selectStyle}>
          {years.map((y) => <option key={y} value={y}>{y}年</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={selectStyle}>
          {months.map((m) => <option key={m} value={m}>{m}月</option>)}
        </select>
      </div>

      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : transactions.length === 0 ? (
        <p style={{ color: '#6b7280' }}>この月の収支データがありません</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={thStyle}>日付</th>
              <th style={thStyle}>カテゴリ</th>
              <th style={thStyle}>金額</th>
              <th style={thStyle}>説明</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={tdStyle}>{t.transactedOn}</td>
                <td style={tdStyle}>{t.category.name}</td>
                <td style={{ ...tdStyle, color: t.category.type === 'INCOME' ? '#2563eb' : '#dc2626', fontWeight: 600 }}>
                  {t.category.type === 'INCOME' ? '+' : '-'}{t.amount.toLocaleString()}円
                </td>
                <td style={tdStyle}>{t.description ?? '-'}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(t.id)} style={deleteBtnStyle}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = { padding: '6px 10px', borderRadius: 4, border: '1px solid #d1d5db' };
const thStyle: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: 14 };
const tdStyle: React.CSSProperties = { padding: '10px 12px', fontSize: 14 };
const deleteBtnStyle: React.CSSProperties = { padding: '4px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, cursor: 'pointer' };
