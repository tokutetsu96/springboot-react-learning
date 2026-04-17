import { CategorySummary, MonthlySummary, Transaction } from '../types';
import { client } from './client';

export type CreateTransactionPayload = {
  userId: number;
  categoryId: number;
  amount: number;
  description: string;
  transactedOn: string;
};

export const fetchTransactions = async (
  userId: number,
  year: number,
  month: number,
): Promise<Transaction[]> => {
  const res = await client.get<Transaction[]>('/transactions', {
    params: { userId, year, month },
  });
  return res.data;
};

export const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<Transaction> => {
  const res = await client.post<Transaction>('/transactions', payload);
  return res.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await client.delete(`/transactions/${id}`);
};

export const fetchMonthlySummary = async (
  userId: number,
  year: number,
  month: number,
): Promise<MonthlySummary> => {
  const res = await client.get<MonthlySummary>('/summary', {
    params: { userId, year, month },
  });
  return res.data;
};

export const fetchCategorySummary = async (
  userId: number,
  year: number,
  month: number,
): Promise<CategorySummary[]> => {
  const res = await client.get<CategorySummary[]>('/summary/category', {
    params: { userId, year, month },
  });
  return res.data;
};
