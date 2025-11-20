import { Button } from './ui/button';
import { Home, Receipt, Target, PiggyBank, LogOut, Wallet } from 'lucide-react';
import type { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userName: string;
  onLogout: () => void;
}

export function Navbar({ currentPage, setCurrentPage, userName, onLogout }: NavbarProps) {
  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'expenses' as Page, label: 'Expenses', icon: Receipt },
    { id: 'budgets' as Page, label: 'Budgets', icon: Target },
    { id: 'savings' as Page, label: 'Savings', icon: PiggyBank },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-900">BudgetPal</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden md:inline">Hello, {userName}</span>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
