'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IndianRupee, CreditCard, Landmark, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePortfolio } from '@/components/portfolio-provider';

export default function AddCashPage() {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { addCash } = usePortfolio();

  const handleAddCash = (paymentMethod: string) => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      addCash(numericAmount);
      toast({
        title: 'Payment Successful',
        description: `₹${numericAmount.toLocaleString('en-IN')} has been added to your virtual cash via ${paymentMethod}.`,
      });
      router.push('/portfolio');
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Add Virtual Cash</CardTitle>
            <CardDescription>
              Simulate adding funds to your portfolio. Choose an amount and a mock payment method.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Add (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 text-lg"
                  disabled={isProcessing}
                />
              </div>
            </div>
            
            <div className="space-y-4">
                 <Label>Select Payment Method</Label>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button variant="outline" size="lg" className="h-auto py-4" disabled={isProcessing} onClick={() => handleAddCash('Google Pay')}>
                        <div className="flex flex-col items-center gap-2">
                            <CreditCard className="h-8 w-8" />
                            <span>Google Pay</span>
                        </div>
                    </Button>
                     <Button variant="outline" size="lg" className="h-auto py-4" disabled={isProcessing} onClick={() => handleAddCash('PhonePe')}>
                        <div className="flex flex-col items-center gap-2">
                            <Smartphone className="h-8 w-8" />
                            <span>PhonePe</span>
                        </div>
                    </Button>
                     <Button variant="outline" size="lg" className="h-auto py-4" disabled={isProcessing} onClick={() => handleAddCash('UPI')}>
                        <div className="flex flex-col items-center gap-2">
                            <Landmark className="h-8 w-8" />
                            <span>UPI / Bank</span>
                        </div>
                    </Button>
                 </div>
            </div>

          </CardContent>
          {isProcessing && (
             <CardFooter>
                <div className="w-full flex items-center justify-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span>Processing payment...</span>
                </div>
             </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
