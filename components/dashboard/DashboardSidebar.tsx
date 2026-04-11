'use client';

import React from 'react';
import { LogOut, Zap, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui';

interface SidebarProps {
  user: { name: string; role: string; char?: string };
  links: { 
    id: string; 
    label: string; 
    icon: React.ReactNode; 
    onClick: () => void;
    isActive: boolean;
  }[];
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  variant?: 'admin' | 'volunteer';
}

export const DashboardSidebar = ({ 
  user, 
  links, 
  onLogout, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  variant = 'volunteer'
}: SidebarProps) => {
  return (
    <>
      {/* Sidebar (Desktop & Mobile) */}
      <aside className={`
        fixed inset-0 z-40 md:sticky md:top-0 md:h-screen
        w-64 bg-white border-r border-slate-100 flex flex-col
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${variant === 'admin' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
              {variant === 'admin' ? <LayoutDashboard className="w-5 h-5" /> : <Zap className="w-5 h-5 fill-current" />}
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              {variant === 'admin' ? 'Admin Panel' : 'TTN Connect'}
            </span>
          </div>
          
          <nav className="space-y-1">
            {links.map((link) => (
              <button 
                key={link.id}
                onClick={link.onClick}
                className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg font-bold transition-all ${
                  link.isActive 
                    ? (variant === 'admin' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600')
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${variant === 'admin' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                {user.char || user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-slate-800 truncate text-sm">{user.name}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${variant === 'admin' ? 'text-blue-600' : 'text-indigo-600'}`}>
                  {user.role}
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg font-bold transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Sidebar Backdrop Mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
