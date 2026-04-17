import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchCategorySummary, fetchMonthlySummary } from '../api/transactions';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CategorySummary, MonthlySummary } from '../types';

const FIXED_USER_ID = 1;
const PIE_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function SummaryPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [barData, setBarData] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const past6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(year, month - 1 - i, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    }).reverse();

    Promise.all([
      fetchMonthlySummary(FIXED_USER_ID, year, month),
      fetchCategorySummary(FIXED_USER_ID, year, month),
      Promise.all(past6Months.map(({ year: y, month: m }) => fetchMonthlySummary(FIXED_USER_ID, y, m))),
    ])
      .then(([s, cs, bar]) => {
        setSummary(s);
        setCategorySummary(cs);
        setBarData(bar);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [year, month]);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>サマリー</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={selectStyle}>
          {years.map((y) => <option key={y} value={y}>{y}年</option>)}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={selectStyle}>
          {months.map((m) => <option key={m} value={m}>{m}月</option>)}
        </select>
      </div>

      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {loading ? <LoadingSpinner /> : (
        <>
          {summary && (
            <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
              <SummaryCard label="収入合計" value={summary.totalIncome} color="#2563eb" />
              <SummaryCard label="支出合計" value={summary.totalExpense} color="#dc2626" />
              <SummaryCard label="残高" value={summary.balance} color={summary.balance >= 0 ? '#059669' : '#dc2626'} />
            </div>
          )}

          {categorySummary.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 12 }}>カテゴリ別支出</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categorySummary} dataKey="amount" nameKey="categoryName" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {categorySummary.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${Number(v).toLocaleString()}円`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {barData.length > 0 && (
            <div>
              <h3 style={{ marginBottom: 12 }}>過去6ヶ月の収支</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData.map((d) => ({ name: `${d.month}月`, 収入: d.totalIncome, 支出: d.totalExpense }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}万`} />
                  <Tooltip formatter={(v) => `${Number(v).toLocaleString()}円`} />
                  <Legend />
                  <Bar dataKey="収入" fill="#3b82f6" />
                  <Bar dataKey="支出" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: '1 1 160px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 20px' }}>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value.toLocaleString()}円</div>
    </div>
  );
}

const selectStyle: React.CSSProperties = { padding: '6px 10px', borderRadius: 4, border: '1px solid #d1d5db' };
