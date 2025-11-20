import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Trash2, PiggyBank, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';
import { NotificationBanner } from './NotificationBanner';
import type { SavingsGoal } from '../App';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'current'>) => void;
  onUpdateGoal: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function SavingsGoals({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: SavingsGoalsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMoneyDialogOpen, setIsAddMoneyDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const [addAmount, setAddAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalName || !targetAmount) return;

    onAddGoal({
      name: goalName,
      target: parseFloat(targetAmount),
      deadline: deadline || undefined,
    });

    // Reset form
    setGoalName('');
    setTargetAmount('');
    setDeadline('');
    setIsDialogOpen(false);
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGoal || !addAmount) return;

    onUpdateGoal(selectedGoal.id, parseFloat(addAmount));
    
    // Reset
    setAddAmount('');
    setSelectedGoal(null);
    setIsAddMoneyDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      onDeleteGoal(id);
    }
  };

  const openAddMoneyDialog = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsAddMoneyDialogOpen(true);
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  
  // Check completed goals
  const completedGoals = goals.filter(goal => (goal.current / goal.target) * 100 >= 100);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Savings Goals</h1>
          <p className="text-gray-600">Set goals and track your progress toward financial milestones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
              <DialogDescription>
                Define a new savings goal and track your progress
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  type="text"
                  placeholder="e.g., Vacation Fund, Emergency Savings"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Target Amount</Label>
                <Input
                  id="target"
                  type="number"
                  step="0.01"
                  placeholder="1000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notification Banners */}
      {completedGoals.length > 0 && (
        <NotificationBanner
          type="success"
          title="Congratulations! 🎊"
          message={`You've completed ${completedGoals.length} savings goal${completedGoals.length > 1 ? 's' : ''}! Your financial discipline is paying off!`}
        />
      )}
      
      {overallProgress >= 50 && overallProgress < 100 && completedGoals.length === 0 && (
        <NotificationBanner
          type="success"
          title="Halfway There! 🎯"
          message={`You've saved ${overallProgress.toFixed(0)}% of your target amount. Keep up the great work!`}
        />
      )}

      {/* Summary card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Total Saved</p>
              <p className="text-gray-900">${totalSaved.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Total Target</p>
              <p className="text-gray-900">${totalTarget.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Overall Progress</p>
              <p className="text-gray-900">
                {overallProgress.toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              value={overallProgress} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Goals list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const isComplete = percentage >= 100;
          
          const daysRemaining = goal.deadline 
            ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <Card key={goal.id} className={isComplete ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isComplete ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      <PiggyBank className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900">{goal.name}</CardTitle>
                      {goal.deadline && (
                        <p className={`text-sm ${
                          daysRemaining && daysRemaining < 0 ? 'text-red-600' :
                          daysRemaining && daysRemaining < 30 ? 'text-orange-600' :
                          'text-gray-500'
                        }`}>
                          {daysRemaining && daysRemaining < 0 
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : daysRemaining === 0
                            ? 'Due today'
                            : `${daysRemaining} days remaining`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(goal.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900">
                    ${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}
                  </span>
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-3 ${isComplete ? '[&>div]:bg-green-500' : ''}`}
                />

                <div className="flex items-center justify-between">
                  <span className={isComplete ? 'text-green-600' : 'text-gray-600'}>
                    {isComplete ? 'Goal Reached! 🎉' : `${percentage.toFixed(0)}% complete`}
                  </span>
                  {!isComplete && (
                    <span className="text-gray-600">
                      ${remaining.toFixed(2)} to go
                    </span>
                  )}
                </div>

                {!isComplete && (
                  <Button 
                    onClick={() => openAddMoneyDialog(goal)}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Add Money
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}

        {goals.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No savings goals yet. Create your first goal to start saving!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Money Dialog */}
      <Dialog open={isAddMoneyDialogOpen} onOpenChange={(open) => {
        setIsAddMoneyDialogOpen(open);
        if (!open) {
          setSelectedGoal(null);
          setAddAmount('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to {selectedGoal?.name}</DialogTitle>
            <DialogDescription>
              Update your savings progress
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMoney} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount to Add</Label>
              <Input
                id="add-amount"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                required
              />
            </div>

            {selectedGoal && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current</span>
                  <span className="text-gray-900">${selectedGoal.current.toFixed(2)}</span>
                </div>
                {addAmount && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adding</span>
                      <span className="text-green-600">+${parseFloat(addAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-900">New Total</span>
                      <span className="text-gray-900">
                        ${Math.min(selectedGoal.current + parseFloat(addAmount), selectedGoal.target).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            <Button type="submit" className="w-full">Confirm</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}