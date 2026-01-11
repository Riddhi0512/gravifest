import React, { useState } from "react";
import { useGetDashboardMetricsQuery } from "@/State/api";
import { Users } from "lucide-react";

const ParticipantsCard = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();

  if (isLoading) {
    return <div className="bg-white p-5 rounded-2xl shadow-md h-full animate-pulse"></div>;
  }
  
  if (isError || !data) {
    return <div className="bg-white p-5 rounded-2xl shadow-md h-full"><p className="text-red-500">Error loading data.</p></div>;
  }

  // Group data and create a detailed breakdown for the tooltip
  let externalCount = 0;
  let internalCount = 0;
  const externalBreakdown = {
    School: 0,
    Individual: 0,
    Professional: 0,
  };

  data.formattedCounts.forEach(participant => {
    if (participant.userType === 'internal') {
      internalCount += participant.count;
    } else {
      externalCount += participant.count;
      // Capitalize for consistent keys
      const key = participant.userType.charAt(0).toUpperCase() + participant.userType.slice(1);
      if (key in externalBreakdown) {
        externalBreakdown[key] += participant.count;
      }
    }
  });

  const totalCount = internalCount + externalCount;

  const groupedData = [
    { userType: 'External', count: externalCount },
    { userType: 'Internal', count: internalCount },
  ];

  return (
    <div className="row-span-1 xl:row-span-2 md:col-span-2 xl:col-span-2 bg-white font-sans p-5 rounded-2xl shadow-md w-full h-full flex flex-col">
      {/* Card Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="font-semibold text-lg text-gray-800">
          Participants by Type
        </h2>
        <span className="text-xs text-gray-400">All Time</span>
      </div>

      <hr className="my-4" />

      {/* Card Body */}
      <div className="flex gap-5 flex-grow items-stretch">
        {/* Left Icon */}
        <div className="flex-shrink-0 self-start pt-2">
          <div className="rounded-full p-4 bg-blue-50 border border-blue-100">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Right Details List */}
        <div className="flex-1 h-full">
          <ul className="h-full flex flex-col">
            {groupedData.map((participant, index) => {
              const percentage = totalCount > 0 ? (participant.count / totalCount) * 100 : 0;
              const isExternal = participant.userType === 'External';

              return (
                <li 
                  key={index} 
                  className="flex-grow flex flex-col justify-center relative"
                  onMouseEnter={() => isExternal && setTooltipVisible(true)}
                  onMouseLeave={() => isExternal && setTooltipVisible(false)}
                >
                  {index > 0 && <hr className="mb-2" />}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      {participant.userType}
                    </span>
                    <span className="font-bold text-gray-800 text-lg">
                      {participant.count.toLocaleString()}
                    </span>
                    {/* STYLING CHANGES HERE */}
                    <div className="text-blue-600 font-medium text-sm w-16 text-right">
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Tooltip for External category */}
                  {isExternal && isTooltipVisible && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-blue-700 text-blue-50 text-xs rounded-md shadow-lg p-2 z-10">
                      <ul className="space-y-1">
                        {Object.entries(externalBreakdown).map(([key, value]) => (
                          <li key={key} className="flex justify-between gap-4">
                            <span>{key}:</span>
                            <span className="font-semibold">{value}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-blue-700 transform rotate-45"></div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsCard;