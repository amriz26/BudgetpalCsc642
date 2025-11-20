import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { BudgetManager } from './components/BudgetManager';
import { SavingsGoals } from './components/SavingsGoals';
import { Navbar } from './components/Navbar';

export type Page = 'login' | 'dashboard' | 'expenses' | 'budgets' | 'savings';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  recurring?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Mock data - Exemplary data for prototype
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', amount: 45.50, category: 'Food', description: 'Grocery shopping', date: '2025-11-15', recurring: false },
    { id: '2', amount: 12.99, category: 'Transportation', description: 'Uber ride', date: '2025-11-15', recurring: false },
    { id: '3', amount: 89.00, category: 'Bills', description: 'Internet bill', date: '2025-11-10', recurring: true },
    { id: '4', amount: 25.00, category: 'Entertainment', description: 'Movie tickets', date: '2025-11-12', recurring: false },
    { id: '5', amount: 150.00, category: 'Bills', description: 'Electricity', date: '2025-11-05', recurring: true },
    { id: '6', amount: 8.50, category: 'Food', description: 'Coffee', date: '2025-11-14', recurring: false },
    { id: '7', amount: 60.00, category: 'Transportation', description: 'Gas', date: '2025-11-13', recurring: false },
    { id: '8', amount: 35.00, category: 'Food', description: 'Lunch', date: '2025-11-11', recurring: false },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food', limit: 400, spent: 109, period: 'monthly' },
    { id: '2', category: 'Transportation', limit: 200, spent: 72.99, period: 'monthly' },
    { id: '3', category: 'Bills', limit: 500, spent: 239, period: 'monthly' },
    { id: '4', category: 'Entertainment', limit: 150, spent: 25, period: 'monthly' },
  ]);

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { id: '1', name: 'Vacation Fund', target: 2000, current: 850, deadline: '2026-06-01' },
    { id: '2', name: 'Emergency Savings', target: 5000, current: 2300, deadline: '2025-12-31' },
    { id: '3', name: 'New Laptop', target: 1200, current: 450, deadline: '2026-03-01' },
  ]);

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setCurrentPage('login');
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses([newExpense, ...expenses]);
    
    // Update budget spent amount
    setBudgets(budgets.map(budget => {
      if (budget.category === expense.category) {
        return { ...budget, spent: budget.spent + expense.amount };
      }
      return budget;
    }));
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = { ...budget, id: Date.now().toString(), spent: 0 };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, ...updates } : budget
    ));
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'current'>) => {
    const newGoal = { ...goal, id: Date.now().toString(), current: 0 };
    setSavingsGoals([...savingsGoals, newGoal]);
  };

  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(savingsGoals.map(goal =>
      goal.id === id ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal
    ));
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        userName={userName}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {currentPage === 'dashboard' && (
          <Dashboard 
            expenses={expenses}
            budgets={budgets}
            savingsGoals={savingsGoals}
            userName={userName}
          />
        )}
        
        {currentPage === 'expenses' && (
          <ExpenseTracker 
            expenses={expenses}
            onAddExpense={addExpense}
          />
        )}
        
        {currentPage === 'budgets' && (
          <BudgetManager 
            budgets={budgets}
            onAddBudget={addBudget}
            onUpdateBudget={updateBudget}
            onDeleteBudget={deleteBudget}
          />
        )}
        
        {currentPage === 'savings' && (
          <SavingsGoals 
            goals={savingsGoals}
            onAddGoal={addSavingsGoal}
            onUpdateGoal={updateSavingsGoal}
            onDeleteGoal={deleteSavingsGoal}
          />
        )}
      </main>
    </div>
  );
}

export default App;
