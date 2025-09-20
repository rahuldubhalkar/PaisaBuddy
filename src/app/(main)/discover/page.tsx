'use client'

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';

const allAssets = [
  { id: '1', name: 'Reliance Industries', ticker: 'RELIANCE', type: 'Stock', currentPrice: 2850.55, change: 1.2, sector: 'Energy' },
  { id: '2', name: 'Tata Consultancy Services', ticker: 'TCS', type: 'Stock', currentPrice: 3855.20, change: -0.5, sector: 'IT' },
  { id: '3', name: 'HDFC Bank', ticker: 'HDFCBANK', type: 'Stock', currentPrice: 1480.75, change: 2.1, sector: 'Banking' },
  { id: '4', name: 'Parag Parikh Flexi Cap Fund', ticker: 'PPFCF', type: 'Mutual Fund', currentPrice: 75.50, change: 0.8, category: 'Flexi Cap' },
  { id: '5', name: 'Axis Bluechip Fund', ticker: 'AXISBLUE', type: 'Mutual Fund', currentPrice: 52.80, change: 1.1, category: 'Large Cap' },
  { id: '6', name: 'Infosys', ticker: 'INFY', type: 'Stock', currentPrice: 1550.00, change: -1.8, sector: 'IT' },
  { id: '7', name: 'ICICI Bank', ticker: 'ICICIBANK', type: 'Stock', currentPrice: 1100.45, change: 0.9, sector: 'Banking' },
  { id: '8', name: 'Quant Small Cap Fund', ticker: 'QUANTSC', type: 'Mutual Fund', currentPrice: 250.70, change: 2.5, category: 'Small Cap' },
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssets = allAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stocks = filteredAssets.filter(a => a.type === 'Stock');
  const mutualFunds = filteredAssets.filter(a => a.type === 'Mutual Fund');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Discover Assets</h1>
        <p className="text-muted-foreground">Explore Indian stocks and mutual funds to add to your virtual portfolio.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
          <div>
            <AssetGrid assets={filteredAssets} />
          </div>
        </TabsContent>
        <TabsContent value="stocks">
          <div>
            <AssetGrid assets={stocks} />
          </div>
        </TabsContent>
        <TabsContent value="mutual-funds">
          <div>
            <AssetGrid assets={mutualFunds} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AssetGrid({ assets }: { assets: typeof allAssets }) {
  if (assets.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No assets found.</p>
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map(asset => (
        <Card key={asset.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{asset.name}</CardTitle>
                <CardDescription>{asset.ticker}</CardDescription>
              </div>
              <Badge variant={asset.type === 'Stock' ? 'default' : 'secondary'}>{asset.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{asset.currentPrice.toLocaleString('en-IN')}</p>
            <div className={`flex items-center text-sm ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {asset.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>{asset.change.toFixed(2)}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {asset.type === 'Stock' ? `Sector: ${asset.sector}` : `Category: ${asset.category}`}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Portfolio
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
