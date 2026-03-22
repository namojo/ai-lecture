"use client";

import { useState, createContext, useContext, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const SidebarContext = createContext<{
  open: boolean;
  toggle: () => void;
}>({ open: false, toggle: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((p) => !p), []);

  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      <Header />

      {/* Mobile sidebar toggle */}
      <button
        onClick={toggle}
        className="fixed top-[62px] left-4 z-40 md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--border-color)]"
        aria-label="Toggle sidebar"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar: hidden on mobile unless open */}
      <div
        className={`
          fixed left-0 top-14 bottom-0 z-40 w-[280px]
          transition-transform duration-200
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </div>

      <main className="md:ml-[280px] mt-14 min-h-[calc(100vh-56px)]">
        {children}
      </main>
    </SidebarContext.Provider>
  );
}
