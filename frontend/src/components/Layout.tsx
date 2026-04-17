import { Link, useLocation } from 'react-router-dom';

type Props = { children: React.ReactNode };

export function Layout({ children }: Props) {
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', label: '収支一覧' },
    { to: '/transactions/new', label: '収支登録' },
    { to: '/summary', label: 'サマリー' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#1e40af', color: '#fff', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ fontWeight: 700, fontSize: 20 }}>家計簿</span>
        <nav style={{ display: 'flex', gap: 16 }}>
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                color: pathname === to ? '#fbbf24' : '#bfdbfe',
                textDecoration: 'none',
                fontWeight: pathname === to ? 700 : 400,
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>{children}</main>
    </div>
  );
}
