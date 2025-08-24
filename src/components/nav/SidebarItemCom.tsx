"use client";
import { NavLink } from "react-router-dom";

export default function SidebarItemCom() {
  return (
    <NavLink
      to="/crm"
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
    >
      <span className="font-medium">COM (CRM)</span>
    </NavLink>
  );
}