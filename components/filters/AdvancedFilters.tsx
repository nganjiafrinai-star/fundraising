'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: {
    channel: string;
    minAmount: string;
    maxAmount: string;
  };
  setFilters: (filters: any) => void;
  onReset: () => void;
}

export const AdvancedFilters = ({ filters, setFilters, onReset }: AdvancedFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border border-slate-100">
      <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mr-2">
        <Filter className="w-4 h-4" />
        <span>Filtres</span>
      </div>

      <select
        value={filters.channel}
        onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/50"
      >
        <option value="">Tous les canaux</option>
        <option value="Direct">Direct</option>
        <option value="Réseaux Sociaux">Réseaux Sociaux</option>
        <option value="Email">Email</option>
        <option value="Téléphone">Téléphone</option>
      </select>

      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min BIF"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
          className="w-24 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/50"
        />
        <span className="text-slate-300">-</span>
        <input
          type="number"
          placeholder="Max BIF"
          value={filters.maxAmount}
          onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
          className="w-24 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/50"
        />
      </div>

      <button
        onClick={onReset}
        className="ml-auto flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-indigo-600 transition-colors text-[10px] font-black uppercase tracking-widest"
      >
        <RotateCcw className="w-4 h-4" />
        Réinitialiser
      </button>
    </div>
  );
};
