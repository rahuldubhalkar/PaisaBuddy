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
  LogOut,
  User,
  WalletCards,
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { PortfolioProvider } from '@/components/portfolio-provider';
import { BudgetProvider } from '@/components/budget-provider';
import { LearningModulesProvider } from '@/components/learning-modules-provider';
import { useAuth } from '@/components/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portfolio', label: 'Virtual Portfolio', icon: CandlestickChart },
  { href: '/discover', label: 'Discover Assets', icon: Search },
  { href: '/add-cash', label: 'Add Cash', icon: WalletCards },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/learn', label: 'Learning Modules', icon: GraduationCap },
  { href: '/budget', label: 'Budgeting Tools', icon: Wallet },
  { href: '/fraud-detection', label: 'Fraud Detection', icon: ShieldAlert },
  { href: '/generate', label: 'Content Generator', icon: Sparkles },
];

function UserProfileButton() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex w-full gap-2">
        <Button asChild className="flex-1">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start h-12"
        >
          <div className="flex items-center gap-3">
             <Avatar className="h-8 w-8">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <p className="font-medium text-sm truncate">{user.displayName || user.email}</p>
              <p className="text-xs text-muted-foreground">View Profile</p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // If still loading, do nothing.
    if (loading) return;

    // If there is no user, redirect to login page.
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>;
  }
  
  // If no user, the useEffect above will trigger a redirect, so we can render a loading state
  // or null to avoid flashing the main layout.
  if (!user) {
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>;
  }

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
                      <Logo className="h-12 w-18" />
                      <span className="sr-only">Paisa Buddy</span>
                    </Link>
                  </Button>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">
                      Paisa Buddy
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
              <SidebarFooter className="p-2">
                <UserProfileButton />
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <Logo className="h-6 w-6" />
                  <h1 className="text-lg font-semibold">Paisa Buddy</h1>
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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <MainLayoutContent>{children}</MainLayoutContent>
  );
}
