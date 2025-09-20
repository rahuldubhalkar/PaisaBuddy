'use client';

import React from 'react';
import { PlusCircle, Target, PiggyBank, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudget } from '@/components/budget-provider';
import { useToast } from '@/hooks/use-toast';


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

function AddContributionDialog({ goalId }: { goalId: string }) {
    const { addContributionToGoal, unallocatedBalance } = useBudget();
    const { toast } = useToast();
    const [amount, setAmount] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleSubmit = () => {
        const contributionAmount = parseFloat(amount);
        if (contributionAmount > 0) {
            addContributionToGoal(goalId, contributionAmount);
            toast({
                title: "Contribution Added",
                description: `₹${contributionAmount.toLocaleString('en-IN')} has been added to your goal.`,
            });
            setAmount('');
            setOpen(false);
        } else {
             toast({
                title: "Invalid Amount",
                description: "Please enter a positive amount to contribute.",
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Contribution
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Contribution</DialogTitle>
                    <DialogDescription>Manually add funds to this goal.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" placeholder="₹" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSubmit}>Contribute</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
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
  const { transactions, goals, totalIncome, totalExpense, balance, unallocatedBalance, allocateSavingsToGoals } = useBudget();
  const { toast } = useToast();

  const handleAllocate = () => {
    allocateSavingsToGoals();
    toast({
      title: "Savings Allocated",
      description: "Your unallocated balance has been distributed to your goals.",
    });
  };

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
                <CardHeader><CardTitle>Net Balance</CardTitle></CardHeader>
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
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Your Financial Goals</CardTitle>
                        <CardDescription>Track your progress towards your savings goals.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {unallocatedBalance > 0 && (
                             <Button onClick={handleAllocate}>
                                <PiggyBank className="mr-2 h-4 w-4"/> Allocate ₹{unallocatedBalance.toLocaleString('en-IN')}
                            </Button>
                        )}
                        <AddGoalDialog />
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    {goals.map(goal => {
                        const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
                        const isCompleted = goal.savedAmount >= goal.targetAmount;
                        return (
                            <Card key={goal.id}>
                                <CardHeader className="flex flex-row justify-between items-start">
                                    <CardTitle>{goal.name}</CardTitle>
                                    {isCompleted && <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"><CheckCircle className="mr-1 h-3 w-3"/> Completed</Badge>}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xl font-bold text-primary">₹{goal.savedAmount.toLocaleString('en-IN')}</span>
                                        <span className="text-sm text-muted-foreground"> of ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <Progress value={progress} />
                                    <p className="text-right text-sm text-muted-foreground mt-1">{progress.toFixed(0)}% complete</p>
                                </CardContent>
                                <CardFooter>
                                    <AddContributionDialog goalId={goal.id} />
                                </CardFooter>
                            </Card>
                        )
                    })}
                     {goals.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center gap-4 text-center p-8 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven't set any financial goals yet.</p>
                            <AddGoalDialog />
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
