"use client";

import React from 'react';
import { useGetEventsQuery } from '@/State/api'; // Make sure this path is correct for your project
import Header from "@/app/(components)/Header"; // Make sure this path is correct for your project
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";


const columns: GridColDef[] = [
  { 
    field: "eventId", 
    headerName: "ID", 
    flex: 0.5 
  },
  { 
    field: "eventName", 
    headerName: "Event Name", 
    flex: 1 
  },
  { 
    field: "organiserName", 
    headerName: "Organiser", 
    flex: 1 
  },
  {
    field: "regFee",
    headerName: "Fee (₹)",
    flex: 0.5,
    type: "number",
    renderCell: (params: GridRenderCellParams<any, number>) => `₹${params.value?.toLocaleString() ?? 0}`,
  },
  {
    field: "ticketSold",
    headerName: "Tickets Sold",
    flex: 0.5,
    type: "number",
  },
  {
    field: "ticketLeft",
    headerName: "Tickets Left",
    flex: 0.5,
    type: "number",
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, string>) => {
      if (!params.value) return "N/A";
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: "endDate",
    headerName: "End Date",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, string>) => {
      if (!params.value) return "N/A";
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.5,
    // --- THIS IS THE UPDATED PART ---
    renderCell: (params: GridRenderCellParams<any, boolean>) => (
        params.value ? (
            <span className="text-green-500 font-semibold">In Profit</span>
        ) : (
            <span className="text-red-500 font-semibold">In Loss</span>
        )
    ),
  },
];

const EventsPage = () => {
  const { data: events, isError, isLoading } = useGetEventsQuery();

  if (isLoading) {
    return <div className="p-4">Loading events...</div>;
  }

  if (isError || !events) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to fetch events. Please try again later.
      </div>
    );
  }

  return (
    <div className="ml-2 md:ml-6 xl:ml-12 flex flex-col p-4">
      <Header name="Event Catalog" subtitle="A list of all upcoming and past events" />

      <div style={{ height: '75vh', width: '100%' }} className="mt-5">
        <DataGrid
          rows={events}
          columns={columns}
          getRowId={(row) => row.eventId} 
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700" 
        />
      </div>
    </div>
  );
};

export default EventsPage;