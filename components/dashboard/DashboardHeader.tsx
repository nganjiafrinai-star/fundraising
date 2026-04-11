'use client';

import React from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  actions?: React.ReactNode;
}

export const DashboardHeader = ({ 
  title, 
  subtitle, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  actions 
}: DashboardHeaderProps) => {
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 text-blue-600">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-lg font-black tracking-tighter">Admin</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-2 text-slate-500 bg-slate-50 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-10">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-3 w-full sm:w-auto">{actions}</div>}
      </header>
    </>
  );
};
