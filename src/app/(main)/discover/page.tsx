'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { usePortfolio } from '@/components/portfolio-provider';
import { useToast } from '@/hooks/use-toast';

const allAssets = [
  {
    id: 'RELIANCE',
    name: 'Reliance Industries',
    ticker: 'RELIANCE',
    type: 'Stock',
    currentPrice: 2850.55,
    change: 1.2,
    sector: 'Energy',
  },
  {
    id: 'TCS',
    name: 'Tata Consultancy Services',
    ticker: 'TCS',
    type: 'Stock',
    currentPrice: 3855.2,
    change: -0.5,
    sector: 'IT',
  },
  {
    id: 'HDFCBANK',
    name: 'HDFC Bank',
    ticker: 'HDFCBANK',
    type: 'Stock',
    currentPrice: 1480.75,
    change: 2.1,
    sector: 'Banking',
  },
  {
    id: 'PPFCF',
    name: 'Parag Parikh Flexi Cap Fund',
    ticker: 'PPFCF',
    type: 'Mutual Fund',
    currentPrice: 75.5,
    change: 0.8,
    category: 'Flexi Cap',
  },
  {
    id: 'AXISBLUE',
    name: 'Axis Bluechip Fund',
    ticker: 'AXISBLUE',
    type: 'Mutual Fund',
    currentPrice: 52.8,
    change: 1.1,
    category: 'Large Cap',
  },
  {
    id: 'INFY',
    name: 'Infosys',
    ticker: 'INFY',
    type: 'Stock',
    currentPrice: 1550.0,
    change: -1.8,
    sector: 'IT',
  },
  {
    id: 'ICICIBANK',
    name: 'ICICI Bank',
    ticker: 'ICICIBANK',
    type: 'Stock',
    currentPrice: 1100.45,
    change: 0.9,
    sector: 'Banking',
  },
  {
    id: 'QUANTSC',
    name: 'Quant Small Cap Fund',
    ticker: 'QUANTSC',
    type: 'Mutual Fund',
    currentPrice: 250.7,
    change: 2.5,
    category: 'Small Cap',
  },
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = allAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stocks = filteredAssets.filter((a) => a.type === 'Stock');
  const mutualFunds = filteredAssets.filter((a) => a.type === 'Mutual Fund');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Discover Assets</h1>
        <p className="text-muted-foreground">
          Explore Indian stocks and mutual funds to add to your virtual
          portfolio.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or ticker..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 md:w-[500px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="mutual-funds">Mutual Funds</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AssetGrid assets={filteredAssets} />
        </TabsContent>
        <TabsContent value="stocks">
          <AssetGrid assets={stocks} />
        </TabsContent>
        <TabsContent value="mutual-funds">
          <AssetGrid assets={mutualFunds} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AssetGrid({ assets }: { assets: typeof allAssets }) {
  const { addAsset, hasAsset } = usePortfolio();
  const { toast } = useToast();

  const handleAddAsset = (asset: (typeof allAssets)[0]) => {
    addAsset({
      id: asset.id,
      name: asset.name,
      ticker: asset.ticker,
      type: asset.type as 'Stock' | 'Mutual Fund',
      currentPrice: asset.currentPrice,
      quantity: 0,
      avgPrice: 0,
    });
    toast({
      title: `${asset.name} added to portfolio`,
      description: 'You can now buy this asset from your portfolio page.',
    });
  };

  if (assets.length === 0) {
    return (
      <p className="mt-8 text-center text-muted-foreground">No assets found.</p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => {
        const alreadyInPortfolio = hasAsset(asset.id);
        return (
          <Card key={asset.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                  <CardDescription>{asset.ticker}</CardDescription>
                </div>
                <Badge variant={asset.type === 'Stock' ? 'default' : 'secondary'}>
                  {asset.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₹{asset.currentPrice.toLocaleString('en-IN')}
              </p>
              <div
                className={`flex items-center text-sm ${
                  asset.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {asset.change >= 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                <span>{asset.change.toFixed(2)}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {asset.type === 'Stock'
                  ? `Sector: ${asset.sector}`
                  : `Category: ${asset.category}`}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleAddAsset(asset)}
                disabled={alreadyInPortfolio}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {alreadyInPortfolio ? 'Added' : 'Add to Portfolio'}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}
