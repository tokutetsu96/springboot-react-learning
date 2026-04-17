import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SummaryPage } from './pages/SummaryPage';
import { TransactionFormPage } from './pages/TransactionFormPage';
import { TransactionListPage } from './pages/TransactionListPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TransactionListPage />} />
          <Route path="/transactions/new" element={<TransactionFormPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
