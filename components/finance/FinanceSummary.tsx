'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Transaction } from '@/lib/firebase/transactions';
import { Budget } from '@/lib/firebase/budgets';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface FinanceSummaryProps {
  transactions: Transaction[];
  budgets: Budget[];
  month: string; // format: 'YYYY-MM'
}

export function FinanceSummary({ transactions, budgets, month }: FinanceSummaryProps) {
  // Calculate summaries
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [categoryData, setCategoryData] = useState<{[key: string]: number}>({});
  const [budgetComparison, setBudgetComparison] = useState<{category: string, budget: number, spent: number}[]>([]);

  useEffect(() => {
    if (!transactions.length) return;

    // Filter transactions for the current month
    const currentMonthTransactions = transactions.filter((transaction) => {
      const transactionMonth = format(transaction.date.toDate(), 'yyyy-MM');
      return transactionMonth === month;
    });

    // Calculate total income
    const incomeTotal = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate total expense
    const expenseTotal = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate balance
    const currentBalance = incomeTotal - expenseTotal;
    
    // Group expenses by category
    const categories: {[key: string]: number} = {};
    currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        const { category, amount } = transaction;
        categories[category] = (categories[category] || 0) + amount;
      });
    
    setTotalIncome(incomeTotal);
    setTotalExpense(expenseTotal);
    setBalance(currentBalance);
    setCategoryData(categories);

    // Prepare budget comparison
    if (budgets.length) {
      const comparisons = budgets.map(budget => {
        // Find the total spent in this category
        const spent = categories[budget.category] || 0;
        return {
          category: budget.category,
          budget: budget.amount,
          spent: spent
        };
      });
      
      setBudgetComparison(comparisons);
    }
  }, [transactions, budgets, month]);

  // Prepare data for pie chart
  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F44336',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for budget comparison chart
  const barData = {
    labels: budgetComparison.map(item => item.category),
    datasets: [
      {
        label: 'Budget',
        data: budgetComparison.map(item => item.budget),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spent',
        data: budgetComparison.map(item => item.spent),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Format month for display
  const displayMonth = month ? new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Summary - {displayMonth}</h2>
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {Object.keys(categoryData).length > 0 ? (
              <Pie data={pieData} />
            ) : (
              <p className="text-muted-foreground">No expense data for this month</p>
            )}
          </CardContent>
        </Card>

        {/* Budget vs Actual Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
            <CardDescription>Comparing budgeted amounts with spending</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {budgetComparison.length > 0 ? (
              <Bar 
                data={barData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            ) : (
              <p className="text-muted-foreground">No budget data for this month</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Tracker */}
      {budgetComparison.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetComparison.map((item) => {
                const percentage = item.budget > 0 ? (item.spent / item.budget) * 100 : 0;
                let statusColor = 'bg-green-500';
                
                if (percentage > 90) {
                  statusColor = 'bg-red-500';
                } else if (percentage > 75) {
                  statusColor = 'bg-yellow-500';
                }
                
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.category}</span>
                        <Badge className="ml-2" variant={percentage > 100 ? 'destructive' : 'outline'}>
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                      <span className="text-sm">
                        ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${statusColor}`} 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 