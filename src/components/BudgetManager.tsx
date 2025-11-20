import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, AlertTriangle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { getCategoryConfig } from '../utils/categoryIcons';
import { NotificationBanner } from './NotificationBanner';
import type { Budget } from '../App';

interface BudgetManagerProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onUpdateBudget: (id: string, updates: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
}

const categories = ['Food', 'Transportation', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'];

export function BudgetManager({ budgets, onAddBudget, onUpdateBudget, onDeleteBudget }: BudgetManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'custom'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !limit) return;

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, {
        category,
        limit: parseFloat(limit),
        period,
      });
    } else {
      onAddBudget({
        category,
        limit: parseFloat(limit),
        period,
      });
    }

    // Reset form
    setCategory('');
    setLimit('');
    setPeriod('monthly');
    setEditingBudget(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setLimit(budget.limit.toString());
    setPeriod(budget.period);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      onDeleteBudget(id);
    }
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'red', icon: AlertTriangle };
    if (percentage >= 80) return { status: 'warning', color: 'orange', icon: AlertTriangle };
    return { status: 'good', color: 'green', icon: CheckCircle };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  
  // Check if on track
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const budgetsExceeded = budgets.filter(b => b.spent > b.limit).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Budget Manager</h1>
          <p className="text-gray-600">Set and track spending limits for each category</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingBudget(null);
            setCategory('');
            setLimit('');
            setPeriod('monthly');
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
              <DialogDescription>
                Set spending limits to help manage your finances better
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="limit">Budget Limit</Label>
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  placeholder="500.00"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(val) => setPeriod(val as 'monthly' | 'custom')}>
                  <SelectTrigger id="period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notification Banners */}
      {budgetPercentage < 70 && budgets.length > 0 && (
        <NotificationBanner
          type="success"
          title="Great spending discipline! 💰"
          message={`You're using only ${budgetPercentage.toFixed(0)}% of your total budget. Keep up the smart spending!`}
        />
      )}
      
      {budgetsExceeded > 0 && (
        <NotificationBanner
          type="error"
          title="Budget Exceeded"
          message={`${budgetsExceeded} budget${budgetsExceeded > 1 ? 's have' : ' has'} been exceeded. Consider reviewing your spending in these categories.`}
        />
      )}

      {/* Summary card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Total Budget</p>
              <p className="text-gray-900">${totalBudget.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Total Spent</p>
              <p className="text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Remaining</p>
              <p className={remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${Math.abs(remainingBudget).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              value={(totalSpent / totalBudget) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Budgets list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const { status, color, icon: StatusIcon } = getBudgetStatus(budget);
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          const categoryConfig = getCategoryConfig(budget.category);
          const CategoryIcon = categoryConfig.icon;

          return (
            <Card key={budget.id} className={
              status === 'exceeded' ? 'border-red-200' :
              status === 'warning' ? 'border-orange-200' : ''
            }>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${categoryConfig.bgColor} flex items-center justify-center`}>
                      <CategoryIcon className={`w-6 h-6 ${categoryConfig.color}`} />
                    </div>
                    <CardTitle className="text-gray-900">{budget.category}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(budget)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(budget.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Spent</span>
                  <span className="text-gray-900">${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</span>
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-3 ${
                    status === 'exceeded' ? '[&>div]:bg-red-500' :
                    status === 'warning' ? '[&>div]:bg-orange-500' : ''
                  }`}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 text-${color}-500`} />
                    <span className={`text-${color}-600`}>
                      {status === 'exceeded' ? 'Budget Exceeded' :
                       status === 'warning' ? 'Nearly Exceeded' :
                       'On Track'}
                    </span>
                  </div>
                  <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
                  </span>
                </div>

                <p className="text-gray-500">Period: {budget.period}</p>
              </CardContent>
            </Card>
          );
        })}

        {budgets.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No budgets yet. Create your first budget to start tracking!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}