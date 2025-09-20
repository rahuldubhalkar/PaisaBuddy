'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    allPortfolioAssets: Asset[];
    heldAssets: Asset[];
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
    const [allPortfolioAssets, setAllPortfolioAssets] = useState<Asset[]>([]);
    const [virtualCash, setVirtualCash] = useState<number>(100000);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedAssets = localStorage.getItem('portfolioAssets');
            const storedCash = localStorage.getItem('virtualCash');
            if (storedAssets) {
                setAllPortfolioAssets(JSON.parse(storedAssets));
            } else {
                setAllPortfolioAssets(initialAssets);
            }
            if (storedCash) {
                setVirtualCash(JSON.parse(storedCash));
            } else {
                setVirtualCash(100000);
            }
        } catch (error) {
            console.error("Failed to load from localStorage", error);
            setAllPortfolioAssets(initialAssets);
            setVirtualCash(100000);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('portfolioAssets', JSON.stringify(allPortfolioAssets));
            localStorage.setItem('virtualCash', JSON.stringify(virtualCash));
        }
    }, [allPortfolioAssets, virtualCash, loading]);


    const heldAssets = allPortfolioAssets.filter(asset => asset.quantity > 0);

    const totalPortfolioValue = heldAssets.reduce((acc, asset) => acc + asset.quantity * asset.currentPrice, 0);
    const totalInvestment = heldAssets.reduce((acc, asset) => acc + asset.quantity * asset.avgPrice, 0);
    const totalGainLoss = totalPortfolioValue - totalInvestment;
    const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    const handleTrade = (assetId: string, quantity: number, action: 'Buy' | 'Sell') => {
        setAllPortfolioAssets(prevAssets => {
            const tradedAsset = prevAssets.find(a => a.id === assetId);
            if (!tradedAsset) return prevAssets;

            const cost = quantity * tradedAsset.currentPrice;

            if (action === 'Buy') {
                setVirtualCash(vc => vc - cost);
                return prevAssets.map(a => 
                    a.id === tradedAsset.id 
                    ? { ...a, 
                        avgPrice: ((a.avgPrice * a.quantity) + cost) / (a.quantity + quantity),
                        quantity: a.quantity + quantity }
                    : a
                );
            } else { // Sell
                setVirtualCash(vc => vc + cost);
                const existingAsset = prevAssets.find(a => a.id === tradedAsset.id);
                if (!existingAsset) return prevAssets;

                const newQuantity = existingAsset.quantity - quantity;
                return prevAssets.map(a => 
                    a.id === tradedAsset.id 
                    ? { ...a, quantity: newQuantity, avgPrice: newQuantity > 0 ? a.avgPrice : 0 } 
                    : a
                );
            }
        });
    };
    
    const addAsset = (assetToAdd: Asset) => {
        setAllPortfolioAssets(prevAssets => {
            const assetExists = prevAssets.some(asset => asset.id === assetToAdd.id);
            if (!assetExists) {
                return [...prevAssets, assetToAdd];
            }
            return prevAssets;
        });
    }

    const hasAsset = (assetId: string) => {
        return allPortfolioAssets.some(asset => asset.id === assetId);
    }

    const value = {
        allPortfolioAssets,
        heldAssets,
        virtualCash,
        totalPortfolioValue,
        totalInvestment,
        totalGainLoss,
        totalGainLossPercentage,
        handleTrade,
        addAsset,
        hasAsset,
    };

    if (loading) {
        return null; // Or a loading spinner
    }

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
