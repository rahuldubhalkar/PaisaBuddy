'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CandlestickChart,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert,
  Sparkles,
  Wallet,
  Trophy,
  Search,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PortfolioProvider } from '@/components/portfolio-provider';
import { BudgetProvider } from '@/components/budget-provider';
import { LearningModulesProvider } from '@/components/learning-modules-provider';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portfolio', label: 'Virtual Portfolio', icon: CandlestickChart },
  { href: '/discover', label: 'Discover Assets', icon: Search },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/learn', label: 'Learning Modules', icon: GraduationCap },
  { href: '/budget', label: 'Budgeting Tools', icon: Wallet },
  { href: '/fraud-detection', label: 'Fraud Detection', icon: ShieldAlert },
  { href: '/generate', label: 'Content Generator', icon: Sparkles },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <LearningModulesProvider>
      <BudgetProvider>
        <PortfolioProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0"
                    asChild
                  >
                    <Link href="/">
                      <Logo className="h-6 w-6" />
                      <span className="sr-only">Paisa Pathshala</span>
                    </Link>
                  </Button>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">
                      Paisa Pathshala
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Financial Literacy
                    </span>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <Logo className="h-6 w-6" />
                  <h1 className="text-lg font-semibold">Paisa Pathshala</h1>
                </div>
              </header>
              <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </PortfolioProvider>
      </BudgetProvider>
    </LearningModulesProvider>
  );
}
