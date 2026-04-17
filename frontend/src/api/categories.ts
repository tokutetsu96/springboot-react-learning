import { Category } from '../types';
import { client } from './client';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await client.get<Category[]>('/categories');
  return res.data;
};
