import { useGetDashboardMetricsQuery } from "@/State/api";
import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#2563eb", "#34d399"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    return (
      <div className="p-3 bg-white shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">
          Amount:{" "}
          <span className="font-bold text-blue-500">
            {Number(value).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CardRevenueBreakdown = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();

  const { revenueData, totalRevenue } = React.useMemo(() => {
    const dataSlice = data?.revenueBreakdown || [];
    const total = dataSlice.reduce((acc, curr) => acc + curr.value, 0);
    return { revenueData: dataSlice, totalRevenue: total };
  }, [data]);

  if (isError) {
    return (
      <div className="row-span-2 xl:row-span-4 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl flex items-center justify-center p-5">
        <p className="text-red-500">Failed to fetch revenue data.</p>
      </div>
    );
  }

  return (
    <div className="row-span-2 xl:row-span-4 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">Loading...</div>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Revenue Breakdown
            </h2>
            <hr />
          </div>

          {/* --- UPDATED RESPONSIVE CONTAINER --- */}
          <div className="flex-grow flex flex-col md:flex-row items-center justify-around p-4">
            {/* Left Column: Chart */}
            <div className="relative w-full md:w-1/2 h-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right Column: Custom Legend */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-2 pt-4 md:pt-0 md:pl-4">
              {revenueData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center text-sm">
                  <span
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <hr />
            <div className="flex justify-between items-center px-7 py-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <span className="text-lg font-bold">
                {totalRevenue.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardRevenueBreakdown;