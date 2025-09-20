'use client';

import React, { useState } from 'react';
import { PlusCircle, Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
}

interface Goal {
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

export default function BudgetPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Budgeting Tools</h1>
      <Tabs defaultValue="tracker">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="tracker">Expense Tracker</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
        </TabsList>
        <TabsContent value="tracker" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             <Card>
                <CardHeader><CardTitle>Total Income</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold text-green-500">₹{totalIncome.toLocaleString('en-IN')}</p></CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold text-red-500">₹{totalExpense.toLocaleString('en-IN')}</p></CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle>Balance</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">₹{balance.toLocaleString('en-IN')}</p></CardContent>
             </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A log of your income and expenses.</CardDescription>
              </div>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Badge variant={t.type === 'Income' ? 'outline' : 'destructive'}>{t.type}</Badge>
                      </TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell>{new Date(t.date).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell className={`text-right font-medium ${t.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                        {t.type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="goals" className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Financial Goals</CardTitle>
                        <CardDescription>Track your progress towards your savings goals.</CardDescription>
                    </div>
                    <Button><Target className="mr-2 h-4 w-4" /> Add New Goal</Button>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    {goals.map(goal => {
                        const progress = (goal.savedAmount / goal.targetAmount) * 100;
                        return (
                            <Card key={goal.id}>
                                <CardHeader>
                                    <CardTitle>{goal.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xl font-bold text-primary">₹{goal.savedAmount.toLocaleString('en-IN')}</span>
                                        <span className="text-sm text-muted-foreground"> of ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <Progress value={progress} />
                                    <p className="text-right text-sm text-muted-foreground mt-1">{progress.toFixed(0)}% complete</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
