import { useGetDashboardMetricsQuery } from "@/State/api";
import React, { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const parseUTCDate = (dateString: string) => new Date(dateString + 'T00:00:00Z');

// --- NEW: Custom Tooltip Component ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.change >= 0;

    return (
      <div className="p-3 bg-white shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800">
          {parseUTCDate(label).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}
        </p>
        <p className="text-gray-600">
          <span className="font-bold text-blue-500">{data.count}</span> Registrations
        </p>
        {/* Show trend only if it's not the very first data point */}
        {data.change !== null && (
          <p className={`text-sm font-semibold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {data.change.toFixed(2)}% vs previous period
          </p>
        )}
      </div>
    );
  }
  return null;
};


const CardRegistrationSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const [timeframe, setTimeframe] = useState("daily");

  const dailyData = data?.registrationSummary || [];

  const processedData = useMemo(() => {
    // ... (aggregation logic is the same)
    if (!dailyData.length) return [];
    
    const aggregate = (
      dataToProcess: typeof dailyData,
      getKey: (date: Date) => string
    ) => {
      const summedData: { [key: string]: { date: string; count: number } } = {};
      for (const entry of dataToProcess) {
        const date = new Date(entry.date);
        const key = getKey(date);
        if (!summedData[key]) {
          summedData[key] = { date: key, count: 0 };
        }
        summedData[key].count += entry.count;
      }
      return Object.values(summedData);
    };

    switch (timeframe) {
      case "weekly":
        return aggregate(dailyData, (date) => {
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          return startOfWeek.toISOString().split("T")[0];
        });
      case "monthly":
        return aggregate(dailyData, (date) => {
          return new Date(date.getFullYear(), date.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        });
      case "daily":
      default:
        return dailyData;
    }
  }, [dailyData, timeframe]);

  // --- NEW: Pre-calculating the change for each data point ---
  const chartDataWithTrend = useMemo(() => {
    return processedData.map((item, index) => {
      if (index === 0) {
        return { ...item, change: null }; // No change for the first item
      }
      const previousItem = processedData[index - 1];
      const change = previousItem.count > 0
        ? ((item.count - previousItem.count) / previousItem.count) * 100
        : item.count > 0 ? 100 : 0;
      return { ...item, change };
    });
  }, [processedData]);


// --- UPDATED to compare FIRST vs LAST data points ---
  const trendStats = useMemo(() => {
    // A trend is only possible if there are at least two data points.
    if (processedData.length < 2) {
      return null;
    }

    // Compare the LAST period's count with the FIRST period's count.
    const lastPeriodCount = processedData[processedData.length - 1].count;
    const firstPeriodCount = processedData[0].count; // Get the very first data point

    const percentageChange = firstPeriodCount > 0
      ? ((lastPeriodCount - firstPeriodCount) / firstPeriodCount) * 100
      : lastPeriodCount > 0 ? 100 : 0;
      
    return { percentageChange };
  }, [processedData]);

  const totalRegistrations =
    processedData.reduce((acc, curr) => acc + curr.count, 0) || 0;

  const highestPeriodData = processedData.reduce(
    (acc, curr) => (acc.count > curr.count ? acc : curr),
    processedData[0] || {}
  );

  let highestPeriodDate = "N/A";
  if (highestPeriodData.date) {
    const peakDate = parseUTCDate(highestPeriodData.date);
    switch (timeframe) {
      case "monthly":
        highestPeriodDate = peakDate.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
        break;
      case "weekly":
        highestPeriodDate = `Week of ${peakDate.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}`;
        break;
      default:
        highestPeriodDate = peakDate.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    }
  }

  if (isError) {
    return <div className="m-5 text-red-500">Failed to fetch data</div>;
  }
  
  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">Loading...</div>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Registration Summary
            </h2>
            <hr />
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div>
                <p className="text-xs text-gray-400">Total Registrations</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold">
                    {totalRegistrations.toLocaleString("en")}
                  </span>
                  
                  {trendStats && (
                    <span className={`text-sm font-semibold flex items-center ${trendStats.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {trendStats.percentageChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {trendStats.percentageChange.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
              <select
                className="shadow-sm border border-gray-300 bg-white p-2 rounded"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartDataWithTrend} // Use the new data with pre-calculated trend
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = parseUTCDate(value);
                    if (timeframe === "monthly") {
                      return date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
                    }
                    return date.toLocaleString("en-US", { month: "numeric", day: "numeric", timeZone: "UTC" });
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => value.toLocaleString()}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                {/* --- USE THE CUSTOM TOOLTIP --- */}
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}/>
                <Bar
                  dataKey="count"
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <hr />
            <div className="flex justify-between items-center mt-4 text-sm px-7 mb-4">
              <p>
                Data from {processedData.length || 0}{" "}
                {timeframe === "daily" ? "days" : timeframe}
              </p>
              <p className="text-sm">
                Peak Period:{" "}
                <span className="font-bold">{highestPeriodDate}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardRegistrationSummary;