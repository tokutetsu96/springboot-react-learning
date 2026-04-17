import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../api/categories';
import { createTransaction } from '../api/transactions';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Category } from '../types';

const FIXED_USER_ID = 1;

export function TransactionFormPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactedOn, setTransactedOn] = useState(today);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(String(cats[0].id));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const validate = (): string | null => {
    const amountNum = Number(amount);
    if (!amount || !Number.isInteger(amountNum) || amountNum <= 0) return '金額は正の整数を入力してください';
    if (!transactedOn) return '日付を入力してください';
    if (transactedOn > today) return '未来の日付は入力できません';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSubmitting(true);
    setError(null);
    try {
      await createTransaction({
        userId: FIXED_USER_ID,
        categoryId: Number(categoryId),
        amount: Number(amount),
        description,
        transactedOn,
      });
      navigate('/');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ marginBottom: 24 }}>収支登録</h2>
      {error && <p style={{ color: '#dc2626', marginBottom: 12 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={labelStyle}>
          カテゴリ
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={inputStyle} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}（{c.type === 'INCOME' ? '収入' : '支出'}）
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          金額（円）
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            step={1}
            placeholder="例: 3000"
            style={inputStyle}
            required
          />
        </label>
        <label style={labelStyle}>
          日付
          <input
            type="date"
            value={transactedOn}
            onChange={(e) => setTransactedOn(e.target.value)}
            max={today}
            style={inputStyle}
            required
          />
        </label>
        <label style={labelStyle}>
          説明（任意）
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={255}
            placeholder="例: スーパーで食材購入"
            style={inputStyle}
          />
        </label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={submitting} style={submitBtnStyle}>
            {submitting ? '登録中...' : '登録'}
          </button>
          <button type="button" onClick={() => navigate('/')} style={cancelBtnStyle}>キャンセル</button>
        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14, fontWeight: 600, color: '#374151' };
const inputStyle: React.CSSProperties = { padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 14, fontWeight: 400 };
const submitBtnStyle: React.CSSProperties = { padding: '10px 24px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 };
const cancelBtnStyle: React.CSSProperties = { padding: '10px 24px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer' };
