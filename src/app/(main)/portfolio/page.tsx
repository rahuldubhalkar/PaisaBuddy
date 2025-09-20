'use client';

import React, { useState } from 'react';
import { IndianRupee, Minus, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

export default function PortfolioPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [virtualCash, setVirtualCash] = useState<number>(100000);

  const totalPortfolioValue = assets.reduce(
    (acc, asset) => acc + asset.quantity * asset.currentPrice,
    0
  );

  const totalInvestment = assets.reduce(
    (acc, asset) => acc + asset.quantity * asset.avgPrice,
    0
  );

  const totalGainLoss = totalPortfolioValue - totalInvestment;
  const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Virtual Portfolio</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPortfolioValue.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Virtual Cash</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{virtualCash.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvestment.toLocaleString('en-IN')}</div>
          </CardContent>
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
            <p className={`text-xs ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Day's P&L</TableHead>
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
                    <TableCell>
                      <Badge variant={asset.type === 'Stock' ? 'default' : 'secondary'}>{asset.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{asset.quantity}</TableCell>
                    <TableCell className="text-right">₹{asset.currentPrice.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">₹{totalValue.toLocaleString('en-IN')}</TableCell>
                    <TableCell className={`text-right font-medium ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                       {gainLoss >= 0 ? '+' : ''}₹{gainLoss.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="sm"><Plus className="mr-1 h-4 w-4" /> Buy</Button>
                      <Button variant="outline" size="sm"><Minus className="mr-1 h-4 w-4" /> Sell</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
