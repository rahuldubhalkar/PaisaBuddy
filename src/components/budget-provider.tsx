'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
}

const initialTransactions: Transaction[] = [
  { id: '1', type: 'Income', category: 'Salary', amount: 50000, date: '2024-07-01' },
  { id: '2', type: 'Expense', category: 'Rent', amount: 15000, date: '2024-07-02' },
  { id: '3', type: 'Expense', category: 'Food', amount: 8000, date: '2024-07-05' },
  { id: '4', type: 'Expense', category: 'Travel', amount: 3000, date: '2024-07-10' },
];

const initialGoals: Goal[] = [
  { id: '1', name: 'Goa Trip', targetAmount: 25000, savedAmount: 10000 },
  { id: '2', name: 'New Phone', targetAmount: 80000, savedAmount: 35000 },
];

interface BudgetContextType {
    transactions: Transaction[];
    goals: Goal[];
    totalIncome: number;
    totalExpense: number;
    balance: number;
    handleAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
    handleAddGoal: (goal: Omit<Goal, 'id' | 'savedAmount'>) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [goals, setGoals] = useState<Goal[]>(initialGoals);

    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: (transactions.length + 1).toString(),
            date: new Date().toISOString().split('T')[0],
        };
        setTransactions(prev => [...prev, newTransaction]);
    };

    const handleAddGoal = (goal: Omit<Goal, 'id' | 'savedAmount'>) => {
        const newGoal: Goal = {
            ...goal,
            id: (goals.length + 1).toString(),
            savedAmount: 0,
        };
        setGoals(prev => [...prev, newGoal]);
    };

    const value = {
        transactions,
        goals,
        totalIncome,
        totalExpense,
        balance,
        handleAddTransaction,
        handleAddGoal,
    };

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
