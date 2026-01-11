"use client";

import React from 'react';
import { useGetUsersQuery } from "@/State/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { 
    field: "userId", 
    headerName: "ID", 
    flex: 0.5 
  },
  { 
    field: "name", 
    headerName: "Name", 
    flex: 1 
  },
  { 
    field: "email", 
    headerName: "Email", 
    flex: 1.5 
  },
  { 
    field: "gender", 
    headerName: "Gender", 
    flex: 0.5 
  },
  { 
    field: "phoneNumber", 
    headerName: "Phone Number", 
    flex: 1 
  },
  { 
    field: "userType", 
    headerName: "Type", 
    flex: 1 
  },
  { 
    field: "apparId", 
    headerName: "APPAR ID Status", 
    flex: 1, 
    // --- UPDATED RENDERCELL LOGIC HERE ---
    renderCell: (params: GridRenderCellParams<any, string>) => {
      // Check if the apparId value is truthy (exists)
      const hasApparId = !!params.value; 

      return (
        <span 
          className={hasApparId ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}
        >
          {hasApparId ? "Submitted" : "Pending"}
        </span>
      );
    },
    // ------------------------------------
  },
];

const Users = () => {
  const { data: users, isError, isLoading } = useGetUsersQuery();

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (isError || !users) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to fetch users. Please try again later.
      </div>
    );
  }

  return (
    <div className="ml-2 md:ml-6 xl:ml-12 flex flex-col p-4">
      <Header name="Users" subtitle="A list of all registered users" />
      
      <div style={{ height: '75vh', width: '100%' }} className="mt-5">
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        />
      </div>
    </div>
  );
};

export default Users;