import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Calendar, Tag, DollarSign, FileText } from 'lucide-react';
import { Switch } from './ui/switch';
import { getCategoryConfig } from '../utils/categoryIcons';
import { NotificationBanner } from './NotificationBanner';
import type { Expense } from '../App';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const categories = ['Food', 'Transportation', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'];

export function ExpenseTracker({ expenses, onAddExpense }: ExpenseTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurring, setRecurring] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) return;

    onAddExpense({
      amount: parseFloat(amount),
      category,
      description,
      date,
      recurring,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setRecurring(false);
    setIsDialogOpen(false);
  };

  // Filter expenses
  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(exp => exp.category === filterCategory);

  // Group by date
  const expensesByDate = filteredExpenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(exp);
    return acc;
  }, {} as Record<string, Expense[]>);

  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Count recurring expenses
  const recurringCount = filteredExpenses.filter(exp => exp.recurring).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Track and categorize your daily expenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Quickly log your expense to track where your money goes
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="description"
                    type="text"
                    placeholder="What did you buy?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="recurring">Recurring expense</Label>
                <Switch
                  id="recurring"
                  checked={recurring}
                  onCheckedChange={setRecurring}
                />
              </div>

              <Button type="submit" className="w-full">Add Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notification Banner */}
      {recurringCount > 0 && (
        <NotificationBanner
          type="info"
          title="Recurring Expenses Detected"
          message={`You have ${recurringCount} recurring expense${recurringCount > 1 ? 's' : ''} this month. Keep track of these automatic charges!`}
        />
      )}

      {/* Summary card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Spent</p>
              <p className="text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Transactions</p>
              <p className="text-gray-900">{filteredExpenses.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses list */}
      <div className="space-y-4">
        {Object.entries(expensesByDate).map(([date, dayExpenses]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="text-gray-700">{date}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dayExpenses.map((expense) => {
                  const categoryConfig = getCategoryConfig(expense.category);
                  const Icon = categoryConfig.icon;
                  return (
                    <div key={expense.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${categoryConfig.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${categoryConfig.color}`} />
                        </div>
                        <div>
                          <p className="text-gray-900">{expense.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{expense.category}</span>
                            {expense.recurring && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                Recurring
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-red-600">-${expense.amount.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExpenses.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No expenses found. Start by adding your first expense!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}