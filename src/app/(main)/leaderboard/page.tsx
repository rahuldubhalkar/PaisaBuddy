'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Trophy, Shield, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const leaderboardData = [
  { rank: 1, name: 'Aarav Sharma', portfolioValue: 125830.50, change: 25.83, avatar: 'https://picsum.photos/seed/p1/40/40' },
  { rank: 2, name: 'Priya Patel', portfolioValue: 119450.75, change: 19.45, avatar: 'https://picsum.photos/seed/p2/40/40' },
  { rank: 3, name: 'Rohan Mehta', portfolioValue: 115200.00, change: 15.20, avatar: 'https://picsum.photos/seed/p3/40/40' },
  { rank: 4, name: 'Sanya Gupta', portfolioValue: 108990.20, change: 8.99, avatar: 'https://picsum.photos/seed/p4/40/40' },
  { rank: 5, name: 'Vikram Singh', portfolioValue: 105600.00, change: 5.60, avatar: 'https://picsum.photos/seed/p5/40/40' },
  { rank: 6, name: 'You', portfolioValue: 102345.00, change: 2.34, avatar: 'https://picsum.photos/seed/user/40/40', isCurrentUser: true },
  { rank: 7, name: 'Neha Reddy', portfolioValue: 99870.10, change: -0.13, avatar: 'https://picsum.photos/seed/p6/40/40' },
];

const achievementsData = [
  { id: 1, icon: Star, title: 'First Investment', description: 'Made your first virtual investment.', achieved: true },
  { id: 2, icon: Shield, title: 'Diversifier', description: 'Hold assets in 3 different sectors.', achieved: true },
  { id: 3, icon: Trophy, title: 'Profit Pro', description: 'Achieve a 10% portfolio gain.', achieved: false },
  { id: 4, icon: Crown, title: 'Mutual Fund Master', description: 'Invest in 5 different mutual funds.', achieved: false },
];

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard & Achievements</h1>
        <p className="text-muted-foreground">See how you stack up against other investors and track your progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Performance Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>Investor</TableHead>
                                <TableHead className="text-right">Portfolio Value</TableHead>
                                <TableHead className="text-right">Overall Gain (%)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map(player => (
                                <TableRow key={player.rank} className={player.isCurrentUser ? 'bg-secondary' : ''}>
                                    <TableCell className="font-bold text-lg">
                                        <div className="flex items-center justify-center">
                                            {player.rank === 1 && <Crown className="h-6 w-6 text-yellow-500" />}
                                            {player.rank > 1 && player.rank}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={player.avatar} alt={player.name} />
                                                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{player.name}</span>
                                            {player.isCurrentUser && <Badge>You</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">₹{player.portfolioValue.toLocaleString('en-IN')}</TableCell>
                                    <TableCell className={`text-right font-medium ${player.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {player.change.toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>Unlock badges by completing challenges.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {achievementsData.map(ach => (
                        <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-lg ${ach.achieved ? 'bg-primary/10' : 'bg-muted'}`}>
                            <div className={`p-2 rounded-full ${ach.achieved ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                <ach.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className={`font-semibold ${ach.achieved ? 'text-primary' : 'text-foreground'}`}>{ach.title}</p>
                                <p className="text-sm text-muted-foreground">{ach.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
