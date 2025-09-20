'use client';

import React, { useState } from 'react';
import { IndianRupee, TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type AssetType = 'Stock' | 'Mutual Fund';

interface Asset {
  id: string;
  name: string;
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

const initialAssets: Asset[] = [
  { id: '1', name: 'Reliance Industries', ticker: 'RELIANCE', type: 'Stock', quantity: 10, avgPrice: 2800, currentPrice: 2850.55 },
  { id: '2', name: 'Tata Consultancy Services', ticker: 'TCS', type: 'Stock', quantity: 15, avgPrice: 3800, currentPrice: 3855.20 },
  { id: '3', name: 'HDFC Bank', ticker: 'HDFCBANK', type: 'Stock', quantity: 20, avgPrice: 1500, currentPrice: 1480.75 },
  { id: '4', name: 'Parag Parikh Flexi Cap Fund', ticker: 'PPFCF', type: 'Mutual Fund', quantity: 50, avgPrice: 70, currentPrice: 75.50 },
  { id: '5', name: 'Axis Bluechip Fund', ticker: 'AXISBLUE', type: 'Mutual Fund', quantity: 100, avgPrice: 50, currentPrice: 52.80 },
];

function TradeDialog({ asset, action, onTrade, virtualCash }: { asset: Asset; action: 'Buy' | 'Sell'; onTrade: (asset: Asset, quantity: number, action: 'Buy' | 'Sell') => void; virtualCash: number }) {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const totalCost = quantity * asset.currentPrice;
  const maxSellable = asset.quantity;
  const maxBuyable = Math.floor(virtualCash / asset.currentPrice);

  const handleTrade = () => {
    if (action === 'Buy' && totalCost > virtualCash) {
      toast({
        title: 'Insufficient Funds',
        description: 'You do not have enough virtual cash to complete this transaction.',
        variant: 'destructive',
      });
      return;
    }
    if (action === 'Sell' && quantity > maxSellable) {
      toast({
        title: 'Invalid Quantity',
        description: 'You cannot sell more assets than you own.',
        variant: 'destructive',
      });
      return;
    }
    onTrade(asset, quantity, action);
    setOpen(false);
    toast({
        title: `Trade Successful`,
        description: `You have successfully ${action === 'Buy' ? 'bought' : 'sold'} ${quantity} unit(s) of ${asset.name}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {action === 'Buy' ? <Plus className="mr-1 h-4 w-4" /> : <Minus className="mr-1 h-4 w-4" />}
          {action}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action} {asset.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Current Price: ₹{asset.currentPrice.toLocaleString('en-IN')}</p>
          <p>Available Cash: ₹{virtualCash.toLocaleString('en-IN')}</p>
          {action === 'Sell' && <p>Owned Quantity: {asset.quantity}</p>}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">Quantity</Label>
            <Input 
              id="quantity" 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
              className="col-span-3"
              min="1"
              max={action === 'Buy' ? maxBuyable : maxSellable}
            />
          </div>
          <p className="text-right font-bold">Total: ₹{totalCost.toLocaleString('en-IN')}</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleTrade} disabled={(action === 'Buy' && totalCost > virtualCash) || (action === 'Sell' && quantity > maxSellable) || quantity <= 0}>
            Confirm {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const COLORS = ['#3F51B5', '#7E57C2', '#4CAF50', '#FFC107', '#F44336', '#2196F3'];

export default function PortfolioPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [virtualCash, setVirtualCash] = useState<number>(100000);

  const totalPortfolioValue = assets.reduce((acc, asset) => acc + asset.quantity * asset.currentPrice, 0);
  const totalInvestment = assets.reduce((acc, asset) => acc + asset.quantity * asset.avgPrice, 0);
  const totalGainLoss = totalPortfolioValue - totalInvestment;
  const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  const handleTrade = (tradedAsset: Asset, quantity: number, action: 'Buy' | 'Sell') => {
    const cost = quantity * tradedAsset.currentPrice;

    setAssets(prevAssets => {
      const existingAsset = prevAssets.find(a => a.id === tradedAsset.id);
      if (action === 'Buy') {
        setVirtualCash(vc => vc - cost);
        if (existingAsset) {
          return prevAssets.map(a => 
            a.id === tradedAsset.id 
              ? { ...a, 
                  avgPrice: ((a.avgPrice * a.quantity) + cost) / (a.quantity + quantity),
                  quantity: a.quantity + quantity }
              : a
          );
        } else {
          return [...prevAssets, { ...tradedAsset, quantity, avgPrice: tradedAsset.currentPrice }];
        }
      } else { // Sell
        setVirtualCash(vc => vc + cost);
        if (existingAsset && existingAsset.quantity > quantity) {
          return prevAssets.map(a => a.id === tradedAsset.id ? { ...a, quantity: a.quantity - quantity } : a);
        } else {
          return prevAssets.filter(a => a.id !== tradedAsset.id);
        }
      }
    });
  };

  const chartData = assets.map(asset => ({
    name: asset.ticker,
    value: asset.quantity * asset.currentPrice,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Virtual Portfolio</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Value</CardTitle><IndianRupee className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{totalPortfolioValue.toLocaleString('en-IN')}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Virtual Cash</CardTitle><IndianRupee className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{virtualCash.toLocaleString('en-IN')}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Investment</CardTitle><IndianRupee className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{totalInvestment.toLocaleString('en-IN')}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall P&L</CardTitle>
            {totalGainLoss >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <p className={`text-xs ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>{totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Your Assets</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-right">Overall P&L</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => {
                    const totalValue = asset.quantity * asset.currentPrice;
                    const gainLoss = (asset.currentPrice - asset.avgPrice) * asset.quantity;
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell><Badge variant={asset.type === 'Stock' ? 'default' : 'secondary'}>{asset.type}</Badge></TableCell>
                        <TableCell className="text-right">{asset.quantity}</TableCell>
                        <TableCell className="text-right">₹{asset.currentPrice.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">₹{totalValue.toLocaleString('en-IN')}</TableCell>
                        <TableCell className={`text-right font-medium ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {gainLoss >= 0 ? '+' : ''}₹{gainLoss.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                          <TradeDialog asset={asset} action="Buy" onTrade={handleTrade} virtualCash={virtualCash} />
                          <TradeDialog asset={asset} action="Sell" onTrade={handleTrade} virtualCash={virtualCash} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Visual breakdown of your investments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
