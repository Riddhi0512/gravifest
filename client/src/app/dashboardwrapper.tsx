"use client";
import React from "react";
import Navbar from "./(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import StoreProvider from "@/app/redux";
import { useAppSelector } from "@/app/redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  return (
    <div className="light flex bg-gray-200 text-black w-full min-h-screen">
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-slate-50 text-black transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
