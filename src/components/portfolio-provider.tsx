'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AssetType = 'Stock' | 'Mutual Fund';

export interface Asset {
  id: string;
  name: string;
  ticker: string;
  type: AssetType;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

const initialAssets: Asset[] = [
  { id: 'RELIANCE', name: 'Reliance Industries', ticker: 'RELIANCE', type: 'Stock', quantity: 10, avgPrice: 2800, currentPrice: 2850.55 },
  { id: 'TCS', name: 'Tata Consultancy Services', ticker: 'TCS', type: 'Stock', quantity: 15, avgPrice: 3800, currentPrice: 3855.20 },
  { id: 'HDFCBANK', name: 'HDFC Bank', ticker: 'HDFCBANK', type: 'Stock', quantity: 20, avgPrice: 1500, currentPrice: 1480.75 },
  { id: 'PPFCF', name: 'Parag Parikh Flexi Cap Fund', ticker: 'PPFCF', type: 'Mutual Fund', quantity: 50, avgPrice: 70, currentPrice: 75.50 },
  { id: 'AXISBLUE', name: 'Axis Bluechip Fund', ticker: 'AXISBLUE', type: 'Mutual Fund', quantity: 100, avgPrice: 50, currentPrice: 52.80 },
];


interface PortfolioContextType {
    assets: Asset[];
    virtualCash: number;
    totalPortfolioValue: number;
    totalInvestment: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
    handleTrade: (assetId: string, quantity: number, action: 'Buy' | 'Sell') => void;
    addAsset: (asset: Asset) => void;
    hasAsset: (assetId: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [virtualCash, setVirtualCash] = useState<number>(100000);

    const totalPortfolioValue = assets.reduce((acc, asset) => acc + asset.quantity * asset.currentPrice, 0);
    const totalInvestment = assets.reduce((acc, asset) => acc + asset.quantity * asset.avgPrice, 0);
    const totalGainLoss = totalPortfolioValue - totalInvestment;
    const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    const handleTrade = (assetId: string, quantity: number, action: 'Buy' | 'Sell') => {
        setAssets(prevAssets => {
            const tradedAsset = prevAssets.find(a => a.id === assetId);
            if (!tradedAsset) return prevAssets;

            const cost = quantity * tradedAsset.currentPrice;

            if (action === 'Buy') {
                setVirtualCash(vc => vc - cost);
                const existingAsset = prevAssets.find(a => a.id === tradedAsset.id);
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
                const existingAsset = prevAssets.find(a => a.id === tradedAsset.id);
                if (!existingAsset) return prevAssets;

                const newQuantity = existingAsset.quantity - quantity;
                if (newQuantity > 0) {
                     return prevAssets.map(a => a.id === tradedAsset.id ? { ...a, quantity: newQuantity } : a);
                } else {
                     // Filter out the asset if quantity is 0 or less
                     const newAssets = prevAssets.filter(a => a.id !== tradedAsset.id);
                     // Add a new version of the asset with 0 quantity to keep it in discoverable list
                     return [...newAssets, {...tradedAsset, quantity: 0, avgPrice: 0}];
                }
            }
        });
    };
    
    const addAsset = (assetToAdd: Asset) => {
        setAssets(prevAssets => {
            const assetExists = prevAssets.some(asset => asset.id === assetToAdd.id);
            if (!assetExists) {
                return [...prevAssets, assetToAdd];
            }
            return prevAssets;
        });
    }

    const hasAsset = (assetId: string) => {
        return assets.some(asset => asset.id === assetId);
    }

    const value = {
        assets: assets.filter(asset => asset.quantity > 0),
        virtualCash,
        totalPortfolioValue,
        totalInvestment,
        totalGainLoss,
        totalGainLossPercentage,
        handleTrade,
        addAsset,
        hasAsset,
    };

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
