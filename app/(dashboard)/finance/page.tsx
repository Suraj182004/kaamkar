'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading';

import { 
  getUserTransactions, 
  Transaction 
} from '@/lib/firebase/transactions';
import {
  getUserBudgetsForMonth,
  Budget
} from '@/lib/firebase/budgets';

import { TransactionForm } from '@/components/finance/TransactionForm';
import { BudgetForm } from '@/components/finance/BudgetForm';
import { FinanceSummary } from '@/components/finance/FinanceSummary';
import { TransactionsList } from '@/components/finance/TransactionsList';

export default function FinancePage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  
  // Get current month in YYYY-MM format
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Load data
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const [transactionsData, budgetsData] = await Promise.all([
          getUserTransactions(user.uid),
          getUserBudgetsForMonth(user.uid, selectedMonth)
        ]);
        
        setTransactions(transactionsData);
        setBudgets(budgetsData);
      } catch (error) {
        console.error('Error loading financial data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [user, selectedMonth]);

  const handleTransactionSuccess = async () => {
    setShowTransactionDialog(false);
    if (user) {
      const newTransactions = await getUserTransactions(user.uid);
      setTransactions(newTransactions);
    }
  };

  const handleBudgetSuccess = async () => {
    setShowBudgetDialog(false);
    if (user) {
      const newBudgets = await getUserBudgetsForMonth(user.uid, selectedMonth);
      setBudgets(newBudgets);
    }
  };

  const handleTransactionDeleted = async () => {
    if (user) {
      const newTransactions = await getUserTransactions(user.uid);
      setTransactions(newTransactions);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4">Please Sign In</h2>
        <p className="text-muted-foreground">You need to be signed in to access the Finance Tracker.</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Finance Tracker</h1>
        
        <div className="flex gap-2">
          <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record a new income or expense
                </DialogDescription>
              </DialogHeader>
              <TransactionForm 
                onSuccess={handleTransactionSuccess}
                onCancel={() => setShowTransactionDialog(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">Set Budget</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Set a budget for a specific category
                </DialogDescription>
              </DialogHeader>
              <BudgetForm 
                onSuccess={handleBudgetSuccess}
                onCancel={() => setShowBudgetDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <FinanceSummary 
            transactions={transactions}
            budgets={budgets}
            month={selectedMonth}
          />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionsList 
            transactions={transactions}
            onDelete={handleTransactionDeleted}
          />
        </TabsContent>
        
        <TabsContent value="budgets">
          {budgets.length === 0 ? (
            <div className="text-center py-10 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">No budgets set for this month</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating a budget for one of your expense categories
              </p>
              <Button onClick={() => setShowBudgetDialog(true)}>
                Create Your First Budget
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {budgets.map((budget) => (
                <div key={budget.id} className="bg-card rounded-lg border p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{budget.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        Budget: ${budget.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        Spent: ${budget.spent.toFixed(2)}
                      </p>
                      <p className="text-sm">
                        Remaining: ${(budget.amount - budget.spent).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        budget.spent / budget.amount > 0.9 ? 'bg-red-500' :
                        budget.spent / budget.amount > 0.75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ 
                        width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`
                      }}
                    />
                  </div>
                  
                  {budget.notes && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      {budget.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
} 