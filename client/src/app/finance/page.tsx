"use client";

import {
  AggregateFinanceBreakdown,
  ExpenseBreakdown,
  RevenueBreakdown,
  useGetAggregateFinanceBreakdownQuery,
} from "@/State/api"; // Corrected path for your RTK Query API
import { useMemo, useState } from "react";
import Header from "../(components)/Header"; 
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// --- INTERFACES ---

type AggregatedDataItem = {
  name: string;
  color?: string;
  value: number; 
  type: 'Expense' | 'Revenue'; 
};

// --- DATA UTILITIES ---

const CHART_COLORS = [
  "#2C7A7B", 
  "#3182CE", 
  "#9F7AEA", 
  "#38A169", 
  "#F6AD55", 
  "#DD6B20", 
  "#E53E3E", 
];

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

// Custom function used for the Pie 'label' prop to format the text.
// This relies on Recharts' Pie component to handle the positioning and label line drawing.
const renderPieLabel = ({ name, percent }: any) => {
    if (name && typeof percent === 'number') {
        return `${name}: ${(percent * 100).toFixed(0)}%`;
    }
    return ''; 
};

// --- MAIN COMPONENT ---

const FinanceDashboard = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Expense' | 'Revenue'>('All');

  const {
    data: aggregateData,
    isLoading,
    isError,
  } = useGetAggregateFinanceBreakdownQuery();

  const chartData: AggregatedDataItem[] = useMemo(() => {
    if (!aggregateData) return [];
    
    const combinedData: AggregatedDataItem[] = [
        ...aggregateData.expenditure.map((item, index) => ({
            ...item, 
            type: 'Expense' as const, 
            color: CHART_COLORS[index % CHART_COLORS.length],
        })),
        ...aggregateData.revenue.map((item, index) => ({
            ...item, 
            type: 'Revenue' as const, 
            color: CHART_COLORS[(index + aggregateData.expenditure.length) % CHART_COLORS.length], 
        })),
    ];

    const filteredData = combinedData
      .filter(item => item.value > 0) 
      .filter(item => activeCategory === 'All' || item.type === activeCategory);
    
    return filteredData;

  }, [aggregateData, activeCategory]);

  const totalExpenditure = useMemo(() => {
    return aggregateData?.expenditure.reduce((sum, item) => sum + item.value, 0) ?? 0;
  }, [aggregateData]);

  const totalRevenue = useMemo(() => {
    return aggregateData?.revenue.reduce((sum, item) => sum + item.value, 0) ?? 0;
  }, [aggregateData]);

  const totalProfitLoss = useMemo(() => totalRevenue - totalExpenditure, [totalRevenue, totalExpenditure]);

  const classNames = {
    buttonBase: "px-4 py-2 rounded-lg transition duration-150 ease-in-out font-medium",
    buttonActive: "bg-indigo-600 text-white shadow-md",
    buttonInactive: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-indigo-600">Loading Financial Data...</div>
      </div>
    );
  }

  if (isError || !aggregateData) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch aggregate financial breakdown.
      </div>
    );
  }

  const profitLossColor = totalProfitLoss >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <Header name="Aggregate Financial Dashboard" />
        <p className="text-base text-gray-600">
          Summary of all-time revenue and expenditure across all events.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white shadow-xl rounded-xl p-6 border-l-4 border-indigo-600">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</h3>
          <p className="mt-1 text-3xl font-bold text-indigo-900">{formatCurrency(totalRevenue)}</p>
        </div>

        {/* Total Expenditure */}
        <div className="bg-white shadow-xl rounded-xl p-6 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Expenditure</h3>
          <p className="mt-1 text-3xl font-bold text-red-700">{formatCurrency(totalExpenditure)}</p>
        </div>

        {/* Total Profit/Loss */}
        <div className={`shadow-xl rounded-xl p-6 border-l-4 ${totalProfitLoss >= 0 ? 'border-green-600' : 'border-red-600'} ${profitLossColor}`}>
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Net Profit/Loss</h3>
          <p className={`mt-1 text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-900' : 'text-red-900'}`}>{formatCurrency(totalProfitLoss)}</p>
        </div>
      </div>


      {/* PIE CHART AND FILTERS CONTAINER */}
      <div className="bg-white shadow-xl rounded-xl p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Breakdown by Category</h2>
            {/* Filter Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={() => setActiveCategory('All')}
                    className={`${classNames.buttonBase} ${activeCategory === 'All' ? classNames.buttonActive : classNames.buttonInactive}`}
                >
                    All Categories
                </button>
                <button
                    onClick={() => setActiveCategory('Expense')}
                    className={`${classNames.buttonBase} ${activeCategory === 'Expense' ? classNames.buttonActive : classNames.buttonInactive}`}
                >
                    Expenditure
                </button>
                <button
                    onClick={() => setActiveCategory('Revenue')}
                    className={`${classNames.buttonBase} ${activeCategory === 'Revenue' ? classNames.buttonActive : classNames.buttonInactive}`}
                >
                    Revenue
                </button>
            </div>
        </div>
        
        {/* PIE CHART DISPLAY */}
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                
                // FIX: Use the simple formatter function and enable labelLine for better small slice visibility
                label={renderPieLabel} 
                labelLine={true} 
                
                outerRadius={140} // Adjusted radius to give more space for external labels
                fill="#8884d8"
                dataKey="value"
                nameKey="name" // Ensures the label picks up the slice name
              >
                {chartData.map((entry: AggregatedDataItem, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.type === 'Expense' ? '#DC2626' : '#10B981'} 
                    strokeWidth={activeCategory === 'All' ? 1 : 0.5} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
             <div className="text-center py-20 text-gray-500">
                No financial data available for the selected view.
             </div>
        )}
      </div>

      {/* DETAILED TABLES */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailTable title="Expenditure Breakdown" data={aggregateData?.expenditure || []} />
        <DetailTable title="Revenue Breakdown" data={aggregateData?.revenue || []} />
      </div>
    </div>
  );
};

export default FinanceDashboard;

// Placeholder component for detailed table view
const DetailTable = ({ title, data }: { title: string, data: (ExpenseBreakdown | RevenueBreakdown)[] }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">{title}</h3>
            {data.length > 0 ? (
                <ul className="space-y-3">
                    {data.filter(item => item.value > 0).map((item, index) => (
                        <li key={index} className="flex justify-between items-center text-gray-700 text-base border-b border-gray-100 last:border-b-0 pb-2">
                            <span className="font-medium">{item.name}</span>
                            <span className={`font-semibold ${title.includes('Expenditure') ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(item.value)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 pt-4">No data recorded.</p>
            )}
        </div>
    );
};