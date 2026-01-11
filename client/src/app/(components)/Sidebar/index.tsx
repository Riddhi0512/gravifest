"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/State";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  Ticket,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";


interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-blue-500 hover:bg-blue-400 gap-3 transition-colors ${
          isActive ? "bg-blue-400 text-white" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 text-white" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-white-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed =useAppSelector((state)=>state.global.isSidebarCollapsed);

    const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-cyan-950 transition-all duration-300 overflow-hidden h-full shadow-md z-40`;
  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO  */}
    <div className={`flex gap-3 justify-between md:justify-normal text-white items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`} >
      <Image
        src={`/assets/logo.svg`}
        alt="gravifeast"
        width={400}
        height={200}
        />
      <h1 className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}>
          GRAVIFEST
        </h1>
    
    <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100 text-black" onClick={toggleSidebar}>
            <Menu className="w-4 h-4" />
    </button>
    </div>

    {/* Links */}
    <div className="flex-grow mt-8 text-white">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/catalog"
          icon={Archive}
          label="Event Catalog"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/events"
          icon={Clipboard}
          label="Events"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/registration"
          icon={Ticket}
          label="Registrations"
          isCollapsed={isSidebarCollapsed}
        />
        {/* <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />*/
        <SidebarLink
          href="/finance"
          icon={CircleDollarSign}
          label="Finance"
          isCollapsed={isSidebarCollapsed}
        /> }
      
    </div>
    {/* Footer */}
    <div>
      <p className="text-center text-xs text-gray-500">&copy; 2025 GraviFeast</p>

    </div>




    </div>

  )
}
 
export default Sidebar