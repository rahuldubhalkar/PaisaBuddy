'use client';

import React from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudget } from '@/components/budget-provider';


function AddTransactionDialog() {
    const { handleAddTransaction } = useBudget();
    const [type, setType] = React.useState<'Income' | 'Expense'>('Expense');
    const [category, setCategory] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleSubmit = () => {
        if (category && amount) {
            handleAddTransaction({ type, category, amount: parseFloat(amount) });
            setCategory('');
            setAmount('');
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Transaction</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select onValueChange={(value: 'Income' | 'Expense') => setType(value)} defaultValue={type}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Income">Income</SelectItem>
                                <SelectItem value="Expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" placeholder="e.g., Food, Salary" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="₹" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSubmit}>Add Transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AddGoalDialog() {
    const { handleAddGoal } = useBudget();
    const [name, setName] = React.useState('');
    const [targetAmount, setTargetAmount] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleSubmit = () => {
        if (name && targetAmount) {
            handleAddGoal({ name, targetAmount: parseFloat(targetAmount) });
            setName('');
            setTargetAmount('');
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Target className="mr-2 h-4 w-4" /> Add New Goal</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Financial Goal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goal-name" className="text-right">Goal Name</Label>
                        <Input id="goal-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Buy a laptop" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="target-amount" className="text-right">Target Amount</Label>
                        <Input id="target-amount" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="col-span-3" placeholder="₹" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSubmit}>Add Goal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function BudgetPage() {
  const { transactions, goals, totalIncome, totalExpense, balance } = useBudget();

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
              <AddTransactionDialog />
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
                  {[...transactions].reverse().map(t => (
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
                     <AddGoalDialog />
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
