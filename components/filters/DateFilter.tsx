'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  onFilterChange: (period: 'today' | 'week' | 'month' | 'all') => void;
  activePeriod: string;
}

export const DateFilter = ({ onFilterChange, activePeriod }: DateFilterProps) => {
  const options = [
    { label: 'Aujourd\'hui', value: 'today' },
    { label: 'Cette Semaine', value: 'week' },
    { label: 'Ce Mois', value: 'month' },
    { label: 'Tout', value: 'all' },
  ];

  return (
    <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onFilterChange(opt.value as any)}
          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all flex items-center gap-2 whitespace-nowrap ${
            activePeriod === opt.value 
              ? 'bg-white text-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {activePeriod === opt.value && <Calendar className="w-3 h-3" />}
          {opt.label}
        </button>
      ))}
    </div>
  );
};
