'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IndianRupee, CreditCard, Landmark, Banknote, CheckCircle, ArrowLeft } from 'lucide-react';
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

type PaymentMethod = 'Credit / Debit Card' | 'UPI / Bank';
type PageState = 'enterAmount' | 'cardPayment' | 'otpVerification' | 'upiPayment' | 'processing' | 'success';

export default function AddCashPage() {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [state, setState] = useState<PageState>('enterAmount');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Mock card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const { toast } = useToast();
  const { addCash } = usePortfolio();

  const handleMethodSelect = (paymentMethod: PaymentMethod) => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than zero.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedMethod(paymentMethod);
    if (paymentMethod === 'Credit / Debit Card') {
      setState('cardPayment');
    } else {
      setState('upiPayment');
    }
  };

  const handleCardSubmit = () => {
    // Basic validation for demonstration
    if (cardNumber.length < 16 || cardExpiry.length < 5 || cardCvv.length < 3) {
      toast({
        title: 'Invalid Card Details',
        description: 'Please enter valid card information.',
        variant: 'destructive',
      });
      return;
    }
    setState('otpVerification');
  };
  
  const handleOtpSubmit = () => {
    if (otp.length < 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a valid 6-digit OTP.',
        variant: 'destructive',
      });
      return;
    }
    processPayment();
  }

  const handleUtrSubmit = () => {
    if (!utr || utr.length < 12) {
      toast({
        title: 'Invalid UTR',
        description: 'Please enter a valid UTR number (usually 12 digits).',
        variant: 'destructive',
      });
      return;
    }
    processPayment();
  };

  const processPayment = () => {
    setState('processing');
    setTimeout(() => {
      const numericAmount = parseFloat(amount);
      addCash(numericAmount);
      setState('success');
      toast({
        title: 'Payment Successful',
        description: `₹${numericAmount.toLocaleString('en-IN')} has been added to your virtual cash.`,
      });
      setTimeout(() => router.push('/portfolio'), 2000); // Redirect after showing success
    }, 2000);
  }
  
  const handleGoBack = () => {
    setState('enterAmount');
    setUtr('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setOtp('');
    setSelectedMethod(null);
  }

  const renderContent = () => {
    switch(state) {
      case 'enterAmount':
        return (
          <>
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
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                   <Label>Select Payment Method</Label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" size="lg" className="h-auto py-4" onClick={() => handleMethodSelect('Credit / Debit Card')}>
                          <div className="flex flex-col items-center gap-2">
                              <CreditCard className="h-8 w-8" />
                              <span>Card</span>
                          </div>
                      </Button>
                       <Button variant="outline" size="lg" className="h-auto py-4" onClick={() => handleMethodSelect('UPI / Bank')}>
                          <div className="flex flex-col items-center gap-2">
                              <Banknote className="h-8 w-8" />
                              <span>UPI / Bank</span>
                          </div>
                      </Button>
                   </div>
              </div>
            </CardContent>
          </>
        );
      
      case 'cardPayment':
        return (
          <>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleGoBack} className="h-8 w-8">
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <div>
                        <CardTitle>Enter Card Details</CardTitle>
                        <CardDescription>Amount: ₹{parseFloat(amount).toLocaleString('en-IN')}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input id="cardExpiry" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input id="cardCvv" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCardSubmit}>Pay ₹{parseFloat(amount).toLocaleString('en-IN')}</Button>
            </CardFooter>
          </>
        );
        
      case 'otpVerification':
        return (
           <>
            <CardHeader>
                <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" onClick={() => setState('cardPayment')} className="h-8 w-8">
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <div>
                        <CardTitle>Verify Payment</CardTitle>
                        <CardDescription>Enter the OTP sent to your mock number.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password (OTP)</Label>
                  <Input id="otp" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  <p className="text-sm text-muted-foreground pt-1">Hint: Any 6 digits will work.</p>
              </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleOtpSubmit}>Confirm Payment</Button>
            </CardFooter>
          </>
        )

      case 'upiPayment':
        return (
          <>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleGoBack} className="h-8 w-8">
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <div>
                        <CardTitle>Complete Your Payment</CardTitle>
                        <CardDescription>Scan the QR or use the UPI ID, then submit the UTR.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-secondary flex flex-col items-center gap-4">
                <Image src="https://media.istockphoto.com/id/828088276/vector/qr-code-illustration.jpg?s=612x612&w=0&k=20&c=FnA7agr57XpFi081ZT5sEmxhLytMBlK4vzdQxt8A70M="  width={150} height={150} alt="QR Code" className="rounded-md bg-white p-2" />
                <div className="text-center">
                  <p className="font-semibold">rahulldubhalkar-1@okaxis</p>
                  <p className="text-sm text-muted-foreground">Click to copy</p>
                </div>
                <p className="text-lg font-bold">Amount: ₹{parseFloat(amount).toLocaleString('en-IN')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="utr">Enter Transaction UTR</Label>
                <Input 
                    id="utr" 
                    placeholder="12-digit UTR number" 
                    value={utr} 
                    onChange={(e) => setUtr(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleUtrSubmit}>Submit UTR</Button>
            </CardFooter>
          </>
        );

      case 'processing':
        return (
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Verifying payment, please wait...</p>
          </CardContent>
        );
      
      case 'success':
         return (
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-muted-foreground">₹{parseFloat(amount).toLocaleString('en-IN')} added. Redirecting...</p>
          </CardContent>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="w-full max-w-md">
        <Card>
          {renderContent()}
        </Card>
      </div>
    </div>
  );
}
