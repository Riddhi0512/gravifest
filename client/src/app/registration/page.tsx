"use client";

import React from 'react';
import { useGetRegistrationsQuery } from "@/State/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

// --- COLUMNS ---
const columns: GridColDef[] = [
  // Using 'width' instead of 'flex' as requested, but adding flex for layout flexibility
  { field: "regId", headerName: "Reg-ID", width: 90 }, 
  { field: "userId", headerName: "USER-ID", width: 90 },
  { field: "eventId", headerName: "EVENT-ID", width: 90 },
  { field: "paymentMode", headerName: "Payment Mode", flex: 1.5 }, // Increased flex
  { field: "regDate", headerName: "Registration Date", flex: 1.5,
    renderCell: (params: GridRenderCellParams<any, string>) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleDateString();
      }, },
  { 
    field: "paymentStatus", 
    headerName: "Payment Status", 
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, string>) => {
      // Check if the apparId value is truthy (exists)
      const hasApparId = !!params.value; 

      return (
        <span 
          className={hasApparId ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}
        >
          {hasApparId ? "Paid" : "Pending"}
        </span>
      );
    },
    // ------------------------------------
  },
];

const Registration = () => {
  // Use the correct API query hook for registrations
  const { data: registration, isError, isLoading } = useGetRegistrationsQuery();

  if (isLoading) {
    return <div className="py-4 p-4 text-gray-500">Loading registration data...</div>;
  }

  // CRITICAL Runtime Fix: Ensure data is not null/undefined or empty before rendering DataGrid
  if (isError || !registration || registration.length === 0) {
    const message = isError 
        ? "Failed to fetch registration data."
        : "No registration records available.";
        
    return (
      <div className="p-4 text-center text-red-500">
        {message}
      </div>
    );
  }

  return (
    <div className="ml-2 md:ml-6 xl:ml-12 flex flex-col p-4">
      <Header name="Registration" subtitle="Overview of all event registrations and payment statuses" />
      
      <div style={{ height: '75vh', width: '100%' }} className="mt-5">
        <DataGrid
          rows={registration}
          columns={columns}
          getRowId={(row) => row.regId} // Use regId as the unique row identifier
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        />
      </div>
    </div>
  );
};

export default Registration;