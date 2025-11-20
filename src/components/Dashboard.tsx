import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { Progress } from './ui/progress';
import { getCategoryConfig } from '../utils/categoryIcons';
import { NotificationBanner } from './NotificationBanner';
import type { Expense, Budget, SavingsGoal } from '../App';

interface DashboardProps {
  expenses: Expense[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  userName: string;
}

export function Dashboard({ expenses, budgets, savingsGoals, userName }: DashboardProps) {
  // Calculate statistics
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  
  // Get spending by category
  const spendingByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Recent transactions
  const recentTransactions = expenses.slice(0, 5);

  // Budgets at risk (over 80% spent)
  const budgetsAtRisk = budgets.filter(budget => (budget.spent / budget.limit) > 0.8);
  
  // Calculate savings percentage
  const savingsPercentage = totalSavingsTarget > 0 ? (totalSaved / totalSavingsTarget) * 100 : 0;
  
  // Calculate budget usage percentage
  const budgetUsagePercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-gray-900 mb-2">Welcome back, {userName}!</h1>
        <p className="text-gray-600">Here's your financial overview for November</p>
      </div>

      {/* Notification Banner */}
      {savingsPercentage >= 40 && budgetUsagePercentage < 90 && (
        <NotificationBanner
          type="success"
          title="Great job this month! 🎉"
          message={`You're saving ${savingsPercentage.toFixed(1)}% toward your goals. You're on track to reach your savings targets!`}
        />
      )}
      
      {budgetsAtRisk.length > 0 && (
        <NotificationBanner
          type="warning"
          title="Budget Alert"
          message={`You're approaching the limit on ${budgetsAtRisk.length} budget${budgetsAtRisk.length > 1 ? 's' : ''}. Consider adjusting your spending.`}
        />
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Total Spent</CardTitle>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 text-red-600">${totalSpent.toFixed(2)}</div>
            <p className="text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Total Budget</CardTitle>
            <Target className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">${totalBudget.toFixed(2)}</div>
            <p className={`mt-1 ${budgetUsagePercentage > 90 ? 'text-red-600' : budgetUsagePercentage > 70 ? 'text-orange-600' : 'text-green-600'}`}>
              {((totalSpent / totalBudget) * 100).toFixed(0)}% used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Total Saved</CardTitle>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900 text-green-600">${totalSaved.toFixed(2)}</div>
            <p className="text-gray-500 mt-1">Across all goals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Savings Goal</CardTitle>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">${totalSavingsTarget.toFixed(2)}</div>
            <p className={`mt-1 ${savingsPercentage >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
              {((totalSaved / totalSavingsTarget) * 100).toFixed(0)}% reached
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top spending categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.map(([category, amount]) => {
              const percentage = (amount / totalSpent) * 100;
              const categoryConfig = getCategoryConfig(category);
              const Icon = categoryConfig.icon;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${categoryConfig.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${categoryConfig.color}`} />
                      </div>
                      <span className="text-gray-700">{category}</span>
                    </div>
                    <span className="text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const categoryConfig = getCategoryConfig(transaction.category);
                const Icon = categoryConfig.icon;
                return (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${categoryConfig.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${categoryConfig.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{transaction.description}</p>
                        <p className="text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-red-600">-${transaction.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget alerts */}
      {budgetsAtRisk.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Budget Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetsAtRisk.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-orange-900">{budget.category}</span>
                      <span className="text-orange-900">
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-orange-700">
                      You've used {percentage.toFixed(0)}% of your budget
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Savings progress */}
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savingsGoals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{goal.name}</span>
                    <span className="text-gray-900">
                      ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-gray-500">
                    {percentage.toFixed(0)}% complete
                    {goal.deadline && ` • Due ${new Date(goal.deadline).toLocaleDateString()}`}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}