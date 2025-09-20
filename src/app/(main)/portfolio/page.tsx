'use client';

import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  ArrowRight,
  WalletCards,
} from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { usePortfolio, Asset } from '@/components/portfolio-provider';

function TradeDialog({
  asset,
  action,
}: {
  asset: Asset;
  action: 'Buy' | 'Sell';
}) {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { virtualCash, handleTrade } = usePortfolio();

  const totalCost = quantity * asset.currentPrice;
  const maxSellable = asset.quantity;
  const maxBuyable = Math.floor(virtualCash / asset.currentPrice);

  const onTrade = () => {
    const success = handleTrade(asset.id, quantity, action);
    if (success) {
        setOpen(false);
        toast({
        title: `Trade Successful`,
        description: `You have successfully ${
            action === 'Buy' ? 'bought' : 'sold'
        } ${quantity} unit(s) of ${asset.name}.`,
        });
    } else {
        toast({
            title: `Trade Failed`,
            description: `You don't have enough ${action === 'Buy' ? 'cash' : 'assets'} to complete this transaction.`,
            variant: 'destructive',
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
            variant={action === 'Buy' ? 'outline' : 'destructive'}
            size="sm"
        >
            {action === 'Buy' ? <Plus className="mr-1 h-4 w-4" /> : <Minus className="mr-1 h-4 w-4" />}
            {action}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action} {asset.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Current Price: ₹{asset.currentPrice.toLocaleString('en-IN')}</p>
          <p>Available Cash: ₹{virtualCash.toLocaleString('en-IN')}</p>
          {action === 'Sell' && <p>Owned Quantity: {asset.quantity}</p>}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="col-span-3"
              min="1"
              max={action === 'Buy' ? maxBuyable : maxSellable}
            />
          </div>
          <p className="text-right font-bold">
            Total: ₹{totalCost.toLocaleString('en-IN')}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onTrade}
            disabled={
              (action === 'Buy' && totalCost > virtualCash) ||
              (action === 'Sell' && quantity > maxSellable) ||
              quantity <= 0
            }
          >
            Confirm {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const COLORS = ['#3F51B5', '#7E57C2', '#4CAF50', '#FFC107', '#F44336', '#2196F3'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
    <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
    >
        {`${(percent * 100).toFixed(0)}%`}
    </text>
    );
};

export default function PortfolioPage() {
  const { allPortfolioAssets, heldAssets, virtualCash, totalPortfolioValue, totalInvestment, totalGainLoss, totalGainLossPercentage } = usePortfolio();
  
  const chartData = heldAssets.map((asset) => ({
      name: asset.ticker,
      value: asset.quantity * asset.currentPrice,
  }));
    
  const hasHoldings = heldAssets.length > 0;
  
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Virtual Portfolio</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalPortfolioValue.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Virtual Cash</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{virtualCash.toLocaleString('en-IN')}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/add-cash">
                <WalletCards className="mr-2 h-4 w-4" />
                Add Cash
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investment
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalInvestment.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall P&amp;L</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {totalGainLoss >= 0 ? '+' : ''}₹
              {totalGainLoss.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p
              className={`text-xs ${
                totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {totalGainLoss >= 0 ? '+' : ''}
              {totalGainLossPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
             {allPortfolioAssets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-right">Overall P&amp;L</TableHead>
                    <TableHead className="w-[200px] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPortfolioAssets.map((asset) => {
                    const totalValue = asset.quantity * asset.currentPrice;
                    const gainLoss =
                      asset.quantity > 0 ? (asset.currentPrice - asset.avgPrice) * asset.quantity : 0;
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          {asset.name}{' '}
                          <span className="text-xs text-muted-foreground">
                            {asset.ticker}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              asset.type === 'Stock' ? 'default' : 'secondary'
                            }
                          >
                            {asset.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {asset.quantity}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ₹{asset.currentPrice.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ₹{totalValue.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium font-mono ${
                            gainLoss > 0 ? 'text-green-500' : gainLoss < 0 ? 'text-red-500' : ''
                          }`}
                        >
                          {gainLoss > 0 ? '+' : ''}₹
                          {gainLoss.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center justify-center gap-2">
                            <TradeDialog asset={asset} action="Buy" />
                            { asset.quantity > 0 && <TradeDialog asset={asset} action="Sell" /> }
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-center p-8 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">Your portfolio is empty.</p>
                  <Button asChild>
                    <Link href="/discover">
                      Discover Assets <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='xl:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>
                Visual breakdown of your investments by asset.
              </CardDescription>
            </CardHeader>
            <CardContent>
            {hasHoldings ? (
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-center h-[350px]">
                    <p className="text-muted-foreground">No holdings to display.</p>
                    <p className="text-sm text-muted-foreground">Buy assets to see your allocation.</p>
                </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
