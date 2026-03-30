import { Category } from '@/types/transaction';

export const defaultCategories: Category[] = [
  // Expense categories
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', color: '24 95% 53%', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: '210 70% 50%', type: 'expense' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', color: '280 60% 55%', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '340 70% 55%', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Gamepad2', color: '190 70% 45%', type: 'expense' },
  { id: 'health', name: 'Health', icon: 'Heart', color: '0 72% 55%', type: 'expense' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: '250 60% 55%', type: 'expense' },
  { id: 'other-expense', name: 'Other', icon: 'MoreHorizontal', color: '220 10% 50%', type: 'expense' },
  // Income categories
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: '152 60% 45%', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '162 63% 41%', type: 'income' },
  { id: 'investment', name: 'Investment', icon: 'TrendingUp', color: '37 95% 55%', type: 'income' },
  { id: 'other-income', name: 'Other', icon: 'MoreHorizontal', color: '220 10% 50%', type: 'income' },
];
