export type TransactionType = 'INCOME' | 'EXPENSE';

export type Category = {
  id: number;
  name: string;
  type: TransactionType;
};

export type Transaction = {
  id: number;
  userId: number;
  category: Category;
  amount: number;
  description: string | null;
  transactedOn: string;
  createdAt: string;
};

export type MonthlySummary = {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type CategorySummary = {
  categoryName: string;
  amount: number;
};
